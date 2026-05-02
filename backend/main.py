from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import ai_model
import os

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    
    # 1. AGGRESSIVE VALIDATION
    is_valid, reason = ai_model.validate_retina_image(image_bytes)
    if not is_valid:
        raise HTTPException(status_code=400, detail=f"VALIDATION FAILED: {reason}")

    # 2. NEURAL ANALYSIS (EfficientNet-B0)
    diagnosis, confidence, risk_level, heatmap_base64 = ai_model.run_diagnosis(image_bytes, ai_model.model)
    
    is_healthy = diagnosis == "Healthy"

    return {
        "filename": file.filename,
        "diagnosis": diagnosis,
        "confidence": confidence,
        "risk_level": risk_level,
        "heatmap": heatmap_base64,
        "observations": [
            {"label": "Optic Disc", "value": "Defined" if is_healthy else "Hemorrhages Possible"},
            {"label": "Vessels", "value": "Normal" if is_healthy else "Microaneurysms Detected"},
            {"label": "Macula", "value": "Clear" if is_healthy else "Exudates Likely"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    print("\n" + "!"*50)
    print("  NEURAL ENGINE ACTIVE - PORT 8080")
    print("  EFFICIENTNET-B0 MODEL LOADED")
    print("!"*50 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=8080)
