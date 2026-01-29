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
import { ElMessage } from 'element-plus';
import { useWeatherStore } from '@entities/Weather';
import { getCityQueryFromInput } from '../lib/getCityQueryFromInput';

const weatherStore = useWeatherStore();

const cityQuery = ref<string>('');

function submit(): void {
  const query = getCityQueryFromInput(cityQuery.value);
  if (query !== null) {
    weatherStore.fetch({ cityQuery: query });
  } else {
    ElMessage.info('Введите название города');
  }
}
</script>

<style lang="scss" scoped>
.search-city-form {
  @include flex-col(stretch, flex-start, $spacing-sm);
  width: 100%;
  max-width: 360px;

  @include media-min-sm {
    @include flex-row(center, flex-start, $spacing-sm);
  }
}

.search-city-form__input {
  flex: 1;
}
</style>
