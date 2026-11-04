
import {
  assert,
  expect as chaiExpect,
  should
} from 'chai';

import { getScenarioExamples } from '../utils/feature-data.js';
import ProductsPage from '../pageobjects/products.page.js';

should();

const testCases = getScenarioExamples(
  'Search for products by keyword'
);

describe('Search for products by keyword', () => {

  for (const { searchTerm } of testCases) {

    it(`should find products matching "${searchTerm}"`, async () => {

      await ProductsPage.open();

      await ProductsPage.searchFor(searchTerm);

      const actualSearchTerm = await ProductsPage.getSearchTerm();

      const productNames = await ProductsPage.getVisibleProductNames();

      actualSearchTerm.should.equal(searchTerm);

      assert.isAbove(
        productNames.length,
        0,
        `No products found for "${searchTerm}"`
      );

      for (const name of productNames) {
        chaiExpect(name.toLowerCase()).to.include(
          searchTerm.toLowerCase()
        );
      }

    });

  }

});
