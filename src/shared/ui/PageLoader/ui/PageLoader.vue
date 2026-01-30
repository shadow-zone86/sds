<template>
  <Transition name="page-loader-fade">
    <div
      v-if="isLoading"
      id="page-loader"
      class="page-loader"
      role="status"
      aria-live="polite"
      :aria-label="config.logoAlt"
    >
      <div class="page-loader__logo-wrap">
        <img
          :src="config.logoPath"
          :alt="config.logoAlt"
          class="page-loader__logo-bg"
          :style="logoStyle"
        >
        <div
          ref="progressRef"
          class="page-loader__progress"
          :style="{ width: progressWidth }"
        >
          <img
            :src="config.logoPath"
            :alt="config.logoAlt"
            class="page-loader__logo-fg"
            :style="logoFgStyle"
          >
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePageLoader, type IPageLoaderConfig } from '@/shared/lib/composables/usePageLoader';

interface IPageLoaderProps {
  config?: Partial<IPageLoaderConfig>;
}

const props = withDefaults(defineProps<IPageLoaderProps>(), { config: () => ({}) });

const { isLoading, progressWidth, config } = usePageLoader({
  config: props.config,
});

const logoStyle = computed(() => ({
  maxWidth: `${config.logoMaxWidthPx}px`,
  maxHeight: `${config.logoMaxHeightPx}px`,
}));

const logoFgStyle = computed(() => ({
  maxHeight: `${config.logoMaxHeightPx}px`,
}));
</script>

<style lang="scss" scoped>
.page-loader {
  position: fixed;
  inset: 0;
  z-index: 100000;
  @include flex-col(center, center);
  background-color: $color-bg;
  opacity: 1;
  transition: opacity 800ms ease-in-out;
  transition-delay: 800ms;
}

.page-loader__logo-wrap {
  position: relative;
}

.page-loader__logo-bg {
  opacity: 0.2;
  filter: grayscale(100%);
  width: auto;
  height: auto;
  display: block;
}

.page-loader__progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  overflow: hidden;
  transition: width 600ms ease-in-out;
}

.page-loader__logo-fg {
  max-width: none;
  vertical-align: middle;
  width: auto;
  height: auto;
}

.page-loader-fade-enter-active,
.page-loader-fade-leave-active {
  transition: opacity 800ms ease-in-out;
}

.page-loader-fade-leave-to {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
}
</style>
