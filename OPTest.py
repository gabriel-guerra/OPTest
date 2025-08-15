import re
import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.common.alert import Alert

TIMEOUT = 30

class OPTest:

    def __init__(self, chromedriver_path, url):  
        options = webdriver.ChromeOptions()
        options.add_argument('guest')
        options.add_argument("--disable-features=Translate")
        prefs = {
            "translate_whitelists": {},  # não traduz nada
            "translate": {"enabled": False}  # desativa totalmente
        }
        options.add_experimental_option("prefs", prefs)
        service = webdriver.ChromeService(executable_path=chromedriver_path)
        self.driver = webdriver.Chrome(options=options, service=service)
        self.driver.get(url)
        self.wait = WebDriverWait(self.driver, TIMEOUT)

    def get_element(self, type_search, element_info):
        options = {
            'id': By.ID,
            'name': By.NAME,
            'attribute': By.NAME,
            'link': By.PARTIAL_LINK_TEXT,
            "xpath": By.XPATH,
            "tag": By.TAG_NAME,
            "class": By.CLASS_NAME,
            "css": By.CSS_SELECTOR
        }
        return self.driver.find_element(by=options[type_search], value=element_info)
    
    def get_element_v2(self, type_search, element_info):
        options = {
            'id': By.ID,
            'name': By.NAME,
            'attribute': By.NAME,
            'link': By.PARTIAL_LINK_TEXT,
            "xpath": By.XPATH,
            "tag": By.TAG_NAME,
            "class": By.CLASS_NAME,
            "css": By.CSS_SELECTOR
        }
        info = element_info.replace('//', '<CUT> ').replace('/', '<CUT>')
        path_parts = info.split('<CUT>')
        path_parts.pop(0)
        print(path_parts)

        current_context = self.driver  # começa no driver
        for part in path_parts:

            if '[' in f'{part}':
                index = int(re.search(r"\[(\d+)\]", part).group(1))
                part = re.sub(r"\[(\d+)\]", f":nth-of-type({index})", part)

            print(f"Tentando: {part}")

            try:
                elem = current_context.find_element(By.CSS_SELECTOR, f"{part}")
            except Exception:
                shadow_container = self.get_shadow_root(current_context).find_element(By.CSS_SELECTOR, f'{part}')
                WebDriverWait(shadow_container, TIMEOUT).until(EC.visibility_of_element_located((By.CSS_SELECTOR, f'{part}')))
                self.wait.until(EC.invisibility_of_element_located((By.CSS_SELECTOR, f'{part}')))

        print("Elemento final:", elem)
        return elem

    def get_shadow_root(self, element):
        return self.driver.execute_script('return arguments[0].shadowRoot', element)
    
    def get_element_v3(self, selector):
        current_context = self.driver

        while True:
            try:
                WebDriverWait(self.driver, 5).until(
                    EC.visibility_of_element_located((By.CSS_SELECTOR, selector))
                )
                element = current_context.find_element(By.CSS_SELECTOR, selector)
                return ElementOPTest(element)

            except Exception:
                if current_context == self.driver:
                    current_context = current_context.find_element(By.TAG_NAME, 'html')

                try:
                    # shadow_host = current_context.find_element(By.CSS_SELECTOR, "#root")
                    current_context = self.get_shadow_root(current_context)
                except:
                    raise Exception(f"Element '{selector}' not found")
    

    def wait_load(self): 
        self.wait.until(lambda d: d.execute_script("return document.readyState") == "complete")



class ElementOPTest(WebElement):
    def __init__(self, super: WebElement):
        self.__dict__.update(super.__dict__)

    def add_text(self, text, press_enter=False):
        self.send_keys(text)
        if press_enter:
            self.send_keys(Keys.RETURN)