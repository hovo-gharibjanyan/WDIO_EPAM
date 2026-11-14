
import BasePage from './base.page.js';

class CartPage extends BasePage {

    constructor() {
        super('/checkout');
    }

    get productQuantityInputs() {
        return $$('app-cart [data-test="product-quantity"]');
    }

    get productTitles() {
        return $$('app-cart [data-test="product-title"]');
    }


    get proceedButton() {
        return $('[data-test="proceed-1"]');
    }

    async getTotalQuantity() {
        await browser.waitUntil(
            async () => {
                const inputs = await this.productQuantityInputs;
                return inputs.length > 0;
            },
            {
                timeout: 15000,
                timeoutMsg: 'Cart products did not load'
            }
        );

        const inputs = await this.productQuantityInputs;

        let total = 0;

        for (const input of inputs) {
            const quantity = Number(await input.getValue());
            total += quantity;
        }

        return total;
    }


    async getProductNames() {

        await browser.waitUntil(
            async () => {
                const elements = await this.productTitles;

                if (elements.length === 0) {
                    return false;
                }

                return await elements[0].isDisplayed();
            },
            {
                timeout: 15000,
                timeoutMsg: 'Cart product names did not load'
            }
        );

        const elements = await this.productTitles;
        const names = [];

        for (const element of elements) {
            names.push(await this.getTrimmedText(element));
        }

        return names;
    }




    async proceedToCheckout() {
        await this.proceedButton.waitForClickable();
        await this.proceedButton.click();
    }
}

export default new CartPage();
