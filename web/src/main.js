import '@fontsource/fraunces/500.css';
import '@fontsource/fraunces/600.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import './styles.css';
import { predictSequence } from './prediction.mjs';
import { clearChart, renderChart } from './chart-view.mjs';
import { createSessionHistory } from './session-history.mjs';
import { documentationTopics } from './documentation.mjs';

const app = document.querySelector('#app');
const sessionHistory = createSessionHistory();

app.innerHTML = `
  <div class="site-shell">
    <header class="site-header">
      <a class="brand" href="#inicio" aria-label="Castelo do Eco, início">
        <span class="brand-mark" aria-hidden="true">CE</span>
        <span>Castelo do Eco</span>
      </a>
      <nav class="primary-nav" aria-label="Navegação principal">
        <a href="#prediction-view" data-view="prediction-view" aria-current="page">Previsão</a>
        <a href="#history-view" data-view="history-view">Histórico</a>
        <a href="#documentation-view" data-view="documentation-view">Matemática</a>
      </nav>
      <p class="header-note"><span class="signal-dot" aria-hidden="true"></span>Exploração matemática</p>
    </header>

    <main id="inicio" tabindex="-1">
      <section id="prediction-view" class="app-view" aria-labelledby="page-title" tabindex="-1">
        <section class="intro">
        <p class="eyebrow">Sala do eco <span>·</span> 01</p>
        <h1 id="page-title">Castelo do Eco</h1>
        <p class="intro-copy">Uma sequência abre caminhos. Descubra quais regras reconhecidas podem continuar o percurso.</p>
        </section>

      <section class="workspace" id="previsao" aria-labelledby="form-title">
        <div class="workspace-heading">
          <div>
            <p class="eyebrow">Ponto de partida</p>
            <h2 id="form-title">Que eco você encontra?</h2>
          </div>
          <span class="term-limit">2 a 100 termos</span>
        </div>

        <form id="prediction-form" class="prediction-form">
          <label for="sequence-input">Sua sequência</label>
          <textarea id="sequence-input" name="sequence" rows="2" placeholder="3, 6, 9, 12" required aria-describedby="sequence-hint"></textarea>
          <div class="form-footer">
            <p id="sequence-hint" class="field-hint">Use vírgulas entre inteiros ou ponto e vírgula entre decimais com vírgula.</p>
            <button class="primary-button" type="submit"><span aria-hidden="true">↗</span> Prever eco</button>
          </div>
        </form>
      </section>

      <section id="prediction-result" class="result-area" aria-live="polite" aria-atomic="true" aria-labelledby="result-title">
        <div class="empty-result">
          <span class="empty-mark" aria-hidden="true">↳</span>
          <div>
            <h2 id="result-title">A próxima pista começa aqui</h2>
            <p>Informe uma sequência para comparar as regras reconhecidas.</p>
          </div>
        </div>
      </section>
      </section>

      <section id="history-view" class="app-view secondary-view" aria-labelledby="history-title" tabindex="-1" hidden>
        <p class="eyebrow">Memória desta página</p>
        <h1 id="history-title">Ecos da sessão</h1>
        <p class="intro-copy">Previsões reconhecidas nesta sessão, na ordem em que foram enviadas.</p>
        <div id="history-list" class="history-list" aria-live="polite"></div>
      </section>

      <section id="documentation-view" class="app-view secondary-view" aria-labelledby="documentation-title" tabindex="-1" hidden>
        <p class="eyebrow">Caderno de padrões</p>
        <h1 id="documentation-title">Matemática</h1>
        <p class="intro-copy">Consulte regras e limites das previsões.</p>
        <div id="documentation-content"></div>
      </section>
    </main>

    <footer class="site-footer">
      <p>Sequências finitas podem admitir mais de uma continuação.</p>
      <span>Castelo do Eco <span aria-hidden="true">/</span> Laboratório de padrões</span>
    </footer>
  </div>
`;

const form = document.querySelector('#prediction-form');
const resultArea = document.querySelector('#prediction-result');
const historyList = document.querySelector('#history-list');
const documentationContent = document.querySelector('#documentation-content');
const numberFormatter = new Intl.NumberFormat('pt-BR', { maximumSignificantDigits: 12 });
const navigationLinks = [...document.querySelectorAll('[data-view]')];
const patternLabels = {
  arithmetic: 'Progressão aritmética',
  geometric: 'Progressão geométrica',
  'perfect-squares': 'Quadrados perfeitos',
  fibonacci: 'Sequência de Fibonacci',
};

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function renderHistory() {
  historyList.replaceChildren();
  const records = sessionHistory.list();

  if (records.length === 0) {
    historyList.append(createElement('p', 'history-empty', 'Nenhuma previsão reconhecida nesta sessão.'));
    return;
  }

  const list = createElement('ol', 'history-entries');
  records.forEach((record) => {
    const item = createElement('li', 'history-entry');
    item.append(
      createElement('p', 'history-sequence', record.sequence.rawText),
      createElement('p', 'history-terms', record.matches.map((match) => `${patternLabels[match.kind]}: ${numberFormatter.format(match.nextTerm)}`).join(' · ')),
    );
    list.append(item);
  });
  historyList.append(list);
}

