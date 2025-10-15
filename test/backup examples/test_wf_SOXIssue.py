import os
from dotenv import load_dotenv
from OPTest import OPTestAPIv2
from OPTest import OPTestGRCObject
import unittest


def setUpModule():
    # Get environment variables
    load_dotenv()
    op_url = os.getenv("OP_URL")
    username = os.getenv("OP_USERNAME")
    password = os.getenv("OP_PASSWORD")
    
    # Example of API connected to an IBM virtual machine
    global api
    api = OPTestAPIv2(op_url, username, password)

def tearDownModule():
    pass


class TestIssueWorkflow(unittest.TestCase):
    def test_issue_review_workflow(self):
        # Create Object
        self.opt_object = OPTestGRCObject(
            api,
            'SOXIssue', 
            'OPT Object', 
            'Example Description', 
            3156,
            [
                ("OPSS-Iss:Priority", "High")
            ],
            [27699],
            [15713]
        )

        # Set some fields (also can be done on creation)
        self.opt_object.bulk_update_fields([
            ("OPSS-Iss:Additional Description", 'Low'), 
            ("OPSS-Iss:Issue Type", 'Scoping'), 
            ("OPSS-Iss:Issue Approver", 'OpenPagesAdministrator'),
            ("OPSS-Iss:Domain", ['Compliance', 'Technology', 'Operational'])
        ])

        # In this example, SOXIssue object has 'Issue Review Workflow' as autostart, so we don't need to start WF by code
        self.opt_object.transition_workflow('Submit for review')
        self.opt_object.transition_workflow('Approve')

        # Update single field
        self.opt_object.bulk_update_fields([('OPLC-Std:LCComment', 'Action Items Complete')])

        # Update field on associate objects - In this case, children
        self.opt_object.update_field_associate_objects('child', 'SOXTask', [("OPSS-AI:Status", "Closed")])

        # The command line before this one is a requirement to advance in WF
        self.opt_object.transition_workflow('Close')
        
        # Assert workflow is over
        self.assertEqual(self.opt_object.get_wf_instance(), None)

        # Start WF Again
        self.opt_object.start_workflow("Issue Review Workflow")

        # Assert workflow is started 
        self.assertNotEqual(self.opt_object.get_wf_instance(), None)

    # Must always be at the end for safe delete
    def tearDown(self):
        # Delete resource
        self.opt_object.delete()

if __name__ == '__main__':
    unittest.main()