import type { BacklogResult, Epic, UserStory } from '../domain/types';

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
    `## ${escapeMd(epic.title)} (\`${epic.id}\`)`,
    '',
    escapeMd(epic.description),
    '',
    '### User Stories',
    '',
    storiesMd,
  ].join('\n');
}

export function backlogToMarkdown(result: BacklogResult) {
  const epicsMd = result.epics?.length ? result.epics.map((e) => epicToMd(e)).join('\n\n') : '';
  const codeGen = result.aiCodeGenerationEstimate;

  const estimateSection = [
    '## Estimativa de Desenvolvimento (IA)',
    '',
    `- Tokens Totais: **${codeGen?.display.totalTokens || 'N/A'}**`,
    `- Custo Estimado: **${codeGen?.display.estimatedCost || 'N/A'}**`,
    `- Horas Estimadas: **${result.estimatedHours.min}h** — **${result.estimatedHours.max}h**`,
  ];

  if (codeGen) {
    estimateSection.push(`- Preço base: ${codeGen.display.pricing}`);
  }

  return [
    '# MVP Estimator — Backlog e Estimativa',
    '',
    '## Visão e Análise do MVP',
    '',
    escapeMd(result.vision),
    '',
    ...estimateSection,
    '',
    '---',
    '',
    epicsMd,
    '',
    '---',
    '',
    '_Observação: estimativas são baseadas na análise da IA e podem variar conforme refinamento._',
    '',
  ].join('\n');
}

