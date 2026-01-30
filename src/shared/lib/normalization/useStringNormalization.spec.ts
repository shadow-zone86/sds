import { describe, it, expect } from '@jest/globals';
import { useStringNormalization } from './useStringNormalization';

describe('useStringNormalization', () => {
  it('возвращает строку в нижнем регистре и без пробелов по краям', () => {
    expect(useStringNormalization('  Москва  ')).toBe('москва');
    expect(useStringNormalization('Санкт-Петербург')).toBe('санкт-петербург');
    expect(useStringNormalization('  UPPERCASE  ')).toBe('uppercase');
  });

  it('возвращает пустую строку для пустой строки и строки из пробелов', () => {
    expect(useStringNormalization('')).toBe('');
    expect(useStringNormalization('   ')).toBe('');
    expect(useStringNormalization('\t\n')).toBe('');
  });

  it('возвращает undefined для нестроковых значений', () => {
    expect(useStringNormalization(null)).toBeUndefined();
    expect(useStringNormalization(undefined)).toBeUndefined();
    expect(useStringNormalization(123)).toBeUndefined();
    expect(useStringNormalization(true)).toBeUndefined();
    expect(useStringNormalization({})).toBeUndefined();
    expect(useStringNormalization([])).toBeUndefined();
  });
});
