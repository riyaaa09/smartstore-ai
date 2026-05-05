from sqlalchemy import Column, Integer, String, Float, Date, Boolean
from app.db.session import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    sku = Column(String, unique=True, index=True)
    category = Column(String)
    stock_level = Column(Integer, default=0)
    unit_price = Column(Float)
    expiry_date = Column(Date)
    reorder_threshold = Column(Integer, default=10)
    is_active = Column(Boolean, default=True)