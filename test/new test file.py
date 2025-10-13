
import os
from dotenv import load_dotenv
from OPTest import OPTestAPIv2
from OPTest import OPTestGRCObject
import unittest
from pathlib import Path

def setUpModule():
    op_url = os.environ['OP_URL']
    username = os.environ['OP_USERNAME']
    password = os.environ['OP_PASSWORD']
    
    global api
    api = OPTestAPIv2(op_url, username, password)

def tearDownModule():
    pass


class TestScriptNewTestFile(unittest.TestCase):
    def test_new_test_file(self):
