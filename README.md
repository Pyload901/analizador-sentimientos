# Dashboard de Sentimiento del Cliente vía WhatsApp

Un sistema integral que permite a las empresas recibir feedback de clientes a través de WhatsApp, analizarlos automáticamente con Inteligencia Artificial para determinar sentimiento y tema, y visualizarlos en un dashboard interactivo en tiempo real.

## 🚀 Arquitectura y Tecnologías

Este sistema está dividido en múltiples microservicios orquestados con Docker:

1. **Frontend Dashboard (`web/`)**: Desarrollado con **React**, **Vite** y **Recharts**. Consume la API mediante **React Query** (fetching inicial) y **WebSockets** (actualizaciones en tiempo real, sin polling). Diseño premium oscuro con glassmorphism y acento ámbar/dorado, tipografía Inter, animaciones CSS.
2. **Backend Core (`api/`)**: API construida con **FastAPI** y **Motor (MongoDB Async)**. Expone el webhook de Twilio, persiste los datos en MongoDB y gestiona las conexiones WebSocket para notificar al frontend al completarse el análisis.
3. **Microservicio IA (`llm_service/`)**: Servicio **FastAPI** independiente y agnóstico, responsable únicamente de recibir un prompt y retornar la respuesta del LLM. Compatible con cualquier proveedor que implemente la API de OpenAI (OpenAI, Deepseek, Ollama, etc.) mediante variables de entorno.
4. **Base de Datos**: Instancia de **MongoDB** para persistir mensajes y su análisis de sentimiento.

## 🛠️ Configuración y Ejecución Local

### Prerrequisitos
- Docker y Docker Compose
- Cuenta de Twilio con el Sandbox de WhatsApp activado
- API Key de tu proveedor de IA (OpenAI o Deepseek)

### Pasos

1. **Clonar y configurar el entorno**
   ```bash
   cp .env.example .env
   ```
2. **Editar el `.env`** con tus credenciales:

   | Variable | Descripción |
   |---|---|
   | `TWILIO_ACCOUNT_SID` | SID de tu cuenta de Twilio |
   | `TWILIO_AUTH_TOKEN` | Auth Token de Twilio |
   | `OPENAI_API_KEY` | API Key de tu proveedor de IA |
   | `OPENAI_BASE_URL` | URL base del proveedor (`https://api.openai.com/v1` u `https://api.deepseek.com/v1`) |
   | `AI_MODEL` | Modelo a usar (`gpt-4o`, `deepseek-chat`, etc.) |
   | `MONGO_URI` | URI de conexión a MongoDB |
   | `IA_SERVICE_URL` | URL interna del microservicio IA (no modificar si usas Docker Compose) |

3. **Levantar todos los servicios**
   ```bash
   docker compose up -d --build
   ```
   Los servicios quedarán disponibles en:
   - **Frontend**: http://localhost:3000
   - **Backend Core**: http://localhost:8000
   - **Microservicio IA**: http://localhost:8001
   - **MongoDB**: localhost:27017

### Pruebas Locales (Sin Twilio)

Puedes simular la recepción de un mensaje de WhatsApp usando el script incluido. Los caracteres especiales del español son soportados correctamente:

```bash
./test_webhook.sh "Me encantó el café, muy amables" "+50388889999"
```

> ⚠️ El script usa `--data-urlencode` para codificar los caracteres UTF-8 correctamente, replicando el comportamiento de Twilio.

## 🧠 Prompt Engineering

El microservicio IA usa un `SYSTEM_PROMPT` estricto que instruye al modelo a actuar como experto en análisis de sentimiento y retornar **únicamente un JSON válido** (via `response_format={"type": "json_object"}` con temperatura `0.0` para máximo determinismo).

**Estructura del JSON retornado:**
```json
{
  "sentimiento": "positivo" | "negativo" | "neutro",
  "tema": "Servicio al Cliente" | "Calidad del Producto" | "Precio" | "Limpieza" | "Otro",
  "resumen": "Descripción breve del feedback del cliente."
}
```

