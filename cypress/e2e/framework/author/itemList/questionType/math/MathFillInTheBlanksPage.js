import MathFractionPage from "./mathFractionPage";

class MathFillInTheBlanksPage extends MathFractionPage {
  constructor() {
    super();
    this.virtualKeyBoardButtons = [];
  }

  // template
  getKeyboard = () => cy.get(".keyboard");

  gettemplate = () => cy.get("[answer-math-input-field] [mathquill-block-id]");

  getDeleteAnswerMethod = () =>
    this.getMathFormulaAnswers()
      .last()
      .find('[data-cy="delete-answer-method"]');

  getMathquillBlockId = () => this.getAnswerMathInputField().find("[mathquill-block-id]");

  checkCorrectAnswerWithResponse = (expectedValues, preview) => {
    preview.header.preview();
    preview.getClear().click();
    this.getPreviewMathQuill().then(inputElements => {
      expectedValues.forEach((expectedValue, index) => {
        cy.wrap(inputElements[index]).type(expectedValue, { force: true });
      });
    });
    preview
      .getCheckAnswer()
      .click()
      .then(() =>
        cy
          .get("body")
          .children()
          .should("contain", "score: 0/1")
      );
    this.checkAttr(false);
    preview
      .getClear()
      .click()
      .then(() => {
        cy.get("body")
          .children()
          .should("not.contain", "Correct Answers");
      });
    preview.header.edit();
  };
}

export default MathFillInTheBlanksPage;
