/**
 * PageLoader — лоадер первой загрузки страницы (FSD: shared/ui).
 * Публичный API слайса: компонент; composable и типы — из shared/lib/composables.
 */
export { default as PageLoader } from './ui/PageLoader.vue';
export {
  usePageLoader,
  type IPageLoaderConfig,
  type IUsePageLoaderOptions,
} from '@/shared/lib/composables/usePageLoader';
