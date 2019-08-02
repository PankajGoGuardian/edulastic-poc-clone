import FileHelper from "../framework/util/fileHelper";

const PAGE = ["studentsignup", "signup", "adminsignup"];
const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");

describe(`visual regression tests - ${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  context(`getStarted page`, () => {
    const page = "getStarted";
    SCREEN_SIZES.forEach(size => {
      it(`should match with base screenshot when resolution is '${size}'`, () => {
        cy.setResolution(size);
        cy.visit(`/${page}`);
        cy.get("span").should("be.visible");
        cy.matchImageSnapshot();
      });
    });
  });

  PAGE.forEach(page => {
    context(`${page} page`, () => {
      SCREEN_SIZES.forEach(size => {
        it(`should match with base screenshot when resolution is '${size}'`, () => {
          cy.setResolution(size);
          cy.visit(`/${page}`);
          cy.get("button").should("be.visible");
          cy.matchImageSnapshot();
        });
      });
    });
  });
});
