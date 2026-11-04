import {
  assert,
  expect as chaiExpect,
  should
} from 'chai';

import { getScenarioExamples } from '../utils/feature-data.js';

import ProductsPage from '../pageobjects/products.page.js';
import ProductDetailsPage from '../pageobjects/product-details.page.js';

should();

// Read data from Gherkin
const testCases = getScenarioExamples(
  'Filter and sort products'
);

// Sorting rules
const comparators = {
  'ascending name': (a, b) =>
    a.name.localeCompare(b.name, 'en', {
      sensitivity: 'base'
    }),

  'descending name': (a, b) =>
    b.name.localeCompare(a.name, 'en', {
      sensitivity: 'base'
    }),

  'ascending price': (a, b) =>
    a.price - b.price,

  'descending price': (a, b) =>
    b.price - a.price
};

describe('Filter and sort products', () => {

  for (const {
    category,
    sortOption,
    expectedOrder
  } of testCases) {

    it(`should filter ${category} and sort by ${sortOption}`, async () => {

      // 1. Open catalog
      await ProductsPage.open();

      // 2. Verify initial conditions
      const initialCheckbox =
        await ProductsPage.getCategoryCheckbox(category);

      assert.isFalse(await initialCheckbox.isSelected());

      assert.strictEqual(
        await ProductsPage.getSelectedSortValue(),
        ''
      );

      // 3. Apply category filter
      await ProductsPage.selectCategory(category);

      const selectedCheckbox =
        await ProductsPage.getCategoryCheckbox(category);

      chaiExpect(
        await selectedCheckbox.isSelected()
      ).to.equal(true);

      // 4. Apply sorting
      await ProductsPage.selectSortOption(sortOption);

      const selectedSort =
        await ProductsPage.getSelectedSortText();

      selectedSort.should.equal(sortOption);

      // 5. Verify category remains selected
      const checkboxAfterSorting =
        await ProductsPage.getCategoryCheckbox(category);

      assert.isTrue(
        await checkboxAfterSorting.isSelected()
      );

      // 6. Read actual product order
      const actualProducts =
        await ProductsPage.getVisibleProductData();

      assert.isAbove(
        actualProducts.length,
        1,
        'At least two products are needed to verify sorting'
      );

      // 7. Calculate the expected order
      const comparator = comparators[expectedOrder];

      assert.isFunction(
        comparator,
        `Unknown expected order: ${expectedOrder}`
      );

      const expectedProducts = [...actualProducts].sort(
        comparator
      );

      // 8. Verify sorting
      chaiExpect(actualProducts).to.deep.equal(expectedProducts);

      // 9. Collect product links after sorting
      const productUrls =
        await ProductsPage.getVisibleProductUrls(
          'sorting_completed'
        );

      assert.strictEqual(
        productUrls.length,
        actualProducts.length
      );

      // 10. Verify category of every displayed product
      for (const url of productUrls) {

        await ProductDetailsPage.open(url);

        const actualCategory =
          await ProductDetailsPage.getCategory();

        actualCategory.should.equal(category);
      }

    });

  }

});
