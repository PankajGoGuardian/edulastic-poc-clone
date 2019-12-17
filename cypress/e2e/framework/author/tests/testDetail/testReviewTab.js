import TestHeader from "./header";
import searchFiltersPage from "../../searchFiltersPage";
import Header from "../../itemList/itemDetail/header";
export default class TestReviewTab {
  getQueCardByItemId = item => cy.get(`[data-cy="${item}"]`).as("queCard");
  constructor() {
    this.testheader = new TestHeader();
    this.searchFilters = new searchFiltersPage();
    this.itemHeader = new Header();
  }
  verifySummary = (quetions, points) => {
    cy.get('[data-cy="question"]').should("have.text", quetions);
    cy.get('[data-cy="points"]').should("have.text", points);
  };

  verifyGradeSubject = (grade, subject) => {
    this.getTestGradeSelect()
      .find(".ant-select-selection__choice")
      .contains(grade);

    this.getTestSubjectSelect()
      .find(".ant-select-selection__choice")
      .contains(subject);
  };
  getTestGradeSelect = () => cy.get('[data-cy="gradeSelect"]');
  getTestSubjectSelect = () => cy.get('[data-cy="subjectSelect"]');
  selectGrade = grade => {
    this.getTestGradeSelect().click({ force: true });
    cy.get(".ant-select-dropdown-menu-item")
      .contains(grade)
      .click({ force: true });
    this.getTestGradeSelect()
      .find("input")
      .type("{esc}", { force: true });
  };
  selectSubject = subject => {
    this.getTestSubjectSelect().click({ force: true });
    cy.get(".ant-select-dropdown-menu-item")
      .contains(subject)
      .click({ force: true });
    cy.focused().blur();
  };

  clickOnCheckBoxByItemId = itemId => {
    this.getQueCardByItemId(itemId)
      .closest("tr")
      .find(".ant-checkbox-input")
      .click({ force: true });
  };
  clickOnRemoveSelected = () => cy.get('[data-cy="removeSelected"]').click();

  clickOnMoveTo = () => cy.get('[data-cy="moveto"]').click();

  clickOnExpandCollapseRow = () => cy.get('[data-cy="expandCollapseRow"]').click();

  clickOnPreview = id =>
    this.getQueCardByItemId(id)
      .contains("Preview")
      .click();

  previewAndEditById = id => {
    cy.server();
    cy.route("GET", "**/api/testitem/**").as("editItem");
    this.clickOnPreview(id);
    cy.get('[data-cy="question-container"]')
      .parent()
      .parent()
      .parent()
      .children()
      .eq(0)
      .contains("edit")
      .click();
    cy.wait("@editItem");
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

  verifyItemByContent = question =>
    cy
      .get('[data-cy="styled-wrapped-component"]')
      .contains(question)
      .should("be.exist", `verify added items - ${question}should appear in review tab`);

  getQueContainer = () => cy.get('[data-cy="question-container"]');

  clickEditOnPreview = () => {
    cy.server();
    cy.route("GET", "**/api/testitem/**").as("editItem");
    this.getQueContainer()
      .find("span", "edit")
      .click({ force: true });
    cy.wait("@editItem");
  };
  editQuestionText = text => {
    cy.get("[data-cy='questiontext']")
      .find("p")
      .clear({ force: true })
      .type(text, { force: true });
  };
  previewQuestById = id => {
    this.getQueCardByItemId(id)
      .find("span", "Preview")
      .click({ force: true });
  };
  updatePointsByID = (id, points) => {
    this.getQueCardByItemId(id)
      .find("input")
      .type("{selectall}", { force: true })
      .type(points, { force: true });
  };
  assertAnsInExpandedModeById = (id, correct) => {
    this.getQueCardByItemId(id)
      .find('[data-cy="styled-wrapped-component"]')
      .contains(correct)
      .parentsUntil("label")
      .parent()
      .should("have.css", "background-color", "rgb(211, 254, 166)");
  };
  asesrtPointsByid = (id, points) => {
    this.getQueCardByItemId(id)
      .find(".ant-input-lg")
      .should("have.value", points.toString());
  };
  clickOnViewAsStudent = () => {
    cy.wait(3000);
    cy.get('[data-cy="viewAsStudent"]').click({ force: true });
  };
  clickOnShowAnsOnPreview = () =>
    this.getQueContainer()
      .find("span", "SHOW ANSWER")
      .click({ force: true });
  clickOnCheckAnsOnPreview = () =>
    this.getQueContainer()
      .find("span", "CHECK ANSWER")
      .click({ force: true });
  verifyCorrectAns = ans => {
    this.getQueContainer()
      .find('[data-cy="styled-wrapped-component"]')
      .contains(ans)
      .parentsUntil("label")
      .parent()
      .should("have.css", "background-color", "rgb(211, 254, 166)");
  };
  closePreiview = () => cy.get(".ant-modal-close-icon").click({ force: true });
}
