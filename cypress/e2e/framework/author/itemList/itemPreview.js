/* eslint-disable default-case */
import QuestionResponsePage from "../assignments/QuestionResponsePage";
import { questionType, attemptTypes, queColor } from "../../constants/questionTypes";

export default class PreviewItemPopup {
  constructor() {
    this.qrp = new QuestionResponsePage();
  }

  getQueContainer = () => cy.get('[data-cy="question-container"]');

  closePreiview = () => cy.get(".ant-modal-close-icon").click();

  clickOnShowAnsOnPreview = () => cy.get('[data-cy="show-answers-btn"]').click({ force: true });

  clickOnCheckAnsOnPreview = () => cy.get('[data-cy="check-answer-btn"]').click({ force: true });

  // Edit and Copy buuton on preview
  getEditOnPreview = () => cy.get('[title="Edit item"]');

  getCopyOnPreview = () => cy.get('[title="CLONE"]');

  clickOnCopyItemOnPreview = () => {
    cy.server();
    cy.route("GET", "**/api/testitem/*").as("editItem");
    this.getCopyOnPreview().click({ force: true });
    return cy.wait("@editItem").then(xhr => xhr.response.body.result._id);
  };

  clickEditOnPreview = () => {
    cy.server();
    cy.route("GET", "**/api/testitem/*").as("editItem");
    this.getEditOnPreview().click({ force: true });
    return cy.wait("@editItem").then(xhr => xhr.response.body.result._id);
  };

  // text in edit item page
  getTextInEditItem = () =>
    cy
      .get('[data-cy="tabs"]')
      .next()
      .find("input")
      .eq(0);

  // When we are edit/copy a item from test its url include test id
  verifyItemUrlWhileEdit = (testId, ItemId) => {
    // cy.url().should("contain", `/author/items/${ItemId}/item-detail/test/${testId}`);
    cy.url().should("contain", `/tests/${testId}/editItem/${ItemId}`);
  };

  verifyItemUrlWhileCopy = (testId, ItemId) => {
    // cy.url().should("contain", `/author/items/${ItemId}/item-detail/test/${testId}`);
    cy.url().should("contain", `/tests/${testId}/editItem/${ItemId}`);
  };

  clickOnEditItemOnPreview = () => {
    cy.server();
    cy.route("GET", "**/api/testitem/*").as("editItem");
    this.getEditOnPreview().click({ force: true });
    cy.wait("@editItem");
  };

  getQueContainerById = id => cy.get(`[data-cy="${id}"]`).find('[data-cy="question-container"]');

  closePreiview = () =>
    cy
      .get(".ant-modal-close")
      .eq(0)
      .click({ force: true });

  getEvaluationMessage = () => cy.get(".ant-message-custom-content");

  verifyEvaluationScoreOnPreview = (attemptData, points, questionType, attemptType) => {
    const score = this.qrp.getScoreByAttempt(attemptData, points, questionType.split(".")[0], attemptType);
    this.getEvaluationMessage().should("contain", `${score}/${points}`);
  };

  clickOnDeleteOnPreview = (used = false) => {
    cy.server();
    cy.route("DELETE", "**/api/testitem/*").as("deleteItem");
    cy.get('[title="Delete item"]').click({ force: true });

    if (used) {
      cy.wait("@deleteItem").then(xhr => expect(xhr.status).eq(403));
      this.getEvaluationMessage().should("contain", `The item is used in the test`);
    } else {
      cy.wait("@deleteItem").then(xhr => expect(xhr.status).eq(200));
      this.getEvaluationMessage().should("contain", `item deleted successfully`);
    }
  };

  verifyEditOption = () => {
    this.getEditOnPreview().should("be.visible");
    this.getCopyOnPreview().should("be.visible");
  };

  verifyNoEditCloneOption = () => {
    this.getEditOnPreview().should("not.be.visible");
    this.getCopyOnPreview().should("be.visible");
  };

  clickOnClear = () => cy.get('[data-cy="clear-btn"]').click({ force: true });

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
    if (attemptData.hasOwnProperty("item")) delete attemptData.item;

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
}
