import http.client
import base64
import json
from urllib.parse import urlparse
from urllib3.util.retry import Retry
import requests
from requests.adapters import HTTPAdapter

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
            print('Testing connection:')
            res = self.session.get(f'{self.base_url}/types', headers=self.headers, timeout=TIMEOUT, verify=False)
            print(res)
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
    
    def create_resource(self, user_payload, return_object=False):
        op_payload = self._op_payload_creation(user_payload)
        payload_bytes = json.dumps(op_payload).encode("utf-8")
        
        print('Creating resource')
        try:
            res = self.session.post(f'{self.base_url}/contents', data=payload_bytes, headers=self.headers, timeout=TIMEOUT, verify=False)
            print(res.status_code)
            created = res.json()
            
            self._create_associations('parent', created['id'], user_payload['parents'])
            self._create_associations('child', created['id'], user_payload['children'])
            
            if return_object:
                return created
        except Exception as e:
            print(f'Error creating resource: {e}')
        
        return
    
    def _req_objectId_by_name(self, object_type, name):
        try:
            query = f"SELECT [Resource ID] FROM [{object_type}] WHERE [Name] = \'{name}\'"
            res = self.session.get(f'{self.base_url}/query?q={query}').json()
            return int(res['rows'][0]['fields'][0]['value'])
        except Exception as e:
            print(f'Error while querying: {e}')

    def _create_associations(self, association_type, id, objects):
        print(f'Creating associations: {association_type}')
        for obj in objects:
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
                print(f'Status {res.status_code} {res.json() if res.status_code != 202 else ''}')
            except Exception as e: 
                print(f'{e}')
        return
        