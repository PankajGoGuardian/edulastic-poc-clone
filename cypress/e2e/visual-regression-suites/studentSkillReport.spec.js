import FileHelper from "../framework/util/fileHelper";

const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");

describe(`visual regression tests - ${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  context(`skill report`, () => {
    const pageURL = "home/skill-report";

    before("set token", () => {
      cy.fixture("users").then(users => {
        const user = users["visual-regression"].student;
        cy.setToken(user.username, user.password); // setting auth token for student user
      });
    });

    SCREEN_SIZES.forEach(size => {
      it(`when resolution is '${size}'`, () => {
        cy.setResolution(size); // set the screen resolution
        cy.visit(`/${pageURL}`);
        cy.wait("@skillReport");
        cy.contains("Skill Summary").should("have.length.greaterThan", 0);
        cy.matchImageSnapshot(); // take screenshot and comapare
      });
    });
  });
});
