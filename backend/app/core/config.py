import os
from dotenv import load_dotenv # type: ignore

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Secante API"
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://secante:secante123@localhost:5432/secante_db"
    )
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-this-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

settings = Settings()