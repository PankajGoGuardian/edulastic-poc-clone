/* eslint-disable cypress/no-unnecessary-waiting */
import FileHelper from "../framework/util/fileHelper";
import TestLibrary from "../framework/author/tests/testLibraryPage";
import { screenSizes } from "../framework/constants/visual";
import TeacherSideBar from "../framework/author/SideBarPage";

const SCREEN_SIZES = [[1600, 900], [1366, 768], [1024, 650]]; // Cypress.config("SCREEN_SIZES");
const testUrl = "author/tests/5d9d82b4a67c1a57932a1436";
const testQuestions = {
  "0": "Multiple choice - standard",
  "1": "Multiple choice - multiple response",
  "2": "Label Image with Drag & Drop",
  "3": "OrderList",
  "4": "Math, Text & Dropdown",
  "5": "Fraction Editor",
  "6": "Token highlight",
  "7": "Match list",
  "8": "Graph Placement",
  "9": "Cloze with Text",
  "10": "Multiple choice",
  "11": "Choice matrix - labels",
  "12": "Number line with drag & drop",
  "13": "Classification",
  "14": "Dot plot",
  "15": "Essay with rich text",
  "16": "Essay with rich text",
  "17": "Graphing",
  "18": "Essay with rich text",
  "19": "Graphing",
  "20": "Bar chart",
  "21": "Bar chart",
  "22": "Math, Text & Dropdown"
};
const queKeys = Object.keys(testQuestions);
const testLibraryPage = new TestLibrary();
const sidebar = new TeacherSideBar();

describe(`${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
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
        cy.matchImageSnapshotWithSize();
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
        cy.matchImageSnapshotWithSize();
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
        cy.matchImageSnapshotWithSize();
      });

      it(`test-review when resolution is - '${size}'`, () => {
        cy.setResolution(size);
        testLibraryPage.header.clickOnReview();
        cy.wait(1000);
        cy.matchImageSnapshotWithSize();
        cy.isPageScrollPresent().then(({ hasScroll }) => {
          if (hasScroll) cy.scrollPageAndMatchImageSnapshots(100);
        });
      });

      it(`test-review expanded - when resolution is - '${size}'`, () => {
        cy.setResolution(size);
        const reviewTab = testLibraryPage.header.clickOnReview();
        reviewTab.clickOnExpandCollapseRow();
        cy.get('[data-cy="expandCollapseRow"]').should("contain.text", "Collapse Rows");
        cy.scrollTo(0, 0);
        cy.wait(1000);
        cy.matchImageSnapshotWithSize();
        cy.isPageScrollPresent().then(({ hasScroll }) => {
          if (hasScroll) cy.scrollPageAndMatchImageSnapshots(100);
        });
      });
    });
  });

  SCREEN_SIZES.forEach(size => {
    context(`view as student`, () => {
      before(() => {
        cy.setResolution(size);
        cy.server();
        cy.route("GET", "**test**").as("testdetail");
        cy.visit(`/${testUrl}`);
        cy.wait("@testdetail");
        testLibraryPage.header.clickOnReview();
        cy.wait(2000); // assessment player breaks if no wait
        cy.get('[data-cy="viewAsStudent"]').click();
        cy.wait(2000); // assessment player breaks if no wait
      });
      queKeys.forEach(q => {
        const queNum = `Question ${parseInt(q, 10) + 1}`;
        it(`Q-${parseInt(q, 10) + 1}-${testQuestions[q]}-resolution '${size}'`, () => {
          cy.setResolution(size);
          cy.get("[data-cy=options]").click();
          cy.contains(`${queNum}/ ${queKeys.length}`).click({ force: true });
          cy.wait(2000); // allow que to render before taking screenshot
          cy.matchImageSnapshotWithSize();
          cy.get('[data-cy="assessment-player-default-wrapper"]').then(ele => {
            const wrapperHeight = ele.find("main").innerHeight();
            cy.isPageScrollPresent(60, wrapperHeight).then(({ hasScroll }) => {
              if (hasScroll) cy.scrollPageAndMatchImageSnapshots(60, wrapperHeight, ele);
            });
          });
        });
      });

      after(() => {
        // removing assessment player from dom
        if (Cypress.$(".test-preview-modal").length > 0) {
          cy.get(".test-preview-modal").then(e => {
            e.prev().remove();
            e.remove();
          });
        }
        sidebar.clickOnDashboard(); // browser blocks navigation by direct url change
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
        cy.matchImageSnapshotWithSize();
        // for mobile
        cy.isPageScrollPresent().then(({ hasScroll }) => {
          if (hasScroll) cy.scrollPageAndMatchImageSnapshots();
        });
      });
    });
  });
});
