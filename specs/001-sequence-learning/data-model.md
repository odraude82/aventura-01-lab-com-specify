# Data Model: Sequence Learning

## Entities

### Sequence Input

One line submitted by the learner for prediction.

- `rawText`: original submitted line, retained for display during the current session.
- `terms`: ordered finite numeric values parsed from the line.
- `delimiterStyle`: either comma-separated integers or semicolon-separated terms with
  optional comma decimals.
- Validation: 2 to 100 terms; no empty or non-numeric term; one delimiter style; integers
  must be within JavaScript's safe-integer range.

### Pattern Match

One supported rule that matches all terms in a sequence.

- `kind`: `arithmetic`, `geometric`, `perfect-squares`, or `fibonacci`.
- `rule`: concise Portuguese description of the rule.
- `nextTerm`: the next numeric value implied by this rule.
- `parameters`: rule-specific values needed for explanation, such as common difference,
  ratio, square-root start, or Fibonacci offset.
- Invariant: every reported match validates against every submitted term; unsupported rules
  are never inferred.
- Decimal comparisons use a scale-aware tolerance of `1e-9`.

### Prediction Result

The result of analyzing one valid sequence.

- `sequence`: the validated Sequence Input.
- `matches`: all supported Pattern Match values found, in a stable display order.
- `status`: `matched` when at least one supported rule matches; otherwise `unsupported`.
- Invariant: `matched` results contain one or more matches; `unsupported` results contain
  none. A result with multiple matches does not designate a winner.

### Echo Record

A valid prediction retained for session history.

- `sequence`: submitted terms and their original display text.
- `matches`: all patterns and next terms shown to the learner.
- Lifecycle: added after a valid analysis, visible until the process exits, then discarded.
- Privacy: no learner identity, persistent storage, or teacher access.

## State Flow

```text
Raw line -> Parsed Sequence -> Prediction Result -> Display -> Session Echo Record
                  |                    |
                  +-- invalid --------+--> Portuguese error; do not record
```

A valid sequence with no recognized pattern is displayed as unsupported and is not stored as
an echo because no prediction was made. History starts empty for every process session.
