<template>
  <div class="weather-loading">
    <el-icon class="is-loading weather-loading__spinner">
      <component :is="LoadingIcon" />
    </el-icon>
    <span>Загрузка...</span>
  </div>
</template>

<script setup lang="ts">
import { Loading as LoadingIcon } from '@element-plus/icons-vue';
</script>

<style lang="scss" scoped>
.weather-loading {
  @include flex-col(center, center, $spacing-sm);
  color: $color-text-secondary;
}

.weather-loading__spinner {
  @include font-size($font-size-icon-md);
}
</style>
