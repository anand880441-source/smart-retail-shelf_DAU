import numpy as np
from PIL import Image, ImageDraw
import random

def generate_shelf_image(width=800, height=600, num_products=10):
    image = Image.new('RGB', (width, height), color=(245, 245, 245))
    draw = ImageDraw.Draw(image)
    
    # Draw shelf lines
    for y in range(100, height, 150):
        draw.rectangle([(0, y), (width, y+10)], fill=(200, 200, 200))
    
    products = [
        ("MILK001", (255, 0, 0)), ("BRD004", (0, 255, 0)),
        ("EGG013", (0, 0, 255)), ("CHS002", (255, 255, 0)),
        ("YGT003", (255, 0, 255)), ("BTR014", (0, 255, 255))
    ]
    
    for i in range(num_products):
        x = random.randint(50, width-100)
        y = random.randint(50, height-100)
        product = random.choice(products)
        draw.rectangle([(x, y), (x+80, y+100)], fill=product[1], outline=(0,0,0))
        draw.text((x+10, y+40), product[0], fill=(255,255,255))
    
    return image

if __name__ == "__main__":
    img = generate_shelf_image()
    img.save("synthetic_shelf.jpg")
    print("Synthetic shelf image generated!")