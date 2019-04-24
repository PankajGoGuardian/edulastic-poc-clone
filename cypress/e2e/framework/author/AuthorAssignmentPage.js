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

  clcikOnPresenatationIconByIndex(index) {
    return cy
      .get("[data-cy=PresentationIcon]")
      .children()
      .eq(index)
      .click();
  }
}

export default AuthorAssignmentPage;
