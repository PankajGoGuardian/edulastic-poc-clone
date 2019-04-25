import MathMatricesPage from "./mathMatricesPage";

class MathClozePage extends MathMatricesPage {
  constructor() {
    super();
    this.test = {};
    this.selector = "#template";
  }

  // template
  getToolbarTemplate = (selector = this.selector) => cy.get(selector);

  findByselector = (selector, target) =>
    this.getToolbarTemplate(target)
      .find(selector)
      .should("be.visible");

  getQuestionContainer = () => cy.get('[data-cy="question-container"]');

  typeInResponseBox = () => this.getQuestionContainer().find(".ql-editor textarea");

  getLastCollapseItem = () => this.getQuestionArea().find(".ant-collapse-item");

  getResponseBoxValue = () => cy.get("span.mq-root-block.mq-hasCursor");

  getSucsessBox = () => this.getQuestionContainer().find(".ql-editor .mathField");

  getEditableField = () => this.getQuestionContainer().find(".ql-editor .mq-editable-field");

  checkAnswerHighlightColor = isCorrect => () =>
    this.getSucsessBox().each(elem => cy.wrap(elem).should("have.class", `${isCorrect ? "success" : "wrong"}`));

  checkMathClozeCorrectAnswer = (expectedValues, preview, inputLength, isCorrect, multipleResponse = false) => {
    preview.header.preview();
    preview.getClear().click();
    this.typeInResponseBox().then(inputElements => {
      if (Array.isArray(expectedValues)) {
        expectedValues.forEach((expectedValue, index) => {
          if (multipleResponse) {
            cy.wrap(inputElements[index]).typeWithDelay(expectedValue);
          } else {
            this.typeInResponseBox().typeWithDelay(expectedValue);
          }
        });
      } else {
        this.typeInResponseBox().typeWithDelay(expectedValues);
      }
    });

    this.checkNoticeMessageScore(preview, isCorrect, this.checkAnswerHighlightColor(isCorrect));

    preview.header.edit();
    if (inputLength > 0) this.clearAnswerValueInput(inputLength);
  };

  allowDecimalMarksWithMathCloze = (separator, thousand, inputLength, expected, preview, isCorrect = false) => {
    this.getAnswerAllowThousandsSeparator().check({ force: true });
    this.setAnswerSetDecimalSeparatorDropdown(separator);
    this.setThousandsSeparatorDropdown(thousand);
    this.checkMathClozeCorrectAnswer(expected, preview, inputLength, isCorrect);
    this.getAnswerAllowThousandsSeparator().uncheck({ force: true });
  };

  checkUncheckMathClozeChecbox = (preview, input, expected, checkboxValues, isCorrectAnswer) => {
    checkboxValues.forEach((checkboxValue, index) => {
      this.setValue(input, 0);
      this.setSeparator(checkboxValue)();
      this.checkMathClozeCorrectAnswer(expected, preview, input.length, isCorrectAnswer[index]);
    });
  };

  setMethodAndResponse = method => {
    this.getComposeQuestionTextBox()
      .last()
      .clear();
    this.findByselector(".ql-insertStar").click({ force: true });
    this.getAddNewMethod().click();
    this.setMethod(method);
  };

  setResponseBox = boxTexts => {
    this.getComposeQuestionTextBox()
      .last()
      .clear();
    boxTexts.forEach(boxText => {
      this.getComposeQuestionTextBox()
        .last()
        .type(boxText);
      this.findByselector(".ql-insertStar").click({ force: true });
    });
  };

  getQuestionArea = () => cy.get(`[data-cy="question-area"]`);

  getComposeQuestionTextBox = () => this.getQuestionArea().find(".ql-editor");

  // getComposeQuestionTextBoxLink = () => this.getQuestionArea().find(".ql-editor p");

  setAndCheckMathClozeCorrectAnswer = ({ expected, input, checkboxValues, isCorrectAnswer }, preview, respQuantity) => {
    isCorrectAnswer.forEach((isCorrect, index) => {
      this.getLastCollapseItem()
        .last()
        .click();
      for (let i = 0; i < respQuantity; i++) {
        this.setValue(input[i], i);
        this.setSeparator(checkboxValues[index])(i);
      }
      this.checkMathClozeCorrectAnswer(expected, preview, input.length, isCorrect, true);
    });
  };

  setAndCheckAllowDecimalMarks = (
    { input, expected, isCorrectAnswer },
    preview,
    thousandsTestingSeparators,
    decimalSeparators,
    respQuantity
  ) => {
    isCorrectAnswer.forEach((isCorrect, index) => {
      this.unCheckAllCheckBox();
      this.getLastCollapseItem()
        .last()
        .click();

      for (let i = 0; i < respQuantity; i++) {
        this.setValue(input, i);
        this.setSeparator("getAnswerAllowThousandsSeparator")(i);
        this.setAnswerSetDecimalSeparatorDropdown(decimalSeparators[index], i);
        this.setThousandsSeparatorDropdown(thousandsTestingSeparators[index], i);
      }
      this.checkMathClozeCorrectAnswer(expected[index], preview, 0, isCorrect, true);
    });
  };
}

export default MathClozePage;
