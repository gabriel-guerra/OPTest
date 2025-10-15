import os
from dotenv import load_dotenv
from OPTest import OPTestAPIv2
from OPTest import OPTestGRCObject
import unittest


def setUpModule():
    op_url = os.environ['OP_URL']
    username = os.environ['OP_USERNAME']
    password = os.environ['OP_PASSWORD']
        
    # Example of API connected to an IBM virtual machine
    global api
    api = OPTestAPIv2(op_url, username, password)

def tearDownModule():
    pass


class TestRiskWorkflow(unittest.TestCase):
    # @unittest.skip("RiskEval auto-naming for new objects must be turned on")
    def test_RCSA_workflow(self):

        # If this test fails due to the following error:
        # {
        #       'status_code': '500', 
        #       'errors': [
        #           {
        #               'code': '-8575', 
        #               'message': 'Internal Server Error - OP-08575: createObject operation on action Assessment Complete failed to create object [NULL]. [WQEFXBB8DG18]'
        #           }
        #       ]
        # }
        ### Turn on auto-naming for RiskEval object. More info at https://www.ibm.com/docs/en/openpages/9.0.0?topic=settings-object-auto-naming

        # Create Object
        self.opt_object = OPTestGRCObject(
            api,
            'SOXRisk', 
            'OPT Object', 
            'Example Description', 
            10474,
            [
                ("OPSS-Rsk:Owner", "OpenPagesAdministrator")
            ],
            [],
            []
        )

        # Start RCSA Workflow
        self.opt_object.start_workflow("RCSA")

        # Set some fields (also can be done on creation)
        self.opt_object.bulk_update_fields([
            ("OPSS-Risk-Qual:Inherent Impact", '1'), 
            ("OPSS-Risk-Qual:Inherent Likelihood", '2'),
            ("OPSS-Risk-Qual:Residual Impact", '3'),
            ("OPSS-Risk-Qual:Residual Likelihood", '4')
        ])

        # Transition to complete assessment
        self.opt_object.transition_workflow(action_name='Assessment Complete')
        
        # Assert workflow is over
        self.assertEqual(self.opt_object.get_wf_instance(), None)

        # Get Risk Rating fields
        inherent_risk_rating = self.opt_object.get_field_value('OPSS-Risk-Qual:Inherent Risk Rating')
        residual_risk_rating = self.opt_object.get_field_value('OPSS-Risk-Qual:Residual Risk Rating')

        # Check values after operation
        self.assertEqual(inherent_risk_rating, 'Low')
        self.assertEqual(residual_risk_rating, 'Very High')

    def tearDown(self):
        # Delete resource
        self.opt_object.delete()    #safe_delete

if __name__ == '__main__':
    unittest.main()