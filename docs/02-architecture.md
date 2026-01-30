# Глава 2: Архитектурные решения 🏗️

> Обзор архитектуры, паттерны проектирования и принципы SOLID

---

## 📐 Обзор архитектуры

Проект построен на **трёх столпах**:

1. **Feature-Sliced Design (FSD)** — методология организации кода
2. **SOLID принципы** — принципы объектно-ориентированного проектирования
3. **Dependency Injection (DI)** — управление зависимостями

Эта комбинация обеспечивает:

- ✅ Масштабируемость — легко добавлять новые функции
- ✅ Поддерживаемость — код легко понять и изменить
- ✅ Тестируемость — всё покрыто тестами
- ✅ Переиспользуемость — меньше дублирования кода

---

## 🎯 SOLID принципы

Проект полностью соответствует принципам SOLID. Рассмотрим каждый принцип с примерами из проекта.

### S — Single Responsibility (Единственная ответственность)

**Принцип**: Каждый класс/модуль имеет только одну причину для изменения.

#### ✅ Правильно: Разделение ответственностей

```typescript
// entities/Weather/api/getCurrentWeatherService.ts
// Отвечает ТОЛЬКО за получение данных с API
export class GetCurrentWeatherService {
  constructor(
    private readonly config: IOpenWeatherConfig,
    private readonly httpClient: AxiosInstance
  ) {}
  async getByCity(city: string): Promise<WeatherStoreDto> { /* ... */ }
  async getByCoords(lat: number, lon: number): Promise<WeatherStoreDto> { /* ... */ }
}

// entities/Weather/model/types.ts
// Отвечает ТОЛЬКО за определение типов
export interface WeatherStoreDto {
  city: string;
  temp: number;
  // ...
}

// entities/Weather/ui/WeatherCard.vue
// Отвечает ТОЛЬКО за отображение карточки погоды
```

#### ❌ Неправильно: Смешивание ответственностей

```typescript
// ❌ Один компонент делает всё: API, валидацию, форматирование, отображение
export default {
  async mounted() {
    const res = await axios.get(/* ... */);  // API внутри компонента
    this.weather = this.validate(res.data);  // Валидация
    this.displayTemp = this.formatTemp(this.weather.temp);  // Форматирование
  }
}
```

---

### O — Open/Closed (Открыт для расширения, закрыт для модификации)

**Принцип**: Классы открыты для расширения, но закрыты для модификации.

#### ✅ Правильно: Композиция и расширение

```typescript
// shared/ui/PageLoader — базовый компонент, расширяется через props/slots
// Конфиг вынесен в shared/config/constants, логика в composable usePageLoader

// features/search-city — форма поиска; можно расширять через слоты и события
```

#### ✅ Правильно: Composables для расширения функциональности

```typescript
// shared/lib/composables/usePageLoader.ts
// Composables можно расширять опциями, но не нужно модифицировать ядро
export function usePageLoader(options?: IUsePageLoaderOptions) {
  // Базовая логика
  return { isVisible, progress, /* ... */ };
}
```

---

### L — Liskov Substitution (Подстановка Барбары Лисков)

**Принцип**: Объекты производных классов должны корректно заменять объекты базового класса.

#### ✅ Правильно: Полиморфизм через интерфейсы

```typescript
// Сервис погоды получает IOpenWeatherConfig и AxiosInstance
// Любая реализация конфига и HTTP-клиента подходит для подстановки
export class GetCurrentWeatherService {
  constructor(
    private readonly config: IOpenWeatherConfig,
    private readonly httpClient: AxiosInstance
  ) {}
}
```

---

### I — Interface Segregation (Разделение интерфейсов)

**Принцип**: Клиенты не должны зависеть от интерфейсов, которые они не используют.

#### ✅ Правильно: Разделённые интерфейсы

