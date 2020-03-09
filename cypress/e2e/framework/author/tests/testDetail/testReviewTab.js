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

  // *** ELEMENTS START ***

  getQueCardByItemIdInCollapsed = item => cy.get(`[data-cy="${item}"]`).as("queCard");

  getQueContainerById = id => cy.get(`[data-cy="${id}"]`).find('[data-cy="question-container"]');

  getTestGradeSelect = () => cy.get('[data-cy="gradeSelect"]');

  getTestSubjectSelect = () => cy.get('[data-cy="subjectSelect"]');

  getMoveTo = () => cy.get('[data-cy="moveto"]');

  getPointsOnQueCardByid = id => this.getQueCardByItemIdInCollapsed(id).find("input");

  getAllquestionInReview = () => cy.get('[data-cy="styled-wrapped-component"]');

  getItemIdIdByIndex = index =>
    cy
      .get('[data-cy="styled-wrapped-component"]')
      .eq(index)
      .parent()
      .invoke("attr", "data-cy");

  getQueContainer = () => cy.get('[data-cy="question-container"]');

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

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

  clickOnExpandRow = () => cy.get('[data-cy="expand-rows"]').click();

  clickOnCollapseRow = () => cy.get('[data-cy="collapse-rows"]').click();

  clickOnPreview = id =>
    this.getQueCardByItemIdInCollapsed(id)
      // .contains("Preview")
      .find('[data-cy="preview" ]')
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

  previewQuestById = id => {
    this.getQueCardByItemIdInCollapsed(id)
      // .find("span", "Preview")
      .find('[data-cy="preview" ]')
      .click({ force: true });
  };

  updatePointsByID = (id, points) => {
    this.getPointsOnQueCardByid(id)
      .type("{selectall}", { force: true })
      .type(points, { force: true });
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

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

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

  verifyItemByContent = question =>
    cy
      .get('[data-cy="styled-wrapped-component"]')
      .contains(question)
      .should("be.exist", `verify added items - ${question}should appear in review tab`);

  asesrtPointsByid = (id, points) => {
    this.getQueCardByItemIdInCollapsed(id)
      .find(".ant-input-lg")
      .should("have.value", points.toString());
  };

  verifyQustionById = id => {
    this.getQueCardByItemIdInCollapsed(id).should("exist");
  };

  verifyMovedQuestionById = (id, index) => {
    this.getQueCardByItemIdInCollapsed(id).should("have.attr", "data-cy-item-index", (index - 1).toString());
  };

  verifyNoOfItemsInGroupByNo = (group, itemCount) => {
    cy.get(`[data-cy="item-Group ${group}"]`).should("contain", itemCount);
  };

  verifyItemCoutInPreview = count => this.getAllquestionInReview().should("have.length", count);

  // *** APPHELPERS END ***
}
