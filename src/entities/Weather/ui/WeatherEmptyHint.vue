<template>
  <p class="weather-empty-hint">
    Введите город или разрешите доступ к геолокации
  </p>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.weather-empty-hint {
  margin: 0;
  color: $color-text-placeholder;
  @include font-size($font-size-xs);
}
</style>
