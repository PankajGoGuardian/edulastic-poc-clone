export default class TestReviewTab {
  getQueCardByItemId = item => cy.get(`[data-cy="${item}"]`).as("queCard");

  verifySummary = (quetions, points) => {
    cy.get('[data-cy="question"]').should("have.text", quetions);
    cy.get('[data-cy="points"]').should("have.text", points);
  };

  verifyGradeSubject = (grade, subject) => {
    cy.get('[data-cy="gradesSelect"]')
      .find(".ant-select-selection__choice")
      .contains(grade);

    cy.get('[data-cy="subjectSelect"]')
      .find(".ant-select-selection__choice")
      .contains(subject);
  };

  clickOnCheckBoxByItemId = itemId => {
    this.getQueCardByItemId(itemId)
      .find(".ant-checkbox-input")
      .click({ force: true });
  };

  clickOnRemoveSelected = () => cy.get('[data-cy="removeSelected"]').click();

  clickOnMoveTo = () => cy.get('[data-cy="moveto"]').click();

  clickOnExpandCollapseRow = () => cy.get('[data-cy="expandCollapseRow"]').click();

  clickOnPreview = id =>
    cy
      .getQueCardByItemId(id)
      .contains("Preview")
      .click();

  previewAndEditById = id => {
    this.clickOnPreview(id);
    cy.get('[data-cy="question-container"]')
      .parent()
      .parent()
      .parent()
      .parent()
      .prev()
      .contains("EDIT")
      .click();
  };

  previewAndDuplicateById = id => {
    this.clickOnPreview(id);
    cy.get('[data-cy="question-container"]')
      .parent()
      .parent()
      .parent()
      .parent()
      .prev()
      .contains("Duplicate")
      .click();
  };
}
