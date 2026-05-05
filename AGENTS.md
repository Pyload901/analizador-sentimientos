# AGENTS.md - Guía de Arquitectura y Clean Code

## 1. Visión General del Proyecto
Este proyecto es un Dashboard de Sentimiento del Cliente vía WhatsApp. El objetivo es construir un sistema de punta a punta que permita a negocios, como la cadena "Café de El Salvador" o cualquier negocio en general, recibir feedback de sus clientes mediante WhatsApp. El sistema automatizará la recolección y el análisis de estos mensajes, transformándolos en inteligencia de negocio accionable.

## 2. Stack Tecnológico
*   **Frontend:** React (Client-Side Rendering - CSR).
*   **Backend Principal:** Python con FastAPI.
*   **Base de Datos:** MongoDB.
*   **Integración de Mensajería:** Twilio (Sandbox de WhatsApp).
*   **Microservicio de IA:** Python con FastAPI y proveedor de IA compatible con la API de OpenAI (Servicio aislado).
*   **Infraestructura:** Docker y `docker-compose` para orquestación y construcción sencilla.

## 3. Arquitectura de Microservicios y Contenedores
El sistema debe ser "dockerizado" utilizando un enfoque de múltiples contenedores:

1.  **Contenedor Frontend (React):** Aplicación CSR que consumirá la API del backend.
2.  **Contenedor Backend Core (FastAPI):** Manejará los webhooks de Twilio, la lógica de negocio y la conexión a MongoDB.
3.  **Contenedor Microservicio IA (FastAPI):** Un servicio agnóstico y reutilizable. Recibirá estrictamente un prompt de entrada y retornará únicamente la respuesta generada por el LLM, sin lógica de negocio adicional acoplada.
4.  **Contenedor Base de Datos:** Instancia de MongoDB.

## 4. Reglas Estrictas de Desarrollo (Clean Code y Buenas Prácticas)

### Backend (Python / FastAPI)
*   **Tipado Estricto:** Utiliza `Type Hints` de Python y Pydantic para la validación de todos los modelos de entrada y salida.
*   **Estructura Modular:** Separa los controladores (routers), la lógica de negocio (servicios) y la capa de acceso a datos (repositorios).
*   **Webhook de Twilio:** Desarrolla un endpoint que actúe como webhook para recibir el cuerpo del mensaje y el número del remitente.
*   **Esquema de Base de Datos:** Al guardar en MongoDB, el documento debe incluir los campos `texto_mensaje`, `numero_remitente` y `timestamp`. Posteriormente, el sistema debe actualizar el documento añadiendo los campos `sentimiento`, `tema` y `resumen`.
*   **Manejo de Errores:** Implementa un manejo de excepciones global y devuelve códigos de estado HTTP semánticos (ej. 400 para errores de validación, 500 para errores del servidor).

### Microservicio de IA
*   **Responsabilidad Única:** Este microservicio solo tiene una tarea. Debe recibir un prompt estructurado, procesarlo con el LLM y devolver la salida en bruto.
*   **Formato Requerido:** El prompt debe instruir a la IA para devolver un objeto JSON estricto con la siguiente estructura:
```json
{
"sentimiento": "positivo" | "negativo" | "neutro",
"tema": "Servicio al Cliente" | "Calidad del Producto" | "Precio" | "Limpieza" | "Otro",
"resumen": "El cliente está muy contento con la rapidez del servicio."
}
``` 

### Frontend (React / v0)
*   **Integración con v0:** Toma los componentes generados por v0 y refactorízalos si es necesario para asegurar que el manejo del estado (ej. `useState`, `useEffect` o Zustand/Redux) esté separado de la UI.
*   **Componentes Requeridos:** El dashboard debe consumir la API del backend para renderizar un Gráfico de Pastel de Sentimientos, un Gráfico de Barras de Temas y un Feed de Mensajes Recientes en tiempo real.
*   **Manejo de Peticiones:** Utiliza librerías como `axios` o `SWR`/`React Query` para manejar el fetching de datos, estados de carga (loading) y manejo de errores.

### Docker y DevOps
*   **Dockerfiles Multi-stage:** Utiliza builds de múltiples etapas para reducir el tamaño final de las imágenes, especialmente para el frontend de React.
*   **Variables de Entorno:** Nunca quemes credenciales (Twilio SID, MongoDB URI, OpenAI API Keys) en el código. Utiliza archivos `.env` y pásalos mediante `docker-compose`.