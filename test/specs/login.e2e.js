import {
  assert,
  expect as chaiExpect,
  should
} from 'chai';

import { getScenarioExamples } from '../utils/feature-data.js';
import { getUserByAlias } from '../utils/test-users.js';

import LoginPage from '../pageobjects/login.page.js';
import AccountPage from '../pageobjects/account.page.js';

should();

const testCases = getScenarioExamples(
  'Sign in with a registered user'
);

describe('Sign in with a registered user', () => {

  beforeEach(async () => {
    await browser.reloadSession();
  });

  for (const { user, fullName } of testCases) {

    it(`should sign in as ${user}`, async () => {

      // 1. Get credentials from .env
      const credentials = getUserByAlias(user);

      // 2. Open login page
      await LoginPage.open();
      await LoginPage.waitForLoaded();

      assert.isTrue(
        await LoginPage.loginForm.isDisplayed()
      );

      // 3. Sign in
      await LoginPage.signIn(
        credentials.email,
        credentials.password
      );
      await AccountPage.waitForLoginResult();

      const isOnAccountPage =
        await AccountPage.isOnAccountPage();

      assert.isTrue(
        isOnAccountPage,
        isOnAccountPage
          ? ''
          : await AccountPage.getLoginDiagnostics()
      );



      // 5. Verify full name in account menu
      const actualFullName =
        await AccountPage.getFullName();

      chaiExpect(actualFullName).to.equal(fullName);

      actualFullName.should.equal(fullName);

    });

  }

});
