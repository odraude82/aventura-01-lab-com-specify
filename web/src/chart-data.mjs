const patternDetails = {
  arithmetic: { label: 'Progressão aritmética', color: '#be4b36', pointStyle: 'triangle' },
  geometric: { label: 'Progressão geométrica', color: '#39788a', pointStyle: 'rectRot' },
  'perfect-squares': { label: 'Quadrados perfeitos', color: '#68752f', pointStyle: 'rect' },
  fibonacci: { label: 'Sequência de Fibonacci', color: '#805f39', pointStyle: 'star' },
};

function buildChartData(terms, matches) {
  const labels = Array.from({ length: terms.length + 1 }, (_, index) => `Termo ${index + 1}`);
  const forecasts = matches.map((match) => ({
    label: patternDetails[match.kind]?.label ?? match.rule,
    color: patternDetails[match.kind]?.color ?? '#586c66',
    pointStyle: patternDetails[match.kind]?.pointStyle ?? 'circle',
    data: [...terms, match.nextTerm],
  }));
  const tableHeaders = [
    'Termo',
    'Valor informado',
    ...forecasts.map(({ label }) => `${label}: previsão`),
  ];

  return {
    labels,
    datasets: [
      {
        label: 'Termos informados',
        data: [...terms, null],
        color: '#173b38',
        pointStyle: 'circle',
      },
      ...forecasts,
    ],
    table: {
      headers: tableHeaders,
      rows: labels.map((_, index) => ({
        position: index + 1,
        submittedValue: index < terms.length ? terms[index] : null,
        forecastValues: forecasts.map((forecast) => index === terms.length ? forecast.data[index] : null),
      })),
    },
  };
}

export { buildChartData };