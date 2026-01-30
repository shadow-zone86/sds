# SDS

Vue 3 (Composition API) + TypeScript + Webpack 5 + Axios + Element Plus + Pinia.
Архитектура: **FSD** (Feature-Sliced Design).

Приложение с виджетом погоды: поиск по городу и автоматическая подстановка по геолокации (OpenWeatherMap API).

## Стек

- **Vue 3** (Composition API)
- **TypeScript**
- **Webpack 5**
- **Axios**
- **Element Plus**
- **Pinia** (состояние)
- **Vue Router**
- **SCSS** (глобальные переменные, миксины flex / media / spacing, палитра)
- **Jest** (тесты)
- **ESLint** + **vue-tsc** (линт и проверка типов)
- **Husky** + **lint-staged** (pre-commit: линт, type-check, тесты, build)
- **webpack-bundle-analyzer** (анализ бандла)

## Реализованный функционал

- **Виджет погоды** (`widgets/weather`): заголовок, форма поиска по городу, состояния загрузки / ошибки / карточка погоды / пустое состояние.
- **Сущность Weather** (`entities/Weather`): API OpenWeatherMap (текущая погода по городу и по координатам), маппинг ответа в DTO, Pinia-сторе, UI-компоненты (карточка, лоадер, ошибка, подсказка). Сервис погоды получает HTTP-клиент и конфиг через конструктор (DI), константы (таймаут, иконки, единицы) — в `entities/Weather/config`.
- **Фича поиска города** (`features/search-city`): форма ввода города, нормализация запроса, вызов стора.
- **Инициализация по геолокации**: при монтировании виджета запрос геолокации и загрузка погоды по координатам (виджет `useInitWeatherByGeolocation`).
- **DI-контейнер** (`shared/lib/di`): регистрация фабрик/синглтонов, токены, `resolveRequired` / `resolveOr`. Провайдер погоды в app создаёт конфиг (`getOpenWeatherConfig`), HTTP-клиент через `createHttpClient`, сервис через фабрику и регистрирует синглтон в `main.ts`.
- **HTTP-клиент** (`shared/config/httpClient`): фабрика `createHttpClient(options)` — единый Axios-инстанс с заданным baseURL и перехватчиком ошибок (`apiErrorNormalization`); entity не импортирует axios напрямую.
- **Общие утилиты**: нормализация ошибок API, строк, геолокация (`getCurrentPosition`), конфиг OpenWeatherMap (`IOpenWeatherConfig`, `getOpenWeatherConfig`).

## FSD-структура

```
src/
├── app/          # Инициализация приложения, роутер, DI-провайдеры (weather)
├── pages/        # Страницы и роуты (main → WeatherWidget)
├── widgets/      # weather: виджет погоды + useInitWeatherByGeolocation
├── features/     # search-city: форма поиска по городу
├── entities/     # Weather: API, store, mappers, UI (карточка, лоадер, ошибка, пусто)
└── shared/       # API-конфиг, DI-контейнер, хелперы, нормализация, стили, тест-сетап
```

Алиасы: `@app`, `@pages`, `@widgets`, `@features`, `@entities`, `@shared`, `@`.

## Окружение

Скопируйте `.env.example` в `.env` и задайте ключ OpenWeatherMap:

```bash
cp .env.example .env
```

В `.env`:

- `OPENWEATHERMAP_API_KEY` — обязательный, ключ с [OpenWeatherMap](https://openweathermap.org/api).
- `OPENWEATHERMAP_BASE` — опционально, по умолчанию `https://api.openweathermap.org/data/2.5`.

## Стили (SCSS)

В каждом `.vue` и `.scss` автоматически доступны (без ручного `@use`):

- **Переменные**: `src/shared/styles/_variables.scss` — палитра (`$color-primary`, `$color-text-*`, …), спейсинги (`$spacing-md`, …), брейкпоинты (`$breakpoint-md`, …).
- **Миксины**:
  - **flex**: `@include flex()`, `@include flex-center()`, `@include flex-between()`, `@include flex-col()`, `@include flex-row()`, `@include flex-grow()`, `@include gap(md)`.
  - **media**: `@include media-min-md`, `@include media-max-lg`, `@include media($min, $max)`.
  - **spacing**: `@include margin-all()`, `@include padding-x()`, `@include spacing-padding(lg)`, `@include gap(sm)`.

## Скрипты

| Команда | Описание |
|--------|----------|
| `npm run dev` | Запуск dev-сервера (порт 3000) |
| `npm run build` | Production-сборка |
| `npm run build:analyze` | Сборка + открытие отчёта bundle analyzer |
| `npm run type-check` | Проверка типов (vue-tsc) |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint с автофиксом |
| `npm run test` | Jest |
| `npm run test:watch` | Jest в watch-режиме |
| `npm run test:coverage` | Jest с отчётом покрытия |

## Pre-commit

При `git commit` выполняются:

1. **lint-staged**: ESLint и vue-tsc для изменённых файлов
2. **type-check**: полная проверка типов
3. **test**: Jest
4. **build**: production-сборка

## Установка

```bash
npm install
cp .env.example .env
# Заполните OPENWEATHERMAP_API_KEY в .env
npm run dev
```

Открыть: http://localhost:3000
