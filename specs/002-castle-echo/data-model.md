# Data Model: Castelo do Eco Web

## Entities

### Web Sequence Input

A sequence submitted through the browser prediction form.

- `rawText`: exact user-entered line, retained only for the current page session.
- `terms`: 2 to 100 finite values returned by the shared Fase 1 parser.
- `delimiterStyle`: comma-separated integers or semicolon-separated values with comma decimals.
- Validation: preserve the parser's existing rejection behavior for empty, mixed, malformed, non-finite, or unsafe integer values.

### Recognized Interpretation

One supported rule matching every input term.

- `kind`: `arithmetic`, `geometric`, `perfect-squares`, or `fibonacci`.
- `rule`: Portuguese explanation returned by the shared recognizer.
- `nextTerm`: next value proposed by that rule.
- `parameters`: recognizer-provided rule parameters.
- Invariant: no unsupported rule is inferred; multiple matches remain separate and unordered by preference, with a stable display order inherited from Fase 1.

### Web Prediction

The result shown for one valid sequence.

- `sequence`: validated Web Sequence Input.
- `matches`: every Recognized Interpretation.
- `status`: `matched` when there is at least one match; otherwise `unsupported`.
- Invariant: only `matched` predictions create chart continuations or history records.

### Chart Series

A visual representation of input values or one recognized continuation.

- `label`: input terms or a named supported rule.
- `values`: submitted values plus the next value for a recognized series; other points are absent rather than fabricated.
- `style`: visual distinction using both line/point treatment and labels, not color alone.
- Accessibility: the same labels and numeric values are presented in a semantic table adjacent to the chart.

### Web Echo Record

A valid prediction retained in browser memory for the active page session.

- `sequence`: original raw text and validated terms.
- `matches`: all rules and next values shown.
- Ordering: insertion order.
- Lifecycle: add after a valid matched prediction; clear on page reload/close; never serialize to browser storage or a network request.
- Privacy: no user identity, teacher access, or cross-browser sharing.

### Documentation Topic

A local Portuguese explanation available in the static app.

- `slug`: stable local navigation key.
- `title`: visible topic name.
- `content`: accessible explanation, rule, example, and caveat where applicable.
- Topics: arithmetic progression, geometric progression, consecutive perfect squares, contiguous Fibonacci terms, and ambiguity/limits.

## State Flow

```text
Raw input -> shared parser -> shared recognizers -> prediction result
                                            |                  |
                                            |                  +-> labeled chart + equivalent table
                                            +-- no match ------> Portuguese unsupported state; no history
                                                               |
                                                               +-> valid match -> page-memory history

Page reload/close -> clear page-memory history
```
