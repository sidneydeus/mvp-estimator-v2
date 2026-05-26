# Plano de Desenvolvimento: Backend MVP Estimator

**Objetivo:** Implementar a API backend Node.js/Express para o MVP Estimator, seguindo a arquitetura definida no `ADR-BACKEND.md`.

## Fase 1: Setup da Infraestrutura e Ambiente (Foundation)
- [x] Inicialização do projeto Node.js com TypeScript.
- [x] Configuração do Vite (`vite-node`) para o ambiente de desenvolvimento (HMR).
- [x] Configuração de Linters (ESLint) e Formatadores (Prettier).
- [x] Criação da estrutura de pastas baseada em MVC (`src/routes`, `src/controllers`, `src/services`, etc.).
- [x] Setup inicial do Express com configurações básicas (CORS, body-parser de JSON).

## Fase 2: Core Architecture, Validação & Padronização (Plumbing)
- [x] Instalação e configuração do **Zod** para validação de esquemas.
- [x] Implementação de validação de variáveis de ambiente usando Zod no momento da inicialização (Fail-fast).
- [x] Implementação do Middleware Global de Tratamento de Erros (padronizando respostas de erro e integrando erros do Zod).
- [x] Criação de helpers utilitários para padronizar respostas de Sucesso.
- [x] Implementação de um logger simples para a aplicação.

## Fase 3: Integração de Serviços Base (AI Layer)
- [x] Criação da camada de `Services` abstrata para integração com IA.
- [x] Implementação de um serviço "Mock" de IA para facilitar o desenvolvimento inicial local.
- [x] Configuração de timeouts no Express (60s) para requisições de LLM de longa duração.

## Fase 4: Implementação do Domínio (Business Logic)
- [x] **Models/DTOs:** Definir os esquemas **Zod** para o Request de Ingestão de Ideias e os tipos TypeScript inferidos.
- [x] **Middlewares:** Criar um middleware genérico de validação de Request utilizando Zod.
- [x] **Rotas & Controllers:** Criar o endpoint `POST /api/estimates` acoplando a validação Zod.
- [x] **Services:** Implementar a lógica de orquestração (receber ideia, chamar serviço IA, calcular estimativa).

## Fase 5: Containerização (Deployability)
- [x] Criação do `Dockerfile` multi-stage otimizado para produção.
- [x] Criação do `docker-compose.yaml` para ambiente de desenvolvimento local.
- [x] Validação do build e execução via Docker.

## Fase 6: Testes e Validação (Quality Assurance)
- [x] Setup do framework de testes (ex: Vitest).
- [x] Escrita de Testes Unitários para a lógica de cálculo de tokens/horas e validações do Zod.
- [x] Escrita de Testes de Integração para as rotas da API.
