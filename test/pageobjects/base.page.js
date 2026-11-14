import Header from '../components/header.component.js';

export default class BasePage {

    constructor(path = '/') {
        this.path = path;
        this.header = new Header();
    }

    async open(path = this.path) {
        await browser.url(path);
    }

    async getCurrentUrl() {
        return await browser.getUrl();
    }

    async getTrimmedText(element) {
        return (await element.getText()).trim();
    }
}
