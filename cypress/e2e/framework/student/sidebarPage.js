import AssignmentsPage from "./assignmentsPage";
import ReportsPage from "./reportsPage";

class SidebarPage {
  onClickMyProfile = () => {
    cy.get("[data-cy=userInfo]").click();
    cy.contains("My Profile").click({ force: true });
  };

  clickOnAssignment = () => {
    cy.get('[data-cy="Assignments"]').dblclick({ force: true });
  };

  clickOnGrades = () => {
    cy.get('[data-cy="Grades"]')
      .click({ force: true })
      .click({ force: true });
  };

  clickOnSkillMastery = () => {
    cy.get('[data-cy="Skill Mastery"]')
      .click({ force: true })
      .click({ force: true });
  };

  clickOnManageClass = () => {
    cy.get('[data-cy="Manage Class"]')
      .click({ force: true })
      .click({ force: true });
  };
}
export default SidebarPage;
