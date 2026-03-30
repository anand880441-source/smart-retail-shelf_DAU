from ultralytics import YOLO
import yaml

def train_yolo_model():
    # Model configuration
    model = YOLO('yolov8n.pt')
    
    # Dataset configuration
    data_config = {
        'train': 'data/train/images',
        'val': 'data/val/images',
        'nc': 15,  # number of product classes
        'names': ['Milk', 'Bread', 'Eggs', 'Cheese', 'Yogurt', 'Butter', 'Apples', 'Bananas', 'Oranges', 'Chips', 'Cookies', 'Popcorn', 'Cream_Cheese', 'Croissant', 'Bagels']
    }
    
    with open('dataset.yaml', 'w') as f:
        yaml.dump(data_config, f)
    
    # Train model
    results = model.train(
        data='dataset.yaml',
        epochs=100,
        imgsz=640,
        batch=16,
        name='shelf_detection'
    )
    
    print("Training completed!")
    return results

if __name__ == "__main__":
    train_yolo_model()