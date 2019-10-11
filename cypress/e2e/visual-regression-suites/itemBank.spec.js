/* eslint-disable cypress/no-unnecessary-waiting */
import FileHelper from "../framework/util/fileHelper";
import SearchFilters from "../framework/author/searchFiltersPage";
import { screenSizes } from "../framework/constants/visual";
import { questionGroup, questionTypeMap } from "../framework/constants/questionTypes";
import Header from "../framework/author/itemList/itemDetail/header";
import EditItemPage from "../framework/author/itemList/itemDetail/editPage";
import ItemListPage from "../framework/author/itemList/itemListPage";

const { SMALL_DESKTOP_WIDTH, MAX_TAB_WIDTH } = screenSizes;
const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");
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
  "Multiple choice - standard": ["5d9dbbaff0423148e943b814"],
  "Multiple choice - multiple response": [
    "5d96f1b7fa159feccabb0ddd",
    "5d9dbd005ba830e8b6bea7ca",
    "5d9dbdac733fa8171f5df93b"
  ],
  "Label Image with Drag & Drop": ["5d9c5f722db4379b8d316c34"],
  OrderList: ["5d97207ffa159feccae50ab6"],
  "Math, Text & Dropdown": ["5d52c8adb7ed18cd3af444f6", "5d9b26b4f94d754831c721b2"],
  "Fraction Editor": ["5d9ac436e1d27c375803b5c7"],
  "Token highlight": ["5d9b470854efd9fb1bfbd402"],
  "Match list": ["5d9c721d623e4a113a5061e6"],
  "Graph Placement": ["5d9b489954efd93ca8fbd403"],
  "Cloze with Text": ["5d9b239760f4e88a62b4860f"],
  "Multiple choice": ["5d9c6a20d8a4cf776603b515"],
  "Choice matrix - labels": ["5d9ad1e0e1d27c15c803b5d1"],
  "Number line with drag & drop": ["5d81fc89fa159fecca04f102"],
  Classification: ["5d971ff3fa159feccae4f923"],
  "Dot plot": ["5d31a400305f9c1ef064f81b"],
  "Essay with rich text": ["5d0c717b38a00c59eadce00c", "5d52c0cfb7ed18cd3af10df3", "5d1c4768305f9c1ef00213ba"],
  Graphing: ["5ce3a1dbbe25950032f0887f", "5d0c7ae838a00c59eae1c4cb"],
  "Bar chart": ["5d4d754ab7ed18cd3a64f7a8", "5d31a906305f9c1ef07e55de"]
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
      it(`should match with base screenshot when resolution is '${size}'`, () => {
        cy.setResolution(size);
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@searchItem");
        search.clearAll();
        // cy.wait("@searchItem");
        search.getAuthoredByMe();
        // cy.wait("@search");
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
          itemPage.clickOnCreate();
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
            cy.wait(2000);
            cy.matchImageSnapshot();
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
                  cy.matchImageSnapshot();

                  cy.isPageScrollPresent().then(({ hasScroll }) => {
                    if (hasScroll) cy.scrollPageAndMatchImageSnapshots(scrollOffset);
                  });
                });

                it(`when resolution is ${size} - 'preview'`, () => {
                  itemHeader.preview();
                  cy.wait(1000);
                  cy.matchImageSnapshot();

                  cy.isPageScrollPresent().then(({ hasScroll }) => {
                    if (hasScroll) cy.scrollPageAndMatchImageSnapshots(scrollOffset);
                  });
                });

                it(`when resolution is ${size} - 'preview-showAns'`, () => {
                  itemHeader
                    .preview()
                    .getShowAnswer()
                    .click();
                  cy.wait(1000);
                  cy.matchImageSnapshot();
                  cy.isPageScrollPresent().then(({ hasScroll }) => {
                    if (hasScroll) cy.scrollPageAndMatchImageSnapshots(scrollOffset);
                  });
                });

                it(`when resolution is ${size} - 'preview-clear'`, () => {
                  itemHeader
                    .preview()
                    .getClear()
                    .click();
                  cy.wait(1000);
                  cy.matchImageSnapshot();
                  cy.isPageScrollPresent().then(({ hasScroll }) => {
                    if (hasScroll) cy.scrollPageAndMatchImageSnapshots(scrollOffset);
                  });
                });

                it(`when resolution is ${size} - 'metadata'`, () => {
                  itemHeader.metadata();
                  cy.wait(1000);
                  cy.matchImageSnapshot();
                });
              });
            });
          }
        });
      });
    });
  });
});
