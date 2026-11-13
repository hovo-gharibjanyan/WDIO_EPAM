import BasePage from './base.page.js';

class LoginPage extends BasePage {

    constructor() {
        super('/auth/login');
    }

    get loginForm() {
        return $('[data-test="login-form"]');
    }

    get emailInput() {
        return $('[data-test="email"]');
    }

    get passwordInput() {
        return $('[data-test="password"]');
    }

    get loginButton() {
        return $('[data-test="login-submit"]');
    }

    async waitForLoaded() {
        await this.loginForm.waitForDisplayed({
            timeout: 15000,
            timeoutMsg: 'Login form did not load'
        });
    }

    async signIn(email, password) {
        await this.emailInput.setValue(email);
        await this.passwordInput.setValue(password);
        await this.loginButton.click();
    }

    async loginAs(user) {
        await this.open();
        await this.waitForLoaded();
        await this.signIn(user.email, user.password);
    }
}

export default new LoginPage();
