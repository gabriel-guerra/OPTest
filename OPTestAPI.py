import http.client
import base64
import json
from urllib.parse import urlparse
import requests

TIMEOUT = 10

def generate_base64(user, password):
    credenciais = f"{user}:{password}"
    credenciais_bytes = credenciais.encode("utf-8")
    return base64.b64encode(credenciais_bytes).decode("utf-8")

class OPTestAPIv1():
    def __init__(self, url):
        self.server_name = urlparse(url).netloc
        self.base_path = '/grc/api'
        self.session = requests.Session()
        if url[:5] != 'https':
            self.protocol = 'http://'
        else:
            self.protocol = 'https://'
        self.base_url = f'{self.protocol}{self.server_name}{self.base_path}'

    def set_credentials(self, username, password):
        self.headers = {
            'Authorization': f"Basic {generate_base64(username, password)}",
            'content-type': "application/json",
            'accept': "application/json"
        }
        self._warmup_request()
    
    def _warmup_request(self):
        try:
            print('Testing connection:')
            res = self.session.get(f'{self.base_url}/types', headers=self.headers, timeout=TIMEOUT, verify=False)
            print(res)
        except:
            print('Failed to connect to server.')

    def _request_all_object_types(self):
        print('req-ing all objects')
        res = self.session.get(f'{self.base_url}/types', headers=self.headers, timeout=TIMEOUT, verify=False)
        return res.json()
    
    def _request_object_types_by_id(self, object_type_id):
        print('req-ing by id')
        res = self.session.get(f'{self.base_url}/types/{object_type_id}', headers=self.headers, timeout=TIMEOUT, verify=False)
        return res.json()

    def _get_object_type_by_name(self, object_name):
        types_list = self._request_all_object_types()
        for typ in types_list:
            if typ['name'] == object_name:
                return typ
        raise Exception('Object Type not found')
    
    def _get_GRC_object_by_id(self, id):
        return self.session.get(f"{self.base_url}/contents/{id}").json()
    
    def _get_object_type_field(self, object_type_id, field_name):
        type = self._request_object_types_by_id(object_type_id)
        for field in type['fieldDefinitions']['fieldDefinition']:
            if field['name'] == field_name:
                return field
        raise Exception('Field not found')
        
    def _format_string_field(self, object_type_id, field_payload):
        field = self._get_object_type_field(object_type_id, field_payload['name'])
        field_formatter = {
            "id": f"{field['id']}",
            "dataType": f"{field['dataType']}",
            "name": f"{field['name']}",
            "hasChanged": False,
            "value": f"{field_payload['value']}"
        }
        return field_formatter
    
    def _format_enum_field(self, object_type_id, field_payload):
        field = self._get_object_type_field(object_type_id, field_payload['name'])
        enum_value = None
        enum_list = field['enumValues']['enumValue']
        for enum_option in enum_list:
            if enum_option['name'] == field_payload['value']:
                enum_value = enum_option
        field_formatter = {
            "id": f"{field['id']}",
            "dataType": f"{field['dataType']}",
            "name": f"{field['name']}",
            "hasChanged": False,
            "enumValue": enum_value
        }
        return field_formatter

    def _op_payload_config(self, payload):
        object_type_id = self._get_object_type_by_name(payload['objectType'])['id']
        fields_list = []
        for field in payload['fields']:
            if field['isEnum']:
                fields_list.append(self._format_enum_field(object_type_id, field))
            else:
                fields_list.append(self._format_string_field(object_type_id, field))
        op_payload = {
            "name": f"{payload['name']}",
            "description": f"{payload['description']}",
            "typeDefinitionId": f"{object_type_id}",
            "primaryParentId": f"{payload['primaryParentId']}",
            "fields": {
                "field": fields_list
            }
        }
        return op_payload

    def create_resource(self, user_payload):
        op_payload = self._op_payload_config(user_payload)
        payload_bytes = json.dumps(op_payload).encode("utf-8")
        print('creating reg')
        res = self.session.post(f'{self.base_url}/contents', data=payload_bytes, headers=self.headers, timeout=TIMEOUT, verify=False)
        created = res.json()
        print(created['id'])
        self._create_parent_associations(created['id'], user_payload['parentAssociationsIds'])

    def _create_parent_associations(self, id, parents_ids):
        formatted_parents = []
        for id in parents_ids:
            obj = self._get_GRC_object_by_id(id)
            json_obj = {
                "id": f"{id}",
                "typeDefinitionId": f"{obj['typeDefinitionId']}",
                "path": f"{obj['path']}",
                "type": "PARENT"
            }
            formatted_parents.append(json_obj)
        res = self.session.post(f'{self.base_url}/contents/{id}/associations', json=formatted_parents, headers=self.headers, timeout=TIMEOUT, verify=False)
        print(res.json())