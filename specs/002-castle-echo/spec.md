# Feature Specification: Castelo do Eco - Experiência Web

**Feature Branch**: `002-castle-echo`

**Created**: 2026-10-20

**Status**: Draft

**Input**: User direction: approve Phase 2 as a separate scope, including the Castelo do Eco web experience, per-sequence charts, session-only history, and a mathematical documentation site; exclude teacher access and keep history ephemeral.

## Clarifications

### Session 2026-10-20

- Q: Which Phase 2 deliverables are approved? → A: Castelo do Eco web experience, charts for each sequence, session-only history, and a mathematical documentation site; teacher access is excluded.
- Q: Should history remain session-only or persist for teacher review? → A: Keep history only in the current browser session; do not provide teacher access.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Prever uma sequência na web (Priority: P1)

O aluno abre o Castelo do Eco no navegador, informa uma sequência e recebe cada próxima previsão reconhecida com a regra correspondente.

**Why this priority**: A previsão explicada é a função central já validada na Fase 1 e é necessária para que as demais experiências tenham dados úteis.

**Independent Test**: Informar sequências aprovadas para progressão aritmética, progressão geométrica, quadrados perfeitos, Fibonacci, decimais com vírgula, ambiguidade e entrada inválida; comparar mensagens e previsões com a Fase 1.

**Acceptance Scenarios**:

1. **Given** a sequência `3, 6, 9, 12`, **When** o aluno solicita uma previsão, **Then** a página mostra `15` e explica a regra.
2. **Given** a sequência `2, 4`, **When** o aluno solicita uma previsão, **Then** a página mostra as interpretações aritmética (`6`) e geométrica (`8`) sem declarar uma continuação única.
3. **Given** uma entrada inválida ou sem padrão suportado, **When** o aluno solicita uma previsão, **Then** a página explica o problema em português e não inventa um resultado.

---

### User Story 2 - Visualizar sequências e previsões (Priority: P2)

O aluno pode comparar visualmente os termos informados e as continuações associadas às regras reconhecidas.

**Why this priority**: A visualização complementa a explicação e torna diferenças entre interpretações reconhecidas mais fáceis de observar.

**Independent Test**: Informar uma sequência suportada, verificar que cada termo enviado e cada continuação reconhecida aparece no gráfico, e confirmar que os valores também estão disponíveis em formato textual acessível.

**Acceptance Scenarios**:

1. **Given** uma sequência com uma regra reconhecida, **When** a previsão é exibida, **Then** o gráfico apresenta os termos informados e o próximo termo com eixos e rótulos compreensíveis.
2. **Given** uma sequência com várias regras reconhecidas, **When** o gráfico é exibido, **Then** cada continuação é distinguível e identificada pela respectiva regra.
3. **Given** um gráfico que não pode ser interpretado visualmente pelo aluno, **When** ele consulta a alternativa textual, **Then** os termos, previsões e regras são apresentados sem depender apenas de cor ou posição visual.

---

### User Story 3 - Revisar ecos na sessão atual (Priority: P3)

O aluno pode revisar previsões válidas anteriores enquanto permanece na mesma sessão da página.

**Why this priority**: A comparação ajuda durante a atividade, sem criar retenção de dados ou compartilhamento fora da sessão.

**Independent Test**: Fazer duas previsões válidas, consultar o histórico em ordem, e recarregar ou reabrir a página para confirmar que o histórico anterior não está disponível.

**Acceptance Scenarios**:

1. **Given** previsões válidas na sessão atual, **When** o aluno abre o histórico, **Then** cada sequência, regra e previsão é mostrada em ordem de envio.
2. **Given** o aluno recarrega ou fecha a página, **When** inicia uma nova sessão, **Then** o histórico anterior não está disponível.
3. **Given** uma entrada inválida ou sem padrão reconhecido, **When** o aluno consulta o histórico, **Then** essa entrada não aparece como previsão válida.

---

### User Story 4 - Consultar conceitos matemáticos (Priority: P4)

O aluno pode abrir uma área de documentação que explica, em português, os padrões reconhecidos e a natureza ambígua de previsões de sequências.

**Why this priority**: A documentação dá contexto às regras sem substituir a experiência interativa principal.

**Independent Test**: Abrir cada tópico documentado a partir da navegação e confirmar que as explicações correspondem às regras efetivamente reconhecidas pelo sistema.

**Acceptance Scenarios**:

1. **Given** o aluno abre a documentação, **When** seleciona um padrão suportado, **Then** encontra uma explicação e um exemplo coerentes com a previsão da aplicação.
2. **Given** uma sequência com mais de uma regra suportada, **When** consulta o tópico sobre previsões, **Then** a documentação explica que termos finitos não determinam necessariamente uma única continuação.

### Edge Cases

