
import { assert, expect as chaiExpect } from 'chai';
import ProductsPage from '../pageobjects/products.page.js';

describe('Products Page', () => {

  it('should open the products page', async () => {

    await ProductsPage.open();

    const currentUrl = await ProductsPage.getCurrentUrl();
    const isDisplayed = await ProductsPage.isDisplayed();

    assert.include(
      currentUrl,
      'practicesoftwaretesting.com'
    );

    chaiExpect(isDisplayed).to.equal(true);

  });

});
