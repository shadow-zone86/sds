const DEFAULT_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export function getOpenWeatherBaseUrl(): string {
  return process.env.OPENWEATHERMAP_BASE ?? DEFAULT_BASE_URL;
}

export function getOpenWeatherApiKey(): string {
  const key = process.env.OPENWEATHERMAP_API_KEY;
  if (key === undefined || key === '') {
    throw new Error(
      'OPENWEATHERMAP_API_KEY is not set. Set it in .env locally or in Vercel Project → Settings → Environment Variables.'
    );
  }
  return key;
}
