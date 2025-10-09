
import os
from dotenv import load_dotenv
from OPTest import OPTestAPIv2
from OPTest import OPTestGRCObject
import unittest

def setUpModule():
    load_dotenv()
    op_url = os.getenv("OP_URL")
    username = os.getenv("OP_USERNAME")
    password = os.getenv("OP_PASSWORD")
    
    global api
    api = OPTestAPIv2(op_url, username, password)

def tearDownModule():
    pass


class TestScriptExample(unittest.TestCase):
    def test_example(self):
        self.example = OPTestGRCObject(api, 'SOXIssue', 'example', 'ex', 3156, [('OPSS-Iss:Priority', 'High')], [27699], [15713])
        self.example.bulk_update_fields([('OPSS-Iss:Additional Description', 'Low'), ('OPSS-Iss:Issue Type', 'Scoping'), ('OPSS-Iss:Issue Approver', 'OpenPagesAdministrator'), ('OPSS-Iss:Domain', 'Compliance')])
        self.example.transition_workflow('Submit for review')
        self.example.transition_workflow('Approve')
        self.example.bulk_update_fields([('OPLC-Std:LCComment', 'Action Items Complete')])
        self.example.update_field_associate_objects('child', 'SOXTask', [('OPSS-AI:Status', 'Closed')])
        self.example.transition_workflow('Close')
        self.example.start_workflow('Issue Review Workflow')
        self.example.delete()
