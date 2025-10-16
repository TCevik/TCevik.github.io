import os
import json
import urllib.parse

folder = "pictosNL"
base_url = "https://tctam.nl/assets/pictosNL/"

pictos = []

for filename in os.listdir(folder):
    if filename.endswith(".png"):
        name = os.path.splitext(filename)[0]
        url_filename = urllib.parse.quote(filename)
        pictos.append({
            "name": name,
            "src": base_url + url_filename,
            "tags": [name.lower()]
        })

with open("index.json", "w") as f:
    json.dump(pictos, f, indent=2)

print(f"JSON index gemaakt met {len(pictos)} picto's, met URLs naar {base_url}")
