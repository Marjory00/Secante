from fastapi import FastAPI # type: ignore

app = FastAPI(title="Secante Security Control Panel")

@app.get("/")
def root():
    return {"message": "Secante API is running"}