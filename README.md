# MVP Estimator

O MVP Estimator é uma ferramenta desenvolvida para fornecer estimativas de custo e tempo para o desenvolvimento de MVPs (Minimum Viable Products), utilizando inteligência artificial para analisar os requisitos e gerar um backlog estruturado.

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
* [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
* [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) (opcional)

### 🔧 Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/mvp-estimator.git
    cd mvp-estimator
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    cd frontend && npm install && cd ..
    ```

3.  **Configuração de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:
    ```bash
    cp .env.example .env
    ```

    Edite o arquivo `.env` e configure o provedor de LLM desejado.

    #### Opções de Configuração de IA:

    **Para rodar sem consultar uma LLM real (Mock):**
    ```env
    AI_PROVIDER=mock
    ```

    **Para usar um provedor compatível com OpenAI (OpenAI, Groq, Gemini, xAI, etc):**
    ```env
    AI_PROVIDER=openai-compatible
    AI_BASE_URL=https://api.openai.com/v1
    AI_API_KEY=sua_chave
    AI_MODEL=gpt-4o-mini
    AI_INPUT_COST_PER_1M_TOKENS=0.15
    AI_OUTPUT_COST_PER_1M_TOKENS=0.60
    ```

    *Nota: Informe a `AI_BASE_URL` completa incluindo a versão (ex: `/v1`).*
    *Configure os custos por 1 milhão de tokens para que a aplicação calcule a estimativa financeira de geração de código.*

### 💻 Executando a Aplicação

#### Backend (Modo Desenvolvimento)

Para iniciar o servidor backend com hot-reload:
```bash
npm run dev
```
A API estará disponível em `http://localhost:3000`.

#### Frontend (Modo Desenvolvimento)

Em outro terminal:
```bash
cd frontend
npm run dev
```
O frontend estará disponível em `http://localhost:5173`.

#### Usando Docker

```bash
docker-compose up --build
```

### 🧪 Executando Testes

O projeto utiliza **Vitest**.

Para rodar todos os testes do backend:
```bash
npm test
```

Para rodar os testes do frontend:
```bash
cd frontend && npm test
```

### 🏗️ Scripts Disponíveis (Raiz)

*   `npm run dev`: Inicia o backend via Vite (vite-plugin-node).
*   `npm run build`: Gera o build de produção do backend.
*   `npm run start`: Inicia o backend em produção.
*   `npm test`: Executa os testes do backend.

## 🛠️ Tecnologias Utilizadas

### Backend
*   [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Vite](https://vitejs.dev/) + [vite-node](https://github.com/antfu/vite-node): Ambiente de execução e build.
*   [Zod](https://zod.dev/): Validação de esquemas e tipos.
*   [Vitest](https://vitest.dev/): Framework de testes.

### Frontend
*   [React](https://react.dev/)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Vite](https://vitejs.dev/)
*   [CSS Modules / Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)

### IA
*   Provedores compatíveis com a API da OpenAI (configurável via env).
*   `OpenAIService`: Implementação genérica para consumo de LLMs.
*   `MockAIService`: Para desenvolvimento offline e testes.

## 📚 Documentação

A documentação completa está em [`docs/`](./docs):

| Documento | Conteúdo |
|---|---|
| [`docs/PRD.md`](./docs/PRD.md) | Product Requirements Document |
| [`docs/ADR-BACKEND.md`](./docs/ADR-BACKEND.md) | Decisões de arquitetura do backend |
| [`docs/ADR-FRONTEND.md`](./docs/ADR-FRONTEND.md) | Decisões de arquitetura do frontend |
| [`docs/VIABILIDADE.md`](./docs/VIABILIDADE.md) | Análise de viabilidade técnica e papel da IA |
| [`docs/UML.md`](./docs/UML.md) | Diagramas de arquitetura (Mermaid) |
| [`docs/FLUXOGRAMA.md`](./docs/FLUXOGRAMA.md) | Fluxo de navegação e lógica do produto |

## 🤖 Papel da IA no Produto

A IA é o motor central do MVP Estimator. Ela analisa a descrição da ideia e gera:
1.  **Visão do Produto**: Resumo estratégico.
2.  **Backlog Estruturado**: Épicos e Histórias de Usuário.
3.  **Critérios de Aceitação**: Detalhamento técnico para cada história.
4.  **Estimativa de Esforço**: Pontos de complexidade (Fibonacci).
5.  **Estimativa de Tokens**: Projeção de consumo de tokens para geração de código assistida por IA.
6.  **Estimativa Financeira**: Cálculo baseado nos preços do modelo configurado.
