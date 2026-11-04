import BasePage from './base.page.js';

class CheckoutPage extends BasePage {

    // ELEMENTS

    get guestTab() {
        return $('a[href="#guest-tab"]');
    }

    get guestEmail() {
        return $('[data-test="guest-email"]');
    }

    get guestFirstName() {
        return $('[data-test="guest-first-name"]');
    }

    get guestLastName() {
        return $('[data-test="guest-last-name"]');
    }

    get guestSubmit() {
        return $('[data-test="guest-submit"]');
    }

    get proceedGuest() {
        return $('[data-test="proceed-2-guest"]');
    }

    get proceedAddress() {
        return $('[data-test="proceed-3"]');
    }

    get paymentMethod() {
        return $('[data-test="payment-method"]');
    }

    get finishButton() {
        return $('[data-test="finish"]');
    }

    get paymentSuccessMessage() {
        return $('[data-test="payment-success-message"]');
    }

    get invoiceNumber() {
        return $('#order-confirmation span');
    }

    // GUEST CHECKOUT

    async continueAsGuest({ email, firstName, lastName }) {

        await this.guestTab.waitForClickable();
        await this.guestTab.click();

        await this.guestEmail.setValue(email);
        await this.guestFirstName.setValue(firstName);
        await this.guestLastName.setValue(lastName);

        await this.guestSubmit.waitForClickable();
        await this.guestSubmit.click();

        await this.proceedGuest.waitForClickable();
        await this.proceedGuest.click();
    }

    // BILLING ADDRESS

    async fillBillingAddress(address) {

        const countryInput = $('[data-test="country"]');
        const postalCodeInput = $('[data-test="postal_code"]');
        const houseNumberInput = $('[data-test="house_number"]');

        await countryInput.waitForDisplayed();

        await countryInput.selectByAttribute(
            'value',
            address.country
        );

        await postalCodeInput.setValue(
            address.postalCode
        );

        await houseNumberInput.setValue(
            address.houseNumber
        );

        await browser.waitUntil(
            async () => {

                const lookupError = $(
                    '[data-test="postcode-lookup-error"]'
                );

                if (await lookupError.isExisting()) {
                    throw new Error(
                        `Address lookup failed: ${await lookupError.getText()}`
                    );
                }

                const loading = await $(
                    '[data-test="postcode-lookup-loading"]'
                ).isExisting();

                const street = await $(
                    '[data-test="street"]'
                ).getValue();

                const city = await $(
                    '[data-test="city"]'
                ).getValue();

                const state = await $(
                    '[data-test="state"]'
                ).getValue();

                return (
                    !loading &&
                    street.trim() !== '' &&
                    city.trim() !== '' &&
                    state.trim() !== ''
                );

            },
            {
                timeout: 20000,
                timeoutMsg: 'Billing address was not filled automatically'
            }
        );

        await this.proceedAddress.waitForClickable();
        await this.proceedAddress.click();
    }

    // DIAGNOSTICS

    async getCheckoutDiagnostics() {

        return await browser.execute(() => {

            const confirmation = document.querySelector(
                '#order-confirmation'
            );

            const invoice = document.querySelector(
                '#invoice-number'
            );

            const paymentError = document.querySelector(
                '[data-test="payment-error-message"]'
            );

            const paymentSuccess = document.querySelector(
                '[data-test="payment-success-message"]'
            );

            const finishButton = document.querySelector(
                '[data-test="finish"]'
            );

            return {
                confirmationExists: Boolean(confirmation),

                confirmationHTML:
                    confirmation?.outerHTML ?? null,

                invoiceExists: Boolean(invoice),

                invoiceText:
                    invoice?.textContent?.trim() ?? null,

                paymentError:
                    paymentError?.textContent?.trim() ?? null,

                paymentSuccess:
                    paymentSuccess?.textContent?.trim() ?? null,

                finishButtonText:
                    finishButton?.textContent?.trim() ?? null,

                currentUrl: window.location.href
            };
        });
    }

    // PAYMENT


    async payWithCashOnDelivery() {

        await this.paymentMethod.waitForDisplayed();

        await this.paymentMethod.selectByAttribute(
            'value',
            'cash-on-delivery'
        );

        await this.finishButton.waitForClickable();
        await this.finishButton.click();

        await this.paymentSuccessMessage.waitForDisplayed({
            timeout: 15000,
            timeoutMsg: 'Payment validation failed'
        });

        await this.finishButton.waitForClickable();
        await this.finishButton.click();

        await this.invoiceNumber.waitForDisplayed({
            timeout: 20000,
            timeoutMsg: 'Order confirmation did not appear'
        });

        const invoiceNumber = (
            await this.invoiceNumber.getText()
        ).trim();

        if (!invoiceNumber) {
            throw new Error('Invoice number is empty');
        }

        return invoiceNumber;
    }


}

export default new CheckoutPage();