function renderDocumentation() {
  documentationContent.replaceChildren();
  const topicNavigation = createElement('nav', 'topic-navigation');
  topicNavigation.setAttribute('aria-label', 'Tópicos matemáticos');

  documentationTopics.forEach((topic) => {
    const link = createElement('a', '', topic.title);
    link.href = `#topic-${topic.slug}`;
    topicNavigation.append(link);
  });
  documentationContent.append(topicNavigation);

  documentationTopics.forEach((topic) => {
    const article = createElement('article', 'documentation-topic');
    article.id = `topic-${topic.slug}`;
    article.append(createElement('h2', '', topic.title));
    article.append(createElement('p', 'topic-explanation', topic.explanation));

    const prediction = predictSequence(topic.example.terms.join(', '));
    const example = createElement('p', 'topic-example');
    example.append(createElement('strong', '', 'Exemplo: '), document.createTextNode(topic.example.terms.map((term) => numberFormatter.format(term)).join(', ')));
    if (topic.kind) {
      const match = prediction.matches.find((entry) => entry.kind === topic.kind);
      example.append(document.createTextNode(` → ${numberFormatter.format(match.nextTerm)}`));
    } else {
      const interpretations = prediction.matches.map((match) => `${patternLabels[match.kind]}: ${numberFormatter.format(match.nextTerm)}`).join(' · ');
      example.append(document.createTextNode(` → ${interpretations}`));
    }
    article.append(example);
    documentationContent.append(article);
  });
}

function showView(viewId) {
  document.querySelectorAll('.app-view').forEach((view) => {
    view.hidden = view.id !== viewId;
  });
  navigationLinks.forEach((link) => {
    if (link.dataset.view === viewId) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.getElementById(viewId).focus({ preventScroll: true });
  if (viewId === 'history-view') renderHistory();
  if (viewId === 'documentation-view' && documentationContent.childElementCount === 0) renderDocumentation();
}

navigationLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showView(link.dataset.view);
    window.history.replaceState(null, '', link.getAttribute('href'));
  });
});

function renderPrediction(prediction) {
  clearChart();
  resultArea.replaceChildren();
  if (prediction.status === 'matched') {
    sessionHistory.add(prediction);
    renderHistory();
  }

  const heading = createElement('div', 'result-heading');
  heading.append(
    createElement('p', 'eyebrow', 'Leitura da sequência'),
    createElement('h2', '', prediction.status === 'matched' ? 'Ecos encontrados' : 'Ainda não há um eco reconhecido'),
  );
  resultArea.append(heading);

  if (prediction.status === 'unsupported') {
    resultArea.append(createElement('p', 'notice notice-neutral', 'Nenhuma das regras disponíveis corresponde a todos os termos. Não há uma previsão para esta sequência.'));
    return;
  }

  const list = createElement('ol', 'interpretation-list');
  prediction.matches.forEach((match, index) => {
    const item = createElement('li', 'interpretation');
    item.style.setProperty('--item-index', index);
    item.append(
      createElement('p', 'interpretation-label', patternLabels[match.kind]),
      createElement('p', 'interpretation-rule', match.rule),
    );
    const forecast = createElement('p', 'forecast');
    forecast.append(createElement('span', '', 'Próximo termo'), createElement('strong', '', numberFormatter.format(match.nextTerm)));
    item.append(forecast);
    list.append(item);
  });
  resultArea.append(list);
  renderChart(resultArea, prediction);

  if (prediction.matches.length > 1) {
    resultArea.append(createElement('p', 'notice notice-amber', 'Mais de uma regra reconhecida combina com esses termos. Uma sequência finita não determina, por si só, uma única continuação.'));
  } else {
    resultArea.append(createElement('p', 'notice notice-neutral', 'Esta é uma continuação segundo a regra exibida; outras regras matemáticas também podem ajustar-se aos mesmos termos.'));
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const rawText = new FormData(form).get('sequence');

  try {
    renderPrediction(predictSequence(rawText));
  } catch (error) {
    clearChart();
    resultArea.replaceChildren();
    const message = createElement('p', 'notice notice-error', error.message);
    message.setAttribute('role', 'alert');
    resultArea.append(message);
  }
});

renderHistory();
const initialView = navigationLinks.some((link) => link.dataset.view === window.location.hash.slice(1))
  ? window.location.hash.slice(1)
  : 'prediction-view';
showView(initialView);