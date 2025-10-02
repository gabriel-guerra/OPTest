const mock_steps = [
    {
        "object_reference_id": "REF798456123",
        "action_type": "create_object",
        "action_information": "Create SOXRisk Object",
        "additional_information": {
            "type_definition": 'SOXRisk', 
            "name": 'Test Workflow SOXRisk',
            "description": 'Example Description', 
            "primary_parent_id": "10474",
            "fields_list": [
                {"OPSS-Rsk:Owner": "OpenPagesAdministrator"},
                {"OPSS-Risk-Qual:Inherent Impact": '1'}, 
                {"OPSS-Risk-Qual:Inherent Likelihood": '2'},
                {"OPSS-Risk-Qual:Residual Impact": '3'},
                {"OPSS-Risk-Qual:Residual Likelihood": '4'}
            ],
            "parents_list": ["123", "456"],
            "children_list": ["789", '1111']
        }
    },
    {
        "object_reference_id": "REF798456123",
        "action_type": "update_field",
        "action_information": "Update field in object",
        "additional_information": {
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
        "object_reference_id": "REF798456123",
        "action_type": "start_workflow",
        "action_information": "Start RCSA workflow",
        "additional_information": {
            "object_name": "Test Workflow SOXRisk",
            "workflow_name": 'RCSA', 
        }
    },
    {
        "object_reference_id": "REF798456123",
        "action_type": "transition_workflow",
        "action_information": "Transition RCSA workflow",
        "additional_information": {
            "object_name": "Test Workflow SOXRisk",
            "workflow_name": 'RCSA', 
            "action_name": 'Test Workflow SOXRisk'
        }
    }
]

const operations = {}
getTestSteps()

document.querySelectorAll('form').forEach(form => {
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const action = event.submitter.value;
        if(action === "create_object") {
            saveCreateObjectData()
        }
    });
});


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
    for (const [key, value] of Object.entries(operations)){
        const tableRow = document.createElement('tr')
        const actionType = document.createElement('td')
        const actionInformations = document.createElement('td')
        const details = document.createElement('td')
        
        actionType.innerHTML = value.action_type
        actionInformations.innerHTML = value.action_information
        details.innerHTML = `<button onclick="getDetails(this)">Details</button>`
        
        tableRow.setAttribute("uuid", key)
        
        tableRow.appendChild(actionType)
        tableRow.appendChild(actionInformations)
        tableRow.appendChild(details)
        table.appendChild(tableRow)
    }
}

function closePopUpMenu(menuId){

    clearCreationData()

    const menu = document.getElementById(menuId)
    menu.classList.remove('show');
    menu.classList.add('hide');
}

function openPopUpMenu(menuId){
    const menu = document.getElementById(menuId)
    menu.classList.add('show');
    menu.classList.remove('hide');
}

function getDetails(button){
    const tableRow = button.parentElement.parentElement
    const uuid = tableRow.getAttribute("uuid")
    steps = operations[uuid]
    
    switch(steps.action_type){
        case "create_object":
            buildCreateObjectView(uuid, steps)
            break
        case "update_field":
            alert('update_field')
            break
        case "start_workflow":
            alert('start_workflow')
            break
        case "transition_workflow":
            alert('transition_workflow')
            break
        default:
            alert('not found')
    }
}

function buildCreateObjectView(uuid, steps){
    if (document.getElementById("menu-create-object").classList.contains("show")) return
    openPopUpMenu("menu-create-object")

    const typeDefinition = document.getElementById('input-resource-type-definition')
    const name = document.getElementById('input-resource-name')
    const description = document.getElementById('input-resource-description')
    const primaryParentId = document.getElementById('input-resource-primary-parent')
    const tableFields = document.getElementById('table-fields')
    const tableParents = document.getElementById('table-parents')
    const tableChildren = document.getElementById('table-children')
    const saveButton = document.getElementById('save-button')

    typeDefinition.value = steps.additional_information.type_definition
    name.value = steps.additional_information.name
    description.value = steps.additional_information.description
    primaryParentId.value = steps.additional_information.primary_parent_id
    saveButton.setAttribute('uuid', uuid)
    
    let trf = 0
    for (const obj of steps.additional_information.fields_list){
        for (const [key, value] of Object.entries(obj)){
            const row = document.createElement('tr')
            row.id = `fields_tr_${trf}`

            const field = document.createElement('td')
            const val = document.createElement('td')
            const buttons = document.createElement('td')

            field.innerHTML = key
            val.innerHTML = value
            buttons.innerHTML = `
                <button reference="fields_tr_${trf}" position="above" onclick="addTrRow(this)">Add above</button>
                <button reference="fields_tr_${trf}" position="below" onclick="addTrRow(this)">Add below</button>
                <button reference="fields_tr_${trf}" onclick="removeTr(this)">Remove</button>
            `
            
            field.setAttribute("contenteditable", "true")
            val.setAttribute("contenteditable", "true")
            
            row.appendChild(field)
            row.appendChild(val)
            row.appendChild(buttons)
            tableFields.appendChild(row)

            trf++
        }
    }

    let trp = 0
    for (const parent of steps.additional_information.parents_list){
        const row = document.createElement('tr')
        row.id = `parents_tr_${trp}`

        const id = document.createElement('td')
        const buttons = document.createElement('td')

        id.innerHTML = parent
        buttons.innerHTML = `
            <button reference="parents_tr_${trp}" position="above" onclick="addTrRow(this)">Add above</button>
            <button reference="parents_tr_${trp}" position="below" onclick="addTrRow(this)">Add below</button>
            <button reference="parents_tr_${trp}" onclick="removeTr(this)">Remove</button>
        `

        id.setAttribute("contenteditable", "true")

        row.appendChild(id)
        row.appendChild(buttons)
        tableParents.appendChild(row)

        trp++
    }

    let trc = 0
    for (const children of steps.additional_information.children_list){
        const row = document.createElement('tr')
        row.id = `children_tr_${trc}`

        const id = document.createElement('td')
        const buttons = document.createElement('td')

        id.innerHTML = children
        buttons.innerHTML = `
            <button reference="children_tr_${trc}" position="above" onclick="addTrRow(this)">Add above</button>
            <button reference="children_tr_${trc}" position="below" onclick="addTrRow(this)">Add below</button>
            <button reference="children_tr_${trc}" onclick="removeTr(this)">Remove</button>
        `

        id.setAttribute("contenteditable", "true")

        row.appendChild(id)
        row.appendChild(buttons)
        tableChildren.appendChild(row)

        trc++
    }
}

