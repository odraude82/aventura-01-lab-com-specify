const assert = require('node:assert/strict');
const { test } = require('node:test');
const { predictSequence } = require('../web/src/prediction.mjs');

test('returns the same supported prediction as the shared recognizer', () => {
  const prediction = predictSequence('3, 6, 9, 12');

  assert.equal(prediction.status, 'matched');
  assert.deepEqual(prediction.sequence.terms, [3, 6, 9, 12]);
  assert.deepEqual(prediction.matches.map(({ kind, nextTerm }) => ({ kind, nextTerm })), [
    { kind: 'arithmetic', nextTerm: 15 },
  ]);
});

test('returns every recognized interpretation without selecting a winner', () => {
  const prediction = predictSequence('2, 4');

  assert.deepEqual(prediction.matches.map(({ kind, nextTerm }) => ({ kind, nextTerm })), [
    { kind: 'arithmetic', nextTerm: 6 },
    { kind: 'geometric', nextTerm: 8 },
  ]);
});

test('parses decimal-comma sequences with the Fase 1 grammar', () => {
  const prediction = predictSequence('1,5; 3; 4,5');

  assert.equal(prediction.sequence.delimiterStyle, 'semicolon');
  assert.deepEqual(prediction.sequence.terms, [1.5, 3, 4.5]);
  assert.equal(prediction.matches[0].nextTerm, 6);
});

test('rejects invalid input using the shared parser validation', () => {
  for (const input of ['', '1', '1, 2; 3', Array.from({ length: 101 }, (_, index) => index).join(',')]) {
    assert.throws(() => predictSequence(input), /informe|termos|misture|100/i);
  }
});

test('returns an unsupported result without inventing a forecast', () => {
  const prediction = predictSequence('2, 3, 5, 9');

  assert.equal(prediction.status, 'unsupported');
  assert.deepEqual(prediction.matches, []);
});