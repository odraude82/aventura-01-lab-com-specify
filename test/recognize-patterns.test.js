const assert = require('node:assert/strict');
const { test } = require('node:test');
const { recognizePatterns } = require('../src/recognize-patterns');

function findMatch(terms, kind) {
  return recognizePatterns(terms).find((match) => match.kind === kind);
}

test('recognizes arithmetic progressions and explains the common difference', () => {
  const match = findMatch([3, 6, 9, 12], 'arithmetic');

  assert.ok(match);
  assert.equal(match.nextTerm, 15);
  assert.match(match.rule, /somar 3/i);
  assert.equal(match.parameters.difference, 3);
});

test('recognizes geometric progressions with a nonzero first term', () => {
  const match = findMatch([2, 4, 8], 'geometric');

  assert.ok(match);
  assert.equal(match.nextTerm, 16);
  assert.match(match.rule, /multiplicar por 2/i);
  assert.equal(findMatch([0, 0, 0], 'geometric'), undefined);
});

test('recognizes consecutive nonnegative perfect squares', () => {
  const match = findMatch([1, 4, 9, 16], 'perfect-squares');

  assert.ok(match);
  assert.equal(match.nextTerm, 25);
  assert.match(match.rule, /quadrados perfeitos/i);
});

test('recognizes contiguous terms of the standard Fibonacci sequence', () => {
  const match = findMatch([1, 1, 2, 3, 5], 'fibonacci');

  assert.ok(match);
  assert.equal(match.nextTerm, 8);
  assert.match(match.rule, /Fibonacci/i);
});

test('returns no matches for unsupported patterns', () => {
  assert.deepEqual(recognizePatterns([2, 3, 5, 9]), []);
});

test('uses a scale-aware decimal comparison tolerance of 1e-9', () => {
  const match = findMatch([0.1, 0.2, 0.3000000001], 'arithmetic');

  assert.ok(match);
  assert.ok(Math.abs(match.nextTerm - 0.4000000001) < 1e-12);
});
