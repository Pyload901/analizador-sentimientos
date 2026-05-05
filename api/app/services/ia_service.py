import httpx
from app.config import settings
from app.exceptions import BusinessLogicException
import logging

logger = logging.getLogger(__name__)

async def analyze_text(text: str) -> dict:
    """Envía el texto al microservicio de IA y retorna el JSON resultante."""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                settings.ia_service_url,
                json={"prompt": text}
            )
            response.raise_for_status()
            data = response.json()
            return {
                "sentimiento": data.get("sentimiento", "neutro"),
                "tema": data.get("tema", "Otro"),
                "resumen": data.get("resumen", "Sin resumen")
            }
    except httpx.HTTPError as e:
        logger.error(f"Error comunicando con microservicio de IA: {str(e)}")
        raise BusinessLogicException("No se pudo analizar el mensaje con IA", status_code=503)
    except Exception as e:
        logger.error(f"Error inesperado en ia_service: {str(e)}")
        raise BusinessLogicException("Error interno en servicio IA", status_code=500)
