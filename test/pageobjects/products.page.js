import BasePage from './base.page.js';

class ProductsPage extends BasePage {

    get pageBody() {
        return $('body');
    }

    async open() {
        await super.open('/');
    }

    async isDisplayed() {
        return await this.pageBody.isDisplayed();
    }


    async openProductByName(productName) {

        await browser.waitUntil(
            async () => {
                const products = await $$('[data-test="product-name"]');
                return products.length > 0;
            },
            {
                timeout: 15000,
                timeoutMsg: 'Products did not load'
            }
        );

        const productElements = await $$('[data-test="product-name"]');

        for (const element of productElements) {

            const name = (await element.getText()).trim();

            if (name === productName) {
                await element.click();
                return;
            }
        }

        throw new Error(`Product not found: ${productName}`);
    }



    get searchInput() {
        return $('[data-test="search-query"]');
    }

    get searchButton() {
        return $('[data-test="search-submit"]');
    }

    get searchCompleted() {
        return $('[data-test="search_completed"]');
    }

    get searchTermLabel() {
        return $('[data-test="search-term"]');
    }

    async searchFor(searchTerm) {
        await this.searchInput.waitForDisplayed();

        await this.searchInput.setValue(searchTerm);

        await this.searchButton.click();

        await this.searchCompleted.waitForDisplayed({
            timeout: 15000,
            timeoutMsg: `Search did not complete for "${searchTerm}"`
        });
    }

    async getSearchTerm() {
        return (await this.searchTermLabel.getText()).trim();
    }

    async getVisibleProductNames() {
        const elements = await this.searchCompleted.$$(
            '[data-test="product-name"]'
        );

        const names = [];

        for (const element of elements) {
            const name = (await element.getText()).trim();
            names.push(name);
        }

        return names;
    }




    get sortSelect() {
        return $('[data-test="sort"]');
    }

    get sortingCompleted() {
        return $('[data-test="sorting_completed"]');
    }

    async getSelectedSortValue() {
        return await this.sortSelect.getValue();
    }

    async selectSortOption(sortOption) {
        await this.sortSelect.waitForDisplayed();

        await this.sortSelect.selectByVisibleText(sortOption);

        await this.sortingCompleted.waitForDisplayed({
            timeout: 15000,
            timeoutMsg: `Sorting did not finish: ${sortOption}`
        });
    }

    async getSelectedSortText() {
        const option = await this.sortSelect.$('option:checked');

        return (await option.getText()).trim();
    }

    async getVisibleProductData() {
        const cards = await this.sortingCompleted.$$(
            'a[data-test^="product-"]'
        );

        const products = [];

        for (const card of cards) {
            const name = (
                await card.$('[data-test="product-name"]').getText()
            ).trim();

            const priceText = await card
                .$('[data-test="product-price"]')
                .getText();

            const price = Number(
                priceText.replace(/[^0-9.]/g, '')
            );

            if (!Number.isFinite(price)) {
                throw new Error(`Invalid price for "${name}"`);
            }

            products.push({ name, price });
        }

        return products;
    }


    async getVisibleCo2Ratings() {
        const cards = await this.sortingCompleted.$$(
            'a[data-test^="product-"]'
        );

        const products = [];

        for (const card of cards) {
            const name = (
                await card.$('[data-test="product-name"]').getText()
            ).trim();

            const ratingElement = await card.$(
                '[data-test="co2-rating-badge"] .co2-letter.active'
            );

            let rating = null;

            if (await ratingElement.isExisting()) {
                rating = (await ratingElement.getText()).trim();
            }

            products.push({ name, rating });
        }

        return products;
    }


    async getAllCo2Ratings() {
        const pageButtons = await $$(
            'app-pagination button[aria-label^="Page-"]'
        );

        const totalPages = Math.max(1, pageButtons.length);
        const allProducts = [];

        for (let page = 1; page <= totalPages; page++) {

            if (page > 1) {
                const previousCards = await this.sortingCompleted.$$(
                    'a[data-test^="product-"]'
                );

                const previousFirstId = await previousCards[0]
                    .getAttribute('data-test');

                const pageButton = await $(
                    `app-pagination button[aria-label="Page-${page}"]`
                );

                await pageButton.click();

                await browser.waitUntil(
                    async () => {
                        const activePage = await $(
                            `app-pagination .page-item.active button[aria-label="Page-${page}"]`
                        ).isExisting();

                        const cards = await this.sortingCompleted.$$(
                            'a[data-test^="product-"]'
                        );

                        if (!activePage || cards.length === 0) {
                            return false;
                        }

                        const firstId = await cards[0]
                            .getAttribute('data-test');

                        return firstId !== previousFirstId;
                    },
                    {
                        timeout: 15000,
                        timeoutMsg: `Page ${page} did not load`
                    }
                );
            }

            const products = await this.getVisibleCo2Ratings();
            allProducts.push(...products);
        }

        return allProducts;
    }





    async getCategoryCheckbox(categoryName) {
        await browser.waitUntil(
            async () => {
                const inputs = await $$('#filters input[name="category_id"]');
                return inputs.length > 0;
            },
            {
                timeout: 10000,
                timeoutMsg: 'Categories did not load'
            }
        );

        const labels = await $$('#filters .checkbox > label');

        for (const label of labels) {
            const name = (await label.getText()).trim();

            if (name === categoryName) {
                return await label.$('input[name="category_id"]');
            }
        }

        throw new Error(`Category not found: ${categoryName}`);
    }

    async selectCategory(categoryName) {
        const checkbox = await this.getCategoryCheckbox(categoryName);

        await checkbox.click();

        await $('[data-test="filter_completed"]').waitForDisplayed({
            timeout: 15000,
            timeoutMsg: `Filtering failed for ${categoryName}`
        });
    }



    async getVisibleProductUrls(state = 'filter_completed') {
        const cards = await $$(
            `[data-test="${state}"] a[data-test^="product-"]`
        );

        const currentUrl = await browser.getUrl();
        const urls = [];

        for (const card of cards) {
            const href = await card.getAttribute('href');

            if (!href) {
                throw new Error('Product link has no href');
            }

            urls.push(new URL(href, currentUrl).toString());
        }

        return urls;
    }




}

export default new ProductsPage();
