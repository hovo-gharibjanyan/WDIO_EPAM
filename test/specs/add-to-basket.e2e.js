import {
    assert,
    expect as chaiExpect,
    should
} from 'chai';

import { getScenarioExamples } from '../utils/feature-data.js';

import ProductsPage from '../pageobjects/products.page.js';
import ProductDetailsPage from '../pageobjects/product-details.page.js';
import CartPage from '../pageobjects/cart.page.js';

should();

const testCases = getScenarioExamples(
    'Add a product to the basket'
);

describe('Add a product to the basket', () => {

    beforeEach(async () => {
        await browser.reloadSession();
    });

    for (const {
        initialCount,
        product,
        expectedCount
    } of testCases) {

        it(`should add ${product}: ${initialCount} → ${expectedCount}`, async () => {

            const initial = Number(initialCount);
            const expected = Number(expectedCount);

            assert.strictEqual(expected, initial + 1);

            await ProductsPage.open();

            assert.strictEqual(
                await CartPage.getHeaderCount(),
                0
            );

            if (initial > 0) {

                const seedProduct = testCases.find(
                    item => item.product !== product
                )?.product;

                assert.isString(seedProduct);

                await ProductsPage.openProductByName(seedProduct);

                await ProductDetailsPage.setQuantity(initial);
                await ProductDetailsPage.addToCart();

                await CartPage.waitForHeaderCount(initial);

                await ProductsPage.open();
            }

            // Check the Given condition
            assert.strictEqual(
                await CartPage.getHeaderCount(),
                initial
            );

            // Open the product from this Examples row
            await ProductsPage.openProductByName(product);

            const actualName = await ProductDetailsPage.getName();

            actualName.should.equal(product);

            // Perform the When action
            await ProductDetailsPage.addToCart();

            // Check the counter from the Then condition
            await CartPage.waitForHeaderCount(expected);

            chaiExpect(
                await CartPage.getHeaderCount()
            ).to.equal(expected);

            // Open the basket and check its contents
            await CartPage.open();

            const actualQuantity = await CartPage.getTotalQuantity();

            assert.strictEqual(actualQuantity, expected);

            const basketProductNames = await CartPage.getProductNames();

            chaiExpect(
                basketProductNames.some(name => name.includes(product))
            ).to.equal(true);

        });

    }

});
