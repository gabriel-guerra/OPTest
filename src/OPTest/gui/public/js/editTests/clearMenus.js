function clearDetailsCreationData(){
    // Creation
    const creationFields = document.getElementById("table-create-fields")
    const creationParents = document.getElementById("table-create-parents")
    const creationChildren = document.getElementById("table-create-children")
    const safeDeleteCheckbox = document.getElementById('safe-delete-checkbox')
                
    creationFields.innerHTML =`
        <tr>
            <th>Field</th>
            <th>Value</th>
            <th>Action</th>
        </tr>
    `
    creationParents.innerHTML = `
        <tr>
            <th>Parant ID</th>
            <th>Action</th>
        </tr>
    `
    creationChildren.innerHTML = `  
        <tr>
            <th>Child ID</th>
            <th>Action</th>
        </tr>
    `

    safeDeleteCheckbox.checked = true
}

function clearDetailsUpdateData(){
    // Update Fields
    const updateFields = document.getElementById("table-update-fields")
    const selectUpdate = document.getElementById('select-update-resource-name')
    
    updateFields.innerHTML =`
    <tr>
    <th>Field</th>
    <th>Value</th>
    <th>Action</th>
    </tr>
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
    <tr>
            <th>Field</th>
            <th>Value</th>
            <th>Action</th>
        </tr>
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