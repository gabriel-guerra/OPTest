////
// Create methods
function newCreateObjectView(){
    clearDetailsCreationData()

    if (document.getElementById("menu-create-object").classList.contains("show")) return
    openPopUpMenu("menu-create-object")

    const tbodyFields = document.getElementById('creation_fields_tbody')
    const tbodyParents = document.getElementById('creation_parents_tbody')
    const tbodyChildren = document.getElementById('creation_children_tbody')
    const saveButton = document.getElementById('create-save-button')

    const uuid = crypto.randomUUID()
    saveButton.setAttribute('uuid', uuid)
    
    // table fields
    const row_fields = document.createElement('tr')
    row_fields.id = `creation_fields_tr_${getConterTableRows('trf')}`
    const newRowFields = prepareEmptyRow(row_fields)
    tbodyFields.appendChild(newRowFields)

    // table parents
    const row_parents = document.createElement('tr')
    row_parents.id = `creation_parents_tr_${getConterTableRows('trf')}`
    const newRowParents = prepareEmptyRow(row_parents)
    tbodyParents.appendChild(newRowParents)

    // table children
    const row_children = document.createElement('tr')
    row_children.id = `creation_children_tr_${getConterTableRows('trp')}`
    const newRowChildren = prepareEmptyRow(row_children)
    tbodyChildren.appendChild(newRowChildren)
}


////
// Update Fields

function newUpdateFieldsView(){
    clearDetailsUpdateData()

    if (document.getElementById("menu-update-fields").classList.contains("show")) return
    openPopUpMenu("menu-update-fields")

    const uuid = crypto.randomUUID()
    const nameElement = document.getElementById('select-update-resource-name')
    const tbodyFields = document.getElementById('update_fields_tbody')
    const saveButton = document.getElementById('update-save-button')

    const objects = findOPTObjectsDeclared(uuid)
    fillNewSelectsPopupMenu(objects, nameElement)

    saveButton.setAttribute('uuid', uuid)
    
    const row = document.createElement('tr')
    row.id = `update_fields_tr_${getConterTableRows('trf')}`
    const newRowFields = prepareEmptyRow(row)
    tbodyFields.appendChild(newRowFields)
}

    
////
// Update Fields ASSOCIATE OBJECTS
    
function newUpdateOnAssociateView(){
    clearDetailsUpdateAssociateData()

    if (document.getElementById("menu-update-associate").classList.contains("show")) return
    openPopUpMenu("menu-update-associate")
    
    const uuid = crypto.randomUUID()
    
    const nameElement = document.getElementById('select-update-associate-resource-name')
    const tbodyFields = document.getElementById('update_associate_tbody')

    const objects = findOPTObjectsDeclared(uuid)
    fillNewSelectsPopupMenu(objects, nameElement)

    const saveButton = document.getElementById('update-associate-save-button')

    saveButton.setAttribute('uuid', uuid)
    
    const row = document.createElement('tr')
    row.id = `associate_fields_tr_${getConterTableRows('trf')}`
    const newRowFields = prepareEmptyRow(row)
    tbodyFields.appendChild(newRowFields)
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