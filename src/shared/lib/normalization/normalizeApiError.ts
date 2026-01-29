const DEFAULT_MESSAGE = 'Ошибка запроса';

/**
 * Одна точка обработки ошибок API: извлекает сообщение из ответа/ошибки.
 * Используется в httpClient (interceptor) и в сервисах при ручных запросах (catch).
 */
export function normalizeApiError(error: unknown): string {
  if (error && typeof error === 'object') {
    const data = (error as { response?: { data?: { message?: string } } })
      ?.response?.data;
    if (data && typeof data.message === 'string') return data.message;
    if (error instanceof Error && error.message) return error.message;
  }
  return DEFAULT_MESSAGE;
}
