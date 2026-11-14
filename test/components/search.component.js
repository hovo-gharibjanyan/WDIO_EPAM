export default class SearchComponent {

    // =========================
    // LOCATORS
    // =========================

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

    // =========================
    // ACTIONS
    // =========================

    async searchFor(searchTerm) {
        await this.searchInput.waitForDisplayed();

        await this.searchInput.setValue(searchTerm);

        await this.searchButton.click();

        await this.searchCompleted.waitForDisplayed({
            timeout: 15000,
            timeoutMsg: `Search did not complete for "${searchTerm}"`
        });
    }

    // =========================
    // DATA
    // =========================

    async getSearchTerm() {
        return (await this.searchTermLabel.getText()).trim();
    }

    async getVisibleProductNames() {
        const elements = await this.searchCompleted.$$(
            '[data-test="product-name"]'
        );

        const names = [];

        for (const element of elements) {
            names.push(
                (await element.getText()).trim()
            );
        }

        return names;
    }
}
