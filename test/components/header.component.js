export default class Header {

    get navMenu() {
        return $('[data-test="nav-menu"]');
    }

    get signInLink() {
        return $('[data-test="nav-sign-in"]');
    }

    get cartCounter() {
        return $('[data-test="cart-quantity"]');
    }

    async getUserName() {
        await this.navMenu.waitForDisplayed();

        return (await this.navMenu.getText()).trim();
    }

    async isGuest() {
        return await this.signInLink.isDisplayed();
    }

    async getCartCount() {
        if (!(await this.cartCounter.isExisting())) {
            return 0;
        }

        return Number(
            (await this.cartCounter.getText()).trim()
        );
    }

    async waitForCartCount(expectedCount) {
        await browser.waitUntil(
            async () =>
                (await this.getCartCount()) === expectedCount,
            {
                timeout: 15000,
                timeoutMsg:
                    `Cart counter did not become ${expectedCount}`
            }
        );
    }
}
