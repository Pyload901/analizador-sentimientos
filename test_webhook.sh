#!/bin/bash

# Este script simula una petición de Twilio al webhook
# Uso: ./test_webhook.sh "Tu mensaje de prueba" "+50377778888"

TEXTO=${1:-"El café estaba frío y el servicio muy lento."}
REMITENTE=${2:-"+50370001111"}

echo "Enviando mensaje simulado a http://localhost:8000/api/webhook/twilio"
echo "Texto: $TEXTO"
echo "De: $REMITENTE"
echo ""

curl -X POST http://localhost:8000/api/webhook/twilio \
  --data-urlencode "Body=$TEXTO" \
  --data-urlencode "From=$REMITENTE"

echo -e "\n\nMensaje enviado."
