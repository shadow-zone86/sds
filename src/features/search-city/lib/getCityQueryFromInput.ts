import { useStringNormalization } from '@/shared/lib/normalization/useStringNormalization';

/**
 * Возвращает подходящую для поиска строку запроса города (нормализованная через useStringNormalization: trim + нижний регистр) или null, если запрос пустой.
 */
export function getCityQueryFromInput(input: string): string | null {
  const inputNormalize = useStringNormalization(input);
  return inputNormalize === undefined || inputNormalize === '' ? null : inputNormalize;
}
