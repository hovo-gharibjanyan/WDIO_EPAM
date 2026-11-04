import BasePage from './base.page.js';

class CartPage extends BasePage {

    get cartCounter() {
        return $('[data-test="cart-quantity"]');
    }

    async open() {
        await super.open('/checkout');
    }

    async getHeaderCount() {
        if (!(await this.cartCounter.isExisting())) {
            return 0;
        }

        return Number(
            (await this.cartCounter.getText()).trim()
        );
    }

    async waitForHeaderCount(expectedCount) {
        await browser.waitUntil(
            async () => {
                const count = await this.getHeaderCount();

                return count === expectedCount;
            },
            {
                timeout: 15000,
                timeoutMsg: `Cart counter did not become ${expectedCount}`
            }
        );
    }


    async getTotalQuantity() {

        await browser.waitUntil(
            async () => {
                const inputs = await $$(
                    'app-cart [data-test="product-quantity"]'
                );

                return inputs.length > 0;
            },
            {
                timeout: 15000,
                timeoutMsg: 'Cart products did not load'
            }
        );

        const inputs = await $$(
            'app-cart [data-test="product-quantity"]'
        );

        let total = 0;

        for (const input of inputs) {
            const quantity = Number(await input.getValue());

            total += quantity;
        }

        return total;
    }


    async getProductNames() {
        const elements = await $$(
            'app-cart [data-test="product-title"]'
        );

        const names = [];

        for (const element of elements) {
            names.push((await element.getText()).trim());
        }

        return names;
    }


    async proceedToCheckout() {
        const button = $('[data-test="proceed-1"]');

        await button.waitForClickable();
        await button.click();
    }

}

export default new CartPage();
