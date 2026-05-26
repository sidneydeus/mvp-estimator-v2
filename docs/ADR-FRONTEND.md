# ADR-002 — Arquitetura Frontend React (SPA) para consumo da API

Status: Aceito  
Data: 20 de Maio de 2026

# Contexto

O **MVP Estimator** tem como objetivo transformar uma descrição textual de uma ideia de software em um **backlog estruturado (Épicos e User Stories)** e uma **estimativa de esforço/custo** baseada em tokens. O backend já expõe uma API REST (`/api/estimates`) e um endpoint de saúde (`/health`). O MVP requer uma interface web simples para ingestão, visualização de resultados e exportação em Markdown.

O frontend deve ser rápido de desenvolver, barato de operar e fácil de manter, evitando overengineering e mantendo o escopo focado em validar o fluxo ponta a ponta (entrada → geração → exibição → exportação).

# Objetivos Arquiteturais

- **Entrega rápida do MVP:** maximizar velocidade de iteração e feedback.
- **Simplicidade operacional:** build estático e deploy simples (CDN/Static hosting), sem SSR no MVP.
- **Boa UX em fluxo único:** formulário, loading/timeout, exibição clara e exportação.
- **Confiabilidade de integração:** contratos consistentes com a API (sucesso/erro) e tipagem.
- **Manutenibilidade:** separação mínima e clara de responsabilidades, sem abstrações desnecessárias.

# Decisão

Adotaremos um frontend **SPA em React + TypeScript**, desenvolvido com **Vite**, para consumir a API REST do backend Node/Express.

O frontend será responsável por:
- Coletar a descrição da ideia (RF01).
- Chamar `POST /api/estimates` e tratar respostas de sucesso/erro/timeout (RF02/RF03).
- Renderizar backlog e estimativa em tela (RF04).
- Gerar/exportar Markdown localmente no client (RF05), sem depender de armazenamento ou autenticação.

# Estrutura Arquitetural

O frontend seguirá um desenho simples por “fatias” (feature-first), com componentes reutilizáveis apenas quando fizer sentido:

1. **Pages (fluxo principal):** tela única `EstimatorPage`.
2. **API client:** camada fina para chamadas HTTP com timeout e parsing do contrato `{ success, data, error }`.
3. **Domain types:** tipos TypeScript que refletem o payload do backend (BacklogResult, Epic, UserStory).
4. **UI components:** componentes de formulário, resultado, erro e exportação.
5. **State local:** estado em `useState`/`useReducer` para o fluxo do formulário; sem gerenciador global no MVP.

# Organização de Diretórios

Estrutura sugerida (dentro do monorepo atual):

```text
src/
├── web/                       # App React (isolado do backend)
│   ├── index.html
│   ├── vite.config.ts
│   ├── src/
│   │   ├── main.tsx
│   │   ├── app/App.tsx
│   │   ├── pages/EstimatorPage.tsx
│   │   ├── api/http.ts         # fetch wrapper + timeout
│   │   ├── api/estimates.ts    # POST /api/estimates
│   │   ├── domain/types.ts     # contratos de dados
│   │   ├── components/
│   │   │   ├── IdeaForm.tsx
│   │   │   ├── EstimateResult.tsx
│   │   │   ├── ExportMarkdownButton.tsx
│   │   │   └── ErrorCallout.tsx
│   │   └── utils/markdown.ts   # geração de markdown
│   └── tests/                  # testes unitários de UI e utils
└── (backend existente)
```

Observação: a pasta `src/web` mantém o frontend isolado do backend sem forçar um segundo repositório, e permite evoluir para build/deploy separados no futuro.

# Estratégia de Comunicação com o Backend

## Contratos

O frontend consumirá o padrão de payload do backend:

- **Sucesso (2xx):** `{ success: true, data, meta }`
- **Erro (4xx/5xx):** `{ success: false, error: { code, message, details? } }`

O frontend deve:
- Exibir `error.message` de forma amigável.
- Quando houver `details`, renderizar lista resumida (ex.: erros de validação).
- Tratar explicitamente `408 TIMEOUT` (limite de 60s) e orientar o usuário a tentar novamente com descrição menor.

## Base URL e CORS

