const assert = require('node:assert/strict');
const { test } = require('node:test');
const { documentationTopics } = require('../web/src/documentation.mjs');
const { recognizePatterns } = require('../src/recognize-patterns');

test('documents each supported pattern with an example recognized by the shared core', () => {
  const patternTopics = documentationTopics.filter((topic) => topic.kind);

  assert.deepEqual(patternTopics.map(({ kind }) => kind), [
    'arithmetic',
    'geometric',
    'perfect-squares',
    'fibonacci',
  ]);

  for (const topic of patternTopics) {
    const match = recognizePatterns(topic.example.terms).find(({ kind }) => kind === topic.kind);
    assert.ok(match, `${topic.title} example should match its documented rule`);
    assert.equal(match.nextTerm, topic.example.nextTerm);
    assert.ok(topic.explanation.length > 0);
  }
});

test('explains ambiguity with a sequence recognized by more than one supported rule', () => {
  const topic = documentationTopics.find(({ slug }) => slug === 'ambiguity');
  const matches = recognizePatterns(topic.example.terms);

  assert.deepEqual(matches.map(({ kind, nextTerm }) => ({ kind, nextTerm })), [
    { kind: 'arithmetic', nextTerm: 6 },
    { kind: 'geometric', nextTerm: 8 },
  ]);
  assert.match(topic.explanation, /única|continuação|regra/i);
});