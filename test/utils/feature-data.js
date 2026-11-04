
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  AstBuilder,
  GherkinClassicTokenMatcher,
  Parser
} from '@cucumber/gherkin';

import { IdGenerator } from '@cucumber/messages';

export function getScenarioExamples(scenarioName) {

  const featurePath = resolve(
    process.cwd(),
    'features',
    'practice_software_testing.feature'
  );

  const featureText = readFileSync(featurePath, 'utf8');

  const parser = new Parser(
    new AstBuilder(IdGenerator.uuid()),
    new GherkinClassicTokenMatcher()
  );

  const document = parser.parse(featureText);

  const scenarios = document.feature.children
    .flatMap(child => child.rule ? child.rule.children : [child])
    .map(child => child.scenario)
    .filter(Boolean);

  const scenario = scenarios.find(
    item => item.name === scenarioName
  );

  if (!scenario) {
    throw new Error(`Scenario "${scenarioName}" not found`);
  }

  const examples = (scenario.examples ?? []).flatMap(example => {

    const headers = example.tableHeader.cells.map(
      cell => cell.value
    );

    return example.tableBody.map(row =>
      Object.fromEntries(
        row.cells.map((cell, index) => [
          headers[index],
          cell.value
        ])
      )
    );

  });

  if (examples.length === 0) {
    throw new Error(`No examples found for "${scenarioName}"`);
  }

  return examples;
}
