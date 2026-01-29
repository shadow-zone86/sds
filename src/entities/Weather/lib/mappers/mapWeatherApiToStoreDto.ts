// ============================================================================
// Маппер: ответ API → Store DTO (типы API из model/types, DTO из model/dto)
// ============================================================================

import type { ICurrentWeatherApiResponse, IWeatherConditionApi } from '../../model/types';
import type { IWeatherStoreDto } from '../../model/types.dto';
import { OPENWEATHER_ICON_BASE, TEMP_UNIT } from '../../config/constants';

export function mapWeatherApiToStoreDto(
  api: ICurrentWeatherApiResponse | null | undefined
): IWeatherStoreDto | null {
  if (!api) return null;

  const weatherList = Array.isArray(api.weather) ? api.weather : [];
  const description = weatherList[0]?.description ?? '';
  const icon = weatherList[0]?.icon ?? '';
  const iconUrl = icon ? `${OPENWEATHER_ICON_BASE}/${icon}@2x.png` : '';
  const windSpeedText =
    api.wind?.speed != null ? `${api.wind.speed} м/с` : '—';
  const humidityText =
    api.main.humidity != null ? `${api.main.humidity}%` : '—';

  return {
    coord: {
      longitude: api.coord.lon,
      latitude: api.coord.lat,
    },
    weather: weatherList.map((weatherCondition: IWeatherConditionApi) => ({
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
    description,
    iconUrl,
    windSpeedText,
    humidityText,
    tempUnit: TEMP_UNIT,
    tempRounded: Math.round(api.main.temp),
    feelsLikeRounded: Math.round(api.main.feels_like),
  };
}
