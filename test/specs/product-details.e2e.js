
import {
  assert,
  expect as chaiExpect,
  should
} from 'chai';

import { getScenarioExamples } from '../utils/feature-data.js';

import ProductsPage from '../pageobjects/products.page.js';
import ProductDetailsPage from '../pageobjects/product-details.page.js';

should();

const testCases = getScenarioExamples('View product details');

describe('View product details', () => {

  for (const { product, price, category, brand } of testCases) {

    it(`should display correct details for ${product}`, async () => {

      await ProductsPage.open();

      await ProductsPage.openProductByName(product);

      const currentUrl = await ProductDetailsPage.getCurrentUrl();

      const isVisible = await ProductDetailsPage.isDisplayed();

      const actualName = await ProductDetailsPage.getName();
      const actualPrice = await ProductDetailsPage.getPrice();
      const actualCategory = await ProductDetailsPage.getCategory();
      const actualBrand = await ProductDetailsPage.getBrand();

      // Assert interface
      assert.include(currentUrl, '/product/');
      assert.strictEqual(actualCategory, category);

      // Expect interface
      chaiExpect(isVisible).to.equal(true);
      chaiExpect(actualPrice).to.equal(price);

      // Should interface
      actualName.should.equal(product);
      actualBrand.should.equal(brand);

    });

  }

});
