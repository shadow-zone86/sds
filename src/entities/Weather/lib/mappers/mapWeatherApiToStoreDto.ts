// ============================================================================
// Маппер: ответ API → Store DTO (типы API из model/types, DTO из model/dto)
// ============================================================================

import type { ICurrentWeatherApiResponse, IWeatherConditionApi } from '../../model/types';
import type { IWeatherStoreDto } from '../../model/types.dto';

export function mapWeatherApiToStoreDto(
  api: ICurrentWeatherApiResponse | null | undefined
): IWeatherStoreDto | null {
  if (!api) return null;

  return {
    coord: {
      longitude: api.coord.lon,
      latitude: api.coord.lat,
    },
    weather: api.weather.map((weatherCondition: IWeatherConditionApi) => ({
      id: weatherCondition.id,
      main: weatherCondition.main,
      description: weatherCondition.description,
      icon: weatherCondition.icon,
    })),
    main: {
      temp: api.main.temp,
      feelsLike: api.main.feels_like,
      tempMin: api.main.temp_min,
      tempMax: api.main.temp_max,
      pressure: api.main.pressure,
      humidity: api.main.humidity,
      seaLevel: api.main.sea_level,
      grndLevel: api.main.grnd_level,
    },
    visibility: api.visibility,
    wind: api.wind
      ? {
          speed: api.wind.speed,
          deg: api.wind.deg,
          gust: api.wind.gust,
        }
      : undefined,
    snow: api.snow,
    rain: api.rain,
    clouds: api.clouds,
    dt: api.dt,
    sys: {
      country: api.sys.country,
      sunrise: api.sys.sunrise,
      sunset: api.sys.sunset,
    },
    timezone: api.timezone,
    id: api.id,
    name: api.name,
    cod: api.cod,
  };
}
