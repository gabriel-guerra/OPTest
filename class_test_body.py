import time
import os

from OPTest import OPTest

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

opt = OPTest(
    os.path.join(os.getcwd(), 'chromedriver-win64','chromedriver.exe'),
    'http://useast.services.cloud.techzone.ibm.com:39238/openpages/logon.jsp'
)

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


###
## Open Grid Risks
mh = opt.get_element_v3('#root > header > button').click()
ma = opt.get_element_v3('#root > header > nav > div > ul > li:nth-child(6) > button > span').click()
r = opt.get_element_v3('#root > header > nav > div > ul > li:nth-child(6) > ul > li:nth-child(5) > a').click()
opt.wait_load()

###
## New Risk
nrisk = opt.get_element_v3('#op--body > div.cds--tab-content.op--page.op--grid-page > div > div.op--page-content.op--page-content-top-padding.cds--grid.cds--grid--full-width > div > div > div > div > section > div > button').click()

time.sleep(3)