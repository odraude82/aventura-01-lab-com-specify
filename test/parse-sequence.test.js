const assert = require('node:assert/strict');
const { test } = require('node:test');
const { parseSequence } = require('../src/parse-sequence');

test('parses comma-separated integers and surrounding whitespace', () => {
  const sequence = parseSequence('  -3, 0, 3  ');

  assert.deepEqual(sequence.terms, [-3, 0, 3]);
  assert.equal(sequence.delimiterStyle, 'comma');
  assert.equal(sequence.rawText, '  -3, 0, 3  ');
});

test('parses semicolon-separated terms with comma decimals', () => {
  const sequence = parseSequence('1,5; 3; 4,5');

  assert.deepEqual(sequence.terms, [1.5, 3, 4.5]);
  assert.equal(sequence.delimiterStyle, 'semicolon');
});

test('accepts the minimum and maximum sequence lengths', () => {
  assert.equal(parseSequence('1, 2').terms.length, 2);
  assert.equal(parseSequence(Array.from({ length: 100 }, (_, index) => index).join(',')).terms.length, 100);
});

test('rejects empty, separator-only, and too-short input', () => {
  for (const input of ['', ' , ; ', '1']) {
    assert.throws(() => parseSequence(input), /informe|termos|números/i);
  }
});

test('rejects too many terms', () => {
  const input = Array.from({ length: 101 }, (_, index) => index).join(',');

  assert.throws(() => parseSequence(input), /100/);
});

test('rejects empty and non-numeric terms', () => {
  for (const input of ['1,,2', '1; ;2', '1, abc', '1e309; 2']) {
    assert.throws(() => parseSequence(input), /inválid|vazio|número|finito/i);
  }
});

test('rejects mixed delimiter styles and unsafe integer values', () => {
  assert.throws(() => parseSequence('1, 2; 3'), /separador|mistur/i);
  assert.throws(() => parseSequence('9007199254740992, 9007199254740992'), /seguro|precis/i);
});
