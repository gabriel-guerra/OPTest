
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

class TestScriptTestWfSoxissueLoadExisting(unittest.TestCase):
    def test_test_wf_soxissue_load_existing(self):
        self.acme_iss_0002701 = OPTestGRCObject.load_existing_object(api, 'SOXIssue', 'ACME_ISS_0002701')
        self.acme_iss_0002701.bulk_update_fields([('OPSS-Iss:Priority', 'High')])
        self.acme_iss_0002701.add_association('child', [15713])
        self.acme_iss_0002701.bulk_update_fields([('OPSS-Iss:Additional Description', 'Low'), ('OPSS-Iss:Issue Type', 'Scoping'), ('OPSS-Iss:Issue Approver', 'OpenPagesAdministrator'), ('OPSS-Iss:Domain', ['Compliance', 'Technology', 'Operational'])])
        self.acme_iss_0002701.transition_workflow('Submit for review')
        self.acme_iss_0002701.transition_workflow('Approve')
        self.acme_iss_0002701.bulk_update_fields([('OPLC-Std:LCComment', 'Action Items Complete')])
        self.acme_iss_0002701.update_field_associate_objects('child', 'SOXTask', [])
        self.acme_iss_0002701.transition_workflow('Close')
        self.acme_iss_0002701.start_workflow('Issue Review Workflow')
        self.acme_iss_0002701.add_association('parent', [20392])

if __name__ == '__main__':
    unittest.main()