from pydantic import BaseModel

class DeviceCreate(BaseModel):
    name: str
    serial_number: str
    device_type: str
    location: str | None = None
    status: str = "offline"

class DeviceOut(BaseModel):
    id: int
    name: str
    serial_number: str
    device_type: str
    location: str | None
    status: str

    class Config:
        from_attributes = True