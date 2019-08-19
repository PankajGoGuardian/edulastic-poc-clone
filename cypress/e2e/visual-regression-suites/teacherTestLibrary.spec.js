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
    SCREEN_SIZES.forEach(size => {
      const pageURL = "author/tests";

      it(`List view, when resolution is '${size}'`, () => {
        cy.setResolution(size); // set the screen resolution
        cy.visit(`/${pageURL}`); // go to the required page usign url
        //search.clearAll();
        search.setCollection("Private Library");
        testLibraryPage.clickOnListView();
        cy.contains("published").should("be.visible");
        cy.matchImageSnapshot(); // take screenshot and compare
      });

      it(`Tile view, when resolution is '${size}'`, () => {
        cy.setResolution(size); // set the screen resolution
        cy.visit(`/${pageURL}`); // go to the required page usign url
        //search.clearAll();
        search.setCollection("Private Library");
        testLibraryPage.clickOnTileView();
        cy.contains("View").should("be.visible");
        cy.matchImageSnapshot(); // take screenshot and compare
      });
    });
  });
});
