import http.client
import base64
import json
from urllib.parse import urlparse
from urllib3.util.retry import Retry
import requests
from requests.adapters import HTTPAdapter
from utils import log_info, log_response

def generate_base64(user, password):
    credenciais = f"{user}:{password}"
    credenciais_bytes = credenciais.encode("utf-8")
    return base64.b64encode(credenciais_bytes).decode("utf-8")

TIMEOUT = 5

class OPTestAPIv2():
    def __init__(self, url, username, password):
        self.server_name = urlparse(url).netloc
        self.base_path = '/opgrc/api/v2'
        self.session = requests.Session()
        if url[:5] != 'https':
            self.protocol = 'http://'
        else:
            self.protocol = 'https://'
        self.base_url = f'{self.protocol}{self.server_name}{self.base_path}'
        self.headers = {
            'Authorization': f"Basic {generate_base64(username, password)}",
            'content-type': "application/json",
            'accept': "application/json"
        }

        ## Timeout and Retry strategies
        retries = Retry(
            total=3,             
            backoff_factor=1,    
            status_forcelist=[]
        )
        adapter = HTTPAdapter(max_retries=retries)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)

        ## Test request
        self._warmup_request()
    


    ###
    ## 
    # Support methods

    def _warmup_request(self):
        try:
            log_info('Testing connection:')
            res = self.session.get(f'{self.base_url}/types', headers=self.headers, timeout=TIMEOUT, verify=False)
            log_response(res, 200)
        except Exception as e:
            print(f'Failed to connect to server: {e}')

    def _op_payload_creation(self, payload):
        op_payload = {
            "name": f"{payload['name']}",
            "description": f"{payload['description']}",
            "type_definition_id": f"{payload['object_type']}",
            "primary_parent_id": f"{payload['primary_parent_id']}",
            "fields": payload['fields']
        }
        return op_payload
    
    def _req_objectId_by_name(self, object_type, name):
        try:
            query = f"SELECT [Resource ID] FROM [{object_type}] WHERE [Name] = \'{name}\'"
            res = self.session.get(f'{self.base_url}/query?q={query}').json()
            return int(res['rows'][0]['fields'][0]['value'])
        except Exception as e:
            print(f'Error while querying: {e}')

    
    def _req_wf_definition(self, object_type, wf_name):
        'it\'s working'
        pass
        # res = self.session.get(f'{self.base_url}/workflows/definitions?object_type={object_type}', headers=self.headers, timeout=TIMEOUT, verify=False)
        # obj_wfs = res.json()['definitions']
        # found_wf = {}
        # for wf in obj_wfs:
        #     if wf.name == wf_name:
        #         found_wf = wf
        #         break
        # 'http://useast.services.cloud.techzone.ibm.com:31484/opgrc/api/v2/workflows/definitions?object_type=SOXIssue'
        # 'http://useast.services.cloud.techzone.ibm.com:31484/opgrc/api/v2/workflows/definitions/1122'

    def _req_wf_instace(self, object_id, wf_name):
        limit = 100_000
        res = self.session.get(f'{self.base_url}/workflows/instances/search?workflow={wf_name}&limit={limit}', headers=self.headers, timeout=TIMEOUT, verify=False)
        instances = res.json()['activity_instances']
        for inst in instances:
            if inst['grc_object']['id'] == object_id:
                return inst
            
    def _req_objectName_by_id(self, object_id):
        res = self.session.get(f'{self.base_url}/contents/{object_id}')
        log_response(res, 200)
        return res.json()['name']
    
    def _req_associations(self, object_id, association_type, associate_object_type):
        res = {}
        if association_type.lower() in ['parent', 'parents']:
            res = self.session.get(f'{self.base_url}/contents/{object_id}/associations?association_type=parent', headers=self.headers, timeout=TIMEOUT, verify=False)
        elif association_type.lower() in ['child', 'children']:
            res = self.session.get(f'{self.base_url}/contents/{object_id}/associations?association_type=child', headers=self.headers, timeout=TIMEOUT, verify=False)
        else: 
            res = self.session.get(f'{self.base_url}/contents/{object_id}/associations', headers=self.headers, timeout=TIMEOUT, verify=False)
        associations = res.json()['associations']
        
        ## Check if ObjectType was informed
        response = self.session.get(f'{self.base_url}/types/{associate_object_type}')
        if response.status_code != 200:
            log_info(f'Object Type {associate_object_type} does not exist. Ignoring filter')
            return associations

        type_definition_id = response.json()['id']
        filtered_associations = []
        for association in associations:
            if association['type_definition_id'] == type_definition_id:
                filtered_associations.append(association)
        return filtered_associations

    ###
    ##
    # Available
    def create_resource(self, object_json, return_created_object=False):
        op_payload = self._op_payload_creation(object_json)
        payload_bytes = json.dumps(op_payload).encode("utf-8")
        
        log_info('Creating resource')
        try:
            res = self.session.post(f'{self.base_url}/contents', data=payload_bytes, headers=self.headers, timeout=TIMEOUT, verify=False)
            log_response(res, 201)
            created = res.json()
            
            self.create_associations('parent', created['id'], object_json['parents'])
            self.create_associations('child', created['id'], object_json['children'])
            
            if return_created_object:
                return created
        except Exception as e:
            print(f'Error creating resource: {e}')
        
        return
    
    def transition_workflow(self, object_id, wf_name, next_stage_name):
        log_info(f"Transitioning WF {wf_name} to {next_stage_name}")
        instance = self._req_wf_instace(object_id, wf_name)
        res = self.session.post(f'{self.base_url}/workflows/instances/{instance['id']}/transition/{next_stage_name}')
        log_response(res, 200)

    def update_field(self, object_id, field_name, field_value):
        fields = [
            {
            "name": f"{field_name}",
            "value": f'{field_value}'
            }
        ]
        self.bulk_update_field(object_id, fields)

    def bulk_update_field(self, object_id, field_list, only_one_request=False):
        if only_one_request:
            log_info('Updating bulk fields')
            payload = {
                'name': self._req_objectName_by_id(object_id),
                "fields": field_list
            }
            res = self.session.put(f'{self.base_url}/contents/{object_id}', json=payload, headers=self.headers, timeout=TIMEOUT, verify=False)
            log_response(res, 200)
        else:
            for field in field_list:
                log_info(f'Updating field {field['name']}')
                payload = {
                    'name': self._req_objectName_by_id(object_id),
                    "fields": [
                        {
                            "name": field['name'],
                            "value": field['value']
                        }
                    ],
                }
                res = self.session.put(f'{self.base_url}/contents/{object_id}', json=payload, headers=self.headers, timeout=TIMEOUT, verify=False)
                log_response(res, 200)

    def create_associations(self, association_type, id, objects_list):
        log_info(f'Creating associations: {association_type}')
        for obj in objects_list:
            ids = []
            if isinstance(obj, dict):
                ids.append(
                    {
                        "id": f"{self._req_objectId_by_name(obj['object_type'], obj['name'])}",
                        "type": association_type.lower()
                    }
                )
            else:
                ids.append(
                    {
                        "id": f"{obj}",
                        "type": association_type.lower()
                    }
                )
            payload = {"associations": ids}
            try:
                res = self.session.post(f'{self.base_url}/contents/{id}/associations/{association_type}{'s' if association_type.lower() == 'parent' else 'ren'}', json=payload, headers=self.headers, timeout=TIMEOUT, verify=False)
                log_response(res, 202)
            except Exception as e: 
                print(f'{e}')
        return
    
    def update_field_associate_object(self, starting_object_id, association_type, associate_object_type, fields_list):
        associations = self._req_associations(starting_object_id, association_type, associate_object_type)
        for association in associations:
            self.bulk_update_field(association['id'], fields_list)