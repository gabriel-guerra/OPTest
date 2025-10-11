
import os
from dotenv import load_dotenv
from OPTest import OPTestAPIv2
from OPTest import OPTestGRCObject
import unittest

def setUpModule():
    load_dotenv()
    op_url = os.getenv("OP_URL")
    username = os.getenv("OP_USERNAME")
    password = os.getenv("OP_PASSWORD")
    
    global api
    api = OPTestAPIv2(op_url, username, password)

def tearDownModule():
    pass


class TestScriptNewTestFile(unittest.TestCase):
    def test_new_test_file(self):
