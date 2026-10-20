# CLI Contract: Sala do Eco

## Invocation

- Start the application with `node index.js` from the repository root.
- All prompts, menu labels, predictions, explanations, and errors are in Portuguese.
- The application accepts keyboard input and repeats the main menu until the learner exits
  or the input stream ends.

## Menu Actions

| Action | Behavior |
|---|---|
| `1` - Prever sequência | Prompt for one line, validate and analyze it, show every recognized rule with its next term, then return to the menu. |
| `2` - Ver histórico da sessão | Show valid prediction records from this process in submission order, or a clear empty-state message. |
| `3` - Sair | Clear in-memory records and terminate the process. |

Unknown menu values produce a short Portuguese error and redisplay the menu. End-of-input
terminates the process and discards session records.

## Sequence Input Grammar

- Comma-separated integer terms: `3, 6, 9, 12`.
- Semicolon-separated terms with comma decimals: `1,5; 3; 4,5`.
- Surrounding whitespace is ignored; terms must be separated using one delimiter style.
- A sequence contains 2 through 100 terms.
- Mixed or ambiguous delimiters, empty terms, non-numeric terms, non-finite values, and
  unsafe integer values are rejected with an actionable Portuguese message.

## Prediction Output

- For each matching supported pattern, show its name, a concise rule explanation, and its
  next term.
- Show every recognized match; do not select a single winner or claim the list covers all
  mathematically possible continuations.
- If no supported pattern matches, say that no supported rule was identified; do not invent
  a next term.

Example for `2, 4`:

```text
Progressão aritmética: somar 2 -> próximo termo 6
Progressão geométrica: multiplicar por 2 -> próximo termo 8
```

## History Contract

- Only valid sequences with at least one supported prediction are recorded.
- Records are visible only in the current process session and are discarded on exit.
- Invalid submissions and unsupported sequences are not added to history.
- No files, accounts, or shared teacher views are part of this phase.

## Exit and Errors

- Invalid input never terminates the application; show the error and return to the menu.
- EOF and explicit exit both close the session without persisting history.
- Errors are user-facing, in Portuguese, and do not expose stack traces.
