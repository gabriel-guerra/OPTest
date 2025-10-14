////
// Create methods
function buildCreateObjectView(uuid, steps){
    clearDetailsCreationData()

    if (document.getElementById("menu-create-object").classList.contains("show")) return
    openPopUpMenu("menu-create-object")

    const typeDefinitionElement = document.getElementById('input-create-resource-type-definition')
    const nameElement = document.getElementById('input-create-resource-name')
    const descriptionElement = document.getElementById('input-create-resource-description')
    const primaryParentIdElement = document.getElementById('input-create-resource-primary-parent')
    const tbodyFields = document.getElementById('creation_fields_tbody')
    const tbodyParents = document.getElementById('creation_parents_tbody')
    const tbodyChildren = document.getElementById('creation_children_tbody')
    const safeDeleteCheckbox = document.getElementById('safe-delete-checkbox')
    const saveButton = document.getElementById('create-save-button')

    typeDefinitionElement.value = steps.additional_information.type_definition
    nameElement.value = steps.additional_information.name
    descriptionElement.value = steps.additional_information.description
    primaryParentIdElement.value = steps.additional_information.primary_parent_id
    safeDeleteCheckbox.checked = steps.safe_delete
    saveButton.setAttribute('uuid', uuid)
    
    if(steps.additional_information.fields_list.length > 0){
        for (const obj of steps.additional_information.fields_list){
            for (const [key, value] of Object.entries(obj)){
                const row = document.createElement('tr')
                row.id = `creation_fields_tr_${getConterTableRows('trf')}`
                const newRow = prepareEmptyRow(row)
                
                const rowChildren = newRow.children
                rowChildren[0].innerHTML = key
                rowChildren[1].innerHTML = value
                
                tbodyFields.appendChild(newRow)
            }
        }
    }else{
        const row = document.createElement('tr')
        row.id = `creation_fields_tr_${getConterTableRows('trf')}`
        const newRow = prepareEmptyRow(row)
        tbodyFields.appendChild(newRow)
    }

    if (steps.additional_information.parents_list.length > 0){
        for (const parent of steps.additional_information.parents_list){
            const row = document.createElement('tr')
            row.id = `creation_parents_tr_${getConterTableRows('trp')}`
            const newRow = prepareEmptyRow(row)
            
            const rowChildren = newRow.children[0].children
            rowChildren[0].value = parent
            
            tbodyParents.appendChild(newRow)
        }
    }else{
        const row = document.createElement('tr')
        row.id = `creation_parents_tr_${getConterTableRows('trp')}`
        const newRow = prepareEmptyRow(row)
        tbodyParents.appendChild(newRow)
    }

    if (steps.additional_information.children_list.length > 0){
        for (const children of steps.additional_information.children_list){
            const row = document.createElement('tr')
            row.id = `creation_children_tr_${getConterTableRows('trc')}`
            const newRow = prepareEmptyRow(row)
                
            const rowChildren = newRow.children[0].children
            rowChildren[0].value = children
            
            tbodyChildren.appendChild(newRow)
        }
    }else{
        const row = document.createElement('tr')
        row.id = `creation_children_tr_${getConterTableRows('trc')}`
        const newRow = prepareEmptyRow(row)
        tbodyChildren.appendChild(newRow)
    }
}

