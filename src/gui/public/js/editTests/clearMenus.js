function clearDetailsCreationData(){
    // Creation
    const creationFields = document.getElementById("table-create-fields")
    const creationParents = document.getElementById("table-create-parents")
    const creationChildren = document.getElementById("table-create-children")
    const safeDeleteCheckbox = document.getElementById('safe-delete-checkbox')
                
    creationFields.innerHTML =`
        <tbody id="creation_fields_tbody">
            <tr>
                <th>Field</th>
                <th>Value</th>
                <th>Actions</th>
            </tr>
        </tbody>
    `
    creationParents.innerHTML = `
        <tbody id="creation_parents_tbody">
            <tr>
                <th>Parant ID</th>
                <th>Action</th>
            </tr>
        </tbody>
    `
    creationChildren.innerHTML = `  
        <tbody id="creation_children_tbody">
            <tr>
                <th>Child ID</th>
                <th>Action</th>
            </tr>
        </tbody>
    `

    safeDeleteCheckbox.checked = true
}

function clearDetailsUpdateData(){
    // Update Fields
    const updateFields = document.getElementById("table-update-fields")
    const selectUpdate = document.getElementById('select-update-resource-name')
    
    updateFields.innerHTML =`
        <tbody id="update_fields_tbody">
            <tr>
                <th>Field</th>
                <th>Value</th>
                <th>Actions</th>
            </tr>
        </tbody>
    `
    selectUpdate.innerHTML = `
    <option value="" disabled selected>Select an object</option>
    `
}

function clearDetailsUpdateAssociateData(){
    // Update Fields
    const updateAssociate = document.getElementById("table-update-associate")           
    const selectUpdate = document.getElementById('select-update-associate-resource-name')
    
    updateAssociate.innerHTML =`
        <tbody id="update_associate_tbody">
            <tr>
                <th>Field</th>
                <th>Value</th>
                <th>Actions</th>
            </tr>
        </tbody>
    `

    selectUpdate.innerHTML = `
    <option value="" disabled selected>Select an object</option>
    `
}

function clearDetailsStartWorkflow(){
    const selectUpdate = document.getElementById('select-start_workflow-resource-name')
    selectUpdate.innerHTML = `
    <option value="" disabled selected>Select an object</option>
    `
}

function clearDetailsTransitionWorkflow(){
    const selectUpdate = document.getElementById('select-transition_workflow-resource-name')
    selectUpdate.innerHTML = `
    <option value="" disabled selected>Select an object</option>
    `
}

function clearDetailsDeleteObject(){
    const selectUpdate = document.getElementById('select-delete-resource-name')
    selectUpdate.innerHTML = `
    <option value="" disabled selected>Select an object</option>
    `
}

function clearDetailsNewAssociation(){
    const addAssociationTable = document.getElementById("table-add-associate-object")
    const selectUpdate = document.getElementById('select-add-associate-object-name')
    
    selectUpdate.innerHTML = `
    <option value="" disabled selected>Select an object</option>
    `
    
    addAssociationTable.innerHTML = `
        <tbody id="add_associate_tbody">
            <tr>
                <th>Object ID</th>
                <th>Action</th>
            </tr>
        </tbody>
    `
}