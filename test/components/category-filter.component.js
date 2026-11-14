export default class CategoryFilterComponent {

    // =========================
    // LOCATORS
    // =========================

    get filterCompleted() {
        return $('[data-test="filter_completed"]');
    }

    // =========================
    // CATEGORY FILTER
    // =========================

    async getCategoryCheckbox(categoryName) {

        await browser.waitUntil(
            async () => {
                const inputs = await $$(
                    '#filters input[name="category_id"]'
                );

                return inputs.length > 0;
            },
            {
                timeout: 10000,
                timeoutMsg: 'Categories did not load'
            }
        );

        const labels = await $$(
            '#filters .checkbox > label'
        );

        for (const label of labels) {

            const name = (
                await label.getText()
            ).trim();

            if (name === categoryName) {
                return await label.$(
                    'input[name="category_id"]'
                );
            }
        }

        throw new Error(
            `Category not found: ${categoryName}`
        );
    }

    async selectCategory(categoryName) {

        const checkbox =
            await this.getCategoryCheckbox(categoryName);

        await checkbox.click();

        await this.filterCompleted.waitForDisplayed({
            timeout: 15000,
            timeoutMsg:
                `Filtering failed for ${categoryName}`
        });
    }
}
