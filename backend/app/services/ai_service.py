import os
from openai import OpenAI
from dotenv import load_dotenv
from app.db.session import SessionLocal
from app.models.product import Product
from datetime import date

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# ✅ TOOL 1 — Get Low Stock Products
def get_low_stock_products():
    db = SessionLocal()
    products = db.query(Product).filter(
        Product.stock_level <= Product.reorder_threshold,
        Product.is_active == True
    ).all()

    result = []
    for p in products:
        result.append({
            "name": p.name,
            "stock_level": p.stock_level,
            "reorder_threshold": p.reorder_threshold
        })

    db.close()
    return result


# ✅ TOOL 2 — Get Product Detail
def get_product_detail(product_name: str):
    db = SessionLocal()
    product = db.query(Product).filter(Product.name == product_name).first()

    if not product:
        return {"error": "Product not found"}

    result = {
        "name": product.name,
        "category": product.category,
        "price": product.unit_price,
        "stock": product.stock_level,
        "expiry": str(product.expiry_date)
    }

    db.close()
    return result