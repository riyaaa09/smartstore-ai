from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import engine, Base
from app.models import user
from app.routers import auth
from app.core.dependencies import get_current_user, get_admin_user
from app.models.user import User
from app.models import product
from app.routers import products
from app.models import supplier, purchase_order
from app.routers import suppliers
from app.routers import purchase_orders
from app.routers import ai
from app.routers import invoices
from app.models import automation
from apscheduler.schedulers.background import BackgroundScheduler
from app.services.automation_service import low_stock_agent
from app.routers import automation

app = FastAPI(title="SmartStore AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(suppliers.router)
app.include_router(purchase_orders.router)
app.include_router(ai.router)
app.include_router(invoices.router)
app.include_router(automation.router)


scheduler = BackgroundScheduler()
scheduler.add_job(low_stock_agent, "interval", minutes=1)
scheduler.start()

@app.get("/")
def root():
    return {"message": "SmartStore AI Backend Running"}

@app.get("/me")
def read_current_user(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role
    }


@app.get("/admin-only")
def admin_only_route(current_user: User = Depends(get_admin_user)):
    return {"message": "Welcome Admin!"}