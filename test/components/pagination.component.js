export default class PaginationComponent {

    constructor(sortComponent) {
        this.sort = sortComponent;
    }

    // =========================
    // LOCATORS
    // =========================

    get pageButtons() {
        return $$(
            'app-pagination button[aria-label^="Page-"]'
        );
    }

    get productCards() {
        return this.sort.sortingCompleted.$$(
            'a[data-test^="product-"]'
        );
    }

    // =========================
    // PAGE COUNT
    // =========================

    async getTotalPages() {
        const buttons = await this.pageButtons;

        return Math.max(1, buttons.length);
    }

    // =========================
    // PAGE NAVIGATION
    // =========================

    async goToPage(pageNumber) {

        const cards = await this.productCards;

        if (cards.length === 0) {
            throw new Error(
                'No products available before pagination'
            );
        }

        const previousFirstId =
            await cards[0].getAttribute('data-test');

        const pageButton = await $(
            `app-pagination button[aria-label="Page-${pageNumber}"]`
        );

        await pageButton.waitForClickable();

        await pageButton.click();

        await browser.waitUntil(
            async () => {

                const activePage = await $(
                    'app-pagination .page-item.active ' +
                    `button[aria-label="Page-${pageNumber}"]`
                ).isExisting();

                const newCards = await this.productCards;

                if (!activePage || newCards.length === 0) {
                    return false;
                }

                const currentFirstId =
                    await newCards[0].getAttribute('data-test');

                return currentFirstId !== previousFirstId;
            },
            {
                timeout: 15000,
                timeoutMsg: `Page ${pageNumber} did not load`
            }
        );
    }

    // =========================
    // COLLECT CO2 RATINGS
    // =========================

    async getAllCo2Ratings() {

        const totalPages = await this.getTotalPages();

        const allProducts = [];

        for (let page = 1; page <= totalPages; page++) {

            if (page > 1) {
                await this.goToPage(page);
            }

            const products =
                await this.sort.getVisibleCo2Ratings();

            allProducts.push(...products);
        }

        return allProducts;
    }
}
