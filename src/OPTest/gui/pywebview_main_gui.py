import uuid
import ast
import os
import webview
from pathlib import Path
from importlib.metadata import version
import subprocess
import threading
from subprocess import call, run


class Api:
    def get_test_folder(self):
        cwd = Path.cwd()
        main_repo = cwd.parent.parent.parent
        return os.path.join(main_repo, 'test')
    
    def get_files_in_folder(self, folder_path):
        folder = Path(folder_path)
        files = [f.name for f in folder.iterdir() if f.is_file() and f.suffix == ".py"]
        return files

    def run_test(self, folder, tests):
        def worker():
            command_args = ["python", "-u", "-m", "unittest"]
            command_args.extend(tests)  
            process = subprocess.Popen(
                command_args, 
                stdout=subprocess.PIPE, 
                stderr=subprocess.STDOUT,
                text=True,
                cwd=folder,
                bufsize=1
            )

            for line in process.stdout:
                window.evaluate_js(f'window.addLine({line.strip()!r})')

            process.wait()
            window.evaluate_js(f'window.commandFinished({process.returncode})')

        threading.Thread(target=worker, daemon=True).start()
        return "started"
    
    def get_edit_test_page_url(self):
        test_edit_html = os.path.join(cwd, 'public', 'html', 'test-edit.html')
        return test_edit_html
    
    def get_index_page_url(self):
        return index_html

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
                step = self.parse_update_fields_associate_object(c, test_steps)
                test_steps[f"{step['uuid']}"] = step

        return test_steps

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
        name = params_list[1].replace(" ", "_").replace("-", "_").lower()
        step = {
            "uuid": f"{uuid_code}",
            "reference": f"{name}",
            "action_type": "create_object",
            "action_information": f"Create: {params_list[1]} ({params_list[0]})",
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
            else:
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
            else:
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
            else:
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
            else:
                raise Exception("Didn't find object to start workflow.")
            
    def parse_update_fields_associate_object(self, command, all_steps):
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
                    "action_type": "update_fields_associate_object",
                    "action_information": f"Update field(s) in {params_list[0]} of {value['additional_information']['name']}",
                    "additional_information": {
                        "name": f"{value['additional_information']['name']}",
                        "association_type": f"{params_list[0]}",
                        "type_definition": f"{params_list[1]}",
                        "fields_list": field_lists,
                    }
                }
                return step
            else:
                raise Exception("Didn't find object to update fields.")



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

    cwd = Path.cwd()
    main_repo = cwd.parent.parent.parent
    index_html = os.path.join(cwd, 'public', 'html', 'index.html')

    api = Api()
    window = webview.create_window(f'OPTest v{version("OPTest")}', f"file://{index_html}", js_api=api)
    webview.start(debug=True)

    default_test_folder = os.path.join(main_repo, 'test')