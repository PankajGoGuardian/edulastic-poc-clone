class AuthorAssignmentPage {
  clickOnEllipsis(index) {
    return cy
      .get(".ant-pagination-item-ellipsis")
      .eq(`${index}`)
      .click();
  }

  clickOnPageIndex(index) {
    return cy.get(`.ant-pagination-item-${index}`).click();
  }

  clickOnButtonToShowAllClassByIndex(index) {
    return cy
      .get("[data-cy=ButtonToShowAllClasses]")
      .eq(index)
      .click({ force: true });
  }

  clcikOnPresenatationIconByIndex = index => {
    cy.server();
    cy.route("GET", "**/assignments/**").as("assignment");
    cy.get("[data-cy=PresentationIcon]")
      .children()
      .eq(index)
      .click();
    cy.wait("@assignment");
  };

  getStatus = () => cy.get('[data-cy="status"]');

  verifyStatus = status => this.getStatus().should("have.text", status);

  getSubmitted = () => cy.get('[data-cy="submitted"]');

  verifySubmitted = submitted => this.getSubmitted().should("have.text", submitted);

  getGraded = () => cy.get('[data-cy="graded"]');

  verifyGraded = graded => this.getGraded().should("have.text", graded);

  clickOnActions = () => cy.contains("span", "ACTIONS").click({ force: true });

  clickOnReleaseGrade = () => cy.get('[data-cy="release-grades"]').click({ force: true });

  clickOnApply = () => cy.get('[data-cy="apply"]').click({ force: true });

  setReleaseGradeOption = releaseGradeType => {
    cy.server();
    cy.route("PUT", "**/assignments/**").as("assignmentUpdate");
    this.clickOnActions();
    this.clickOnReleaseGrade();
    cy.get(`[data-cy='${releaseGradeType}']`).click({ force: true });
    this.clickOnApply({ force: true });
    cy.wait("@assignmentUpdate").then(xhr => {
      expect(xhr.status).to.eq(200);
      // waiting for sqs to process
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(5000);
    });
  };
}

export default AuthorAssignmentPage;
