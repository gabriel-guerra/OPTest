import json
import time
import pyautogui
from pynput.keyboard import Controller, Key
import win32api
import win32con

keyboard_controller = Controller()

# --- Funções para reproduzir eventos ---
def click_virtual(x, y):
    win32api.SetCursorPos((x, y))
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, x, y, 0, 0)
    win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP, x, y, 0, 0)

def scroll_virtual(dx, dy):
    pyautogui.scroll(dy * 120)

def key_virtual(key_str):
    try:
        if len(key_str) == 1:
            keyboard_controller.press(key_str)
            keyboard_controller.release(key_str)
        else:
            special_key = getattr(Key, key_str.replace("Key.", ""), None)
            if special_key:
                keyboard_controller.press(special_key)
                keyboard_controller.release(special_key)
            else:
                print(f"Tecla especial não reconhecida: {key_str}")
    except Exception as e:
        print(f"Erro tecla: {key_str} -> {e}")

# --- Carrega JSON ---
with open("gravação.json", "r") as f:
    eventos = json.load(f)

print(f"Reproduzindo {len(eventos)} eventos em 3 segundos...")
time.sleep(3)

# --- Reproduz eventos na ordem ---
start_time = eventos[0]["time"]
for e in eventos:
    delay = e["time"] - start_time
    time.sleep(delay)
    start_time = e["time"]

    if e["type"] == "click":
        click_virtual(e["x"], e["y"])
        print(f"Clique em ({e['x']},{e['y']})")
    elif e["type"] == "scroll":
        scroll_virtual(e["dx"], e["dy"])
        print(f"Scroll dx={e['dx']} dy={e['dy']}")
    elif e["type"] == "key":
        key_virtual(e["key"])
        print(f"Tecla: {e['key']}")
