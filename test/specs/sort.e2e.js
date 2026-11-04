import {
    assert,
    expect as chaiExpect,
    should
} from 'chai';

import { getScenarioExamples } from '../utils/feature-data.js';
import ProductsPage from '../pageobjects/products.page.js';

should();

const testCases = getScenarioExamples('Sort products')
    .filter(({ expectedOrder }) =>
        expectedOrder.includes('name') ||
        expectedOrder.includes('price')
    );

const comparators = {
    'ascending name': (a, b) =>
        a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }),

    'descending name': (a, b) =>
        b.name.localeCompare(a.name, 'en', { sensitivity: 'base' }),

    'ascending price': (a, b) => a.price - b.price,

    'descending price': (a, b) => b.price - a.price
};

describe('Sort products', () => {

    for (const { sortOption, expectedOrder } of testCases) {

        it(`should sort products by ${sortOption}`, async () => {

            await ProductsPage.open();

            // Check precondition
            const initialSort = await ProductsPage.getSelectedSortValue();

            assert.strictEqual(initialSort, '');

            // Select sorting
            await ProductsPage.selectSortOption(sortOption);

            const selectedText = await ProductsPage.getSelectedSortText();

            // Verify selected option
            selectedText.should.equal(sortOption);

            // Get actual displayed products
            const actualProducts = await ProductsPage.getVisibleProductData();

            assert.isAbove(actualProducts.length, 1);

            // Calculate expected ordering
            const expectedProducts = [...actualProducts].sort(
                comparators[expectedOrder]
            );

            // Verify ordering
            chaiExpect(actualProducts).to.deep.equal(expectedProducts);

        });

    }

});


const co2TestCases = getScenarioExamples('Sort products')
    .filter(({ expectedOrder }) =>
        expectedOrder.includes('CO₂ rating')
    );

describe('Sort products by CO₂ rating', () => {

    for (const { sortOption, expectedOrder } of co2TestCases) {

        it(`should sort by ${sortOption}`, async () => {

            await ProductsPage.open();

            // Check precondition
            const initialSort = await ProductsPage.getSelectedSortValue();
            assert.strictEqual(initialSort, '');

            // Select sort option
            await ProductsPage.selectSortOption(sortOption);

            const selectedText = await ProductsPage.getSelectedSortText();
            selectedText.should.equal(sortOption);

            // Read product ratings from the browser
            const products = await ProductsPage.getVisibleCo2Ratings();
            // Work only with products that have a rating
            const ratedProducts = products.filter(
                product => product.rating !== null
            );

            assert.isAtLeast(ratedProducts.length, 2);

            const actualRatings = ratedProducts.map(
                product => product.rating
            );

            // Make sure the check is meaningful
            if (new Set(actualRatings).size === 1) {
                console.warn(
                    `Only one unique CO2 rating is visible for ${sortOption}`
                );
            }

            // Independently calculate the expected order
            const expectedRatings = [...actualRatings].sort(
                (a, b) => expectedOrder === 'ascending CO₂ rating'
                    ? a.localeCompare(b)
                    : b.localeCompare(a)
            );

            chaiExpect(actualRatings).to.deep.equal(expectedRatings);

        });

    }

});
