# Глава 4: DI и Паттерны 🧩

> Dependency Injection, HTTP-клиент, конфиг, Strategy, Factory, Mappers — управление зависимостями и паттерны проектирования

---

## 📋 Содержание

1. [Dependency Injection (DI)](#dependency-injection-di)
2. [DI Контейнер](#di-контейнер)
3. [Токены и фабрики](#токены-и-фабрики)
4. [Регистрация в app](#регистрация-в-app)
5. [HTTP-клиент и конфиг](#http-клиент-и-конфиг)
6. [Паттерн Strategy и нормализация](#паттерн-strategy-и-нормализация)
7. [Система мапперов](#система-мапперов)
8. [Миграция на DI](#миграция-на-di)

---

## 🧩 Dependency Injection (DI)

### Что это?

**Dependency Injection** — паттерн проектирования, при котором зависимости объекта передаются извне, а не создаются внутри самого объекта.

### Зачем нужно?

- ✅ **Тестируемость** — легко подменять зависимости моками
- ✅ **Гибкость** — можно менять реализацию без изменения кода
- ✅ **Переиспользуемость** — один экземпляр на всё приложение (синглтон)
- ✅ **SOLID** — следование принципу Dependency Inversion

### Пример: До и После DI

#### ❌ Без DI (жёсткая связь)

```typescript
// Сервис сам импортирует axios и читает env
import axios from 'axios';
const key = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

export async function getByCity(city: string) {
  const res = await axios.get(`${base}/weather`, { params: { q: city, appid: key } });
  return mapWeatherApiToStoreDto(res.data);
}
```

**Проблемы:**

- 🔴 Невозможно протестировать без реального API и env
- 🔴 Нельзя переключить реализацию HTTP-клиента

#### ✅ С DI (инъекция зависимостей)

```typescript
// entities/Weather/api/getCurrentWeatherService.ts
export class GetCurrentWeatherService implements IGetCurrentWeatherService {
  constructor(
    private readonly config: IOpenWeatherConfig,
    private readonly httpClient: AxiosInstance
  ) {}

  async getByCity(city: string): Promise<WeatherStoreDto> {
    const { data } = await this.httpClient.get<OpenWeatherCurrentDto>('/weather', {
      params: { q: city, appid: this.config.apiKey },
    });
    return mapWeatherApiToStoreDto(data);
  }
}
```

**Преимущества:**

- ✅ Легко тестировать — подставляем мок config и httpClient
- ✅ Конфиг и HTTP-клиент создаются в app (getOpenWeatherConfig, createHttpClient) и передаются в фабрику

---

## 🗂️ DI Контейнер

### Расположение

```
src/shared/lib/di/container.ts
```

### Основные методы

```typescript
// Регистрация фабрики (создаёт новый экземпляр при каждом resolve)
container.registerFactory(token, factory)

// Регистрация синглтона (один экземпляр на всё приложение)
container.registerSingleton(token, instance)

// Получение зависимости (может вернуть undefined)
container.resolve<T>(token)
```

### Вспомогательные функции

```typescript
// Получить зависимость или создать через fallback
resolveOr<T>(token, fallbackFactory)

// Получить зависимость или выбросить ошибку
resolveRequired<T>(token, message?)
```

### Пример использования

```typescript
import { container, resolveOr, resolveRequired } from '@/shared/lib/di/container';
import { WEATHER_TOKENS } from '@/entities/Weather/api/tokens';

// С фолбэком (в тестах или при отсутствии провайдера)
const service = resolveOr(
  WEATHER_TOKENS.GetCurrentWeatherService,
  () => createGetCurrentWeatherService(getOpenWeatherConfig(), createHttpClient(/* ... */))
);

// Строгая проверка (в коде после регистрации в main)
const service = resolveRequired(
  WEATHER_TOKENS.GetCurrentWeatherService,
  'GetCurrentWeatherService not registered in DI container'
);
```

---

## 🏷️ Токены и фабрики

### Структура для домена Weather

```
entities/Weather/
├── api/
│   ├── tokens.ts          # Токены для DI
│   ├── factories.ts       # Фабрики для создания сервиса
│   └── getCurrentWeatherService.ts
```

### Создание токенов

```typescript
// entities/Weather/api/tokens.ts
import { createToken } from '@/shared/lib/di/container';

export const WEATHER_TOKENS = {
  GetCurrentWeatherService: createToken<IGetCurrentWeatherService>('Weather.GetCurrentWeatherService'),
};
```

**Правила именования токенов:**

- Формат: `'Domain.ServiceName'`
- Пример: `'Weather.GetCurrentWeatherService'`
- Всегда через `createToken()` для типобезопасности

### Создание фабрик

```typescript
// entities/Weather/api/factories.ts
import { GetCurrentWeatherService } from './getCurrentWeatherService';
import type { IOpenWeatherConfig } from '@/shared/config/openWeatherConfig';
import type { AxiosInstance } from 'axios';

export function createGetCurrentWeatherService(
  config: IOpenWeatherConfig,
  httpClient: AxiosInstance
): IGetCurrentWeatherService {
  return new GetCurrentWeatherService(config, httpClient);
}
```

---

## 📦 Регистрация в app

### Провайдер погоды

```typescript
// app/providers/di/weather.ts
import { container } from '@/shared/lib/di/container';
import { WEATHER_TOKENS } from '@/entities/Weather/api/tokens';
import { createGetCurrentWeatherService } from '@/entities/Weather/api/factories';
import { getOpenWeatherConfig } from '@/shared/config/openWeatherConfig';
import { createHttpClient } from '@/shared/config/httpClient';

export function registerWeatherDependencies(): void {
  const config = getOpenWeatherConfig();
  const httpClient = createHttpClient({ baseURL: config.baseURL });
  const service = createGetCurrentWeatherService(config, httpClient);
  container.registerSingleton(WEATHER_TOKENS.GetCurrentWeatherService, service);
}
```

### Регистрация в main

```typescript
// main.ts
import { registerWeatherDependencies } from '@/app/providers/di/weather';

registerWeatherDependencies();
// ... createApp, router, mount
```

---

## 🌐 HTTP-клиент и конфиг

### HTTP-клиент

**Назначение:** Единый Axios-инстанс с перехватчиком ошибок (нормализация через `useApiErrorNormalization`).

```typescript
// shared/config/httpClient.ts
export function createHttpClient(options: CreateHttpClientOptions): AxiosInstance {
  const client = axios.create({
    baseURL: options.baseURL,
    timeout: options.timeout,
  });
  client.interceptors.response.use(/* ... */, (error) => {
    throw useApiErrorNormalization(error);
  });
  return client;
}
```

Используется в провайдере погоды: конфиг читается через `getOpenWeatherConfig()`, HTTP-клиент создаётся с `baseURL` из конфига, сервис получает конфиг и клиент через конструктор.

### Конфиг OpenWeatherMap

**Назначение:** Централизованное чтение переменных окружения для API погоды.

```typescript
// shared/config/openWeatherConfig.ts
export interface IOpenWeatherConfig {
  apiKey: string;
  baseURL: string;
}

export function getOpenWeatherConfig(): IOpenWeatherConfig {
  const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY ?? '';
  const baseURL = import.meta.env.VITE_OPENWEATHERMAP_BASE ?? DEFAULT_BASE;
  return { apiKey, baseURL };
}
```

Сервис погоды не обращается к `import.meta.env` — конфиг передаётся из app.

---

## 🔀 Паттерн Strategy и нормализация

### Нормализация строк (useStringNormalization)

**Назначение:** Приведение строк к единому виду (trim, регистр и т.д.) для сравнений и запросов.

```typescript
// shared/lib/normalization/useStringNormalization.ts
export function useStringNormalization(str: string): string {
  return str.trim().toLowerCase();
}
```

**Использование:**

- В `getCityQueryFromInput` (фича поиска города) — нормализация ввода пользователя
- В `usePageLoader` — нормализация `document.readyState` перед сравнением

### Нормализация ошибок API (useApiErrorNormalization)

**Назначение:** Приведение ошибок Axios к единому формату сообщения (сеть, 404, дефолт).

```typescript
// shared/lib/normalization/useApiErrorNormalization.ts
export function useApiErrorNormalization(error: unknown): Error {
  // Возвращает Error с сообщением NETWORK_ERROR_MESSAGE, CITY_NOT_FOUND_MESSAGE и т.д.
}
```

Используется в перехватчике `createHttpClient`.

---

## 🗂️ Система мапперов

### Когда использовать маппер

| Ситуация              | Маппер          | Причина                          |
|-----------------------|-----------------|----------------------------------|
| Ответ API → Store/UI  | **API → Store** | Преобразование DTO API в DTO стора |

### Структура мапперов

```
entities/Weather/
├── lib/
│   └── mappers/
│       ├── index.ts
│       └── mapWeatherApiToStoreDto.ts
```

### Пример маппера

```typescript
// entities/Weather/lib/mappers/mapWeatherApiToStoreDto.ts
export function mapWeatherApiToStoreDto(api: OpenWeatherCurrentDto): WeatherStoreDto {
  return {
    city: api.name,
    temp: Math.round(api.main.temp),
    description: api.weather[0]?.description ?? '',
    icon: api.weather[0]?.icon,
    // ...
  };
}
```

Сервис вызывает маппер после получения ответа от API и возвращает уже `WeatherStoreDto`.

---

## 🔄 Миграция на DI

### Шаг 1: Создать токены

```typescript
// entities/<Domain>/api/tokens.ts
export const DOMAIN_TOKENS = {
  MyService: createToken<IMyService>('Domain.MyService'),
};
```

### Шаг 2: Создать фабрику с инъекцией зависимостей

```typescript
// entities/<Domain>/api/factories.ts
export function createMyService(config: IConfig, httpClient: AxiosInstance): IMyService {
  return new MyService(config, httpClient);
}
```

### Шаг 3: Зарегистрировать в app

```typescript
// app/providers/di/domain.ts
export function registerDomainDependencies() {
  const config = getConfig();
  const httpClient = createHttpClient({ baseURL: config.baseURL });
  const service = createMyService(config, httpClient);
  container.registerSingleton(DOMAIN_TOKENS.MyService, service);
}
```

### Шаг 4: Использовать в коде через resolveRequired/resolveOr

В сторе или composable получать сервис через `resolveRequired(DOMAIN_TOKENS.MyService, '...')` после того, как провайдер вызван в `main.ts`.

---

## 📚 Дополнительные материалы

- [Архитектура](./02-architecture.md)
- [FSD Принципы](./03-fsd-principles.md)
