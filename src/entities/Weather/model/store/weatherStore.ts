import { defineStore } from 'pinia';
import { ref } from 'vue';
import { WEATHER_TOKENS } from '../../api/tokens';
import { resolveRequired } from '@shared/lib/di/container';
import type { IGetCurrentWeatherParams } from '../types';
import type { IWeatherStoreDto } from '../types.dto';
import type { IGetCurrentWeatherService } from '../types';
import { mapWeatherApiToStoreDto } from '../../lib/mappers';

function getWeatherService(): IGetCurrentWeatherService {
  return resolveRequired<IGetCurrentWeatherService>(
    WEATHER_TOKENS.GetCurrentWeatherService
  );
}

export const useWeatherStore = defineStore('weatherStore', () => {
  const weather = ref<IWeatherStoreDto | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const setWeather = (payload: IWeatherStoreDto | null): void => {
    weather.value = payload;
  };

  const setError = (message: string | null): void => {
    error.value = message;
  };

  const fetch = async (params: IGetCurrentWeatherParams): Promise<void> => {
    isLoading.value = true;
    setError(null);
    try {
      const apiResponse = await getWeatherService().get(params);
      const mapped = mapWeatherApiToStoreDto(apiResponse);
      setWeather(mapped);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки погоды');
      setWeather(null);
    } finally {
      isLoading.value = false;
    }
  };

  const clear = (): void => {
    setWeather(null);
    setError(null);
  };

  return {
    weather,
    isLoading,
    error,
    fetch,
    clear,
  };
});