function saveCreateObjectData(){
    const saveButton = document.getElementById('save-button')
    const uuid = saveButton.getAttribute('uuid')
    saveButton.setAttribute("uuid", "")

    const typeDefinition = document.getElementById('input-resource-type-definition')
    const name = document.getElementById('input-resource-name')
    const description = document.getElementById('input-resource-description')
    const primaryParentId = document.getElementById('input-resource-primary-parent')

    const fields = []
    const parents = []
    const children = []

    for (const row of document.querySelectorAll('#table-fields > tr:not(:first-child)')) {
        const cells = row.children

        if (cells[0].textContent === "" || cells[1].textContent === "") continue

        const obj = {
            [cells[0].textContent]: [cells[1].textContent]
        }
        fields.push(obj)
    }

    for (const row of document.querySelectorAll('#table-parents > tr:not(:first-child)')) {
        const cells = row.children

        if (cells[0].textContent === "") continue

        parents.push(cells[0].textContent)
    }

    for (const row of document.querySelectorAll('#table-children > tr:not(:first-child)')) {
        const cells = row.children

        if (cells[0].textContent === "") continue
        
        children.push(cells[0].textContent)
    }

    const newValues = {
        "action_type": "create_object",
        "action_information": `Create ${typeDefinition.value} Object`,
        "additional_information": {
            "type_definition": typeDefinition.value, 
            "name": name.value,
            "description": description.value, 
            "primary_parent_id": primaryParentId.value,
            "fields_list": fields,
            "parents_list": parents,
            "children_list": children
        }
    }

    operations[uuid] = newValues
}

function clearCreationData(){
    const fields = document.getElementById("table-fields")
    const parents = document.getElementById("table-parents")
    const children = document.getElementById("table-children")
                
    fields.innerHTML =`
        <tr>
            <th>Field</th>
            <th>Value</th>
            <th>Action</th>
        </tr>
    `
    parents.innerHTML = `
        <tr>
            <th>Parant ID</th>
            <th>Action</th>
        </tr>
    `
    children.innerHTML = `  
        <tr>
            <th>Child ID</th>
            <th>Action</th>
        </tr>
    `
}

function prepareEmptyRow(row){
    if (row.id.includes('field')){
        const td0 = document.createElement('td')
        td0.setAttribute("contenteditable", "true")
        row.appendChild(td0)
    }

    const td1 = document.createElement('td')
    const td2 = document.createElement('td')
    
    td1.setAttribute("contenteditable", "true")
    td2.innerHTML = `
    <button reference="${row.id}" position="above" onclick="addTrRow(this)">Add above</button>
    <button reference="${row.id}" position="below" onclick="addTrRow(this)">Add below</button>
    <button reference="${row.id}" onclick="removeTr(this)">Remove</button>
    `
    row.appendChild(td1)
    row.appendChild(td2)

    return row
}

function addTrRow(button){
    const reference = button.getAttribute("reference")
    const split = reference.split('_')
    let row = document.createElement('tr')
    row.id = `${split[0]}_${split[1]}_${split[2] - 1}`

    row = prepareEmptyRow(row)
    
    ref = document.getElementById(reference);

    if (button.getAttribute("position") === 'above'){
        ref.parentNode.insertBefore(row, ref);
    }else if (button.getAttribute("position") === 'below'){
        ref.parentNode.insertBefore(row, ref.nextSibling);
    }
}

function removeTr(button){
    const row = document.getElementById(button.getAttribute("reference"))
    row.remove()
}