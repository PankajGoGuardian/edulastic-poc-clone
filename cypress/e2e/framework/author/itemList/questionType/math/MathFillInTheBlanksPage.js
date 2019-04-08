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

  checkUncheckChecbox = (preview, input, expected, checkboxValues, isCorrectAnswer) => {
    checkboxValues.forEach((checkboxValue, index) => {
      this.setValue(input);
      this.setSeparator(checkboxValue)();
      this.checkCorrectAnswer(expected, preview, input.length, isCorrectAnswer[index]);
    });
  };

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

  setAnswerArgumentDropdownValue = value =>
    this.getAnswerRuleArgumentSelect()
      .click()
      .then(() => this.getAnswerArgumentDropdownByValue(value).click());

  allowDecimalMarksWithResponse = (separator, inputLength, expected, preview, isCorrect = false) => {
    this.getAnswerAllowThousandsSeparator().check({ force: true });
    this.getThousandsSeparatorDropdown()
      .click()
      .then(() => {
        this.getThousandsSeparatorDropdownList(separator)
          .should("be.visible")
          .click();
      });
    this.checkCorrectAnswerWithResponse(expected, preview, inputLength, isCorrect);
    this.getAnswerAllowThousandsSeparator().uncheck({ force: true });
  };
}

export default MathFillInTheBlanksPage;
