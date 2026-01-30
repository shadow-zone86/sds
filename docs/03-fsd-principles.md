# Глава 3: FSD Принципы 🎯

> Feature-Sliced Design — методология организации кода для масштабируемых приложений

---

## 🎯 Основные принципы

### 1. Слои архитектуры

Проект разделен на слои, каждый из которых имеет свою ответственность:

```
app/        ← Инициализация приложения, роутер, DI-провайдеры, PageLoader
pages/      ← Страницы и роуты (main → WeatherWidget)
widgets/    ← Виджеты (композиция features и entities)
features/   ← Функциональность (бизнес-логика)
entities/   ← Бизнес-сущности
shared/     ← Переиспользуемый код
```

### 2. Правила зависимостей

Слои могут зависеть только от слоев ниже себя:

```
app → pages → widgets → features → entities → shared
```

**Запрещено:**

- ❌ `features` → `widgets`
- ❌ `entities` → `features`
- ❌ `shared` → `entities`
- ❌ `widgets` → `widgets` (импорт между виджетами)

**Разрешено:**

- ✅ `widgets` → `features`
- ✅ `features` → `entities`
- ✅ `entities` → `shared`
- ✅ `pages` → `widgets`
- ✅ `app` → `pages`, `widgets`

### 3. Сегментация

Каждый слой может быть разделен на сегменты:

```
entities/
└── Weather/
    ├── api/
    ├── config/
    ├── lib/
    ├── model/
    └── ui/
```

---

## 📁 Структура слоев

### app/ — Инициализация приложения

**Назначение:** Роутинг, провайдеры, корневой компонент

**Содержит:**

- `App.vue` — корневой компонент с PageLoader и роутер-вью
- `providers/di/weather.ts` — регистрация сервиса погоды в DI
- `router/index.ts` — конфигурация Vue Router

**Правила:**

- Только инициализация и провайдеры
- Не содержит бизнес-логики
- Использует страницы и виджеты через роутер

**Примеры:**

```typescript
// app/App.vue
<template>
  <PageLoader v-if="pageLoaderVisible" />
  <RouterView v-else />
</template>

// app/providers/di/weather.ts
export function registerWeatherDependencies() {
  const config = getOpenWeatherConfig();
  const httpClient = createHttpClient({ baseURL: config.baseURL });
  const service = createGetCurrentWeatherService(config, httpClient);
  container.registerSingleton(WEATHER_TOKENS.GetCurrentWeatherService, service);
}
```

---

### pages/ — Страницы

**Назначение:** Страницы и маршруты приложения

**Содержит:**

- `main/routes.ts` — маршрут главной страницы
- `main/ui/MainPage.vue` — главная страница с виджетом погоды

**Правила:**

- Только композиция виджетов под страницу
- Не содержит бизнес-логики
- Использует виджеты для контента

**Примеры:**

```vue
<!-- pages/main/ui/MainPage.vue -->
<template>
  <WeatherWidget />
</template>
```

---

### widgets/ — Виджеты

**Назначение:** Композиция features и entities в готовые UI блоки

**Содержит:**

- `weather/` — виджет погоды: форма поиска, состояния загрузки/ошибки/карточка/пустое состояние
- `weather/lib/useInitWeatherByGeolocation.ts` — инициализация погоды по геолокации при монтировании

**Правила:**

- Не содержит бизнес-логики
- Использует features для логики (поиск города)
- Использует entities для данных и UI (Weather store, WeatherCard, WeatherLoading и т.д.)
- Предоставляет готовый UI блок

**Примеры:**

```vue
<!-- widgets/weather/ui/WeatherWidget.vue -->
<template>
  <div class="weather-widget">
    <SearchCityForm @submit="handleSearch" />
    <WeatherLoading v-if="weatherStore.isLoading" />
    <WeatherError v-else-if="weatherStore.error" :message="weatherStore.error" />
    <WeatherCard v-else-if="weatherStore.weather" :weather="weatherStore.weather" />
    <WeatherEmptyHint v-else />
  </div>
</template>
```

---

### features/ — Функциональность

**Назначение:** Бизнес-логика и пользовательские сценарии

**Содержит:**

