import FileHelper from "../framework/util/fileHelper";

const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");

describe(`${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  context(`teacher dashboard page`, () => {
    const pageURL = "author/dashboard";

    before("set token", () => {
      cy.fixture("usersVisualRegression").then(allusers => {
        const { username, password } = allusers.default.teacher;
        cy.setToken(username, password); // setting auth token for teacher user
      });
    });

    SCREEN_SIZES.forEach(size => {
      it(`- when resolution is '${size}'`, () => {
        cy.setResolution(size); // set the screen resolution
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@courses"); // wait for xhr to finish
        cy.get("img")
          .should("be.visible")
          .and("have.length.greaterThan", 0); // ensure the dom elements are rendered
        cy.wait(1000); // some images takes time to load
        cy.matchImageSnapshotWithSize(); // take screenshot and comapare
      });
    });
  });
});