////
// Update Fields
function buildUpdateFieldsView(uuid, steps){
    clearDetailsUpdateData()

    if (document.getElementById("menu-update-fields").classList.contains("show")) return
    openPopUpMenu("menu-update-fields")

    const nameElement = document.getElementById('select-update-resource-name')
    const tableFields = document.getElementById('table-update-fields')
    const saveButton = document.getElementById('update-save-button')

    const objects = findOPTObjectsDeclared(uuid)
    fillFindAndEditSelectsPopupMenu(objects, nameElement, steps)

    saveButton.setAttribute('uuid', uuid)
    
    let trf = 0
    for (const obj of steps.additional_information.fields_list){
        for (const [key, value] of Object.entries(obj)){
            const row = document.createElement('tr')
            row.id = `update_fields_tr_${trf}`

            const field = document.createElement('td')
            const val = document.createElement('td')
            const buttons = document.createElement('td')

            field.classList.add('popupTd')
            val.classList.add('popupTd')

            field.innerHTML = key

            if (Array.isArray(value)){
                val.setAttribute("op-multivalue", "true")
            }
            val.innerHTML = value
            buttons.innerHTML = `
                <button type="button" reference="update_fields_tr_${trf}" position="below" class="default-button" onclick="addTrRow(this)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/></svg></button>
                <button type="button" reference="update_fields_tr_${trf}" class="delete-button" onclick="removeTr(this)"><svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" ><path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path></svg></button>
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
    
    
////
// Update Fields ASSOCIATE OBJECTS
    
function buildUpdateOnAssociateView(uuid, steps){
    clearDetailsUpdateAssociateData()

    if (document.getElementById("menu-update-associate").classList.contains("show")) return
    openPopUpMenu("menu-update-associate")

    const nameElement = document.getElementById('select-update-associate-resource-name')
    const associationTypeElement = document.getElementById('input-update-associate-association-type')
    const typeDefinitionElement = document.getElementById('input-update-associate-type-definition')
    const tableFields = document.getElementById('table-update-associate')
    const saveButton = document.getElementById('update-associate-save-button')

    const objects = findOPTObjectsDeclared(uuid)
    fillFindAndEditSelectsPopupMenu(objects, nameElement, steps)

    nameElement.value = steps.additional_information.name
    typeDefinitionElement.value = steps.additional_information.type_definition
    for (const child of associationTypeElement.children){
        if (child.value === steps.additional_information.association_type){
            child.setAttribute("selected", "true")
        }
    }

    saveButton.setAttribute('uuid', uuid)
    
    let trf = 0
    for (const obj of steps.additional_information.fields_list){
        for (const [key, value] of Object.entries(obj)){
            const row = document.createElement('tr')
            row.id = `associate_fields_tr_${trf}`

            const field = document.createElement('td')
            const val = document.createElement('td')
            const buttons = document.createElement('td')

            field.classList.add('popupTd')
            val.classList.add('popupTd')

            field.innerHTML = key
            val.innerHTML = value
            buttons.innerHTML = `
                <button type="button" reference="associate_fields_tr_${trf}" position="below" class="default-button" onclick="addTrRow(this)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/></svg></button>
                <button type="button" reference="associate_fields_tr_${trf}" class="delete-button" onclick="removeTr(this)"><svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" ><path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path></svg></button>
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


////
// Start Workflow

function buildStartWorkflowView(uuid, steps){
    clearDetailsStartWorkflow()

    if (document.getElementById("menu-start_workflow").classList.contains("show")) return
    openPopUpMenu("menu-start_workflow")

    const nameElement = document.getElementById('select-start_workflow-resource-name')
    const wfName = document.getElementById('input-start_workflow-name')
    const saveButton = document.getElementById('start_workflow-save-button')

    const objects = findOPTObjectsDeclared(uuid)
    fillFindAndEditSelectsPopupMenu(objects, nameElement, steps)

    wfName.value = steps.additional_information.workflow_name
    saveButton.setAttribute('uuid', uuid)

}

////
// Transition Workflow

function buildTransitionWorkflowView(uuid, steps){
    clearDetailsTransitionWorkflow()

    if (document.getElementById("menu-transition_workflow").classList.contains("show")) return
    openPopUpMenu("menu-transition_workflow")

    const nameElement = document.getElementById('select-transition_workflow-resource-name')
    const wfAction = document.getElementById('input-transition_workflow-name')
    const saveButton = document.getElementById('transition_workflow-save-button')

    const objects = findOPTObjectsDeclared(uuid)
    fillFindAndEditSelectsPopupMenu(objects, nameElement, steps)

    wfAction.value = steps.additional_information.action_name
    saveButton.setAttribute('uuid', uuid)

}

////
// Delete Object
function buildDeleteView(uuid, steps){
    clearDetailsDeleteObject()

    if (document.getElementById("menu-delete-object").classList.contains("show")) return
    openPopUpMenu("menu-delete-object")

    const nameElement = document.getElementById('select-delete-resource-name')
    const saveButton = document.getElementById('delete-save-button')

    const objects = findOPTObjectsDeclared(uuid)
    fillFindAndEditSelectsPopupMenu(objects, nameElement, steps)

    saveButton.setAttribute('uuid', uuid)

}