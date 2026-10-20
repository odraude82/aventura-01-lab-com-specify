import Chart from 'chart.js/auto';
import { buildChartData } from './chart-data.mjs';

let activeChart;
const numberFormatter = new Intl.NumberFormat('pt-BR', { maximumSignificantDigits: 12 });

function clearChart() {
  activeChart?.destroy();
  activeChart = undefined;
}

function createTable(model) {
  const wrapper = document.createElement('div');
  wrapper.className = 'chart-table-wrap';

  const table = document.createElement('table');
  table.className = 'chart-table';
  const caption = document.createElement('caption');
  caption.textContent = 'Tabela equivalente aos dados do gráfico';
  table.append(caption);

  const head = document.createElement('thead');
  const headerRow = document.createElement('tr');
  model.table.headers.forEach((label) => {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = label;
    headerRow.append(cell);
  });
  head.append(headerRow);
  table.append(head);

  const body = document.createElement('tbody');
  model.table.rows.forEach((row) => {
    const tableRow = document.createElement('tr');
    const position = document.createElement('th');
    position.scope = 'row';
    position.textContent = String(row.position);
    tableRow.append(position);

    const submitted = document.createElement('td');
    submitted.textContent = row.submittedValue === null ? 'Não informado' : numberFormatter.format(row.submittedValue);
    tableRow.append(submitted);

    row.forecastValues.forEach((value) => {
      const cell = document.createElement('td');
      cell.textContent = value === null ? 'Não se aplica' : numberFormatter.format(value);
      tableRow.append(cell);
    });
    body.append(tableRow);
  });
  table.append(body);
  wrapper.append(table);
  return wrapper;
}

function renderChart(container, prediction) {
  clearChart();
  const model = buildChartData(prediction.sequence.terms, prediction.matches);
  const section = document.createElement('section');
  section.className = 'chart-section';
  section.setAttribute('aria-labelledby', 'chart-title');

  const title = document.createElement('h3');
  title.id = 'chart-title';
  title.textContent = 'Mapa dos ecos';
  section.append(title);

  const figure = document.createElement('figure');
  figure.className = 'chart-figure';
  const canvas = document.createElement('canvas');
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Gráfico dos termos informados e das previsões por regra reconhecida. Os mesmos valores estão na tabela abaixo.');
  canvas.textContent = 'A tabela a seguir contém os mesmos valores e séries do gráfico.';
  figure.append(canvas);
  section.append(figure, createTable(model));
  container.append(section);

  activeChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: model.labels,
      datasets: model.datasets.map((dataset, index) => {
        if (index === 0) {
          return {
            label: dataset.label,
            data: dataset.data,
            borderColor: dataset.color,
            backgroundColor: dataset.color,
            pointBackgroundColor: dataset.color,
            pointBorderColor: '#f9fbf7',
            pointBorderWidth: 2,
            pointRadius: 3,
            borderWidth: 2,
            tension: 0.25,
          };
        }

        return {
          label: dataset.label,
          data: dataset.data,
          borderColor: dataset.color,
          backgroundColor: dataset.color,
          pointBackgroundColor: dataset.color,
          pointBorderColor: '#f9fbf7',
          pointBorderWidth: 2,
          pointRadius: (context) => context.dataIndex === prediction.sequence.terms.length ? 6 : 0,
          pointStyle: dataset.pointStyle,
          borderWidth: 2,
          tension: 0.25,
          segment: {
            borderColor: (context) => context.p0DataIndex === prediction.sequence.terms.length - 1
              ? dataset.color
              : 'rgba(0, 0, 0, 0)',
            borderDash: (context) => context.p0DataIndex === prediction.sequence.terms.length - 1 ? [6, 4] : [],
          },
        };
      }),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 9, padding: 18 } },
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label}: ${numberFormatter.format(context.parsed.y)}`,
          },
        },
      },
      scales: {
        x: { title: { display: true, text: 'Termo' }, grid: { color: 'rgba(23, 59, 56, 0.07)' } },
        y: { title: { display: true, text: 'Valor' }, grid: { color: 'rgba(23, 59, 56, 0.09)' } },
      },
    },
  });
}

export { clearChart, renderChart };