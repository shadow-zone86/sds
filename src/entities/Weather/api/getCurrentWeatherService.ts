import type { AxiosInstance } from 'axios';
import type { IOpenWeatherConfig } from '@/shared/config/openWeatherConfig';
import type {
  ICurrentWeatherApiResponse,
  IGetCurrentWeatherParams,
  ICurrentWeatherByCoordsParams,
  IGetCurrentWeatherService,
} from '../model/types';
import { REQUEST_TIMEOUT_MS } from '../config/constants';

export default class GetCurrentWeatherService implements IGetCurrentWeatherService {
  constructor(
    private readonly config: IOpenWeatherConfig,
    private readonly httpClient: AxiosInstance
  ) {}

  async get(params: IGetCurrentWeatherParams): Promise<ICurrentWeatherApiResponse> {
    const { units = 'metric', lang = 'ru' } = params;
    const requestParams: Record<string, string | number> = {
      units,
      lang,
      appid: this.config.apiKey,
    };

    if (this.isByCoords(params)) {
      requestParams.lat = params.latitude;
      requestParams.lon = params.longitude;
    } else {
      requestParams.q = params.cityQuery;
    }

    const { data } = await this.httpClient.get<ICurrentWeatherApiResponse>('/weather', {
      params: requestParams,
      timeout: REQUEST_TIMEOUT_MS,
    });
    return data;
  }

  private isByCoords(
    params: IGetCurrentWeatherParams
  ): params is ICurrentWeatherByCoordsParams {
    return 'latitude' in params && 'longitude' in params;
  }
}
