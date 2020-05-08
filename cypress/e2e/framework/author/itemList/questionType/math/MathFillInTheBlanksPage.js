import MathFractionPage from "./mathFractionPage";

class MathFillInTheBlanksPage extends MathFractionPage {
  constructor() {
    super();
    this.virtualKeyBoardButtons = [];
  }

  // template
  getKeyboard = () => cy.get('[class^="MathKeyboard"]').first();

  gettemplate = () => cy.get("[answer-math-input-field] [mathquill-block-id]");

  getMathDropDownKeyBoard = () => cy.get('[data-cy="math-keyboard-dropdown"]').first();

  getInterMediateKeyBoardInDropDown = () => cy.get('[data-cy="math-keyboard-dropdown-list-1"]');

  getBasicKeyBoardInDropDown = () => cy.get('[data-cy="math-keyboard-dropdown-list-0"]');

  getDeleteAnswerMethod = () =>
    this.getMathFormulaAnswers()
      .last()
      .find('[data-cy="delete-answer-method"]');

  getMathquillBlockId = () =>
    cy
      .get('[data-cy="answer-math-input-field"]')
      .first()
      .find(".mq-root-block");

  checkCorrectAnswerWithResponse = (expectedValues, preview, inputLength, isCorrect, clearedResponse = false) => {
    preview.header.preview();
    preview.getClear().click();

    if (Array.isArray(expectedValues)) {
      expectedValues.forEach((expectedValue, index) => {
        if (!clearedResponse) {
          this.getAnswerMathTextArea()
            .eq(index)
            .typeWithDelay(expectedValue);
        } else {
          this.getAnswerMathTextArea().typeWithDelay(expectedValue);
        }
      });
    } else {
      this.getAnswerMathTextArea().typeWithDelay(expectedValues);
    }

    this.checkNoticeMessageScore(preview, isCorrect, this.checkAttr(isCorrect));
    preview.header.edit();
    //this.clearTemplateInput();
    if (inputLength > 0) this.clearAnswerValueInput(inputLength + 5);
  };

  setThousandsSeparatorDropdown = (separator, order = 0) => {
    const inputOrder = order ? "last" : "first";
    this.getThousandsSeparatorDropdown()
      [inputOrder]()
      .click()
      .then(() => {
        this.getThousandsSeparatorDropdownList(separator)
          [inputOrder]()
          //.should("be.visible")
          .click({ force: true });
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

  getMathKeyboardResponse = () => cy.get('[class^="KeyboardHeader__ResponseBtn"]');

  clearTemplateInput = () =>
    this.getMathquillBlockId().then(inputElements => {
      const { length } = inputElements[0].children;
      if (length > 0) {
        this.getAnswerInputMathTextarea()
          .movesCursorToEnd(length)
          .type("{backspace}".repeat(length || 1), { force: true });
      }
    });

  setResponseInput = temp => {
    this.getTemplateInput()
      .click({ force: true })
      .then(ele => {
        temp.forEach(val => {
          if (val == "r") {
            this.getMathDropDownKeyBoard().click();
            this.getBasicKeyBoardInDropDown();
            this.getMathKeyboardResponse().click({ force: true });
          } else if (["/"].indexOf(val) >= 0) {
            this.getMathDropDownKeyBoard().click();
            this.getBasicKeyBoardInDropDown().click();
            this.getVirtualKeyBoardItem(val).click();
          } else {
            this.getAnswerInputMathTextarea()
              .first()
              .type(val, { force: true });
          }
        });
      });
  };

  setTemplateValue = (keyName, valueAfterEqualSign) => {
    this.clearTemplateInput();
    this.setResponseInput();
    this.getTemplateInput().type(valueAfterEqualSign, { force: true });
    this.setResponseInput();
    this.getVirtualKeyBoardItem(keyName).click();
  };

  setValueFill = (input, order = 1) => {
    const inputOrder = this.getOrder(order);
    this.clearAnswerValueInput(5);
    /* this.getMathFormulaAnswers()
      [inputOrder]().get('[data-cy="math-formula-answer"]') */

    input.forEach((val, key) => {
      cy.wait(1000);
      this.getAnswerValueMathInput()
        .eq(key)
        .type(val, { force: true });
    });
    // .find('textarea')
    // // .type("{rightarrow}".repeat(10), { force: true })
    // // .type("{backspace}".repeat(10), { force: true })
    // .then(element => {
    //   cy.get("[mathquill-block-id]").then(elements => {
    //     const newOrder = elements.length === 4 && order === 1 ? 2 : order;
    //     const { length } = elements[newOrder].innerText;
    //     cy.wrap(element)
    //       [inputOrder]()
    //       .type("{del}".repeat(length === 0 ? 1 : length), { force: true })
    //       .typeWithDelay(input, { force: true });
    //   });
    // });
  };

  checkUncheckChecboxFill = (preview, input, expected, checkboxValues, isCorrectAnswer, temp) => {
    checkboxValues.forEach((checkboxValue, index) => {
      this.clearTemplateInput();
      this.setResponseInput(temp);
      this.setValueFill(input);
      this.setSeparator(checkboxValue)();
      this.checkCorrectAnswerWithResponse(expected, preview, input.length, isCorrectAnswer[index]);
    });
  };

  clearAnswerValueInput = length => {
    this.getAnswerValueMathInput().then(elements => {
      var len = elements.length;
      for (let i = 0; i < len; i++)
        this.getAnswerValueMathInput()
          .eq(i) /* .type('',{force:true}) */
          .type("{leftarrow}{backspace}{del}".repeat(length || 1), { force: true });
    });
  };
}

export default MathFillInTheBlanksPage;
