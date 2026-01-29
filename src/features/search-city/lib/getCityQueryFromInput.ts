import { stringNormalization } from '@/shared/lib/normalization/stringNormalization';

/**
 * Возвращает подходящую для поиска строку запроса города (нормализованная: trim + нижний регистр) или null, если запрос пустой.
 */
export function getCityQueryFromInput(input: string): string | null {
  const inputNormalize = stringNormalization(input);
  return inputNormalize === undefined || inputNormalize === '' ? null : inputNormalize;
}
