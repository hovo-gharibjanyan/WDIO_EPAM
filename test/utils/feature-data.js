
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import {
    AstBuilder,
    GherkinClassicTokenMatcher,
    Parser
} from '@cucumber/gherkin';

import { IdGenerator } from '@cucumber/messages';

/**
 * Read scenario examples from all .feature files.
 *
 * @param {string} scenarioName
 * @returns {Array<Object>}
 */
export function getScenarioExamples(scenarioName) {

    const featuresDirectory = resolve(
        process.cwd(),
        'features'
    );

    const featureFiles = readdirSync(featuresDirectory)
        .filter(file => file.endsWith('.feature'))
        .sort();

    if (featureFiles.length === 0) {
        throw new Error('No .feature files found');
    }

    const matchingScenarios = [];

    for (const fileName of featureFiles) {

        const featurePath = resolve(
            featuresDirectory,
            fileName
        );

        const featureText = readFileSync(
            featurePath,
            'utf8'
        );

        const parser = new Parser(
            new AstBuilder(IdGenerator.uuid()),
            new GherkinClassicTokenMatcher()
        );

        const document = parser.parse(featureText);

        const scenarios = (document.feature?.children ?? [])
            .flatMap(child =>
                child.rule
                    ? child.rule.children
                    : [child]
            )
            .map(child => child.scenario)
            .filter(Boolean);

        for (const scenario of scenarios) {
            if (scenario.name === scenarioName) {
                matchingScenarios.push({
                    scenario,
                    fileName
                });
            }
        }
    }

    if (matchingScenarios.length === 0) {
        throw new Error(
            `Scenario "${scenarioName}" not found`
        );
    }

    if (matchingScenarios.length > 1) {
        throw new Error(
            `Duplicate scenario "${scenarioName}" found in: ` +
            matchingScenarios
                .map(item => item.fileName)
                .join(', ')
        );
    }

    const { scenario } = matchingScenarios[0];

    const examples = (scenario.examples ?? [])
        .flatMap(example => {

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
        throw new Error(
            `No examples found for "${scenarioName}"`
        );
    }

    return examples;
}
