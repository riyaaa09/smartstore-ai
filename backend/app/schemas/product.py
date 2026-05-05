from pydantic import BaseModel
from datetime import date


class ProductCreate(BaseModel):
    name: str
    sku: str
    category: str
    stock_level: int
    unit_price: float
    expiry_date: date
    reorder_threshold: int


class ProductUpdate(BaseModel):
    stock_level: int | None = None
    unit_price: float | None = None
    reorder_threshold: int | None = None


class ProductResponse(BaseModel):
    id: int
    name: str
    sku: str
    category: str
    stock_level: int
    unit_price: float
    expiry_date: date
    reorder_threshold: int
    is_active: bool
    status: str

    class Config:
        from_attributes = True