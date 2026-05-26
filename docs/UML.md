# Diagramas UML — MVP Estimator

> Diagramas gerados com auxílio de IA (Claude) a partir do código real em `src/` e `frontend/src/`. Notação Mermaid (renderizável diretamente no GitHub).

---

## 1. Diagrama de Sequência — Fluxo de geração de estimativa

```mermaid
sequenceDiagram
    actor U as Usuário
    participant F as Frontend (EstimatorPage)
    participant API as Backend (Express)
    participant V as validateRequest (Zod)
    participant C as EstimatesController
    participant Fac as AIServiceFactory
    participant S as OpenAIService
    participant LLM as LLM Provider (OpenAI/Groq/Gemini)

    U->>F: Digita descrição da ideia
    U->>F: Clica "Gerar estimativa"
    F->>API: POST /api/estimates {ideaDescription}
    API->>V: valida payload contra estimateRequestSchema
    alt payload inválido
        V-->>F: HTTP 400 VALIDATION_ERROR
        F-->>U: Exibe ErrorCallout
    else payload válido
        V->>C: req.body validado
        C->>Fac: createAIService()
        Fac-->>C: OpenAIService (cached)
        C->>S: generateBacklog(ideaDescription)
        S->>LLM: POST /chat/completions<br/>{model, temperature:0.2, response_format:json_object, messages}
        Note over S,LLM: Timeout configurado no Express (60s)
        alt LLM responde ok
            LLM-->>S: { choices: [{ message: { content: "{...}" } }] }
            S->>S: JSON.parse + backlogResultSchema.parse
            S->>S: estimateAICodeGeneration()
            S-->>C: BacklogResult
            C-->>API: sendSuccess(201, result)
            API-->>F: HTTP 201 { success:true, data:BacklogResult }
            F-->>U: Renderiza EstimateResult + botão exportar
        else LLM Erro
            LLM-->>S: Erro (429, 500, etc)
            S-->>C: AI_PROVIDER_ERROR (502)
            C-->>API: errorHandler
            API-->>F: HTTP 502
            F-->>U: ErrorCallout com detalhes
        end
    end
```

---

## 2. Diagrama de Classes — Camada de Serviços de IA

```mermaid
classDiagram
    class IAIService {
        <<interface>>
        +generateBacklog(ideaDescription, pricing) Promise~BacklogResult~
    }

    class BacklogResult {
        +vision: string
        +epics: Epic[]
        +totalComplexityPoints: number
        +estimatedHours: EstimatedHours
        +aiTokenEstimate: any
        +aiCodeGenerationEstimate: any
    }

    class MockAIService {
        +generateBacklog(idea, pricing) Promise~BacklogResult~
    }

    class OpenAIService {
        +generateBacklog(idea, pricing) Promise~BacklogResult~
        -chatCompletionsUrl() string
        -buildPrompt(idea) string
    }

    class AIServiceFactory {
        <<module>>
        +createAIService() IAIService
    }

    class EstimatesController {
        +create(req, res, next)$
    }

    IAIService <|.. MockAIService : implements
    IAIService <|.. OpenAIService : implements
    AIServiceFactory ..> IAIService : returns
    AIServiceFactory ..> MockAIService : creates
    AIServiceFactory ..> OpenAIService : creates
    EstimatesController ..> AIServiceFactory : uses
```

---

## 3. Diagrama de Componentes — Arquitetura geral

```mermaid
flowchart LR
    subgraph Browser
        SPA[Frontend SPA<br/>React + Vite]
    end

    subgraph "Container Backend (Node 18+)"
        Express[Express Server<br/>:3000]
        Routes[estimates.routes]
        MW[validateRequest<br/>errorHandler]
        Ctrl[EstimatesController]
        Fac[AIServiceFactory]
        Mock[MockAIService]
        OpenAI[OpenAIService]
    end

    subgraph "Cloud externa"
        LLM[(LLM API<br/>OpenAI/Groq/Gemini)]
    end

    SPA -- HTTP/JSON --> Express
    Express --> Routes
    Routes --> MW
    MW --> Ctrl
    Ctrl --> Fac
    Fac -- "AI_PROVIDER=mock" --> Mock
    Fac -- "AI_PROVIDER=openai-compatible" --> OpenAI
    OpenAI -- HTTPS --> LLM

    classDef external fill:#fde,stroke:#a06
    class LLM external
```
