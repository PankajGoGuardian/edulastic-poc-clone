export default class TeacherDashBoardPage {
  getClasCardByName = className => cy.get(`[data-cy="${className}"]`);

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
      .should("have.text", assignmentCount > 1 ? assignmentTitle : "No Recent Assignments");

    if (assignmentCount > 1)
      cy.get("@classCard")
        .find('[data-cy="assignmentStatus"]')
        .should("have.text", asgnStatus);
  };
}
