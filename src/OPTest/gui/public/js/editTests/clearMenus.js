function clearDetailsCreationData(){
    // Creation
    const creationFields = document.getElementById("table-create-fields")
    const creationParents = document.getElementById("table-create-parents")
    const creationChildren = document.getElementById("table-create-children")
                
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
}

function clearDetailsUpdateData(){
    // Update Fields
    const updateFields = document.getElementById("table-update-fields")
    updateFields.innerHTML =`
    <tr>
    <th>Field</th>
    <th>Value</th>
    <th>Action</th>
    </tr>
    `
}

function clearDetailsUpdateAssociateData(){
    // Update Fields
    const updateAssociate = document.getElementById("table-update-associate")           
    updateAssociate.innerHTML =`
        <tr>
            <th>Field</th>
            <th>Value</th>
            <th>Action</th>
        </tr>
    `
}