- `search-city/` — форма поиска по городу, нормализация запроса (`getCityQueryFromInput`), вызов стора

**Правила:**

- Содержит только одну функцию (один сценарий)
- Не зависит от других features
- Может использовать entities и shared
- UI компоненты фичи (форма) — допустимы

**Примеры:**

```typescript
// features/search-city/lib/getCityQueryFromInput.ts
export function getCityQueryFromInput(
  input: string,
  normalize: (s: string) => string
): string {
  return normalize(input.trim());
}
```

---

### entities/ — Бизнес-сущности

**Назначение:** Бизнес-сущности и их поведение

**Содержит:**

- `Weather/` — API (GetCurrentWeatherService), мапперы (API → Store DTO), Pinia-сторе, UI (WeatherCard, WeatherLoading, WeatherError, WeatherEmptyHint), константы (таймаут, единицы)

**Правила:**

- Одна сущность = одна папка
- Содержит всю логику сущности
- Может использоваться в разных features/widgets
- UI компоненты только для отображения сущности

**Примеры:**

```typescript
// entities/Weather/api/getCurrentWeatherService.ts — сервис с DI
// entities/Weather/model/store/weatherStore.ts — Pinia store
// entities/Weather/ui/WeatherCard.vue — карточка погоды
```

---

### shared/ — Переиспользуемый код

**Назначение:** Код, который может использоваться в любом слое

**Содержит:**

- `config/` — httpClient, openWeatherConfig, constants
- `lib/` — di (контейнер), normalization (useStringNormalization, useApiErrorNormalization), composables (usePageLoader), helpers (getCurrentPosition)
- `model/types.ts` — общие типы (IPageLoaderConfig и т.д.)
- `ui/PageLoader/` — лоадер первой загрузки страницы
- `styles/` — переменные, миксины (flex, media, spacing)

**Правила:**

- Не содержит бизнес-логики
- Максимально переиспользуем
- Не зависит от других слоев
- Может использоваться везде

---

## 🔧 Практические правила

### Именование

**Файлы:**

- `*.vue` — Vue компоненты
- `*.ts` — TypeScript (типы, сервисы, composables)
- `types.ts` — типы
- `*.spec.ts` — тесты

**Папки:**

- `ui/` — UI компоненты
- `model/` — типы, store, DTO
- `api/` — API сервисы, токены, фабрики
- `config/` — константы, конфигурация

### Импорты

**Правильно:**

```typescript
// Виджет импортирует feature и entity
import { SearchCityForm } from '@/features/search-city';
import { useWeatherStore } from '@/entities/Weather';
import { WeatherCard } from '@/entities/Weather/ui/WeatherCard.vue';

// Feature импортирует entity и shared
import { useWeatherStore } from '@/entities/Weather';
import { useStringNormalization } from '@/shared/lib/normalization/useStringNormalization';

// Entity импортирует shared
import { createHttpClient } from '@/shared/config/httpClient';
```

**Неправильно:**

```typescript
// ❌ Feature импортирует widget
import { WeatherWidget } from '@/widgets/weather';

// ❌ Entity импортирует feature
import { getCityQueryFromInput } from '@/features/search-city';

// ❌ Widget импортирует другой widget
import { SomeOtherWidget } from '@/widgets/other';
```

### Алиасы

В проекте настроены алиасы: `@app`, `@pages`, `@widgets`, `@features`, `@entities`, `@shared`, `@`.

---

## 🚫 Анти-паттерны

### 1. Циклические зависимости

❌ Виджет A импортирует виджет B, виджет B импортирует виджет A.

✅ Оба виджета используют общие entities/features.

### 2. Нарушение правил зависимостей

❌ `features/search-city` импортирует `widgets/weather`.

✅ `widgets/weather` импортирует `features/search-city` и entities.

### 3. Бизнес-логика в UI

❌ В компоненте карточки погоды — вызов API и маппинг.

✅ API и маппинг в сервисе и сторе; компонент только отображает данные из props/store.

---

## 📚 Дополнительные материалы

- [Архитектура](./02-architecture.md)
- [Dependency Injection и паттерны](./04-di-and-patterns.md)
