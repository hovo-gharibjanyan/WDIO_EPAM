import BasePage from './base.page.js';

class FavoritesPage extends BasePage {

    get pageTitle() {
        return $('[data-test="page-title"]');
    }


    async open() {
        const spy = await browser.mock(
            'https://api.practicesoftwaretesting.com/favorites',
            { method: 'GET' }
        );

        try {
            await super.open('/account/favorites');

            await this.pageTitle.waitForDisplayed({
                timeout: 15000
            });

            await spy.waitForResponse({
                timeout: 15000
            });

            const rawBody = spy.calls.at(-1)?.body;

            const favorites = typeof rawBody === 'string'
                ? JSON.parse(rawBody)
                : rawBody;

            if (!Array.isArray(favorites)) {
                throw new Error(
                    `Invalid favorites API response: ${JSON.stringify(rawBody)}`
                );
            }

            const expectedNames = favorites
                .map(item => item.product.name.trim())
                .sort();

            await browser.waitUntil(
                async () => {
                    const elements = await $$(
                        '[data-test^="favorite-"] [data-test="product-name"]'
                    );

                    const actualNames = [];

                    for (const element of elements) {
                        actualNames.push(
                            (await element.getText()).trim()
                        );
                    }

                    actualNames.sort();

                    return JSON.stringify(actualNames) ===
                        JSON.stringify(expectedNames);
                },
                {
                    timeout: 15000,
                    timeoutMsg: 'Favorites UI did not finish loading'
                }
            );

        } finally {
            await spy.restore();
        }
    }


    async getProductCards(productName) {
        const cards = await $$('[data-test^="favorite-"]');
        const matches = [];

        for (const card of cards) {
            const name = (
                await card.$('[data-test="product-name"]').getText()
            ).trim();

            if (name === productName) {
                matches.push(card);
            }
        }

        return matches;
    }

    async getProductCount(productName) {
        const cards = await this.getProductCards(productName);
        return cards.length;
    }

    async removeProductIfPresent(productName) {

        let cards = await this.getProductCards(productName);

        while (cards.length > 0) {
            const previousCount = cards.length;

            await cards[0].$('[data-test="delete"]').click();

            await browser.waitUntil(
                async () =>
                    (await this.getProductCount(productName)) < previousCount,
                {
                    timeout: 15000,
                    timeoutMsg: `Could not remove ${productName} from favorites`
                }
            );

            cards = await this.getProductCards(productName);
        }
    }

    async waitForProduct(productName) {
        await browser.waitUntil(
            async () =>
                (await this.getProductCount(productName)) === 1,
            {
                timeout: 15000,
                timeoutMsg: `${productName} was not found in favorites`
            }
        );
    }
}

export default new FavoritesPage();
