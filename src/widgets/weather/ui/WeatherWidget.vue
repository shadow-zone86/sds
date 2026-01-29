<template>
  <div class="weather-widget">
    <h1 class="weather-widget__title">
      {{ title }}
    </h1>

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
  @include flex-col(center, center, $spacing-md);
  min-height: 100vh;
  @include padding-all($spacing-md);

  @include media-min-sm {
    @include padding-all($spacing-xl);
  }

  &__title {
    margin: 0;
    color: $color-primary;
    @include font-size($font-size-md);

    @include media-min-sm {
      @include font-size($font-size-lg);
    }
  }

  &__search {
    margin-top: $spacing-md;
  }

  &__state {
    margin-top: $spacing-xl;
  }
}
</style>
