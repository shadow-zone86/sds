import { describe, it, expect, beforeEach } from '@jest/globals';
import { setActivePinia, createPinia } from 'pinia';
import { container } from '@shared/lib/di/container';
import { WEATHER_TOKENS } from '../../api/tokens';
import { useWeatherStore } from './weatherStore';
import type { IGetCurrentWeatherService, ICurrentWeatherApiResponse } from '../types';

const mockApiResponse: ICurrentWeatherApiResponse = {
  coord: { lon: 37.62, lat: 55.75 },
  weather: [{ id: 600, main: 'Snow', description: 'снег', icon: '13n' }],
  base: 'stations',
  main: { temp: -10, feels_like: -15, temp_min: -11, temp_max: -9, pressure: 1009, humidity: 78 },
  dt: 1769695665,
  sys: { country: 'RU', sunrise: 1769664562, sunset: 1769694940 },
  timezone: 10800,
  id: 524901,
  name: 'Москва',
  cod: 200,
};

describe('weatherStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    container.clear();

    const mockService: IGetCurrentWeatherService = {
      get: jest.fn(),
    };
    container.registerSingleton(WEATHER_TOKENS.GetCurrentWeatherService, mockService);
  });

  it('имеет начальное состояние', () => {
    const store = useWeatherStore();
    expect(store.weather).toBeNull();
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('fetch устанавливает погоду при успехе', async () => {
    const store = useWeatherStore();
    const mockGet = container.resolve<IGetCurrentWeatherService>(
      WEATHER_TOKENS.GetCurrentWeatherService
    )!.get as jest.MockedFunction<IGetCurrentWeatherService['get']>;
    mockGet.mockResolvedValue(mockApiResponse);

    await store.fetch({ cityQuery: 'Moscow' });

    expect(store.weather).not.toBeNull();
    expect(store.weather?.name).toBe('Москва');
    expect(store.weather?.main.temp).toBe(-10);
    expect(store.weather?.main.feelsLike).toBe(-15);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('fetch заполняет поля отображения из маппера (description, iconUrl, windSpeedText, humidityText, tempUnit, tempRounded, feelsLikeRounded)', async () => {
    const store = useWeatherStore();
    const mockGet = container.resolve<IGetCurrentWeatherService>(
      WEATHER_TOKENS.GetCurrentWeatherService
    )!.get as jest.MockedFunction<IGetCurrentWeatherService['get']>;
    mockGet.mockResolvedValue(mockApiResponse);

    await store.fetch({ cityQuery: 'Moscow' });

    expect(store.weather?.description).toBe('снег');
    expect(store.weather?.iconUrl).toBe('https://openweathermap.org/img/wn/13n@2x.png');
    expect(store.weather?.windSpeedText).toBe('—');
    expect(store.weather?.humidityText).toBe('78%');
    expect(store.weather?.tempUnit).toBe('°C');
    expect(store.weather?.tempRounded).toBe(-10);
    expect(store.weather?.feelsLikeRounded).toBe(-15);
  });

  it('fetch устанавливает error при ошибке', async () => {
    const store = useWeatherStore();
    const mockGet = container.resolve<IGetCurrentWeatherService>(
      WEATHER_TOKENS.GetCurrentWeatherService
    )!.get as jest.MockedFunction<IGetCurrentWeatherService['get']>;
    mockGet.mockRejectedValue(new Error('Network error'));

    await store.fetch({ cityQuery: 'Moscow' });

    expect(store.weather).toBeNull();
    expect(store.error).toBe('Network error');
    expect(store.isLoading).toBe(false);
  });

  it('clear сбрасывает weather и error', async () => {
    const store = useWeatherStore();
    const mockGet = container.resolve<IGetCurrentWeatherService>(
      WEATHER_TOKENS.GetCurrentWeatherService
    )!.get as jest.MockedFunction<IGetCurrentWeatherService['get']>;
    mockGet.mockResolvedValue(mockApiResponse);
    await store.fetch({ cityQuery: 'Moscow' });
    expect(store.weather).not.toBeNull();

    store.clear();

    expect(store.weather).toBeNull();
    expect(store.error).toBeNull();
  });

  it('fetch передаёт параметры в сервис', async () => {
    const store = useWeatherStore();
    const mockGet = container.resolve<IGetCurrentWeatherService>(
      WEATHER_TOKENS.GetCurrentWeatherService
    )!.get as jest.MockedFunction<IGetCurrentWeatherService['get']>;
    mockGet.mockResolvedValue(mockApiResponse);

    await store.fetch({ latitude: 55.75, longitude: 37.62 });

    expect(mockGet).toHaveBeenCalledWith({ latitude: 55.75, longitude: 37.62 });
  });
});
