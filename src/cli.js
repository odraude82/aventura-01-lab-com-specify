const { createInterface } = require('node:readline/promises');
const { parseSequence } = require('./parse-sequence');
const { recognizePatterns } = require('./recognize-patterns');
const { createSessionHistory } = require('./session-history');

const PATTERN_LABELS = {
  arithmetic: 'Progressão aritmética',
  geometric: 'Progressão geométrica',
  'perfect-squares': 'Quadrados perfeitos',
  fibonacci: 'Sequência de Fibonacci',
};

function menuPrompt() {
  return '\nSala do Eco\n1 - Prever sequência\n2 - Ver histórico da sessão\n3 - Sair\nEscolha uma opção: ';
}

function formatNumber(value) {
  return new Intl.NumberFormat('pt-BR', {
    useGrouping: false,
    maximumSignificantDigits: 12,
  }).format(value);
}

function createLineQueue(readline) {
  const lines = [];
  const waiters = [];
  let closed = false;

  readline.on('line', (line) => {
    const resolve = waiters.shift();
    if (resolve) {
      resolve(line);
    } else {
      lines.push(line);
    }
  });

  readline.once('close', () => {
    closed = true;
    while (waiters.length > 0) {
      waiters.shift()(null);
    }
  });

  return function nextLine() {
    if (lines.length > 0) {
      return Promise.resolve(lines.shift());
    }
    if (closed) {
      return Promise.resolve(null);
    }
    return new Promise((resolve) => waiters.push(resolve));
  };
}

async function startCli({ input = process.stdin, output = process.stdout } = {}) {
  const history = createSessionHistory();
  const readline = createInterface({
    input,
    terminal: false,
    historySize: 0,
  });
  const nextLine = createLineQueue(readline);

  try {
    while (true) {
      output.write(menuPrompt());
      const response = await nextLine();
      if (response === null) {
        break;
      }
      const choice = response.trim();

      if (choice === '3') {
        output.write('Até logo!\n');
        break;
      }
      if (choice === '1') {
        output.write('Informe a sequência: ');
        const rawText = await nextLine();
        if (rawText === null) {
          return;
        }
        try {
          const sequence = parseSequence(rawText);
          const matches = recognizePatterns(sequence.terms);
          if (matches.length === 0) {
            output.write('Não identificamos um padrão suportado para essa sequência. Nenhuma previsão foi apresentada.\n');
          } else {
            history.add({ sequence, matches });
            for (const match of matches) {
              output.write(`${PATTERN_LABELS[match.kind]}: ${match.rule}; próximo termo: ${formatNumber(match.nextTerm)}\n`);
            }
            output.write('Podem existir outras continuações matematicamente possíveis, além das interpretações suportadas acima.\n');
          }
        } catch (error) {
          output.write(`${error.message}\n`);
        }
        continue;
      }
      if (choice === '2') {
        const records = history.list();
        if (records.length === 0) {
          output.write('O histórico da sessão está vazio.\n');
        } else {
          output.write('Histórico da sessão:\n');
          records.forEach((record, index) => {
            output.write(`${index + 1}. Sequência: ${record.sequence.rawText}\n`);
            for (const match of record.matches) {
              output.write(`   ${PATTERN_LABELS[match.kind]}: ${match.rule}; próximo termo: ${formatNumber(match.nextTerm)}\n`);
            }
          });
        }
        continue;
      }
      output.write('Opção inválida. Escolha 1, 2 ou 3.\n');
    }
  } finally {
    history.clear();
    readline.close();
  }
}

module.exports = { startCli };
