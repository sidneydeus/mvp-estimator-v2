import { useState } from 'react';
import { ScenarioType, ScenarioResult } from '../domain/types';
import { ExportMarkdownButton } from './ExportMarkdownButton';

const EPIC_COLORS = [
  'epic-index-0',
  'epic-index-1',
  'epic-index-2',
  'epic-index-3',
  'epic-index-4',
];

export function EstimateResult(props: { result: any }) {
  const { result } = props;
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [showRaw, setShowRaw] = useState(false);

  console.log('DEBUG: Prop result recebida:', result);

  // Normalização robusta dos dados
  let scenarios: ScenarioResult[] = [];

  if (result?.scenarios && Array.isArray(result.scenarios)) {
    scenarios = result.scenarios;
  } else if (result?.epics && Array.isArray(result.epics)) {
    console.warn('AVISO: Formato legado detectado. Convertendo.');
    scenarios = [{
      type: ScenarioType.LEAN,
      vision: result.vision || 'Visão não disponível',
      epics: result.epics,
      totalComplexityPoints: result.totalComplexityPoints || 0,
      estimatedHours: result.estimatedHours || { min: 0, max: 0 },
      aiTokenEstimate: result.aiTokenEstimate,
      aiCodeGenerationEstimate: result.aiCodeGenerationEstimate
    }];
  }

  if (scenarios.length === 0) {
    return (
      <div className="card fade-in callout danger">
        <strong>Erro de Estrutura:</strong> Não foi possível encontrar dados de cenários ou épicos.
        <pre style={{ fontSize: 10, marginTop: 10 }}>{JSON.stringify(result, null, 2)}</pre>
      </div>
    );
  }

  const activeScenario = scenarios[activeScenarioIdx] || scenarios[0];

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 className="sectionTitle" style={{ margin: 0 }}>2 — Comparativo de Cenários</h3>
        <div className="row">
          <button className="btn" onClick={() => setShowRaw(!showRaw)}>
            {showRaw ? '👁 Ver UI' : '🛠 Debug JSON'}
          </button>
          <ExportMarkdownButton result={{ scenarios }} />
        </div>
      </div>

      {showRaw && (
        <pre className="card" style={{ fontSize: 11, overflow: 'auto', maxHeight: 400, background: '#000', color: '#0f0' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

      {/* Scenarios Comparison Grid */}
      <div className="scenarios-grid">
        {scenarios.map((scenario, idx) => (
          <div 
            key={scenario.type + idx} 
            className={`scenario-card ${activeScenarioIdx === idx ? 'active' : ''}`}
            onClick={() => setActiveScenarioIdx(idx)}
          >
            <div className="scenario-header">
              <span className={`scenario-badge ${scenario.type.toLowerCase()}`}>
                {scenario.type === ScenarioType.LEAN ? '⚡ Lean' : '🏛 Enterprise'}
              </span>
              <span className="scenario-tag">
                {scenario.type === ScenarioType.LEAN ? 'Rápido & Econômico' : 'Robusto & Escalável'}
              </span>
            </div>

            <div className="scenario-main-stat">
              <span className="stat-label">⏱ Esforço</span>
              <span className="stat-value">{scenario.estimatedHours?.min || 0}h - {scenario.estimatedHours?.max || 0}h</span>
            </div>

            <div className="scenario-stats-row">
              <div className="small-stat">
                <span className="stat-label">🧩 Complexidade</span>
                <span className="stat-value">{scenario.totalComplexityPoints} pts</span>
              </div>
              <div className="small-stat">
                <span className="stat-label">💰 Custo IA</span>
                <span className="stat-value">{scenario.aiCodeGenerationEstimate?.display?.estimatedCost || 'N/A'}</span>
              </div>
            </div>

            <button className="btn scenario-select-btn">
              {activeScenarioIdx === idx ? 'Visualizando Detalhes' : 'Ver Detalhes'}
            </button>
          </div>
        ))}
      </div>

      {/* Details Area for Selected Scenario */}
      <div className="card active-scenario-details">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 className="sectionTitle" style={{ margin: 0 }}>
            Backlog: {activeScenario.type === ScenarioType.LEAN ? 'Cenário Lean' : 'Cenário Enterprise'}
          </h3>
          <div className="badge accent">
            Custo Funcional: {activeScenario.aiCodeGenerationEstimate?.display?.complexityTotalCost || 'N/A'}
          </div>
        </div>

        <div className="vision-block" style={{ marginBottom: 24 }}>
          {activeScenario.vision}
        </div>

        <div className="divider" />

        {/* Render Epics and Stories */}
        {activeScenario.epics && activeScenario.epics.length > 0 ? (
          activeScenario.epics.map((epic, epicIdx) => (
            <div key={epic.id || epicIdx} className="epic">
              <div className="epic-header">
                <div className={`epic-index ${EPIC_COLORS[epicIdx % EPIC_COLORS.length]}`}>
                  E{epicIdx + 1}
                </div>
                <div className="epic-title-wrap">
                  <h4>{epic.title}</h4>
                  <span className="epic-id">{epic.id}</span>
                </div>
              </div>
              <p className="epic-description">{epic.description}</p>

              {/* Rendering Stories inside Epic */}
              {epic.stories && epic.stories.length > 0 ? (
                epic.stories.map((story, storyIdx) => (
                  <div key={story.id || storyIdx} className="story">
                    <div className="story-header">
                      <span className="story-title">{story.title}</span>
                      <span className="story-id">{story.id}</span>
                    </div>
                    <p className="story-description">{story.description}</p>

                    <div className="story-tokens">
                      🧩 {story.complexityPoints} pontos de complexidade
                    </div>

                    {story.acceptanceCriteria && story.acceptanceCriteria.length > 0 && (
                      <>
                        <div className="ac-label">Critérios de aceitação</div>
                        <ul className="ac-list">
                          {story.acceptanceCriteria.map((c, cIdx) => (
                            <li key={cIdx}>{c}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <div className="muted" style={{ padding: 10 }}>Nenhuma story encontrada para este épico.</div>
              )}
            </div>
          ))
        ) : (
          <div className="muted">Nenhum épico encontrado para este cenário.</div>
        )}
      </div>
    </div>
  );
}
