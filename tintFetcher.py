import os
import requests
import json
from PIL import Image, ImageChops
from io import BytesIO

def save_image_from_url(image_number):
    try:
        response = requests.get(
            f"https://hundeparken.net/h5/game/gfx/item/{image_number}.png"
        )

        if response.status_code != 200:
            print(f"Failed to retrieve image. Status code: {response.status_code}")
            return False

        new_image = Image.open(BytesIO(response.content))

        filepath = f"images/tintGraphics/{image_number}.png"

        if os.path.exists(filepath):
            old_image = Image.open(filepath)

            # Different size => overwrite
            if old_image.size == new_image.size:
                # Compare pixels
                diff = ImageChops.difference(old_image, new_image)

                if diff.getbbox() is None:
                    print(f"Image {image_number} unchanged, skipping save")
                    return True

        new_image.save(filepath)
        print(f"Image {image_number} saved successfully")
        return True

    except Exception as e:
        print(f"An error occurred: {e}")
        return False

url = "https://hundeparken.net/api/items"
response = requests.get(url)
response.raise_for_status()

data = response.json() 
result = set()

for item in data:
    layers = item.get("layers", [])

    # Keep only items where at least one layer is tintable
    if any(layer.get("isTintable", False) for layer in layers):
        for layer in layers:
            gfx = layer.get("gfx", "")
            result.update(n for n in gfx.split(",") if n)

sorted_result = sorted(result, key=lambda i: int(i))

saves_images = []
for image_no in sorted_result:
    if save_image_from_url(image_no):
        saves_images.append(image_no)

with open("data/availableTints.json", "w") as file:
	json.dump(saves_images, file)

print(saves_images)