from pydantic import BaseModel


class SupplierCreate(BaseModel):
    name: str
    email: str
    category_supplied: str
    lead_time_days: int


class SupplierResponse(BaseModel):
    id: int
    name: str
    email: str
    category_supplied: str
    lead_time_days: int

    class Config:
        from_attributes = True