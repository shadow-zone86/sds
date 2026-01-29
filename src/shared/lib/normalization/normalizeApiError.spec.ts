import { describe, it, expect } from '@jest/globals';
import { normalizeApiError } from './normalizeApiError';

describe('normalizeApiError', () => {
  it('returns message from error.response.data.message', () => {
    const error = {
      response: { data: { message: 'Invalid API key' } },
    };
    expect(normalizeApiError(error)).toBe('Invalid API key');
  });

  it('returns error.message for Error instance', () => {
    expect(normalizeApiError(new Error('Network error'))).toBe('Network error');
  });

  it('returns default message for null/undefined', () => {
    expect(normalizeApiError(null)).toBe('Ошибка запроса');
    expect(normalizeApiError(undefined)).toBe('Ошибка запроса');
  });

  it('returns default message for error without message', () => {
    expect(normalizeApiError({})).toBe('Ошибка запроса');
    expect(normalizeApiError({ response: {} })).toBe('Ошибка запроса');
  });

  it('prefers response.data.message over Error.message', () => {
    const error = Object.assign(new Error('fallback'), {
      response: { data: { message: 'API message' } },
    });
    expect(normalizeApiError(error)).toBe('API message');
  });
});
