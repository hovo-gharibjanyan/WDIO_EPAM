export default class SortComponent {

    // =========================
    // LOCATORS
    // =========================

    get sortSelect() {
        return $('[data-test="sort"]');
    }

    get sortingCompleted() {
        return $('[data-test="sorting_completed"]');
    }

    // =========================
    // SORT ACTIONS
    // =========================

    async getSelectedSortValue() {
        return await this.sortSelect.getValue();
    }

    async selectSortOption(sortOption) {
        await this.sortSelect.waitForDisplayed();

        await this.sortSelect.selectByVisibleText(
            sortOption
        );

        await this.sortingCompleted.waitForDisplayed({
            timeout: 15000,
            timeoutMsg: `Sorting did not finish: ${sortOption}`
        });
    }

    async getSelectedSortText() {
        const option = await this.sortSelect.$(
            'option:checked'
        );

        return (await option.getText()).trim();
    }

    // =========================
    // PRODUCT DATA
    // =========================

    async getVisibleProductData() {
        const cards = await this.sortingCompleted.$$(
            'a[data-test^="product-"]'
        );

        const products = [];

        for (const card of cards) {
            const name = (
                await card.$(
                    '[data-test="product-name"]'
                ).getText()
            ).trim();

            const priceText = await card.$(
                '[data-test="product-price"]'
            ).getText();

            const price = Number(
                priceText.replace(/[^0-9.]/g, '')
            );

            if (!Number.isFinite(price)) {
                throw new Error(
                    `Invalid price for "${name}"`
                );
            }

            products.push({ name, price });
        }

        return products;
    }

    // =========================
    // CO2 RATINGS
    // =========================

    async getVisibleCo2Ratings() {
        const cards = await this.sortingCompleted.$$(
            'a[data-test^="product-"]'
        );

        const products = [];

        for (const card of cards) {
            const name = (
                await card.$(
                    '[data-test="product-name"]'
                ).getText()
            ).trim();

            const ratingElement = await card.$(
                '[data-test="co2-rating-badge"] ' +
                '.co2-letter.active'
            );

            let rating = null;

            if (await ratingElement.isExisting()) {
                rating = (
                    await ratingElement.getText()
                ).trim();
            }

            products.push({ name, rating });
        }

        return products;
    }
}
