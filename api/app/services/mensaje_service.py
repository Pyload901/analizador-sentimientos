from app.repositories.mensaje_repository import MensajeRepository
from app.services.ia_service import analyze_text
from app.websocket_manager import manager
import asyncio
import logging

logger = logging.getLogger(__name__)
repo = MensajeRepository()

async def process_incoming_message(texto: str, remitente: str):
    # 1. Guardar mensaje inicial
    mensaje_id = await repo.create_mensaje(texto, remitente)
    logger.info(f"Mensaje {mensaje_id} guardado.")
    
    # 2. Analizar en background para no bloquear el webhook de Twilio
    asyncio.create_task(_analyze_and_update(mensaje_id, texto, remitente))
    
    return {"status": "received", "id": mensaje_id}

async def _analyze_and_update(mensaje_id: str, texto: str, remitente: str):
    try:
        # Analizar con IA
        resultado = await analyze_text(texto)
        
        # Actualizar en BD
        await repo.update_mensaje_ia(
            mensaje_id=mensaje_id,
            sentimiento=resultado["sentimiento"],
            tema=resultado["tema"],
            resumen=resultado["resumen"]
        )
        logger.info(f"Mensaje {mensaje_id} analizado y actualizado.")
        
        # Notificar a los clientes conectados (Dashboard) vía WebSocket
        await manager.broadcast_message({
            "type": "new_message",
            "data": {
                "_id": str(mensaje_id),
                "texto_mensaje": texto,
                "numero_remitente": remitente,
                "sentimiento": resultado["sentimiento"],
                "tema": resultado["tema"],
                "resumen": resultado["resumen"],
                # Usar timestamp actual simplificado
                "timestamp": None 
            }
        })
    except Exception as e:
        logger.error(f"Fallo al analizar el mensaje {mensaje_id}: {str(e)}")

