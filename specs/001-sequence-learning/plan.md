# Implementation Plan: Previsão de Sequências (Sala do Eco)

**Branch**: `001-sequence-learning` | **Date**: 2026-10-20 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-sequence-learning/spec.md`

## Summary

Deliver an interactive Portuguese console app that parses numeric sequences, reports the
next terms for every recognized supported pattern, and explains each rule. Use Node.js 24
LTS with native APIs only, deterministic pattern recognizers, in-memory session history,
and the built-in test runner.

## Technical Context

**Language/Version**: JavaScript on Node.js 24.x LTS (local runtime: v24.19.0)

**Primary Dependencies**: None; use Node.js built-in modules

**Storage**: In-memory history for the lifetime of one app session; no files or remote storage

**Testing**: Node.js built-in `node:test` and `node:assert`; run with `node --test`

**Target Platform**: Interactive terminal on Windows, macOS, or Linux with Node.js 24.x

**Project Type**: Single-project CLI application

**Performance Goals**: At least 95% of predictions for inputs up to 100 terms complete within 1 second

**Constraints**: Portuguese interaction; accept two or more terms; explicit comma/semicolon
input grammar; report all matching supported patterns; no login, persistence, web UI,
teacher access, or undocumented pattern inference

**Scale/Scope**: One local user per process, up to 100 terms per submitted sequence, and four
supported pattern families: arithmetic, geometric, consecutive nonnegative perfect squares,
and contiguous terms of the standard Fibonacci sequence

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Evidence |
|---|---|---|
| Mathematical honesty | PASS | Return each recognized supported interpretation; never claim uniqueness when multiple rules match. |
| Student privacy | PASS | Store only current-session echoes in process memory; do not persist or share them. |
| Explicit scope | PASS | Console-only Phase 1; web, hosting, exports, and teacher access are excluded. |
| Tested behavior | PASS | Plan includes tests for reference patterns, invalid input, boundaries, and ambiguity. |
| Accessible interaction | PASS | Portuguese prompts and errors; keyboard-driven line input with clear commands. |

No unresolved clarification markers or constitution violations remain. The assumed performance
threshold is measurable and is retained from the feature spec.

**Post-Design Review**: PASS. The data model uses session-only in-memory records; the CLI
contract is Portuguese and keyboard-driven; the design has no persistence, shared access,
hosting, or web surface. Every supported match is explained, and tests cover ambiguity,
invalid input, and boundaries.

## Project Structure
### Documentation (this feature)

```text
specs/001-sequence-learning/
  plan.md
  research.md
  data-model.md
  quickstart.md
  contracts/cli.md
  tasks.md
```

### Source Code (repository root)

```text
index.js
package.json
src/
  cli.js
  parse-sequence.js
  recognize-patterns.js
  session-history.js
test/
  cli.test.js
  parse-sequence.test.js
  recognize-patterns.test.js
  session-history.test.js
```

**Structure Decision**: Keep the required `index.js` entry point at the repository root.
Separate terminal interaction, parsing, pattern recognition, and session history into small
`src/` modules. Use `test/` for built-in Node.js tests. A minimal `package.json` records the
Node.js engine and test command; runtime dependencies are not required.

## Complexity Tracking

No constitution violations or exceptions require justification.
