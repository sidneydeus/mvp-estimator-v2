PROMPTS
1.Como um Arquiteto de Soluções IA Sênior, gere um arquivo steering.md em /docs para
o projeto MVP Estimator.

Contexto:
O sistema transforma ideias de software descritas pelo usuário em projeto estruturado
de forma que seja possível ao final ter uma estimativa de tempo e custos baseado na
quantidade de tokens necessários de acordo com o 'backlog' e 'user stories' gerados.

Definição:
A documentação e arquivos markdown gerados devem estar em PT-BR
A versão é controlada por git usando conventional commits.

=================================================================================================

2.Como um especialista sênior em planejamento de MVPs web, gere um arquivo PRD.md em /docs para
o projeto MVP Estimator considerando /docs/steering.md

Seu objetivo é transformar ideias vagas em PRDs claros, implementáveis e economicamente viáveis.

O PRD deve servir como base para:

- arquitetura do sistema
- geração de backlog
- estimativa de custos
- definição de MVP
- planejamento de desenvolvimento

Priorize:

- simplicidade
- rapidez de validação
- menor custo operacional
- escopo reduzido
- implementação incremental

Evite:

- overengineering
- arquitetura enterprise
- features desnecessárias
- escalabilidade prematura

O PRD deve:

- definir apenas o MVP inicial
- remover funcionalidades não essenciais
- separar backlog futuro

Preferências técnicas:

- monólito modular
- REST APIs

Evitar:

- Microsserviços
- Kubernetes
- mensageria distribuída
- priorizar funcionalidades core

Toda funcionalidade deve:

- ser implementável
- ser objetiva
- possuir propósito claro
- evitar ambiguidades
- possuir prioridade definida

Utilize:

- Markdown
- títulos hierárquicos
- tabelas
- listas organizadas
- linguagem técnica objetiva

validar coerência entre:

- objetivos
- funcionalidades
- arquitetura
- integrações
- complexidade

Antes de finalizar o PRD, valide:

- funcionalidades redundantes
- inconsistências
- escopo excessivo
- integrações desnecessárias
- conflitos arquiteturais

=================================================================================================

Você é um arquiteto sênior de software especializado em arquitetura backend para MVPs web, Node.js e documentação arquitetural baseada em ADR (Architecture Decision Record).

Sua tarefa é gerar um ADR técnico e profissional para definir a arquitetura backend de um sistema web considerando o docs/PRD.md

Salvar em doc/ADR-BACKEND.md

A decisão arquitetural deve definir:

Backend:
- Node.js
- Express.js

Arquitetura:
- padrão MVC
- princípios SOLID
- Clean Code
- separação clara de responsabilidades
- modularização por domínio

Infraestrutura:
- execução obrigatória via Docker
- ambiente containerizado
- facilidade de deploy local e produção

Comunicação:
- APIs REST
- payloads JSON estruturados
- padronização de respostas
- padronização de erros
- estrutura consistente de requests/responses

Ferramentas:
- Vite para gerenciamento do ambiente e pacotes
- npm como gerenciador padrão
- configuração simples e de rápida inicialização

Restrições importantes:
- o sistema NÃO possui autenticação inicialmente
- evitar overengineering
- evitar microsserviços
- evitar arquitetura enterprise
- evitar abstrações desnecessárias
- priorizar simplicidade operacional
- priorizar facilidade de manutenção
- priorizar onboarding rápido de desenvolvedores

O ADR deve justificar tecnicamente:
- escolha do Node.js
- escolha do Express
- adoção do padrão MVC
- adoção de SOLID
- adoção de Clean Code
- uso de Docker
- uso de APIs REST com JSON estruturado
- escolha do Vite
- impactos em produtividade
- impactos em manutenção
- impactos em escalabilidade futura
- impactos em testes e debugging

O documento deve também:
- comparar alternativas rejeitadas
- explicar trade-offs
- analisar consequências positivas e negativas
- analisar riscos arquiteturais
- considerar contexto de MVP

