const COMPARISON_TOLERANCE = 1e-9;

function approximatelyEqual(left, right) {
  const scale = Math.max(1, Math.abs(left), Math.abs(right));
  return Math.abs(left - right) <= COMPARISON_TOLERANCE * scale;
}

function formatNumber(value) {
  return new Intl.NumberFormat('pt-BR', {
    useGrouping: false,
    maximumSignificantDigits: 12,
  }).format(value);
}

function recognizeArithmetic(terms) {
  const difference = terms[1] - terms[0];
  if (!Number.isFinite(difference)) {
    return null;
  }
  for (let index = 2; index < terms.length; index += 1) {
    if (!approximatelyEqual(terms[index] - terms[index - 1], difference)) {
      return null;
    }
  }
  const nextTerm = terms.at(-1) + difference;
  if (!Number.isFinite(nextTerm)) {
    return null;
  }
  return {
    kind: 'arithmetic',
    rule: `somar ${formatNumber(difference)}`,
    nextTerm,
    parameters: { difference },
  };
}

function recognizeGeometric(terms) {
  if (terms[0] === 0) {
    return null;
  }
  const ratio = terms[1] / terms[0];
  if (!Number.isFinite(ratio)) {
    return null;
  }
  for (let index = 1; index < terms.length; index += 1) {
    const expected = terms[0] * ratio ** index;
    if (!Number.isFinite(expected) || !approximatelyEqual(terms[index], expected)) {
      return null;
    }
  }
  const nextTerm = terms.at(-1) * ratio;
  if (!Number.isFinite(nextTerm)) {
    return null;
  }
  return {
    kind: 'geometric',
    rule: `multiplicar por ${formatNumber(ratio)}`,
    nextTerm,
    parameters: { ratio },
  };
}

function recognizePerfectSquares(terms) {
  if (terms.some((term) => term < 0)) {
    return null;
  }
  const startRoot = Math.round(Math.sqrt(terms[0]));
  for (let index = 0; index < terms.length; index += 1) {
    const root = startRoot + index;
    if (!approximatelyEqual(terms[index], root ** 2)) {
      return null;
    }
  }
  const nextRoot = startRoot + terms.length;
  return {
    kind: 'perfect-squares',
    rule: 'quadrados perfeitos consecutivos',
    nextTerm: nextRoot ** 2,
    parameters: { startRoot },
  };
}

function recognizeFibonacci(terms) {
  if (terms.some((term) => !Number.isSafeInteger(term) || term < 0)) {
    return null;
  }
  const fibonacci = [0, 1];
  while (fibonacci.length < 100) {
    const nextTerm = fibonacci.at(-1) + fibonacci.at(-2);
    if (!Number.isSafeInteger(nextTerm)) {
      break;
    }
    fibonacci.push(nextTerm);
  }

  for (let offset = 0; offset + terms.length < fibonacci.length; offset += 1) {
    const matches = terms.every((term, index) => term === fibonacci[offset + index]);
    if (matches) {
      return {
        kind: 'fibonacci',
        rule: 'termos consecutivos da sequência de Fibonacci',
        nextTerm: fibonacci[offset + terms.length],
        parameters: { offset },
      };
    }
  }
  return null;
}

function recognizePatterns(terms) {
  if (!Array.isArray(terms) || terms.length < 2 || terms.some((term) => !Number.isFinite(term))) {
    return [];
  }

  return [
    recognizeArithmetic(terms),
    recognizeGeometric(terms),
    recognizePerfectSquares(terms),
    recognizeFibonacci(terms),
  ].filter(Boolean);
}

export { recognizePatterns };