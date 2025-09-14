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
        self.workflow = self.is_wf_active()


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
    def is_wf_active(self):
        return self.api._req_wf_instace_by_type_definition(self.id, self.type_definition)
    
    def start_workflow(self, wf_name):
        self.api.start_workflow(wf_name, self.id)

    def transition_workflow(self, next_stage_name):
        self.api.transition_workflow(self.workflow['id'], next_stage_name)
    

    # Fields
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