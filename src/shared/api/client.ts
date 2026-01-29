import axios, { type AxiosInstance } from 'axios';

const baseURL = (typeof process !== 'undefined' && process.env?.API_BASE) || '/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    return Promise.reject(error);
  }
);
