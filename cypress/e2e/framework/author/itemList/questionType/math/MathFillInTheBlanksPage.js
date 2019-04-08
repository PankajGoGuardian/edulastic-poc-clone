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

  checkCorrectAnswerWithResponse = (expectedValues, preview, inputLength, isCorrect) => {
    preview.header.preview();
    preview.getClear().click();
    this.getPreviewMathQuill().then(inputElements => {
      if (Array.isArray(expectedValues)) {
        expectedValues.forEach((expectedValue, index) => {
          cy.wrap(inputElements[index]).typeWithDelay(expectedValue);
        });
      } else {
        cy.wrap(inputElements).typeWithDelay(expectedValues);
      }
    });
    preview
      .getCheckAnswer()
      .click()
      .then(() =>
        cy
          .get("body")
          .children()
          .should("contain", `score: ${isCorrect ? "1/1" : "0/1"}`)
      );
    this.checkAttr(isCorrect);
    preview
      .getClear()
      .click()
      .then(() => {
        cy.get("body")
          .children()
          .should("not.contain", "Correct Answers");
      });
    preview.header.edit();

    if (inputLength > 0) this.clearAnswerValueInput(inputLength);
  };
}

export default MathFillInTheBlanksPage;
