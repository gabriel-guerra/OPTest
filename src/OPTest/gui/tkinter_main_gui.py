import os
from tkinter import *
from tkinter import ttk
from tkinter import filedialog
from importlib.metadata import version
from pathlib import Path


def create_test(*args):
    print(f'Test Created in folder {folder.get()}')

def edit_test():
    print('Test Edited')

def delete_test():
    print('Test Deleted')

def choose_test_folder():
    pass

# Instantiating root
root = Tk()

# Setting up mainframe
root.title(f"OPTest v{version("OPTest")}")
mainframe = ttk.Frame(root, padding=(20, 20, 20, 20))


# Define mainframe grid
mainframe.grid(column=0, row=0, sticky=(N, W, E, S))


# Folder path
cwd = Path.cwd()
main_repo = cwd.parent.parent.parent
default_test_folder = os.path.join(main_repo, 'test')

# Setup Entry element
folder = StringVar()
folder.set(default_test_folder)
folder_entry = ttk.Entry(mainframe, width=100, textvariable=folder)
folder_entry.grid(column=2, row=1, sticky=(W, E))

#
ttk.Button(mainframe, text=f'Choose test folder', command=choose_test_folder).grid(column=3, row=1, sticky=W)

# Add Buttons to manipulate scripts
ttk.Button(mainframe, text=f'Create test case', command=create_test).grid(column=3, row=3, sticky=W)

tree = ttk.Treeview(mainframe, columns=("File",), show='headings', height=10)
tree.heading("File", text="Files.py")
# tree.pack(pady=10, fill="both", expand=True)
tree.insert("", "end", values=(1,2,3))

root.mainloop()