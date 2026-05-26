# ADR-001 — Arquitetura Backend Node.js com Express

Status: Aceito
Data: 20 de Maio de 2026

# Contexto

O projeto **MVP Estimator** visa transformar ideias de software em backlogs estruturados com estimativas de custo e tempo baseadas em tokens via IA. Para o sucesso do MVP, é necessário um backend que permita rápida iteração, facilidade de manutenção e um ambiente de desenvolvimento idêntico ao de produção. O sistema deve ser capaz de orquestrar chamadas de IA e processar payloads estruturados de forma eficiente, sem a complexidade inicial de autenticação ou microsserviços.

# Objetivos Arquiteturais

*   **Simplicidade Operacional:** Minimizar a barreira de entrada para novos desenvolvedores.
*   **Velocidade de Entrega (TTM):** Utilizar ferramentas que acelerem o ciclo de feedback.
*   **Modularidade:** Garantir que o sistema possa crescer de forma organizada (Monólito Modular).
*   **Confiabilidade:** Padronização de respostas e erros para facilitar o consumo pelo frontend.
*   **Portabilidade:** Garantir execução consistente via containerização.

# Decisão

Adotaremos uma arquitetura baseada em **Node.js** com o framework **Express.js**. A estrutura seguirá o padrão **MVC (Model-View-Controller)** adaptado para APIs, aplicando princípios **SOLID** e **Clean Code**. O gerenciamento do ambiente de execução e build será feito via **Vite** (utilizando `vite-node` ou plugins equivalentes para backend) para garantir Hot Module Replacement (HMR) e inicialização instantânea. A infraestrutura será estritamente baseada em **Docker**.

# Estrutura Arquitetural

A aplicação será organizada como um Monólito Modular, onde as responsabilidades são separadas por camadas:

1.  **Routes:** Definição dos endpoints e roteamento.
2.  **Controllers:** Orquestração da entrada (Request), validação básica e chamada de serviços.
3.  **Services:** Contêm a lógica de negócio principal, integração com APIs de IA e cálculos de estimativa.
4.  **Models/DTOs:** Definição das estruturas de dados e contratos de interface.
5.  **Middlewares:** Tratamento transversal (erros, logs, parsing).

# Organização de Diretórios

```text
src/
├── config/             # Configurações globais e variáveis de ambiente
├── controllers/        # Controladores (entrada/saída)
├── services/           # Lógica de negócio e integrações (IA)
├── models/             # Definições de tipos e esquemas de dados
├── routes/             # Definição de rotas REST
├── middlewares/        # Middlewares (erro, validação, segurança)
├── utils/              # Funções utilitárias e helpers
├── app.ts              # Configuração do servidor Express
└── main.ts             # Ponto de entrada (Bootstrap)
```

# Estratégia de Comunicação JSON

Todas as APIs seguirão um padrão rigoroso de payload para garantir previsibilidade:

*   **Sucesso (2xx):**
    ```json
    {
      "success": true,
      "data": { ... },
      "meta": { "timestamp": "..." }
    }
    ```
*   **Erro (4xx/5xx):**
    ```json
    {
      "success": false,
      "error": {
        "code": "ERROR_CODE",
        "message": "Descrição amigável",
        "details": [ ... ]
      }
    }
    ```

# Estratégia de Containerização

O projeto contará com um `Dockerfile` multi-stage para otimizar o tamanho da imagem e um `docker-compose.yaml` para orquestrar o ambiente local, garantindo que dependências (como bancos de dados futuros) sejam facilmente acopladas.

# Justificativa Técnica

*   **Node.js & Express:** Ecossistema maduro, vasta disponibilidade de bibliotecas para IA e excelente performance para I/O intensivo (chamadas de API).
*   **MVC & SOLID:** Previnem o código espaguete, facilitando testes unitários e a substituição de componentes (ex: trocar provedor de IA).
*   **Vite:** Embora tradicional em frontend, o uso do Vite no backend via `vite-node` proporciona uma experiência de desenvolvimento superior com inicialização quase instantânea e suporte nativo a TypeScript sem a lentidão do `ts-node`.
*   **Docker:** Elimina o problema "funciona na minha máquina" e simplifica o deploy em serviços como AWS Runner ou Google Cloud Run.

# Alternativas Consideradas

## Alternativa 1: NestJS
### Motivos da rejeição
Apesar de ser robusto, o NestJS introduz uma curva de aprendizado mais íngreme e muita boilerplate (decorators, modules) que podem ser considerados *overengineering* para um MVP que não possui autenticação e tem escopo focado.

## Alternativa 2: Fastify
### Motivos da rejeição
Embora mais rápido em benchmarks sintéticos que o Express, o Express possui uma comunidade maior e middlewares mais onipresentes, o que favorece o *onboarding* rápido de desenvolvedores diversos.

# Consequências

## Positivas

*   Rápida inicialização do projeto.
*   Ambiente de desenvolvimento extremamente ágil com Vite.
*   Código testável e fácil de refatorar graças ao SOLID.
*   Facilidade de migrar para microsserviços no futuro, se necessário, devido à modularização.

## Negativas

*   O Express não impõe uma estrutura, exigindo disciplina da equipe para manter o padrão MVC.
*   O uso de Vite no backend é menos convencional que o padrão `nodemon` + `ts-node`, podendo exigir pequenos ajustes em plugins.

# Impacto Operacional

Simplicidade máxima. O deploy consiste em buildar uma imagem Docker e executá-la. Não há necessidade de gerenciar processos complexos no host.

# Impacto na Escalabilidade

A arquitetura stateless permite escalabilidade horizontal imediata (adicionar mais containers). O uso de Services isolados permite que partes lentas (processamento de IA) sejam futuramente delegadas para workers ou filas sem reescrever o core.

# Impacto na Manutenção

Alta. A separação clara entre Controllers (entrada) e Services (lógica) permite que bugs de negócio sejam isolados de problemas de transporte (HTTP).

# Impacto no Desenvolvimento

Produtividade elevada devido ao HMR do Vite e tipagem forte com TypeScript. O desenvolvedor foca na lógica, não na infraestrutura.

# Riscos

*   **Acoplamento com APIs de IA:** Mitigado pelo uso de Services e interfaces (SOLID).
*   **Timeout de LLM:** O Express precisa ser configurado para lidar com conexões de longa duração (até 60s conforme PRD).

# Recomendações Futuras

*   Implementação de um mecanismo de Cache (Redis) para evitar reprocessamento de ideias idênticas.
*   Adição de validação de esquemas com Zod ou Joi.
*   Migração para NestJS caso a complexidade de autenticação e permissões cresça exponencialmente.

# Nível de Confiança

**Alto.** A stack é provada em produção em larga escala e atende perfeitamente aos requisitos de agilidade e simplicidade do MVP Estimator.
