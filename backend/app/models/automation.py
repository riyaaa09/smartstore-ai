from sqlalchemy import Column, Integer, String, DateTime
from app.db.session import Base
from datetime import datetime


class AutomationLog(Base):
    __tablename__ = "automation_logs"

    id = Column(Integer, primary_key=True, index=True)
    job_name = Column(String)
    status = Column(String)
    message = Column(String)
    run_time = Column(DateTime, default=datetime.utcnow)