import BasePage from './base.page.js';

class AccountPage extends BasePage {

    constructor() {
        super('/account');
    }

    get loginError() {
        return $('[data-test="login-error"]');
    }

    get totpInput() {
        return $('[data-test="totp-code"]');
    }

    async isOnAccountPage() {
        const currentUrl = await browser.getUrl();
        const path = new URL(currentUrl).pathname;

        return path === this.path;
    }

    async waitForLoginResult() {
        await browser.waitUntil(
            async () => {
                const isAccountPage =
                    await this.isOnAccountPage();

                const hasLoginError =
                    await this.loginError.isDisplayed();

                const requiresTotp =
                    await this.totpInput.isDisplayed();

                return (
                    isAccountPage ||
                    hasLoginError ||
                    requiresTotp
                );
            },
            {
                timeout: 15000,
                timeoutMsg: 'Login result did not appear'
            }
        );
    }

    async getLoginErrorMessage() {
        await this.loginError.waitForDisplayed({
            timeout: 10000
        });

        return await this.getTrimmedText(this.loginError);
    }

    async getLoginDiagnostics() {
        const currentUrl = await browser.getUrl();

        const hasLoginError =
            await this.loginError.isDisplayed();

        const errorMessage = hasLoginError
            ? await this.getLoginErrorMessage()
            : 'No login error displayed';

        const requiresTotp =
            await this.totpInput.isDisplayed();

        const hasAuthToken = await browser.execute(
            () => Boolean(localStorage.getItem('auth-token'))
        );

        return (
            '\nLOGIN DIAGNOSTICS:\n' +
            `Current URL: ${currentUrl}\n` +
            `Login error: ${errorMessage}\n` +
            `TOTP required: ${requiresTotp}\n` +
            `Auth token present: ${hasAuthToken}`
        );
    }

    async getFullName() {
        return await this.header.getUserName();
    }
}

export default new AccountPage();
