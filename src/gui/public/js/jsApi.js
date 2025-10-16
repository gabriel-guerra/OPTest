setup();

document.querySelectorAll('form').forEach(form => {
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const action = event.submitter.value;
        if(action === "create_object") {
            saveCreateObjectData()
        }else if (action === "update_field"){
            saveUpdateFieldsData()
        }else if (action === 'start_workflow'){
            saveStartWorkflowData()
        }else if (action === 'transition_workflow'){
            saveTransitionWorkflowData()
        }else if (action === 'update_field_associate_objects'){
            saveUpdateOnAssociateData()
        }else if (action === 'delete_object'){
            saveDeleteData()
        }else if (action === 'save_new_test'){
            saveNewTest()
        }else if (action === 'env_file'){
            writeEnvFile()
        }
    });
});


async function setup() {
    if (window.pywebview && pywebview.api) {
        const input = document.querySelector('#input-test-folder');
        let folder = ""

        if (input.value === ""){
            folder = await pywebview.api.get_default_test_folder();
            input.value = folder;
        }else{
            folder = input.value
        }

        localStorage.setItem("envFile", await pywebview.api.get_default_env_file())
        buildEnvSettingsMenu()

        await getTestFiles(folder)
    } else {
        setTimeout(setup, 50);
    }
}

async function selectedTests() {
    const select = document.getElementById('tests-list');
    const selected = Array.from(select.selectedOptions).map(option => option.value);
    return selected
}

async function getTestFiles(folder) {
    const files = await pywebview.api.get_files_in_folder(folder)
    const select = document.getElementById('tests-list');
    for (const f of files){
        if (f === '__init__.py') continue
        const option = document.createElement('option')
        option.innerHTML = f
        option.setAttribute("value", f)
        select.appendChild(option)
    }
    return
}

async function runTest() {
    document.getElementById("log-output").textContent = ""
    tests = await selectedTests()
    const folder = document.getElementById('input-test-folder').value
    await pywebview.api.run_test(folder, tests)
}



/**
 * Log Methods
 */
function addLineOnLog(line) {
    document.getElementById("log-output").textContent += line + "\n";
}   

function commandFinished(code) {
    addLineOnLog("Process finished with code " + code);
}

function toggleLogOutput(){
    const logOutput = document.getElementById('log-output')
    const hidden = logOutput.getAttribute('hidden')

    if (hidden){
        logOutput.removeAttribute('hidden')
    }else{
        logOutput.setAttribute('hidden', 'hidden')
    }
}

/**
 * Navigation methods
 */
async function loadEditTestPage(){
    const tests = await selectedTests()
    if (tests.length === 0){
        alert('Choose one test to edit.')
        return
    }
    if (tests.length > 1){
        alert('Choose only one test to edit.')
        return
    }
    const url = await pywebview.api.get_edit_test_page_url()
    const folderPath = document.getElementById('input-test-folder')

    localStorage.setItem("folderPath", folderPath.value)
    localStorage.setItem("testName", tests[0])

    const data = await pywebview.api.get_test_steps(folderPath.value, tests[0])
    localStorage.setItem("data", JSON.stringify(data));
    window.location.href = `${url}`;
}

async function loadIndexPage(){
    const url = await pywebview.api.get_index_page_url()
    window.location.href = url;
}

async function returnToIndexPage(){
    saveOperationsData()

    // Get localStorage data
    const operations = JSON.parse(localStorage.getItem("operations"))
    const pathEnvFile = localStorage.getItem("envFile")
    const folderPath = localStorage.getItem("folderPath")
    const testName = localStorage.getItem("testName")

    await pywebview.api.save_operations_data(pathEnvFile, folderPath, testName, operations)
    
    clearLocalStorage()
    await loadIndexPage()
}

/**
 * Popup menu
 */
function closePopUpMenu(menuId){
    const menu = document.getElementById(menuId)
    menu.close()

    if (window.location.href.includes('test-edit')){
        clearActionsTable()
        buildActionsTable()
    }
}

function openPopUpMenu(menuId){
    const menu = document.getElementById(menuId)
    menu.showModal()
}

async function buildCreateTest(){
    if (document.getElementById("menu-create-test-file").classList.contains("show")) return
    openPopUpMenu("menu-create-test-file")
    
    document.querySelector('#menu-create-test-file').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

async function callBuildEnvSettingsMenu(){
    openPopUpMenu('menu-setting');
    buildEnvSettingsMenu()
}

async function buildEnvSettingsMenu(){
    const input = document.getElementById('input-env-file')

    if (input.value === ''){
        input.value = localStorage.getItem("envFile")
    }

    const data = await pywebview.api.get_data_env_file(input.value);
    const { url, username, password } = data;

    const inputUrl = document.getElementById('input-op-url')
    const inputUsername = document.getElementById('input-op-username')
    const inputPassword = document.getElementById('input-op-password')

    inputUrl.value = url
    inputUsername.value = username
    inputPassword.value = password

    loadEnvVariables(input.value)

}


/**
 * Test Operations
 */
function saveOperationsData(){
    localStorage.setItem("operations", JSON.stringify(operations));
}

function clearLocalStorage(){
    const folderPath = localStorage.getItem("folderPath")
    localStorage.clear()
    localStorage.setItem("envFile", folderPath)
}

async function saveNewTest(){
    const inputPath = document.getElementById("input-test-folder")
    const inputName = document.getElementById("input-new-test")

    await pywebview.api.create_new_test(inputPath.value, inputName.value)
    loadIndexPage()
}

async function deleteTest(){
    let message = ''
    const selected = await selectedTests()

    if (selected.length === 0){
        alert('Choose at least one test to delete.')
        return
    }else if (selected.length > 1){
        message = `Do you want to delete ${selected.length} tests?`
    }else{
        message = `Do you want to delete ${selected[0]}?`
    }

    const inputPath = document.getElementById("input-test-folder")

    if (window.confirm(message)) {
        await pywebview.api.delete_tests(inputPath.value, selected)
    }

    loadIndexPage()
}

async function findTestFolder(){
    const fullpath = await pywebview.api.find_test_folder()

    if (fullpath){
        const input = document.getElementById('input-test-folder')
        input.value = fullpath
        clearTestFileList()
        setup()
    }
}

function clearTestFileList(){
    const select = document.getElementById('tests-list');
    select.innerHTML = ``
}


/**
 * Environment Variables File
 */
async function findEnvFile(){
    const path = await pywebview.api.find_env_file()

    if (path){
        const input = document.getElementById('input-env-file')
        input.value = path
    }

    buildEnvSettingsMenu()
}

async function loadEnvVariables(fullPath){
    await pywebview.api.load_env_variables(fullPath)
}

async function createEnvFile(){
    const path = await pywebview.api.create_env_file()
    const input = document.getElementById('input-env-file')
    input.value = path

    buildEnvSettingsMenu()
}

async function writeEnvFile(){
    const input = document.getElementById('input-env-file')
    const inputUrl = document.getElementById('input-op-url')
    const inputUsername = document.getElementById('input-op-username')
    const inputPassword = document.getElementById('input-op-password')

    const data = {
        "url": inputUrl.value,
        "username": inputUsername.value,
        "password": inputPassword.value
    }

    localStorage.setItem("envFile", `${input.value}`)
    await pywebview.api.write_env_file(input.value, data)
    await loadEnvVariables(input.value)

    closePopUpMenu('menu-setting')
}