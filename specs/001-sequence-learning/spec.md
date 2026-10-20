# Feature Specification: Previsão de Sequências (Sala do Eco)

**Feature Branch**: `001-sequence-learning`

**Created**: 2026-10-20

**Status**: Draft

**Input**: User description: `requisitos/requisitos.md`, scoped to Fase 1 (Sala do Eco)

## Clarifications

### Session 2026-10-20

- Q: Quantos termos são necessários para prever uma sequência? → A: Dois ou mais termos; quando houver mais de uma continuação plausível, mostrar as interpretações.
- Q: Como agir quando mais de um padrão explica a sequência? → A: Exibir as interpretações e previsões plausíveis para o aluno comparar.
- Q: Como deve funcionar o histórico? → A: Manter o histórico apenas durante a sessão e apagá-lo ao sair; não compartilhar com professores.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Descobrir o próximo termo (Priority: P1)

Um aluno informa uma sequência numérica e recebe o próximo termo junto com uma explicação simples da regra reconhecida. A primeira versão atende ao uso individual na Sala do Eco.

**Why this priority**: Prever e compreender o próximo termo é o principal valor de aprendizagem do produto.

**Independent Test**: Submeter sequências de padrões conhecidos e comparar resposta e explicação com exemplos aprovados pelos professores.

**Acceptance Scenarios**:

1. **Given** a sequência `3, 6, 9, 12`, **When** o aluno solicita a previsão, **Then** o sistema apresenta `15` e explica que os termos avançam de três em três.
2. **Given** a sequência `1, 4, 9, 16`, **When** o aluno solicita a previsão, **Then** o sistema apresenta `25` e explica o padrão de quadrados perfeitos.
3. **Given** uma sequência com menos de dois termos, **When** o aluno solicita a previsão, **Then** o sistema informa que são necessários pelo menos dois números.
4. **Given** a sequência decimal `1,5; 3; 4,5`, **When** o aluno solicita a previsão, **Then** o sistema apresenta `6`.
5. **Given** a entrada inválida `10, 20, abc`, **When** o aluno solicita a previsão, **Then** o sistema identifica o termo inválido e não apresenta uma previsão.

---

### User Story 2 - Entender padrões possíveis (Priority: P2)

Quando mais de uma regra conhecida puder explicar os termos informados, o aluno recebe uma resposta que não apresenta uma única previsão como certeza sem justificar essa escolha.

**Why this priority**: Reconhecer a ambiguidade é necessário para manter a confiança e apoiar a discussão matemática em sala.

**Independent Test**: Submeter sequências com mais de uma interpretação plausível e verificar que o sistema apresenta as interpretações reconhecidas e suas previsões, sem declarar uma delas como única.

**Acceptance Scenarios**:

1. **Given** a sequência `2, 4`, **When** o aluno pede uma previsão, **Then** o sistema apresenta, no mínimo, `6` pela regra de somar dois e `8` pela regra de multiplicar por dois, identificando cada regra.
2. **Given** uma sequência que não corresponde aos padrões reconhecidos, **When** o aluno pede uma previsão, **Then** o sistema informa que não identificou um padrão suportado e não inventa um próximo termo.

---

### User Story 3 - Revisar tentativas anteriores (Priority: P3)

O aluno pode consultar ecos anteriores para comparar sequências e respostas durante a atividade.

**Why this priority**: A comparação ajuda o aluno a acompanhar suas tentativas, mas depende de decisões de retenção e acesso que não são necessárias para a previsão principal.

**Independent Test**: Fazer previsões na mesma sessão e verificar que elas aparecem no histórico; encerrar e iniciar outra sessão e verificar que o histórico anterior não está disponível.

**Acceptance Scenarios**:

1. **Given** que o aluno fez previsões na sessão atual, **When** consulta o histórico, **Then** cada registro mostra a sequência enviada, as previsões e regras apresentadas.
2. **Given** que existem registros na sessão atual, **When** o aluno encerra a sessão e inicia outra, **Then** o histórico anterior não está disponível.

### Edge Cases

