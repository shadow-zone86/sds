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
        <span class="weather-card__temp">{{ `${weather.tempRounded} ${weather.tempUnit}` }}</span>
        <span class="weather-card__feels">{{ `Ощущается ${weather.feelsLikeRounded} ${weather.tempUnit}` }}</span>
      </div>
    </div>
    <p class="weather-card__description">
      {{ weather.description }}
    </p>
    <div class="weather-card__details">
      <div class="weather-card__detail">
        <el-icon><component :is="HumidityIcon" /></el-icon>
        <span>{{ `Влажность: ${weather.humidityText}` }}</span>
      </div>
      <div class="weather-card__detail">
        <el-icon><component :is="WindIcon" /></el-icon>
        <span>{{ `Ветер: ${weather.windSpeedText}` }}</span>
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
  padding: $spacing-md;
  min-width: 0;
  width: 100%;
  max-width: 420px;
  background: var(--el-fill-color-light);
  border-radius: var(--el-border-radius-base);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

  @include media-min-sm {
    padding: $spacing-xl;
    min-width: 280px;
  }
}

.weather-card__header {
  @include flex-between(baseline);
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
  @include flex-row(center, flex-start, $spacing-md);
  margin-bottom: $spacing-sm;
}

.weather-card__icon {
  width: 48px;
  height: 48px;
  object-fit: contain;

  @include media-min-sm {
    width: 64px;
    height: 64px;
  }
}

.weather-card__temp {
  @include font-size($font-size-xl);
  font-weight: 700;
  color: $color-text-primary;
}

.weather-card__temp-block {
  @include flex-col(stretch, flex-start, 2px);
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
  @include flex-col(stretch, flex-start, $spacing-xs);
}

.weather-card__detail {
  @include flex-row(center, flex-start, $spacing-xs);
  @include font-size($font-size-xs);
  color: $color-text-regular;

  .el-icon {
    color: $color-text-secondary;
  }
}
</style>
