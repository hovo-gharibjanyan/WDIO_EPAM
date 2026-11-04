
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
  'Add a new product to favorites'
);

describe('Add a new product to favorites', () => {

  beforeEach(async () => {
    await browser.reloadSession();
  });

  for (const { product } of testCases) {

    it(`should add ${product} to favorites`, async () => {

      // 1. Login
      const user = getUserByAlias('standard_user');

      await LoginPage.open();
      await LoginPage.signIn(user.email, user.password);

      assert.isTrue(await AccountPage.isDisplayed());

      // 2. Ensure product is not already in favorites
      await FavoritesPage.open();

      await FavoritesPage.removeProductIfPresent(product);

      assert.strictEqual(
        await FavoritesPage.getProductCount(product),
        0
      );

      // 3. Open product
      await ProductsPage.open();
      await ProductsPage.openProductByName(product);

      (await ProductDetailsPage.getName())
        .should.equal(product);

      // 4. Add to favorites
      await ProductDetailsPage.addToFavorites();

      // 5. Verify success notification
      await ProductDetailsPage.favoriteSuccessToast
        .waitForDisplayed({ timeout: 10000 });

      const message = (
        await ProductDetailsPage.favoriteSuccessToast.getText()
      ).trim();

      chaiExpect(message).to.equal(
        'Product added to your favorites list.'
      );

      // 6. Verify product exists in favorites
      await FavoritesPage.open();

      await FavoritesPage.waitForProduct(product);

      assert.strictEqual(
        await FavoritesPage.getProductCount(product),
        1
      );

    });
  }
});
    