import { describe, it, expect } from '@jest/globals';
import { apiErrorNormalization } from './apiErrorNormalization';

describe('apiErrorNormalization', () => {
  it('возвращает сообщение из error.response.data.message', () => {
    const error = {
      response: { data: { message: 'Invalid API key' } },
    };
    expect(apiErrorNormalization(error)).toBe('Invalid API key');
  });

  it('возвращает error.message для экземпляра Error', () => {
    expect(apiErrorNormalization(new Error('Some error'))).toBe('Some error');
  });

  it('возвращает сообщение «город не найден» для city not found', () => {
    expect(apiErrorNormalization(new Error('City not found'))).toBe(
      'Город не найден. Проверьте название и попробуйте снова.'
    );
    const error = { response: { data: { message: 'city not found' } } };
    expect(apiErrorNormalization(error)).toBe(
      'Город не найден. Проверьте название и попробуйте снова.'
    );
  });

  it('возвращает сообщение о сети для сетевых ошибок', () => {
    expect(apiErrorNormalization(new Error('Network error'))).toBe('Проверьте подключение к интернету');
    expect(apiErrorNormalization(new Error('Network Error'))).toBe('Проверьте подключение к интернету');
  });

  it('возвращает сообщение по умолчанию для null/undefined', () => {
    expect(apiErrorNormalization(null)).toBe('Ошибка запроса');
    expect(apiErrorNormalization(undefined)).toBe('Ошибка запроса');
  });

  it('возвращает сообщение по умолчанию для ошибки без message', () => {
    expect(apiErrorNormalization({})).toBe('Ошибка запроса');
    expect(apiErrorNormalization({ response: {} })).toBe('Ошибка запроса');
  });

  it('предпочитает response.data.message вместо Error.message', () => {
    const error = Object.assign(new Error('fallback'), {
      response: { data: { message: 'API message' } },
    });
    expect(apiErrorNormalization(error)).toBe('API message');
  });
});
