from app.database import db
from datetime import datetime
from bson import ObjectId

class MensajeRepository:
    def get_collection(self):
        return db.db["mensajes"]

    async def create_mensaje(self, texto: str, remitente: str) -> str:
        collection = self.get_collection()
        doc = {
            "texto_mensaje": texto,
            "numero_remitente": remitente,
            "timestamp": datetime.utcnow()
        }
        result = await collection.insert_one(doc)
        return str(result.inserted_id)

    async def update_mensaje_ia(self, mensaje_id: str, sentimiento: str, tema: str, resumen: str):
        collection = self.get_collection()
        await collection.update_one(
            {"_id": ObjectId(mensaje_id)},
            {"$set": {
                "sentimiento": sentimiento,
                "tema": tema,
                "resumen": resumen
            }}
        )

    async def get_recent_mensajes(self, limit: int = 50):
        collection = self.get_collection()
        cursor = collection.find().sort("timestamp", -1).limit(limit)
        mensajes = []
        async for doc in cursor:
            doc["_id"] = str(doc["_id"])
            mensajes.append(doc)
        return mensajes

    async def get_sentimientos_agregados(self):
        collection = self.get_collection()
        pipeline = [
            {"$match": {"sentimiento": {"$exists": True, "$ne": None}}},
            {"$group": {"_id": "$sentimiento", "count": {"$sum": 1}}}
        ]
        cursor = collection.aggregate(pipeline)
        result = {"positivo": 0, "negativo": 0, "neutro": 0}
        async for doc in cursor:
            if doc["_id"] in result:
                result[doc["_id"]] = doc["count"]
        return result

    async def get_temas_agregados(self):
        collection = self.get_collection()
        pipeline = [
            {"$match": {"tema": {"$exists": True, "$ne": None}}},
            {"$group": {"_id": "$tema", "count": {"$sum": 1}}}
        ]
        cursor = collection.aggregate(pipeline)
        result = {}
        async for doc in cursor:
            result[doc["_id"]] = doc["count"]
        return result
