const assert = require('node:assert/strict');
const { test } = require('node:test');
const { createSessionHistory } = require('../src/session-history');

function makeRecord(rawText) {
  return {
    sequence: { rawText, terms: [3, 6, 9] },
    matches: [{ kind: 'arithmetic', rule: 'somar 3', nextTerm: 12 }],
  };
}

test('starts empty and preserves records in insertion order', () => {
  const history = createSessionHistory();
  assert.deepEqual(history.list(), []);

  history.add(makeRecord('3, 6, 9'));
  history.add(makeRecord('1, 4, 9'));

  assert.deepEqual(history.list().map((record) => record.sequence.rawText), ['3, 6, 9', '1, 4, 9']);
});

test('clear removes all records and a new session starts empty', () => {
  const firstSession = createSessionHistory();
  firstSession.add(makeRecord('3, 6, 9'));
  firstSession.clear();
  assert.deepEqual(firstSession.list(), []);

  const nextSession = createSessionHistory();
  assert.deepEqual(nextSession.list(), []);
});
