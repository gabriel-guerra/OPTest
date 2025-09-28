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
    @classmethod
    def setUpClass(cls):
        # Create Object
        cls.issue_object = OPTestGRCObject(
            api=api,
            type_definition='SOXIssue', 
            name='Name-Example', 
            description='Example Description', 
            primary_parent_id=3156,
            fields_list=[("OPSS-Iss:Status", "Closed")],
            parents_list=[27699],
            children_list=[15713]
        )
        return super().setUpClass()

    @classmethod
    def tearDownClass(cls):
        # Delete resource
        cls.issue_object.delete()
        return super().tearDownClass()

    def test_issue_review_workflow(self):
        # Set some fields (also can be done on creation)
        self.issue_object.bulk_update_fields([
            ("OPSS-Iss:Additional Description", 'Low'), 
            ("OPSS-Iss:Issue Type", 'Scoping'), 
            ("OPSS-Iss:Issue Approver", 'OpenPagesAdministrator'),
            ("OPSS-Iss:Domain", ['Compliance', 'Technology', 'Operational'])
        ])

        # In this example, SOXIssue object has 'Issue Review Workflow' as autostart, so we don't need to start WF by code
        self.issue_object.transition_workflow(next_stage_name='Submit for review')
        self.issue_object.transition_workflow('Approve')

        # Update single field
        self.issue_object.update_field('OPLC-Std:LCComment', 'Action Items Complete')

        # Update field on associate objects - In this case, children
        self.issue_object.update_field_associate_objects('child', 'SOXTask', [("OPSS-AI:Status", "Closed")])

        # The command line before this one is a requirement to advance in WF
        self.issue_object.transition_workflow('Close')
        
        # Assert workflow is over
        self.assertEqual(self.issue_object.get_wf_instance(), None)

        # Start WF Again
        self.issue_object.start_workflow("Issue Review Workflow")

        # Assert workflow is started 
        self.assertNotEqual(self.issue_object.get_wf_instance(), None)

if __name__ == '__main__':
    unittest.main()