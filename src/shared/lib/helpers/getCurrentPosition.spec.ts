import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { getCurrentPosition } from './getCurrentPosition';

const mockSuccess = (lat: number, lon: number): void => {
  (navigator.geolocation.getCurrentPosition as jest.Mock).mockImplementation(
    (onSuccess: PositionCallback) => {
      const position: GeolocationPosition = {
        coords: {
          latitude: lat,
          longitude: lon,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
          toJSON: (): object => ({}),
        },
        timestamp: Date.now(),
        toJSON: (): object => ({}),
      };
      onSuccess(position);
    }
  );
};

const mockError = (code: number): void => {
  (navigator.geolocation.getCurrentPosition as jest.Mock).mockImplementation(
    (_: PositionCallback, onError: PositionErrorCallback) => {
      const error = {
        code,
        message: `Geolocation error ${code}`,
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      } as GeolocationPositionError;
      onError(error);
    }
  );
};

describe('getCurrentPosition', () => {
  const originalGeolocation = navigator.geolocation;

  beforeEach(() => {
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: jest.fn(),
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'geolocation', {
      value: originalGeolocation,
      writable: true,
      configurable: true,
    });
  });

  it('resolves with latitude and longitude on success', async () => {
    mockSuccess(55.75, 37.62);

    const result = await getCurrentPosition();

    expect(result).toEqual({ latitude: 55.75, longitude: 37.62 });
    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      expect.objectContaining({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      })
    );
  });

  it('merges custom options with defaults', async () => {
    mockSuccess(0, 0);

    await getCurrentPosition({ timeout: 5000, maximumAge: 0 });

    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      expect.objectContaining({
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      })
    );
  });

  it('rejects with message when geolocation is not supported', async () => {
    Object.defineProperty(navigator, 'geolocation', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    await expect(getCurrentPosition()).rejects.toThrow(
      'Геолокация не поддерживается браузером'
    );
  });

  it('rejects with message on PERMISSION_DENIED (code 1)', async () => {
    mockError(1);

    await expect(getCurrentPosition()).rejects.toThrow(
      'Доступ к местоположению запрещён. Введите город вручную.'
    );
  });

  it('rejects with message on POSITION_UNAVAILABLE (code 2)', async () => {
    mockError(2);

    await expect(getCurrentPosition()).rejects.toThrow(
      'Не удалось определить местоположение. Введите город вручную.'
    );
  });

  it('rejects with message on TIMEOUT (code 3)', async () => {
    mockError(3);

    await expect(getCurrentPosition()).rejects.toThrow(
      'Превышено время ожидания геолокации. Введите город вручную.'
    );
  });

  it('rejects with generic message for unknown error code', async () => {
    mockError(0);

    await expect(getCurrentPosition()).rejects.toThrow(
      'Ошибка геолокации. Введите город вручную.'
    );
  });
});
