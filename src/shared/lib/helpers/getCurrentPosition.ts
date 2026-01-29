/**
 * Возвращает текущие координаты через Geolocation API.
 * @throws Error с сообщением на русском при отказе, недоступности или таймауте.
 */
export function getCurrentPosition(options?: PositionOptions): Promise<{
  latitude: number;
  longitude: number;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator?.geolocation) {
      reject(new Error('Геолокация не поддерживается браузером'));
      return;
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000,
      ...options,
    };

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error: GeolocationPositionError) => {
        const message =
          error.code === 1
            ? 'Доступ к местоположению запрещён. Введите город вручную.'
            : error.code === 2
              ? 'Не удалось определить местоположение. Введите город вручную.'
              : error.code === 3
                ? 'Превышено время ожидания геолокации. Введите город вручную.'
                : 'Ошибка геолокации. Введите город вручную.';
        reject(new Error(message));
      },
      defaultOptions
    );
  });
}
