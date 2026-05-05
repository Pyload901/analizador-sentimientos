import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchSentimientos, fetchTemas, fetchMensajes } from '../api/dashboardApi';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/api/ws';

export const useDashboard = () => {
  const queryClient = useQueryClient();

  const sentimientosQuery = useQuery({
    queryKey: ['sentimientos'],
    queryFn: fetchSentimientos,
  });

  const temasQuery = useQuery({
    queryKey: ['temas'],
    queryFn: fetchTemas,
  });

  const mensajesQuery = useQuery({
    queryKey: ['mensajes'],
    queryFn: fetchMensajes,
  });

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new_message') {
          // Invalidar queries para forzar recarga
          queryClient.invalidateQueries({ queryKey: ['sentimientos'] });
          queryClient.invalidateQueries({ queryKey: ['temas'] });
          queryClient.invalidateQueries({ queryKey: ['mensajes'] });
        }
      } catch (e) {
        console.error('Error parseando mensaje WS', e);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [queryClient]);

  const isLoading = sentimientosQuery.isLoading || temasQuery.isLoading || mensajesQuery.isLoading;
  const isError = sentimientosQuery.isError || temasQuery.isError || mensajesQuery.isError;

  return {
    sentimientos: sentimientosQuery.data || {},
    temas: temasQuery.data || {},
    mensajes: mensajesQuery.data || [],
    isLoading,
    isError,
  };
};
