import os
import base64
import inspect
from urllib.parse import urlparse
from urllib3.util.retry import Retry
import requests
from requests.adapters import HTTPAdapter
from .utils import log_info, log_response, log_caller_file

def generate_base64(user, password):
    credenciais = f"{user}:{password}"
    credenciais_bytes = credenciais.encode("utf-8")
    return base64.b64encode(credenciais_bytes).decode("utf-8")

TIMEOUT = 10

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

        # Logging test script name
        caller_frame = inspect.stack()[1]
        caller_file = os.path.basename(caller_frame.filename)
        log_caller_file(caller_file)


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
    
    def _req_type_definition(self, type_definition):
        try:
            res = self.session.get(f'{self.base_url}/types/{type_definition}', headers=self.headers, timeout=TIMEOUT, verify=False)
            return res.json()
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

    def _req_wf_instace_by_name(self, object_id, wf_name):
        limit = 100_000
        res = self.session.get(f'{self.base_url}/workflows/instances/search?workflow={wf_name}&limit={limit}', headers=self.headers, timeout=TIMEOUT, verify=False)
        instances = res.json()['activity_instances']
        for inst in instances:
            if inst['grc_object']['id'] == object_id:
                return inst
        return None
    
    def _req_wf_instace_by_type_definition(self, object_id, type_definition):
        limit = 100_000
        res = self.session.get(f'{self.base_url}/workflows/instances/search?type_definition={type_definition}&limit={limit}', headers=self.headers, timeout=TIMEOUT, verify=False)
        instances = res.json()['activity_instances']
        for inst in instances:
            if inst['grc_object']['id'] == object_id:
                return inst
        return None
    
    def _req_wf_definition_by_name(self, wf_name):
        res = self.session.get(f'{self.base_url}/workflows/definitions', headers=self.headers, timeout=TIMEOUT, verify=False)
        definitions = res.json()['definitions']
        for definition in definitions:
            if definition['name'] == wf_name:
                return definition
        return None

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
    
    def _req_query(self, query):
        try:
            res = self.session.get(f'{self.base_url}/query?q="{query}"')
            log_response(res, 200)
            return res.json()
        except Exception as e:
            print(f'Error creating resource: {e}')

    ###
    ##
    # Available
    def create_resource_json(self, object, return_created_object=False):
        op_payload = self._op_payload_creation(object)
        return self.create_resource(op_payload, return_created_object)    

    def create_resource(self, object_json, return_created_object=False):
        log_info('Creating resource')
        try:
            res = self.session.post(f'{self.base_url}/contents', json=object_json, headers=self.headers, timeout=TIMEOUT, verify=False)
            log_response(res, 201)
            created = res.json()
            
            self.create_associations('parent', created['id'], object_json['parents'])
            self.create_associations('child', created['id'], object_json['children'])
            
            if return_created_object:
                return created
        except Exception as e:
            print(f'Error creating resource: {e}')

        return
    
    def transition_workflow(self, instance_id, action_name):
        log_info(f"Transitioning WF to {action_name}")
        res = self.session.post(f"{self.base_url}/workflows/instances/{instance_id}/transition/{action_name}")
        log_response(res, 200)

    def update_resource(self, id, object_json, return_updated_object=False):
        try:
            res = self.session.put(f'{self.base_url}/contents/{id}', json=object_json, headers=self.headers, timeout=TIMEOUT, verify=False)
            log_response(res, 200)
            updated = res.json()
            if return_updated_object:
                return updated
        except Exception as e:
            print(f'Error creating resource: {e}')

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
                res = self.session.post(f"{self.base_url}/contents/{id}/associations/{association_type}{'s' if association_type.lower() == 'parent' else 'ren'}", json=payload, headers=self.headers, timeout=TIMEOUT, verify=False)
                log_response(res, 202)
            except Exception as e: 
                print(f'{e}')
        return
    
    def update_field_associate_objects(self, starting_object_id, object_name, association_type, associate_object_type, fields_list):
        associations = self._req_associations(starting_object_id, association_type, associate_object_type)
        for association in associations:
            name = self._req_objectName_by_id(association['id'])
            payload = {
                'name': name,
                "fields": fields_list
            }
            res = self.session.put(f"{self.base_url}/contents/{association['id']}", json=payload, headers=self.headers, timeout=TIMEOUT, verify=False)
            log_response(res, 200)

    def start_workflow(self, wf_name, object_id):
        log_info(f"Starting WF {wf_name} at object {object_id}")
        wf_definition = self._req_wf_definition_by_name(wf_name)
        res = self.session.post(f"{self.base_url}/workflows/definitions/{wf_definition['id']}/start/{object_id}", headers=self.headers, timeout=TIMEOUT, verify=False)
        log_response(res, 200)

    def delete_resource(self, object_id):
        log_info(f"Deleting object {object_id}")
        res = self.session.delete(f"{self.base_url}/contents/{object_id}", headers=self.headers, timeout=TIMEOUT, verify=False)
        log_response(res, 204)