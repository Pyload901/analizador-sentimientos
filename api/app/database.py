from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None

db = Database()

async def connect_to_mongo():
    db.client = AsyncIOMotorClient(settings.mongodb_uri)
    db.db = db.client.get_default_database()
    # Si la URI no tiene db default, especificamos el nombre
    if db.db.name == 'test':
        db.db = db.client["analizador_sentimientos"]
    print("Conectado a MongoDB")

async def close_mongo_connection():
    if db.client:
        db.client.close()
        print("Conexión a MongoDB cerrada")
