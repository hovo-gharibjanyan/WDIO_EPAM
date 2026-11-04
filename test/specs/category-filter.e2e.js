
import { assert, expect as chaiExpect, should } from 'chai';
import { getScenarioExamples } from '../utils/feature-data.js';

import ProductsPage from '../pageobjects/products.page.js';
import ProductDetailsPage from '../pageobjects/product-details.page.js';

should();

const testCases = getScenarioExamples(
  'Filter products by category'
);

describe('Filter products by category', () => {

  for (const { category } of testCases) {

    it(`should show only ${category} products`, async () => {

      await ProductsPage.open();

      // Verify initial state
      const checkbox = await ProductsPage.getCategoryCheckbox(category);

      assert.isFalse(await checkbox.isSelected());

      // Select category
      await ProductsPage.selectCategory(category);

      const selectedCheckbox =
        await ProductsPage.getCategoryCheckbox(category);

      chaiExpect(await selectedCheckbox.isSelected()).to.equal(true);

      // Collect links from the filtered catalog
      const productUrls = await ProductsPage.getVisibleProductUrls();

      assert.isAbove(
        productUrls.length,
        0,
        `No products displayed for ${category}`
      );

      // Verify each product's actual category
      for (const url of productUrls) {

        await ProductDetailsPage.open(url);

        const actualCategory =
          await ProductDetailsPage.getCategory();

        actualCategory.should.equal(category);
      }

    });

  }

});
