import pandas as pd
import os
import shutil

def create_subset(source_csv, source_img_dir, target_csv, target_img_dir, n_samples=50):
    """
    Samples a balanced subset from the APTOS dataset for quick testing.
    """
    print(f"Reading source data from {source_csv}...")
    df = pd.read_csv(source_csv)

    # 1. Filter Healthy (Label 0) and DR (Labels 1,2,3,4)
    healthy = df[df['diagnosis'] == 0].sample(n=n_samples, random_state=42)
    dr = df[df['diagnosis'] > 0].sample(n=n_samples, random_state=42)

    # 2. Combine and create new target directory
    subset_df = pd.concat([healthy, dr])
    
    if os.path.exists(target_img_dir):
        shutil.rmtree(target_img_dir)
    os.makedirs(target_img_dir, exist_ok=True)

    print(f"Copying {len(subset_df)} images to {target_img_dir}...")
    
    # 3. Copy files and verify
    missing_files = 0
    for id_code in subset_df['id_code']:
        src_path = os.path.join(source_img_dir, f"{id_code}.png")
        dst_path = os.path.join(target_img_dir, f"{id_code}.png")
        
        if os.path.exists(src_path):
            shutil.copy(src_path, dst_path)
        else:
            print(f"Warning: File {id_code}.png not found in source.")
            missing_files += 1

    # 4. Save the new CSV
    subset_df.to_csv(target_csv, index=False)
    print(f"\n✅ Subset Created Successfully!")
    print(f"Total Images: {len(subset_df) - missing_files}")
    print(f"CSV Saved to: {target_csv}")
    print(f"Images Saved to: {target_img_dir}")

if __name__ == "__main__":
    # CONFIGURATION: Update these paths to where your full dataset is stored
    # Typically you'd download the APTOS dataset into a folder named 'full_dataset'
    SOURCE_CSV = "backend/full_dataset/train.csv"
    SOURCE_IMG = "backend/full_dataset/train_images"
    
    TARGET_CSV = "backend/train.csv"
    TARGET_IMG = "backend/train_images"

    if os.path.exists(SOURCE_CSV):
        create_subset(SOURCE_CSV, SOURCE_IMG, TARGET_CSV, TARGET_IMG)
    else:
        print("❌ Error: Could not find 'full_dataset/train.csv'.")
        print("Please place the full APTOS dataset in 'backend/full_dataset/' first.")
