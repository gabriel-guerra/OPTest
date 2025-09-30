setup();

async function setup() {
    if (window.pywebview && pywebview.api) {
        const folder = await fillDefaultTestFolder();
        await getTestFiles(folder)
    } else {
        setTimeout(setup, 50);
    }
}

async function fillDefaultTestFolder(){
    const input = document.querySelector('#input-test-folder');
    const testFolder = await pywebview.api.get_test_folder();
    input.value = testFolder;
    return testFolder;
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
}

async function runTest() {
    tests = await selectedTests()
    const folder = document.getElementById('input-test-folder').value
    await pywebview.api.run_test(folder, tests)
}
