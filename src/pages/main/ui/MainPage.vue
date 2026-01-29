<template>
  <div class="main-page">
    <WeatherWidget />
  </div>
</template>

<script setup lang="ts">
import { WeatherWidget } from '@widgets/weather';
</script>

<style lang="scss" scoped>
.main-page {
  min-height: 100vh;
}
</style>
