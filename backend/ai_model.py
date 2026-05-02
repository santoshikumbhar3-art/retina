import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image, ImageStat, ImageOps, ImageFilter
import io
import os
import numpy as np
import cv2
import base64

# 1. ARCHITECTURE DEFINITION (Must match training script)
def get_model():
    """
    Loads the trained EfficientNet-B0 model.
    """
    try:
        model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
        num_ftrs = model.classifier[1].in_features
        model.classifier[1] = nn.Sequential(
            nn.Linear(num_ftrs, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, 5) # 5 Classes for APTOS: 0-4
        )
        
        # Load weights
        model_path = os.path.join(os.path.dirname(__file__), "retina_model.pth")
        if os.path.exists(model_path):
            model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
            print(f"✅ Loaded Neural weights from {model_path}")
        else:
            print(f"⚠️ Warning: {model_path} not found. Using uninitialized weights.")
            
        model.eval()
        return model
    except Exception as e:
        print(f"❌ Model Loading Error: {e}")
        return None

# Grad-CAM Implementation
class GradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None
        
        # Hook to capture gradients and activations
        def save_gradient(module, grad_input, grad_output):
            self.gradients = grad_output[0]
            
        def save_activation(module, input, output):
            self.activations = output
            
        target_layer.register_forward_hook(save_activation)
        target_layer.register_full_backward_hook(save_gradient)

    def generate_heatmap(self, input_tensor, class_idx):
        # Forward pass
        output = self.model(input_tensor)
        
        # Backward pass
        self.model.zero_grad()
        loss = output[0, class_idx]
        loss.backward()
        
        # Pool the gradients across the channels
        pooled_gradients = torch.mean(self.gradients, dim=[0, 2, 3])
        
        # Weight the activations by the gradients
        for i in range(self.activations.shape[1]):
            self.activations[:, i, :, :] *= pooled_gradients[i]
            
        # Average the channels to create the heatmap
        heatmap = torch.mean(self.activations, dim=1).squeeze()
        
        # ReLU to keep only positive contributions
        heatmap = np.maximum(heatmap.detach().cpu().numpy(), 0)
        
        # Normalize between 0 and 1
        heatmap /= np.max(heatmap) if np.max(heatmap) > 0 else 1
        return heatmap

def overlay_heatmap(heatmap, original_img):
    heatmap = cv2.resize(heatmap, (original_img.shape[1], original_img.shape[0]))
    heatmap = np.uint8(255 * heatmap)
    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    
    # Create superimposed image
    superimposed_img = cv2.addWeighted(original_img, 0.6, heatmap, 0.4, 0)
    return superimposed_img

# 2. VALIDATION (Optimized for High-Quality Clinical Scans)
def validate_retina_image(image_bytes):
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        stats = ImageStat.Stat(img)
        r, g, b = stats.mean
        
        if r < b or r < 30:
            return False, "Incorrect color balance (Logos/Graphics detected)."
            
        gray = ImageOps.grayscale(img)
        edges = gray.filter(ImageFilter.FIND_EDGES)
        edge_max = ImageStat.Stat(edges).extrema[0][1]

        std_dev = stats.stddev[0]
        if std_dev < 3:
             return False, "Image lacks organic biological texture."
             
        return True, "Valid"
    except Exception as e:
        return False, f"Validation Error: {str(e)}"

# 3. EFFICIENTNET DIAGNOSIS WITH HEATMAP
def run_diagnosis(image_bytes, model):
    if model is None:
        return "Error: Model not loaded", 0.0, "N/A", None

    # Preprocessing pipeline
    preprocess = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    # Load and prepare image
    img_pil = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_t = preprocess(img_pil).unsqueeze(0)
    img_t.requires_grad = True

    # Run Diagnosis
    outputs = model(img_t)
    probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
    confidence, predicted_idx = torch.max(probabilities, 0)
    
    # Generate Heatmap (Grad-CAM)
    try:
        # Targeting the last conv layer of EfficientNet-B0
        target_layer = model.features[-1]
        grad_cam = GradCAM(model, target_layer)
        heatmap = grad_cam.generate_heatmap(img_t, predicted_idx.item())
        
        # Overlay on original image
        original_cv2 = cv2.cvtColor(np.array(img_pil), cv2.COLOR_RGB2BGR)
        superimposed = overlay_heatmap(heatmap, original_cv2)
        
        # Convert to Base64
        _, buffer = cv2.imencode('.jpg', superimposed)
        heatmap_base64 = base64.b64encode(buffer).decode('utf-8')
    except Exception as e:
        print(f"Heatmap Error: {e}")
        heatmap_base64 = None

    # Map index to Clinical Labels
    labels = {
        0: ("Healthy", "Low"),
        1: ("Mild DR", "Moderate"),
        2: ("Moderate DR", "Moderate"),
        3: ("Severe DR", "High"),
        4: ("Proliferative DR", "High")
    }
    
    diagnosis, risk_level = labels.get(predicted_idx.item(), ("Unknown", "N/A"))
    conf_percent = round(confidence.item() * 100, 2)
    
    return diagnosis, conf_percent, risk_level, heatmap_base64

model = get_model()
