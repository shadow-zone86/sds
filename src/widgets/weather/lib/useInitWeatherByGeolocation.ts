import { useWeatherStore } from '@entities/Weather';
import { getCurrentPosition } from '@/shared/lib/helpers/getCurrentPosition';

export function useInitWeatherByGeolocation(): {
  init: () => Promise<void>;
} {
  const weatherStore = useWeatherStore();

  async function runInit(): Promise<void> {
    try {
      const { latitude, longitude } = await getCurrentPosition();
      await weatherStore.fetch({ latitude, longitude });
    } catch (e) {
      weatherStore.setError(
        e instanceof Error ? e.message : 'Ошибка геолокации'
      );
    }
  }

  return { init: runInit };
}
