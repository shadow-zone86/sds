import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import axios from 'axios';
import GetCurrentWeatherService from './getCurrentWeatherService';

jest.mock('axios');
jest.mock('@/shared/config/openWeatherConfig', () => ({
  getOpenWeatherBaseUrl: () => 'https://api.openweathermap.org/data/2.5',
  getOpenWeatherApiKey: () => 'test-key',
}));

const mockedAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;

describe('GetCurrentWeatherService', () => {
  let service: GetCurrentWeatherService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new GetCurrentWeatherService();
  });

  describe('get', () => {
    it('вызывает API с cityQuery при наличии cityQuery в params', async () => {
      const response = {
        data: {
          coord: { lon: 0, lat: 0 },
          weather: [],
          base: '',
          main: { temp: 0, feels_like: 0, temp_min: 0, temp_max: 0, pressure: 0, humidity: 0 },
          dt: 0,
          sys: { country: '', sunrise: 0, sunset: 0 },
          timezone: 0,
          id: 0,
          name: 'Moscow',
          cod: 200,
        },
      };
      mockedAxiosGet.mockResolvedValue(response);

      await service.get({ cityQuery: 'Moscow' });

      expect(mockedAxiosGet).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather',
        expect.objectContaining({
          params: expect.objectContaining({
            q: 'Moscow',
            appid: 'test-key',
            units: 'metric',
            lang: 'ru',
          }),
          timeout: 10000,
        })
      );
    });

    it('вызывает API с lat/lon при наличии latitude/longitude в params', async () => {
      const response = {
        data: {
          coord: { lon: 37.62, lat: 55.75 },
          weather: [],
          base: '',
          main: { temp: 0, feels_like: 0, temp_min: 0, temp_max: 0, pressure: 0, humidity: 0 },
          dt: 0,
          sys: { country: '', sunrise: 0, sunset: 0 },
          timezone: 0,
          id: 0,
          name: '',
          cod: 200,
        },
      };
      mockedAxiosGet.mockResolvedValue(response);

      await service.get({ latitude: 55.75, longitude: 37.62 });

      expect(mockedAxiosGet).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            lat: 55.75,
            lon: 37.62,
            appid: 'test-key',
          }),
        })
      );
    });

    it('возвращает данные ответа при успехе', async () => {
      const data = {
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
      mockedAxiosGet.mockResolvedValue({ data });

      const result = await service.get({ cityQuery: 'Moscow' });

      expect(result).toEqual(data);
    });

    it('бросает Error с нормализованным сообщением при ошибке API', async () => {
      mockedAxiosGet.mockRejectedValue({
        response: { data: { message: 'Invalid API key' } },
      });

      await expect(service.get({ cityQuery: 'Moscow' })).rejects.toThrow('Invalid API key');
    });
  });
});
