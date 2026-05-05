import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const fetchSentimientos = async () => {
  const { data } = await axios.get(`${API_URL}/sentimientos`);
  return data;
};

export const fetchTemas = async () => {
  const { data } = await axios.get(`${API_URL}/temas`);
  return data;
};

export const fetchMensajes = async () => {
  const { data } = await axios.get(`${API_URL}/mensajes`);
  return data;
};
