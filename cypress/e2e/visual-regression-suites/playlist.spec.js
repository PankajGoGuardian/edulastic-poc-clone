import FileHelper from "../framework/util/fileHelper";
import SearchFilters from "../framework/author/searchFiltersPage";
import TestLibrary from "../framework/author/tests/testLibraryPage";
import { screenSizes } from "../framework/constants/visual";

const search = new SearchFilters();
const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");
const library = new TestLibrary();

describe.skip(`${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  before("set token", () => {
    cy.fixture("usersVisualRegression").then(allusers => {
      const { username, password } = allusers.default.teacher;
      cy.setToken(username, password); // setting auth token for teacher user
    });
  });

  context(`playlist use-this`, () => {
    const pageURL = "author/playlists/5d931e74804ba10b22fdb3b0/use-this";

    SCREEN_SIZES.forEach(size => {
      it(`private,when resolution is '${size}'`, () => {
        cy.setResolution(size); // set the screen resolution
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@playlists");
        cy.matchImageSnapshotWithSize(); // take screenshot and compare
      });
    });
  });

  context(`playlist library`, () => {
    const pageURL = "author/playlists";

    SCREEN_SIZES.forEach(size => {
      it(`List view, when resolution is '${size}'`, () => {
        const isSmallScreen = size[0] < screenSizes.SMALL_DESKTOP_WIDTH;
        cy.setResolution(size); // set the screen resolution
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@searchPL");

        if (isSmallScreen) library.header.clickOnfilters();
        cy.get('[data-cy="clearAll"]')
          .first()
          .click({ force: true });
        cy.wait("@searchPL");

        cy.xpath("//li[text()='Authored by me']").then($ele => {
          if (isSmallScreen)
            cy.wrap($ele)
              .eq(1)
              .click({ force: true });
          else cy.wrap($ele).click({ force: true });
        });

        cy.wait("@searchPL");

        if (isSmallScreen)
          cy.get('[data-cy="clearAll"]')
            .closest("div")
            .parent()
            .parent()
            .next()
            .last()
            .click({ force: true });

        cy.get('[data-cy="listView"]').click({ force: true });
        search.scrollFiltersToTop();
        cy.matchImageSnapshotWithSize(); // take screenshot and compare
      });

      it(`Tile view, when resolution is '${size}'`, () => {
        cy.setResolution(size); // set the screen resolution
        cy.get('[data-cy="tileView"]').click();
        cy.contains("View").should("be.visible");
        search.scrollFiltersToTop();
        cy.matchImageSnapshotWithSize(); // take screenshot and compare
      });
    });
  });
});
