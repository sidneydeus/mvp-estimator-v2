# Documento de Viabilidade Técnica: MVP Estimator

## 1. Problema Identificado

Empreendedores, Product Owners e desenvolvedores freelancers enfrentam dificuldade recorrente em transformar uma **ideia vaga de software** em um plano executável com estimativa de custo e tempo defensável. O processo tradicional envolve:

- Várias sessões de discovery e refinamento de backlog (dias a semanas).
- Conhecimento prévio em engenharia de software para quebrar a ideia em épicos/stories.
- Esforço manual para correlacionar complexidade percebida com horas de desenvolvimento.

Resultado: muitos MVPs morrem antes da validação porque o ciclo "ideia → orçamento" é caro e lento.

## 2. Papel da IA no Produto

A IA é o **núcleo funcional do produto**, não um auxílio de desenvolvimento. Sem o LLM, o produto deixa de existir.

Fluxo concreto na aplicação:

1. Usuário envia descrição via `POST /api/v1/estimates` (ou frontend SPA).
2. `EstimatesController` resolve a implementação de `IAIService` pelo `AIServiceFactory` (OpenAIService ou Mock em testes).
3. `OpenAIService` chama a URL configurada em `AI_BASE_URL` (ex: Groq, OpenAI, Gemini) com um system prompt que força o contrato `BacklogResult`.
4. A resposta JSON é validada com Zod (`backlogResultSchema`).
5. O sistema calcula a estimativa financeira de geração de código baseada nos tokens retornados e nos preços configurados no `.env` ou enviados na request.
6. Frontend exibe Visão + Épicos + Stories + Estimativa e permite exportar em Markdown.

**Sem IA não há produto.** A IA não está apenas auxiliando o cálculo — ela é responsável por interpretar a ideia bruta, projetar a arquitetura de produto (épicos/stories) e atribuir a complexidade relativa.

## 3. Justificativa Técnica das Escolhas

| Decisão | Justificativa |
|---|---|
| **OpenAI-Compatible API** | Permite trocar entre Groq, OpenAI, Gemini, xAI ou Ollama apenas mudando a `AI_BASE_URL` e `AI_MODEL`. |
| Saída forçada em **JSON** | Determinismo estrutural — o pipeline downstream depende do contrato `BacklogResult`. |
| **Validação com Zod** no parser | LLMs podem entregar JSON sintaticamente válido mas estruturalmente inconsistente. Zod garante a integridade dos dados. |
| `temperature: 0.2` | Backlogs precisam ser consistentes, não criativos. Baixa temperatura reduz alucinação estrutural. |
| Interface `IAIService` (Strategy Pattern) | Permite trocar provedor (Mock ↔ OpenAI-compatible) sem tocar em controller ou domínio. |
| **Timeout 60s** | Conforme PRD, garante que requisições lentas de IA sejam tratadas. |
| **Backend stateless** (sem DB no MVP) | Reduz superfície, custo operacional e tempo de entrega. |
| **Estimativa baseada em tokens** | Projeção realista do custo de desenvolvimento assistido por IA. |

## 4. Análise Custo / Benefício

O MVP Estimator suporta múltiplos provedores via configuração de ambiente:

- **Mock**: R$ 0. Ideal para desenvolvimento e testes offline.
- **Groq**: Alta velocidade e free tier generoso.
- **OpenAI (GPT-4o-mini)**: Baixo custo e alta qualidade.
- **Gemini (Google)**: Gratuito em certos tiers e compatível com a API OpenAI.

## 5. Limitações Conhecidas (com causa)

### Limitações do modelo LLM
- **Alucinação no conteúdo das stories.** Causa: o LLM gera texto plausível mas pode inventar requisitos.
- **JSON malformado ocasional.** Causa: modelos menores podem quebrar o contrato. *Mitigação:* tratamento de erros de parsing e validação de schema.
- **Estimativa de tokens subjetiva.** Causa: a IA estima quantos tokens ela mesma usaria para gerar o código.

## 6. Escopo Implementado vs. Proposta Futura

### ✅ Implementado nesta entrega
- API REST em Node.js + TypeScript + Express
- Endpoint `POST /api/v1/estimates` com validação Zod (`EstimateRequest`)
- Interface `IAIService` com implementações: `MockAIService` (testes) e `OpenAIService` (produção)
- Factory `AIServiceFactory` com seleção automática por env
- Cálculo de estimativa financeira baseado em tokens e pricing configurado
- Frontend SPA em React + Vite consumindo a API
- Containerização via Docker Compose
- Documentação completa atualizada
- Testes automatizados (unit + integration)

### 🔜 Fora do escopo desta entrega (Backlog Futuro)
- Persistência (PostgreSQL/SQLite) para histórico de estimativas
- Autenticação e gestão de usuários
- Cache de respostas LLM por hash da descrição
- Exportação em PDF além de Markdown
- Suporte a múltiplos provedores cloud com fallback (OpenAI/Anthropic/Gemini/Ollama)
- Rate limiting e métricas de observabilidade
- Refinamento iterativo do backlog (chat-loop com a IA)
- Integração com Jira/Trello/Linear

## 7. Próximos Passos Concretos

1. **Curto prazo (1 semana):** Adicionar cache em memória keyed por hash SHA-256 da descrição, expirando em 24h.
2. **Médio prazo (2–4 semanas):** Persistência em SQLite + endpoint `GET /estimates` para histórico anônimo.
3. **Médio prazo (1 mês):** Autenticação básica (JWT) e endpoint de listagem por usuário.
4. **Longo prazo:** Adicionar etapa de refinamento iterativo — usuário aprova/rejeita stories e o LLM ajusta o backlog.

---
*Versão: 1.1.0*
*Status: Atualizado para suporte a múltiplos provedores de IA*
