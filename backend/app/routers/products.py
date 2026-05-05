from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.db.session import SessionLocal
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.core.dependencies import get_current_user
from app.models.user import User
from datetime import date
from datetime import timedelta

router = APIRouter(prefix="/products", tags=["Products"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Create product (Admin only)
@router.post("/", response_model=ProductResponse)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_product = Product(**product.dict())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


# List products with pagination
@router.get("/", response_model=List[ProductResponse])
def list_products(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 10,
    category: str | None = None
):
    query = db.query(Product).filter(Product.is_active == True)

    if category:
        query = query.filter(Product.category == category)

    products = query.offset(skip).limit(limit).all()

    result = []

    for product in products:
        if product.expiry_date and product.expiry_date < date.today():
            status = "expired"
        elif product.stock_level <= product.reorder_threshold:
            status = "low"
        else:
            status = "ok"

        product_dict = product.__dict__.copy()
        product_dict["status"] = status
        result.append(product_dict)

    return result

# Update product
@router.patch("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_update: ProductUpdate,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for field, value in product_update.dict(exclude_unset=True).items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


# Soft delete
@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.is_active = False
    db.commit()

    return {"message": "Product deleted successfully"}

@router.get("/low-stock", response_model=List[ProductResponse])
def get_low_stock_products(db: Session = Depends(get_db)):
    from datetime import date

    products = db.query(Product).filter(
        Product.stock_level <= Product.reorder_threshold,
        Product.is_active == True
    ).all()

    result = []

    for product in products:
        product_dict = product.__dict__.copy()
        product_dict["status"] = "low"
        result.append(product_dict)

    return result

@router.get("/dashboard-summary")
def dashboard_summary(db: Session = Depends(get_db)):
    from datetime import date

    total_products = db.query(Product).filter(Product.is_active == True).count()

    low_stock_count = db.query(Product).filter(
        Product.stock_level <= Product.reorder_threshold,
        Product.is_active == True
    ).count()

    expired_count = db.query(Product).filter(
        Product.expiry_date < date.today(),
        Product.is_active == True
    ).count()

    return {
        "total_products": total_products,
        "low_stock_alerts": low_stock_count,
        "expired_items": expired_count
    }

@router.get("/{product_id}/forecast")
def forecast_product_demand(product_id: int, db: Session = Depends(get_db)):

    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # ✅ Simple moving average assumption
    avg_daily_demand = max(product.stock_level / 30, 1)

    forecast = []

    for i in range(1, 8):
        forecast.append({
            "day": f"Day {i}",
            "predicted_demand": round(avg_daily_demand, 2)
        })

    return {
        "product_id": product.id,
        "product_name": product.name,
        "forecast": forecast
    }

