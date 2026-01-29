<template>
  <div class="main-page">
    <h1 class="main-page__title">
      SDS
    </h1>
    <p class="main-page__subtitle">
      Vue 3 + TypeScript + FSD
    </p>
    <el-button
      type="primary"
      :loading="weatherStore.isLoading"
      @click="weatherStore.fetch({ cityQuery: 'Moscow' })"
    >
      Element Plus
    </el-button>
    <pre
      v-if="weatherText"
      class="main-page__weather"
    >{{ weatherText }}</pre>
    <p
      v-else-if="weatherStore.error"
      class="main-page__error"
    >
      {{ weatherStore.error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWeatherStore } from '@entities/Weather';

const weatherStore = useWeatherStore();

const weatherText = computed(() =>
  weatherStore.weather
    ? JSON.stringify(weatherStore.weather, null, 2)
    : ''
);
</script>

<style lang="scss" scoped>
.main-page {
  @include flex-col(center, center, $spacing-md);
  min-height: 100vh;
  @include padding-all($spacing-xl);

  &__title {
    margin: 0;
    color: $color-primary;
  }

  &__subtitle {
    margin: $spacing-xs 0 $spacing-md;
    color: $color-text-secondary;
  }

  &__weather {
    margin-top: $spacing-lg;
    padding: $spacing-md;
    max-width: 100%;
    overflow: auto;
    text-align: left;
    background: var(--el-fill-color-light);
    border-radius: var(--el-border-radius-base);
    font-size: 12px;
  }

  &__error {
    margin-top: $spacing-lg;
    color: var(--el-color-danger);
  }
}
</style>
