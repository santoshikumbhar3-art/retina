import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import models
from train_dataset import get_data_loaders
import os

def build_model(num_classes=5):
    """
    Builds EfficientNet-B0 model with transfer learning.
    """
    try:
        model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
    except AttributeError:
        model = models.efficientnet_b0(pretrained=True)

    for param in model.parameters():
        param.requires_grad = False

    num_ftrs = model.classifier[1].in_features
    model.classifier[1] = nn.Sequential(
        nn.Linear(num_ftrs, 512),
        nn.ReLU(),
        nn.Dropout(0.3),
        nn.Linear(512, num_classes)
    )
    
    return model

def train_one_epoch(model, train_loader, criterion, optimizer, device):
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0

    for images, labels in train_loader:
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item() * images.size(0)
        _, predicted = outputs.max(1)
        total += labels.size(0)
        correct += predicted.eq(labels).sum().item()

    epoch_loss = running_loss / len(train_loader.dataset)
    epoch_acc = 100. * correct / total
    return epoch_loss, epoch_acc

def validate(model, val_loader, criterion, device):
    model.eval()
    running_loss = 0.0
    correct = 0
    total = 0

    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            loss = criterion(outputs, labels)

            running_loss += loss.item() * images.size(0)
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()

    if len(val_loader.dataset) == 0:
        return 0, 100.0
        
    val_loss = running_loss / len(val_loader.dataset)
    val_acc = 100. * correct / total
    return val_loss, val_acc

def main():
    # Production training config
    BATCH_SIZE = 32
    EPOCHS = 10
    LEARNING_RATE = 0.001
    DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    MODEL_SAVE_PATH = os.path.join(os.path.dirname(__file__), "retina_model.pth")

    print(f"🚀 Training Neural Engine on Full Dataset...")
    print(f"Device: {DEVICE}")

    # Load Data (Use the full APTOS dataset)
    train_loader, val_loader = get_data_loaders(
        csv_file='full_dataset/train.csv', 
        img_dir='full_dataset/train_images/train_images',
        batch_size=BATCH_SIZE, 
        val_split=0.2, 
        binary=True # Map to 0 (Healthy) and 1 (Diseased)
    )
    
    if not train_loader:
        return

    model = build_model(num_classes=5).to(DEVICE)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.classifier.parameters(), lr=LEARNING_RATE)

    best_acc = -1.0
    for epoch in range(EPOCHS):
        train_loss, train_acc = train_one_epoch(model, train_loader, criterion, optimizer, DEVICE)
        val_loss, val_acc = validate(model, val_loader, criterion, DEVICE)

        print(f"Epoch {epoch+1}/{EPOCHS}")
        print(f"Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.2f}%")
        print(f"Val Loss: {val_loss:.4f} | Val Acc: {val_acc:.2f}%")
        print("-" * 30)

        if val_acc >= best_acc:
            best_acc = val_acc
            torch.save(model.state_dict(), MODEL_SAVE_PATH)
            print(f"✅ Checkpoint saved to {MODEL_SAVE_PATH}")

    print(f"🎉 Training Complete. Best Validation Accuracy: {best_acc:.2f}%")

if __name__ == "__main__":
    main()
