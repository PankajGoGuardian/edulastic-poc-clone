/* eslint-disable cypress/no-unnecessary-waiting */
import FileHelper from "../framework/util/fileHelper";
import TestLibrary from "../framework/author/tests/testLibraryPage";
import { screenSizes } from "../framework/constants/visual";

const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");
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
        // for mobile
        if (size[0] < screenSizes.MAX_TAB_WIDTH)
          cy.isPageScrollPresent().then(({ hasScroll }) => {
            if (hasScroll) cy.scrollPageAndMatchImageSnapshots(50);
          });
      });

      it(`test-description when resolution is - '${size}'`, () => {
        cy.setResolution(size);
        cy.visit(`/${testUrl}`);
        cy.wait("@testdetail");
        testLibraryPage.header.clickOnDescription();
        cy.wait(1000);
        cy.matchImageSnapshot();
        // for mobile
        cy.isPageScrollPresent().then(({ hasScroll }) => {
          if (hasScroll) cy.scrollPageAndMatchImageSnapshots();
        });
      });

      it(`test-additem when resolution is - '${size}'`, () => {
        cy.setResolution(size);
        testLibraryPage.header.clickOnAddItems();
        cy.wait("@testdetail");
        if (size[0] < screenSizes.MAX_MOBILE_WIDTH) testLibraryPage.header.clickOnfilters();
        testLibraryPage.searchFilters.clearAll();
        testLibraryPage.testAddItem.authoredByMe();
        if (size[0] < screenSizes.MAX_MOBILE_WIDTH) testLibraryPage.header.closeFilter();
        cy.wait(1000);
        cy.matchImageSnapshot();
      });

      it(`test-review when resolution is - '${size}'`, () => {
        cy.setResolution(size);
        cy.visit(`/${testUrl}`);
        testLibraryPage.header.clickOnReview();
        cy.wait(1000);
        cy.matchImageSnapshot();
        // for mobile
        cy.isPageScrollPresent().then(({ hasScroll }) => {
          if (hasScroll) cy.scrollPageAndMatchImageSnapshots();
        });
      });
    });
  });

  context(`Assign Test`, () => {
    const pageURL = "author/assignments/5d89ff138ff65a5b679c7910";
    SCREEN_SIZES.forEach(size => {
      it(`when resolution is '${size}'`, () => {
        cy.setResolution(size);
        cy.visit(`/${pageURL}`);
        cy.contains("Test Visual Automation").should("be.visible");
        cy.matchImageSnapshot();
        // for mobile
        cy.isPageScrollPresent().then(({ hasScroll }) => {
          if (hasScroll) cy.scrollPageAndMatchImageSnapshots();
        });
      });
    });
  });
});
