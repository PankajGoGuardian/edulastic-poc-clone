import FileHelper from "../framework/util/fileHelper";
import { assignedTests } from "../framework/testdata/visualRegression";
import { assignedTests1 } from "../framework/testdata/visualRegression";

const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");
const assignmentQue = assignedTests1["5e4b9001f13f470008a12ab2"];

describe(`${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  const pageURL = "/home/grades";
  before("set token", () => {
    cy.fixture("usersVisualRegression").then(allusers => {
      const { username, password } = allusers.studentPlayer1;
      cy.setToken(username, password); // setting auth token for student user
    });
  });

  context(`Grades`, () => {
    before("set token", () => {
      cy.fixture("users").then(users => {
        const user = users["visual-regression"].studentPlayer1;
        cy.setToken(user.username, user.password);
      });
    });

    SCREEN_SIZES.forEach(size => {
      it(`when resolution is '${size}'`, () => {
        cy.setResolution(size);
        cy.visit(`${pageURL}`);
        cy.wait("@testactivity");
        cy.matchImageSnapshotWithSize();
      });
    });
  });

  SCREEN_SIZES.forEach(size => {
    context(`Review - ${size}`, () => {
      before("set token", () => {
        cy.server();
        cy.route("GET", "**/test-activity/**").as("testactivity");
        cy.setResolution(size);

        cy.visit(
          `/home/class/5e4b86f0c12c24000700889f/test/5e4b9001f13f470008a12ab2/testActivityReport/5e71feb0dd3b77000833a801`
        );
        cy.wait("@testactivity");
        // cy.get('[data-cy="reviewButton"]').click({ force: true });
      });

      assignmentQue.forEach((item, i) => {
        it(`-Q${i + 1}-${item.itemType}-${item.itemId} -'${size}'`, () => {
          cy.get('[data-cy="questionNumber"]').click({ force: true });
          cy.get(".ant-select-dropdown-menu")
            .contains(`Question ${i + 1}/${Object.keys(assignmentQue).length}`)
            .click({ force: true });
          cy.wait(2000); // allow que to render

          cy.isPageScrollPresent().then(({ hasScroll }) => {
            if (hasScroll) cy.window().scrollTo("top");
          });
          cy.matchImageSnapshotWithSize();
          cy.isPageScrollPresent().then(({ hasScroll }) => {
            if (hasScroll) cy.scrollPageAndMatchImageSnapshots(100);
          });
        });
      });
    });
  });
});
