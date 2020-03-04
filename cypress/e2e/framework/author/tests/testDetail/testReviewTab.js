/* eslint-disable default-case */
import { now } from "moment";
import TestHeader from "./header";
import searchFiltersPage from "../../searchFiltersPage";
import Header from "../../itemList/itemDetail/header";
import QuestionResponsePage from "../../assignments/QuestionResponsePage";
import StudentTestPage from "../../../student/studentTestPage";

export default class TestReviewTab {
  constructor() {
    this.testheader = new TestHeader();
    this.searchFilters = new searchFiltersPage();
    this.itemHeader = new Header();
    this.qrp = new QuestionResponsePage();
    this.studentTestPage = new StudentTestPage();
  }

  getQueCardByItemIdInCollapsed = item => cy.get(`[data-cy="${item}"]`).as("queCard");

  getQueContainerById = id => cy.get(`[data-cy="${id}"]`).find('[data-cy="question-container"]');

  verifySummary = (quetions, points) => {
    cy.get('[data-cy="question"]').should("have.text", `${quetions}`);
    cy.get('[data-cy="points"]').should("have.text", `${points}`);
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
    this.getQueCardByItemIdInCollapsed(itemId)
      .parent()
      .prev()
      .find(".ant-checkbox-input")
      .click({ force: true });
  };

  clickOnRemoveSelected = () => cy.get('[data-cy="removeSelected"]').click();

  clickOnMoveTo = () => this.getMoveTo().click();

  getMoveTo = () => cy.get('[data-cy="moveto"]');

  clickOnExpandRow = () => cy.get('[data-cy="expand-rows"]').click();

  clickOnCollapseRow = () => cy.get('[data-cy="collapse-rows"]').click();

  clickOnPreview = id =>
    this.getQueCardByItemIdInCollapsed(id)
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

  previewQuestById = id => {
    this.getQueCardByItemIdInCollapsed(id)
      .find("span", "Preview")
      .click({ force: true });
  };

  updatePointsByID = (id, points) => {
    this.getPointsOnQueCardByid(id)
      .type("{selectall}", { force: true })
      .type(points, { force: true });
  };

  getPointsOnQueCardByid = id => this.getQueCardByItemIdInCollapsed(id).find("input");

  asesrtPointsByid = (id, points) => {
    this.getQueCardByItemIdInCollapsed(id)
      .find(".ant-input-lg")
      .should("have.value", points.toString());
  };

  clickOnViewAsStudent = () => {
    cy.wait(3000);
    cy.get('[data-cy="viewAsStudent"]').click();
  };

  closePreiview = () =>
    cy
      .get(".ant-modal-close")
      .eq(0)
      .click({ force: true });

  verifyQustionById = id => {
    this.getQueCardByItemIdInCollapsed(id).should("exist");
  };

  moveQuestionByIndex = index => {
    this.clickOnMoveTo();
    this.getMoveTo()
      .find("input")
      .clear({ force: true })
      .type(index, { force: true });
    this.getMoveTo()
      .contains("Reorder")
      .click({ force: true });
  };

  verifyMovedQuestionById = (id, index) => {
    this.getQueCardByItemIdInCollapsed(id)
      .closest("tr")
      .should("have.attr", "data-row-key", (index - 1).toString());
  };

  getQueContainer = () => cy.get('[data-cy="question-container"]');

  verifyNoOfItemsInGroupByNo = (group, itemCount) => {
    cy.get(`[data-cy="item-Group ${group}"]`).should("contain", itemCount);
  };

  verifyItemCoutInPreview = count => this.getAllquestionInReview().should("have.length", count);

  getAllquestionInReview = () => cy.get('[data-cy="styled-wrapped-component"]');

  getItemIdIdByIndex = index =>
    cy
      .get('[data-cy="styled-wrapped-component"]')
      .eq(index)
      .parent()
      .invoke("attr", "data-cy");
}
