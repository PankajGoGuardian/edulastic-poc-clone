/* eslint-disable cypress/no-unnecessary-waiting */
import FileHelper from "../framework/util/fileHelper";
import SearchFilters from "../framework/author/searchFiltersPage";
import { screenSizes } from "../framework/constants/visual";
import { questionGroup, questionTypeMap } from "../framework/constants/questionTypes";
import Header from "../framework/author/itemList/itemDetail/header";
import EditItemPage from "../framework/author/itemList/itemDetail/editPage";
import ItemListPage from "../framework/author/itemList/itemListPage";

const { SMALL_DESKTOP_WIDTH, MAX_TAB_WIDTH } = screenSizes;
const SCREEN_SIZES = [[1600, 900], [1366, 768], [1024, 650]]; // Cypress.config("SCREEN_SIZES");
const questionGroups = Cypress._.values(questionGroup);
const pageURL = "author/items";
const itemHeader = new Header();
const editItem = new EditItemPage();
const itemPage = new ItemListPage();
const search = new SearchFilters();

/* const questions = {
  "Cloze with Text": "5d8e084aca293d1c3e684ca0",
  "Bar chart": "5d8e084aca293d1c3e684ca1",
  "Cloze with Drop Down": "5d8e084bca293d1c3e684ca2",
  "Math, Text & Dropdown": "5d8e084bca293d1c3e684ca3",
  "Highlight Image": "5d8e084cca293d1c3e684ca4",
  "Label Image with Drag & Drop": "5d8e084cca293d1c3e684ca5",
  "Label Image with Text": "5d8e084cca293d1c3e684ca6",
  "Match list": "5d8e084dca293d1c3e684ca7",
  "Token highlight": "5d8e084dca293d1c3e684ca8",
  "Number line with drag & drop": "5d8e084dca293d1c3e684ca9",
  "True or false": "5d8e084eca293d1c3e684caa",
  "Line plot": "5d8e084eca293d1c3e684cab",
  "Essay with rich text": "5d8e084fca293d1c3e684cae",
  Graphing: "5d8e0850ca293d1c3e684cb0",
  "Cloze with Drag & Drop": "5d8e0850ca293d1c3e684cb1",
  "Graph Placement": "5d8e0851ca293d1c3e684cb2",
  "Fraction Editor": "5d8e0851ca293d1c3e684cb3",
  "Choice matrix - standard": "5d8e0852ca293d1c3e684cb5",
  Classification: "5d8e0853ca293d1c3e684cb7",
  OrderList: "5d8e0853ca293d1c3e684cb8",
  "Multiple choice - multiple response": "5d8e0854ca293d1c3e684cb9",
  "Multiple choice - standard": "5d8e0854ca293d1c3e684cba",
  "Number line with plot": "5d8e0855ca293d1c3e684cbb"
}; */

const questions = {
  "Multiple choice - standard": ["5d9ee2eee8643b0b75f17509"],
  "Multiple choice - multiple response": ["5d9ee3550ba990deb2773c23"],
  "Label Image with Drag & Drop": ["5d9ef7577fe54765293be58f"],
  OrderList: ["5d9ef813236a6d40c08ca88c"],
  "Math, Text & Dropdown": ["5d9ef859236a6d0aaa8ca88e", "5d9f09a1487008f9f0bcf4bb"],
  "Fraction Editor": ["5d9efa42930e8afa87b3f73d"],
  "Token highlight": ["5d9efa82930e8ae8f5b3f73f"],
  "Match list": ["5d9efb1ad88319032295da4a"],
  "Graph Placement": ["5d9efb5ed88319e3b095da4b"],
  "Cloze with Text": ["5d9efc08b0801c844df2a906"],
  "Multiple choice": ["5d9efc55d8831934aa95da4c"],
  "Choice matrix - labels": ["5d9efc96b0801c7d91f2a907"],
  "Number line with drag & drop": ["5d9efcc6d88319394b95da4d"],
  Classification: ["5d9efdf2d88319c83695da4f"],
  "Dot plot": ["5d9efe34236a6d4ce68ca88f"],
  "Essay with rich text": ["5d9efe8c7fe547a8e63be591", "5d9efec4236a6d85ee8ca890", "5d9eff34d8831976da95da51"],
  Graphing: ["5d9efef0236a6d7b3d8ca892", "5d9eff657fe54768593be593"],
  "Bar chart": ["5d9effaa930e8a7f3eb3f740", "5d9efff0d883198b5a95da52"]
};

describe(`${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  before("set token", () => {
    cy.fixture("users").then(users => {
      const user = users["visual-regression"].teacher;
      cy.setToken(user.username, user.password); // setting auth token for teacher user
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
      /* before(() => {
        cy.setResolution(size);
        cy.visit(`/${pageURL}`);
      }); */

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
                  cy.contains("Question");
                });

                it(`when resolution is ${size} - 'edit'`, () => {
                  cy.wait(1000);
                  cy.matchImageSnapshotWithSize();

                  cy.isPageScrollPresent().then(({ hasScroll }) => {
                    if (hasScroll) cy.scrollPageAndMatchImageSnapshots(scrollOffset);
                  });
                });

                it(`when resolution is ${size} - 'preview'`, () => {
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

                if (queType !== "Essay with rich text") {
                  it(`when resolution is ${size} - 'preview-showAns'`, () => {
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

                it(`when resolution is ${size} - 'preview-clear'`, () => {
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

                it(`when resolution is ${size} - 'metadata'`, () => {
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
