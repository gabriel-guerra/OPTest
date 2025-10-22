function saveCreateObjectData(){
    const saveButton = document.getElementById('create-save-button')
    const uuid = saveButton.getAttribute('uuid')
    saveButton.setAttribute("uuid", "")

    if (uuid){
        const typeDefinition = document.getElementById('input-create-resource-type-definition')
        const name = document.getElementById('input-create-resource-name')
        const description = document.getElementById('input-create-resource-description')
        const primaryParentId = document.getElementById('input-create-resource-primary-parent')
        const safeDeleteCheckbox = document.getElementById('safe-delete-checkbox')

        const fields = []
        const parents = []
        const children = []
        
        for (const row of document.querySelectorAll('#creation_fields_tbody > tr:not(:first-child)')) {
            const cells = row.children
            
            if (cells[0].textContent.trim() === "" || cells[1].textContent.trim() === "") continue

            if (cells[1].querySelector('ul')){
                const lis = Array.from(cells[1].querySelector('ul').children)
                const multivalues = lis.filter(li => li.textContent.trim() !== '').map(li => li.textContent.trim())

                const obj = { [cells[0].textContent.trim()]: multivalues }
                fields.push(obj)
            }else{
                const obj = { [cells[0].textContent.trim()]: cells[1].textContent.trim() }
                fields.push(obj)
            }

        }
        
        for (const row of document.querySelectorAll('#creation_parents_tbody > tr:not(:first-child)')) {
            const cells = row.children
            const fistCellChild = cells[0].firstChild
            if (fistCellChild.value === "") continue
            parents.push(fistCellChild.value)
        }
        
        for (const row of document.querySelectorAll('#creation_children_tbody > tr:not(:first-child)')) {
            const cells = row.children
            const fistCellChild = cells[0].firstChild
            if (fistCellChild.value === "") continue
            children.push(fistCellChild.value)
        }

        const formatName = name.value.replace(/ /g, "_").replace(/-/g, "_").toLowerCase()
        const newValues = {
            "uuid": uuid,
            "reference": formatName,
            "action_type": "create_object",
            "action_information": `Create: ${name.value} (${typeDefinition.value})`,
            "safe_delete": safeDeleteCheckbox.checked,
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

    closePopUpMenu('menu-create-object')

}

function saveUpdateFieldsData(){
    const saveButton = document.getElementById('update-save-button')
    const uuid = saveButton.getAttribute('uuid')
    saveButton.setAttribute("uuid", "")

    if (uuid){
        
        const name = document.getElementById('select-update-resource-name')
        
        const fields = []
        
        for (const row of document.querySelectorAll('#update_fields_tbody > tr:not(:first-child)')) {
            const cells = row.children         

            if (cells[0].textContent.trim() === "" || cells[1].textContent.trim() === "") continue

            if (cells[1].querySelector('ul')){
                const lis = Array.from(cells[1].querySelector('ul').children)
                const multivalues = lis.filter(li => li.textContent.trim() !== '').map(li => li.textContent.trim())
                
                const obj = { [cells[0].textContent.trim()]: multivalues }
                fields.push(obj)
            }else{
                const obj = { [cells[0].textContent.trim()]: cells[1].textContent.trim() }
                fields.push(obj)
            }

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

    closePopUpMenu("menu-update-fields")
}

function saveUpdateOnAssociateData(){
    const saveButton = document.getElementById('update-associate-save-button')
    const uuid = saveButton.getAttribute('uuid')
    saveButton.setAttribute("uuid", "")

    if (uuid){
        const name = document.getElementById('select-update-associate-resource-name')
        const associationTypeElement = document.getElementById('input-update-associate-association-type')
        const associationType = associationTypeElement.selectedOptions[0]
        const typeDefinition = document.getElementById('input-update-associate-type-definition')
        
        const fields = []
        
        for (const row of document.querySelectorAll('#tupdate_associate_tbody > tr:not(:first-child)')) {
            const cells = row.children
            
            if (cells[0].textContent.trim() === "" || cells[1].textContent.trim() === "") continue

            if (cells[1].querySelector('ul')){
                const lis = Array.from(cells[1].querySelector('ul').children)
                const multivalues = lis.filter(li => li.textContent.trim() !== '').map(li => li.textContent.trim())
                
                const obj = { [cells[0].textContent.trim()]: multivalues }
                fields.push(obj)
            }else{
                const obj = { [cells[0].textContent.trim()]: cells[1].textContent.trim() }
                fields.push(obj)
            }
        }
        
        const formatName = name.value.replace(/ /g, "_").replace(/-/g, "_").toLowerCase()
        const newValues = {
            "uuid": uuid,
            "reference": formatName,
            "action_type": "update_field_associate_objects",
            "action_information": `Update field(s) in ${associationType.value} of ${name.value}`,
            "additional_information": {
                "name": name.value,
                "association_type": associationType.value,
                "type_definition": typeDefinition.value,
                "fields_list": fields,
            }
        }
                
        operations[uuid] = newValues
    }

    closePopUpMenu('menu-update-associate')
}

function saveStartWorkflowData(){
    const saveButton = document.getElementById('start_workflow-save-button')
    const uuid = saveButton.getAttribute('uuid')
    saveButton.setAttribute("uuid", "")

    if (uuid){
        const name = document.getElementById('select-start_workflow-resource-name')
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

    closePopUpMenu('menu-start_workflow')
}


function saveTransitionWorkflowData(){
    const saveButton = document.getElementById('transition_workflow-save-button')
    const uuid = saveButton.getAttribute('uuid')
    saveButton.setAttribute("uuid", "")

    if (uuid){
        const name = document.getElementById('select-transition_workflow-resource-name')
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

    closePopUpMenu('menu-transition_workflow')
}

function saveDeleteData(){
    const saveButton = document.getElementById('delete-save-button')
    const uuid = saveButton.getAttribute('uuid')
    saveButton.setAttribute("uuid", "")

    if (uuid){
        const name = document.getElementById('select-delete-resource-name')

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

    closePopUpMenu('menu-delete-object')

}

function saveAddAssociationData(){
    const saveButton = document.getElementById('add-associate-object-save-button')
    const uuid = saveButton.getAttribute('uuid')
    saveButton.setAttribute("uuid", "")

    if (uuid){
        const name = document.getElementById('select-add-associate-object-name')
        const associationTypeElement = document.getElementById('input-add-associate-object-type')
        const associationType = associationTypeElement.selectedOptions[0]
        
        const associations = []
        
        for (const row of document.querySelectorAll('#add_associate_tbody > tr:not(:first-child)')) {
            const cells = row.children
            const fistCellChild = cells[0].firstChild
            if (fistCellChild.value === "") continue
            associations.push(fistCellChild.value)
        }
        
        const formatName = name.value.replace(/ /g, "_").replace(/-/g, "_").toLowerCase()
        const newValues = {
            "uuid": `${uuid}`,
            "reference": formatName,
            "action_type": "add_associate_object",
            "action_information": `Associate ${associationType.value} to ${name.value}`,
            "additional_information": {
                "association_type": associationType.value,
                "association_list": associations,
            }
        }
                
        operations[uuid] = newValues
    }

    closePopUpMenu('menu-add-associate-object')
}

function saveLoadExistingObjectData(){
    const saveButton = document.getElementById('load-existing-object-save-button')
    const uuid = saveButton.getAttribute('uuid')
    saveButton.setAttribute("uuid", "")

    if (uuid){
        const name = document.getElementById('input-load-existing-object-name')
        const typeDefinition = document.getElementById('input-load-existing-object-type')

        const formatName = name.value.replace(/ /g, "_").replace(/-/g, "_").toLowerCase()
        const newValues = {
            "uuid": uuid,
            "reference": formatName,
            "action_type": "load_existing_object",
            "action_information": `Load GRC object ${name.value}`,
            "additional_information": {
                "type_definition": typeDefinition.value,
                "name": name.value
            }
        }
        operations[uuid] = newValues
    }

    closePopUpMenu('menu-load-existing-object')
}