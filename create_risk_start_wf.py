import time
import os
import json

from OPTest import OPTest
from OPTestAPIv2 import OPTestAPIv2


api = OPTestAPIv2('http://useast.services.cloud.techzone.ibm.com:31484/openpages/logon.jsp', 'OpenPagesAdministrator', 'OpenPagesAdministrator')

data = {}
with open('data.json', 'r') as d:
    data = json.load(d)

created = api.create_resource(object_json=data[0], return_created_object=True)
id = created['id']

ans = api.transition_workflow(object_id=id, wf_name='Issue Review Workflow', next_stage_name='Submit for review')
api.update_field(id, "OPSS-Iss:Additional Description", 'Low')
api.transition_workflow(id, 'Issue Review Workflow', 'Approve')
api.update_field(id, 'OPLC-Std:LCComment', 'Action Items Complete')
api.update_field_associate_object(id, 'child', 'SOXTask', [{"name": "OPSS-AI:Status", "value": {"name": "Closed"}}])
api.transition_workflow(id, 'Issue Review Workflow', 'Close')
