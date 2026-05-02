import os
import pandas as pd
from PIL import Image

def process_full_dataset():
    # Configuration
    # Updated paths based on your actual folder structure
    SOURCE_CSV = "backend/full_dataset/train.csv" 
    IMAGE_DIR = "backend/full_dataset/train_images"
    OUTPUT_CSV = "backend/binary_train.csv"
    
    if not os.path.exists(SOURCE_CSV):
        print(f"❌ Error: {SOURCE_CSV} not found.")
        return

    if not os.path.exists(IMAGE_DIR):
        print(f"❌ Error: {IMAGE_DIR} folder not found.")
        return

    print(f"🚀 Processing full APTOS dataset from {IMAGE_DIR}...")
    
    # 1. Load original CSV
    df = pd.read_csv(SOURCE_CSV)
    print(f"📊 CSV Columns Detected: {df.columns.tolist()}")
    print(f"Original dataset size: {len(df)} records.")

    # 2. Convert to Binary (0 -> Healthy, 1-4 -> Diseased)
    if 'diagnosis' not in df.columns:
        print(f"❌ Error: 'diagnosis' column missing from {SOURCE_CSV}")
        return
        
    df['binary_diagnosis'] = df['diagnosis'].apply(lambda x: 1 if x > 0 else 0)

    # 3. Verify Image Existence
    valid_data = []
    print("Verifying images...")
    
    for index, row in df.iterrows():
        id_code = row['id_code']
        # Check for both .png (APTOS) and potential other formats
        found = False
        for ext in ['.png', '.jpg', '.jpeg']:
            img_path = os.path.join(IMAGE_DIR, f"{id_code}{ext}")
            if os.path.exists(img_path):
                valid_data.append({
                    "id_code": id_code,
                    "diagnosis": row['binary_diagnosis']
                })
                found = True
                break
        
        if not found:
            # Only print first 10 missing to avoid flooding console
            if len(df) - len(valid_data) <= 10:
                print(f"⚠️ Warning: Image {id_code} missing. Skipping.")

    # 4. Save the optimized training CSV
    if not valid_data:
        print("❌ Error: No valid images found in the specified directory.")
        return

    output_df = pd.DataFrame(valid_data)
    output_df.to_csv(OUTPUT_CSV, index=False)
    
    # 5. Summary Statistics
    healthy_count = len(output_df[output_df['diagnosis'] == 0])
    diseased_count = len(output_df[output_df['diagnosis'] == 1])
    
    print(f"\n✅ Processing Complete!")
    print(f"Total Valid Images: {len(output_df)}")
    print(f"Healthy (Class 0): {healthy_count}")
    print(f"Diseased (Class 1): {diseased_count}")
    print(f"Binary CSV saved to: {OUTPUT_CSV}")
    print("\nNext: Update train_model.py to use 'binary_train.csv' and correct image path.")

if __name__ == "__main__":
    process_full_dataset()
