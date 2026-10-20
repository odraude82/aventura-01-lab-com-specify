const assert = require('node:assert/strict');
const { performance } = require('node:perf_hooks');
const { test } = require('node:test');
const { parseSequence } = require('../src/parse-sequence');
const { recognizePatterns } = require('../src/recognize-patterns');

test('parses and predicts 100-term sequences with p95 below one second', () => {
  const input = Array.from({ length: 100 }, (_, index) => index).join(',');
  const durations = [];

  for (let run = 0; run < 200; run += 1) {
    const startedAt = performance.now();
    const sequence = parseSequence(input);
    const matches = recognizePatterns(sequence.terms);
    durations.push(performance.now() - startedAt);
    assert.ok(matches.some((match) => match.kind === 'arithmetic'));
  }

  durations.sort((left, right) => left - right);
  const p95 = durations[Math.ceil(durations.length * 0.95) - 1];
  assert.ok(p95 < 1000, `Expected p95 < 1000ms, received ${p95}ms`);
});
