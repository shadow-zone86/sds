<template>
  <div class="weather-widget">
    <div class="weather-widget__title">
      <h1 class="weather-widget__title-text">
        {{ title }}
      </h1>
      <img
        src="/logo.webp"
        alt="Логотип"
        class="weather-widget__logo"
      >
    </div>

    <SearchCityForm class="weather-widget__search" />

    <div
      class="weather-widget__state"
    >
      <WeatherLoading v-if="weatherStore.isLoading" />
      <WeatherError
        v-else-if="weatherStore.error"
        :message="weatherStore.error"
      />
      <WeatherCard
        v-else-if="weatherStore.weather"
        :weather="weatherStore.weather"
      />
      <WeatherEmptyHint v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { SearchCityForm } from '@features/search-city';
import { useInitWeatherByGeolocation } from '../lib/useInitWeatherByGeolocation';
import {
  useWeatherStore,
  WeatherCard,
  WeatherLoading,
  WeatherError,
  WeatherEmptyHint,
} from '@entities/Weather';

interface IWeatherWidgetProps {
  title?: string;
}

withDefaults(defineProps<IWeatherWidgetProps>(), { title: 'Погода' });

const weatherStore = useWeatherStore();

const { init: initWeatherByGeolocation } = useInitWeatherByGeolocation();

onMounted(() => {
  initWeatherByGeolocation();
});
</script>

<style lang="scss" scoped>
.weather-widget {
  --weather-block-max: 26.25rem; /* 420px при 16px базе, резиново через rem */

  @include flex-col(center, center, $spacing-md);
  min-height: 100vh;
  @include padding-all($spacing-md);

  @include media-min-sm {
    @include padding-all($spacing-xl);
  }

  &__title {
    @include flex-between(baseline);
    width: 100%;
    max-width: var(--weather-block-max);
  }

  &__title-text {
    margin: 0;
    color: $color-primary;
    @include font-size($font-size-md);

    @include media-min-sm {
      @include font-size($font-size-lg);
    }
  }

  &__logo {
    width: auto;
    height: auto;
    max-width: 8rem;
    max-height: 2.25rem;
    object-fit: contain;
  }

  &__search,
  &__state {
    width: 100%;
    max-width: var(--weather-block-max);
  }

  &__search {
    margin-top: $spacing-md;
  }

  &__state {
    margin-top: $spacing-xl;
  }
}
</style>
