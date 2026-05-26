# Product Requirements Document (PRD): MVP Estimator

## 1. Visão Geral

O **MVP Estimator** é uma ferramenta web para transformar descrições de ideias de software em projetos estruturados (backlog/user stories) com estimativas de custo e tempo baseadas em tokens. O foco é a rapidez de validação e o baixo custo operacional.

## 2. Objetivos do MVP

- Validar a precisão da estimativa baseada em tokens.
- Prover uma interface simples para entrada de ideias.
- Gerar um backlog estruturado exportável em Markdown.
- Reduzir o tempo de planejamento de um MVP de dias para minutos.

## 3. Personas

- **Empreendedores/Founders:** Precisam validar a viabilidade financeira de uma ideia.
- **Product Owners/Managers:** Precisam de um rascunho rápido de backlog para refinamento.
- **Desenvolvedores Freelancers:** Precisam orçar projetos com base em requisitos iniciais.

## 4. Funcionalidades do MVP (Escopo Reduzido)

| ID | Funcionalidade | Descrição | Prioridade |
|:---|:---|:---|:---|
| RF01 | Formulário de Ingestão | Campo de texto simples para descrição da ideia de software. | P0 (Crítico) |
| RF02 | Geração de Backlog | Agente de IA que decompõe a ideia em Épicos e User Stories. | P0 (Crítico) |
| RF03 | Estimador de Tokens | Cálculo de custo/tempo baseado no volume de tokens das stories. | P0 (Crítico) |
| RF04 | Visualização de Resultados | Exibição do backlog e da estimativa (Mín/Máx) na tela. | P1 (Alta) |
| RF05 | Exportação Markdown | Botão para copiar/baixar o backlog gerado em formato .md. | P1 (Alta) |

## 5. Arquitetura Proposta (Simplicidade & Baixo Custo)

- **Modelo:** Monólito Modular (Single Deployment Unit).
- **Backend:** Node.js (Express ou Fastify) - REST APIs.
- **Frontend:** SPA simples (React ou Vue) consumindo a API.
- **IA:** Integração via SDK oficial (OpenAI/Google/Anthropic) - sem infra própria de modelos.
- **Banco de Dados:** SQLite ou PostgreSQL simples para persistência básica (opcional para o MVP inicial se for stateless).

## 6. Fluxo do Usuário (User Flow)

1. Usuário acessa a página única.
2. Preenche o formulário com a descrição da ideia.
3. Clica em "Gerar Estimativa".
4. O sistema processa via Agentes de IA (Node.js).
5. O sistema exibe o Backlog + Estimativa de Horas/Custos.
6. Usuário exporta o Markdown.

## 7. Critérios de Aceitação

- O backlog gerado deve conter pelo menos 3 Épicos para ideias medianas.
- A estimativa deve ser apresentada em uma faixa (Ex: 80h - 120h).
- O tempo de resposta total não deve exceder 60 segundos (limite de timeout de LLM).

## 8. Fora do Escopo (Backlog Futuro)

- Gestão de usuários e autenticação (Login).
- Histórico de projetos salvos em conta.
- Integração direta com Jira/Trello.
- Edição colaborativa de histórias em tempo real.
- Suporte a múltiplos idiomas na interface (Core será PT-BR).

## 9. Riscos e Mitigações

- **Risco:** Alucinação da IA na estimativa. **Mitigação:** Adicionar avisos de que os valores são aproximados e baseados em densidade de documentação.
- **Risco:** Custo de API elevado. **Mitigação:** Implementar limites de caracteres no formulário de entrada.

---
*Versão: 1.0.0*  
*Status: Aguardando Implementação*
