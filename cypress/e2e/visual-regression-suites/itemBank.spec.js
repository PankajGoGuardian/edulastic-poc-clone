/* eslint-disable cypress/no-unnecessary-waiting */
import FileHelper from "../framework/util/fileHelper";
import SearchFilters from "../framework/author/searchFiltersPage";
import { screenSizes } from "../framework/constants/visual";
import { questionGroup, questionTypeMap } from "../framework/constants/questionTypes";
import Header from "../framework/author/itemList/itemDetail/header";
import EditItemPage from "../framework/author/itemList/itemDetail/editPage";

const { SMALL_DESKTOP_WIDTH, MAX_TAB_WIDTH } = screenSizes;
const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");
const heightSrollOffSet = 300;
const questionGroups = Cypress._.values(questionGroup);
const pageURL = "author/items/5d653a557973777cde063a7d/item-detail";
const itemHeader = new Header();
const editItem = new EditItemPage();
const search = new SearchFilters();

describe(`visual regression tests - ${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  before("set token", () => {
    cy.fixture("users").then(users => {
      const user = users["visual-regression"].teacher;
      cy.setToken(user.username, user.password); // setting auth token for teacher user
    });
  });

  context(`'item bank' page`, () => {
    SCREEN_SIZES.forEach(size => {
      it(`should match with base screenshot when resolution is '${size}'`, () => {
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

  context(`'question-pickup' page`, () => {
    SCREEN_SIZES.forEach(size => {
      context(`resolution is - ${size}`, () => {
        before(() => {
          cy.setResolution(size);
          cy.visit(`/${pageURL}`);
        });

        questionGroups.forEach(queGroup => {
          it(`'${queGroup}' should match with base screenshot when resolution is '${size}'`, () => {
            cy.setResolution(size);

            const isSizeSmall = size[0] < SMALL_DESKTOP_WIDTH;

            if (isSizeSmall) cy.get('[data-cy="selectWidget"]').click();

            cy.xpath(`//li[contains(text(),'${queGroup}')]`).then($ele => {
              if (isSizeSmall) {
                cy.wrap($ele)
                  .eq(1)
                  .click();
              } else cy.wrap($ele).click();
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

  SCREEN_SIZES.forEach(size => {
    const isSizeSmall = size[0] < SMALL_DESKTOP_WIDTH;
    context("create item", () => {
      before(() => {
        cy.setResolution(size);
        cy.visit(`/${pageURL}`);
      });

      beforeEach(() => {
        cy.setResolution(size);
      });

      questionGroups.forEach(queGroup => {
        questionTypeMap[queGroup].forEach(queType => {
          context(`'${queGroup}' - '${queType}'`, () => {
            before(() => {
              cy.setResolution(size);
              cy.url().then(url => {
                if (url.includes("create")) {
                  if (isSizeSmall) cy.contains("span", "Back to Item List").click();
                  else cy.contains("span", "item detail").click();
                }

                if (isSizeSmall) cy.get('[data-cy="selectWidget"]').click();

                cy.xpath(`//li[contains(text(),'${queGroup}')]`).then($ele => {
                  if (isSizeSmall) {
                    cy.wrap($ele)
                      .eq(1)
                      .click();
                  } else cy.wrap($ele).click();
                });

                editItem.selectQue(queType);
              });
            });

            it(`when resolution is ${size} - 'edit'`, () => {
              const scrollOffset = size[1] > MAX_TAB_WIDTH ? 60 : 120;
              cy.wait(1000);
              cy.matchImageSnapshot();

              cy.isPageScrollPresent().then(({ hasScroll }) => {
                if (hasScroll) cy.scrollPageAndMatchImageSnapshots(scrollOffset);
              });
            });

            it(`when resolution is ${size} - 'preview'`, () => {
              itemHeader.preview();
              cy.wait(500);
              cy.matchImageSnapshot();
            });

            it(`when resolution is ${size} - 'metadata'`, () => {
              itemHeader.metadata();
              cy.wait(500);
              cy.matchImageSnapshot();
            });
          });
        });
      });
    });
  });
});
