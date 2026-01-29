import type { AxiosInstance } from 'axios';
import type { IOpenWeatherConfig } from '@/shared/config/openWeatherConfig';
import GetCurrentWeatherService from './getCurrentWeatherService';
import type { IGetCurrentWeatherService } from '../model/types';

export function createGetCurrentWeatherService(
  config: IOpenWeatherConfig,
  httpClient: AxiosInstance
): IGetCurrentWeatherService {
  return new GetCurrentWeatherService(config, httpClient);
}
