import axios from 'axios';

// Base URL da API, obtida do ambiente
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
 /*  baseURL: API_URL, */
});

// Interceptores podem ser configurados aqui, se necessário
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
