import random
import csv
from datetime import datetime, timedelta

def generate_pos_data(days=30, output_file="pos_data.csv"):
    products = [
        {"sku": "MILK001", "name": "Milk 1L", "price": 3.99},
        {"sku": "BRD004", "name": "White Bread", "price": 2.49},
        {"sku": "EGG013", "name": "Eggs Dozen", "price": 4.99},
        {"sku": "CHS002", "name": "Cheese", "price": 5.49},
        {"sku": "YGT003", "name": "Yogurt", "price": 2.99},
        {"sku": "BTR014", "name": "Butter", "price": 5.49},
        {"sku": "APL007", "name": "Apples", "price": 0.99},
        {"sku": "BAN008", "name": "Bananas", "price": 0.69},
        {"sku": "CHP010", "name": "Potato Chips", "price": 4.99},
        {"sku": "CRO005", "name": "Croissant", "price": 1.99},
    ]
    
    with open(output_file, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["transaction_id", "timestamp", "sku", "product_name", "quantity", "price", "total"])
        
        transaction_id = 1
        start_date = datetime.now() - timedelta(days=days)
        
        for day in range(days):
            date = start_date + timedelta(days=day)
            num_transactions = random.randint(50, 200)
            
            for _ in range(num_transactions):
                product = random.choice(products)
                quantity = random.randint(1, 5)
                total = product["price"] * quantity
                
                writer.writerow([
                    transaction_id,
                    date.strftime("%Y-%m-%d %H:%M:%S"),
                    product["sku"],
                    product["name"],
                    quantity,
                    product["price"],
                    round(total, 2)
                ])
                transaction_id += 1
    
    print(f"Generated {transaction_id - 1} POS transactions in {output_file}")

if __name__ == "__main__":
    generate_pos_data()