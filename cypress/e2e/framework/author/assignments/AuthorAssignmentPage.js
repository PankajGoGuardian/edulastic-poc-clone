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
    cy.wait("@assignmentUpdate").then(xhr => expect(xhr.status).to.eq(200));
  };
}

export default AuthorAssignmentPage;
