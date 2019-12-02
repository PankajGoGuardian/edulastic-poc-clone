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

  getMathKeyboardResponse = () => cy.get('[data-cy="math-keyboard-response"]');

  clearTemplateInput = () =>
    this.getMathquillBlockId().then(inputElements => {
      const { length } = inputElements[0].children;
      if (length > 0) {
        this.getTemplateInput()
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
            this.getMathKeyboardResponse().click({ force: true });
          } else {
            this.getVirtualKeyBoardItem(val).click();
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
    this.getAnswerValueMathInput().then(ele => {
      input.forEach((val, key) => {
        cy.wait(1000);
        cy.wrap(ele)
          .eq(key)
          .type(val, { force: true });
      });
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
        cy.wrap(elements)
          .eq(i) /* .type('',{force:true}) */
          .type("{leftarrow}{backspace}{del}".repeat(length || 1), { force: true });
    });
  };
}

export default MathFillInTheBlanksPage;
