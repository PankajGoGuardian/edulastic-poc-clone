import FileHelper from "../framework/util/fileHelper";
import { assignedTests } from "../framework/testdata/visualRegression";

const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");
const assignmentQue = assignedTests["5de8ce86c05b97000826d0ae"];

describe(`${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  const pageURL = "/home/grades";
  before("set token", () => {
    cy.fixture("usersVisualRegression").then(allusers => {
      const { username, password } = allusers.default.student;
      cy.setToken(username, password); // setting auth token for student user
    });
  });

  context(`Grades`, () => {
    before("set token", () => {
      cy.fixture("users").then(users => {
        const user = users["visual-regression"].student;
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
          `/home/class/5d53b53af7efc82f60100347/test/5de8ce86c05b97000826d0ae/testActivityReport/5de8d6368269fc0008609245`
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
