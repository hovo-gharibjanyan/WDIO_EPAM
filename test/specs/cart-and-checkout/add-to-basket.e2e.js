import {
    assert,
    expect as chaiExpect,
    should
} from 'chai';

import { getScenarioExamples } from '../../utils/feature-data.js';

import ProductsPage from '../../pageobjects/products.page.js';
import ProductDetailsPage from '../../pageobjects/product-details.page.js';
import CartPage from '../../pageobjects/cart.page.js';

should();

const testCases = getScenarioExamples(
    'Add a product to the basket'
);


async function waitForCartCountWithDiagnostics(expectedCount) {
    try {
        await CartPage.header.waitForCartCount(expectedCount);
    } catch (error) {
        const actualCount = await CartPage.header.getCartCount();

        const details = await browser.execute(() => ({
            url: window.location.href,

            product: document.querySelector(
                '[data-test="product-name"]'
            )?.textContent?.trim() ?? null,

            quantity: document.querySelector(
                '[data-test="quantity"]'
            )?.value ?? null,

            addButtonDisabled: document.querySelector(
                '[data-test="add-to-cart"]'
            )?.disabled ?? null,

            notifications: [...document.querySelectorAll(
                '.toast, [role="alert"]'
            )].map(el => el.textContent.trim()).filter(Boolean)
        }));

        console.error('CART DIAGNOSTICS:', JSON.stringify({
            expectedCount,
            actualCount,
            ...details
        }, null, 2));

        throw error;
    }
}


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
                await CartPage.header.getCartCount(),
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

                await waitForCartCountWithDiagnostics(initial);

                await ProductsPage.open();
            }

            // Check the Given condition
            assert.strictEqual(
                await CartPage.header.getCartCount(),
                initial
            );

            // Open the product from this Examples row
            await ProductsPage.openProductByName(product);

            const actualName = await ProductDetailsPage.getName();

            actualName.should.equal(product);

            // Perform the When action
            await ProductDetailsPage.addToCart();

            // Check the counter from the Then condition
            await waitForCartCountWithDiagnostics(expected);

            chaiExpect(
                await CartPage.header.getCartCount()
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
