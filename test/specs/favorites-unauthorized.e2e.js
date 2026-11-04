
import {
  assert,
  expect as chaiExpect,
  should
} from 'chai';

import { getScenarioExamples } from '../utils/feature-data.js';

import ProductsPage from '../pageobjects/products.page.js';
import ProductDetailsPage from '../pageobjects/product-details.page.js';

should();

const testCases = getScenarioExamples(
  'Try to add a product to favorites without signing in'
);

const expectedMessage =
  'Unauthorized, can not add product to your favorite list.';

describe('Try to add a product to favorites without signing in', () => {

  beforeEach(async () => {
    await browser.reloadSession();
  });

  for (const { product } of testCases) {

    it(`should reject adding ${product} to favorites`, async () => {

      // 1. Open catalog
      await ProductsPage.open();

      // 2. Verify user is not signed in
      const signInLink = $('[data-test="nav-sign-in"]');

      await signInLink.waitForDisplayed();

      assert.isTrue(
        await signInLink.isDisplayed(),
        'User should not be signed in'
      );

      // 3. Open product details
      await ProductsPage.openProductByName(product);

      const actualName =
        await ProductDetailsPage.getName();

      actualName.should.equal(product);

      // 4. Try adding product to favorites
      await ProductDetailsPage.addToFavorites();

      // 5. Verify unauthorized error
      const actualMessage =
        await ProductDetailsPage.getFavoriteErrorMessage();

      chaiExpect(actualMessage).to.equal(expectedMessage);

      // 6. Verify success notification was not shown
      assert.isFalse(
        await ProductDetailsPage.favoriteSuccessToast.isExisting(),
        'Success notification should not appear'
      );

    });

  }

});
