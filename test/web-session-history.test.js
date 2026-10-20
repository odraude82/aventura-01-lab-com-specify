const assert = require('node:assert/strict');
const { test } = require('node:test');
const { createSessionHistory } = require('../web/src/session-history.mjs');
const { predictSequence } = require('../web/src/prediction.mjs');

test('stores only matched predictions in insertion order', () => {
  const history = createSessionHistory();
  history.add(predictSequence('3, 6, 9'));
  history.add(predictSequence('2, 4'));
  history.add(predictSequence('2, 3, 5, 9'));

  assert.deepEqual(history.list().map(({ sequence }) => sequence.rawText), ['3, 6, 9', '2, 4']);
  assert.deepEqual(history.list()[1].matches.map(({ nextTerm }) => nextTerm), [6, 8]);
});

test('starts empty and clears all records for a new page session', () => {
  const history = createSessionHistory();
  assert.deepEqual(history.list(), []);

  history.add(predictSequence('1, 4, 9'));
  history.clear();

  assert.deepEqual(history.list(), []);
  assert.deepEqual(createSessionHistory().list(), []);
});