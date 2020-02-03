import FileHelper from "../framework/util/fileHelper";

const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");

describe(`${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  context(`manage`, () => {
    const pageURL = "home/manage";

    before("set token", () => {
      cy.fixture("usersVisualRegression").then(allusers => {
        const { username, password } = allusers.default.student;
        cy.setToken(username, password); // setting auth token for student user
      });
    });

    SCREEN_SIZES.forEach(size => {
      it(`> when resolution is '${size}'`, () => {
        cy.setResolution(size); // set the screen resolution
        cy.visit(`/${pageURL}`);
        cy.wait("@enrollment");
        cy.contains("My Classes").should("have.length.greaterThan", 0);
        cy.matchImageSnapshotWithSize(); // take screenshot and comapare
      });
    });
  });
});
