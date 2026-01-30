import { describe, it, expect } from '@jest/globals';
import { useApiErrorNormalization } from './useApiErrorNormalization';

describe('useApiErrorNormalization', () => {
  it('возвращает сообщение из error.response.data.message', () => {
    const error = {
      response: { data: { message: 'Invalid API key' } },
    };
    expect(useApiErrorNormalization(error)).toBe('Invalid API key');
  });

  it('возвращает error.message для экземпляра Error', () => {
    expect(useApiErrorNormalization(new Error('Some error'))).toBe('Some error');
  });

  it('возвращает сообщение «город не найден» для city not found', () => {
    expect(useApiErrorNormalization(new Error('City not found'))).toBe(
      'Город не найден. Проверьте название и попробуйте снова.'
    );
    const error = { response: { data: { message: 'city not found' } } };
    expect(useApiErrorNormalization(error)).toBe(
      'Город не найден. Проверьте название и попробуйте снова.'
    );
  });

  it('возвращает сообщение о сети для сетевых ошибок', () => {
    expect(useApiErrorNormalization(new Error('Network error'))).toBe('Проверьте подключение к интернету');
    expect(useApiErrorNormalization(new Error('Network Error'))).toBe('Проверьте подключение к интернету');
  });

  it('возвращает сообщение по умолчанию для null/undefined', () => {
    expect(useApiErrorNormalization(null)).toBe('Ошибка запроса');
    expect(useApiErrorNormalization(undefined)).toBe('Ошибка запроса');
  });

  it('возвращает сообщение по умолчанию для ошибки без message', () => {
    expect(useApiErrorNormalization({})).toBe('Ошибка запроса');
    expect(useApiErrorNormalization({ response: {} })).toBe('Ошибка запроса');
  });

  it('предпочитает response.data.message вместо Error.message', () => {
    const error = Object.assign(new Error('fallback'), {
      response: { data: { message: 'API message' } },
    });
    expect(useApiErrorNormalization(error)).toBe('API message');
  });
});
