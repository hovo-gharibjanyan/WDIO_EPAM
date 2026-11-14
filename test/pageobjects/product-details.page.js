
import BasePage from './base.page.js';

class ProductDetailsPage extends BasePage {


    /**
     * Open product details by ID.
     *
     * @param {string} productId
     */
    async openById(productId) {

        if (typeof productId !== 'string' || !productId.trim()) {
            throw new Error('Product ID must be a non-empty string');
        }

        const path =
            `/product/${encodeURIComponent(productId.trim())}`;

        await super.open(path);

        await this.productName.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: `Product ${productId} did not load`
        });
    }


    // =========================
    // PRODUCT LOCATORS
    // =========================

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

    // =========================
    // CART LOCATORS
    // =========================

    get quantityInput() {
        return $('[data-test="quantity"]');
    }

    get addToCartButton() {
        return $('[data-test="add-to-cart"]');
    }

    // =========================
    // FAVORITES LOCATORS
    // =========================

    get addToFavoritesButton() {
        return $('[data-test="add-to-favorites"]');
    }

    get favoriteErrorToast() {
        return $('.toast-error .toast-message');
    }

    get favoriteSuccessToast() {
        return $('.toast-success .toast-message');
    }

    // =========================
    // PRODUCT INFORMATION
    // =========================

    async isDisplayed() {
        await this.productName.waitForDisplayed({
            timeout: 10000,
            timeoutMsg: 'Product details page did not load'
        });

        return await this.productName.isDisplayed();
    }

    async getName() {
        await this.productName.waitForDisplayed();

        return await this.getTrimmedText(this.productName);
    }

    async getPrice() {
        await this.productPrice.waitForDisplayed();

        const price = await this.getTrimmedText(
            this.productPrice
        );

        return `$${price}`;
    }

    async getCategory() {
        await this.productCategory.waitForDisplayed();

        return await this.getTrimmedText(
            this.productCategory
        );
    }

    async getBrand() {
        await this.productBrand.waitForDisplayed();

        return await this.getTrimmedText(
            this.productBrand
        );
    }

    // =========================
    // PRODUCT AVAILABILITY
    // =========================

    async isAvailableForPurchase() {
        const quantityEnabled =
            await this.quantityInput.isEnabled();

        const cartEnabled =
            await this.addToCartButton.isEnabled();

        return quantityEnabled && cartEnabled;
    }

    async waitForPurchaseAvailability() {
        try {
            await browser.waitUntil(
                async () =>
                    await this.isAvailableForPurchase(),
                {
                    timeout: 10000,
                    timeoutMsg:
                        'Purchase controls remained disabled'
                }
            );
        } catch (error) {
            await this.debugPurchaseControls();

            throw new Error(
                'Product is not available for purchase. ' +
                'Quantity input or Add to cart button ' +
                'remained disabled. ' +
                error.message
            );
        }
    }

    // =========================
    // DIAGNOSTICS
    // =========================

    async debugPurchaseControls() {
        const info = await browser.execute(() => {

            const button = document.querySelector(
                '[data-test="add-to-cart"]'
            );

            const quantity = document.querySelector(
                '[data-test="quantity"]'
            );

            if (!button) {
                return {
                    url: window.location.href,
                    error: 'Add to cart button not found'
                };
            }

            const rect = button.getBoundingClientRect();

            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            const coveringElement =
                document.elementFromPoint(x, y);

            return {
                url: window.location.href,

                buttonDisabled: button.disabled,

                buttonText:
                    button.textContent.trim(),

                buttonVisible:
                    rect.width > 0 &&
                    rect.height > 0,

                pointerEvents:
                    getComputedStyle(button).pointerEvents,

                quantityDisabled:
                    quantity?.disabled ?? null,

                quantityReadOnly:
                    quantity?.readOnly ?? null,

                elementAtButtonCenter:
                    coveringElement?.outerHTML.slice(0, 400)
                    ?? null,

                buttonReceivesClick:
                    button === coveringElement ||
                    button.contains(coveringElement)
            };
        });

        console.log(
            'PURCHASE DIAGNOSTICS:',
            JSON.stringify(info, null, 2)
        );

        return info;
    }

    // =========================
    // CART ACTIONS
    // =========================

    async setQuantity(quantity) {
        await this.quantityInput.waitForDisplayed({
            timeout: 10000
        });

        await this.waitForPurchaseAvailability();

        await this.quantityInput.setValue(
            String(quantity)
        );
    }

    async addToCart() {
        await this.addToCartButton.waitForDisplayed({
            timeout: 10000
        });

        await this.waitForPurchaseAvailability();

        try {
            await this.addToCartButton.waitForClickable({
                timeout: 10000
            });

            await this.addToCartButton.click();

        } catch (error) {
            await this.debugPurchaseControls();

            throw new Error(
                'Could not click Add to cart. ' +
                error.message
            );
        }
    }

    // =========================
    // FAVORITES ACTIONS
    // =========================

    async addToFavorites() {
        await this.addToFavoritesButton.waitForClickable({
            timeout: 10000
        });

        await this.addToFavoritesButton.click();
    }

    async getFavoriteErrorMessage() {
        await this.favoriteErrorToast.waitForDisplayed({
            timeout: 10000,
            timeoutMsg:
                'Favorites error notification did not appear'
        });

        return await this.getTrimmedText(
            this.favoriteErrorToast
        );
    }
}

export default new ProductDetailsPage();
