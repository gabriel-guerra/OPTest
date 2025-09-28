class OPTestGRCObject:
    def __init__(self, api, type_definition, name, description, primary_parent_id, fields_list, parents_list, children_list):
        self.api = api
        self.name = name
        self.description = description
        self.type_definition = type_definition
        self.primary_parent_id = primary_parent_id
        self.parents = parents_list
        self.children = children_list
        self.GRC_definition = self.api._req_type_definition(self.type_definition)
        first_payload = {
            "name": f"{self.name}",
            "description": f"{self.description}",
            "type_definition_id": f"{self.GRC_definition['id']}",
            "primary_parent_id": f"{self.primary_parent_id}",
            "fields": self.parse_fields(self.type_definition, fields_list),
            "parents": self.parents,
            "children": self.children
        }
        self.op_json = self.api.create_resource(first_payload, return_created_object=True)
        self.id = self.op_json['id']
        self.workflow = self.get_wf_instance()


    # CRUD
    def update_field(self, name, value):
        formatted_value = self.setup_field(self.type_definition, name, value)
        payload = {
            "name": f"{self.name}",
            "description": f"{self.description}",
            "type_definition_id": f"{self.GRC_definition['id']}",
            "fields": [formatted_value],
        }
        self.api.update_resource(self.id, payload, return_updated_object=True)
    
    def bulk_update_fields(self, field_list):
        formatted_value = self.parse_fields(self.type_definition, field_list)
        payload = {
            "name": f"{self.name}",
            "description": f"{self.description}",
            "type_definition_id": f"{self.GRC_definition['id']}",
            "fields": formatted_value,
        }
        self.api.update_resource(self.id, payload, return_updated_object=True)

    def update_field_associate_objects(self, association_type, associate_object_type, fields_list):
        op_fields = self.parse_fields(associate_object_type, fields_list)
        self.api.update_field_associate_objects(self.id, self.name, association_type, associate_object_type, op_fields)

    def delete(self):
        self.api.delete_resource(self.id)


    # Workflow 
    def get_wf_instance(self):
        return self.api._req_wf_instace_by_type_definition(self.id, self.type_definition)
    
    def start_workflow(self, wf_name):
        self.api.start_workflow(wf_name, self.id)

    def transition_workflow(self, next_stage_name):
        self.api.transition_workflow(self.workflow['id'], next_stage_name)

    def get_wf_name(self):
        instance = self.get_wf_instance()
        if instance is None:
            return None
        return instance['workflow']['name']

    def get_wf_state(self):
        instance = self.get_wf_instance()
        if instance is None:
            return None
        return instance['workflow']['activity']['name']
    
    def get_wf_assignees(self):
        instance = self.get_wf_instance()
        if instance is None:
            return None
        return instance['assignees']
    
    def get_wf_stage_due_date(self):
        instance = self.get_wf_instance()
        if instance is None:
            return None
        return instance['due_date']

    def get_wf_overall_due_date(self):
        instance = self.get_wf_instance()
        if instance is None:
            return None
        return instance['process_due_date']
    
    def get_wf_status(self):
        instance = self.get_wf_instance()
        if instance is None:
            return None
        return instance['status']

    # Fields - Check information
    def is_field_filled(self, field):
        query = f"SELECT [{field}] FROM [{self.type_definition}] WHERE [Resource ID] = '{self.id}'"
        response_rows = self.api._req_query(query)['rows']
        for row in response_rows:
            field_found = row['fields'][0]
            if 'value' not in field_found.keys() and 'values' not in field_found.keys():
                return False
        return True
    
    def get_field_value(self, field):
        query = f"SELECT [{field}] FROM [{self.type_definition}] WHERE [Resource ID] = '{self.id}'"
        response_rows = self.api._req_query(query)['rows']
        for row in response_rows:
            field_found = row['fields'][0]
            if 'value' not in field_found.keys() and 'values' not in field_found.keys():
                return None
            else:
                if 'value' in field_found.keys():
                    return field_found['value']
                else:
                    all_values = []
                    for val in field_found['values']:
                        all_values.append(val['name'])
                    return all_values
    
    # Fields - Manipulation
    def parse_fields(self, type_definition, fields):
        op_fields = []
        for field in fields:
            op_fields.append(self.setup_field(type_definition, field[0], field[1]))
        return op_fields

    def find_data_type(self, type_definition, field_name):
        definitions = []
        if type_definition != self.type_definition:
            definitions = self.api._req_type_definition(type_definition)['field_definitions']
        else:
            definitions = self.GRC_definition['field_definitions']
        for field in definitions:
            if field['name'] == field_name:
                return field['data_type'] 
        return

    def setup_field(self, type_definition, name, value):
        type_field = self.find_data_type(type_definition, name)
        # types = ['INTEGER_TYPE', 'ENUM_TYPE', 'STRING_TYPE', 'ID_TYPE', 'DATE_TYPE', 'BOOLEAN_TYPE', 'MULTI_VALUE_ENUM', 'FLOAT_TYPE']

        if type_field == 'ENUM_TYPE':
            return {
                    "name": name,
                    "value": {
                        "name": value
                    }
                }
        elif type_field == 'MULTI_VALUE_ENUM':
            list_values = []
            if isinstance(value, list):
                for v in value:
                    list_values.append({"name": v})
            else: 
                list_values.append({"name": value})
            return {
                    "name": name,
                    "values": list_values
                }
        else:
            return {
                    "name": name,
                    "value": value
                }