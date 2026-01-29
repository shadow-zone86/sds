import axios, { type AxiosInstance } from 'axios';
import { normalizeApiError } from '../lib/normalization/normalizeApiError';

const baseURL = (typeof process !== 'undefined' && process.env?.API_BASE) || '/api';

export interface CreateHttpClientOptions {
  baseURL: string;
  timeout?: number;
}

/**
 * Создаёт экземпляр Axios с заданным baseURL и единой обработкой ошибок (normalizeApiError).
 * Используется для привязки к конкретному API (например, OpenWeather) без прямого импорта axios в слайсах.
 */
export function createHttpClient(options: CreateHttpClientOptions): AxiosInstance {
  const client = axios.create({
    baseURL: options.baseURL,
    timeout: options.timeout ?? 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  client.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(new Error(normalizeApiError(error)))
  );
  return client;
}

export const httpClient: AxiosInstance = createHttpClient({
  baseURL,
  timeout: 10000,
});
