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
    row_fields.id = `creation_creation_fields_tr_${0}`

    const field = document.createElement('td')
    const val = document.createElement('td')
    const buttons_field = document.createElement('td')
    buttons_field.innerHTML = `
        <button type="button" reference="creation_fields_tr_${0}" position="below" class="default-button" onclick="addTrRow(this)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"/></svg></button>
        <button type="button" reference="creation_fields_tr_${0}" position="above" class="default-button" onclick="addTrRow(this)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"/></svg></button>
        <button type="button" reference="creation_fields_tr_${0}" class="delete-button" onclick="removeTr(this)"><svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" ><path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path></svg></button>
    `
    
    field.setAttribute("contenteditable", "true")
    val.setAttribute("contenteditable", "true")
    
    row_fields.appendChild(field)
    row_fields.appendChild(val)
    row_fields.appendChild(buttons_field)
    tableFields.appendChild(row_fields)

    // table parents
    const row_parents = document.createElement('tr')
    row_parents.id = `creation_parents_tr_${0}`

    const id_parents = document.createElement('td')
    const buttons_parents = document.createElement('td')

    buttons_parents.innerHTML = `
        <button type="button" reference="creation_parents_tr_${0}" position="below" class="default-button" onclick="addTrRow(this)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"/></svg></button>
        <button type="button" reference="creation_parents_tr_${0}" position="above" class="default-button" onclick="addTrRow(this)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"/></svg></button>
        <button type="button" reference="creation_parents_tr_${0}" class="delete-button" onclick="removeTr(this)"><svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" ><path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path></svg></button>
    `

    id_parents.setAttribute("contenteditable", "true")

    row_parents.appendChild(id_parents)
    row_parents.appendChild(buttons_parents)
    tableParents.appendChild(row_parents)

    // table children
    const row_children = document.createElement('tr')
    row_children.id = `creation_children_tr_${0}`

    const id_children = document.createElement('td')
    const buttons_children = document.createElement('td')

    buttons_children.innerHTML = `
        <button type="button" reference="creation_children_tr_${0}" position="below" class="default-button" onclick="addTrRow(this)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"/></svg></button>
        <button type="button" reference="creation_children_tr_${0}" position="above" class="default-button" onclick="addTrRow(this)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"/></svg></button>
        <button type="button" reference="creation_children_tr_${0}" class="delete-button" onclick="removeTr(this)"><svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" ><path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path></svg></button>
    `
    id_children.setAttribute("contenteditable", "true")

    row_children.appendChild(id_children)
    row_children.appendChild(buttons_children)
    tableChildren.appendChild(row_children)

}


////
// Update Fields

function newUpdateFieldsView(){
    clearDetailsUpdateData()

    if (document.getElementById("menu-update-fields").classList.contains("show")) return
    openPopUpMenu("menu-update-fields")

    const uuid = crypto.randomUUID()
    const tableFields = document.getElementById('table-update-fields')
    const saveButton = document.getElementById('update-save-button')
    saveButton.setAttribute('uuid', uuid)
    
    const row = document.createElement('tr')
    row.id = `update_fields_tr_${0}`

    const field = document.createElement('td')
    const val = document.createElement('td')
    const buttons = document.createElement('td')

    buttons.innerHTML = `
        <button type="button" reference="update_fields_tr_${0}" position="below" class="default-button" onclick="addTrRow(this)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"/></svg></button>
        <button type="button" reference="update_fields_tr_${0}" position="above" class="default-button" onclick="addTrRow(this)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"/></svg></button>
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

    const tableFields = document.getElementById('table-update-associate')
    const saveButton = document.getElementById('update-associate-save-button')

    const uuid = crypto.randomUUID()
    saveButton.setAttribute('uuid', uuid)
    
    const row = document.createElement('tr')
    row.id = `associate_fields_tr_${0}`

    const field = document.createElement('td')
    const val = document.createElement('td')
    const buttons = document.createElement('td')

    buttons.innerHTML = `
        <button type="button" reference="associate_fields_tr_${0}" position="below" class="default-button" onclick="addTrRow(this)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"/></svg></button>
        <button type="button" reference="associate_fields_tr_${0}" position="above" class="default-button" onclick="addTrRow(this)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"/></svg></button>
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
    const saveButton = document.getElementById('start_workflow-save-button')
    saveButton.setAttribute('uuid', uuid)

}

////
// Transition Workflow

function newTransitionWorkflowView(){
    if (document.getElementById("menu-transition_workflow").classList.contains("show")) return
    openPopUpMenu("menu-transition_workflow")

    const uuid = crypto.randomUUID()
    const saveButton = document.getElementById('transition_workflow-save-button')
    saveButton.setAttribute('uuid', uuid)

}

////
// Delete Object

function newDeleteView(){
    if (document.getElementById("menu-delete-object").classList.contains("show")) return
    openPopUpMenu("menu-delete-object")

    const uuid = crypto.randomUUID()
    const saveButton = document.getElementById('delete-save-button')
    saveButton.setAttribute('uuid', uuid)

}