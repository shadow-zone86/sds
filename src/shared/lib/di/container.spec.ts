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
    it('returns registered singleton by token', () => {
      const token = createToken('Test.Singleton');
      const instance = { id: 1 };
      container.registerSingleton(token, instance);
      expect(container.resolve(token)).toBe(instance);
    });
  });

  describe('registerFactory / resolve', () => {
    it('invokes factory and returns new instance each time', () => {
      const token = createToken('Test.Factory');
      let count = 0;
      container.registerFactory(token, () => ({ id: ++count }));
      expect(container.resolve<{ id: number }>(token)?.id).toBe(1);
      expect(container.resolve<{ id: number }>(token)?.id).toBe(2);
    });
  });

  describe('resolve', () => {
    it('returns undefined for unknown token', () => {
      expect(container.resolve(createToken('Unknown'))).toBeUndefined();
    });
  });

  describe('createToken', () => {
    it('returns same symbol for same description', () => {
      const t1 = createToken('Same');
      const t2 = createToken('Same');
      expect(t1).toBe(t2);
    });
  });

  describe('resolveOr', () => {
    it('returns resolved value when registered', () => {
      const token = createToken('Test.Or');
      container.registerSingleton(token, 'registered');
      const fallback = () => 'fallback';
      expect(resolveOr(token, fallback)).toBe('registered');
    });

    it('returns fallback when not registered', () => {
      const token = createToken('Test.Or.Missing');
      expect(resolveOr(token, () => 'fallback')).toBe('fallback');
    });
  });

  describe('resolveRequired', () => {
    it('returns resolved value when registered', () => {
      const token = createToken('Test.Required');
      container.registerSingleton(token, 42);
      expect(resolveRequired<number>(token)).toBe(42);
    });

    it('throws when not registered', () => {
      const token = createToken('Test.Required.Missing');
      expect(() => resolveRequired(token)).toThrow(
        /DI: dependency not found for token/
      );
    });

    it('uses custom error message when provided', () => {
      const token = createToken('Test.Required.Custom');
      expect(() => resolveRequired(token, 'Custom error')).toThrow('Custom error');
    });
  });

  describe('clear', () => {
    it('removes all registrations', () => {
      const token = createToken('Test.Clear');
      container.registerSingleton(token, 'value');
      container.clear();
      expect(container.resolve(token)).toBeUndefined();
    });
  });
});
