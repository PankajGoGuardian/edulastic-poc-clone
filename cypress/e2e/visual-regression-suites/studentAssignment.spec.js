/* eslint-disable cypress/no-unnecessary-waiting */
import FileHelper from "../framework/util/fileHelper";
import StudentTestPage from "../framework/student/studentTestPage";
import { assignedTests } from "../framework/testdata/visualRegression";

const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");
const test = new StudentTestPage();
const allTestIds = Object.keys(assignedTests);
const assignmentURL = [
  "/student/assessment/5de8ce86c05b97000826d0ae/class/5d53b53af7efc82f60100347/uta/5de8df5f612991000874eaa7/qid"
];
/* const assignmentURL = [
  "/student/assessment/5dc3e3018286cb00071c326b/class/5d53b53af7efc82f60100347/uta/5dc3fe580e43cf000724ffa9/qid",
  "/student/assessment/5dc3bea2b38694000706b3af/class/5d53b53af7efc82f60100347/uta/5dc3fe6a66cdd400074ce6c2/qid",
  "/student/assessment/5dc2c932a226b700089e0576/class/5d53b53af7efc82f60100347/uta/5dc3fe7a6103150008e97fb7/qid",
  "student/assessment/5dc2cf06b0f83c000799480a/class/5d53b53af7efc82f60100347/uta/5dc3fe862ab139000860fa3c/qid",
  "/student/assessment/5dc2a85243e5bb0008cae586/class/5d53b53af7efc82f60100347/uta/5dc3fe936103150008e97fb8/qid",
  "/student/assessment/5dc27818474ba500079b39eb/class/5d53b53af7efc82f60100347/uta/5dc3fe9c2ab139000860fa3d/qid"
]; */
describe(`${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  before("set token", () => {
    cy.fixture("usersVisualRegression").then(allusers => {
      const { username, password } = allusers.default.student;
      cy.setToken(username, password); // setting auth token for student user
    });
  });

  allTestIds.forEach(testId => {
    const pageURL = assignmentURL.filter(url => url.includes(testId))[0];
    const items = assignedTests[testId];

    SCREEN_SIZES.forEach(size => {
      context(`Assessment Player-${testId}-${size}`, () => {
        before("set token", () => {
          cy.setResolution(size);
          cy.visit(`/${pageURL}/0`);
          cy.wait(1000);
        });

        items.forEach((item, index) => {
          const { itemId } = item;
          const queNum = `Question ${parseInt(index, 10) + 1}`;
          it(`>${queNum}-${itemId}-'${size}'`, () => {
            cy.setResolution(size);
            test.getQueDropDown().click();
            cy.contains(`${queNum}/ ${items.length}`).click({ force: true });
            cy.wait(2000); // allow que to render before taking screenshot
            cy.matchImageSnapshotWithSize();
            cy.isPageScrollPresent().then(({ hasScroll }) => {
              if (hasScroll) cy.scrollPageAndMatchImageSnapshots(50);
            });
          });
        });

        it(`> review page-'${size}'`, () => {
          cy.setResolution(size);
          test.getQueDropDown().click();
          cy.contains(`Question ${items.length}/ ${items.length}`).click({ force: true });
          cy.wait(2000);
          test.clickOnNext();
          cy.matchImageSnapshotWithSize();
          cy.isPageScrollPresent().then(({ hasScroll }) => {
            if (hasScroll) cy.scrollPageAndMatchImageSnapshots(50);
          });
        });
      });
    });
  });
});
