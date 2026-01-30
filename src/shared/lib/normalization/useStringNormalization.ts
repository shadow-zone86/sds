import pkg from 'lodash';

/**
 * Нормализует строку (trim + нижний регистр). Для не строк возвращает undefined.
 */
function useStringNormalization(value: unknown): string | undefined {
  const { isString } = pkg;

  if (isString(value)) {
    return value.toLowerCase().trim();
  }

  return undefined;
}

export { useStringNormalization };
