import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { useInitWeatherByGeolocation } from './useInitWeatherByGeolocation';
import { useWeatherStore } from '@entities/Weather';
import { getCurrentPosition } from '@/shared/lib/helpers/getCurrentPosition';

jest.mock('@entities/Weather', () => ({
  useWeatherStore: jest.fn(),
}));

jest.mock('@/shared/lib/helpers/getCurrentPosition', () => ({
  getCurrentPosition: jest.fn(),
}));

const mockUseWeatherStore = useWeatherStore as jest.MockedFunction<typeof useWeatherStore>;
const mockGetCurrentPosition = getCurrentPosition as jest.MockedFunction<typeof getCurrentPosition>;

describe('useInitWeatherByGeolocation', () => {
  const mockFetch = jest.fn<() => Promise<void>>();
  const mockSetError = jest.fn<(message: string | null) => void>();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseWeatherStore.mockReturnValue({
      fetch: mockFetch,
      setError: mockSetError,
    } as unknown as ReturnType<typeof useWeatherStore>);
  });

  it('возвращает объект с методом init', () => {
    const { init } = useInitWeatherByGeolocation();
    expect(init).toBeDefined();
    expect(typeof init).toBe('function');
  });

  it('init вызывает getCurrentPosition и store.fetch с координатами при успехе', async () => {
    mockGetCurrentPosition.mockResolvedValue({ latitude: 55.75, longitude: 37.62 });
    mockFetch.mockResolvedValue(undefined);

    const { init } = useInitWeatherByGeolocation();
    await init();

    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith({ latitude: 55.75, longitude: 37.62 });
    expect(mockSetError).not.toHaveBeenCalled();
  });

  it('init вызывает store.setError с сообщением из Error при ошибке геолокации', async () => {
    mockGetCurrentPosition.mockRejectedValue(new Error('Доступ к местоположению запрещён.'));

    const { init } = useInitWeatherByGeolocation();
    await init();

    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1);
    expect(mockFetch).not.toHaveBeenCalled();
    expect(mockSetError).toHaveBeenCalledTimes(1);
    expect(mockSetError).toHaveBeenCalledWith('Доступ к местоположению запрещён.');
  });

  it('init вызывает store.setError с "Ошибка геолокации" при не-Error (например, строка)', async () => {
    mockGetCurrentPosition.mockRejectedValue('unknown');

    const { init } = useInitWeatherByGeolocation();
    await init();

    expect(mockSetError).toHaveBeenCalledWith('Ошибка геолокации');
  });
});
