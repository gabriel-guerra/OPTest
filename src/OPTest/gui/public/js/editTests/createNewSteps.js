////
// Create methods
function newCreateObjectView(){
    clearDetailsCreationData()

    if (document.getElementById("menu-create-object").classList.contains("show")) return
    openPopUpMenu("menu-create-object")

    const tableFields = document.getElementById('table-create-fields')
    const tableParents = document.getElementById('table-create-parents')
    const tableChildren = document.getElementById('table-create-children')
    const saveButton = document.getElementById('create-save-button')

    const uuid = crypto.randomUUID()
    saveButton.setAttribute('uuid', uuid)
    
    // table fields
    const row_fields = document.createElement('tr')
    row_fields.id = `creation_fields_tr_${0}`
    const newRowFields = prepareEmptyRow(row_fields)
    tableFields.appendChild(newRowFields)

    // table parents
    const row_parents = document.createElement('tr')
    row_parents.id = `creation_parents_tr_${0}`
    const newRowParents = prepareEmptyRow(row_parents)
    tableParents.appendChild(newRowParents)

    // table children
    const row_children = document.createElement('tr')
    row_children.id = `creation_children_tr_${0}`
    const newRowChildren = prepareEmptyRow(row_children)
    tableChildren.appendChild(newRowChildren)

}


////
// Update Fields

function newUpdateFieldsView(){
    clearDetailsUpdateData()

    if (document.getElementById("menu-update-fields").classList.contains("show")) return
    openPopUpMenu("menu-update-fields")

    const uuid = crypto.randomUUID()
    const nameElement = document.getElementById('select-update-resource-name')
    const tableFields = document.getElementById('table-update-fields')
    const saveButton = document.getElementById('update-save-button')

    const objects = findOPTObjectsDeclared(uuid)
    fillNewSelectsPopupMenu(objects, nameElement)

    saveButton.setAttribute('uuid', uuid)
    
    const row = document.createElement('tr')
    row.id = `update_fields_tr_${0}`

    const field = document.createElement('td')
    const val = document.createElement('td')
    const buttons = document.createElement('td')

    field.classList.add('popupTd')
    val.classList.add('popupTd')

    buttons.innerHTML = `
        <button type="button" reference="update_fields_tr_${0}" position="below" class="default-button" onclick="addTrRow(this)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/></svg></button>
        <button type="button" reference="update_fields_tr_${0}" class="delete-button" onclick="removeTr(this)"><svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" ><path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path></svg></button>
    `
    
    field.setAttribute("contenteditable", "true")
    val.setAttribute("contenteditable", "true")
    
    row.appendChild(field)
    row.appendChild(val)
    row.appendChild(buttons)
    tableFields.appendChild(row)

}

    
////
// Update Fields ASSOCIATE OBJECTS
    
function newUpdateOnAssociateView(){
    clearDetailsUpdateAssociateData()

    if (document.getElementById("menu-update-associate").classList.contains("show")) return
    openPopUpMenu("menu-update-associate")
    
    const uuid = crypto.randomUUID()
    
    const nameElement = document.getElementById('select-update-associate-resource-name')
    const tableFields = document.getElementById('table-update-associate')

    const objects = findOPTObjectsDeclared(uuid)
    fillNewSelectsPopupMenu(objects, nameElement)

    const saveButton = document.getElementById('update-associate-save-button')

    saveButton.setAttribute('uuid', uuid)
    
    const row = document.createElement('tr')
    row.id = `associate_fields_tr_${0}`

    const field = document.createElement('td')
    const val = document.createElement('td')
    const buttons = document.createElement('td')

    field.classList.add('popupTd')
    val.classList.add('popupTd')

    buttons.innerHTML = `
        <button type="button" reference="associate_fields_tr_${0}" position="below" class="default-button" onclick="addTrRow(this)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/></svg></button>
        <button type="button" reference="associate_fields_tr_${0}" class="delete-button" onclick="removeTr(this)"><svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" ><path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path></svg></button>
    `
    field.setAttribute("contenteditable", "true")
    val.setAttribute("contenteditable", "true")
    
    row.appendChild(field)
    row.appendChild(val)
    row.appendChild(buttons)
    tableFields.appendChild(row)

}


////
// Start Workflow

function newStartWorkflowView(){
    if (document.getElementById("menu-start_workflow").classList.contains("show")) return
    openPopUpMenu("menu-start_workflow")

    const uuid = crypto.randomUUID()

    const nameElement = document.getElementById('select-start_workflow-resource-name')
    const saveButton = document.getElementById('start_workflow-save-button')
    
    const objects = findOPTObjectsDeclared(uuid)
    fillNewSelectsPopupMenu(objects, nameElement)
    
    saveButton.setAttribute('uuid', uuid)

}

////
// Transition Workflow

function newTransitionWorkflowView(){
    if (document.getElementById("menu-transition_workflow").classList.contains("show")) return
    openPopUpMenu("menu-transition_workflow")

    const uuid = crypto.randomUUID()
    const nameElement = document.getElementById('select-transition_workflow-resource-name')
    const saveButton = document.getElementById('transition_workflow-save-button')
    
    const objects = findOPTObjectsDeclared(uuid)
    fillNewSelectsPopupMenu(objects, nameElement)
    
    saveButton.setAttribute('uuid', uuid)

}

////
// Delete Object

function newDeleteView(){
    if (document.getElementById("menu-delete-object").classList.contains("show")) return
    openPopUpMenu("menu-delete-object")

    const uuid = crypto.randomUUID()
    const nameElement = document.getElementById('select-delete-resource-name')
    const saveButton = document.getElementById('delete-save-button')
    
    const objects = findOPTObjectsDeclared(uuid)
    fillNewSelectsPopupMenu(objects, nameElement)
    
    saveButton.setAttribute('uuid', uuid)

}