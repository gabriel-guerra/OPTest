import os
import sys
import unittest

CLASSES_DIR = os.environ['CLASSES_DIR']
sys.path.append(CLASSES_DIR)

from OPTestAPIv2 import OPTestAPIv2
from OPTestGRCObject import OPTestGRCObject

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
        self.opt_object = OPTestGRCObject(api, 'SOXIssue', 'OPT Object', 'Example Description', 3156, [('OPSS-Iss:Priority', 'High')], [27699], [15713])
        self.opt_object.bulk_update_fields([('OPSS-Iss:Additional Description', 'Low'), ('OPSS-Iss:Issue Type', 'Scoping'), ('OPSS-Iss:Issue Approver', 'OpenPagesAdministrator'), ('OPSS-Iss:Domain', ['Compliance', 'Technology', 'Operational'])])
        self.opt_object.transition_workflow('Submit for review')
        self.opt_object.transition_workflow('Approve')
        self.opt_object.bulk_update_fields([('OPLC-Std:LCComment', 'Action Items Complete')])
        self.opt_object.update_field_associate_objects('child', 'SOXTask', [('OPSS-AI:Status', 'Closed')])
        self.opt_object.transition_workflow('Close')
        self.opt_object.start_workflow('Issue Review Workflow')

    def tearDown(self):
        self.opt_object.delete()     #safe_delete

if __name__ == '__main__':
    unittest.main()