import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { mainRoutes } from '@pages/main/routes';

const routes: RouteRecordRaw[] = [
  ...mainRoutes,
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
