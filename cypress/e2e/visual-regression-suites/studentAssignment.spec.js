import FileHelper from "../framework/util/fileHelper";

const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");

describe(`visual regression tests - ${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  context(`Assessment Player`, () => {
    const pageURL =
      "/student/assessment/5d89ff138ff65a5b679c7910/class/5d53b53af7efc82f60100347/uta/5d8b6f0d05e5aa40dd598ccc/qid/0";

    before("set token", () => {
      cy.fixture("users").then(users => {
        const user = users["visual-regression"].student;
        cy.setToken(user.username, user.password); // setting auth token for student user
      });
    });

    SCREEN_SIZES.forEach(size => {
      it(`when resolution is '${size}'`, () => {
        cy.setResolution(size); // set the screen resolution
        cy.visit(`/${pageURL}`); // go to the required page usign url
        cy.wait("@testactivity"); // wait for xhr to finish
        cy.wait("@testdetail"); // wait for xhr to finish
        cy.matchImageSnapshot(); // take screenshot and comapare
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
