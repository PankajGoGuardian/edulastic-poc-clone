import FileHelper from "../framework/util/fileHelper";

const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");

describe(`visual regression tests - ${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  context(`Login page`, () => {
    const page = "login";
    SCREEN_SIZES.forEach(size => {
      it(`should match with base screenshot when resolution is '${size}'`, () => {
        cy.setResolution(size);
        cy.visit(`/${page}`);
        cy.get('[data-cy="login"]').should("be.visible");
        cy.matchImageSnapshot();
      });
    });
  });
});
