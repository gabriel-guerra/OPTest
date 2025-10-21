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
                row.id = `creation_fields_tr_${getConterTableRows('trc')}`
                const newRow = prepareEmptyRow(row)
           
                const rowChildren = newRow.children
                rowChildren[0].innerHTML = key

                try{
                    let parsedValue;

                    if (Array.isArray(value)){
                        parsedValue = value
                    }else{
                        const val = value.replace(/'/g, '"');
                        parsedValue = JSON.parse(val)
                    }

                    const ul = document.createElement('ul')
                    for (const val of parsedValue){
                        const li = document.createElement('li')
                        li.contentEditable = true
                        li.textContent = val
                        ul.appendChild(li)
                        setMultivalueEventListener(li)
                    }

                    rowChildren[1].appendChild(ul)
                }catch(error){
                    rowChildren[1].innerHTML = value
                }

                tbodyFields.appendChild(newRow)
            }
        }
    }else{
        const row = document.createElement('tr')
        row.id = `creation_fields_tr_${getConterTableRows('trc')}`
        const newRow = prepareEmptyRow(row)
        tbodyFields.appendChild(newRow)
    }

    if (steps.additional_information.parents_list.length > 0){
        for (const parent of steps.additional_information.parents_list){
            const row = document.createElement('tr')
            row.id = `creation_parents_tr_${getConterTableRows('trc')}`
            const newRow = prepareEmptyRow(row)
            
            const rowChildren = newRow.children[0].children
            rowChildren[0].value = parent
            
            tbodyParents.appendChild(newRow)
        }
    }else{
        const row = document.createElement('tr')
        row.id = `creation_parents_tr_${getConterTableRows('trc')}`
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
    const tbodyFields = document.getElementById('update_fields_tbody')
    const saveButton = document.getElementById('update-save-button')

    const objects = findOPTObjectsDeclared(uuid)
    fillFindAndEditSelectsPopupMenu(objects, nameElement, steps)

    saveButton.setAttribute('uuid', uuid)

    for (const obj of steps.additional_information.fields_list){
        for (const [key, value] of Object.entries(obj)){
            const row = document.createElement('tr')
            row.id = `update_fields_tr_${getConterTableRows('trc')}`
            const newRow = prepareEmptyRow(row)
           
            const rowChildren = newRow.children
            rowChildren[0].innerHTML = key

            try{
                let parsedValue;

                if (Array.isArray(value)){
                    parsedValue = value
                }else{
                    const val = value.replace(/'/g, '"');
                    parsedValue = JSON.parse(val)
                }

                const ul = document.createElement('ul')
                for (const val of parsedValue){
                    const li = document.createElement('li')
                    li.contentEditable = true
                    li.textContent = val
                    ul.appendChild(li)
                    setMultivalueEventListener(li)
                }
                
                rowChildren[1].appendChild(ul)
            }catch(error){
                rowChildren[1].innerHTML = value
            }

            tbodyFields.appendChild(newRow)
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
    const tbodyFields = document.getElementById('update_associate_tbody')
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

    for (const obj of steps.additional_information.fields_list){
        for (const [key, value] of Object.entries(obj)){
            const row = document.createElement('tr')
            row.id = `associate_fields_tr_${getConterTableRows('trc')}`
            const newRow = prepareEmptyRow(row)
           
            const rowChildren = newRow.children
            rowChildren[0].innerHTML = key

            try{
                let parsedValue;

                if (Array.isArray(value)){
                    parsedValue = value
                }else{
                    const val = value.replace(/'/g, '"');
                    parsedValue = JSON.parse(val)
                }

                const ul = document.createElement('ul')
                for (const val of parsedValue){
                    const li = document.createElement('li')
                    li.contentEditable = true
                    li.textContent = val
                    ul.appendChild(li)
                    setMultivalueEventListener(li)
                }
                
                rowChildren[1].appendChild(ul)
            }catch(error){
                rowChildren[1].innerHTML = value
            }

            tbodyFields.appendChild(newRow)
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

function buildAddAssociationView(uuid, steps){
    clearDetailsNewAssociation()

    // Open Dialog menu
    if (document.getElementById("menu-add-associate-object").classList.contains("show")) return
    openPopUpMenu("menu-add-associate-object")

    const nameElement = document.getElementById('select-add-associate-object-name')
    const associationTypeElement = document.getElementById('input-add-associate-object-type')
    
    for (const childElement of associationTypeElement.children){
        if (childElement.value === steps.additional_information.association_type){
            childElement.setAttribute("selected", "true")
        }
    }
        
    const tbodyAssociation = document.getElementById('add_associate_tbody')
    const saveButton = document.getElementById('add-associate-object-save-button')
    saveButton.setAttribute('uuid', uuid)

    const objects = findOPTObjectsDeclared(uuid)
    fillFindAndEditSelectsPopupMenu(objects, nameElement, steps)

    console.log(steps.additional_information.association_list)
    console.log(typeof steps.additional_information.association_list)
    console.log(steps.additional_information.association_list.length > 0)

    if (steps.additional_information.association_list.length > 0){
        for (const parent of steps.additional_information.association_list){
            const row = document.createElement('tr')
            row.id = `creation_parents_tr_${getConterTableRows('trc')}`
            const newRow = prepareEmptyRow(row)
            
            const rowChildren = newRow.children[0].children
            rowChildren[0].value = parent
            
            tbodyAssociation.appendChild(newRow)
        }
    }

}