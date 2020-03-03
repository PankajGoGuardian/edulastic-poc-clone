/* eslint-disable cypress/no-unnecessary-waiting */
import FileHelper from "../framework/util/fileHelper";
import TestLibrary from "../framework/author/tests/testLibraryPage";
import { screenSizes } from "../framework/constants/visual";
import TeacherSideBar from "../framework/author/SideBarPage";
import { draftTests, assignedTests } from "../framework/testdata/visualRegression";

const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");
const allTestsIds = Object.keys(draftTests);
const publishedTestId = Object.keys(assignedTests)[0];

const testLibraryPage = new TestLibrary();
const sidebar = new TeacherSideBar();

describe(`${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  before("set token", () => {
    cy.fixture("usersVisualRegression").then(allusers => {
      const { username, password } = allusers.default.teacher;
      cy.setToken(username, password); // setting auth token for teacher user
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
    });
  });

  allTestsIds.forEach(testId => {
    const testUrl = `author/tests/${testId}`;
    SCREEN_SIZES.forEach(size => {
      context(`test-${testId}-${size}`, () => {
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
          reviewTab.clickOnExpandRow();
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
  });

  allTestsIds.forEach(testId => {
    const testUrl = `author/tests/${testId}`;
    const testQuestions = draftTests[testId].map(({ itemId }) => itemId);
    SCREEN_SIZES.forEach(size => {
      context(`view as student-${testId}-${size}`, () => {
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
        testQuestions.forEach((itemId, i) => {
          const queNum = `Question ${parseInt(i, 10) + 1}`;
          it(`Q-${parseInt(i, 10) + 1}-${itemId}-resolution '${size}'`, () => {
            cy.setResolution(size);
            cy.get("[data-cy=options]").click();
            cy.contains(`${queNum}/ ${testQuestions.length}`).click({ force: true });
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
  });

  context(`Assign Test`, () => {
    const pageURL = `author/assignments/${publishedTestId}`;
    SCREEN_SIZES.forEach(size => {
      it(`when resolution is '${size}'`, () => {
        cy.setResolution(size);
        cy.visit(`/${pageURL}`);
        cy.contains("Automation").should("be.visible");
        cy.matchImageSnapshotWithSize();
        // for mobile
        cy.isPageScrollPresent().then(({ hasScroll }) => {
          if (hasScroll) cy.scrollPageAndMatchImageSnapshots();
        });
      });
    });
  });
});