Estruture o ADR EXATAMENTE nas seguintes seções:

# ADR-XXX — Arquitetura Backend Node.js com Express

Status:
Data:

# Contexto

# Objetivos Arquiteturais

# Decisão

# Estrutura Arquitetural

# Organização de Diretórios

# Estratégia de Comunicação JSON

# Estratégia de Containerização

# Justificativa Técnica

# Alternativas Consideradas

## Alternativa 1
### Motivos da rejeição

## Alternativa 2
### Motivos da rejeição

# Consequências

## Positivas

## Negativas

# Impacto Operacional

# Impacto na Escalabilidade

# Impacto na Manutenção

# Impacto no Desenvolvimento

# Riscos

# Recomendações Futuras

# Nível de Confiança

Regras obrigatórias:
- utilizar Markdown
- linguagem técnica objetiva
- evitar textos genéricos
- justificar cada decisão arquitetural
- evitar buzzwords desnecessárias
- considerar contexto de MVP
- considerar simplicidade operacional
- considerar maturidade do ecossistema Node.js
- considerar facilidade de evolução futura

O documento deve parecer um ADR profissional utilizado em um projeto real de engenharia de software.


=================================================================================================

Faça um ADR-FRONTEND.md, incluindo:
- Desenvolvimento do frontend dessa aplicação, 
- Utilizando Reactpara consumir a API do backend em node

=================================================================================================

Crie um diretório chamado frontend e desenvolva conforme o ADR-FRONTEND.MD

=================================================================================================

5. Integração real com LLM (Groq) — branch feature/aiagent

Implemente um serviço GroqAIService que cumpra a interface IAIService já existente no projeto,
chamando https://api.groq.com/openai/v1/chat/completions com response_format JSON e um system
prompt que force a saída no contrato BacklogResult (vision, epics[].stories[].acceptanceCriteria,
complexityTokens). Inclua:
- temperature: 0.2
- modelo configurável via env GROQ_MODEL (default openai/gpt-oss-20b)
- timeout de 55s com AbortController
- tratamento de erros distinto para AbortError (504), SyntaxError (502 GROQ_INVALID_JSON),
  ZodError (502 GROQ_INVALID_SCHEMA) e erro HTTP do provedor
- validação da resposta com Zod (groqBacklogSchema)
- normalização para BacklogResult com cálculo determinístico:
    min = max(8, totalTokens / 55)
    max = max(min + 2, totalTokens / 32)

Adicione também um aiServiceFactory que retorne MockAIService em NODE_ENV=test,
GroqAIService quando GROQ_API_KEY estiver configurada, e MockAIService com warning
em desenvolvimento sem key. Em produção sem key, lance erro AI_PROVIDER_NOT_CONFIGURED (503).

=================================================================================================

6. Geração de USER-STORIES.md — Grupo 3 Avançado, padrão INVEST

Como Product Owner sênior, gere docs/USER-STORIES.md para o MVP Estimator com EXATAMENTE
3 user stories no padrão INVEST (Independent, Negotiable, Valuable, Estimable, Small, Testable).

Use o estado real do código:
- Backend: POST /api/v1/estimates → EstimatesController → aiServiceFactory → GroqAIService/MockAIService
- Frontend: EstimatorPage, IdeaForm, EstimateResult, ExportMarkdownButton em React+Vite
- Validação Zod no request e na resposta do LLM
- Cálculo determinístico de horas: min/max a partir de totalTokens

Cada story deve conter:
- Cabeçalho "Como <persona>, Quero <ação>, Para que <valor>"
- 4 a 6 critérios de aceitação numerados (CA-XX.Y)
- Mapeamento técnico (arquivos/módulos envolvidos)
- Estimativa de complexidade em tokens

Prioridades: P0 (submissão e backlog), P1 (exportar markdown), P0 (operar sem key em dev/test).

