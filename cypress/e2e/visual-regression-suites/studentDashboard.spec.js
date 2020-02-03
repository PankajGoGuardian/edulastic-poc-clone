import FileHelper from "../framework/util/fileHelper";

const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");

describe(`${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  context(`student home page`, () => {
    const pageURL = "home/assignments";

    before("set token", () => {
      cy.fixture("usersVisualRegression").then(allusers => {
        const { username, password } = allusers.default.student;
        cy.setToken(username, password); // setting auth token for student user
      });
    });

    SCREEN_SIZES.forEach(size => {
      it(`- when resolution is '${size}'`, () => {
        cy.setResolution(size); // set the screen resolution
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@testactivity"); // wait for xhr to finish
        cy.get("img")
          .should("be.visible")
          .and("have.length.greaterThan", 0); // ensure ther dom elements are rendered
        cy.matchImageSnapshotWithSize();
      });
    });
  });
});
