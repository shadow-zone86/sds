import { describe, it, expect } from '@jest/globals';
import { mapWeatherApiToStoreDto } from './mapWeatherApiToStoreDto';
import type { ICurrentWeatherApiResponse } from '../../model/types';

const minimalApiResponse: ICurrentWeatherApiResponse = {
  coord: { lon: 37.62, lat: 55.75 },
  weather: [{ id: 600, main: 'Snow', description: 'снег', icon: '13n' }],
  base: 'stations',
  main: {
    temp: -10,
    feels_like: -15,
    temp_min: -11,
    temp_max: -9,
    pressure: 1009,
    humidity: 78,
  },
  dt: 1769695665,
  sys: { country: 'RU', sunrise: 1769664562, sunset: 1769694940 },
  timezone: 10800,
  id: 524901,
  name: 'Москва',
  cod: 200,
};

describe('mapWeatherApiToStoreDto', () => {
  it('returns null for null/undefined', () => {
    expect(mapWeatherApiToStoreDto(null)).toBeNull();
    expect(mapWeatherApiToStoreDto(undefined)).toBeNull();
  });

  it('maps coord lon/lat to longitude/latitude', () => {
    const result = mapWeatherApiToStoreDto(minimalApiResponse);
    expect(result?.coord).toEqual({ longitude: 37.62, latitude: 55.75 });
  });

  it('maps main snake_case to camelCase', () => {
    const result = mapWeatherApiToStoreDto(minimalApiResponse);
    expect(result?.main).toMatchObject({
      temp: -10,
      feelsLike: -15,
      tempMin: -11,
      tempMax: -9,
      pressure: 1009,
      humidity: 78,
    });
  });

  it('maps weather array', () => {
    const result = mapWeatherApiToStoreDto(minimalApiResponse);
    expect(result?.weather).toHaveLength(1);
    expect(result?.weather[0]).toEqual({
      id: 600,
      main: 'Snow',
      description: 'снег',
      icon: '13n',
    });
  });

  it('maps optional wind when present', () => {
    const withWind: ICurrentWeatherApiResponse = {
      ...minimalApiResponse,
      wind: { speed: 5, deg: 180, gust: 8 },
    };
    const result = mapWeatherApiToStoreDto(withWind);
    expect(result?.wind).toEqual({ speed: 5, deg: 180, gust: 8 });
  });

  it('leaves wind undefined when absent', () => {
    const result = mapWeatherApiToStoreDto(minimalApiResponse);
    expect(result?.wind).toBeUndefined();
  });

  it('preserves id, name, cod, dt, timezone, sys', () => {
    const result = mapWeatherApiToStoreDto(minimalApiResponse);
    expect(result?.id).toBe(524901);
    expect(result?.name).toBe('Москва');
    expect(result?.cod).toBe(200);
    expect(result?.dt).toBe(1769695665);
    expect(result?.timezone).toBe(10800);
    expect(result?.sys).toEqual({
      country: 'RU',
      sunrise: 1769664562,
      sunset: 1769694940,
    });
  });
});
