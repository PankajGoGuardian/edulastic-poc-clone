/* eslint-disable cypress/no-unnecessary-waiting */
import FileHelper from "../framework/util/fileHelper";
import TestLibrary from "../framework/author/tests/testLibraryPage";
import { screenSizes } from "../framework/constants/visual";

const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");
const testUrl = "author/tests/5d9da6945fa2323e7b1a3375";
const testQuestions = {
  "0": "Multiple choice - standard",
  "1": "Multiple choice - multiple response",
  "2": "Label Image with Drag & Drop",
  "3": "OrderList",
  "4": "Math, Text & Dropdown",
  "5": "Math, Text & Dropdown",
  "6": "Fraction Editor",
  "7": "Token highlight",
  "8": "Match list",
  "9": "Graph Placement",
  "10": "Cloze with Text",
  "11": "Multiple choice",
  "12": "Choice matrix - labels",
  "13": "Number line with drag & drop",
  "14": "Classification",
  "15": "Dot plot",
  "16": "Essay with rich text",
  "17": "Essay with rich text",
  "18": "Graphing",
  "19": "Essay with rich text",
  "20": "Graphing",
  "21": "Bar chart",
  "22": "Bar chart",
  "23": "Multiple choice - multiple response",
  "24": "Multiple choice - multiple response"
};
const queKeys = Object.keys(testQuestions);
const testLibraryPage = new TestLibrary();

describe(`visual regression tests - ${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  before("set token", () => {
    cy.fixture("users").then(users => {
      const user = users["visual-regression"].teacher;
      cy.setToken(user.username, user.password); // setting auth token for teacher user
    });
  });

  context(`Author Test`, () => {
    const pageURL = "author/tests/select";
    SCREEN_SIZES.forEach(size => {
      it(`create-new when resolution is '${size}'`, () => {
        cy.setResolution(size);
        cy.visit(`/${pageURL}`);
        cy.contains("Create from Scratch").should("be.visible");
        cy.matchImageSnapshot();
        // for mobile
        if (size[0] < screenSizes.MAX_TAB_WIDTH)
          cy.isPageScrollPresent().then(({ hasScroll }) => {
            if (hasScroll) cy.scrollPageAndMatchImageSnapshots(50);
          });
      });

      it(`test-description when resolution is - '${size}'`, () => {
        cy.setResolution(size);
        cy.visit(`/${testUrl}`);
        cy.wait("@testdetail");
        testLibraryPage.header.clickOnDescription();
        cy.wait(1000);
        cy.matchImageSnapshot();
        // for mobile
        cy.isPageScrollPresent().then(({ hasScroll }) => {
          if (hasScroll) cy.scrollPageAndMatchImageSnapshots();
        });
      });

      it(`test-additem when resolution is - '${size}'`, () => {
        cy.setResolution(size);
        testLibraryPage.header.clickOnAddItems();
        cy.wait("@testdetail");
        if (size[0] < screenSizes.MAX_MOBILE_WIDTH) testLibraryPage.header.clickOnfilters();
        testLibraryPage.searchFilters.clearAll();
        testLibraryPage.testAddItem.authoredByMe();
        if (size[0] < screenSizes.MAX_MOBILE_WIDTH) testLibraryPage.header.closeFilter();
        cy.wait(1000);
        cy.matchImageSnapshot();
      });

      it(`test-review when resolution is - '${size}'`, () => {
        cy.setResolution(size);
        testLibraryPage.header.clickOnReview();
        cy.wait(1000);
        cy.matchImageSnapshot();
        cy.isPageScrollPresent().then(({ hasScroll }) => {
          if (hasScroll) cy.scrollPageAndMatchImageSnapshots(100);
        });
      });

      it(`test-review expanded - when resolution is - '${size}'`, () => {
        cy.setResolution(size);
        const reviewTab = testLibraryPage.header.clickOnReview();
        reviewTab.clickOnExpandCollapseRow();
        cy.get('[data-cy="expandCollapseRow"]').should("contain.text", "Collapse Rows");
        cy.wait(1000);
        cy.matchImageSnapshot();
        cy.isPageScrollPresent().then(({ hasScroll }) => {
          if (hasScroll) cy.scrollPageAndMatchImageSnapshots(100);
        });
      });
    });
  });

  SCREEN_SIZES.forEach(size => {
    context(`view as student`, () => {
      before(() => {
        cy.server();
        cy.route("GET", "**test**").as("testdetail");
        cy.visit(`/${testUrl}`);
        cy.wait("@testdetail");
        testLibraryPage.header.clickOnReview();
        cy.get('[data-cy="viewAsStudent"]').click();
        cy.wait(2000);
      });
      queKeys.forEach(q => {
        const queNum = `Question ${parseInt(q, 10) + 1}`;
        it(`Q-${parseInt(q, 10) + 1}-${testQuestions[q]}-resolution '${size}'`, () => {
          cy.setResolution(size);
          cy.get("[data-cy=options]").click();
          cy.contains(`${queNum}/ ${queKeys.length}`).click({ force: true });
          cy.wait(2000); // allow que to render before taking screenshot
          cy.matchImageSnapshot();
          cy.get('[data-cy="assessment-player-default-wrapper"]').then(ele => {
            const wrapperHeight = ele.find("main").innerHeight();
            cy.isPageScrollPresent(60, wrapperHeight).then(({ hasScroll }) => {
              if (hasScroll) cy.scrollPageAndMatchImageSnapshots(60, wrapperHeight, ele);
            });
          });
        });
      });
    });
  });

  context(`Assign Test`, () => {
    const pageURL = "author/assignments/5d92ff4494fae46a63c41b85";
    SCREEN_SIZES.forEach(size => {
      it(`when resolution is '${size}'`, () => {
        cy.setResolution(size);
        cy.visit(`/${pageURL}`);
        cy.contains("Visual Automation").should("be.visible");
        cy.matchImageSnapshot();
        // for mobile
        cy.isPageScrollPresent().then(({ hasScroll }) => {
          if (hasScroll) cy.scrollPageAndMatchImageSnapshots();
        });
      });
    });
  });
});
