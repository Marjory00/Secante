from pydantic import BaseModel

class AlertCreate(BaseModel):
    title: str
    description: str | None = None
    severity: str = "low"
    status: str = "open"

class AlertOut(BaseModel):
    id: int
    title: str
    description: str | None
    severity: str
    status: str

    class Config:
        from_attributes = True