import BasePage from './base.page.js';

class AccountPage extends BasePage {

    get accountMenu() {
        return $('[data-test="nav-menu"]');
    }

    get loginError() {
        return $('[data-test="login-error"]');
    }

    get totpInput() {
        return $('[data-test="totp-code"]');
    }

    async isDisplayed() {

        try {
            await browser.waitUntil(
                async () => {

                    const url = await browser.getUrl();
                    const path = new URL(url).pathname;

                    const hasError =
                        await this.loginError.isDisplayed();

                    const requiresTotp =
                        await this.totpInput.isDisplayed();

                    return (
                        path === '/account' ||
                        hasError ||
                        requiresTotp
                    );

                },
                {
                    timeout: 15000,
                    timeoutMsg: 'Login result did not appear'
                }
            );
        } catch {
            // Continue to collect diagnostic information
        }

        const currentUrl = await browser.getUrl();
        const path = new URL(currentUrl).pathname;

        if (path === '/account') {
            return true;
        }

        const errorMessage =
            await this.loginError.isDisplayed()
                ? await this.loginError.getText()
                : 'No login error displayed';

        const requiresTotp =
            await this.totpInput.isDisplayed();

        const hasAuthToken = await browser.execute(
            () => Boolean(localStorage.getItem('auth-token'))
        );

        throw new Error(
            '\nLOGIN DIAGNOSTICS:\n' +
            `Current URL: ${currentUrl}\n` +
            `Login error: ${errorMessage}\n` +
            `TOTP required: ${requiresTotp}\n` +
            `Auth token present: ${hasAuthToken}`
        );
    }

    async getFullName() {

        await this.accountMenu.waitForDisplayed({
            timeout: 15000,
            timeoutMsg: 'Account menu did not appear'
        });

        return (
            await this.accountMenu.getText()
        ).trim();
    }

}

export default new AccountPage();
