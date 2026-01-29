<template>
  <div class="main-page">
    <h1 class="main-page__title">
      SDS
    </h1>
    <p class="main-page__subtitle">
      Vue 3 + TypeScript + FSD
    </p>
    <el-button type="primary">
      Element Plus
    </el-button>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.main-page {
  @include flex-col(center, center, $spacing-md);
  min-height: 100vh;
  @include padding-all($spacing-xl);

  &__title {
    margin: 0;
    color: $color-primary;
  }

  &__subtitle {
    margin: $spacing-xs 0 $spacing-md;
    color: $color-text-secondary;
  }
}
</style>
