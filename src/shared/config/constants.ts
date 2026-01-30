/** Сообщения для нормализации ошибок API (useApiErrorNormalization). */
export const API_ERROR_DEFAULT_MESSAGE = 'Ошибка запроса';
export const API_ERROR_NETWORK_MESSAGE = 'Проверьте подключение к интернету';
export const API_ERROR_CITY_NOT_FOUND_MESSAGE =
  'Город не найден. Проверьте название и попробуйте снова.';

// -----------------------------------------------------------------------------
// PageLoader (shared/ui/PageLoader)
// -----------------------------------------------------------------------------
export const PAGE_LOADER_LOGO_PATH = '/logo.webp';
export const PAGE_LOADER_LOGO_ALT = 'Загрузка';
/** Длительность анимации прогресса (0 → PROGRESS_TO %) в мс. */
export const PAGE_LOADER_DURATION_MS = 5000;
export const PAGE_LOADER_PROGRESS_FROM = 0;
export const PAGE_LOADER_PROGRESS_TO = 75;
/** Задержка перед скрытием после load (мс). */
export const PAGE_LOADER_HIDE_DELAY_MS = 600;
/** Максимальное время показа лоадера (fallback, мс). */
export const PAGE_LOADER_FALLBACK_TIMEOUT_MS = 5000;
/** Размеры лого в лоадере (для избежания layout shift). */
export const PAGE_LOADER_LOGO_MAX_WIDTH_PX = 187;
export const PAGE_LOADER_LOGO_MAX_HEIGHT_PX = 52;
