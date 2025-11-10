import pyautogui
from PIL import Image

# Insert canvas name
haystack_name = "bingo_plate_hatter.png"

haystack_path = f"bingo/image_markers/{haystack_name}"
canvas = Image.open(haystack_path)
white_tile = Image.open("bingo/image_markers/white.png")
width, height = canvas.size
def save_image_remove(position, image):
    x, y, dx, dy = position
    box = (x + 2, y + 1, x + dx - 4 + 2, y + dy + 40 + 1)
    image = canvas.crop(box)
    image.save(f"bingo/tiles/{i}.png")
    print(f"{i}.png saved")

    canvas.paste(white_tile, (x + 2, y + 1))

for i, pos in enumerate(pyautogui.locateAll("bingo/image_markers/tile.png", 
                                            haystack_path, 
                                            #confidence=1.0,
                                            region=(0, 0, width//2, height)), 1):
    save_image_remove(pos, canvas)
for i, pos in enumerate(pyautogui.locateAll("bingo/image_markers/tile.png", 
                                            haystack_path, 
                                            #confidence=1.0,
                                            region=(width//2, 0, width//2, height)), 22):
    save_image_remove(pos, canvas)

canvas.save("bingo/canvas.png")