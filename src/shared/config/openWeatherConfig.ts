const DEFAULT_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export function getOpenWeatherBaseUrl(): string {
  return process.env.OPENWEATHERMAP_BASE ?? DEFAULT_BASE_URL;
}

export function getOpenWeatherApiKey(): string {
  return process.env.OPENWEATHERMAP_API_KEY ?? '';
}
