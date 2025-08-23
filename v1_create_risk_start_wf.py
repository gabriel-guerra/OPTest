import time
import os
import json

from OPTest import OPTest
from OPTestAPIv2 import OPTestAPIv2

opt = OPTest(
    os.path.join(os.getcwd(), 'chromedriver-win64','chromedriver.exe'),
    'http://useast.services.cloud.techzone.ibm.com:31484/openpages/logon.jsp'
)

api = OPTestAPIv2('http://useast.services.cloud.techzone.ibm.com:31484/openpages/logon.jsp', 'OpenPagesAdministrator', 'OpenPagesAdministrator')

###
## Login
username_input = opt.get_element_v3('#username')
username_input.click()
username_input.add_text('OpenPagesAdministrator')
password = opt.get_element_v3('#password')
password.click()
password.add_text('OpenPagesAdministrator')
span = opt.get_element_v3('#cds--checkbox-label-text')
span.click()
login = opt.get_element_v3('#submit')
login.click()
opt.wait_load()

data = {}
with open('data.json', 'r') as d:
    data = json.load(d)

created = api.create_resource(data[0], True)
opt.redirect_to_taskview(created['id'])

# continue_button = opt.get_element_v3('#walkme-balloon-13362360-focusable-element-2 > div') 
time.sleep(1000)
