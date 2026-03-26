from sqlalchemy import Column, DateTime, Integer, String # type: ignore
from sqlalchemy.sql import func # type: ignore
from app.db.base import Base

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    serial_number = Column(String, unique=True, nullable=False)
    device_type = Column(String, nullable=False)
    location = Column(String, nullable=True)
    status = Column(String, default="offline")
    created_at = Column(DateTime(timezone=True), server_default=func.now())