No desenvolvimento, o frontend usará proxy do Vite ou variável de ambiente para apontar para a API (`http://localhost:3000`). Em produção, a recomendação é servir frontend e backend no mesmo domínio (ou configurar CORS corretamente).

# Estratégia de Exportação Markdown

A exportação para Markdown será feita no client para reduzir carga e complexidade no backend:
- Gerar Markdown a partir do `BacklogResult` retornado.
- Permitir “Copiar” para clipboard e/ou “Baixar .md”.
- Garantir que o Markdown seja determinístico e reflita o backlog exibido (rastreabilidade básica).

# Estratégia de UI/UX (MVP)

- **Página única:** formulário no topo, resultados abaixo.
- **Estados explícitos:** idle → loading → success/error.
- **Limites e validação:** reforçar limite de caracteres (ex.: 2000) antes do submit para evitar custo/timeout.
- **Feedback de latência:** spinner + texto (“Gerando backlog… pode levar até 60s”).
- **Aviso de estimativa:** banner informando que valores são aproximados (mitigação de risco do PRD).

# Ferramentas e Bibliotecas

- **Build/dev server:** Vite (rápido, HMR).
- **UI:** React + TypeScript.
- **HTTP:** `fetch` nativo com wrapper (sem Axios no MVP).
- **Testes:** Vitest + Testing Library (apenas onde houver lógica de transformação/markdown e fluxo crítico).
- **Formatação/Lint:** reutilizar ESLint/Prettier existentes no repo quando aplicável.

# Alternativas Consideradas

## Alternativa 1: Vue (SPA)
### Motivos da rejeição
É viável e compatível com o PRD, mas React foi escolhido por maior familiaridade/equipe e abundância de componentes e exemplos. Para o MVP, a diferença prática não compensa a troca.

## Alternativa 2: Next.js (SSR/Fullstack)
### Motivos da rejeição
Adiciona complexidade operacional (SSR, rotas, build e deploy mais opinativos) e não é necessária para o MVP, que pode ser entregue como build estático consumindo API REST.

# Consequências

## Positivas

- Setup rápido e baixo atrito (Vite + React).
- Deploy simples (arquivos estáticos) e barato.
- Menos pontos de falha (sem SSR, sem autenticação, sem persistência no client).
- Facilidade de evoluir para múltiplas páginas e componentes, mantendo o escopo do MVP.

## Negativas

- SPA depende do backend para o núcleo do valor (sem offline).
- SEO não é prioridade e não será atendido no MVP.
- Sem estado global/opiniões fortes, disciplina é necessária para evitar acoplamento excessivo em componentes.

# Impacto Operacional

Baixo. O frontend pode ser servido via:
- CDN/Static hosting (recomendado), apontando para a API.
- Ou em container junto do backend (opção de simplicidade no início), mantendo separação lógica de artefatos.

# Impacto na Escalabilidade

Alto potencial. Um build estático escala bem por padrão. Evoluções futuras podem incluir:
- Cache de respostas e/ou persistência local (LocalStorage) para histórico.
- SSR ou pré-renderização apenas quando houver necessidade real (SEO/performance inicial).

# Impacto na Manutenção

Moderado a alto (positivo). A tipagem do contrato e a camada fina de API reduzem quebras silenciosas. A simplicidade do fluxo único favorece refatorações rápidas.

# Impacto no Desenvolvimento

Produtividade alta devido a HMR e componentização. O ciclo de feedback é curto e alinhado ao objetivo do MVP: validar rapidamente a utilidade das estimativas.

# Riscos

- **Divergência de contratos backend/frontend:** mitigar com types compartilhados ou schemas alinhados (futuro).
- **Timeout/latência do LLM:** mitigar com UX clara (loading, retries) e limites de input.
- **CORS e ambientes:** mitigar com proxy no dev e configuração clara de base URL.

# Recomendações Futuras

- Compartilhar contratos via pacote interno (`shared/`) com types/schemas para evitar drift.
- Adicionar pagina de histórico (quando houver persistência).
- Instrumentar métricas de conversão (submit → success) e latência percebida.
- Evoluir exportação para PDF somente após validar valor do Markdown.

# Nível de Confiança

**Alto.** A solução é padrão de mercado para MVPs, minimiza complexidade e atende diretamente aos requisitos de UI do PRD consumindo a API do backend.

