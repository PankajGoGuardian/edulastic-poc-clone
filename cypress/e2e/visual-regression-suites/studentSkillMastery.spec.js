import FileHelper from "../framework/util/fileHelper";

const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");

describe(`${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  context(`skill report`, () => {
    const pageURL = "home/skill-mastery";

    before("set token", () => {
      cy.fixture("usersVisualRegression").then(allusers => {
        const { username, password } = allusers.studentSkillMastery;
        cy.setToken(username, password); // setting auth token for student user
      });
    });

    SCREEN_SIZES.forEach(size => {
      it(`when resolution is '${size}'`, () => {
        cy.setResolution(size); // set the screen resolution
        cy.visit(`/${pageURL}`);
        cy.wait("@skillReport");
        cy.contains("Skill Summary").should("have.length.greaterThan", 0);

        cy.get(".ant-progress")
          .next()
          .click({ multiple: true });
        cy.scrollTo(0, 0);
        cy.matchImageSnapshotWithSize(); // take screenshot and comapare
        // scroll and take screenshot
        cy.isPageScrollPresent().then(({ hasScroll }) => {
          if (hasScroll) cy.scrollPageAndMatchImageSnapshots();
        });
      });
    });
  });
});
