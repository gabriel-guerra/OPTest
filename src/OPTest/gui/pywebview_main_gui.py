import os
import webview
from pathlib import Path
from importlib.metadata import version
import subprocess
import threading
from subprocess import call, run


class Api:
    def custom_logic(self):
        return 'hello world'
    
    def test_void(self):
        print('Teste void')

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
    
    def get_test_steps(self, test_name):
        pass


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
    webview.start()

    default_test_folder = os.path.join(main_repo, 'test')