import type { BacklogResult } from '../domain/types';
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
  const totalStories = result.epics.reduce((sum, e) => sum + e.stories.length, 0);

  return (
    <div className="card fade-in">
      {/* Header */}
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 className="sectionTitle" style={{ margin: 0 }}>2 — Resultado</h3>
        <ExportMarkdownButton result={result} />
      </div>

      {/* Estimate Stats */}
      <div className="estimate-summary">
        <div className="estimate-stat">
          <span className="estimate-stat-label">⏱ Horas estimadas</span>
          <span className="estimate-stat-value accent">
            {result.estimatedHours.min}h – {result.estimatedHours.max}h
          </span>
        </div>
        <div className="estimate-stat">
          <span className="estimate-stat-label">🔢 Pontos de complexidade</span>
          <span className="estimate-stat-value">{result.totalComplexityPoints.toLocaleString('pt-BR')}</span>
        </div>
        <div className="estimate-stat">
          <span className="estimate-stat-label">🤖 Custo IA (Média)</span>
          <span className="estimate-stat-value">
            {result.aiCodeGenerationEstimate?.display.estimatedCost || 'N/A'}
          </span>
        </div>
        <div className="estimate-stat">
          <span className="estimate-stat-label">💻 Custo Funcional</span>
          <span className="estimate-stat-value">
            {result.aiCodeGenerationEstimate?.display.complexityTotalCost || 'N/A'}
          </span>
        </div>
      </div>

      <p className="muted" style={{ margin: '10px 0 0', fontSize: 12 }}>
        ⚠ Estimativas são aproximadas e podem variar após refinamento com o time.
      </p>

      <div className="divider" />

      {/* Detailed AI Estimate */}
      {result.aiCodeGenerationEstimate && (
        <>
          <h3 className="sectionTitle">Análise de IA & Tokens</h3>
          <div className="grid" style={{ gap: 12, marginBottom: 16 }}>
            <div className="callout ok" style={{ fontSize: 13 }}>
              <strong>Estratégia:</strong> {result.aiCodeGenerationEstimate.assumptions.workflow}
            </div>
            
            <div className="row" style={{ gap: 12 }}>
              <div className="badge accent">
                Total: {result.aiCodeGenerationEstimate.display.totalTokens}
              </div>
              <div className="badge">
                Input: {result.aiCodeGenerationEstimate.display.totalInputTokens}
              </div>
              <div className="badge">
                Output: {result.aiCodeGenerationEstimate.display.totalOutputTokens}
              </div>
            </div>

            <div className="muted" style={{ fontSize: 12 }}>
              <strong>Pricing base:</strong> {result.aiCodeGenerationEstimate.display.pricing}
            </div>
          </div>
          <div className="divider" />
        </>
      )}

      {/* Vision */}
      <h3 className="sectionTitle">Visão do produto</h3>
      <div className="vision-block">{result.vision}</div>

      <div className="divider" />

      {/* Backlog */}
      <h3 className="sectionTitle">Backlog</h3>

      {result.epics.map((epic, epicIdx) => (
        <div key={epic.id} className="epic">
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

          {epic.stories.map((story) => (
            <div key={story.id} className="story">
              <div className="story-header">
                <span className="story-title">{story.title}</span>
                <span className="story-id">{story.id}</span>
              </div>
              <p className="story-description">{story.description}</p>

              <div className="story-tokens">
                🧩 {story.complexityPoints} pontos de complexidade
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
  );
}
