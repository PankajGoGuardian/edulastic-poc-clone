/* eslint-disable cypress/no-unnecessary-waiting */
import FileHelper from "../framework/util/fileHelper";
import SearchFilters from "../framework/author/searchFiltersPage";

const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");
const search = new SearchFilters();

describe(`visual regression tests - ${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  context(`item bank page`, () => {
    before("set token", () => {
      cy.fixture("users").then(users => {
        const user = users["visual-regression"].teacher;
        cy.setToken(user.username, user.password); // setting auth token for teacher user
      });
    });

    SCREEN_SIZES.forEach(size => {
      it(`'item bank' should match with base screenshot when resolution is '${size}'`, () => {
        const pageURL = "author/items";
        cy.setResolution(size);
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@curriculum"); // wait for xhr to finish
        search.clearAll();
        search.setCollection("Private Library");
        cy.contains("13 questions found");
        cy.wait(500);
        cy.matchImageSnapshot(); // take screenshot and comapare
      });

      it(`'question-pickup' should match with base screenshot when resolution is '${size}'`, () => {
        const pageURL = "author/items/5d567ee4157ae702559b9b77/pickup-questiontype";
        cy.setResolution(size);
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.contains("Multiple choice - standard");
        cy.wait(500);
        cy.matchImageSnapshot(); // take screenshot and comapare
      });
    });
  });
});
