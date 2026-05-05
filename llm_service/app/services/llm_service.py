from openai import AsyncOpenAI
import json
from app.config import settings

client = AsyncOpenAI(
    api_key=settings.openai_api_key,
    base_url=settings.openai_base_url,
)

SYSTEM_PROMPT = """Eres un experto analizando el sentimiento y los temas de mensajes de clientes (feedback).
Debes devolver estrictamente un objeto JSON con la siguiente estructura y NADA MÁS:
{
"sentimiento": "positivo" | "negativo" | "neutro",
"tema": "Servicio al Cliente" | "Calidad del Producto" | "Precio" | "Limpieza" | "Otro",
"resumen": "Un resumen muy breve del mensaje."
}
No añadas texto antes ni después del JSON."""

async def process_prompt(text: str) -> dict:
    try:
        response = await client.chat.completions.create(
            model=settings.ai_model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": text}
            ],
            response_format={"type": "json_object"},
            temperature=0.0
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as e:
        # Fallback in case of parsing errors or API errors
        print(f"Error procesando LLM: {str(e)}")
        return {
            "sentimiento": "neutro",
            "tema": "Otro",
            "resumen": "Error al analizar"
        }
