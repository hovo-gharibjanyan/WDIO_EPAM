import BasePage from './base.page.js';

class LoginPage extends BasePage {

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

    async open() {
        await super.open('/auth/login');
        await this.loginForm.waitForDisplayed();
    }

    async signIn(email, password) {
        await this.emailInput.setValue(email);
        await this.passwordInput.setValue(password);

        await this.loginButton.click();
    }
}

export default new LoginPage();
