import { createToken } from '@shared/lib/di/container';

export const WEATHER_TOKENS = {
  GetCurrentWeatherService: createToken('Weather.GetCurrentWeatherService'),
};
