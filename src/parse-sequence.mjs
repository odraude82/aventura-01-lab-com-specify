const INTEGER_PATTERN = /^[+-]?\d+$/;
const SEMICOLON_TERM_PATTERN = /^[+-]?\d+(?:,\d+)?(?:[eE][+-]?\d+)?$/;

function invalidTerm(term) {
  return new Error(`Termo inválido: "${term}". Informe números separados por um único tipo de separador.`);
}

function parseSequence(rawText) {
  if (typeof rawText !== 'string') {
    throw new Error('Informe uma sequência de números em texto.');
  }

  const trimmedText = rawText.trim();
  if (!trimmedText || /^[,;\s]+$/.test(trimmedText)) {
    throw new Error('Informe pelo menos dois números para prever a sequência.');
  }

  const delimiterStyle = trimmedText.includes(';') ? 'semicolon' : 'comma';
  let tokens;
  let terms;

  if (delimiterStyle === 'semicolon') {
    if (/,[ \t]|[ \t],/.test(trimmedText)) {
      throw new Error('Não misture vírgulas separadoras com ponto e vírgula. Use vírgulas decimais sem espaços ou vírgulas entre inteiros.');
    }
    tokens = trimmedText.split(';').map((token) => token.trim());
    if (tokens.some((token) => token.length === 0)) {
      throw new Error('A sequência contém um termo vazio. Informe números separados por ponto e vírgula.');
    }
    if (tokens.length > 100) {
      throw new Error('A sequência pode conter no máximo 100 termos.');
    }
    terms = tokens.map((token) => {
      if (!SEMICOLON_TERM_PATTERN.test(token)) {
        throw invalidTerm(token);
      }
      const value = Number(token.replace(',', '.'));
      if (!Number.isFinite(value)) {
        throw new Error(`O termo "${token}" não é um número finito.`);
      }
      if (Number.isInteger(value) && !Number.isSafeInteger(value)) {
        throw new Error(`O termo "${token}" excede o intervalo de inteiros seguros.`);
      }
      return value;
    });
  } else {
    tokens = trimmedText.split(',').map((token) => token.trim());
    if (tokens.some((token) => token.length === 0)) {
      throw new Error('A sequência contém um termo vazio. Informe inteiros separados por vírgulas.');
    }
    if (tokens.length > 100) {
      throw new Error('A sequência pode conter no máximo 100 termos.');
    }
    terms = tokens.map((token) => {
      if (!INTEGER_PATTERN.test(token)) {
        throw invalidTerm(token);
      }
      const value = Number(token);
      if (!Number.isFinite(value)) {
        throw new Error(`O termo "${token}" não é um número finito.`);
      }
      if (!Number.isSafeInteger(value)) {
        throw new Error(`O termo "${token}" excede o intervalo de inteiros seguros.`);
      }
      return value;
    });
  }

  if (terms.length < 2) {
    throw new Error('Informe pelo menos dois números para prever a sequência.');
  }

  return { rawText, terms, delimiterStyle };
}

export { parseSequence };