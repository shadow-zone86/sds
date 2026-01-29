<template>
  <p class="weather-empty-hint">
    {{ message }}
  </p>
</template>

<script setup lang="ts">
import { DEFAULT_MESSAGE } from '../config/constants';

interface IWeatherEmptyHintProps {
  message?: string;
}

withDefaults(defineProps<IWeatherEmptyHintProps>(), {
  message: () => DEFAULT_MESSAGE,
});
</script>

<style lang="scss" scoped>
.weather-empty-hint {
  margin: 0;
  color: $color-text-placeholder;
  @include font-size($font-size-xs);
}
</style>
