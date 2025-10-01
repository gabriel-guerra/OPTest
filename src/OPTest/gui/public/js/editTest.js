const mock_steps = [
    {
        "action_type": "create_object",
        "action_information": "Create SOXRisk Object",
        "additional_information": {
            "type_definition": 'SOXRisk', 
            "name": 'Test Workflow SOXRisk',
            "id": "",
            "description": 'Example Description', 
            "primary_parent_id": "10474",
            "fields_list": [
                {"OPSS-Rsk:Owner": "OpenPagesAdministrator"},
                {"OPSS-Risk-Qual:Inherent Impact": '1'}, 
                {"OPSS-Risk-Qual:Inherent Likelihood": '2'},
                {"OPSS-Risk-Qual:Residual Impact": '3'},
                {"OPSS-Risk-Qual:Residual Likelihood": '4'}
            ],
            "parents_list": [],
            "children_list": []
        }
    },
    {
        "action_type": "update_field",
        "action_information": "Update field in object",
        "additional_information": {
            "uuid": "uuid",
            "type_definition": 'SOXRisk', 
            "name": 'Test Workflow SOXRisk', 
            "description": 'Example Description', 
            "fields_list": [
                {"OPSS-Rsk:Owner": "OpenPagesAdministrator"},
                {"OPSS-Risk-Qual:Inherent Impact": '1'}, 
                {"OPSS-Risk-Qual:Inherent Likelihood": '2'},
                {"OPSS-Risk-Qual:Residual Impact": '3'},
                {"OPSS-Risk-Qual:Residual Likelihood": '4'}
            ],
        }
    },
    {
        "action_type": "update_field",
        "action_information": "Update field in object",
        "additional_information": {
            "uuid": "uuid",
            "type_definition": 'SOXRisk', 
            "name": 'Test Workflow SOXRisk', 
            "description": 'Example Description', 
            "fields_list": [
                {"OPSS-Rsk:Owner": "OpenPagesAdministrator"},
                {"OPSS-Risk-Qual:Inherent Impact": '1'}, 
                {"OPSS-Risk-Qual:Inherent Likelihood": '2'},
                {"OPSS-Risk-Qual:Residual Impact": '3'},
                {"OPSS-Risk-Qual:Residual Likelihood": '4'}
            ],
        }
    },
    {
        "action_type": "start_workflow",
        "action_information": "Start RCSA workflow",
        "additional_information": {
            "uuid": "uuid",
            "object_name": "Test Workflow SOXRisk",
            "workflow_name": 'RCSA', 
        }
    },
    {
        "action_type": "transition_workflow",
        "action_information": "Transition RCSA workflow",
        "additional_information": {
            "uuid": "uuid",
            "object_name": "Test Workflow SOXRisk",
            "workflow_name": 'RCSA', 
            "action_name": 'Test Workflow SOXRisk'
        }
    }
]

const operations = {}
getTestSteps()

function getTestSteps(){
    // const folderPath = document.getElementById('input-test-folder').value
    // const test = selectedTests()[0]
    // const steps = pywebview.api.get_test_steps(folderPath, test)
    const steps = mock_steps
    for (const step of steps){
        const uuid = crypto.randomUUID();
        operations[uuid] = step
    }
    buildTable()
}

function buildTable(){
    const table = document.getElementById('test-actions')
    for (const step in Object.values(operations)){
        const tableRow = createElement('tr')
        const actionType = createElement('td')
        const actionInformations = createElement('td')
        const details = createElement('td')
        
        actionType.innerHTML = step.action_type
        actionInformations.innerHTML = step.action_information
        details.innerHTML = "<button>Details</button>"
        alert(actionType.innerHTML)

        tableRow.appendChild(actionType)
        tableRow.appendChild(actionInformations)
        tableRow.appendChild(details)
        table.appendChild(tableRow)
    }
}

