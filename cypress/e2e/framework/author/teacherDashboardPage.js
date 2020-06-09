import CypressHelper from "../util/cypressHelpers";

export default class TeacherDashBoardPage {
  // *** ELEMENTS START ***

  getClasCardByName = className => cy.get(`[data-cy="${className}"]`);

  getMeetLauncherButton = () => cy.get('[data-cy="launch-google-meet"]');

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnClassDropDown = () => cy.get('[data-cy="select-class"]').click();

  clickOnManageClass = () => cy.get('[data-cy="manageClass"]').click();

  clickOnLaunchGoogleMeet = () => this.getMeetLauncherButton().click();

  selectClassOnMeet = clas => CypressHelper.selectDropDownByAttribute("select-class", clas);

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  getClassListOnMeet = () => this.clickOnClassDropDown().then(() => CypressHelper.getDropDownList("select-class"));

  verifyLauncherPopupIsShown = () =>
    cy.contains("Select the class that you want to invite for the Google Meet session.").should("be.visible");

  verifyClassDetail = (className, grade, subject, students, assignmentCount = 0, assignmentTitle, asgnStatus) => {
    this.getClasCardByName(className).as("classCard");
    cy.get("@classCard")
      .find('[data-cy="name"]')
      .should("have.text", className);

    cy.get("@classCard")
      .find('[data-cy="grades"]')
      .parent()
      .should("contain.text", grade);

    cy.get("@classCard")
      .find('[data-cy="subject"]')
      .should("have.text", subject);

    cy.get("@classCard")
      .find('[data-cy="studentCount"]')
      .should("have.text", `${students} ${students > 1 ? "Students" : "Student"}`);

    cy.get("@classCard")
      .find('[data-cy="totalAssignment"]')
      .should("have.text", `${assignmentCount}`);

    cy.get("@classCard")
      .find('[data-cy="assignmentTitle"]')
      .should("contain.text", assignmentCount > 0 ? assignmentTitle : "No Recent Assignments");

    if (assignmentCount > 0) {
      cy.get("@classCard")
        .find('[data-cy="assignmentStatus"]')
        .should("contain.text", asgnStatus);
    }
  };

  // *** APPHELPERS END ***
}
