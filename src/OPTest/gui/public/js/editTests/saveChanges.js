function saveCreateObjectData(){
    const saveButton = document.getElementById('create-save-button')
    const uuid = saveButton.getAttribute('uuid')
    saveButton.setAttribute("uuid", "")

    if (uuid){
        const typeDefinition = document.getElementById('input-create-resource-type-definition')
        const name = document.getElementById('input-create-resource-name')
        const description = document.getElementById('input-create-resource-description')
        const primaryParentId = document.getElementById('input-create-resource-primary-parent')
        
        const fields = []
        const parents = []
        const children = []
        
        for (const row of document.querySelectorAll('#table-create-fields > tr:not(:first-child)')) {
            const cells = row.children
            
            if (cells[0].textContent === "" || cells[1].textContent === "") continue
            
            const obj = {
                [cells[0].textContent]: cells[1].textContent
            }
            fields.push(obj)
        }
        
        for (const row of document.querySelectorAll('#table-create-parents > tr:not(:first-child)')) {
            const cells = row.children
            
            if (cells[0].textContent === "") continue
            
            parents.push(cells[0].textContent)
        }
        
        for (const row of document.querySelectorAll('#table-create-children > tr:not(:first-child)')) {
            const cells = row.children
            
            if (cells[0].textContent === "") continue
            
            children.push(cells[0].textContent)
        }
        
        const formatName = name.value.replace(/ /g, "_").replace(/-/g, "_").toLowerCase()
        const newValues = {
            "uuid": uuid,
            "reference": formatName,
            "action_type": "create_object",
            "action_information": `Create: ${name.value} (${typeDefinition.value})`,
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
}

function saveUpdateFieldsData(){
    const saveButton = document.getElementById('update-save-button')
    const uuid = saveButton.getAttribute('uuid')
    saveButton.setAttribute("uuid", "")

    if (uuid){
        
        const name = document.getElementById('input-update-resource-name')
        
        const fields = []
        
        for (const row of document.querySelectorAll('#table-update-fields > tr:not(:first-child)')) {
            const cells = row.children
            
            if (cells[0].textContent === "" || cells[1].textContent === "") continue
            
            let obj = '';
            if (cells[1].getAttribute('op-multivalue') === 'true'){
                obj = {
                    [cells[0].textContent]: cells[1].textContent.split(',')
                }
            }else{
                obj = {
                    [cells[0].textContent]: cells[1].textContent
                }
            }
            fields.push(obj)
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
}

function saveUpdateOnAssociateData(){
    const saveButton = document.getElementById('update-associate-save-button')
    const uuid = saveButton.getAttribute('uuid')
    saveButton.setAttribute("uuid", "")

    if (uuid){
        const name = document.getElementById('input-update-associate-resource-name')
        const associationTypeElement = document.getElementById('input-update-associate-association-type')
        const associationType = associationTypeElement.selectedOptions[0]
        const typeDefinition = document.getElementById('input-update-associate-type-definition')
        
        const fields = []
        
        for (const row of document.querySelectorAll('#table-update-associate > tr:not(:first-child)')) {
            const cells = row.children
            
            if (cells[0].textContent === "" || cells[1].textContent === "") continue
            
            const obj = {
                [cells[0].textContent]: cells[1].textContent
            }
            fields.push(obj)
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
}

function saveStartWorkflowData(){
    const saveButton = document.getElementById('start_workflow-save-button')
    const uuid = saveButton.getAttribute('uuid')
    saveButton.setAttribute("uuid", "")

    if (uuid){
        const name = document.getElementById('input-start_workflow-resource-name')
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
}


function saveTransitionWorkflowData(){
    const saveButton = document.getElementById('transition_workflow-save-button')
    const uuid = saveButton.getAttribute('uuid')
    saveButton.setAttribute("uuid", "")

    if (uuid){
        const name = document.getElementById('input-transition_workflow-resource-name')
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
}

function saveDeleteData(){
    const saveButton = document.getElementById('delete-save-button')
    const uuid = saveButton.getAttribute('uuid')
    saveButton.setAttribute("uuid", "")

    if (uuid){
        const name = document.getElementById('input-delete-resource-name')

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
}