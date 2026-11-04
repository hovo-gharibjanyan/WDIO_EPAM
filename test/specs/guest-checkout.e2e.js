
import {
  assert,
  expect as chaiExpect,
  should
} from 'chai';

import ProductsPage from '../pageobjects/products.page.js';
import ProductDetailsPage from '../pageobjects/product-details.page.js';
import CartPage from '../pageobjects/cart.page.js';
import CheckoutPage from '../pageobjects/checkout.page.js';

should();

describe('Complete checkout as a guest', () => {

  beforeEach(async () => {
    await browser.reloadSession();
  });

  it('should complete checkout with Cash on Delivery', async () => {

    const product = 'Combination Pliers';

    // =========================
    // STEP 1: OPEN CATALOG
    // =========================

    await ProductsPage.open();

    const signInLink = $('[data-test="nav-sign-in"]');

    await signInLink.waitForDisplayed();

    assert.isTrue(
      await signInLink.isDisplayed(),
      'User must not be signed in'
    );

    assert.strictEqual(
      await CartPage.getHeaderCount(),
      0,
      'Cart should be empty initially'
    );

    // =========================
    // STEP 2: ADD PRODUCT
    // =========================

    await ProductsPage.openProductByName(product);

    const actualProductName =
      await ProductDetailsPage.getName();

    actualProductName.should.equal(product);

    await ProductDetailsPage.addToCart();

    await CartPage.waitForHeaderCount(1);

    // =========================
    // STEP 3: CHECK BASKET
    // =========================

    await CartPage.open();

    const quantity = await CartPage.getTotalQuantity();

    assert.strictEqual(
      quantity,
      1,
      'Basket should contain one item'
    );

    const productNames =
      await CartPage.getProductNames();

    chaiExpect(productNames).to.include(product);

    await CartPage.proceedToCheckout();

    // =========================
    // STEP 4: GUEST DETAILS
    // =========================

    await CheckoutPage.continueAsGuest({
      email: 'qa.guest.checkout@example.com',
      firstName: 'Test',
      lastName: 'Customer'
    });

    // =========================
    // STEP 5: BILLING ADDRESS
    // =========================

    await CheckoutPage.fillBillingAddress({
      country: 'US',
      postalCode: '10001',
      houseNumber: '10'
    });

    // =========================
    // STEP 6: PAYMENT
    // =========================

    const invoiceNumber =
      await CheckoutPage.payWithCashOnDelivery();

    // =========================
    // STEP 7: ASSERTIONS
    // =========================

    assert.isNotEmpty(
      invoiceNumber,
      'Order invoice number should not be empty'
    );

    chaiExpect(invoiceNumber).to.be.a('string');

    console.log(
      `Guest checkout completed. Invoice: ${invoiceNumber}`
    );

  });

});
