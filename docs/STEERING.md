# Documento de Direcionamento (Steering Document): MVP Estimator

## 1. Visão e Objetivo Estratégico
O **MVP Estimator** é um arquiteto orientado por IA projetado para preencher a lacuna entre ideias abstratas de software e estruturas de projeto concretas e acionáveis. Seu objetivo principal é fornecer estimativas de tempo e custo de alta fidelidade, quantificando a "pegada de complexidade" de um produto por meio da análise baseada em tokens de seu backlog e histórias de usuário (user stories) gerados.

## 2. Princípios Arquiteturais Centrais
- **Decomposição Agêntica:** A transformação de uma visão em um produto exige raciocínio em múltiplas etapas. O sistema deve utilizar agentes especializados para:
    - **Analista Visionário:** Interpreta a entrada bruta do usuário em uma Visão de Produto.
    - **Arquiteto de Backlog:** Decompõe a visão em Epics e Features.
    - **Escritor de User Stories:** Gera histórias de usuário detalhadas, seguindo o padrão INVEST.
    - **Motor de Quantificação:** Calcula a contagem de tokens e mapeia para a complexidade de desenvolvimento.
- **Determinismo Estrutural:** Embora o conteúdo seja gerado por LLMs, a estrutura de saída (JSON/Markdown) deve ser rigorosamente aplicada para garantir previsibilidade nos processos subsequentes.
- **Rastreabilidade:** Cada estimativa deve ser rastreável até Histórias de Usuário específicas e suas respectivas contagens de tokens.

## 3. Lógica de Estimativa (Token-para-Valor)
As estimativas são derivadas do volume e da complexidade da documentação gerada:
1.  **Mapeamento de Complexidade:** Alta densidade de tokens em User Stories (ex: critérios de aceitação complexos) correlaciona-se com maior esforço de desenvolvimento.
2.  **Linha de Base de Tokens:** Estabelecer uma linha de base de tokens para uma "Feature Padrão".
3.  **Multiplicadores:** Aplicar multiplicadores baseados na complexidade da stack técnica, requisitos de integração e restrições de segurança.
4.  **Saída:** Uma faixa de horas (Mín/Máx) e o custo projetado de LLM para a geração da documentação completa do projeto.

## 4. Diretrizes Operacionais para Agentes de IA
Ao operar neste repositório, todos os agentes de IA devem aderir a:
- **Estrutura do Projeto:** Manter a integridade das pastas `/docs`, `/src` e `/tests`.
- **Padrões de Commit:** Utilizar **Conventional Commits** (ex: `feat:`, `fix:`, `docs:`, `refactor:`).
- **Idioma:** Toda a documentação e arquivos markdown gerados devem estar em **Português (PT-BR)**.
- **Atualizações Cirúrgicas:** Preferir a substituição de linhas ou blocos específicos em vez de reescrever arquivos inteiros.
- **Tom de Voz:** Profissional, nível sênior e orientado a dados.

## 5. Stack Técnica e Dependências
- **Motor:** Node.js + Express + TypeScript.
- **Modelos:** Provedores compatíveis com OpenAI API (OpenAI, Groq, Gemini, etc).
- **Orquestração:** Implementação personalizada de Strategy Pattern para serviços de IA.
- **Ambiente:** Containerização completa via Docker.

## 6. Roadmap Fase 1 (MVP)
1.  **Ingestão de Entrada:** Interface WEB (página com formulário) para descrição bruta da ideia.
2.  **Geração de Backlog:** Estrutura hierárquica de Epic/Feature/Story.
3.  **Módulo de Estimativa:** Primeira iteração do algoritmo de conversão Token-para-Hora.
4.  **Exportador:** Gerar relatório em PDF/Markdown com o escopo completo e estimativa.

---
*Versão do Documento: 1.0.0*  
*Autor: Arquiteto de Soluções IA Sênior*  
*Status: Ativo*
