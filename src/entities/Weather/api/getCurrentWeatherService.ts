import axios from 'axios';
import { normalizeApiError } from '@/shared/lib/normalization/normalizeApiError';
import {
  getOpenWeatherBaseUrl,
  getOpenWeatherApiKey,
} from '@/shared/config/openWeatherConfig';
import type {
  ICurrentWeatherApiResponse,
  IGetCurrentWeatherParams,
  ICurrentWeatherByCoordsParams,
  IGetCurrentWeatherService,
} from '../model/types';

export default class GetCurrentWeatherService implements IGetCurrentWeatherService {
  async get(params: IGetCurrentWeatherParams): Promise<ICurrentWeatherApiResponse> {
    const { units = 'metric', lang = 'ru' } = params;
    const requestParams: Record<string, string | number> = {
      units,
      lang,
      appid: getOpenWeatherApiKey(),
    };

    if (this.isByCoords(params)) {
      requestParams.lat = params.latitude;
      requestParams.lon = params.longitude;
    } else {
      requestParams.q = params.cityQuery;
    }

    try {
      const { data } = await axios.get<ICurrentWeatherApiResponse>(
        `${getOpenWeatherBaseUrl()}/weather`,
        { params: requestParams, timeout: 10000 }
      );
      return data;
    } catch (error: unknown) {
      throw new Error(normalizeApiError(error));
    }
  }

  private isByCoords(
    params: IGetCurrentWeatherParams
  ): params is ICurrentWeatherByCoordsParams {
    return 'latitude' in params && 'longitude' in params;
  }
}
