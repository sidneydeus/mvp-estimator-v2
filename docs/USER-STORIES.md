# User Stories — MVP Estimator

> Backlog inicial priorizado seguindo o padrão INVEST (Independent, Negotiable, Valuable, Estimable, Small, Testable).

---

## US-01 — Submeter ideia e obter backlog estimado

**Como** empreendedor ou gestor de produto,
**Quero** descrever minha ideia de software em linguagem natural,
**Para que** eu possa obter instantaneamente um backlog estruturado com estimativas de custo e tempo para o MVP.

### Critérios de Aceitação
- **CA-01.1** O formulário aceita descrição da ideia. O botão "Gerar estimativa" permanece desabilitado se o campo estiver vazio ou muito curto.
- **CA-01.2** Ao submeter, a UI exibe estado de carregamento explícito ("Gerando backlog…") até a resposta chegar.
- **CA-01.3** A resposta exibida contém: Visão de Produto + ao menos 2 épicos + ao menos 1 user story por épico + estimativa financeira.
- **CA-01.4** Se a requisição estourar o tempo limite, a UI mostra mensagem amigável sugerindo descrição menor.
- **CA-01.5** Erros do provedor LLM (4xx/5xx, JSON inválido, schema quebrado) são apresentados como mensagem de erro legível, não como stack trace.

### Mapeamento técnico
- Frontend: `frontend/src/pages/EstimatorPage.tsx`, `IdeaForm.tsx`, `EstimateResult.tsx`, `ErrorCallout.tsx`
- Backend: `POST /api/estimates` → `EstimatesController.create` → `createAIService().generateBacklog(...)`
- Validação: `estimateRequestSchema` (Zod) + `backlogResultSchema` (Zod)

---

## US-02 — Exportar o backlog gerado em Markdown

**Como** Product Owner,
**Quero** copiar o backlog gerado em formato Markdown,
**Para que** eu possa colar diretamente no Notion/Jira/Confluence sem reformatação manual.

### Critérios de Aceitação
- **CA-02.1** Botão "Exportar Markdown" aparece somente após geração bem-sucedida.
- **CA-02.2** O Markdown exportado contém: título com a Visão, seções de épicos e histórias com critérios de aceitação.
- **CA-02.3** A estimativa financeira e o resumo de tokens aparecem no topo do Markdown.
- **CA-02.4** Clicar no botão copia o conteúdo para o clipboard e mostra feedback visual ("Copiado!").
- **CA-02.5** O Markdown é válido e renderiza corretamente.

### Mapeamento técnico
- Frontend: `frontend/src/components/ExportMarkdownButton.tsx`, `frontend/src/utils/markdown.ts`

---

## US-03 — Operar sem chave de API em ambiente de desenvolvimento/testes

**Como** desenvolvedor do MVP Estimator,
**Quero** rodar a aplicação localmente e os testes automatizados sem precisar de uma chave de API real,
**Para que** eu possa desenvolver sem depender de credencial externa nem consumir cotas.

### Critérios de Aceitação
- **CA-03.1** Se `AI_PROVIDER=mock` ou `NODE_ENV=test`, o `AIServiceFactory` retorna sempre `MockAIService`.
- **CA-03.2** Se `AI_PROVIDER=openai-compatible` e `AI_API_KEY` estiver ausente, o factory cai em `MockAIService` e loga warning.
- **CA-03.3** Testes de integração passam sem variáveis de ambiente externas configuradas (usando mock).
- **CA-03.4** A resposta do `MockAIService` segue o mesmo contrato `BacklogResult` da `OpenAIService`.

### Mapeamento técnico
- Backend: `src/services/ai/AIServiceFactory.ts`, `src/services/ai/MockAIService.ts`, `src/config/env.ts`
- Testes: `tests/integration/estimates.test.ts`
