# SDS

> 📚 **Документация проекта** — Vue 3 проект с архитектурой Feature-Sliced Design

Vue 3 (Composition API) + TypeScript + Webpack 5 + Axios + Element Plus + Pinia.
Архитектура: **FSD** (Feature-Sliced Design).

Приложение с виджетом погоды: поиск по городу и автоматическая подстановка по геолокации (OpenWeatherMap API).

---

## 📖 Оглавление документации

Документация организована как **книга с главами** для удобного последовательного чтения:

### Часть I: Начало работы

- **[Глава 1: Быстрый старт](./docs/01-quick-start.md)** 🚀  
  Установка, запуск, конфигурация проекта

### Часть II: Архитектура

- **[Глава 2: Архитектурные решения](./docs/02-architecture.md)** 🏗️  
  Обзор архитектуры, SOLID, паттерны проектирования

- **[Глава 3: FSD Принципы](./docs/03-fsd-principles.md)** 🎯  
  Feature-Sliced Design: слои, правила зависимостей

- **[Глава 4: DI и Паттерны](./docs/04-di-and-patterns.md)** 🧩  
  Dependency Injection, HTTP-клиент, конфиг, мапперы

---

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
- **Husky** + **lint-staged** (pre-commit: lint-staged + полный lint, type-check, тесты, build)
- **webpack-bundle-analyzer** (анализ бандла)

## Реализованный функционал

- **Виджет погоды** (`widgets/weather`): заголовок, форма поиска по городу, состояния загрузки / ошибки / карточка погоды / пустое состояние; единая ширина блоков через `--weather-block-max` (26.25rem).
- **Сущность Weather** (`entities/Weather`): API OpenWeatherMap (текущая погода по городу и по координатам), маппинг ответа в DTO, Pinia-сторе, UI-компоненты (карточка, лоадер, ошибка, подсказка). Сервис погоды получает HTTP-клиент и конфиг через конструктор (DI), константы (таймаут, иконки, единицы) — в `entities/Weather/config`.
- **Фича поиска города** (`features/search-city`): форма ввода города, нормализация запроса, вызов стора.
- **Инициализация по геолокации**: при монтировании виджета запрос геолокации и загрузка погоды по координатам (виджет `useInitWeatherByGeolocation`).
- **DI-контейнер** (`shared/lib/di`): регистрация фабрик/синглтонов, токены, `resolveRequired` / `resolveOr`. Провайдер погоды в app создаёт конфиг (`getOpenWeatherConfig`), HTTP-клиент через `createHttpClient`, сервис через фабрику и регистрирует синглтон в `main.ts`.
- **HTTP-клиент** (`shared/config/httpClient`): фабрика `createHttpClient(options)` — единый Axios-инстанс с заданным baseURL и перехватчиком ошибок (`useApiErrorNormalization`); entity не импортирует axios напрямую.
- **Общие утилиты**: composables нормализации — `useApiErrorNormalization`, `useStringNormalization`; геолокация (`getCurrentPosition`), конфиг OpenWeatherMap (`IOpenWeatherConfig`, `getOpenWeatherConfig`).
- **PageLoader** (`shared/ui/PageLoader`): лоадер первой загрузки страницы с logo.webp, анимация прогресса по `window.load`. Конфиг в `shared/config/constants`, типы в `shared/model/types`, логика в composable `shared/lib/composables/usePageLoader` (покрыт тестами), UI в `PageLoader.vue`; проверка `document.readyState` через `useStringNormalization`, стили через миксины и палитру (`$color-bg`).

## FSD-структура

```
src/
├── app/          # Инициализация приложения, роутер, DI-провайдеры (weather), PageLoader
├── pages/        # Страницы и роуты (main → WeatherWidget)
├── widgets/      # weather: виджет погоды + useInitWeatherByGeolocation
├── features/     # search-city: форма поиска по городу
├── entities/     # Weather: API, store, mappers, UI (карточка, лоадер, ошибка, пусто)
└── shared/       # config, lib (di, helpers, normalization, composables/usePageLoader), ui (PageLoader), стили, тест-сетап
```

Алиасы: `@app`, `@pages`, `@widgets`, `@features`, `@entities`, `@shared`, `@`.

> 📚 **Подробнее**: [Глава 3: FSD Принципы](./docs/03-fsd-principles.md)

## 🚀 Быстрый старт

```bash
npm install
cp .env.example .env
# Заполните OPENWEATHERMAP_API_KEY в .env
npm run dev
```

Открыть: http://localhost:3000

> 📚 **Подробнее**: [Глава 1: Быстрый старт](./docs/01-quick-start.md)

---

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
| `npm run check` | Полная проверка: lint → type-check → test → build |
| `npm run type-check` | Проверка типов (vue-tsc) |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint с автофиксом |
| `npm run test` | Jest |
| `npm run test:watch` | Jest в watch-режиме |
| `npm run test:coverage` | Jest с отчётом покрытия |
| `npm run hooks:install` | Переустановить Husky git hooks (если не срабатывает pre-commit) |

## Pre-commit

При `git commit` выполняются:

1. **lint-staged**: ESLint (`--fix`) только для staged-файлов
2. **lint**: полный ESLint по проекту
3. **type-check**: полная проверка типов (vue-tsc)
4. **test**: Jest
5. **build**: production-сборка

## 📚 Дополнительные ресурсы

### Документация проекта

- [Быстрый старт](./docs/01-quick-start.md)
- [Архитектурные решения](./docs/02-architecture.md)
- [FSD Принципы](./docs/03-fsd-principles.md)
- [DI и Паттерны](./docs/04-di-and-patterns.md)
- [CHANGELOG](./docs/CHANGELOG.md)

### Внешние ресурсы

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Pinia](https://pinia.vuejs.org/)
- [OpenWeatherMap API](https://openweathermap.org/api)
