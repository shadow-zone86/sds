import {
  API_ERROR_DEFAULT_MESSAGE,
  API_ERROR_NETWORK_MESSAGE,
  API_ERROR_CITY_NOT_FOUND_MESSAGE,
} from '@/shared/config/constants';

/**
 * Одна точка обработки ошибок API — извлекает сообщение из ответа/ошибки.
 * Учитывает геолокацию, API, сетевые ошибки, «город не найден».
 */
export function useApiErrorNormalization(error: unknown): string {
  if (error && typeof error === 'object') {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    const data = err?.response?.data;
    if (data && typeof data.message === 'string') {
      const apiMsg = data.message.toLowerCase();
      if (
        apiMsg.includes('city not found') ||
        apiMsg.includes('nothing to geocode') ||
        apiMsg.includes('not found')
      ) {
        return API_ERROR_CITY_NOT_FOUND_MESSAGE;
      }
      return data.message;
    }
    if (err?.message) {
      const msg = (err.message as string).toLowerCase();
      if (msg.includes('network') || msg.includes('network error')) return API_ERROR_NETWORK_MESSAGE;
      if (msg.includes('city not found') || msg.includes('nothing to geocode')) return API_ERROR_CITY_NOT_FOUND_MESSAGE;
      return err.message;
    }
  }
  return API_ERROR_DEFAULT_MESSAGE;
}
