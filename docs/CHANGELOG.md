# Changelog

Все значимые изменения в проекте документируются в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/),
проект придерживается [Semantic Versioning](https://semver.org/lang/ru/).

## [Unreleased]

### Added

- **Документация проекта**: Организована документация по образцу _ekapak (без 05-api-guide)
  - [01-quick-start.md](./01-quick-start.md) — быстрый старт, установка, конфигурация
  - [02-architecture.md](./02-architecture.md) — архитектура, SOLID, паттерны
  - [03-fsd-principles.md](./03-fsd-principles.md) — FSD, слои, правила зависимостей
  - [04-di-and-patterns.md](./04-di-and-patterns.md) — DI, HTTP-клиент, конфиг, мапперы
  - [CHANGELOG.md](./CHANGELOG.md) — история изменений
- README обновлён: оглавление документации, ссылки на главы (без API Guide)

### Changed

- Pre-commit (Husky): добавлен полный `lint` поверх `lint-staged`, а также `npx --no-install` для запуска `lint-staged` из локальных зависимостей.
- Скрипты: добавлены `npm run check` (lint → type-check → test → build) и `npm run hooks:install` (переустановка git hooks).

### Fixed

- Husky pre-commit: добавлены недостающие служебные файлы `.husky/_/husky.sh` и `.husky/_/.gitignore`, из‑за отсутствия которых хук не выполнялся.
- Документация: в `01-quick-start.md` добавлен раздел про восстановление Husky hooks.

## [0.1.0] — 2025-01-xx

### Added

- Vue 3 (Composition API) + TypeScript + Webpack 5 + Axios + Element Plus + Pinia
- Архитектура FSD: app, pages, widgets, features, entities, shared
- Виджет погоды: поиск по городу, геолокация, OpenWeatherMap API
- DI-контейнер: токены, фабрики, синглтоны, resolveRequired/resolveOr
- HTTP-клиент: createHttpClient, перехватчик ошибок (useApiErrorNormalization)
- Конфиг OpenWeatherMap: getOpenWeatherConfig, IOpenWeatherConfig
- Сервис погоды с инъекцией config и httpClient
- Нормализация: useStringNormalization, useApiErrorNormalization
- PageLoader: лоадер первой загрузки с logo.webp, usePageLoader (покрыт тестами)
- Стили: SCSS переменные, миксины (flex, media, spacing), палитра
- Pre-commit: lint-staged, type-check, test, build
