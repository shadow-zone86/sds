const DEFAULT_MESSAGE = 'Ошибка запроса';

const NETWORK_ERROR_MESSAGE = 'Проверьте подключение к интернету';

const CITY_NOT_FOUND_MESSAGE = 'Город не найден. Проверьте название и попробуйте снова.';

/**
 * Одна точка обработки ошибок API: извлекает сообщение из ответа/ошибки.
 * Учитывает геолокацию, API, сетевые ошибки, «город не найден».
 */
export function normalizeApiError(error: unknown): string {
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
        return CITY_NOT_FOUND_MESSAGE;
      }
      return data.message;
    }
    if (err?.message) {
      const msg = (err.message as string).toLowerCase();
      if (msg.includes('network') || msg.includes('network error')) return NETWORK_ERROR_MESSAGE;
      if (msg.includes('city not found') || msg.includes('nothing to geocode')) return CITY_NOT_FOUND_MESSAGE;
      return err.message;
    }
  }
  return DEFAULT_MESSAGE;
}
