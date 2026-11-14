import BasePage from './base.page.js';
import SearchComponent from '../components/search.component.js';
import SortComponent from '../components/sort.component.js';
import CategoryFilterComponent from '../components/category-filter.component.js';
import PaginationComponent from '../components/pagination.component.js';

class ProductsPage extends BasePage {

    sort = new SortComponent();
    search = new SearchComponent();
    categoryFilter = new CategoryFilterComponent();
    pagination = new PaginationComponent(this.sort);
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
        const matchingProducts = await browser.execute((name) => {
            return [...document.querySelectorAll(
                '[data-test="product-name"]'
            )]
                .filter(el => el.textContent.trim() === name)
                .map(el => ({
                    name: el.textContent.trim(),
                    url: el.closest('a')?.href ?? null
                }));
        }, productName);

        console.log(
            'MATCHING PRODUCTS:',
            JSON.stringify(matchingProducts, null, 2)
        );

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
        return await this.search.searchFor(searchTerm);
    }

    async getSearchTerm() {
        return await this.search.getSearchTerm();
    }

    async getVisibleProductNames() {
        return await this.search.getVisibleProductNames();
    }



    get sortSelect() {
        return this.sort.sortSelect;
    }

    get sortingCompleted() {
        return this.sort.sortingCompleted;
    }
    async getSelectedSortValue() {
        return await this.sort.getSelectedSortValue();
    }

    async selectSortOption(sortOption) {
        return await this.sort.selectSortOption(sortOption);
    }

    async getSelectedSortText() {
        return await this.sort.getSelectedSortText();
    }

    async getVisibleProductData() {
        return await this.sort.getVisibleProductData();
    }


    async getVisibleCo2Ratings() {
        return await this.sort.getVisibleCo2Ratings();
    }

    
async getAllCo2Ratings() {
    return await this.pagination.getAllCo2Ratings();
}


async getTotalPages() {
    return await this.pagination.getTotalPages();
}

async goToPage(pageNumber) {
    return await this.pagination.goToPage(pageNumber);
}





    async getCategoryCheckbox(categoryName) {
        return await this.categoryFilter.getCategoryCheckbox(
            categoryName
        );
    }

    async selectCategory(categoryName) {
        return await this.categoryFilter.selectCategory(
            categoryName
        );
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
