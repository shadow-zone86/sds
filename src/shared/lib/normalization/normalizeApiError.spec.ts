import { describe, it, expect } from '@jest/globals';
import { normalizeApiError } from './normalizeApiError';

describe('normalizeApiError', () => {
  it('возвращает сообщение из error.response.data.message', () => {
    const error = {
      response: { data: { message: 'Invalid API key' } },
    };
    expect(normalizeApiError(error)).toBe('Invalid API key');
  });

  it('возвращает error.message для экземпляра Error', () => {
    expect(normalizeApiError(new Error('City not found'))).toBe('City not found');
  });

  it('возвращает сообщение о сети для сетевых ошибок', () => {
    expect(normalizeApiError(new Error('Network error'))).toBe('Проверьте подключение к интернету');
    expect(normalizeApiError(new Error('Network Error'))).toBe('Проверьте подключение к интернету');
  });

  it('возвращает сообщение по умолчанию для null/undefined', () => {
    expect(normalizeApiError(null)).toBe('Ошибка запроса');
    expect(normalizeApiError(undefined)).toBe('Ошибка запроса');
  });

  it('возвращает сообщение по умолчанию для ошибки без message', () => {
    expect(normalizeApiError({})).toBe('Ошибка запроса');
    expect(normalizeApiError({ response: {} })).toBe('Ошибка запроса');
  });

  it('предпочитает response.data.message вместо Error.message', () => {
    const error = Object.assign(new Error('fallback'), {
      response: { data: { message: 'API message' } },
    });
    expect(normalizeApiError(error)).toBe('API message');
  });
});
