import AssignmentsPage from "./assignmentsPage";
import ReportsPage from "./reportsPage";

class SidebarPage {
  // *** ELEMENTS START ***
  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  onClickMyProfile = () => {
    cy.get("[data-cy=userInfo]").click();
    cy.contains("My Profile").click({ force: true });
  };

  clickOnAssignment = () => {
    cy.get('[data-cy="Assignments"]').dblclick({ force: true });
    return cy.get('[data-cy="title"]').contains("Assignments");
  };

  clickOnGrades = () => {
    cy.get('[data-cy="Grades"]')
      .click({ force: true })
      .click({ force: true });
    return cy.get('[data-cy="title"]').contains("Grades");
  };

  clickOnSkillMastery = () => {
    cy.get('[data-cy="Skill Mastery"]')
      .click({ force: true })
      .click({ force: true });
  };

  clickOnManageClass = () => {
    cy.get('[data-cy="My Classes"]')
      .click({ force: true })
      .click({ force: true });
  };

  clickOnMyClasses = () => {
    cy.get('[data-cy="My Classes"]')
      .click({ force: true })
      .click({ force: true });
  };
  // *** ACTIONS END ***

  // *** APPHELPERS START ***
  // *** APPHELPERS END ***

  clickOnPlaylistLibrary = () => {
    cy.server();
    cy.route("GET", "**/user-playlist-activity").as("getDroppedPlaylists");
    cy.get('[data-cy="Playlist"]').dblclick({ force: true });
    cy.wait("@getDroppedPlaylists");
  };
}
export default SidebarPage;
