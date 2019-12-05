import FileHelper from "../framework/util/fileHelper";

const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");

describe(`${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  context(`skill report`, () => {
    const pageURL = "home/skill-report";

    before("set token", () => {
      cy.fixture("users").then(users => {
        const user = users["visual-regression"].student;
        cy.setToken("stu01@ssbmarcl01.com", "snapwiz"); // setting auth token for student user
      });
    });

    SCREEN_SIZES.forEach(size => {
      it(`when resolution is '${size}'`, () => {
        cy.setResolution(size); // set the screen resolution
        cy.visit(`/${pageURL}`);
        cy.wait("@skillReport");
        cy.contains("Skill Summary").should("have.length.greaterThan", 0);
        cy.matchImageSnapshotWithSize(); // take screenshot and comapare
      });
    });
  });
});
