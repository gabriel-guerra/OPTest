from OPTestAPIv2 import OPTestAPIv2
from OPTestGRCObject import OPTestGRCObject

api = OPTestAPIv2('http://useast.services.cloud.techzone.ibm.com:45319/openpages/logon.jsp', 'OpenPagesAdministrator', 'OpenPagesAdministrator')

created = OPTestGRCObject(
    api,
    'SOXIssue', 
    'Name-Example', 
    'Example Description', 
    3156,
    [("OPSS-Iss:Status", "Closed")],
    [27699],
    [15713])

# created.update_field("OPSS-Iss:Additional Description", 'Low')
# created.update_field("OPSS-Iss:Issue Type", 'Scoping')
# created.update_field("OPSS-Iss:Issue Approver", 'OpenPagesAdministrator')
# created.update_field("OPSS-Iss:Domain", 'Compliance')
created.bulk_update_fields([
    ("OPSS-Iss:Additional Description", 'Low'), 
    ("OPSS-Iss:Issue Type", 'Scoping'), 
    ("OPSS-Iss:Issue Approver", 'OpenPagesAdministrator'),
    ("OPSS-Iss:Domain", 'Compliance')
])
created.transition_workflow(next_stage_name='Submit for review')
created.transition_workflow('Approve')
created.update_field('OPLC-Std:LCComment', 'Action Items Complete')
created.update_field_associate_objects('child', 'SOXTask', [("OPSS-AI:Status", "Closed")])
created.transition_workflow('Close')

# Start WF Again
created.start_workflow("Issue Review Workflow")
created.delete()
# created.update_field("OPSS-Iss:Additional Description", 'Low')
# created.update_field("OPSS-Iss:Issue Type", 'Scoping')
# created.update_field("OPSS-Iss:Issue Approver", 'OpenPagesAdministrator')
# created.update_field("OPSS-Iss:Domain", 'Compliance')
# created.transition_workflow(next_stage_name='Submit for review')
# created.transition_workflow('Approve')
# created.update_field('OPLC-Std:LCComment', 'Action Items Complete')
# created.update_field_associate_objects('child', 'SOXTask', [("OPSS-AI:Status", "Closed")])
# created.transition_workflow('Close')