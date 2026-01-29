import { container } from '@shared/lib/di/container';
import { WEATHER_TOKENS } from '@entities/Weather/api/tokens';
import { createGetCurrentWeatherService } from '@entities/Weather/api/factories';

export function registerWeatherDependencies(): void {
  container.registerFactory(
    WEATHER_TOKENS.GetCurrentWeatherService,
    createGetCurrentWeatherService
  );
}
