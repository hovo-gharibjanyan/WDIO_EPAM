import BasePage from './base.page.js';

class ProductDetailsPage extends BasePage {

    // Locators
    get productName() {
        return $('[data-test="product-name"]');
    }

    get productPrice() {
        return $('[data-test="unit-price"]');
    }

    get productCategory() {
        return $('[aria-label="category"]');
    }

    get productBrand() {
        return $('[aria-label="brand"]');
    }

    // Actions / data getters
    async isDisplayed() {
        await this.productName.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Product details page did not load'
        });

        return await this.productName.isDisplayed();
    }

    async getName() {
        await this.productName.waitForDisplayed();
        return (await this.productName.getText()).trim();
    }

    async getPrice() {
        await this.productPrice.waitForDisplayed();

        const price = (await this.productPrice.getText()).trim();

        return `$${price}`;
    }

    async getCategory() {
        await this.productCategory.waitForDisplayed();

        return (await this.productCategory.getText()).trim();
    }

    async getBrand() {
        await this.productBrand.waitForDisplayed();

        return (await this.productBrand.getText()).trim();
    }


    get quantityInput() {
        return $('[data-test="quantity"]');
    }

    get addToCartButton() {
        return $('[data-test="add-to-cart"]');
    }

    async setQuantity(quantity) {
        await this.quantityInput.waitForDisplayed();

        await this.quantityInput.setValue(String(quantity));
    }

    async addToCart() {
        await this.addToCartButton.waitForClickable();

        await this.addToCartButton.click();
    }



    get addToFavoritesButton() {
        return $('[data-test="add-to-favorites"]');
    }

    get favoriteErrorToast() {
        return $('.toast-error .toast-message');
    }

    get favoriteSuccessToast() {
        return $('.toast-success .toast-message');
    }

    async addToFavorites() {
        await this.addToFavoritesButton.waitForClickable();
        await this.addToFavoritesButton.click();
    }

    async getFavoriteErrorMessage() {
        await this.favoriteErrorToast.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Unauthorized favorites error did not appear'
        });

        return (await this.favoriteErrorToast.getText()).trim();
    }

}

export default new ProductDetailsPage();
