// ============================================================================
// Store DTO — модель для приложения (маппим только для store)
// ============================================================================

export interface IWeatherStoreDto {
  coord: { longitude: number; latitude: number };
  weather: Array<{ id: number; main: string; description: string; icon: string }>;
  main: {
    temp: number;
    feelsLike: number;
    tempMin: number;
    tempMax: number;
    pressure: number;
    humidity: number;
    seaLevel?: number;
    grndLevel?: number;
  };
  visibility?: number;
  wind?: { speed: number; deg: number; gust?: number };
  snow?: { '1h'?: number; '3h'?: number };
  rain?: { '1h'?: number; '3h'?: number };
  clouds?: { all: number };
  dt: number;
  sys: { country: string; sunrise: number; sunset: number };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}
