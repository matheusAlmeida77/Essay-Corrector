import axios from 'axios';

// Configurar o cliente Axios para acessar o backend Python
export const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 15000, // Tempo limite de 15 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para tratamento global de erros
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('Resposta de erro do servidor:', error.response.data);
    }
    return Promise.reject(error);
  }
);
