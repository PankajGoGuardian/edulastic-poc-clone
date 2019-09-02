import FileHelper from "../framework/util/fileHelper";
import TestLibrary from "../framework/author/tests/testLibraryPage";
import SearchFilters from "../framework/author/searchFiltersPage";

const testLibraryPage = new TestLibrary();
const search = new SearchFilters();
const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");

describe(`visual regression tests - ${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  before("set token", () => {
    cy.setToken("auto.test.vvk.teacher01@snapwiz.com", "edulastic"); // setting auth token for teacher user
  });

  context(`teacher test library page`, () => {
    const pageURL = "author/tests";

    SCREEN_SIZES.forEach(size => {
      it(`List view, when resolution is '${size}'`, () => {
        cy.setResolution(size); // set the screen resolution
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@searchTest");
        search.clearAll();
        cy.wait("@searchTest");
        search.getAuthoredByMe();
        testLibraryPage.clickOnListView();
        cy.contains("published").should("be.visible");
        search.scrollFiltersToTop();
        cy.matchImageSnapshot(); // take screenshot and compare
      });

      it(`Tile view, when resolution is '${size}'`, () => {
        cy.setResolution(size); // set the screen resolution
        testLibraryPage.clickOnTileView();
        cy.contains("View").should("be.visible");
        search.scrollFiltersToTop();
        cy.matchImageSnapshot(); // take screenshot and compare
      });
    });
  });
});
