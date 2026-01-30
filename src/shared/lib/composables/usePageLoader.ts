import { ref, onMounted, onBeforeUnmount } from 'vue';
import {
  PAGE_LOADER_LOGO_PATH,
  PAGE_LOADER_LOGO_ALT,
  PAGE_LOADER_DURATION_MS,
  PAGE_LOADER_PROGRESS_FROM,
  PAGE_LOADER_PROGRESS_TO,
  PAGE_LOADER_HIDE_DELAY_MS,
  PAGE_LOADER_FALLBACK_TIMEOUT_MS,
  PAGE_LOADER_LOGO_MAX_WIDTH_PX,
  PAGE_LOADER_LOGO_MAX_HEIGHT_PX,
} from '@/shared/config/constants';
import { useStringNormalization } from '@/shared/lib/normalization/useStringNormalization';
import type { IPageLoaderConfig, IUsePageLoaderOptions } from '@/shared/model/types';

export type { IPageLoaderConfig, IUsePageLoaderOptions } from '@/shared/model/types';

const defaultConfig: IPageLoaderConfig = {
  logoPath: PAGE_LOADER_LOGO_PATH,
  logoAlt: PAGE_LOADER_LOGO_ALT,
  durationMs: PAGE_LOADER_DURATION_MS,
  progressFrom: PAGE_LOADER_PROGRESS_FROM,
  progressTo: PAGE_LOADER_PROGRESS_TO,
  hideDelayMs: PAGE_LOADER_HIDE_DELAY_MS,
  fallbackTimeoutMs: PAGE_LOADER_FALLBACK_TIMEOUT_MS,
  logoMaxWidthPx: PAGE_LOADER_LOGO_MAX_WIDTH_PX,
  logoMaxHeightPx: PAGE_LOADER_LOGO_MAX_HEIGHT_PX,
};

/**
 * Логика лоадера первой загрузки страницы.
 * Анимация прогресса 0 → progressTo за durationMs, скрытие по window.load или fallback.
 */
export function usePageLoader(options: IUsePageLoaderOptions = {}) {
  const config: IPageLoaderConfig = { ...defaultConfig, ...options.config };

  const isLoading = ref<boolean>(true);
  const progressWidth = ref<string>('0%');
  const progressRef = ref<HTMLDivElement | null>(null);

  let rafId: number = 0;
  let fallbackTimeoutId: number | null = null;
  let loadHandler: (() => void) | null = null;

  onMounted(() => {
    let startTime: number | null = null;
    let pageLoaded: boolean = false;

    const animate = (currentTime: number): void => {
      if (!startTime) startTime = currentTime;
      const elapsedMs: number = currentTime - startTime;
      const progressFactor: number = Math.min(elapsedMs / config.durationMs, 1);
      const width: number = Math.floor(
        progressFactor * (config.progressTo - config.progressFrom) + config.progressFrom
      );
      progressWidth.value = width + '%';

      if (pageLoaded) {
        progressWidth.value = '100%';
        return;
      }
      if (progressFactor < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);

    loadHandler = (): void => {
      pageLoaded = true;
      progressWidth.value = '100%';
      setTimeout(() => {
        isLoading.value = false;
      }, config.hideDelayMs);
    };

    const normalizeReadyState: string | undefined = useStringNormalization(document.readyState);

    if (normalizeReadyState === 'complete') {
      loadHandler();
    } else {
      window.addEventListener('load', loadHandler);
    }

    fallbackTimeoutId = window.setTimeout(() => {
      isLoading.value = false;
    }, config.fallbackTimeoutMs);
  });

  onBeforeUnmount(() => {
    if (rafId) cancelAnimationFrame(rafId);
    if (loadHandler) window.removeEventListener('load', loadHandler);
    if (fallbackTimeoutId !== null) window.clearTimeout(fallbackTimeoutId);
  });

  return {
    isLoading,
    progressWidth,
    progressRef,
    config,
  };
}