```typescript
// shared/config/openWeatherConfig.ts — только конфиг API
export interface IOpenWeatherConfig {
  apiKey: string;
  baseURL: string;
}

// entities/Weather/model/types.dto.ts — DTO для стора
export interface WeatherStoreDto {
  city: string;
  temp: number;
  description: string;
  // только нужные поля для UI/стора
}
```

---

### D — Dependency Inversion (Инверсия зависимостей)

**Принцип**: Модули верхнего уровня не должны зависеть от модулей нижнего уровня. Оба должны зависеть от абстракций.

#### ✅ Правильно: Через DI контейнер

```typescript
// entities/Weather/api/tokens.ts
export const WEATHER_TOKENS = {
  GetCurrentWeatherService: createToken<IGetCurrentWeatherService>('Weather.GetCurrentWeatherService'),
};

// app/providers/di/weather.ts — регистрируем конфиг, HTTP-клиент, сервис
// entities/Weather/api/getCurrentWeatherService — получает config и httpClient через конструктор
```

#### ❌ Неправильно: Прямая зависимость

```typescript
// ❌ Импорт axios и конфига напрямую внутри сервиса
import axios from 'axios';
const key = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
```

---

## 🏗️ Архитектурные паттерны

### 1. Паттерн Strategy (Стратегия)

**Назначение**: Инкапсуляция алгоритмов и возможность их переключения.

#### Пример: Нормализация запроса города

```typescript
// features/search-city/lib/getCityQueryFromInput.ts
// Нормализация ввода (trim, регистр) через useStringNormalization
export function getCityQueryFromInput(input: string, normalize: (s: string) => string): string {
  return normalize(input.trim());
}
```

### 2. Паттерн Factory (Фабрика)

**Назначение**: Создание объектов без указания их конкретных классов.

```typescript
// shared/config/httpClient.ts — фабрика Axios-инстанса
export function createHttpClient(options: CreateHttpClientOptions): AxiosInstance { /* ... */ }

// entities/Weather/api/factories.ts — фабрика сервиса с инъекцией config и httpClient
export function createGetCurrentWeatherService(
  config: IOpenWeatherConfig,
  httpClient: AxiosInstance
): IGetCurrentWeatherService { /* ... */ }
```

### 3. Паттерн Mapper (Преобразователь)

**Назначение**: Преобразование данных между слоями (API → Store → UI).

```typescript
// entities/Weather/lib/mappers/mapWeatherApiToStoreDto.ts
export function mapWeatherApiToStoreDto(api: OpenWeatherCurrentDto): WeatherStoreDto {
  return {
    city: api.name,
    temp: Math.round(api.main.temp),
    description: api.weather[0]?.description ?? '',
    // ...
  };
}
```

---

## 🎨 Структура проекта

```
src/
├── app/                    # Инициализация, роутер, DI-провайдеры (weather), PageLoader
├── pages/                  # Страницы и роуты (main → WeatherWidget)
├── widgets/                # weather: виджет погоды + useInitWeatherByGeolocation
├── features/               # search-city: форма поиска по городу
├── entities/               # Weather: API, store, mappers, UI (карточка, лоадер, ошибка)
└── shared/                 # config, lib (di, normalization, composables), ui, стили
```

---

## ✅ Лучшие практики

### 1. Разделение ответственностей

✅ **Правильно:**
- API/сервисы — только запросы и маппинг
- Компоненты — только UI
- Composables — только логика

❌ **Неправильно:**
- Компонент делает API-запросы напрямую без сервиса/стора
- Сервис содержит UI-логику

### 2. Использование типов

✅ **Правильно:**
```typescript
export interface WeatherCardProps {
  weather: WeatherStoreDto;
}
```

❌ **Неправильно:**
```typescript
props: { weather: any }
```

### 3. Композиция вместо наследования

✅ **Правильно:**
- Виджет собирает features и entities через импорты и слоты
- Компоненты получают данные через props и события

---

## 📚 Дополнительные материалы

- [Feature-Sliced Design](./03-fsd-principles.md)
- [Dependency Injection и паттерны](./04-di-and-patterns.md)
