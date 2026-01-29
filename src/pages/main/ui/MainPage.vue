<template>
  <div class="main-page">
    <h1 class="main-page__title">
      Погода
    </h1>

    <div class="main-page__search">
      <el-input
        v-model="cityQuery"
        placeholder="Введите город"
        clearable
        :disabled="weatherStore.isLoading"
        class="main-page__input"
        @keyup.enter="searchByCity"
      />
      <el-button
        type="primary"
        :loading="weatherStore.isLoading"
        @click="searchByCity"
      >
        Найти
      </el-button>
    </div>

    <div
      v-if="weatherStore.isLoading"
      class="main-page__loading"
    >
      <el-icon class="is-loading main-page__spinner">
        <component :is="LoadingIcon" />
      </el-icon>
      <span>Загрузка...</span>
    </div>

    <div
      v-else-if="weatherStore.error"
      class="main-page__error"
    >
      <el-icon class="main-page__error-icon">
        <component :is="WarningIcon" />
      </el-icon>
      <p>{{ weatherStore.error }}</p>
    </div>

    <div
      v-else-if="weatherStore.weather"
      class="main-page__card"
    >
      <div class="main-page__card-header">
        <span class="main-page__city">{{ weatherStore.weather?.name }}</span>
        <span class="main-page__country">{{ weatherStore.weather?.sys.country }}</span>
      </div>
      <div class="main-page__card-main">
        <img
          v-if="weatherStore.weather?.iconUrl"
          :src="weatherStore.weather?.iconUrl"
          :alt="weatherStore.weather?.description"
          class="main-page__icon"
        >
        <div class="main-page__temp-block">
          <span class="main-page__temp">{{ weatherStore.weather?.tempRounded }}°</span>
          <span class="main-page__feels">Ощущается {{ weatherStore.weather?.feelsLikeRounded }}°</span>
        </div>
      </div>
      <p class="main-page__description">
        {{ weatherStore.weather?.description }}
      </p>
      <div class="main-page__details">
        <div class="main-page__detail">
          <el-icon><component :is="HumidityIcon" /></el-icon>
          <span>Влажность: {{ weatherStore.weather?.main.humidity }}%</span>
        </div>
        <div class="main-page__detail">
          <el-icon><component :is="WindIcon" /></el-icon>
          <span>Ветер: {{ weatherStore.weather?.windSpeedText }}</span>
        </div>
      </div>
    </div>

    <p
      v-else
      class="main-page__hint"
    >
      Введите город или разрешите доступ к геолокации
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  Loading as LoadingIcon,
  Warning as WarningIcon,
  Drizzling as HumidityIcon,
  WindPower as WindIcon,
} from '@element-plus/icons-vue';
import { useWeatherStore } from '@entities/Weather';
import { getCurrentPosition } from '@/shared/lib/helpers/getCurrentPosition';

const weatherStore = useWeatherStore();

const cityQuery = ref<string>('');

function searchByCity(): void {
  const query = cityQuery.value?.trim();
  if (!query) return;
  weatherStore.fetch({ cityQuery: query });
}

async function initByGeolocation(): Promise<void> {
  try {
    const { latitude, longitude } = await getCurrentPosition();
    await weatherStore.fetch({ latitude, longitude });
  } catch (e) {
    weatherStore.setError(e instanceof Error ? e.message : 'Ошибка геолокации');
  }
}

onMounted(() => {
  initByGeolocation();
});
</script>

<style lang="scss" scoped>
.main-page {
  @include flex-col(center, center, $spacing-md);
  min-height: 100vh;
  @include padding-all($spacing-xl);

  &__title {
    margin: 0;
    color: $color-primary;
    font-size: 1.75rem;
  }

  &__search {
    display: flex;
    gap: $spacing-sm;
    align-items: center;
    margin-top: $spacing-md;
    max-width: 360px;
    width: 100%;
  }

  &__input {
    flex: 1;
  }

  &__loading {
    @include flex-col(center, center, $spacing-sm);
    margin-top: $spacing-xl;
    color: $color-text-secondary;
  }

  &__spinner {
    font-size: 32px;
  }

  &__error {
    margin-top: $spacing-xl;
    padding: $spacing-md;
    text-align: center;
    color: var(--el-color-danger);
    background: var(--el-color-danger-light-9);
    border-radius: var(--el-border-radius-base);
  }

  &__error-icon {
    font-size: 24px;
    margin-bottom: $spacing-xs;
  }

  &__card {
    margin-top: $spacing-xl;
    padding: $spacing-xl;
    min-width: 280px;
    background: var(--el-fill-color-light);
    border-radius: var(--el-border-radius-base);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }

  &__card-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: $spacing-md;
  }

  &__city {
    font-size: 1.25rem;
    font-weight: 600;
    color: $color-text-primary;
  }

  &__country {
    font-size: 0.875rem;
    color: $color-text-secondary;
  }

  &__card-main {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    margin-bottom: $spacing-sm;
  }

  &__icon {
    width: 64px;
    height: 64px;
    object-fit: contain;
  }

  &__temp {
    font-size: 2.5rem;
    font-weight: 700;
    color: $color-text-primary;
  }

  &__temp-block {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__feels {
    font-size: 0.875rem;
    color: $color-text-secondary;
  }

  &__description {
    margin: 0 0 $spacing-md;
    text-transform: capitalize;
    color: $color-text-regular;
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__detail {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    font-size: 0.875rem;
    color: $color-text-regular;

    .el-icon {
      color: $color-text-secondary;
    }
  }

  &__hint {
    margin-top: $spacing-xl;
    color: $color-text-placeholder;
    font-size: 0.875rem;
  }
}
</style>
