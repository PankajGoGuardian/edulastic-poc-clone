/* eslint-disable cypress/no-unnecessary-waiting */
import FileHelper from "../framework/util/fileHelper";
import SearchFilters from "../framework/author/searchFiltersPage";
import { screenSizes } from "../framework/constants/visual";
import { questionGroup, questionTypeMap, questionType } from "../framework/constants/questionTypes";
import Header from "../framework/author/itemList/itemDetail/header";
import EditItemPage from "../framework/author/itemList/itemDetail/editPage";
import ItemListPage from "../framework/author/itemList/itemListPage";
import { draftTests, getQuestions } from "../framework/testdata/visualRegression";

const { SMALL_DESKTOP_WIDTH, MAX_TAB_WIDTH } = screenSizes;
const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");
const questionGroups = Cypress._.values(questionGroup);
const pageURL = "author/items";
const itemHeader = new Header();
const editItem = new EditItemPage();
const itemPage = new ItemListPage();
const search = new SearchFilters();

const questions = getQuestions(draftTests);

describe(`${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  before("set token", () => {
    cy.fixture("usersVisualRegression").then(allusers => {
      const { username, password } = allusers.default.teacher;
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
        // cy.wait("@search");
        search.scrollFiltersToTop();
        cy.matchImageSnapshotWithSize(); // take screenshot and comapare
      });
    });
  });

  context(`'question-pickup' page`, () => {
    SCREEN_SIZES.forEach(size => {
      context(`resolution is - ${size}`, () => {
        before(() => {
          cy.setResolution(size);
          cy.visit(`/${pageURL}`);
          itemPage.clickOnCreate();
        });

        questionGroups.forEach(queGroup => {
          it(`'${queGroup}' - when resolution is '${size}'`, () => {
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
            cy.wait(2000);
            cy.matchImageSnapshotWithSize();
          });
        });
      });
    });
  });

  SCREEN_SIZES.forEach(size => {
    const isSizeSmall = size[0] < SMALL_DESKTOP_WIDTH;
    const scrollOffset = size[1] > MAX_TAB_WIDTH ? 60 : 120;
    context("create item", () => {
      beforeEach(() => {
        cy.setResolution(size);
      });

      questionGroups.forEach(queGroup => {
        questionTypeMap[queGroup].forEach(queType => {
          if (Object.keys(questions).indexOf(queType) >= 0) {
            questions[queType].forEach((queId, index) => {
              context(`'${queGroup}'-'${queType}-${queId}'`, () => {
                /* before(() => {
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
                }); */

                before(() => {
                  cy.server();
                  cy.route("**/testitem/**").as("testitem");
                  cy.setResolution(size);
                  cy.visit(`author/items/${queId}/item-detail`);
                  cy.wait("@testitem");
                  cy.wait(500); // allow UI to stablize
                });

                it(`-${size}-'edit'`, () => {
                  cy.wait(1000);
                  cy.matchImageSnapshotWithSize();

                  cy.isPageScrollPresent().then(({ hasScroll }) => {
                    if (hasScroll) cy.scrollPageAndMatchImageSnapshots(scrollOffset);
                  });
                });

                it(`-${size}-'preview'`, () => {
                  itemHeader.preview();
                  cy.isPageScrollPresent().then(({ hasScroll }) => {
                    cy.wait(1000);
                    if (hasScroll) {
                      cy.scrollTo(0, 0);
                      cy.matchImageSnapshotWithSize();
                      cy.scrollPageAndMatchImageSnapshots(scrollOffset);
                    } else cy.matchImageSnapshotWithSize();
                  });
                });

                if (queType !== questionType.ESSAY_RICH && queType !== questionType.COMBINATION_MULTIPART) {
                  it(`-${size}-'preview-showAns'`, () => {
                    itemHeader
                      .preview()
                      .getShowAnswer()
                      .click();
                    cy.isPageScrollPresent().then(({ hasScroll }) => {
                      cy.wait(1000);
                      if (hasScroll) {
                        cy.scrollTo(0, 0);
                        cy.matchImageSnapshotWithSize();
                        cy.scrollPageAndMatchImageSnapshots(scrollOffset);
                      } else cy.matchImageSnapshotWithSize();
                    });
                  });
                }

                it(`-${size}-'preview-clear'`, () => {
                  itemHeader
                    .preview()
                    .getClear()
                    .click();

                  cy.isPageScrollPresent().then(({ hasScroll }) => {
                    cy.wait(1000);
                    if (hasScroll) {
                      cy.scrollTo(0, 0);
                      cy.matchImageSnapshotWithSize();
                      cy.scrollPageAndMatchImageSnapshots(scrollOffset);
                    } else cy.matchImageSnapshotWithSize();
                  });
                });

                it(`-${size}-'metadata'`, () => {
                  itemHeader.metadata();
                  cy.wait(1000);
                  cy.matchImageSnapshotWithSize();
                });
              });
            });
          }
        });
      });
    });
  });
});
