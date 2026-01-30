export interface IPageLoaderConfig {
  logoPath: string;
  logoAlt: string;
  durationMs: number;
  progressFrom: number;
  progressTo: number;
  hideDelayMs: number;
  fallbackTimeoutMs: number;
  logoMaxWidthPx: number;
  logoMaxHeightPx: number;
}

export interface IUsePageLoaderOptions {
  config?: Partial<IPageLoaderConfig>;
}
