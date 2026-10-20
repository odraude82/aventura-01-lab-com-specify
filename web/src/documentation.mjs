const documentationTopics = [
  {
    slug: 'aritmetica',
    kind: 'arithmetic',
    title: 'Progressão aritmética',
    explanation: 'Em uma progressão aritmética, a diferença entre termos consecutivos é constante. A regra reconhecida soma essa diferença ao último termo.',
    example: { terms: [3, 6, 9, 12], nextTerm: 15 },
  },
  {
    slug: 'geometrica',
    kind: 'geometric',
    title: 'Progressão geométrica',
    explanation: 'Em uma progressão geométrica, cada termo é obtido multiplicando o anterior por uma razão constante. Nesta aplicação, o primeiro termo precisa ser diferente de zero.',
    example: { terms: [2, 4, 8], nextTerm: 16 },
  },
  {
    slug: 'quadrados-perfeitos',
    kind: 'perfect-squares',
    title: 'Quadrados perfeitos consecutivos',
    explanation: 'Quadrados perfeitos consecutivos são os resultados de elevar números inteiros não negativos em sequência ao quadrado.',
    example: { terms: [1, 4, 9, 16], nextTerm: 25 },
  },
  {
    slug: 'fibonacci',
    kind: 'fibonacci',
    title: 'Sequência de Fibonacci',
    explanation: 'Na sequência de Fibonacci, cada termo é a soma dos dois anteriores. A aplicação reconhece apenas trechos consecutivos da sequência iniciada por 0, 1, 1.',
    example: { terms: [1, 1, 2, 3, 5], nextTerm: 8 },
  },
  {
    slug: 'ambiguity',
    title: 'Quando há mais de um eco',
    explanation: 'Uma lista finita de termos não determina uma única continuação. As previsões exibem todas as regras reconhecidas pela aplicação, mas outras regras matemáticas também podem ajustar-se aos mesmos termos.',
    example: { terms: [2, 4] },
  },
];

export { documentationTopics };