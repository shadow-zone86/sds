<template>
  <div class="app">
    <PageLoader />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { PageLoader } from '@/shared/ui/PageLoader';
</script>

<style lang="scss" scoped>
.app {
  min-height: 100vh;
}
</style>
