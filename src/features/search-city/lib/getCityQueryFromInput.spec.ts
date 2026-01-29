import { describe, it, expect } from '@jest/globals';
import { getCityQueryFromInput } from './getCityQueryFromInput';

describe('getCityQueryFromInput', () => {
  it('возвращает null для пустой строки', () => {
    expect(getCityQueryFromInput('')).toBeNull();
  });

  it('возвращает null для строки из пробелов', () => {
    expect(getCityQueryFromInput('   ')).toBeNull();
    expect(getCityQueryFromInput('\t\n')).toBeNull();
  });

  it('возвращает нормализованную строку (trim + нижний регистр)', () => {
    expect(getCityQueryFromInput('Москва')).toBe('москва');
    expect(getCityQueryFromInput('  Москва  ')).toBe('москва');
    expect(getCityQueryFromInput('Санкт-Петербург')).toBe('санкт-петербург');
  });
});
