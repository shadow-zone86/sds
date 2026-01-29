import { describe, it, expect } from '@jest/globals';
import { stringNormalization } from './stringNormalization';

describe('stringNormalization', () => {
  it('возвращает строку в нижнем регистре и без пробелов по краям', () => {
    expect(stringNormalization('  Москва  ')).toBe('москва');
    expect(stringNormalization('Санкт-Петербург')).toBe('санкт-петербург');
    expect(stringNormalization('  UPPERCASE  ')).toBe('uppercase');
  });

  it('возвращает пустую строку для пустой строки и строки из пробелов', () => {
    expect(stringNormalization('')).toBe('');
    expect(stringNormalization('   ')).toBe('');
    expect(stringNormalization('\t\n')).toBe('');
  });

  it('возвращает undefined для нестроковых значений', () => {
    expect(stringNormalization(null)).toBeUndefined();
    expect(stringNormalization(undefined)).toBeUndefined();
    expect(stringNormalization(123)).toBeUndefined();
    expect(stringNormalization(true)).toBeUndefined();
    expect(stringNormalization({})).toBeUndefined();
    expect(stringNormalization([])).toBeUndefined();
  });
});
