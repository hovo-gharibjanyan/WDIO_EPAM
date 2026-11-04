export default class BasePage {

    async open(path) {
        await browser.url(path);
    }

    async getCurrentUrl() {
        return await browser.getUrl();
    }

}
