from fastapi import APIRouter, Form, HTTPException, Request
from app.services.mensaje_service import process_incoming_message
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/twilio")
async def twilio_webhook(request: Request):
    # Twilio envía los datos como application/x-www-form-urlencoded
    form_data = await request.form()
    
    body = form_data.get("Body")
    from_number = form_data.get("From")
    
    if not body or not from_number:
        logger.warning("Faltan datos en el webhook de Twilio")
        raise HTTPException(status_code=400, detail="Missing Body or From")
        
    logger.info(f"Recibido mensaje de {from_number}: {body}")
    
    # Procesar asíncronamente
    await process_incoming_message(texto=body, remitente=from_number)
    
    # Retornar una respuesta XML vacía que Twilio espera (TwiML)
    return "<Response></Response>"
