from pydantic import BaseModel

class AnalyzeRequest(BaseModel):
    prompt: str

class AnalyzeResponse(BaseModel):
    sentimiento: str
    tema: str
    resumen: str
