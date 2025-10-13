
import os
from dotenv import load_dotenv
from OPTest import OPTestAPIv2
from OPTest import OPTestGRCObject
import unittest
from pathlib import Path

def setUpModule():
    op_url = os.environ['OP_URL']
    username = os.environ['OP_USERNAME']
    password = os.environ['OP_PASSWORD']
    
    global api
    api = OPTestAPIv2(op_url, username, password)

def tearDownModule():
    pass


class TestScriptTestWfSoxissue(unittest.TestCase):
    def test_test_wf_soxissue(self):
        self.opt_object = OPTestGRCObject(api, 'SOXIssue', 'OPT Object', 'Example Description', 3156, [('OPSS-Iss:Priority', 'High')], [], [])
        self.opt_object.bulk_update_fields([('OPSS-Iss:Additional Description', 'Low'), ('OPSS-Iss:Issue Type', 'Scoping'), ('OPSS-Iss:Issue Approver', 'OpenPagesAdministrator'), ('OPSS-Iss:Domain', ['Compliance', 'Technology', 'Operational'])])
        self.opt_object.transition_workflow('Submit for review')
        self.opt_object.transition_workflow('Approve')
        self.opt_object.bulk_update_fields([('OPLC-Std:LCComment', 'Action Items Complete')])
        self.opt_object.update_field_associate_objects('child', 'SOXTask', [('OPSS-AI:Status', 'Closed')])
        self.name_example = OPTestGRCObject(api, 'SOXIssue', 'Name_Example', 'a', 312, [('a', 'a')], [], [])
        self.opt_object.bulk_update_fields([('a', 'a')])
        self.opt_object.delete()
        self.opt_object.delete()
        self.opt_object.delete()

    def tearDown(self):
        self.opt_object.delete()
        self.name_example.delete()
