from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import SessionLocal
from app.models.purchase_order import PurchaseOrder, PurchaseOrderItem
from app.schemas.purchase_order import (
    PurchaseOrderCreate,
    PurchaseOrderResponse
)

router = APIRouter(prefix="/purchase-orders", tags=["Purchase Orders"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ✅ Create PO
@router.post("/", response_model=PurchaseOrderResponse)
def create_purchase_order(po: PurchaseOrderCreate, db: Session = Depends(get_db)):
    new_po = PurchaseOrder(supplier_id=po.supplier_id)

    db.add(new_po)
    db.commit()
    db.refresh(new_po)

    for item in po.items:
        po_item = PurchaseOrderItem(
            purchase_order_id=new_po.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.unit_price
        )
        db.add(po_item)

    db.commit()
    db.refresh(new_po)

    return new_po


# ✅ List POs (with optional supplier filter)
@router.get("/", response_model=List[PurchaseOrderResponse])
def list_purchase_orders(
    supplier_id: int | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(PurchaseOrder)

    if supplier_id:
        query = query.filter(PurchaseOrder.supplier_id == supplier_id)

    return query.all()


# ✅ Update PO Status
@router.patch("/{po_id}/status")
def update_po_status(po_id: int, status: str, db: Session = Depends(get_db)):
    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()

    if not po:
        raise HTTPException(status_code=404, detail="PO not found")

    valid_statuses = ["Draft", "Sent", "Acknowledged", "Received"]

    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")

    po.status = status
    db.commit()

    return {"message": f"PO status updated to {status}"}