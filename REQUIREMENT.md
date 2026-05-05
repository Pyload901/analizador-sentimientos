Dashboard de Sentimiento del Cliente vía WhatsApp
Visión del Proyecto
Construir un sistema de punta a punta que permita a un negocio local, como la cadena "Café
de El Salvador", recibir feedback de sus clientes a través de WhatsApp. Los mensajes se
guardarán y serán analizados automáticamente por una IA para visualizar en tiempo real el
sentimiento, los temas principales y las tendencias en un dashboard interactivo.
El Problema Central
Las empresas necesitan escuchar a sus clientes, pero revisar manualmente cientos de
mensajes de feedback es ineficiente. Este sistema automatizará la recolección y el análisis,
transformando los mensajes de texto en inteligencia de negocio accionable y fácil de entender
para los gerentes.
Arquitectura y Requisitos Clave
Este desafío se divide en tres componentes principales:
1. Receptor de Mensajes (Backend con Python, Twilio y MongoDB):
○ Configura Twilio: Crea una cuenta de Twilio y configura el Sandbox de
WhatsApp para obtener un número de prueba.
○ Crea un Webhook: Desarrolla un endpoint en tu backend (usando Flask o
FastAPI) que actuará como un webhook. Twilio enviará una solicitud a este
endpoint cada vez que tu número de prueba reciba un mensaje.
○ Procesa y Almacena: El webhook debe:
■ Recibir el cuerpo del mensaje y el número del remitente.
■ Conectarse a una base de datos MongoDB.
■ Guardar cada mensaje como un nuevo documento en una colección. El
documento debe incluir, como mínimo: texto_mensaje,
numero_remitente, y timestamp.
2. Análisis con IA (Integrado en el Backend):
○ Enriquecimiento de Datos: Justo después de guardar un mensaje, o a través
de un proceso separado, el backend debe enviar el texto del mensaje a un LLM
(Modelo de Lenguaje Grande).
Diseña un Prompt Efectivo: El prompt debe instruir a la IA para que analice el mensaje y
devuelva un objeto JSON con la siguiente estructura:
JSON
{
"sentimiento": "positivo" | "negativo" | "neutro",
"tema": "Servicio al Cliente" | "Calidad del Producto" | "Precio" | "Limpieza" | "Otro",
"resumen": "El cliente está muy contento con la rapidez del servicio."
}
○
○ Actualiza la Base de Datos: El backend debe tomar la respuesta de la IA y
actualizar el documento correspondiente en MongoDB, añadiendo los campos
sentimiento, tema, y resumen.
3. Dashboard de Visualización (Frontend con React):
○ Crea la Interfaz: Usando React, diseña un dashboard que se conecte a tu
backend para mostrar los datos analizados. Siéntete libre de usar v0 de Vercel
para acelerar la creación de la UI.
○ API para el Dashboard: El backend debe tener endpoints para que el frontend
pueda solicitar los datos (ej. /api/sentimientos, /api/temas).
○ Componentes Clave del Dashboard:
■ Gráfico de Pastel de Sentimientos: Un gráfico que muestre la
distribución porcentual de sentimientos (positivo, negativo,
neutro).
■ Gráfico de Barras de Temas: Un gráfico que muestre la frecuencia de
cada tema mencionado por los clientes.
■ Feed de Mensajes Recientes: Una lista en tiempo real que muestre los
últimos mensajes recibidos, junto con su sentimiento y tema asignado por
la IA.
Instrucciones de Entrega
4. Proporciona un enlace a un repositorio público de GitHub con tu código fuente
completo.
5. Incluye un archivo README.md que explique claramente:
○ Cómo configurar y ejecutar el proyecto localmente.
○ Las decisiones técnicas que tomaste (ej. librerías, frameworks).
○ Tu enfoque para la ingeniería de prompts para la IA.
6. (Altamente Recomendado) Haz un despliegue de la aplicación y proporciona una URL
pública para que podamos probarla.