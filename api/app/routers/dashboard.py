from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.repositories.mensaje_repository import MensajeRepository
from app.websocket_manager import manager
from typing import List

router = APIRouter()
repo = MensajeRepository()

@router.get("/sentimientos")
async def get_sentimientos():
    data = await repo.get_sentimientos_agregados()
    return data

@router.get("/temas")
async def get_temas():
    data = await repo.get_temas_agregados()
    return data

@router.get("/mensajes")
async def get_mensajes(limit: int = 50):
    mensajes = await repo.get_recent_mensajes(limit)
    return mensajes

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Mantener la conexión viva
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
