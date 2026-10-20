<!--
Sync Impact Report
Version change: unversioned scaffold -> 1.0.0 (initial constitution)
Modified principles: none; initial principles established below
Added sections: Project Constraints; Development Workflow
Removed sections: none
Follow-up TODOs: Confirm the original ratification date.
-->
# Echo Chamber (Sala do Eco) Constitution

## Core Principles

### I. Mathematical Honesty and Learning
Every prediction MUST be supported by an identified mathematical rule. When the supplied
terms do not determine a unique continuation, the system MUST disclose the ambiguity rather
than claim certainty. Explanations MUST help learners understand the rule, not merely reveal
an answer.

### II. Student Privacy by Default
The system MUST collect and retain only data needed for an explicitly approved learning
purpose. Access to student-submitted sequences, retention periods, and deletion MUST be
defined before any shared storage or teacher access is implemented. No authentication or
hosting model may be assumed from the current requirements alone.

### III. Explicit Scope and Decisions
Work MUST stay within the phase and requirements explicitly approved for implementation.
Items marked as under analysis, unresolved, or conflicting MUST be clarified and recorded
before they become acceptance criteria. A request to impress or move quickly does not
override agreed scope or quality gates.

### IV. Tested, Reliable Behavior
Core sequence rules MUST have automated tests for approved examples, invalid input, boundary
conditions, and ambiguous patterns. Changes MUST pass relevant tests before acceptance;
user-visible errors MUST be clear and MUST NOT be reported as successful predictions.

### V. Accessible and Understandable Interaction
User-facing language MUST be Portuguese unless another language is explicitly approved.
Every delivered interface MUST support keyboard operation, expose understandable labels and
errors, and be checked for accessibility. The interaction MUST make the submitted sequence
and resulting prediction understandable to the learner.

## Project Constraints

The approved baseline is JavaScript on Node.js, with `index.js` as the main file. Changing
the stack or entry point requires an explicit decision from the project stakeholders. The
console application is the initial phase; web, hosting, persistence, and documentation-site
work MUST NOT be treated as approved for that phase unless the scope is formally revised.
Performance requirements MUST be expressed as measurable acceptance criteria before they
are used as a delivery gate.

## Development Workflow

Each change MUST have agreed acceptance criteria and a review of its impact on learning
correctness, student data, and the approved scope. Reviewers MUST verify relevant automated
tests and document unresolved risks or decisions. Any addition of shared data access,
hosting, or a new interface requires its security, privacy, and operational expectations to
be reviewed before implementation.

## Governance

This constitution governs project decisions and takes precedence over conflicting local
practices. Amendments MUST be documented with their rationale and approved by the designated
project stakeholders before adoption. Each review and delivery MUST check compliance with
these principles; exceptions MUST be recorded with an owner and rationale.

Constitution versions follow semantic versioning: MAJOR for incompatible changes to
principles or governance, MINOR for new or materially expanded principles or sections, and
PATCH for clarifications that do not change obligations. The ratification date records the
original adoption and MUST NOT be reset by later amendments; the last-amended date changes
whenever an amendment is adopted.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): confirm original adoption date | **Last Amended**: 2026-10-20
