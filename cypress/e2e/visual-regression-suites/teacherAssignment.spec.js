import FileHelper from "../framework/util/fileHelper";
import LiveClassboardPage from "../framework/author/assignments/LiveClassboardPage";
import { screenSizes } from "../framework/constants/visual";

const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");
const liveClassboardPage = new LiveClassboardPage();

describe(`${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  before("set token", () => {
    cy.fixture("usersVisualRegression").then(allusers => {
      const { username, password } = allusers.teacherAssignment;
      cy.setToken(username, password); // setting auth token for teacher user
    });
  });

  context(`teacher assignments page`, () => {
    SCREEN_SIZES.forEach(size => {
      const pageURL = "author/assignments";

      it(`assignments page when resolution is '${size}'`, () => {
        cy.setResolution(size); // set the screen resolution
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@testdetail");
        if (size[0] < screenSizes.MAX_TAB_WIDTH) cy.contains("More Options").click();
        cy.get('[data-cy="PresentationIcon"]')
          .should("be.visible")
          .and("have.length.greaterThan", 0); // ensure the dom elements are rendered
        cy.matchImageSnapshotWithSize(); // take screenshot and compare
      });
    });
  });

  context("lcb page", () => {
    const pageURL = "author/classboard/5de797a8ac526100084fc2f5/5de78c65d0a3db000774c1f6";

    SCREEN_SIZES.forEach(size => {
      it(`'card view' when resolution is '${size}'`, () => {
        cy.setResolution(size); // set the screen resolution
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@testdetail");
        cy.get('[data-cy="studentStatus"]')
          .contains("Graded")
          .should("be.visible")
          .and("have.length.greaterThan", 0); // ensure the dom elements are rendered
        cy.matchImageSnapshotWithSize(); // take screenshot and compare

        // scroll and take screenshot
        cy.isPageScrollPresent().then(({ hasScroll }) => {
          if (hasScroll) cy.scrollPageAndMatchImageSnapshots();
        });
      });

      it(`'student view' when resolution is '${size}'`, () => {
        cy.setResolution(size); // set the screen resolution
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@testdetail");
        cy.get('[data-cy="studentStatus"]')
          .contains("Graded")
          .should("be.visible")
          .and("have.length.greaterThan", 0);

        liveClassboardPage.clickOnStudentsTab();

        cy.wait("@testactivity");

        cy.matchImageSnapshotWithSize(); // take screenshot and compare

        // scroll and take screenshot
        cy.isPageScrollPresent().then(({ hasScroll }) => {
          if (hasScroll) cy.scrollPageAndMatchImageSnapshots();
        });
      });

      it(`'question view' when resolution is '${size}'`, () => {
        cy.setResolution(size); // set the screen resolution
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@testdetail");

        cy.get('[data-cy="studentStatus"]')
          .contains("Graded")
          .should("be.visible")
          .and("have.length.greaterThan", 0);

        liveClassboardPage.clickonQuestionsTab();
        cy.wait("@item");
        cy.wait(500); // wait for the dom elements to render
        cy.matchImageSnapshotWithSize(); // take screenshot and compare

        // scroll and take screenshot
        cy.isPageScrollPresent().then(({ hasScroll }) => {
          if (hasScroll) cy.scrollPageAndMatchImageSnapshots();
        });
      });
    });
  });

  context("express grader page", () => {
    const pageURL = "author/expressgrader/5de797a8ac526100084fc2f5/5de78c65d0a3db000774c1f6";

    SCREEN_SIZES.forEach(size => {
      it(`when resolution is '${size}'`, () => {
        cy.setResolution(size); // set the screen resolution
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@testdetail");

        if (size[0] < screenSizes.MAX_TAB_WIDTH)
          cy.contains("Question & Standard").should("have.length.greaterThan", 0);
        else cy.contains("Score Grid").should("have.length.greaterThan", 0); // ensure the dom elements are rendered
        cy.matchImageSnapshotWithSize(); // take screenshot and compare
      });
    });
  });

  context("standard performance page", () => {
    const pageURL = "author/standardsBasedReport/5de797a8ac526100084fc2f5/5de78c65d0a3db000774c1f6";

    SCREEN_SIZES.forEach(size => {
      it(`when resolution is '${size}'`, () => {
        cy.setResolution(size); // set the screen resolution
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@testdetail");

        cy.contains("Standard: ")
          .should("be.visible")
          .and("have.length.greaterThan", 0); // ensure the dom elements are rendered
        cy.matchImageSnapshotWithSize(); // take screenshot and compare

        // scroll and take screenshot for mobile
        cy.isPageScrollPresent().then(({ hasScroll }) => {
          if (hasScroll) cy.scrollPageAndMatchImageSnapshots();
        });
      });
    });
  });
});
