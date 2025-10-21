import sys
import uuid
import ast
import os
import webview
from pathlib import Path
from importlib.metadata import version
import subprocess
import threading
from subprocess import call, run

PROJECT_ROOT = Path.cwd()

TESTS_DIR = os.path.join(PROJECT_ROOT, "tests")
os.makedirs(TESTS_DIR, exist_ok=True)

BASE_DIR = getattr(sys, "_MEIPASS", os.path.dirname(os.path.abspath(__file__)))
CLASSES_DIR = os.path.join(PROJECT_ROOT, "classes")
sys.path.append(CLASSES_DIR)

os.environ["CLASSES_DIR"] = CLASSES_DIR

HTML_FILE = os.path.join(BASE_DIR, "gui", "public", "html", "index.html")

class Api:
    def __init__(self):
        self.process = None

    def get_main_repo(self):
        return BASE_DIR
    
    def get_default_test_folder(self):
        return TESTS_DIR
    
    def get_files_in_folder(self, folder_path):
        folder = Path(folder_path)
        files = [f.name for f in folder.iterdir() if f.is_file() and f.suffix == ".py"]
        return files

    def run_test(self, folder, tests):
        if len(tests) == 0:
            window.evaluate_js("alert('Choose one or more tests to run')")
            return

        def worker():
            command_args = ["python", "-u", "-m", "unittest"]
            command_args.extend(tests)  
            self.process = subprocess.Popen(
                command_args, 
                stdout=subprocess.PIPE, 
                stderr=subprocess.STDOUT,
                text=True,
                cwd=folder,
                bufsize=1
            )

            for line in self.process.stdout:
                window.evaluate_js(f'window.addLineOnLog({line.strip()!r})')

            self.process.wait()
            window.evaluate_js(f'window.commandFinished({self.process.returncode})')
            self.process = None

        threading.Thread(target=worker, daemon=True).start()
        return "started"
    
    def stop_test(self):
        if self.process and self.process.poll() is None:
            self.process.terminate()
            try:
                self.process.wait(timeout=2)
            except subprocess.TimeoutExpired:
                self.process.kill()
            self.process = None
        return "stopped"
    
    def get_edit_test_page_url(self):
        test_edit_html = os.path.join(BASE_DIR, 'gui', 'public', 'html', 'test-edit.html')
        return test_edit_html
    
    def get_index_page_url(self):
        return HTML_FILE

    def format_commands(self, file_path):
        command = ""
        open_count = 0
        multiline_string = False
        ignore = ('#', 'import', 'from', '@', 'global', 'load_dotenv', 'op_url', 'username', 'password', 'return', 'pass', 'class', 'unittest',
                'if __name__', 'api = OPTestAPIv2', 'def')

        with open(file_path, "r", encoding="utf-8") as f:
            for line in f:
                line_strip = line.strip()
                if not line_strip or (line_strip.startswith(ignore) and not multiline_string):
                    continue

                # Start of multiline_string
                if line_strip.count('"""') % 2 == 1 or line_strip.count("'''") % 2 == 1:
                    multiline_string = not multiline_string

                command += line_strip

                # Count (), [] and {}
                if not multiline_string:
                    open_count += line_strip.count("(") + line_strip.count("[") + line_strip.count("{")
                    open_count -= line_strip.count(")") + line_strip.count("]") + line_strip.count("}")

                # if it's over, yield
                if open_count == 0 and not line_strip.endswith("\\") and not multiline_string:
                    yield command.strip()
                    command = ""

    def get_test_steps(self, folder, test):
        raw_commands = []
        test_steps = {}

        full_path = os.path.join(folder, test)
        for c in self.format_commands(full_path):
            raw_commands.append(c)

        for c in raw_commands:
            if 'OPTestGRCObject' in c:
                step = self.parse_create_object(c)
                test_steps[f"{step['uuid']}"] = step
            elif 'delete' in c:
                if 'safe_delete' in c:
                    self.add_safe_delete(c, test_steps)
                else:
                    step = self.parse_delete_object(c, test_steps)
                    test_steps[f"{step['uuid']}"] = step
            elif 'bulk_update_fields' in c:
                step = self.parse_update_fields(c, test_steps)
                test_steps[f"{step['uuid']}"] = step
            elif 'transition_workflow' in c:
                step = self.parse_transition_workflow(c, test_steps)
                test_steps[f"{step['uuid']}"] = step
            elif 'start_workflow' in c:
                step = self.parse_start_workflow(c, test_steps)
                test_steps[f"{step['uuid']}"] = step
            elif 'update_field_associate_objects' in c:
                step = self.parse_update_field_associate_objects(c, test_steps)
                test_steps[f"{step['uuid']}"] = step
            elif 'add_association' in c:
                step = self.parse_add_association_objects(c, test_steps)
                test_steps[f"{step['uuid']}"] = step

        return test_steps
    
    def add_safe_delete(self, command, all_steps):
        tmp = command[command.find('.')+1:]
        object_name = tmp[:tmp.find('.')]
        for c in all_steps.values():
            if c['reference'] == object_name and c['action_type'] == 'create_object':
                c['safe_delete'] = True

    def parse_create_object(self, command):
        # Get only params
        params_raw = command[command.find('(')+1:-1]

        # Cut API Object reference
        params = params_raw[params_raw.find(',')+1:]
        
        # Format in a list 
        s = str(params)
        s_list = "[" + s + "]"
        params_list = ast.literal_eval(s_list)

        # Format field list in JSON to be consumed in JS
        field_lists = []
        for k, v in params_list[4]:
            fd = {
                f"{k}": f"{v}"
            }
            field_lists.append(fd)

        # Generate temp identifier and wrap object around it
        uuid_code = uuid.uuid4()

        # Final format
        name = self.format_reference(params_list[1])
        step = {
            "uuid": f"{uuid_code}",
            "reference": f"{name}",
            "action_type": "create_object",
            "action_information": f"Create: {params_list[1]} ({params_list[0]})",
            "safe_delete": False,
            "additional_information": {
                "type_definition": f'{params_list[0]}', 
                "name": f'{params_list[1]}',
                "description": f'{params_list[2]}', 
                "primary_parent_id": f'{params_list[3]}',
                "fields_list": field_lists,
                "parents_list": params_list[5],
                "children_list": params_list[6]
            }
        }
        
        return step
    
    def parse_delete_object(self, command, all_steps):
        uuid_code = uuid.uuid4()

        # Get object name
        tmp = command[command.find('.')+1:]
        object_name = tmp[:tmp.find('.')]

        for value in all_steps.values():
            if value['reference'] == object_name:
                step = {
                    "uuid": f"{uuid_code}",
                    "reference": f"{object_name}",
                    "action_type": "delete_object",
                    "action_information": f"Delete: {value['additional_information']['name']}",
                    "additional_information": {
                        "name": f"{value['additional_information']['name']}",
                    }
                }
                return step
        raise Exception("Didn't find object to delete.")
            
    def parse_update_fields(self, command, all_steps):
        uuid_code = uuid.uuid4()
        
        # Get object name
        tmp = command[command.find('.')+1:]
        object_name = tmp[:tmp.find('.')]

        for value in all_steps.values():
            if value['reference'] == object_name:
                
                # Get only params
                params_raw = command[command.find('(')+1:-1]

                # Format in a list 
                params_list = ast.literal_eval(params_raw)

                # Format field list in JSON to be consumed in JS
                field_lists = []
                for item in params_list:
                    fd = {
                        f"{item[0]}": item[1]
                    }
                    field_lists.append(fd)

                step = {
                    "uuid": f"{uuid_code}",
                    "reference": f"{object_name}",
                    "action_type": "update_field",
                    "action_information": f"Update field(s) in {value['additional_information']['name']}",
                    "additional_information": {
                        "name": f"{value['additional_information']['name']}",
                        "fields_list": field_lists,
                    }
                }
                return step
        raise Exception("Didn't find object to update fields.")
            
    def parse_transition_workflow(self, command, all_steps):
        uuid_code = uuid.uuid4()
        
        # Get object name
        tmp = command[command.find('.')+1:]
        object_name = tmp[:tmp.find('.')]

        for value in all_steps.values():
            if value['reference'] == object_name:
                param = command[command.find('(')+2:-2]

                step = {
                    "uuid": f"{uuid_code}",
                    "reference": f"{object_name}",
                    "action_type": "transition_workflow",
                    "action_information": f"Transition to {param} on {value['additional_information']['name']}",
                    "additional_information": {
                        "type_definition": f"{value['additional_information']['type_definition']}",
                        "name": f"{value['additional_information']['name']}",
                        "action_name": f'{param}'
                    }
                }
                return step
        raise Exception("Didn't find object to transition workflow.")
        
    def parse_start_workflow(self, command, all_steps):
        uuid_code = uuid.uuid4()
        
        # Get object name
        tmp = command[command.find('.')+1:]
        object_name = tmp[:tmp.find('.')]

        for value in all_steps.values():
            if value['reference'] == object_name:
                param = command[command.find('(')+2:-2]

                step = {
                    "uuid": f"{uuid_code}",
                    "reference": f"{object_name}",
                    "action_type": "start_workflow",
                    "action_information": f"Start {param} on {value['additional_information']['name']}",
                    "additional_information": {
                        "name": f"{value['additional_information']['name']}",
                        "workflow_name": f'{param}', 
                    }
                }
                return step
        raise Exception("Didn't find object to start workflow.")
            
    def parse_update_field_associate_objects(self, command, all_steps):
        uuid_code = uuid.uuid4()
        
        # Get object name
        tmp = command[command.find('.')+1:]
        object_name = tmp[:tmp.find('.')]

        for value in all_steps.values():
            if value['reference'] == object_name:
                
                # Get only params
                params_raw = command[command.find('(')+1:-1]

                # Format in a list 
                s = str(params_raw)
                s_list = "[" + s + "]"
                params_list = ast.literal_eval(s_list)

                # Format field list in JSON to be consumed in JS
                field_lists = []
                for item in params_list[2]:
                    fd = {
                        f"{item[0]}": item[1]
                    }
                    field_lists.append(fd)

                step = {
                    "uuid": f"{uuid_code}",
                    "reference": f"{object_name}",
                    "action_type": "update_field_associate_objects",
                    "action_information": f"Update field(s) in {params_list[0]} of {value['additional_information']['name']}",
                    "additional_information": {
                        "name": f"{value['additional_information']['name']}",
                        "association_type": f"{params_list[0]}",
                        "type_definition": f"{params_list[1]}",
                        "fields_list": field_lists,
                    }
                }
                return step
        raise Exception("Didn't find object to update fields.")

    def parse_add_association_objects(self, command, all_steps):
        uuid_code = uuid.uuid4()
        
        # Get object name
        tmp = command[command.find('.')+1:]
        object_name = tmp[:tmp.find('.')]

        for value in all_steps.values():
            if value['reference'] == object_name:
                
                # Get only params
                params_raw = command[command.find('(')+1:-1]

                # Format in a list 
                s = str(params_raw)
                s_list = "[" + s + "]"
                params_list = ast.literal_eval(s_list)

                step = {
                    "uuid": f"{uuid_code}",
                    "reference": f"{object_name}",
                    "action_type": "add_associate_object",
                    "action_information": f"Associate {params_list[0]} to {value['additional_information']['name']}",
                    "additional_information": {
                        "association_type": f"{params_list[0]}",
                        "association_list": params_list[1],
                    }
                }
                return step
        raise Exception("Didn't find object to add associations.")
    
    def save_operations_data(self, path_env_file, folder, test, operations):
        full_path = os.path.join(folder, test)
        testName = test.replace(".py", "")

        header = self.build_test_header(path_env_file, testName)
        commands, safe_delete = self.set_test_steps(operations)

        for c in commands:
            header += f"        {c}\n"

        with open(full_path, 'w') as f:
            f.write(header)
            if safe_delete is not None:
                f.write(safe_delete)
            f.write(f'''\nif __name__ == '__main__':\n    unittest.main()''')

    def set_test_steps(self, operations):
        
        commands = []
        referenced_to_delete = []

        for v in operations.values():
            if v['action_type'] == 'create_object':
                commands.append(self.build_create_object_command(v))
                if v['safe_delete'] == True:
                    referenced_to_delete.append(v['reference'])
            elif v['action_type'] == 'delete_object':
                commands.append(self.build_delete_object_command(v))
            elif v['action_type'] == 'update_field':
                commands.append(self.build_update_field_command(v))
            elif v['action_type'] == 'transition_workflow':
                commands.append(self.build_transition_workflow_command(v))
            elif v['action_type'] == 'start_workflow':
                commands.append(self.build_start_workflow_command(v))
            elif v['action_type'] == 'update_field_associate_objects':
                commands.append(self.build_update_field_associate_object_command(v))
            elif v['action_type'] == 'add_associate_object':
                commands.append(self.build_add_association_command(v))

        if len(referenced_to_delete) > 0:
            safe_delete = self.build_safe_delete_command(referenced_to_delete)
            return commands, safe_delete
        else:
            return commands, None
    
    def build_safe_delete_command(self, referenced_to_delete):
        safe_delete = f'\n    def tearDown(self):\n'
        for obj in referenced_to_delete:
            safe_delete += (f'        self.{obj}.delete()     #safe_delete\n')
        return safe_delete

    def build_create_object_command(self, operation):
        reference = operation['reference']
        type_definition = operation['additional_information']['type_definition']
        name = operation['additional_information']['name']
        description = operation['additional_information']['description']
        primary_parent_id = int(operation['additional_information']['primary_parent_id'])
        fields_list = []

        for item in operation['additional_information']['fields_list']:
            fields_list.append((next(iter(item)), item[next(iter(item))]))

        parents_list = [int(i) for i in operation['additional_information']['parents_list']]
        children_list = [int(i) for i in operation['additional_information']['children_list']]

        command = f"self.{reference} = OPTestGRCObject(api, '{type_definition}', '{name}', '{description}', {primary_parent_id}, {fields_list}, {parents_list}, {children_list})"
        return command
    
    def build_update_field_command(self, operation):
        
        reference = operation['reference']
        fields_list = []
        
        for item in operation['additional_information']['fields_list']:
            fields_list.append((next(iter(item)), item[next(iter(item))]))

        command = f"self.{reference}.bulk_update_fields({fields_list})"
        return command
    
    def build_update_field_associate_object_command(self, operation):

        reference = operation['reference']
        association_type = operation['additional_information']['association_type']
        type_definition = operation['additional_information']['type_definition']
        fields_list = []

        for item in operation['additional_information']['fields_list']:
            fields_list.append((next(iter(item)), item[next(iter(item))]))

        command = f"self.{reference}.update_field_associate_objects('{association_type}', '{type_definition}', {fields_list})"
        return command

    def build_delete_object_command(self, operation):
        reference = operation['reference']
        command = f"self.{reference}.delete()"
        return command
    
    def build_start_workflow_command(self, operation):
        reference = operation['reference']

        command = f"self.{reference}.start_workflow('{operation['additional_information']['workflow_name']}')"
        return command

    def build_transition_workflow_command(self, operation):
        reference = operation['reference']

        command = f"self.{reference}.transition_workflow('{operation['additional_information']['action_name']}')"
        return command
    
    def build_add_association_command(self, operation):
        reference = operation['reference']
        int_list = [int(number) for number in operation['additional_information']['association_list']]

        command = f"self.{reference}.add_association('{operation['additional_information']['association_type']}', {int_list})"
        return command
    
    def format_reference(self, string):
        return string.replace(" ", "_").replace("-", "_").lower()

    def build_test_header(self, path_env_file, test_name):
        reference = self.format_reference(test_name)
        name = reference.title().replace("_", "")
        
        header = f'''
import os
import sys
import unittest

CLASSES_DIR = os.environ['CLASSES_DIR']
sys.path.append(CLASSES_DIR)

from OPTestAPIv2 import OPTestAPIv2
from OPTestGRCObject import OPTestGRCObject

def setUpModule():
    op_url = os.environ['OP_URL']
    username = os.environ['OP_USERNAME']
    password = os.environ['OP_PASSWORD']
    
    global api
    api = OPTestAPIv2(op_url, username, password)

def tearDownModule():
    pass

class TestScript{name}(unittest.TestCase):
    def test_{reference}(self):
'''
        
        return header
    
    def create_new_test(self, folder_path, test_name):
        full_path = os.path.join(folder_path, f"{test_name}.py")
        with open(full_path, 'w') as f:
            pass

    def delete_tests(self, folder_path, tests_list):
        paths = []

        for t in tests_list:
            paths.append(os.path.join(folder_path, t))

        for p in paths:
            os.remove(p)


    def find_test_folder(self):
        result = window.create_file_dialog(webview.FileDialog.FOLDER)
    
        if result:
           return result[0]
        else:
            window.evaluate_js("alert('Please select a folder')")
            return None
        
    def find_env_file(self):
        result = window.create_file_dialog(webview.FileDialog.OPEN)
    
        if result:
           return result[0]
        else:
            window.evaluate_js("alert('Please select a .env file')")
            return None
        
    def get_data_env_file(self, full_path):
        with open(full_path, 'r') as f:
            url = f.readline().replace("\n", "").replace(" ", "")
            username = f.readline().replace("\n", "").replace(" ", "")
            password = f.readline().replace("\n", "").replace(" ", "")

            return {
                "url": url[url.find('=')+1:],
                "username": username[username.find('=')+1:],
                "password": password[password.find('=')+1:]
            }
        
    def create_env_file(self):
        result = window.create_file_dialog(webview.FileDialog.FOLDER)
        full_path = os.path.join(result[0], ".env")
        with open(full_path, 'w') as f:
            pass
        return full_path

    def write_env_file(self, full_path, data):
        with open(full_path, 'w') as f:
            f.write(f'OP_URL={data['url']}\n')
            f.write(f'OP_USERNAME={data['username']}\n')
            f.write(f'OP_PASSWORD={data['password']}')

    def get_default_env_file(self):
        full_path = os.path.join(self.get_main_repo(), ".env")
        with open(full_path, 'a') as f:
            pass
        return full_path
    
    def load_env_variables(self, full_path):
        data = self.get_data_env_file(full_path)

        os.environ['OP_URL'] = data['url']
        os.environ['OP_USERNAME'] = data['username']
        os.environ['OP_PASSWORD'] = data['password']

if __name__ == "__main__":
    webview.settings = {
        'ALLOW_DOWNLOADS': False,
        'ALLOW_FILE_URLS': True,
        'DRAG_REGION_SELECTOR': 'pywebview-drag-region',
        'OPEN_EXTERNAL_LINKS_IN_BROWSER': True,
        'OPEN_DEVTOOLS_IN_DEBUG': True,
        'IGNORE_SSL_ERRORS': False,
        'REMOTE_DEBUGGING_PORT': None,
        'SHOW_DEFAULT_MENUS': True
    }

import traceback

try:
    api = Api()
    window = webview.create_window(f'OPTest v0.0.4', f"file://{HTML_FILE}", js_api=api)
    
    def on_closed():
        api.stop_test()

    window.events.closing += on_closed
    
    webview.start(gui='edgechromium', debug=True)

    default_test_folder = os.path.join(BASE_DIR, 'test')

except Exception as e:
    with open("error_log.txt", "w") as f:
        f.write(traceback.format_exc())
    input("Error. Press ENTER to exit.")