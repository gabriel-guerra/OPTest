////
// Create methods
function buildCreateObjectView(uuid, steps){
    clearDetailsCreationData()

    if (document.getElementById("menu-create-object").classList.contains("show")) return
    openPopUpMenu("menu-create-object")

    const typeDefinition = document.getElementById('input-create-resource-type-definition')
    const name = document.getElementById('input-create-resource-name')
    const description = document.getElementById('input-create-resource-description')
    const primaryParentId = document.getElementById('input-create-resource-primary-parent')
    const tableFields = document.getElementById('table-create-fields')
    const tableParents = document.getElementById('table-create-parents')
    const tableChildren = document.getElementById('table-create-children')
    const saveButton = document.getElementById('create-save-button')

    typeDefinition.value = steps.additional_information.type_definition
    name.value = steps.additional_information.name
    description.value = steps.additional_information.description
    primaryParentId.value = steps.additional_information.primary_parent_id
    saveButton.setAttribute('uuid', uuid)
    
    let trf = 0
    for (const obj of steps.additional_information.fields_list){
        for (const [key, value] of Object.entries(obj)){
            const row = document.createElement('tr')
            row.id = `creation_fields_tr_${trf}`

            const field = document.createElement('td')
            const val = document.createElement('td')
            const buttons = document.createElement('td')

            field.innerHTML = key
            val.innerHTML = value
            buttons.innerHTML = `
                <button type="button" reference="creation_fields_tr_${trf}" position="above" onclick="addTrRow(this)">Add above</button>
                <button type="button" reference="creation_fields_tr_${trf}" position="below" onclick="addTrRow(this)">Add below</button>
                <button type="button" reference="creation_fields_tr_${trf}" onclick="removeTr(this)">Remove</button>
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

    let trp = 0
    for (const parent of steps.additional_information.parents_list){
        const row = document.createElement('tr')
        row.id = `creation_parents_tr_${trp}`

        const id = document.createElement('td')
        const buttons = document.createElement('td')

        id.innerHTML = parent
        buttons.innerHTML = `
            <button type="button" reference="creation_parents_tr_${trp}" position="above" onclick="addTrRow(this)">Add above</button>
            <button type="button" reference="creation_parents_tr_${trp}" position="below" onclick="addTrRow(this)">Add below</button>
            <button type="button" reference="creation_parents_tr_${trp}" onclick="removeTr(this)">Remove</button>
        `

        id.setAttribute("contenteditable", "true")

        row.appendChild(id)
        row.appendChild(buttons)
        tableParents.appendChild(row)

        trp++
    }

    let trc = 0
    for (const children of steps.additional_information.children_list){
        const row = document.createElement('tr')
        row.id = `creation_children_tr_${trc}`

        const id = document.createElement('td')
        const buttons = document.createElement('td')

        id.innerHTML = children
        buttons.innerHTML = `
            <button type="button" reference="creation_children_tr_${trc}" position="above" onclick="addTrRow(this)">Add above</button>
            <button type="button" reference="creation_children_tr_${trc}" position="below" onclick="addTrRow(this)">Add below</button>
            <button type="button" reference="creation_children_tr_${trc}" onclick="removeTr(this)">Remove</button>
        `

        id.setAttribute("contenteditable", "true")

        row.appendChild(id)
        row.appendChild(buttons)
        tableChildren.appendChild(row)

        trc++
    }
}

////
// Update Fields

function buildUpdateFieldsView(uuid, steps){
    clearDetailsUpdateData()

    if (document.getElementById("menu-update-fields").classList.contains("show")) return
    openPopUpMenu("menu-update-fields")

    const name = document.getElementById('input-update-resource-name')
    const tableFields = document.getElementById('table-update-fields')
    const saveButton = document.getElementById('update-save-button')

    name.value = steps.additional_information.name
    saveButton.setAttribute('uuid', uuid)
    
    let trf = 0
    for (const obj of steps.additional_information.fields_list){
        for (const [key, value] of Object.entries(obj)){
            const row = document.createElement('tr')
            row.id = `update_fields_tr_${trf}`

            const field = document.createElement('td')
            const val = document.createElement('td')
            const buttons = document.createElement('td')

            field.innerHTML = key

            if (Array.isArray(value)){
                val.setAttribute("op-multivalue", "true")
            }
            val.innerHTML = value
            buttons.innerHTML = `
                <button type="button" reference="update_fields_tr_${trf}" position="above" onclick="addTrRow(this)">Add above</button>
                <button type="button" reference="update_fields_tr_${trf}" position="below" onclick="addTrRow(this)">Add below</button>
                <button type="button" reference="update_fields_tr_${trf}" onclick="removeTr(this)">Remove</button>
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

    const name = document.getElementById('input-update-associate-resource-name')
    const associationType = document.getElementById('input-update-associate-association-type')
    const typeDefinition = document.getElementById('input-update-associate-type-definition')
    const tableFields = document.getElementById('table-update-associate')
    const saveButton = document.getElementById('update-associate-save-button')

    name.value = steps.additional_information.name
    typeDefinition.value = steps.additional_information.type_definition
    for (const child of associationType.children){
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

            field.innerHTML = key
            val.innerHTML = value
            buttons.innerHTML = `
                <button type="button" reference="associate_fields_tr_${trf}" position="above" onclick="addTrRow(this)">Add above</button>
                <button type="button" reference="associate_fields_tr_${trf}" position="below" onclick="addTrRow(this)">Add below</button>
                <button type="button" reference="associate_fields_tr_${trf}" onclick="removeTr(this)">Remove</button>
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
    if (document.getElementById("menu-start_workflow").classList.contains("show")) return
    openPopUpMenu("menu-start_workflow")

    const name = document.getElementById('input-start_workflow-resource-name')
    const wfName = document.getElementById('input-start_workflow-name')
    const saveButton = document.getElementById('start_workflow-save-button')

    name.value = steps.additional_information.name
    wfName.value = steps.additional_information.workflow_name
    saveButton.setAttribute('uuid', uuid)

}

////
// Transition Workflow

function buildTransitionWorkflowView(uuid, steps){
    if (document.getElementById("menu-transition_workflow").classList.contains("show")) return
    openPopUpMenu("menu-transition_workflow")

    const name = document.getElementById('input-transition_workflow-resource-name')
    const wfAction = document.getElementById('input-transition_workflow-name')
    const saveButton = document.getElementById('transition_workflow-save-button')

    name.value = steps.additional_information.name
    wfAction.value = steps.additional_information.action_name
    saveButton.setAttribute('uuid', uuid)

}

////
// Delete Object

function buildDeleteView(uuid, steps){
    if (document.getElementById("menu-delete-object").classList.contains("show")) return
    openPopUpMenu("menu-delete-object")

    const name = document.getElementById('input-delete-resource-name')
    const saveButton = document.getElementById('delete-save-button')

    name.value = steps.additional_information.name
    saveButton.setAttribute('uuid', uuid)

}