- Entrada vazia, com apenas um termo, acima de 100 termos, com separadores mistos ou com valores não numéricos deve mostrar erro acionável e não criar gráfico ou registro de previsão.
- Uma sequência sem regra suportada não deve gerar pontos previstos nem ser adicionada ao histórico.
- Sequência negativa, decrescente, constante ou decimal só deve gerar gráficos e previsões para regras suportadas que validem todos os termos.
- Histórico vazio deve apresentar um estado vazio claro.
- A página deve continuar utilizável por teclado e em telas estreitas; nenhuma informação de gráfico pode depender somente de cor.
- Fechar ou recarregar a página deve descartar o histórico da sessão.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST disponibilizar a experiência Castelo do Eco em uma interface web em português, preservando a aplicação de terminal da Fase 1.
- **FR-002**: O sistema MUST aceitar a mesma gramática e os mesmos limites de entrada da Sala do Eco: 2 a 100 termos, inteiros separados por vírgula ou termos separados por ponto e vírgula com vírgula decimal.
- **FR-003**: O sistema MUST reconhecer os mesmos quatro padrões aprovados na Fase 1: progressão aritmética, progressão geométrica com primeiro termo não zero, quadrados perfeitos não negativos consecutivos e termos contíguos da sequência de Fibonacci iniciada em `0, 1, 1, ...`.
- **FR-004**: O sistema MUST apresentar todas as regras suportadas reconhecidas, seus próximos termos e explicações em português, sem afirmar que a lista representa todas as continuações matemáticas possíveis.
- **FR-005**: O sistema MUST mostrar em um gráfico os termos fornecidos e os próximos termos previstos por cada regra reconhecida, identificando claramente cada série e seus eixos.
- **FR-006**: O sistema MUST disponibilizar uma alternativa textual equivalente ao gráfico, incluindo termos, regras e previsões, sem depender somente de cor, forma ou posição.
- **FR-007**: O sistema MUST manter no histórico somente previsões válidas com ao menos uma regra suportada, em ordem de envio, durante a sessão atual da página; recarga ou fechamento deve descartar todos os registros.
- **FR-008**: O sistema MUST NOT oferecer login, acesso de professores, compartilhamento de dados, armazenamento persistente, exportação ou análise longitudinal do histórico nesta fase.
- **FR-009**: O sistema MUST incluir uma área de documentação em português para os quatro padrões suportados, os limites da aplicação e o significado de ambiguidades.
- **FR-010**: O sistema MUST fornecer navegação por teclado, rótulos compreensíveis, estados de carregamento/vazio/erro e uma apresentação utilizável em telas estreitas.
- **FR-011**: A experiência web MUST poder ser distribuída como arquivos estáticos, sem serviço de aplicação, conta ou API remota.

### Key Entities *(include if feature involves data)*

- **Entrada de sequência**: Texto original, termos numéricos validados e estilo de separador usados para uma previsão.
- **Interpretação reconhecida**: Regra suportada, explicação, próximo termo e parâmetros suficientes para identificar a série no gráfico.
- **Registro de eco web**: Entrada válida e todas as interpretações exibidas, ordenadas na sessão atual da página e descartadas ao fechá-la ou recarregá-la.
- **Tópico de documentação**: Explicação em português de uma regra suportada ou do limite de unicidade das previsões.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% dos exemplos de previsão da Fase 1, a interface web mostra os mesmos próximos termos, regras e mensagens de validação.
- **SC-002**: Para sequências de até 100 termos, pelo menos 95% das previsões e gráficos são apresentados em até um segundo após o envio.
- **SC-003**: Em testes de teclado, todas as ações principais (prever, consultar histórico e abrir documentação) podem ser concluídas sem mouse.
- **SC-004**: Em 100% dos casos de entrada inválida, padrão não suportado ou ambiguidade cobertos pelos testes, a interface evita apresentar uma previsão enganosa como certeza.
- **SC-005**: Em uma verificação com pelo menos cinco alunos, pelo menos quatro conseguem inserir uma sequência, explicar uma regra exibida e localizar a alternativa textual do gráfico sem ajuda.
- **SC-006**: Em todos os testes de sessão, fechar ou recarregar a página torna indisponíveis os registros criados anteriormente.

## Assumptions

- A Fase 2 está aprovada como feature separada e não substitui nem remove o CLI da Fase 1.
- A aplicação web será client-side e distribuída como arquivos estáticos; não será criado backend, serviço remoto ou mecanismo de hospedagem nesta fase.
- O histórico vive somente na memória da página atual e não será gravado em arquivos, armazenamento do navegador ou servidor.
- Não haverá acesso docente, identidade de estudante, login ou compartilhamento entre navegadores.
- Gráficos são por sequência e mostram somente os termos submetidos e as continuações correspondentes às regras suportadas; análise histórica agregada permanece fora do escopo.
- A documentação é parte da aplicação estática e cobre apenas os padrões atualmente reconhecidos e as limitações matemáticas explicitadas.
- Os exemplos e limites matemáticos da Fase 1 permanecem a referência funcional para a Fase 2.
