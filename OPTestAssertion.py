class OPTestAsssertion:

    # WORKFLOW
    def assert_workflow_active(self, opTestGRCObject):
        assert opTestGRCObject.wf_active_instance() is not None
    
    def assert_workflow_name(self, opTestGRCObject, wf_name):
        assert opTestGRCObject.get_wf_name() == wf_name

    def assert_workflow_in_stage(self, opTestGRCObject, stage_name):
        assert opTestGRCObject.get_wf_stage() == stage_name

    def assert_workflow_stage_assignee(self, opTestGRCObject, assignee):
        assert opTestGRCObject.wf_assignee() == assignee
    
    def assert_workflow_stage_subscriber():
        pass

    def assert_workflow_oversight():
        pass

    def assert_workflow_aplicability():
        pass

    def assert_workflow_overall_due_date(self, opTestGRCObject, due_date):
        assert opTestGRCObject.get_wf_overall_due_date() == due_date
    
    def assert_workflow_stage_due_date(self, opTestGRCObject, due_date):
        assert opTestGRCObject.get_wf_stage_due_date() == due_date

    def assert_workflow_status(self, opTestGRCObject, status):
        assert opTestGRCObject.get_wf_status() == status

    # FIELD
    def assert_field_filled(self, opTestGRCObject, field):
        assert opTestGRCObject.is_field_filled(field) 

    def assert_field_value(self, opTestGRCObject, field, value):
        pass
        
    def field_in_profile():
        pass

    def field_in_view():
        pass

    