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

describe(`visual regression tests - ${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  context(`Assessment Player`, () => {
    const pageURL =
      "/student/assessment/5d8dfd88d4420e0e09dd321e/class/5d53b53af7efc82f60100347/uta/5d8e0190576a238f0ad0e1ea/qid";

    before("set token", () => {
      cy.fixture("users").then(users => {
        const user = users["visual-regression"].student;
        cy.setToken(user.username, user.password); // setting auth token for student user
      });
    });

    SCREEN_SIZES.forEach(size => {
      Object.keys(assignmentQue).forEach(q => {
        it(`when resolution is '${size}' and queType - ${assignmentQue[q]}`, () => {
          cy.setResolution(size); // set the screen resolution
          cy.visit(`/${pageURL}/${q}`); // go to the required page usign url
          cy.wait("@testactivity"); // wait for xhr to finish
          cy.wait("@testdetail"); // wait for xhr to finish
          cy.wait(2000); // allow que to render
          cy.matchImageSnapshot(); // take screenshot and comapare
        });
      });
    });
  });

  context(`Report`, () => {
    const pageURL = "/home/reports";

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
        cy.matchImageSnapshot();
      });
    });
  });
});