- Entrada vazia ou composta apenas por separadores: explicar que é necessário informar números.
- Entrada contendo texto não numérico, como `10, 20, abc`: identificar a entrada inválida e não produzir previsão.
- Decimais com vírgula, conforme `1,5; 3; 4,5`: interpretar separadores de forma compatível com o exemplo ou explicar a forma aceita.
- Termos repetidos, valores negativos, sequência crescente, decrescente ou constante: apresentar resultado somente quando um padrão suportado e uma resposta válida forem identificados.
- Sequências muito longas: manter uma resposta perceptivelmente rápida até o limite acordado de entrada.
- Histórico vazio no início de uma sessão: apresentar estado vazio sem erro.
- Uma sequência com mais de um padrão reconhecido: listar as previsões associadas a cada padrão reconhecido, sem sugerir que a lista contém todas as continuações matematicamente possíveis.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST permitir que o aluno informe uma sequência de números na interação da Sala do Eco.
- **FR-002**: O sistema MUST reconhecer e prever o próximo termo para os padrões aprovados de progressão aritmética, progressão geométrica, quadrados perfeitos e Fibonacci.
- **FR-003**: Para uma previsão reconhecida, o sistema MUST apresentar o próximo termo e uma explicação compreensível da regra identificada.
- **FR-004**: O sistema MUST aceitar sequências com dois ou mais termos e MUST informar que são necessários pelo menos dois números quando a entrada tiver menos de dois termos.
- **FR-005**: Quando identificar mais de um padrão suportado para uma sequência, o sistema MUST apresentar cada interpretação reconhecida, a previsão correspondente e a regra usada, sem afirmar que uma delas é a única continuação possível.
- **FR-006**: Para uma entrada inválida ou sem padrão suportado, o sistema MUST explicar o problema em português e indicar como corrigi-lo ou que não há previsão disponível.
- **FR-007**: O sistema MUST permitir que o aluno envie várias sequências e consulte os respectivos registros durante a sessão atual.
- **FR-008**: O sistema MUST manter registros somente durante a sessão atual, MUST torná-los indisponíveis ao encerramento da sessão e MUST NOT compartilhá-los com professores.
- **FR-009**: O sistema MUST aceitar decimais com vírgula quando separados por ponto e vírgula, conforme o exemplo `1,5; 3; 4,5`, e MUST tratar entradas que não possam ser interpretadas sem ambiguidade como inválidas.
- **FR-010**: A experiência desta fase MUST ficar limitada à Sala do Eco, sem interface web, gráficos, análise de histórico ou site de documentação.

### Key Entities *(include if feature involves data)*

- **Sequência informada**: Os termos numéricos enviados pelo aluno e a forma de entrada necessária para interpretá-los.
- **Previsão**: O próximo termo proposto, o padrão reconhecido e a explicação apresentada ao aluno.
- **Registro de eco**: A associação entre uma sequência informada e as previsões e regras apresentadas, disponível somente durante a sessão em que foi criada.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% dos exemplos de referência aprovados para padrões suportados e não ambíguos, os alunos recebem o próximo termo esperado e uma explicação compatível com o padrão.
- **SC-002**: Para entradas de até 100 termos, pelo menos 95% das previsões são apresentadas em até um segundo após o envio.
- **SC-003**: Em uma avaliação com pelo menos 10 alunos, pelo menos 9 conseguem enviar uma sequência e explicar, com suas próprias palavras, a regra exibida sem ajuda do professor.
- **SC-004**: Em 100% dos casos de entrada inválida, padrão não suportado ou ambiguidade previstos nos testes de aceitação, o aluno recebe uma mensagem que não apresenta um resultado enganoso como certeza.

## Assumptions

- Esta especificação cobre somente a Fase 1 da Sala do Eco; a constituição do projeto não autoriza incluir a versão web nesta fase.
- O público principal é o aluno em uso individual; não há conta, hospedagem ou acesso compartilhado aprovados para esta fase.
- Os padrões iniciais cobertos são progressões aritméticas, progressões geométricas, quadrados perfeitos e Fibonacci, conforme exemplos e requisitos explícitos. Outros padrões são informados como não suportados até aprovação.
- O exemplo decimal `1,5; 3; 4,5` define o uso de ponto e vírgula para separar valores com vírgula decimal.
- Sequências com menos de dois termos não são suficientes; duas ou mais interpretações reconhecidas são mostradas para comparação.
- O histórico é temporário, individual e limitado à sessão atual; encerra-se com a saída do aluno e não é acessível a professores.
- O limite de 100 termos e a meta de resposta em até um segundo são critérios iniciais de desempenho, sujeitos à confirmação de stakeholders.
