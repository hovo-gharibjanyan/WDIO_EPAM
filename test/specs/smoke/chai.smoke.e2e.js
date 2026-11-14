
import {
  assert,
  expect as chaiExpect,
  should
} from 'chai';

should();

describe('Chai integration test', () => {
  it('should verify the home page', async () => {
    await browser.url('https://practicesoftwaretesting.com/');

    const currentUrl = await browser.getUrl();
    const title = await browser.getTitle();
    const bodyIsDisplayed = await $('body').isDisplayed();

    // Chai Assert
    assert.include(currentUrl, 'practicesoftwaretesting.com');

    // Chai Expect
    chaiExpect(bodyIsDisplayed).to.equal(true);

    // Chai Should
    title.should.be.a('string').and.not.be.empty;
  });
});
