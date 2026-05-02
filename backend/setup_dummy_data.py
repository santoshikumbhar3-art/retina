import os
from PIL import Image, ImageDraw
import random

def create_dummy_images():
    base_dir = "backend/data_source"
    categories = ["healthy", "diseased"]
    
    for cat in categories:
        path = os.path.join(base_dir, cat)
        os.makedirs(path, exist_ok=True)
        
        for i in range(5):
            # Create a base 'retina-like' circle
            img = Image.new('RGB', (224, 224), color=(0, 0, 0))
            draw = ImageDraw.Draw(img)
            
            # Draw the retina base (reddish)
            draw.ellipse([10, 10, 214, 214], fill=(150, 40, 20))
            
            if cat == "healthy":
                # Draw simple 'vessels'
                for _ in range(3):
                    draw.line([112, 112, random.randint(50, 170), random.randint(50, 170)], fill=(100, 20, 10), width=2)
            else:
                # Draw 'hemorrhages' (bright spots for disease)
                for _ in range(8):
                    x, y = random.randint(60, 160), random.randint(60, 160)
                    draw.ellipse([x, y, x+5, y+5], fill=(255, 255, 0))
            
            img.save(os.path.join(path, f"test_retina_{cat}_{i}.png"))

if __name__ == "__main__":
    create_dummy_images()
    print("✅ Dummy images created in backend/data_source/")
