# SDS

Vue 3 (Composition API) + TypeScript + Webpack 5 + Axios + Element Plus.  
Архитектура: **FSD** (Feature-Sliced Design).

## Стек

- **Vue 3** (Composition API)
- **TypeScript**
- **Webpack 5**
- **Axios**
- **Element Plus**
- **SCSS** (глобальные переменные, миксины flex / media / spacing, палитра)
- **Jest** (тесты)
- **ESLint** + **vue-tsc** (линт и проверка типов)
- **Husky** + **lint-staged** (pre-commit: линт, type-check, тесты, build)
- **webpack-bundle-analyzer** (анализ бандла)

## FSD-структура

```
src/
├── app/          # Инициализация приложения, роутер, провайдеры
├── pages/        # Страницы и роуты
├── widgets/      # Композитные блоки для страниц
├── features/     # Действия пользователя, фичи
├── entities/      # Бизнес-сущности
└── shared/        # API, UI-кит, стили, утилиты, тест-сетап
```

Алиасы: `@app`, `@pages`, `@widgets`, `@features`, `@entities`, `@shared`, `@`.

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
npm run dev
```

Открыть: http://localhost:3000
