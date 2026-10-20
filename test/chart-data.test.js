const assert = require('node:assert/strict');
const { test } = require('node:test');
const { buildChartData } = require('../web/src/chart-data.mjs');
const { predictSequence } = require('../web/src/prediction.mjs');

test('includes submitted terms and one clearly labeled forecast in chart series', () => {
  const prediction = predictSequence('3, 6, 9, 12');
  const chart = buildChartData(prediction.sequence.terms, prediction.matches);

  assert.deepEqual(chart.labels, ['Termo 1', 'Termo 2', 'Termo 3', 'Termo 4', 'Termo 5']);
  assert.deepEqual(chart.datasets.map(({ label }) => label), ['Termos informados', 'Progressão aritmética']);
  assert.deepEqual(chart.datasets[0].data, [3, 6, 9, 12, null]);
  assert.deepEqual(chart.datasets[1].data, [3, 6, 9, 12, 15]);
});

test('represents every ambiguous continuation and equivalent table values', () => {
  const prediction = predictSequence('2, 4');
  const chart = buildChartData(prediction.sequence.terms, prediction.matches);

  assert.deepEqual(chart.datasets.map(({ label }) => label), [
    'Termos informados',
    'Progressão aritmética',
    'Progressão geométrica',
  ]);
  assert.deepEqual(chart.table.rows, [
    { position: 1, submittedValue: 2, forecastValues: [null, null] },
    { position: 2, submittedValue: 4, forecastValues: [null, null] },
    { position: 3, submittedValue: null, forecastValues: [6, 8] },
  ]);
  assert.equal(chart.table.headers[0], 'Termo');
  assert.equal(chart.table.headers[1], 'Valor informado');
});