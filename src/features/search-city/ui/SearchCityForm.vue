<template>
  <div class="search-city-form">
    <el-input
      v-model="cityQuery"
      placeholder="Введите город"
      clearable
      :disabled="weatherStore.isLoading"
      class="search-city-form__input"
      @keyup.enter="submit"
    />
    <el-button
      type="primary"
      :loading="weatherStore.isLoading"
      @click="submit"
    >
      Найти
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWeatherStore } from '@entities/Weather';
import { getCityQueryFromInput } from '../lib/getCityQueryFromInput';

const weatherStore = useWeatherStore();

const cityQuery = ref<string>('');

function submit(): void {
  const query = getCityQueryFromInput(cityQuery.value);
  if (query !== null) {
    weatherStore.fetch({ cityQuery: query });
  }
}
</script>

<style lang="scss" scoped>
.search-city-form {
  display: flex;
  gap: $spacing-sm;
  align-items: center;
  max-width: 360px;
  width: 100%;
}

.search-city-form__input {
  flex: 1;
}
</style>
