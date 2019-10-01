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

const questions = {
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
};

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
            context(`'${queGroup}' - '${queType}'`, () => {
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
                cy.visit(`author/items/${questions[queType]}/item-detail`);
                cy.wait("@testitem");
                cy.contains("Question");
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
                cy.wait(1000);
                cy.matchImageSnapshot();
              });

              it(`when resolution is ${size} - 'metadata'`, () => {
                itemHeader.metadata();
                cy.wait(1000);
                cy.matchImageSnapshot();
              });
            });
          }
        });
      });
    });
  });
});
