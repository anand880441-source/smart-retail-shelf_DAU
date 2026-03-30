import os
import yaml
from ultralytics import YOLO

def train_yolo_model():
    print("=" * 50)
    print("YOLOv8 Training for Shelf Product Detection")
    print("=" * 50)
    
    # Model configuration
    model = YOLO('yolov8n.pt')  # Load pretrained model
    
    # Dataset configuration
    dataset_config = {
        'path': './data/shelf_dataset',
        'train': 'images/train',
        'val': 'images/val',
        'test': 'images/test',
        'nc': 15,  # number of product classes
        'names': [
            'Milk_1L', 'White_Bread', 'Eggs_Dozen', 'Cheese', 'Yogurt',
            'Butter', 'Apples', 'Bananas', 'Oranges', 'Potato_Chips',
            'Cookies', 'Popcorn', 'Cream_Cheese', 'Croissant', 'Bagels'
        ]
    }
    
    # Save dataset config
    os.makedirs('data', exist_ok=True)
    with open('data/shelf_dataset.yaml', 'w') as f:
        yaml.dump(dataset_config, f)
    
    print("Dataset configuration saved to data/shelf_dataset.yaml")
    
    # Train the model
    print("\nStarting training...")
    results = model.train(
        data='data/shelf_dataset.yaml',
        epochs=100,
        imgsz=640,
        batch=16,
        name='shelf_detection_model',
        patience=10,
        save=True,
        save_period=10,
        device='cpu'  # Change to 'cuda' if GPU available
    )
    
    print("\n" + "=" * 50)
    print("Training completed successfully!")
    print(f"Model saved to: runs/detect/shelf_detection_model/weights/best.pt")
    print("=" * 50)
    
    return results

def validate_model(model_path='runs/detect/shelf_detection_model/weights/best.pt'):
    print("\nValidating model...")
    model = YOLO(model_path)
    metrics = model.val()
    print(f"Validation mAP50-95: {metrics.box.map:.4f}")
    return metrics

def export_model(model_path='runs/detect/shelf_detection_model/weights/best.pt'):
    print("\nExporting model to ONNX format...")
    model = YOLO(model_path)
    model.export(format='onnx', imgsz=640)
    print("Model exported to ONNX format")

if __name__ == "__main__":
    train_yolo_model()
    validate_model()
    export_model()