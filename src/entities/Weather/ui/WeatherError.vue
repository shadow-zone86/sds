<template>
  <div class="weather-error">
    <el-icon class="weather-error__icon">
      <component :is="WarningIcon" />
    </el-icon>
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { Warning as WarningIcon } from '@element-plus/icons-vue';

interface IWeatherErrorProps {
  message: string;
}

defineProps<IWeatherErrorProps>();
</script>

<style lang="scss" scoped>
.weather-error {
  padding: $spacing-md;
  text-align: center;
  color: var(--el-color-danger);
  background: var(--el-color-danger-light-9);
  border-radius: var(--el-border-radius-base);
  width: 100%;
  max-width: 420px;
  box-sizing: border-box;
}

.weather-error__icon {
  @include font-size($font-size-icon-sm);
  margin-bottom: $spacing-xs;
}
</style>
