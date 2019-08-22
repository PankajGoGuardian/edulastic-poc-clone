/* eslint-disable cypress/no-unnecessary-waiting */
import FileHelper from "../framework/util/fileHelper";
import SearchFilters from "../framework/author/searchFiltersPage";
import { screenSizes } from "../framework/constants/visual";
import { questionGroup } from "../framework/constants/questionTypes";

const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");
const { SMALL_DESKTOP_WIDTH } = screenSizes;
const search = new SearchFilters();
const questionGroups = Cypress._.values(questionGroup);

describe(`visual regression tests - ${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  before("set token", () => {
    cy.fixture("users").then(users => {
      const user = users["visual-regression"].teacher;
      cy.setToken(user.username, user.password); // setting auth token for teacher user
    });
  });

  context(`item bank page`, () => {
    SCREEN_SIZES.forEach(size => {
      it(`'item bank' should match with base screenshot when resolution is '${size}'`, () => {
        const pageURL = "author/items";
        cy.setResolution(size);
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@searchItem");
        search.clearAll();
        cy.wait("@searchItem");
        search.setCollection("Private Library");
        cy.wait("@searchItem");
        search.scrollFiltersToTop();
        cy.matchImageSnapshot(); // take screenshot and comapare
      });
    });
  });

  context(`question-pickup page`, () => {
    const pageURL = "author/items/5d567ee4157ae702559b9b77/pickup-questiontype";
    questionGroups.forEach(queGroup => {
      SCREEN_SIZES.forEach(size => {
        it(`'${queGroup}' should match with base screenshot when resolution is '${size}'`, () => {
          cy.setResolution(size);
          cy.visit(`/${pageURL}`);
          if (size[0] < SMALL_DESKTOP_WIDTH) {
            cy.get('[data-cy="selectWidget"]').click();
          }
          cy.xpath(`//li[contains(text(),'${queGroup}')]`).then($ele => {
            // eslint-disable-next-line no-unused-expressions
            size[0] < SMALL_DESKTOP_WIDTH
              ? cy
                  .wrap($ele)
                  .eq(1)
                  .click()
              : cy.wrap($ele).click();
          });

          cy.get(".scrollbar-container")
            .eq(1)
            .then($elem => {
              $elem.scrollTop(0);
            });
          cy.wait(1000);
          cy.matchImageSnapshot();
        });
      });
    });
  });
});
