const params = new URLSearchParams(window.location.search)
const operations = JSON.parse(localStorage.getItem("data"));
buildActionsTable()

document.querySelectorAll('form').forEach(form => {
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const action = event.submitter.value;
        if(action === "create_object") {
            saveCreateObjectData()
        }else if (action === "update_field"){
            saveUpdateFieldsData()
        }else if (action === 'start_workflow'){
            saveStartWorkflowData()
        }else if (action === 'transition_workflow'){
            saveTransitionWorkflowData()
        }else if (action === 'update_fields_associate_object'){
            saveUpdateOnAssociateData()
        }else if (action === 'delete_object'){
            saveDeleteData()
        }
    });
});

function buildActionsTable(){
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

function getDetails(button){
    const tableRow = button.parentElement.parentElement
    const uuid = tableRow.getAttribute("uuid")
    steps = operations[uuid]
    
    switch(steps.action_type){
        case "create_object":
            buildCreateObjectView(uuid, steps)
            break
        case "update_field":
            buildUpdateFieldsView(uuid, steps)
            break
        case "start_workflow":
            buildStartWorkflowView(uuid, steps)
            break
        case "transition_workflow":
            buildTransitionWorkflowView(uuid, steps)
            break
        case "update_fields_associate_object":
            buildUpdateOnAssociateView(uuid, steps)
            break
        case "delete_object":
            buildDeleteView(uuid, steps)
            break
        default:
            alert('not found')
    }
}

////
// Create methods
function buildCreateObjectView(uuid, steps){
    clearDetailsCreationData()

    if (document.getElementById("menu-create-object").classList.contains("show")) return
    openPopUpMenu("menu-create-object")

    const typeDefinition = document.getElementById('input-create-resource-type-definition')
    const name = document.getElementById('input-create-resource-name')
    const description = document.getElementById('input-create-resource-description')
    const primaryParentId = document.getElementById('input-create-resource-primary-parent')
    const tableFields = document.getElementById('table-create-fields')
    const tableParents = document.getElementById('table-create-parents')
    const tableChildren = document.getElementById('table-create-children')
    const saveButton = document.getElementById('create-save-button')

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
    const saveButton = document.getElementById('create-save-button')
    const uuid = saveButton.getAttribute('uuid')
    saveButton.setAttribute("uuid", "")

    const typeDefinition = document.getElementById('input-create-resource-type-definition')
    const name = document.getElementById('input-create-resource-name')
    const description = document.getElementById('input-create-resource-description')
    const primaryParentId = document.getElementById('input-create-resource-primary-parent')

    const fields = []
    const parents = []
    const children = []

    for (const row of document.querySelectorAll('#table-create-fields > tr:not(:first-child)')) {
        const cells = row.children

        if (cells[0].textContent === "" || cells[1].textContent === "") continue

        const obj = {
            [cells[0].textContent]: cells[1].textContent
        }
        fields.push(obj)
    }

    for (const row of document.querySelectorAll('#table-create-parents > tr:not(:first-child)')) {
        const cells = row.children

        if (cells[0].textContent === "") continue

        parents.push(cells[0].textContent)
    }

    for (const row of document.querySelectorAll('#table-create-children > tr:not(:first-child)')) {
        const cells = row.children

        if (cells[0].textContent === "") continue
        
        children.push(cells[0].textContent)
    }

    const formatName = name.value.replace(/ /g, "_").replace(/-/g, "_").toLowerCase()
    const newValues = {
        "uuid": uuid,
        "reference": formatName,
        "action_type": "create_object",
        "action_information": `Create: ${name.value} (${typeDefinition.value})`,
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

function clearDetailsCreationData(){
    // Creation
    const creationFields = document.getElementById("table-create-fields")
    const creationParents = document.getElementById("table-create-parents")
    const creationChildren = document.getElementById("table-create-children")
                
    creationFields.innerHTML =`
        <tr>
            <th>Field</th>
            <th>Value</th>
            <th>Action</th>
        </tr>
    `
    creationParents.innerHTML = `
        <tr>
            <th>Parant ID</th>
            <th>Action</th>
        </tr>
    `
    creationChildren.innerHTML = `  
        <tr>
            <th>Child ID</th>
            <th>Action</th>
        </tr>
    `
}



////
// Update Fields

function buildUpdateFieldsView(uuid, steps){
    clearDetailsUpdateData()

    if (document.getElementById("menu-update-fields").classList.contains("show")) return
    openPopUpMenu("menu-update-fields")

    const name = document.getElementById('input-update-resource-name')
    const tableFields = document.getElementById('table-update-fields')
    const saveButton = document.getElementById('update-save-button')

    name.value = steps.additional_information.name
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
}

function saveUpdateFieldsData(){
    const saveButton = document.getElementById('update-save-button')
    const uuid = saveButton.getAttribute('uuid')
    saveButton.setAttribute("uuid", "")

    const name = document.getElementById('input-update-resource-name')

    const fields = []

    for (const row of document.querySelectorAll('#table-update-fields > tr:not(:first-child)')) {
        const cells = row.children

        if (cells[0].textContent === "" || cells[1].textContent === "") continue

        const obj = {
            [cells[0].textContent]: cells[1].textContent
        }
        fields.push(obj)
    }

    const formatName = name.value.replace(/ /g, "_").replace(/-/g, "_").toLowerCase()
    const newValues = {
        "uuid": uuid,
        "reference": formatName,
        "action_type": "update_field",
        "action_information": `Update field(s) in ${name.value}`,
        "additional_information": {
            "name": name.value,
            "fields_list": fields,
        }
    }

    operations[uuid] = newValues
}

function clearDetailsUpdateData(){
    // Update Fields
    const updateFields = document.getElementById("table-update-fields")
    updateFields.innerHTML =`
        <tr>
            <th>Field</th>
            <th>Value</th>
            <th>Action</th>
        </tr>
    `
}


////
// Update Fields ASSOCIATE OBJECTS

function buildUpdateOnAssociateView(uuid, steps){
    clearDetailsUpdateAssociateData()

    if (document.getElementById("menu-update-associate").classList.contains("show")) return
    openPopUpMenu("menu-update-associate")

    const name = document.getElementById('input-update-associate-resource-name')
    const associationType = document.getElementById('input-update-associate-association-type')
    const typeDefinition = document.getElementById('input-update-associate-type-definition')
    const tableFields = document.getElementById('table-update-associate')
    const saveButton = document.getElementById('update-associate-save-button')

    name.value = steps.additional_information.name
    typeDefinition.value = steps.additional_information.type_definition
    for (const child of associationType.children){
        if (child.value === steps.additional_information.association_type){
            child.setAttribute("selected", "true")
        }
    }

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
}

function saveUpdateOnAssociateData(){
    const saveButton = document.getElementById('update-associate-save-button')
    const uuid = saveButton.getAttribute('uuid')
    saveButton.setAttribute("uuid", "")

    const name = document.getElementById('input-update-associate-resource-name')
    const associationTypeElement = document.getElementById('input-update-associate-association-type')
    const associationType = associationTypeElement.selectedOptions[0]
    const typeDefinition = document.getElementById('input-update-associate-type-definition')

    const fields = []

    for (const row of document.querySelectorAll('#table-update-associate > tr:not(:first-child)')) {
        const cells = row.children

        if (cells[0].textContent === "" || cells[1].textContent === "") continue

        const obj = {
            [cells[0].textContent]: cells[1].textContent
        }
        fields.push(obj)
    }

    const formatName = name.value.replace(/ /g, "_").replace(/-/g, "_").toLowerCase()
    const newValues = {
        "uuid": uuid,
        "reference": formatName,
        "action_type": "update_fields_associate_object",
        "action_information": `Update field(s) in ${associationType.value} of ${name.value}`,
        "additional_information": {
            "name": name.value,
            "association_type": associationType.value,
            "type_definition": typeDefinition.value,
            "fields_list": fields,
        }
    }

    console.log(newValues)

    operations[uuid] = newValues
}

function clearDetailsUpdateAssociateData(){
    // Update Fields
    const updateAssociate = document.getElementById("table-update-associate")           
    updateAssociate.innerHTML =`
        <tr>
            <th>Field</th>
            <th>Value</th>
            <th>Action</th>
        </tr>
    `
}


////
// Start Workflow

function buildStartWorkflowView(uuid, steps){
    if (document.getElementById("menu-start_workflow").classList.contains("show")) return
    openPopUpMenu("menu-start_workflow")

    const name = document.getElementById('input-start_workflow-resource-name')
    const wfName = document.getElementById('input-start_workflow-name')
    const saveButton = document.getElementById('start_workflow-save-button')

    name.value = steps.additional_information.name
    wfName.value = steps.additional_information.workflow_name
    saveButton.setAttribute('uuid', uuid)

}

function saveStartWorkflowData(){
    const saveButton = document.getElementById('start_workflow-save-button')
    const uuid = saveButton.getAttribute('uuid')
    saveButton.setAttribute("uuid", "")

    const name = document.getElementById('input-start_workflow-resource-name')
    const wfName = document.getElementById('input-start_workflow-name')

    const formatName = name.value.replace(/ /g, "_").replace(/-/g, "_").toLowerCase()
    const newValues = {
        "uuid": uuid,
        "reference": formatName,
        "action_type": "start_workflow",
        "action_information": `Start ${wfName.value} in ${name.value}`,
        "additional_information": {
            "name": name.value,
            "workflow_name": wfName.value,
        }
    }

    operations[uuid] = newValues
}


////
// Transition Workflow

function buildTransitionWorkflowView(uuid, steps){
    if (document.getElementById("menu-transition_workflow").classList.contains("show")) return
    openPopUpMenu("menu-transition_workflow")

    const name = document.getElementById('input-transition_workflow-resource-name')
    const wfAction = document.getElementById('input-transition_workflow-name')
    const saveButton = document.getElementById('transition_workflow-save-button')

    name.value = steps.additional_information.name
    wfAction.value = steps.additional_information.action_name
    saveButton.setAttribute('uuid', uuid)

}

function saveTransitionWorkflowData(){
    const saveButton = document.getElementById('transition_workflow-save-button')
    const uuid = saveButton.getAttribute('uuid')
    saveButton.setAttribute("uuid", "")

    const name = document.getElementById('input-transition_workflow-resource-name')
    const wfAction = document.getElementById('input-transition_workflow-name')

    const formatName = name.value.replace(/ /g, "_").replace(/-/g, "_").toLowerCase()
    const newValues = {
        "uuid": uuid,
        "reference": formatName,
        "action_type": "transition_workflow",
        "action_information": `Transition ${name.value} to ${wfAction.value}`,
        "additional_information": {
            "name": name.value,
            "action_name": wfAction.value,
        }
    }

    operations[uuid] = newValues
}

////
// Delete Object

function buildDeleteView(uuid, steps){
    if (document.getElementById("menu-delete-object").classList.contains("show")) return
    openPopUpMenu("menu-delete-object")

    const name = document.getElementById('input-delete-resource-name')
    const saveButton = document.getElementById('delete-save-button')

    name.value = steps.additional_information.name
    saveButton.setAttribute('uuid', uuid)

}

function saveDeleteData(){
    const saveButton = document.getElementById('delete-save-button')
    const uuid = saveButton.getAttribute('uuid')
    saveButton.setAttribute("uuid", "")

    const name = document.getElementById('input-delete-resource-name')

    const formatName = name.value.replace(/ /g, "_").replace(/-/g, "_").toLowerCase()
    const newValues = {
        "uuid": uuid,
        "reference": formatName,
        "action_type": "delete_object",
        "action_information": `Delete: ${name.value}`,
        "additional_information": {
            "name": name.value,
        }
    }

    operations[uuid] = newValues
}



////
// Misc

function clearActionsTable(){
    const table = document.getElementById('test-actions')
    table.innerHTML = `
        <tr>
            <th>Action Type</th>
            <th>Action information</th>
            <th>Edit</th>
        </tr>
    `
    // console.log(operations)
}

function closePopUpMenu(menuId){
    const menu = document.getElementById(menuId)
    menu.classList.remove('show');
    menu.classList.add('hide');

    clearActionsTable()
    buildActionsTable()
}

function openPopUpMenu(menuId){
    const menu = document.getElementById(menuId)
    menu.classList.add('show');
    menu.classList.remove('hide');
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