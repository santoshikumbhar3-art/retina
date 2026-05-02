from PIL import Image
import os

def create_fake_image():
    path = "backend/data_source/fake_image.png"
    # Create a blue/purple graphic (should be rejected by color check)
    img = Image.new('RGB', (224, 224), color=(50, 50, 200)) 
    img.save(path)
    print(f"✅ Fake image created at {path}")

if __name__ == "__main__":
    create_fake_image()
