import TestHeader from "./header";
import searchFiltersPage from "../../searchFiltersPage";
import Header from "../../itemList/itemDetail/header";
import QuestionResponsePage from "../../../author/assignments/QuestionResponsePage";
import StudentTestPage from "../../../student/studentTestPage";
import {
  attemptTypes,
  questionTypeKey as questionType,
  queColor
} from "../../../../../e2e/framework/constants/questionTypes";
import { now } from "moment";

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
      .closest("tr")
      .find(".ant-checkbox-input")
      .click({ force: true });
  };
  clickOnRemoveSelected = () => cy.get('[data-cy="removeSelected"]').click();

  clickOnMoveTo = () => this.getMoveTo().click();

  getMoveTo = () => cy.get('[data-cy="moveto"]');

  clickOnExpandCollapseRow = () => cy.get('[data-cy="expandCollapseRow"]').click();

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
    this.getQueCardByItemIdInCollapsed(id)
      .find("span", "Preview")
      .click({ force: true });
  };

  updatePointsByID = (id, points) => {
    this.getQueCardByItemIdInCollapsed(id)
      .find("input")
      .type("{selectall}", { force: true })
      .type(points, { force: true });
  };

  asesrtPointsByid = (id, points) => {
    this.getQueCardByItemIdInCollapsed(id)
      .find(".ant-input-lg")
      .should("have.value", points.toString());
  };

  clickOnViewAsStudent = () => {
    cy.wait(3000);
    cy.get('[data-cy="viewAsStudent"]').click({ force: true });
  };

  clickOnShowAnsOnPreview = () => cy.get('[data-cy="ShowAnswer"]').click({ force: true });

  clickOnCheckAnsOnPreview = () => cy.get('[data-cy="CheckAnswer"]').click({ force: true });

  closePreiview = () => cy.get(".ant-modal-close-icon").click({ force: true });

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

  // Edit and Copy buuton on preview
  getEditOnPreview = () => cy.get('[title="Edit item"]');

  getCopyOnPreview = () => cy.get('[title="CLONE"]');

  clickOnCopyItemOnPreview = () => {
    cy.server();
    cy.route("GET", "**/api/testitem/**").as("editItem");
    this.getCopyOnPreview().click({ force: true });
    cy.wait("@editItem");
  };
  // text in edit item page
  getTextInEditItem = () =>
    cy
      .get('[data-cy="tabs"]')
      .next()
      .find("input")
      .eq(0);

  // Edit and Get new Item id while copying/duplicate item
  editAndGetNewItemId = points => {
    this.editItem(points);
    cy.url().then(url => {
      let _id = url.split("/").reverse()[3];
      cy.saveItemDetailToDelete(_id);
    });
    return cy.url().then(url => url.split("/").reverse()[3]);
  };
  // When we are edit/copy a item from test its url include test id
  verifyItemUrl = (testId, ItemId) => {
    cy.url().should("contain", `/author/items/${ItemId}/item-detail/test/${testId}`);
  };

  clickOnEditItemOnPreview = () => {
    cy.server();
    cy.route("GET", "**/api/testitem/**").as("editItem");
    this.getEditOnPreview().click({ force: true });
    cy.wait("@editItem");
  };

  editItem = points => {
    this.getTextInEditItem()
      .type("{selectall}", { force: true })
      .type(points, { force: true });
  };

  verifyQuestionResponseCard = (queTypeKey, attemptData, attemptType, isShowAnswer = false) => {
    const { right, wrong, partialCorrect, item } = attemptData;
    const attempt =
      attemptType === attemptTypes.RIGHT
        ? right
        : attemptType === attemptTypes.WRONG
        ? wrong
        : attemptType === attemptTypes.PARTIAL_CORRECT
        ? partialCorrect
        : undefined;
    const quest = queTypeKey.split(".")[0];
    if (!item) cy.get('[data-cy="question-container"]').as("quecard");
    else {
      this.getQueContainerById(item).as("quecard");
    }
    if (attemptData.hasOwnProperty("item")) delete attemptData["item"];

    switch (quest) {
      case questionType.MULTIPLE_CHOICE_STANDARD:
      case questionType.MULTIPLE_CHOICE_MULTIPLE:
      case questionType.TRUE_FALSE:
      case questionType.MULTIPLE_CHOICE_BLOCK:
        if (isShowAnswer) {
          if (Cypress._.isArray(right)) {
            right.forEach(choice => {
              this.qrp.verifyLabelClass(cy.get("@quecard"), choice, attemptTypes.RIGHT);
              this.qrp.verifyLabelBackgroundColor(cy.get("@quecard"), choice, queColor.LIGHT_GREEN);
            });
          } else {
            this.qrp.verifyLabelClass(cy.get("@quecard"), right, attemptTypes.RIGHT);
            this.qrp.verifyLabelBackgroundColor(cy.get("@quecard"), right, queColor.LIGHT_GREEN);
          }
        } else {
          switch (attemptType) {
            case attemptTypes.RIGHT:
              if (Cypress._.isArray(right)) {
                right.forEach(choice => {
                  this.qrp.verifyLabelChecked(cy.get("@quecard"), choice);
                  this.qrp.verifyLabelClass(cy.get("@quecard"), choice, attemptTypes.RIGHT);
                  this.qrp.verifyLabelBackgroundColor(cy.get("@quecard"), choice, queColor.LIGHT_GREEN);
                });
              } else {
                this.qrp.verifyLabelChecked(cy.get("@quecard"), right);
                this.qrp.verifyLabelClass(cy.get("@quecard"), right, attemptTypes.RIGHT);
                this.qrp.verifyLabelBackgroundColor(cy.get("@quecard"), right, queColor.LIGHT_GREEN);
              }
              break;
            case attemptTypes.WRONG:
              if (Cypress._.isArray(wrong)) {
                wrong.forEach(choice => {
                  this.qrp.verifyLabelChecked(cy.get("@quecard"), choice);
                  this.qrp.verifyLabelClass(cy.get("@quecard"), choice, attemptTypes.WRONG);
                  this.qrp.verifyLabelBackgroundColor(cy.get("@quecard"), choice, queColor.LIGHT_RED);
                });
              } else {
                this.qrp.verifyLabelChecked(cy.get("@quecard"), wrong);
                this.qrp.verifyLabelClass(cy.get("@quecard"), wrong, attemptTypes.WRONG);
                this.qrp.verifyLabelBackgroundColor(cy.get("@quecard"), wrong, queColor.LIGHT_RED);
              }
              break;
          }
        }
        break;

      case questionType.CHOICE_MATRIX_STANDARD:
      case questionType.CHOICE_MATRIX_INLINE:
      case questionType.CHOICE_MATRIX_LABEL: {
        const { steams } = attemptData;
        if (isShowAnswer) {
          this.qrp.verifyCorrectAnseredMatrix(cy.get("@quecard"), right, steams);
        } else {
          switch (attemptType) {
            case attemptTypes.RIGHT:
              this.qrp.verifyAnseredMatrix(cy.get("@quecard"), right, steams, attemptType);
              break;

            case attemptTypes.WRONG:
              this.qrp.verifyAnseredMatrix(cy.get("@quecard"), wrong, steams, attemptType);
              break;

            case attemptTypes.PARTIAL_CORRECT:
              this.qrp.verifyAnseredMatrix(cy.get("@quecard"), partialCorrect, steams, attemptType);
              break;

            default:
              break;
          }
        }
        break;
      }
      case questionType.CLOZE_DROP_DOWN:
        if (isShowAnswer) this.qrp.verifyCorrectAnswerCloze(cy.get("@quecard"), right);
        else this.qrp.verifyAnswerCloze(cy.get("@quecard"), attempt, attemptType, right);
        break;
      default:
        break;
    }
  };

  verifyEvaluationScoreOnPreview = (attemptData, points, questionType, attemptType) => {
    let score = this.qrp.getScoreByAttempt(attemptData, points, questionType.split(".")[0], attemptType);
    cy.get(".ant-message-custom-content").should("contain", `${score}/${points}`);
  };
}
