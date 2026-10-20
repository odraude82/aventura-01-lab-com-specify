# Research: Sequence Learning

**Date**: 2026-10-20
**Feature**: [spec.md](spec.md)

## Decisions

### Runtime and project type

- **Decision**: Use JavaScript on Node.js 24.x LTS, with `index.js` as the required entry point.
- **Rationale**: This matches RNF-01 and the approved IT baseline. Node.js 24 is LTS on the
  planning date; the local runtime is v24.19.0.
- **Alternatives considered**: Node.js 26 is Current rather than LTS on the planning date;
  adding another language or runtime is outside the approved baseline.

### Dependencies and tests

- **Decision**: Use Node.js built-in modules only. Use `node:test` and `node:assert`, run by
  `node --test`.
- **Rationale**: The feature needs no external service, UI toolkit, or persistence layer.
  Node.js 24 documents the test runner as stable and provides a built-in line-oriented
  terminal API, avoiding dependency and installation overhead for a small console app.
- **Alternatives considered**: Jest, Mocha, and other external test frameworks add package
  management without a demonstrated need.

### Terminal interaction

- **Decision**: Implement a repeated Portuguese menu using `node:readline/promises` with
  explicit actions to predict, view this session's history, and exit. Disable readline's
  separate line-recall buffer so sequence entries are not duplicated in terminal history.
- **Rationale**: The app must support multiple attempts, an in-session history, keyboard
  operation, and reliable cleanup on exit. The promises API supports asynchronous questions
  while remaining a built-in module.
- **Alternatives considered**: A one-shot command-line argument mode does not meet the
  interactive “test multiple sequences” flow.

### Input grammar and numeric representation

- **Decision**: Accept comma-separated integers (example: `3, 6, 9, 12`) and semicolon-
  separated terms with comma decimals (example: `1,5; 3; 4,5`). Trim surrounding whitespace.
  Require one consistent delimiter style per sequence; reject mixed or ambiguous forms,
  empty terms, non-numeric values, fewer than two terms, more than 100 terms, non-finite
  values, and integer values outside JavaScript's safe-integer range.
- **Rationale**: The grammar supports the supplied examples while disambiguating a decimal
  comma from a term separator. The 100-term bound makes the performance criterion testable.
  Finite and safe-integer checks prevent silent precision loss; decimal pattern comparisons
  use a scale-aware tolerance of `1e-9`.
- **Alternatives considered**: Guessing the meaning of mixed commas can silently change the
  submitted sequence. Arbitrary-precision arithmetic would add complexity not justified by
  the accepted examples or range requirement.

### Pattern recognition and ambiguity

- **Decision**: Run four independent recognizers and return every matching supported rule:
  arithmetic progression, geometric progression with a nonzero first term, consecutive
  nonnegative perfect squares, and contiguous terms of the standard Fibonacci sequence
  beginning `0, 1, 1, ...`. Require at least two terms. Display each rule and its next term;
  do not rank results or claim the list includes all mathematically possible continuations.
- **Rationale**: Independent matching honors Q1/Q2 and mathematical honesty. For `2, 4`, the
  arithmetic rule proposes `6` and the geometric rule proposes `8`. Limiting patterns to the
  examples and requirements prevents speculative extrapolation.
- **Alternatives considered**: Choosing a “best” rule introduces an unapproved priority;
  polynomial fitting could generate arbitrarily many continuations and is not a finite,
  testable interpretation of “other patterns”.

### Session history and privacy

- **Decision**: Keep successful, parsed prediction results in an in-memory list owned by the
  running process. Show it only through the current interactive menu and clear it on exit.
  Do not record invalid submissions, write files, or share results with teachers.
- **Rationale**: This directly implements Q3 and the constitution's data-minimization rule.
  A timestamp or learner identity is not needed for the Phase 1 workflow.
- **Alternatives considered**: File storage, login, and teacher access require a revised scope
  and privacy review.

## Sources

- Node.js release status, official release schedule: https://nodejs.org/en/about/previous-releases
- Node.js v24 test runner documentation: https://nodejs.org/docs/latest-v24.x/api/test.html
- Node.js v24 readline documentation: https://nodejs.org/docs/latest-v24.x/api/readline.html
- Project constraints and examples: [requisitos/requisitos.md](../../requisitos/requisitos.md)
- Project governance: [constitution.md](../../.specify/memory/constitution.md)

## Resolved Unknowns

- Node.js baseline: Node.js 24.x LTS.
- Test runner: built-in `node:test`.
- Input grammar, delimiters, input count limit, and numeric precision policy: defined above.
- Pattern recognition: four finite recognizers, all matches returned, no arbitrary hierarchy.
- Session history: memory-only, current process only, valid predictions only.
