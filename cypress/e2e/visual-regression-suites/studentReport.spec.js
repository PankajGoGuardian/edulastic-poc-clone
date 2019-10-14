import FileHelper from "../framework/util/fileHelper";

const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");
const assignmentQue = {
  0: "Math, Text & Dropdown",
  1: "Math, Text & Dropdown",
  2: "Number line with plot",
  3: "Essay with rich text",
  4: "Math, Text & Dropdown",
  5: "Multiple choice - standard",
  6: "Fraction Editor",
  7: "Match list",
  8: "Line plot",
  9: "True or false",
  10: "Cloze with Text",
  11: "Cloze with Text",
  12: "Cloze with Drag & Drop",
  13: "Number line with drag & drop",
  14: "Token highlight",
  15: "Match list",
  16: "Label Image with Text",
  17: "Label Image with Drag & Drop",
  18: "Highlight Image",
  19: "Choice matrix - standard",
  20: "Bar chart",
  21: "Graphing",
  22: "Math, Text & Dropdown",
  23: "Graph Placement",
  24: "OrderList",
  25: "Cloze with Drop Down",
  26: "Classification",
  27: "Multiple choice - multiple response"
};

describe(`${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  const pageURL = "/home/reports";
  before("set token", () => {
    cy.fixture("users").then(users => {
      const user = users["visual-regression"].student;
      cy.setToken(user.username, user.password); // setting auth token for student user
    });
  });

  context(`Report`, () => {
    before("set token", () => {
      cy.fixture("users").then(users => {
        const user = users["visual-regression"].student;
        cy.setToken(user.username, user.password);
      });
    });

    SCREEN_SIZES.forEach(size => {
      it(`when resolution is '${size}'`, () => {
        cy.setResolution(size);
        cy.visit(`/${pageURL}`);
        cy.wait("@testactivity");
        cy.matchImageSnapshotWithSize();
      });
    });
  });

  SCREEN_SIZES.forEach(size => {
    context(`Review - ${size}`, () => {
      before("set token", () => {
        cy.server();
        cy.route("GET", "**/test-activity/**").as("testactivity");
        cy.setResolution(size);

        cy.visit(`/${pageURL}`);
        cy.wait("@testactivity");
        cy.get('[data-cy="reviewButton"]').click({ force: true });
      });

      Object.keys(assignmentQue).forEach(q => {
        it(`que type- ${assignmentQue[q]} - when resolution is '${size}'`, () => {
          cy.get('[data-cy="questionNumber"]').click({ force: true });
          cy.get(".ant-select-dropdown-menu")
            .contains(`Question ${parseInt(q, 10) + 1}/${Object.keys(assignmentQue).length}`)
            .click({ force: true });
          cy.wait(2000); // allow que to render

          cy.isPageScrollPresent().then(({ hasScroll }) => {
            if (hasScroll) cy.window().scrollTo("top");
          });
          cy.matchImageSnapshotWithSize();
          cy.isPageScrollPresent().then(({ hasScroll }) => {
            if (hasScroll) cy.scrollPageAndMatchImageSnapshots(100);
          });
        });
      });
    });
  });
});
