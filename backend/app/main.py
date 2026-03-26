from fastapi import FastAPI

app = FastAPI(title="Secante Security Control Panel")

@app.get("/")
def root():
    return {"message": "Secante API is running"}