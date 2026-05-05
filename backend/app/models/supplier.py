from sqlalchemy import Column, Integer, String
from app.db.session import Base


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    category_supplied = Column(String)
    lead_time_days = Column(Integer, default=3)