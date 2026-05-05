from pydantic import BaseModel
from typing import List
from datetime import date


class PurchaseOrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    unit_price: float


class PurchaseOrderCreate(BaseModel):
    supplier_id: int
    items: List[PurchaseOrderItemCreate]


class PurchaseOrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float

    class Config:
        from_attributes = True


class PurchaseOrderResponse(BaseModel):
    id: int
    supplier_id: int
    status: str
    created_date: date
    items: List[PurchaseOrderItemResponse]

    class Config:
        from_attributes = True