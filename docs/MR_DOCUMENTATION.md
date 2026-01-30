# Merge Request: Project documentation (docs + README)

## Title

**docs: add structured documentation and README table of contents (no API guide)**

---

## Summary

Introduce a documentation structure aligned with the _ekapak reference project: chapter-based docs in `docs/` and an updated README with a table of contents and cross-links. The API guide chapter (05-api-guide) is intentionally **not** included, as it is not relevant for this project.

---

## What was done

### New documentation (`docs/`)

| File | Content |
|------|---------|
| **01-quick-start.md** | Requirements, install, env config (`.env`, `OPENWEATHERMAP_API_KEY`), run commands, project structure, troubleshooting. Links to chapters 02–04. |
| **02-architecture.md** | Architecture overview (FSD, SOLID, DI), SOLID applied to SDS (Weather entity, `GetCurrentWeatherService`, PageLoader), Strategy/Factory/Mapper patterns, project layout, best practices. Links to 03, 04. |
| **03-fsd-principles.md** | FSD layers (app, pages, widgets, features, entities, shared), dependency rules, layer descriptions with SDS examples (WeatherWidget, SearchCityForm, weather store, etc.), naming, imports, anti-patterns. Links to 02, 04. |
| **04-di-and-patterns.md** | DI container, tokens and factories (Weather), registration in app, HTTP client and OpenWeather config, normalization (useStringNormalization, useApiErrorNormalization), mappers, migration to DI. Links to 02, 03. |
| **CHANGELOG.md** | Keep a Changelog format: [Unreleased] (docs added), [0.1.0] (main SDS features). |

No `05-api-guide.md`; all “Next steps” and “See also” sections in the docs point only to chapters 01–04 and CHANGELOG.

### README changes

- **Intro**: Subtitle added — “Documentation project — Vue 3 project with Feature-Sliced Design architecture”.
- **Table of contents**: Two parts — Part I: Quick start (Ch. 1); Part II: Architecture (Ch. 2–4). No Part III / API guide.
- **Quick start**: New block with `npm install`, `cp .env.example .env`, `npm run dev`, and link to [docs/01-quick-start.md](./01-quick-start.md).
- **FSD structure**: “Learn more” link to [docs/03-fsd-principles.md](./03-fsd-principles.md).
- **Additional resources**: Replaces the old “Installation” block at the end. Lists all doc chapters (01–04), CHANGELOG, and external links (FSD, Vue, TypeScript, Pinia, OpenWeatherMap). No link to any API guide.

---

## Files changed

- **Added**: `docs/01-quick-start.md`, `docs/02-architecture.md`, `docs/03-fsd-principles.md`, `docs/04-di-and-patterns.md`, `docs/CHANGELOG.md`
- **Modified**: `README.md` (TOC, quick start, FSD link, additional resources)

---

## Why

- Single place to understand setup, architecture, FSD, and DI for SDS.
- Same “book-style” structure as _ekapak for consistency across projects.
- README stays a short entry point; details live in `docs/`.
- No API guide chapter, as requested for this repo.

---

## Checklist

- [x] Docs are SDS-specific (Vue 3, Webpack, Pinia, Weather widget, OpenWeatherMap, PageLoader).
- [x] No references to `05-api-guide` or “API guide” in docs or README.
- [x] Internal links between chapters (01↔02↔03↔04) are correct.
- [x] README links to `docs/` use relative paths (`./docs/...`).
