const DEFAULT_MESSAGE = 'Ошибка запроса';

const NETWORK_ERROR_MESSAGE = 'Проверьте подключение к интернету';

/**
 * Одна точка обработки ошибок API: извлекает сообщение из ответа/ошибки.
 * Учитывает геолокацию, API, сетевые ошибки.
 */
export function normalizeApiError(error: unknown): string {
  if (error && typeof error === 'object') {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    const data = err?.response?.data;
    if (data && typeof data.message === 'string') return data.message;
    if (err?.message) {
      const msg = (err.message as string).toLowerCase();
      if (msg.includes('network') || msg.includes('network error')) return NETWORK_ERROR_MESSAGE;
      return err.message;
    }
  }
  return DEFAULT_MESSAGE;
}
