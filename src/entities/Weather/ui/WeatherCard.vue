<template>
  <div class="weather-card">
    <div class="weather-card__header">
      <span class="weather-card__city">{{ weather.name }}</span>
      <span class="weather-card__country">{{ weather.sys.country }}</span>
    </div>
    <div class="weather-card__main">
      <img
        v-if="weather.iconUrl"
        :src="weather.iconUrl"
        :alt="weather.description"
        class="weather-card__icon"
      >
      <div class="weather-card__temp-block">
        <span class="weather-card__temp">{{ weather.tempRounded }}°</span>
        <span class="weather-card__feels">Ощущается {{ weather.feelsLikeRounded }}°</span>
      </div>
    </div>
    <p class="weather-card__description">
      {{ weather.description }}
    </p>
    <div class="weather-card__details">
      <div class="weather-card__detail">
        <el-icon><component :is="HumidityIcon" /></el-icon>
        <span>Влажность: {{ weather.main.humidity }}%</span>
      </div>
      <div class="weather-card__detail">
        <el-icon><component :is="WindIcon" /></el-icon>
        <span>Ветер: {{ weather.windSpeedText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Drizzling as HumidityIcon, WindPower as WindIcon } from '@element-plus/icons-vue';
import type { IWeatherStoreDto } from '../model/types.dto';

interface IWeatherCardProps {
  weather: IWeatherStoreDto;
}

defineProps<IWeatherCardProps>();
</script>

<style lang="scss" scoped>
.weather-card {
  padding: $spacing-xl;
  min-width: 280px;
  background: var(--el-fill-color-light);
  border-radius: var(--el-border-radius-base);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.weather-card__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: $spacing-md;
}

.weather-card__city {
  @include font-size($font-size-md);
  font-weight: 600;
  color: $color-text-primary;
}

.weather-card__country {
  @include font-size($font-size-xs);
  color: $color-text-secondary;
}

.weather-card__main {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-sm;
}

.weather-card__icon {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.weather-card__temp {
  @include font-size($font-size-xl);
  font-weight: 700;
  color: $color-text-primary;
}

.weather-card__temp-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.weather-card__feels {
  @include font-size($font-size-xs);
  color: $color-text-secondary;
}

.weather-card__description {
  margin: 0 0 $spacing-md;
  text-transform: capitalize;
  color: $color-text-regular;
}

.weather-card__details {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.weather-card__detail {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  @include font-size($font-size-xs);
  color: $color-text-regular;

  .el-icon {
    color: $color-text-secondary;
  }
}
</style>
