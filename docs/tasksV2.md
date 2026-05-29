# Planejamento de Tarefas - V2 (Funcionalidade A: Comparativo de Cenários)

## Visão Geral
A Funcionalidade A consiste em fornecer ao usuário duas estimativas simultâneas para a mesma ideia:
1. **Cenário Lean (Time-to-Market):** Focado em validação rápida, usando ferramentas NoCode/LowCode, arquitetura monolítica simples e serviços de terceiros.
2. **Cenário Enterprise (Scalability):** Focado em robustez, usando microserviços, alta disponibilidade, segurança avançada e infraestrutura escalável.

---

## 🏗️ Tarefas por Feature Branch (Gitflow)

### 1. `feature/scenarios-backend-core`
- [x] **Definição de Tipos e Schemas:**
  - Criar enum `ScenarioType` (LEAN, ENTERPRISE).
  - Atualizar `BacklogResult` para suportar uma coleção de cenários em vez de um único backlog.
  - Atualizar `EstimateRequest` para permitir (opcionalmente) selecionar cenários.
- [x] **Lógica de Estimativa (Multiplicadores):**
  - Implementar lógica de multiplicadores de complexidade no `AICodeGenerationEstimator`.
  - Definir pesos para o cenário Enterprise (ex: 2.5x - 4.0x de esforço adicional em testes, infra e segurança).
- [x] **Refatoração do Controller:**
  - Ajustar o `EstimatesController` para lidar com a nova estrutura de resposta multi-cenário.

### 2. `feature/scenarios-ai-integration`
- [x] **Engenharia de Prompt:**
  - Atualizar o System Prompt do `OpenAIService` para solicitar explicitamente a decomposição em dois caminhos arquiteturais distintos.
  - Garantir que a saída JSON do LLM siga o novo contrato estruturado para múltiplos cenários.
- [x] **Ajuste no MockAIService:**
  - Atualizar o serviço de Mock para retornar dados estáticos de ambos os cenários, permitindo desenvolvimento frontend sem chamadas de API reais.

### 3. `feature/scenarios-frontend-ui`
- [x] **Redesign do Componente de Resultado (`EstimateResult`):**
  - Implementar visualização lado-a-lado (Comparison Cards).
  - Adicionar badges distintivos ("Rápido/Econômico" vs "Escalável/Robusto").
  - Adicionar tooltips explicativos sobre as diferenças de cada arquitetura.
- [x] **Atualização de Estado Global/Contexto:**
  - Adaptar o recebimento da API no frontend para iterar sobre a lista de cenários.

### 4. `feature/scenarios-export`
- [x] **Atualização do Utilitário de Markdown:**
  - Modificar `utils/markdown.ts` para gerar um documento formatado que contenha ambos os backlogs.
  - Adicionar uma seção de "Comparativo Resumo" no topo do Markdown exportado.

### 5. `feature/scenarios-validation`
- [x] **Testes de Integração:**
  - Atualizar `estimates.test.ts` para validar o novo schema de resposta.
  - Validar se os cálculos de horas estão aplicando corretamente os multiplicadores Enterprise.
- [x] **Testes E2E (Simulados):**
  - Validar o fluxo completo desde a submissão até a exibição de ambos os cards no frontend.

### 6. `feature/tech-docs-observability`
- [x] **TSDoc e Documentação de Código:**
  - Adicionar anotações TSDoc (`@param`, `@returns`, `@description`) em todas as interfaces de domínio (`IAIService.ts`, `types.ts`).
  - Documentar métodos core dos Controllers e Services.
- [x] **Automação OpenAPI (Swagger):**
  - Instalar e configurar `zod-to-openapi` e `swagger-ui-express`.
  - Mapear os schemas Zod atuais para definições OpenAPI.
  - Expor endpoint `/api-docs` para documentação interativa.
- [x] **Documentação de Prompts:**
  - Criar `docs/prompts/` para versionar os System Prompts e estratégias de engenharia de prompt separadamente do código.

---

## 📈 Impactos Arquiteturais
- **Payload de Resposta:** O tamanho do JSON retornado pela API aumentará (aproximadamente o dobro).
- **Custo de Token:** O consumo de tokens de saída (output) do LLM aumentará, pois ele gerará dois backlogs.
- **Latência:** Pode haver um pequeno aumento no tempo de resposta do LLM devido ao maior volume de geração de texto.

## 🛠️ Critérios de Aceitação
- O usuário deve ver claramente a diferença de custo e prazo entre Lean e Enterprise.
- A descrição da ideia é única, mas as histórias de usuário e épicos podem variar entre os cenários.
- O export em Markdown deve ser um relatório único consolidado.
