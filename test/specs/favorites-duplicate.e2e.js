
import {
  assert,
  expect as chaiExpect,
  should
} from 'chai';

import { getScenarioExamples } from '../utils/feature-data.js';
import { getUserByAlias } from '../utils/test-users.js';

import LoginPage from '../pageobjects/login.page.js';
import AccountPage from '../pageobjects/account.page.js';
import ProductsPage from '../pageobjects/products.page.js';
import ProductDetailsPage from '../pageobjects/product-details.page.js';
import FavoritesPage from '../pageobjects/favorites.page.js';

should();

const testCases = getScenarioExamples(
  'Add a product that is already in favorites'
);

const expectedError =
  'Product already in your favorites list.';

describe('Add a product that is already in favorites', () => {

  beforeEach(async () => {
    await browser.reloadSession();
  });

  for (const { product } of testCases) {

    it(`should prevent duplicate favorite: ${product}`, async () => {

      // STEP 1: Login
      const user = getUserByAlias('standard_user');

      await LoginPage.open();

      await LoginPage.signIn(
        user.email,
        user.password
      );

      assert.isTrue(await AccountPage.isDisplayed());

      // STEP 2: Check initial favorites
      await FavoritesPage.open();

      let count = await FavoritesPage.getProductCount(product);

      assert.isAtMost(
        count,
        1,
        'Initial favorites must not contain duplicates'
      );

      // STEP 3: Add product only if it is absent
      if (count === 0) {

        await ProductsPage.open();

        await ProductsPage.openProductByName(product);

        await ProductDetailsPage.addToFavorites();

        await ProductDetailsPage.favoriteSuccessToast
          .waitForDisplayed({ timeout: 10000 });

        // Verify product was saved
        await FavoritesPage.open();

        count = await FavoritesPage.getProductCount(product);
      }

      assert.strictEqual(
        count,
        1,
        'Product must already be in favorites'
      );

      // STEP 4: Open product again
      await ProductsPage.open();

      await ProductsPage.openProductByName(product);

      (await ProductDetailsPage.getName())
        .should.equal(product);

      // STEP 5: Try to add the same product
      await ProductDetailsPage.addToFavorites();

      // STEP 6: Verify error message
      const errorMessage =
        await ProductDetailsPage.getFavoriteErrorMessage();

      chaiExpect(errorMessage).to.equal(expectedError);

      // STEP 7: Verify no duplicate was created
      await FavoritesPage.open();

      const finalCount =
        await FavoritesPage.getProductCount(product);

      assert.strictEqual(
        finalCount,
        1,
        'Duplicate favorite must not be created'
      );

    });
  }
});
