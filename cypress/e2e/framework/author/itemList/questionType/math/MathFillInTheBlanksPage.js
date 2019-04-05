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

  setAnswerArgumentDropdownValue = value =>
    this.getAnswerRuleArgumentSelect()
      .click()
      .then(() => this.getAnswerArgumentDropdownByValue(value).click());

  setArgumentInput = (selector, input) =>
    this[selector]()
      .clear({ force: true })
      .type("{uparrow}".repeat(input), { force: true });

  setAllowedUnitsInput = units =>
    this.getAnswerAllowedUnits()
      .clear({ force: true })
      .type(units, { force: true });

  setAnswerSetDecimalSeparatorDropdown = separator =>
    this.getAnswerSetDecimalSeparatorDropdown()
      .click()
      .then(() => {
        this.getAnswerSetDecimalSeparatorDropdownList(separator)
          .should("be.visible")
          .click();
      });
}

export default MathFillInTheBlanksPage;
