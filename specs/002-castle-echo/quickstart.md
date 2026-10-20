# Quickstart: Validate Castelo do Eco

## Prerequisites

- Node.js 24.x LTS and npm.
- Install project dependencies from the repository root:

```powershell
npm install
```

## Run the Test Suite and Build

```powershell
npm test
npm run build
```

Expected: all CLI and web-domain tests pass and Vite produces a static entry plus bundled JavaScript, styles, and local fonts in `dist/`.

## Run the Web Experience

```powershell
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173/`). The development server is for local authoring only; the production deliverable is the static site in `dist/` and has no application backend or remote dependency.

## Acceptance Scenarios

1. Enter `3, 6, 9, 12`; expect the arithmetic rule, next term `15`, a graph, and matching textual values.
2. Enter `2, 4`; expect arithmetic (`6`) and geometric (`8`) interpretations and separately identifiable chart continuations.
3. Enter `1, 4, 9, 16`; expect the consecutive-squares explanation and next term `25`.
4. Enter `1, 1, 2, 3, 5`; expect the Fibonacci explanation and next term `8`.
5. Enter `1,5; 3; 4,5`; expect the decimal-comma input to predict `6`.
6. Enter invalid input, a sequence with one term, mixed separators, more than 100 terms, and an unsupported sequence; expect clear errors/no forecast and no corresponding history entry.
7. Make two valid predictions and open history; expect both entries in submission order with every rule and next value.
8. Reload the page and open history; expect a new empty state.
9. Navigate to each math topic; verify explanations use the same four rules and explain ambiguity.
10. Complete prediction, history, and documentation navigation using only the keyboard; verify the chart's accessible name and equivalent semantic table, then inspect desktop and narrow viewport layouts for horizontal overflow.

The prediction grammar and recognizer invariants are described in [data-model.md](data-model.md), and UI behavior is specified in [contracts/web-ui.md](contracts/web-ui.md).
