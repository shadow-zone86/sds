import { container } from '@shared/lib/di/container';
import { createHttpClient } from '@shared/config/httpClient';
import { getOpenWeatherConfig } from '@shared/config/openWeatherConfig';
import { WEATHER_TOKENS } from '@entities/Weather/api/tokens';
import { createGetCurrentWeatherService } from '@entities/Weather/api/factories';

export function registerWeatherDependencies(): void {
  const config = getOpenWeatherConfig();
  const httpClient = createHttpClient({
    baseURL: config.baseUrl,
    timeout: 10000,
  });
  const service = createGetCurrentWeatherService(config, httpClient);
  container.registerSingleton(WEATHER_TOKENS.GetCurrentWeatherService, service);
}
