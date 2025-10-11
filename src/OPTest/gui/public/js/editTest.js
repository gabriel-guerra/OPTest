const params = new URLSearchParams(window.location.search)
const operations = JSON.parse(localStorage.getItem("data"));
setH1Element()
buildActionsTable()

function setH1Element(){
    const h1 = document.getElementById('h1-header')
    h1.innerHTML = `Edit test file: <span id="testFileName">${localStorage.getItem('testName')}</span>`
}

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
        <button reference="${row.id}" position="below" class="default-button" onclick="addTrRow(this)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"/></svg></button>
        <button reference="${row.id}" position="above" class="default-button" onclick="addTrRow(this)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"/></svg></button>
        <button reference="${row.id}" class="delete-button" onclick="removeTr(this)"><svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" ><path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path></svg></button>
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