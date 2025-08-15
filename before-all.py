import requests
import json

with open('data.json') as j:
    data = json.load(j)
    print(data)


# x = requests.get()