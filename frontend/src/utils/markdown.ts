import { BacklogResult, Epic, UserStory, ScenarioResult } from '../domain/types';

function escapeMd(text: string) {
  return text.replace(/\r\n/g, '\n').trim();
}

function storyToMd(story: UserStory) {
  const ac = story.acceptanceCriteria?.length
    ? story.acceptanceCriteria.map((c) => `    - ${escapeMd(c)}`).join('\n')
    : '    - (sem critérios)';

  return [
    `- **${escapeMd(story.title)}** (\`${story.id}\`)`,
    `  - Descrição: ${escapeMd(story.description)}`,
    `  - Critérios de aceitação:`,
    ac,
    `  - Pontos de Complexidade: **${story.complexityPoints}**`,
  ].join('\n');
}

function epicToMd(epic: Epic) {
  const storiesMd = epic.stories?.length
    ? epic.stories.map((s) => storyToMd(s)).join('\n\n')
    : '- (sem histórias)';

  return [
    `### ${escapeMd(epic.title)} (\`${epic.id}\`)`,
    '',
    escapeMd(epic.description),
    '',
    storiesMd,
  ].join('\n');
}

function scenarioToMd(scenario: ScenarioResult) {
  const epicsMd = scenario.epics?.length ? scenario.epics.map((e) => epicToMd(e)).join('\n\n') : '';
  const codeGen = scenario.aiCodeGenerationEstimate;

  return [
    `# Cenário: ${scenario.type}`,
    '',
    `**Visão:** ${escapeMd(scenario.vision)}`,
    '',
    '## Resumo Técnico',
    `- Esforço Estimado: **${scenario.estimatedHours.min}h — ${scenario.estimatedHours.max}h**`,
    `- Complexidade Total: **${scenario.totalComplexityPoints} pts**`,
    `- Custo Estimado IA: **${codeGen?.display.estimatedCost || 'N/A'}**`,
    `- Custo Funcional Est.: **${codeGen?.display.complexityTotalCost || 'N/A'}**`,
    `- Tokens Totais: **${codeGen?.display.totalTokens || 'N/A'}**`,
    '',
    '## Detalhes do Backlog',
    '',
    epicsMd,
    '',
    '---'
  ].join('\n');
}

export function backlogToMarkdown(result: BacklogResult) {
  const scenariosMd = result.scenarios.map(s => scenarioToMd(s)).join('\n\n');

  return [
    '# MVP Estimator — Comparativo de Cenários',
    '',
    '_Relatório gerado automaticamente contendo análise Lean e Enterprise._',
    '',
    '---',
    '',
    scenariosMd,
    '',
    '_Observação: estimativas são baseadas na análise da IA e podem variar conforme refinamento técnico._',
    '',
  ].join('\n');
}
