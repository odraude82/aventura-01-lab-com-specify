const assert = require('node:assert/strict');
const { Readable, Writable } = require('node:stream');
const { test } = require('node:test');
const { startCli } = require('../src/cli');

async function runCliWithLines(lines) {
  const input = Readable.from(lines.map((line) => `${line}\n`));
  let outputText = '';
  const output = new Writable({
    write(chunk, encoding, callback) {
      outputText += chunk.toString();
      callback();
    },
  });

  await startCli({ input, output });
  return outputText;
}

test('shows the Portuguese menu and repeats it after an invalid option', async () => {
  const output = await runCliWithLines(['x', '3']);

  assert.match(output, /Sala do Eco/);
  assert.match(output, /Opção inválida/);
  assert.equal((output.match(/1 - Prever sequência/g) || []).length, 2);
});

test('exits cleanly when the learner chooses option 3', async () => {
  const output = await runCliWithLines(['3']);

  assert.match(output, /Até logo/);
});

test('closes cleanly when the input stream reaches EOF', async () => {
  const output = await runCliWithLines([]);

  assert.match(output, /Sala do Eco/);
  assert.doesNotMatch(output, /stack|Error:/i);
});

test('predicts supported sequences and explains each recognized rule', async () => {
  const cases = [
    ['3, 6, 9, 12', /somar 3/i, /15/],
    ['1, 4, 9, 16', /quadrados perfeitos/i, /25/],
    ['2, 4, 8', /multiplicar por 2/i, /16/],
    ['1, 1, 2, 3, 5', /Fibonacci/i, /8/],
    ['1,5; 3; 4,5', /somar 1,5/i, /6/],
  ];

  for (const [sequence, rule, nextTerm] of cases) {
    const output = await runCliWithLines(['1', sequence, '3']);
    assert.match(output, rule, sequence);
    assert.match(output, nextTerm, sequence);
  }
});

test('explains short and invalid sequence input without predicting', async () => {
  const shortOutput = await runCliWithLines(['1', '10', '3']);
  const invalidOutput = await runCliWithLines(['1', '10, 20, abc', '3']);

  assert.match(shortOutput, /pelo menos dois/i);
  assert.match(invalidOutput, /abc|inválid/i);
  assert.doesNotMatch(invalidOutput, /próximo termo/i);
});

test('shows every supported interpretation for ambiguous input', async () => {
  const output = await runCliWithLines(['1', '2, 4', '3']);

  assert.match(output, /somar 2/i);
  assert.match(output, /próximo termo: 6/i);
  assert.match(output, /multiplicar por 2/i);
  assert.match(output, /próximo termo: 8/i);
  assert.ok(output.indexOf('Progressão aritmética') < output.indexOf('Progressão geométrica'));
  assert.match(output, /podem existir outras continuações matematicamente possíveis/i);
});

test('does not invent a next term for unsupported input', async () => {
  const output = await runCliWithLines(['1', '2, 3, 5, 9', '3']);

  assert.match(output, /não identificamos.*padrão suportado/i);
  assert.doesNotMatch(output, /próximo termo:/i);
});

test('shows only valid predictions in ordered session history and clears it between sessions', async () => {
  const initialOutput = await runCliWithLines(['2', '3']);
  assert.match(initialOutput, /histórico.*vazio/i);

  const populatedOutput = await runCliWithLines([
    '1', '3, 6, 9, 12',
    '1', '1, 4, 9, 16',
    '1', '2, 3, 5, 9',
    '1', '1, abc',
    '2', '3',
  ]);
  const firstRecord = populatedOutput.indexOf('3, 6, 9, 12');
  const secondRecord = populatedOutput.indexOf('1, 4, 9, 16');

  assert.ok(firstRecord >= 0);
  assert.ok(secondRecord > firstRecord);
  assert.match(populatedOutput, /15/);
  assert.match(populatedOutput, /25/);
  assert.doesNotMatch(populatedOutput, /2, 3, 5, 9|1, abc/);

  const nextSessionOutput = await runCliWithLines(['2', '3']);
  assert.match(nextSessionOutput, /histórico.*vazio/i);
  assert.doesNotMatch(nextSessionOutput, /3, 6, 9, 12|1, 4, 9, 16/);
});
