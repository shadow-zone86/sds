export interface IWeatherConditionApi {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface ICurrentWeatherApiResponse {
  coord: { lon: number; lat: number };
  weather: IWeatherConditionApi[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility?: number;
  wind?: { speed: number; deg: number; gust?: number };
  snow?: { '1h'?: number; '3h'?: number };
  rain?: { '1h'?: number; '3h'?: number };
  clouds?: { all: number };
  dt: number;
  sys: { type?: number; id?: number; country: string; sunrise: number; sunset: number };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ICurrentWeatherByCoordsParams {
  latitude: number;
  longitude: number;
  units?: 'standard' | 'metric' | 'imperial';
  lang?: string;
}

export interface ICurrentWeatherByQueryParams {
  cityQuery: string;
  units?: 'standard' | 'metric' | 'imperial';
  lang?: string;
}

export type IGetCurrentWeatherParams =
  | ICurrentWeatherByCoordsParams
  | ICurrentWeatherByQueryParams;

export interface IGetCurrentWeatherService {
  get(params: IGetCurrentWeatherParams): Promise<ICurrentWeatherApiResponse>;
}
