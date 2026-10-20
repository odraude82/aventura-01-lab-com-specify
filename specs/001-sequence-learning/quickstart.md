# Quickstart: Validate Sala do Eco

## Prerequisites

- Node.js 24.x LTS installed and available as `node`.
- Run commands from the repository root after implementation files exist.

Check the runtime:

```powershell
node --version
```

Expected: a `v24.x` version.

## Run the Test Suite

```powershell
node --test
```

Expected: all parser, pattern-recognition, CLI, and session-history tests pass.

## Run the Console App

```powershell
node index.js
```

Choose an action from the Portuguese menu. Enter `3` to close the app and discard the
session history.

## Acceptance Scenarios

1. Choose sequence prediction and enter `3, 6, 9, 12`. Expect the arithmetic rule and next
   term `15`.
2. Enter `1, 4, 9, 16`. Expect the consecutive-square rule and next term `25`.
3. Enter `2, 4`. Expect both arithmetic (`6`) and geometric (`8`) interpretations, each with
   its rule.
4. Enter `1,5; 3; 4,5`. Expect the decimal-comma sequence to parse and predict `6`.
5. Enter `10, 20, abc`. Expect a Portuguese input error and no prediction; the app remains
   usable.
6. Enter `2, 4, 8`. Expect the geometric prediction `16` and any other recognized supported
   pattern, each with its own explanation.
7. Create valid echoes, view session history, exit, and launch the app again. Expect the new
   session history to be empty.
8. Try an empty line, one term, mixed delimiters, more than 100 terms, and an unsupported
   sequence. Expect clear validation or unsupported-pattern responses without a crash.

The CLI contract is documented in [contracts/cli.md](contracts/cli.md); entity rules are in
[data-model.md](data-model.md).
