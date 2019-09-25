/* eslint-disable cypress/no-unnecessary-waiting */
import FileHelper from "../framework/util/fileHelper";
import TestLibrary from "../framework/author/tests/testLibraryPage";

const SCREEN_SIZES = [[1600, 900], [1366, 768], [1024, 650]]; // Cypress.config("SCREEN_SIZES");
const testUrl = "author/tests/5d8a008333ac9af288c03bce";
const testLibraryPage = new TestLibrary();

describe(`visual regression tests - ${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  before("set token", () => {
    cy.fixture("users").then(users => {
      const user = users["visual-regression"].teacher;
      cy.setToken(user.username, user.password); // setting auth token for teacher user
    });
  });

  context(`Author Test`, () => {
    const pageURL = "author/tests/select";
    SCREEN_SIZES.forEach(size => {
      it(`when resolution is '${size}'`, () => {
        cy.setResolution(size);
        cy.visit(`/${pageURL}`);
        cy.contains("Create from Scratch").should("be.visible");
        cy.matchImageSnapshot();
      });

      it(`test-description when resolution is - '${size}'`, () => {
        cy.setResolution(size);
        cy.visit(`/${testUrl}`);
        cy.wait("@testdetail");
        cy.wait(1000);
        cy.matchImageSnapshot();
      });

      it(`test-additem when resolution is - '${size}'`, () => {
        cy.setResolution(size);
        testLibraryPage.header.clickOnAddItems();
        testLibraryPage.searchFilters.clearAll();
        testLibraryPage.testAddItem.authoredByMe();
        cy.wait(1000);
        cy.matchImageSnapshot();
      });

      it(`test-review when resolution is - '${size}'`, () => {
        cy.setResolution(size);
        testLibraryPage.header.clickOnReview();
        cy.wait(1000);
        cy.matchImageSnapshot();
      });
    });
  });
});
