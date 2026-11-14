import BasePage from './base.page.js';

class FavoritesPage extends BasePage {

    constructor() {
        super('/account/favorites');

        this.apiUrl =
            'https://api.practicesoftwaretesting.com';
    }

    // =========================
    // LOCATORS
    // =========================

    get pageTitle() {
        return $('[data-test="page-title"]');
    }

    // =========================
    // API HELPERS
    // =========================

    async getExpectedFavoriteNames(spy) {

        await spy.waitForResponse({
            timeout: 15000
        });

        const rawBody = spy.calls.at(-1)?.body;

        const favorites =
            typeof rawBody === 'string'
                ? JSON.parse(rawBody)
                : rawBody;

        if (!Array.isArray(favorites)) {
            throw new Error(
                `Invalid favorites API response: ${
                    JSON.stringify(rawBody)
                }`
            );
        }

        return favorites
            .map(item => item.product.name.trim())
            .sort();
    }

    // =========================
    // UI HELPERS
    // =========================

    async getVisibleFavoriteNames() {

        const elements = await $$(
            '[data-test^="favorite-"] ' +
            '[data-test="product-name"]'
        );

        const names = [];

        for (const element of elements) {
            names.push(
                await this.getTrimmedText(element)
            );
        }

        return names.sort();
    }

    async waitForFavoritesToMatch(expectedNames) {

        await browser.waitUntil(
            async () => {

                const actualNames =
                    await this.getVisibleFavoriteNames();

                return JSON.stringify(actualNames) ===
                    JSON.stringify(expectedNames);
            },
            {
                timeout: 15000,
                timeoutMsg:
                    'Favorites UI did not finish loading'
            }
        );
    }

    // =========================
    // OPEN PAGE
    // =========================

    async open() {

        const spy = await browser.mock(
            `${this.apiUrl}/favorites`,
            { method: 'GET' }
        );

        try {
            await super.open();

            await this.pageTitle.waitForDisplayed({
                timeout: 15000
            });

            const expectedNames =
                await this.getExpectedFavoriteNames(spy);

            await this.waitForFavoritesToMatch(
                expectedNames
            );

        } finally {
            await spy.restore();
        }
    }

    // =========================
    // FAVORITE PRODUCTS
    // =========================

    async getProductCards(productName) {

        const cards = await $$(
            '[data-test^="favorite-"]'
        );

        const matches = [];

        for (const card of cards) {

            const name = await this.getTrimmedText(
                card.$('[data-test="product-name"]')
            );

            if (name === productName) {
                matches.push(card);
            }
        }

        return matches;
    }

    async getProductCount(productName) {

        const cards =
            await this.getProductCards(productName);

        return cards.length;
    }

    // =========================
    // REMOVE FAVORITE
    // =========================

    async removeProductIfPresent(productName) {

        let cards =
            await this.getProductCards(productName);

        while (cards.length > 0) {

            const previousCount = cards.length;

            await cards[0]
                .$('[data-test="delete"]')
                .click();

            await browser.waitUntil(
                async () =>
                    (await this.getProductCount(
                        productName
                    )) < previousCount,
                {
                    timeout: 15000,
                    timeoutMsg:
                        `Could not remove ${productName} from favorites`
                }
            );

            cards =
                await this.getProductCards(productName);
        }
    }

    // =========================
    // WAIT FOR PRODUCT
    // =========================

    async waitForProduct(productName) {

        await browser.waitUntil(
            async () =>
                (await this.getProductCount(
                    productName
                )) === 1,
            {
                timeout: 15000,
                timeoutMsg:
                    `${productName} was not found in favorites`
            }
        );
    }
}

export default new FavoritesPage();
