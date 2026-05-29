import { useState } from 'react';
import { BacklogResult, ScenarioType, ScenarioResult } from '../domain/types';
import { ExportMarkdownButton } from './ExportMarkdownButton';

const EPIC_COLORS = [
  'epic-index-0',
  'epic-index-1',
  'epic-index-2',
  'epic-index-3',
  'epic-index-4',
];

export function EstimateResult(props: { result: BacklogResult }) {
  const { result } = props;
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);

  const activeScenario = result.scenarios[activeScenarioIdx];

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 className="sectionTitle" style={{ margin: 0 }}>2 — Comparativo de Cenários</h3>
        <ExportMarkdownButton result={result} />
      </div>

      {/* Scenarios Grid */}
      <div className="scenarios-grid">
        {result.scenarios.map((scenario, idx) => (
          <div 
            key={scenario.type} 
            className={`scenario-card \${activeScenarioIdx === idx ? 'active' : ''}`}
            onClick={() => setActiveScenarioIdx(idx)}
          >
            <div className="scenario-header">
              <span className={`scenario-badge \${scenario.type.toLowerCase()}`}>
                {scenario.type === ScenarioType.LEAN ? '⚡ Lean' : '🏛 Enterprise'}
              </span>
              <span className="scenario-tag">
                {scenario.type === ScenarioType.LEAN ? 'Rápido & Econômico' : 'Robusto & Escalável'}
              </span>
            </div>

            <div className="scenario-main-stat">
              <span className="stat-label">⏱ Esforço</span>
              <span className="stat-value">{scenario.estimatedHours.min}h - {scenario.estimatedHours.max}h</span>
            </div>

            <div className="scenario-stats-row">
              <div className="small-stat">
                <span className="stat-label">🧩 Complexidade</span>
                <span className="stat-value">{scenario.totalComplexityPoints} pts</span>
              </div>
              <div className="small-stat">
                <span className="stat-label">💰 Custo IA (Média)</span>
                <span className="stat-value">{scenario.aiCodeGenerationEstimate.display.estimatedCost}</span>
              </div>
            </div>

            <button className="btn scenario-select-btn">
              {activeScenarioIdx === idx ? 'Visualizando Detalhes' : 'Ver Detalhes'}
            </button>
          </div>
        ))}
      </div>

      <p className="muted" style={{ margin: '16px 0', fontSize: 12, textAlign: 'center' }}>
        ⚠ Selecione um cenário acima para ver o backlog detalhado e a visão do produto.
      </p>

      {/* Details Area */}
      <div className="card active-scenario-details">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 className="sectionTitle" style={{ margin: 0 }}>
            Detalhes: {activeScenario.type === ScenarioType.LEAN ? 'Cenário Lean' : 'Cenário Enterprise'}
          </h3>
          <div className="badge accent">
            Custo Funcional Est.: {activeScenario.aiCodeGenerationEstimate.display.complexityTotalCost}
          </div>
        </div>

        {/* Vision */}
        <div className="vision-block" style={{ marginBottom: 24 }}>
          {activeScenario.vision}
        </div>

        {/* AI & Tokens (Collapsed style) */}
        <div className="callout ok" style={{ fontSize: 13, marginBottom: 24 }}>
           <strong>Estratégia IA:</strong> {activeScenario.aiCodeGenerationEstimate.assumptions.workflow}
           <div className="row" style={{ marginTop: 10, gap: 12 }}>
              <span className="muted">Total: {activeScenario.aiCodeGenerationEstimate.display.totalTokens}</span>
              <span className="muted">Pricing: {activeScenario.aiCodeGenerationEstimate.display.pricing}</span>
           </div>
        </div>

        <div className="divider" />

        {/* Backlog */}
        <h3 className="sectionTitle">Backlog do Cenário</h3>

        {activeScenario.epics.map((epic, epicIdx) => (
          <div key={epic.id} className="epic">
            <div className="epic-header">
              <div className={`epic-index \${EPIC_COLORS[epicIdx % EPIC_COLORS.length]}`}>
                E{epicIdx + 1}
              </div>
              <div className="epic-title-wrap">
                <h4>{epic.title}</h4>
                <span className="epic-id">{epic.id}</span>
              </div>
            </div>
            <p className="epic-description">{epic.description}</p>

            {epic.stories.map((story) => (
              <div key={story.id} className="story">
                <div className="story-header">
                  <span className="story-title">{story.title}</span>
                  <span className="story-id">{story.id}</span>
                </div>
                <p className="story-description">{story.description}</p>

                <div className="story-tokens">
                  🧩 {story.complexityPoints} pontos
                </div>

                <div className="ac-label">Critérios de aceitação</div>
                <ul className="ac-list">
                  {story.acceptanceCriteria.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
