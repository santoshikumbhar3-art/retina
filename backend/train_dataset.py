import os
import pandas as pd
import torch
from torch.utils.data import Dataset, DataLoader, random_split
from torchvision import transforms
from PIL import Image

class APTOSDataset(Dataset):
    """
    Custom Dataset for APTOS 2019 Blindness Detection.
    Assumes a CSV file with 'id_code' and 'diagnosis' columns.
    """
    def __init__(self, csv_file, img_dir, transform=None, binary=True):
        this_dir = os.path.dirname(os.path.abspath(__file__))
        csv_path = os.path.join(this_dir, csv_file)
        
        if not os.path.exists(csv_path):
            raise FileNotFoundError(f"CSV file not found at {csv_path}")
            
        self.data = pd.read_csv(csv_path)
        self.img_dir = os.path.join(this_dir, img_dir)
        self.transform = transform
        self.binary = binary

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        img_name = os.path.join(self.img_dir, self.data.iloc[idx, 0] + ".png")
        image = Image.open(img_name).convert("RGB")
        
        label = int(self.data.iloc[idx, 1])
        
        # Convert to binary if requested (0: Healthy, 1-4: DR Detected)
        if self.binary:
            label = 1 if label > 0 else 0
            
        if self.transform:
            image = self.transform(image)

        return image, label

def get_data_loaders(csv_file='train.csv', img_dir='train_images', batch_size=32, val_split=0.2, binary=True):
    """
    Prepares training and validation DataLoaders.
    EfficientNet-B0 input size: 224x224
    """
    # Standard transforms for EfficientNet (ImageNet normalization)
    data_transforms = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    try:
        full_dataset = APTOSDataset(csv_file=csv_file, img_dir=img_dir, transform=data_transforms, binary=binary)
        
        train_size = int((1 - val_split) * len(full_dataset))
        val_size = len(full_dataset) - train_size
        
        train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])

        train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
        val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)

        print(f"Dataset Loaded: {len(train_dataset)} training images, {len(val_dataset)} validation images.")
        return train_loader, val_loader
    except Exception as e:
        print(f"Error loading dataset: {e}")
        print("Note: Ensure 'train.csv' and 'train_images/' folder exist in the backend directory.")
        return None, None

if __name__ == "__main__":
    # Example usage / Test script
    train_loader, val_loader = get_data_loaders()
    if train_loader:
        images, labels = next(iter(train_loader))
        print(f"Batch shape: {images.shape}")
        print(f"Labels: {labels}")
