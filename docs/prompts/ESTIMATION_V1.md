# Estratégia de Prompting - Versão 1 (Baseline)

Este documento detalha as instruções enviadas aos modelos de linguagem (LLMs) para a geração de backlogs e estimativas técnicas.

## 1. System Prompt

O System Prompt define a personalidade e as restrições fundamentais do modelo.

**Conteúdo:**
> Você é um especialista sênior em planejamento de MVPs e arquiteto de software. Sua tarefa é analisar a ideia do usuário e retornar um planejamento técnico rigoroso em formato JSON. Siga estritamente o esquema solicitado, sem explicações adicionais.

**Estratégias Aplicadas:**
- **Atribuição de Persona:** Define autoridade e tom técnico.
- **Formato de Saída Estrito:** Força o uso de JSON para garantir integração com o backend.
- **Negative Constraint:** "sem explicações adicionais" para evitar tokens inúteis.

---

## 2. User Prompt (Template)

O prompt de usuário é construído dinamicamente a partir da ideia fornecida.

**Estrutura:**
```markdown
Gere um backlog inicial para estimar o desenvolvimento de um MVP a partir da ideia abaixo.

Ideia:
{{ideaDescription}}

Responda exclusivamente com um JSON neste formato:
{
  "vision": "string",
  "epics": [...],
  "totalComplexityPoints": number,
  "estimatedHours": { "min": number, "max": number },
  "aiTokenEstimate": { ... }
}

Regras cruciais:
- Use exclusivamente "complexityPoints" (Fibonacci: 1, 2, 3, 5, 8, 13).
- "totalComplexityPoints" deve ser a soma exata.
- "estimatedTokens" deve refletir o custo real de produzir uma feature completa (múltiplos arquivos, iterações de correção). Seja realista: 200k a 600k tokens por story.
- Use PT-BR.
- Crie de 2 a 4 épicos, 1 a 3 histórias por épico.
- Estime horas de forma dinâmica (ref: 1pt = 4 a 8 horas).
- Estime overhead global (arquitetura, CI/CD). Projetos profissionais consomem de 5 a 15 MILHÕES de tokens.
```

---

## 3. Estratégias de Engenharia de Prompt

### Zero-Shot Chain-of-Thought
Embora o formato seja JSON, as regras forçam o modelo a considerar "Tokens de Ciclo de Vida" em vez de apenas o tamanho da resposta imediata. Isso é feito através da instrução de "ser realista" quanto ao consumo de tokens em um fluxo profissional.

### Few-Shot por Exemplos de Schema
O prompt fornece um exemplo de estrutura JSON com valores de exemplo (ex: `150.000` tokens) para "ancorar" as estimativas do modelo em escalas realistas, evitando subestimativas comuns de LLMs.

### Validação Determinística Downstream
A saída do prompt é validada por schemas Zod no backend. Caso o LLM falhe em seguir o contrato (ex: inverter min/max), o código realiza correções automáticas (veja `tokenRangeSchema` em `OpenAIService.ts`).

---

## 4. Parâmetros do Modelo
- **Temperatura:** `0.2` (Prioriza precisão e consistência sobre criatividade).
- **Response Format:** `json_object` (Obrigatório em modelos OpenAI para garantir validade sintática).
