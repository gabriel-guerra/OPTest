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
        <button type="button" reference="creation_fields_tr_${0}" position="above" onclick="addTrRow(this)">Add above</button>
        <button type="button" reference="creation_fields_tr_${0}" position="below" onclick="addTrRow(this)">Add below</button>
        <button type="button" reference="creation_fields_tr_${0}" onclick="removeTr(this)">Remove</button>
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
        <button type="button" reference="creation_parents_tr_${0}" position="above" onclick="addTrRow(this)">Add above</button>
        <button type="button" reference="creation_parents_tr_${0}" position="below" onclick="addTrRow(this)">Add below</button>
        <button type="button" reference="creation_parents_tr_${0}" onclick="removeTr(this)">Remove</button>
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
        <button type="button" reference="creation_children_tr_${0}" position="above" onclick="addTrRow(this)">Add above</button>
        <button type="button" reference="creation_children_tr_${0}" position="below" onclick="addTrRow(this)">Add below</button>
        <button type="button" reference="creation_children_tr_${0}" onclick="removeTr(this)">Remove</button>
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
        <button type="button" reference="update_fields_tr_${0}" position="above" onclick="addTrRow(this)">Add above</button>
        <button type="button" reference="update_fields_tr_${0}" position="below" onclick="addTrRow(this)">Add below</button>
        <button type="button" reference="update_fields_tr_${0}" onclick="removeTr(this)">Remove</button>
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
        <button type="button" reference="associate_fields_tr_${0}" position="above" onclick="addTrRow(this)">Add above</button>
        <button type="button" reference="associate_fields_tr_${0}" position="below" onclick="addTrRow(this)">Add below</button>
        <button type="button" reference="associate_fields_tr_${0}" onclick="removeTr(this)">Remove</button>
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