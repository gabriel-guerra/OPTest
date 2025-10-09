const params = new URLSearchParams(window.location.search)
const operations = JSON.parse(localStorage.getItem("data"));
buildActionsTable()

function buildActionsTable(){
    const table = document.getElementById('test-actions')
    for (const [key, value] of Object.entries(operations)){
        const tableRow = document.createElement('tr')
        const actionType = document.createElement('td')
        const actionInformations = document.createElement('td')
        const details = document.createElement('td')
        const deleteTestStep = document.createElement('td')
        
        actionType.innerHTML = value.action_type
        actionInformations.innerHTML = value.action_information
        details.innerHTML = `<button onclick="getDetails(this)">Details</button>`
        deleteTestStep.innerHTML = `<button onclick="deleteTestStep(this)">Remove</button>`
        
        tableRow.setAttribute("uuid", key)
        
        tableRow.appendChild(actionType)
        tableRow.appendChild(actionInformations)
        tableRow.appendChild(details)
        tableRow.appendChild(deleteTestStep)
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
        case "update_field_associate_objects":
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
    row.id = `${split[0]}_${split[1]}_${split[2]}_${Number(split[3]) - 1}`

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

async function deleteTestStep(button){
    let message = 'Do you want to delete this test step?'
    const tableRow = button.parentElement.parentElement
    const uuid = tableRow.getAttribute("uuid")

    if (window.confirm(message)) {
        delete operations[uuid]
    }

    console.log(operations)
    
    clearActionsTable()
    buildActionsTable()
}