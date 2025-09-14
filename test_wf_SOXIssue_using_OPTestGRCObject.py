from OPTestAPIv2 import OPTestAPIv2
from OPTestGRCObject import OPTestGRCObject

api = OPTestAPIv2('http://useast.services.cloud.techzone.ibm.com:45319/openpages/logon.jsp', 'OpenPagesAdministrator', 'OpenPagesAdministrator')

# Create Object
issue_object = OPTestGRCObject(
    api=api,
    type_definition='SOXIssue', 
    name='Name-Example', 
    description='Example Description', 
    primary_parent_id=3156,
    fields_list=[("OPSS-Iss:Status", "Closed")],
    parents_list=[27699],
    children_list=[15713]
)

# Set some fields (also can be done on creation)
issue_object.bulk_update_fields([
    ("OPSS-Iss:Additional Description", 'Low'), 
    ("OPSS-Iss:Issue Type", 'Scoping'), 
    ("OPSS-Iss:Issue Approver", 'OpenPagesAdministrator'),
    ("OPSS-Iss:Domain", 'Compliance')
])

# In this example, SOXIssue object has 'Issue Review Workflow' as autostart, so we don't need to start WF by code
issue_object.transition_workflow(next_stage_name='Submit for review')
issue_object.transition_workflow('Approve')

# Update single field
issue_object.update_field('OPLC-Std:LCComment', 'Action Items Complete')

# Update field on associate objects - In this case, children
issue_object.update_field_associate_objects('child', 'SOXTask', [("OPSS-AI:Status", "Closed")])

# The command line before this one is a requirement to advance in WF
issue_object.transition_workflow('Close')

# Start WF Again
issue_object.start_workflow("Issue Review Workflow")

# Delete resource
issue_object.delete()