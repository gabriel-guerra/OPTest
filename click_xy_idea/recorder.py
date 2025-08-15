import json
import time
from pynput import mouse, keyboard

eventos = []
gravando = False

# --- Handlers ---
def on_click(x, y, button, pressed):
    if gravando and pressed:
        eventos.append({"type": "click", "x": x, "y": y, "time": time.time()})
        print(f"Clique: ({x}, {y})")
    return True

def on_scroll(x, y, dx, dy):
    if gravando:
        eventos.append({"type": "scroll", "dx": dx, "dy": dy, "x": x, "y": y, "time": time.time()})
        print(f"Scroll: dx={dx}, dy={dy} em ({x},{y})")
    return True

def on_press(key):
    if gravando:
        try:
            eventos.append({"type": "key", "key": key.char, "time": time.time()})
        except AttributeError:
            eventos.append({"type": "key", "key": str(key), "time": time.time()})
        print(f"Tecla: {key}")
    return True

# --- Hotkey Ctrl+I+L ---
def toggle_gravacao():
    global gravando
    gravando = not gravando
    estado = "INICIADA" if gravando else "FINALIZADA"
    print(f"Gravação {estado}")
    if not gravando:
        with open("gravação.json", "w") as f:
            json.dump(eventos, f, indent=2)
        print(f"{len(eventos)} eventos salvos em gravação.json")

def hotkey_listener():
    with keyboard.GlobalHotKeys({'<ctrl>+i+l': toggle_gravacao}) as h:
        h.join()

# --- Inicia listeners ---
mouse_listener = mouse.Listener(on_click=on_click, on_scroll=on_scroll)
keyboard_listener = keyboard.Listener(on_press=on_press)

mouse_listener.start()
keyboard_listener.start()

print("Pressione Ctrl+I+L para iniciar/parar a gravação.")
hotkey_listener()
