import FileHelper from "../framework/util/fileHelper";
import SearchFilters from "../framework/author/searchFiltersPage";
import { screenSizes } from "../framework/constants/visual";
import ItemListPage from "../framework/author/itemList/itemListPage";

const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");
const pageURL = "author/items";
const search = new SearchFilters();

describe(`${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  before("set token", () => {
    cy.fixture("usersVisualRegression").then(allusers => {
      const { username, password } = allusers.teacherPlaylist;
      cy.setToken(username, password); // setting auth token for teacher user
    });
  });

  context(`'item bank' page`, () => {
    SCREEN_SIZES.forEach(size => {
      it(`- when resolution is '${size}'`, () => {
        cy.setResolution(size);
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@searchItem");
        search.clearAll();
        // cy.wait("@searchItem");
        search.getAuthoredByMe();
        search.scrollFiltersToTop();
        cy.matchImageSnapshotWithSize(); // take screenshot and comapare
      });
    });
  });
});
