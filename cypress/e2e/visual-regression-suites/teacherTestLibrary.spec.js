import FileHelper from "../framework/util/fileHelper";
import TestLibrary from "../framework/author/tests/testLibraryPage";
import SearchFilters from "../framework/author/searchFiltersPage";

const testLibraryPage = new TestLibrary();
const search = new SearchFilters();
const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");

describe(`${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  before("set token", () => {
    cy.fixture("usersVisualRegression").then(allusers => {
      const { username, password } = allusers.default.teacher;
      cy.setToken(username, password); // setting auth token for teacher user
    });
  });

  context(`teacher test library page`, () => {
    const pageURL = "author/tests";

    SCREEN_SIZES.forEach(size => {
      it(`List view, when resolution is '${size}'`, () => {
        cy.setResolution(size); // set the screen resolution
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@searchTest");
        search.clearAll();
        // cy.wait("@searchTest");
        search.getAuthoredByMe();
        testLibraryPage.clickOnListView();
        cy.contains("published").should("be.visible");
        search.scrollFiltersToTop();
        cy.matchImageSnapshotWithSize(); // take screenshot and compare
      });

      it(`Tile view, when resolution is '${size}'`, () => {
        cy.setResolution(size); // set the screen resolution
        testLibraryPage.clickOnTileView();
        cy.contains("published").should("be.visible");
        search.scrollFiltersToTop();
        cy.matchImageSnapshotWithSize(); // take screenshot and compare
      });
    });
  });
});
