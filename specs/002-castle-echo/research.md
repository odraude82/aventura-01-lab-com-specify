# Research: Castelo do Eco Web

**Date**: 2026-10-20
**Feature**: [spec.md](spec.md)

## Decisions

### Static web delivery

- **Decision**: Use Vite for local development and production bundling; deliver the production app as static assets with no application backend.
- **Rationale**: Phase 2 requires a browser interface while the approved constraints exclude an application server, login, API, and remote storage. Vite's build command emits optimized static assets; its current guide documents Node.js 20.19+ or 22.12+ as supported, which includes the project's Node.js 24.x runtime.
- **Alternatives considered**: A server-rendered app or API would contradict the approved no-backend scope. Opening unbundled source files directly would complicate module and dependency loading.
- **Source**: [Vite Getting Started](https://vite.dev/guide/); [Vite Build Options](https://vite.dev/config/build-options.html).

### Charts

- **Decision**: Use Chart.js for line charts, with input terms and each supported forecast represented as labeled series; include a semantic HTML table containing the same values.
- **Rationale**: Chart.js supports bundler integration and avoids hand-written chart layout and interaction logic. Its accessibility guidance notes that canvas content is not inherently available to screen readers, so the app must provide an accessible canvas name and a complete text/table alternative.
- **Alternatives considered**: Custom canvas/SVG drawing would create avoidable charting and maintenance code. A chart without a table would not meet the accessibility requirements.
- **Sources**: [Chart.js Integration](https://www.chartjs.org/docs/latest/getting-started/integration.html); [Chart.js Accessibility](https://www.chartjs.org/docs/latest/general/accessibility.html).

### Shared sequence rules

- **Decision**: Move the parser and four independent recognizers into synchronous `.mjs` modules; keep the existing `.js` CommonJS paths as thin adapters for the CLI, and import the ESM core directly from the browser app.
- **Rationale**: Fase 2 must match existing predictions and preserve ambiguity decisions. The project baseline is Node.js 24, whose documentation supports `require()` of synchronous ES modules without top-level `await`; browser code can import the same ESM source natively.
- **Alternatives considered**: Duplicating browser-specific rules or relying on development-only CommonJS transforms risks rule drift or different dev/build behavior.
- **Source**: [Node.js v24 CommonJS: Loading ECMAScript modules using require()](https://nodejs.org/docs/latest-v24.x/api/modules.html#loading-ecmascript-modules-using-require).

### Session history

- **Decision**: Keep web history in a page-lifetime in-memory store and clear it on reload/unload; do not use localStorage, IndexedDB, files, or a remote service.
- **Rationale**: This implements the user-approved ephemeral retention policy and excludes teacher access and shared data.
- **Alternatives considered**: Persistent browser or server storage conflicts with the final scope decision.

### Test strategy

- **Decision**: Keep `node:test` for domain/session modules, require `npm run build` for bundling, and validate user flows in a real browser at desktop and mobile viewports.
- **Rationale**: The project already uses Node's built-in test runner; browser checks are necessary for keyboard interaction, chart visibility, and layout behavior that unit tests cannot prove.
- **Alternatives considered**: A new general-purpose test framework adds setup without replacing the need for browser validation.

## Resolved Unknowns

- App shape: static client-side web app, no API or application backend.
- Runtime history policy: page-memory only; no persistent browser storage.
- Chart accessibility: canvas label plus an equivalent semantic table.
- Feature scope: same four Fase 1 recognizers; no teacher view or historical analytics.