## 🔐 Decisiones Técnicas

- **Soporte Multi-proveedor de IA:** El microservicio acepta `OPENAI_BASE_URL`, `OPENAI_API_KEY` y `AI_MODEL` como variables de entorno. Puedes cambiar entre OpenAI, Deepseek o cualquier proveedor compatible sin modificar el código.
- **Aislamiento del LLM:** La lógica de IA está en su propio contenedor. Esto evita que latencias o errores de red hacia el proveedor de IA bloqueen la recepción de webhooks en el backend core y facilita el escalado independiente de cada microservicio.
- **Event-Driven UI:** Al completarse el análisis asíncrono en el backend, se emite un broadcast WebSocket. El frontend lo recibe e invalida la caché de React Query, refetchando solo en ese momento.
- **Asincronismo completo:** Uso de `async/await` con `httpx` (llamadas HTTP a IA), `motor` (MongoDB) y el driver `openai` asíncrono para maximizar el throughput bajo carga de webhooks concurrentes.
- **Sin autenticación para MVP:** No se implementó autenticación para el dashboard debido a que se trata de un MVP, por lo que se implementará en una futura versión.
- **Docker Compose para todo**: Se utiliza docker compose para orquestar los 4 servicios (Frontend, Backend Core, Microservicio IA y MongoDB). Esto permite ejecutar el proyecto localmente sin problemas de versionamiento o dependencias. Además facilita el despliegue, monitoreo y mantenimiento de los servicios.

## 🧠 Mi enfoque en la ingeniería de prompts

Para realizar un proyecto lo más importante es empezar con buenas decisiones, por lo que el primer paso que tomé fue analizar el requerimiento para evaluar qué se necesita, qué tecnologías utilizar y qué arquitectura tomar.

En este proyecto se establecieron los lineamientos iniciales:
- Arquitectura escalable.
- Código limpio, modular y reutilizable.
- Uso de tecnologías modernas y eficientes.
- Documentación adecuada.

Luego, trabajé en un prompt para generar el AGENTS.md que establece los lineamientos de los agentes para el desarrollo del proyecto. Este documento fue generado utilizando un LLM (específicamente Gemini 3.1 Pro).

Posteriormente trabajé con un editor de IA nativo (Antigravity) para empezar el proyecto. El proyecto se trabajó en metodología ágil de la siguiente manera:

- El agente toma el rol de project manager y dado el requerimiento y los lineamientos, genera un plan de trabajo divido en épicas e historias de usuario. (el plan de trabajo se encuentra en `/docs/implementation_plan_completed.md`)
- El humano revisa el plan de trabajo y ajusta si es necesario.
- Luego el agente toma el rol de desarrollador y analiza las tareas para implementarlas.
- El humano verifica si las actividades realizadas son correctas y retroalimenta al agente para que pueda mejorar y corregir errores.
- Este proceso se repite hasta que el proyecto esté completado.

Mi rol también fue generar el entorno adecuado para que el agente pueda trabajar de manera eficiente y ahorrar unos cuantos tokens, preparé los servicios de docker, las variables de entorno y la infraestructura necesaria para el correcto funcionamiento del proyecto.

## 📁 Estructura del Proyecto

```
analizador-sentimientos/
├── api/                    # Backend Core (FastAPI)
│   ├── app/
│   │   ├── routers/        # Endpoints: webhook, dashboard
│   │   ├── services/       # Lógica de negocio
│   │   ├── repositories/   # Acceso a MongoDB
│   │   └── ...
│   └── Dockerfile
├── llm_service/            # Microservicio IA (FastAPI)
│   ├── app/
│   └── Dockerfile
├── web/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Charts, Feed, KPIs, Layout
│   │   ├── hooks/          # useDashboard (React Query + WebSocket)
│   │   ├── pages/          # Dashboard
│   │   └── index.css       # Sistema de diseño (CSS puro)
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
├── AGENTS.md
├── REQUIREMENT.md          # Requerimiento inicial del sistema
└── test_webhook.sh         # Script para simular mensajes de Twilio
```
