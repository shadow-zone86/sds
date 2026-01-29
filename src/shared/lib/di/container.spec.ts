import { describe, it, expect, beforeEach } from '@jest/globals';
import {
  container,
  createToken,
  resolveOr,
  resolveRequired,
} from './container';

describe('DI container', () => {
  beforeEach(() => {
    container.clear();
  });

  describe('registerSingleton / resolve', () => {
    it('возвращает зарегистрированный синглтон по токену', () => {
      const token = createToken('Test.Singleton');
      const instance = { id: 1 };
      container.registerSingleton(token, instance);
      expect(container.resolve(token)).toBe(instance);
    });
  });

  describe('registerFactory / resolve', () => {
    it('вызывает фабрику и возвращает новый экземпляр каждый раз', () => {
      const token = createToken('Test.Factory');
      let count = 0;
      container.registerFactory(token, () => ({ id: ++count }));
      expect(container.resolve<{ id: number }>(token)?.id).toBe(1);
      expect(container.resolve<{ id: number }>(token)?.id).toBe(2);
    });
  });

  describe('resolve', () => {
    it('возвращает undefined для неизвестного токена', () => {
      expect(container.resolve(createToken('Unknown'))).toBeUndefined();
    });
  });

  describe('createToken', () => {
    it('возвращает один и тот же symbol для одного описания', () => {
      const t1 = createToken('Same');
      const t2 = createToken('Same');
      expect(t1).toBe(t2);
    });
  });

  describe('resolveOr', () => {
    it('возвращает зарезолвленное значение при регистрации', () => {
      const token = createToken('Test.Or');
      container.registerSingleton(token, 'registered');
      const fallback = () => 'fallback';
      expect(resolveOr(token, fallback)).toBe('registered');
    });

    it('возвращает fallback при отсутствии регистрации', () => {
      const token = createToken('Test.Or.Missing');
      expect(resolveOr(token, () => 'fallback')).toBe('fallback');
    });
  });

  describe('resolveRequired', () => {
    it('возвращает зарезолвленное значение при регистрации', () => {
      const token = createToken('Test.Required');
      container.registerSingleton(token, 42);
      expect(resolveRequired<number>(token)).toBe(42);
    });

    it('бросает ошибку при отсутствии регистрации', () => {
      const token = createToken('Test.Required.Missing');
      expect(() => resolveRequired(token)).toThrow(
        /DI: dependency not found for token/
      );
    });

    it('использует пользовательское сообщение об ошибке при передаче', () => {
      const token = createToken('Test.Required.Custom');
      expect(() => resolveRequired(token, 'Custom error')).toThrow('Custom error');
    });
  });

  describe('clear', () => {
    it('удаляет все регистрации', () => {
      const token = createToken('Test.Clear');
      container.registerSingleton(token, 'value');
      container.clear();
      expect(container.resolve(token)).toBeUndefined();
    });
  });
});