Saída em PT-BR.

=================================================================================================

7. Geração de UML.md — Grupo 3 Avançado

Como arquiteto de software, gere docs/UML.md com 3 diagramas UML em notação Mermaid:

1) Diagrama de SEQUÊNCIA do fluxo de POST /api/v1/estimates, incluindo:
   - Atores: Usuário, Frontend (EstimatorPage), Backend Express, validateRequest, EstimatesController,
     aiServiceFactory, GroqAIService, Groq Cloud API
   - Caminho feliz + caminhos de erro (payload inválido 400, timeout 504, JSON inválido 502,
     schema quebrado 502)
   - Anote AbortController timeout=55s

2) Diagrama de CLASSES da camada de serviços de IA, mostrando:
   - Interface IAIService com generateBacklog
   - Tipos BacklogResult, Epic, UserStory, EstimatedHours
   - Implementações MockAIService e GroqAIService
   - Módulo aiServiceFactory
   - Relação com EstimatesController
   - Use notação <<interface>> e relações 'implements', 'uses', 'creates', 'produces'

3) Diagrama de COMPONENTES de deploy, mostrando:
   - Browser (Frontend SPA React+Vite)
   - Container Backend (Express, rotas, middlewares, controller, factory, services)
   - Cloud externa (Groq API)
   - Roteamento condicional do factory (NODE_ENV=test → Mock, key → Groq)

Nomes de classes/métodos devem corresponder 1:1 ao código em src/services/ai/ e src/controllers/.
Saída em PT-BR, renderizável no GitHub.

=================================================================================================

8. Geração de FLUXOGRAMA.md — requisito obrigatório PDF item 4

Gere docs/FLUXOGRAMA.md em Mermaid (flowchart TD) cobrindo o caminho completo do produto:
1. Entrada do usuário no formulário (com regra de min 10 chars)
2. Validação Zod do request → erro 400 ou continua
3. Resolução do factory (test → Mock, key presente → Groq, sem key em dev → Mock+warn,
   sem key em prod → erro 503)
4. Chamada ao LLM com timeout de 55s
5. Caminhos de erro: timeout (504), JSON inválido (502 GROQ_INVALID_JSON),
   schema quebrado (502 GROQ_INVALID_SCHEMA)
6. Normalização e cálculo de horas
7. Renderização no frontend + ação de exportar Markdown

Use classDef para colorir nós:
- Vermelho (errorNode): caminhos de erro com HTTP code
- Verde (successNode): resposta 201 e renderização
- Roxo (llmNode): interação com o LLM

Inclua legenda e seção "Pontos-chave" listando: validação em duas camadas,
determinismo do cálculo, failover para Mock, timeout 55s.

=================================================================================================

9. Geração de VIABILIDADE.md — critério obrigatório PDF item 10 + Grupo 3 critério 6

Gere docs/VIABILIDADE.md com a seguinte estrutura:
1. Problema identificado (com porquê o processo tradicional falha)
2. Papel da IA no produto (justificando que sem LLM não há produto)
3. Justificativa técnica das escolhas (tabela: decisão | justificativa) cobrindo:
   Groq cloud, resposta JSON forçada, Zod, temperature 0.2, Strategy Pattern, timeout,
   stateless, estimativa por tokens
4. Análise custo/benefício comparando Groq, OpenAI, Anthropic e Ollama local
5. Limitações conhecidas COM CAUSA explicitada para cada uma:
   - LLM: alucinação, JSON malformado, raciocínio limitado de modelos 20B
   - Arquitetural: sem persistência, sem auth, sem rate limiting, sem cache,
     estimador calibrado empiricamente
6. Escopo implementado vs. proposta futura (checklist real do que está no código)
7. Próximos passos concretos com horizonte temporal (curto/médio/longo prazo)

Saída em PT-BR, tom técnico, evitar buzzwords. Justifique cada limitação com a causa raiz.
