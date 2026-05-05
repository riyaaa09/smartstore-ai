from app.db.session import SessionLocal
from app.models.product import Product
from app.models.purchase_order import PurchaseOrder, PurchaseOrderItem
from app.models.automation import AutomationLog


def low_stock_agent():

    db = SessionLocal()

    low_products = db.query(Product).filter(
        Product.stock_level <= Product.reorder_threshold,
        Product.is_active == True
    ).all()

    if not low_products:
        log = AutomationLog(
            job_name="Low Stock Agent",
            status="No Action",
            message="No low stock products found"
        )
        db.add(log)
        db.commit()
        db.close()
        return

    for product in low_products:
        # ✅ Create Draft PO automatically
        new_po = PurchaseOrder(
            supplier_id=1,  # assume supplier 1 for demo
            status="Draft"
        )

        db.add(new_po)
        db.commit()
        db.refresh(new_po)

        po_item = PurchaseOrderItem(
            purchase_order_id=new_po.id,
            product_id=product.id,
            quantity=product.reorder_threshold * 2,
            unit_price=product.unit_price
        )

        db.add(po_item)
        db.commit()

    log = AutomationLog(
        job_name="Low Stock Agent",
        status="Success",
        message=f"Created {len(low_products)} draft POs"
    )

    db.add(log)
    db.commit()
    db.close()