import type { RouteRecordRaw } from 'vue-router';
import MainPage from './ui/MainPage.vue';

export const mainRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'main',
    component: MainPage,
    meta: { title: 'Main' },
  },
];
