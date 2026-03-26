from sqlalchemy import Column, DateTime, Integer, String, Text # type: ignore
from sqlalchemy.sql import func # type: ignore
from app.db.base import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    severity = Column(String, default="low")
    status = Column(String, default="open")
    created_at = Column(DateTime(timezone=True), server_default=func.now())