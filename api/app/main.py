from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import connect_to_mongo, close_mongo_connection
from app.routers import webhook, dashboard
from app.exceptions import BusinessLogicException, business_logic_exception_handler, global_exception_handler
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Analizador de Sentimientos API")

# CORS para permitir peticiones del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción usar: ["http://localhost:3000", "https://tu-dominio.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
app.add_exception_handler(BusinessLogicException, business_logic_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# Eventos de base de datos
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Routers
app.include_router(webhook.router, prefix="/api/webhook", tags=["Webhook"])
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])

@app.get("/health")
def health_check():
    return {"status": "ok"}
