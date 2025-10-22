const params = new URLSearchParams(window.location.search)
const operations = JSON.parse(localStorage.getItem("data"));
setH1Element()
buildActionsTable()

// counters for table rows
localStorage.setItem('trc', '0')

function getConterTableRows(counterType){
    let trc = Number(localStorage.getItem('trc'))
    localStorage.setItem('trc', `${trc+1}`)
    return trc
}

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
        details.innerHTML = `<button class="default-button" onclick="getDetails(this)">Details</button>`
        deleteTestStep.innerHTML = `<button class="delete-button" onclick="deleteTestStep(this)">Remove</button>`
        
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
        case 'add_associate_object': 
            buildAddAssociationView(uuid, steps)
            break
        case 'load_existing_object': 
            buildLoadExistingObjectView(uuid, steps)
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
    
    const td1 = document.createElement('td')
    const td2 = document.createElement('td')

    if (row.id.includes('field')){
        const td0 = document.createElement('td')
        td0.classList.add('popupTd')
        td0.setAttribute("contenteditable", "true")
        row.appendChild(td0)
        
        td1.setAttribute("contenteditable", "true")
        td1.classList.add('popupTd')
        
        td2.innerHTML += `
            <button reference="${row.id}" class="default-button" onclick="toggleMultivalue(this)" title="Convert to multivalue"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list-ul" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/></svg></button>
            `
        }else{
            const input = document.createElement('input')
            input.classList.add('inputFormat')
            input.setAttribute("type", "number")
            input.setAttribute('onwheel', 'this.blur()');
            td1.appendChild(input)
        }
        
        td2.innerHTML += `
            <button reference="${row.id}" class="default-button" onclick="addTrRow(this)" title="Add new input line"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/></svg></button>
            <button reference="${row.id}" class="delete-button" onclick="removeTr(this)" title="Remove input line"><svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" ><path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path></svg></button>
        `

    row.appendChild(td1)
    row.appendChild(td2)

    return row
}

function addTrRow(button){
    const reference = button.getAttribute("reference")
    const split = reference.split('_')
    const ref = document.getElementById(reference).parentNode;
    const childrenElements = ref.children
    
    let row = document.createElement('tr')
    if (childrenElements.length === 1){
        row.id = `${split[0]}_${split[1]}_td_1`
        row.setAttribute("counter", 0)
    }else{
        const lastElement = childrenElements[childrenElements.length-1]
        let conterValue = Number(lastElement.getAttribute("counter")) + 1
        row.id = `${split[0]}_${split[1]}_td_${conterValue}`
        row.setAttribute("counter", conterValue)
    }

    row = prepareEmptyRow(row)
    ref.appendChild(row)
}

function removeTr(button){
    const row = document.getElementById(button.getAttribute("reference"))
    const parentElement = row.parentNode
    
    if (parentElement.children.length === 2){
        const tableRow = document.createElement('tr')
        const newId = row.id.split("_")
        tableRow.id = `${newId[0]}_${newId[1]}_${newId[1]}_0`
        const newRow = prepareEmptyRow(tableRow)
        parentElement.appendChild(newRow)
    }
    
    row.remove()
}

async function deleteTestStep(button){
    let message = 'Do you want to delete this test step?'
    const tableRow = button.parentElement.parentElement
    const uuid = tableRow.getAttribute("uuid")

    if (window.confirm(message)) {
        delete operations[uuid]
    }

    clearActionsTable()
    buildActionsTable()
}

function toggleMultivalue(button){
    const tableRow = document.getElementById(button.getAttribute("reference"))
    const tdToMultivalue = tableRow.children[1]

    if (tdToMultivalue.querySelector('ul')) return
    if (tdToMultivalue.textContent != ''){
        alert('Value must be empty before converting to multivalue')
        return
    }

    const ul = document.createElement('ul')
    const li = document.createElement('li')
    li.contentEditable = true
    
    ul.appendChild(li)  
    tdToMultivalue.appendChild(ul)

    setMultivalueEventListener(li)
}

function setMultivalueEventListener(li){
    li.addEventListener('keydown', e => {
        const current = e.target;
        if (e.key === 'Enter'){
            e.preventDefault;
            const newLi = document.createElement('li')
            newLi.contentEditable = true
            ul.appendChild(newLi)
            newLi.focus();
        }else if (e.key === "Backspace") {
            if (current.textContent.trim() === "") {
                const previous = current.previousElementSibling;
                if (ul.children.length > 1) {
                    e.preventDefault();
                    current.remove();
                    if (previous) previous.focus();
                    else ul.firstElementChild.focus();
                }
            }
        }
    })
}

function findOPTObjectsDeclared(uuid){
    let objects = []
    for (const op of Object.values(operations)){
        if (op.action_type === 'create_object' || op.action_type === 'load_existing_object'){
            objects.push(op)
        }

        if (op.uuid === uuid){
            break
        }
    }
    return objects
}

function fillFindAndEditSelectsPopupMenu(objects, nameElement, steps){
    const options = []
    for (const obj of objects){
        const option = document.createElement('option')
        option.value = obj.additional_information.name
        option.innerHTML = obj.additional_information.name
        option.setAttribute("reference", obj.reference)
        if (obj.reference === steps.reference){
            option.setAttribute("selected", "true")
        }
        nameElement.appendChild(option)
    }
}

function fillNewSelectsPopupMenu(objects, nameElement){
    const options = []
    for (const obj of objects){
        const option = document.createElement('option')
        option.value = obj.additional_information.name
        option.innerHTML = obj.additional_information.name
        option.setAttribute("reference", obj.reference)
        nameElement.appendChild(option)
    }
}
