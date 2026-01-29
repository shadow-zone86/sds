import axios, { type AxiosInstance } from 'axios';
import { normalizeApiError } from '../lib/normalization/normalizeApiError';

const baseURL = (typeof process !== 'undefined' && process.env?.API_BASE) || '/api';

export const httpClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(new Error(normalizeApiError(error)))
);
