import BasePage from './base.page.js';
const PAYMENT_METHODS = {
    cashOnDelivery: 'cash-on-delivery'
};
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


    // BILLING ADDRESS LOCATORS

    get countryInput() {
        return $('[data-test="country"]');
    }

    get postalCodeInput() {
        return $('[data-test="postal_code"]');
    }

    get houseNumberInput() {
        return $('[data-test="house_number"]');
    }

    get streetInput() {
        return $('[data-test="street"]');
    }

    get cityInput() {
        return $('[data-test="city"]');
    }

    get stateInput() {
        return $('[data-test="state"]');
    }

    get postcodeLookupError() {
        return $('[data-test="postcode-lookup-error"]');
    }

    get postcodeLookupLoading() {
        return $('[data-test="postcode-lookup-loading"]');
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



    // =========================
    // BILLING ADDRESS
    // =========================

    /**
     * Enter address information for postcode lookup.
     *
     * @param {Object} address
     * @param {string} address.country
     * @param {string} address.postalCode
     * @param {string} address.houseNumber
     */
    async enterAddressLookupData(address) {

        await this.countryInput.waitForDisplayed();

        await this.countryInput.selectByAttribute(
            'value',
            address.country
        );

        await this.postalCodeInput.setValue(
            address.postalCode
        );

        await this.houseNumberInput.setValue(
            address.houseNumber
        );
    }

    /**
     * Wait until address fields are automatically filled.
     */
    async waitForAddressAutofill() {

        await browser.waitUntil(
            async () => {

                if (await this.postcodeLookupError.isExisting()) {
                    throw new Error(
                        'Address lookup failed: ' +
                        await this.postcodeLookupError.getText()
                    );
                }

                const loading =
                    await this.postcodeLookupLoading.isExisting();

                const street =
                    await this.streetInput.getValue();

                const city =
                    await this.cityInput.getValue();

                const state =
                    await this.stateInput.getValue();

                return (
                    !loading &&
                    street.trim() !== '' &&
                    city.trim() !== '' &&
                    state.trim() !== ''
                );

            },
            {
                timeout: 20000,
                timeoutMsg:
                    'Billing address was not filled automatically'
            }
        );
    }

    /**
     * Fill billing address and proceed to payment.
     *
     * @param {Object} address
     * @param {string} address.country
     * @param {string} address.postalCode
     * @param {string} address.houseNumber
     */
    async fillBillingAddress(address) {

        await this.enterAddressLookupData(address);

        await this.waitForAddressAutofill();

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
            '#order-confirmation span'
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
            currentUrl: window.location.href,

            confirmationExists: Boolean(confirmation),

            invoiceExists: Boolean(invoice),

            invoiceText:
                invoice?.textContent?.trim() ?? null,

            paymentError:
                paymentError?.textContent?.trim() ?? null,

            paymentSuccess:
                paymentSuccess?.textContent?.trim() ?? null,

            finishButtonVisible:
                Boolean(finishButton?.getClientRects().length),

            finishButtonDisabled:
                finishButton?.disabled ?? null
        };
    });
}


    // PAYMENT



    // =========================
    // PAYMENT
    // =========================

    /**
     * Select payment method.
     *
     * @param {string} method
     */
    async selectPaymentMethod(method) {

        const paymentValue = PAYMENT_METHODS[method];

        if (!paymentValue) {
            throw new Error(
                `Unsupported payment method: ${method}`
            );
        }

        await this.paymentMethod.waitForDisplayed();

        await this.paymentMethod.selectByAttribute(
            'value',
            paymentValue
        );
    }

    /**
     * Confirm payment.
     */
    async confirmPayment() {

        await this.finishButton.waitForClickable();

        await this.finishButton.click();

        await this.paymentSuccessMessage.waitForDisplayed({
            timeout: 15000,
            timeoutMsg: 'Payment validation failed'
        });
    }

    /**
     * Place the order and return invoice number.
     *
     * @returns {Promise<string>}
     */
    
async placeOrder() {

    await this.finishButton.waitForClickable();

    await this.finishButton.click();

    await this.invoiceNumber.waitForDisplayed({
        timeout: 20000,
        timeoutMsg: 'Order confirmation did not appear'
    });

    const invoiceNumber = await this.getTrimmedText(
        this.invoiceNumber
    );

    if (!invoiceNumber) {
        throw new Error('Invoice number is empty');
    }

    return invoiceNumber;
}


    /**
     * Complete payment and return invoice number.
     *
     * @param {string} method
     * @returns {Promise<string>}
     */
    
async pay(method) {
    try {
        await this.selectPaymentMethod(method);

        await this.confirmPayment();

        return await this.placeOrder();

    } catch (error) {

        try {
            const diagnostics =
                await this.getCheckoutDiagnostics();

            console.error(
                'CHECKOUT DIAGNOSTICS:',
                JSON.stringify(diagnostics, null, 2)
            );

        } catch (diagnosticError) {
            console.error(
                'Could not collect checkout diagnostics:',
                diagnosticError.message
            );
        }

        throw error;
    }
}




}

export default new CheckoutPage();
