import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from '@/app/App.vue';
import { router } from '@/app/router';
import { registerWeatherDependencies } from '@/app/providers/di/weather';
import '@/shared/styles/global.scss';

registerWeatherDependencies();

const app = createApp(App);
app.use(createPinia());
app.use(ElementPlus);
app.use(router);
app.mount('#app');
