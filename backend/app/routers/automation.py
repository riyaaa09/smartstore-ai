from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.session import SessionLocal
from app.models.automation import AutomationLog

router = APIRouter(prefix="/automation", tags=["Automation"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/logs")
def get_logs(db: Session = Depends(get_db)):
    return db.query(AutomationLog).order_by(AutomationLog.run_time.desc()).all()