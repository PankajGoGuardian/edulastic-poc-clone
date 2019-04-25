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

  checkCorrectAnswerWithResponse = (expectedValues, preview, inputLength, isCorrect, clearedResponse = false) => {
    preview.header.preview();
    preview.getClear().click();
    this.getAnswerMathTextArea().then(inputElements => {
      if (Array.isArray(expectedValues)) {
        expectedValues.forEach((expectedValue, index) => {
          if (!clearedResponse) {
            cy.wrap(inputElements[index]).typeWithDelay(expectedValue);
          } else {
            this.getAnswerMathTextArea().typeWithDelay(expectedValue);
          }
        });
      } else {
        cy.wrap(inputElements).typeWithDelay(expectedValues);
      }
    });

    this.checkNoticeMessageScore(preview, isCorrect, this.checkAttr(isCorrect));
    preview.header.edit();
    if (inputLength > 0) this.clearAnswerValueInput(inputLength);
  };

  setThousandsSeparatorDropdown = (separator, order = 0) => {
    const inputOrder = order ? "last" : "first";
    this.getThousandsSeparatorDropdown()
      [inputOrder]()
      .click()
      .then(() => {
        this.getThousandsSeparatorDropdownList(separator)
          [inputOrder]()
          .should("be.visible")
          .click();
      });
  };

  allowDecimalMarksWithResponse = (separator, thousand, inputLength, expected, preview, isCorrect = false) => {
    this.unCheckAllCheckBox();
    this.getAnswerAllowThousandsSeparator().check({ force: true });
    this.setAnswerSetDecimalSeparatorDropdown(separator);
    this.setThousandsSeparatorDropdown(thousand);
    this.checkCorrectAnswerWithResponse(expected, preview, inputLength, isCorrect);
    this.getAnswerAllowThousandsSeparator().uncheck({ force: true });
  };

  getMathKeyboardResponse = () => cy.get('[data-cy="math-keyboard-response"]');

  clearTemplateInput = () =>
    this.getMathquillBlockId().then(inputElements => {
      const { length } = inputElements[0].children;
      this.getTemplateInput()
        .movesCursorToEnd(length)
        .type("{backspace}".repeat(length || 1), { force: true });
    });

  setResponseInput = () =>
    this.getTemplateInput()
      .click({ force: true })
      .then(() => this.getMathKeyboardResponse().click({ force: true }));

  setTemplateValue = (keyName, valueAfterEqualSign) => {
    this.clearTemplateInput();
    this.setResponseInput();
    this.getTemplateInput().type(valueAfterEqualSign, { force: true });
    this.setResponseInput();
    this.getVirtualKeyBoardItem(keyName).click();
  };
}

export default MathFillInTheBlanksPage;
