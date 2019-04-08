import EditToolBar from "../common/editToolBar";
import Header from "../../itemDetail/header";

class MathFormulaEdit {
  constructor() {
    this.editToolBar = new EditToolBar();
    this.header = new Header();
    this.argumentMethods = ["linear", "quadratic"];
    this.virtualKeyBoardNumpad = [
      { value: "7", label: "7" },
      { value: "8", label: "8" },
      { value: "9", label: "9" },
      { value: "div", label: "÷" },
      { value: "4", label: "4" },
      { value: "5", label: "5" },
      { value: "6", label: "6" },
      { value: "times", label: "×" },
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "-", label: "−" },
      { value: "0", label: "0" },
      { value: ".", label: "." },
      { value: ",", label: "," },
      { value: "+", label: "+" },
      { value: "=", label: "=" }
    ];
    this.virtualKeyBoardButtons = [
      {
        handler: "g",
        label: "g",
        types: ["all", "units_si"],
        command: "cmd"
      },
      {
        handler: "kg",
        label: "kg",
        types: ["all", "units_si"],
        command: "cmd"
      },
      {
        handler: "mg",
        label: "mg",
        types: ["all", "units_si"],
        command: "cmd"
      },
      {
        handler: "µg",
        label: "µg",
        types: ["all", "units_si"],
        command: "cmd"
      },
      {
        handler: "m",
        label: "m",
        types: ["all", "units_si"],
        command: "cmd"
      },
      {
        handler: "km",
        label: "km",
        types: ["all", "units_si"],
        command: "cmd"
      },
      {
        handler: "cm",
        label: "cm",
        types: ["all", "units_si"],
        command: "cmd"
      },
      {
        handler: "mm",
        label: "mm",
        types: ["all", "units_si"],
        command: "cmd"
      },
      {
        handler: "L",
        label: "L",
        types: ["all", "units_si"],
        command: "cmd"
      },
      {
        handler: "mL",
        label: "mL",
        types: ["all", "units_si"],
        command: "cmd"
      },
      {
        handler: "s",
        label: "s",
        types: ["all", "units_si"],
        command: "cmd"
      },
      {
        handler: "ms",
        label: "ms",
        types: ["all", "units_si"],
        command: "cmd"
      },
      {
        handler: "oz",
        label: "oz",
        types: ["all", "units_us"],
        command: "cmd"
      },
      {
        handler: "lb",
        label: "lb",
        types: ["all", "units_us"],
        command: "cmd"
      },
      {
        handler: "in",
        label: "∈",
        types: ["all", "units_us"],
        command: "cmd"
      },
      {
        handler: "ft",
        label: "ft",
        types: ["all", "units_us"],
        command: "cmd"
      },
      {
        handler: "mi",
        label: "mi",
        types: ["all", "units_us"],
        command: "cmd"
      },
      {
        handler: "fl oz",
        label: "fl oz",
        types: ["all", "units_us"],
        command: "cmd"
      },
      {
        handler: "pt",
        label: "pt",
        types: ["all", "units_us"],
        command: "cmd"
      },
      {
        handler: "gal",
        label: "gal",
        types: ["all", "units_us"],
        command: "cmd"
      }
    ];
  }

  getTemplateInput = () =>
    cy
      .get('[data-cy="template-container"]')
      .wait(500)
      .next()
      .find("textarea");

  getTemplateOutput = () =>
    cy
      .get('[data-cy="template-container"]')
      .next()
      .get(".mq-root-block > [mathquill-command-id]");

  getVirtualKeyBoard = () =>
    cy
      .get('[data-cy="template-container"]')
      .next()
      .get(".input__absolute__keyboard")
      .get(".keyboard");

  removeLastValue = () =>
    cy
      .get('[data-cy="template-container"]')
      .next()
      .get(".input__absolute__keyboard")
      .first()
      .get(".keyboard")
      .find('button[data-cy="virtual-keyboard-Backspace"]')
      .click();

  getMathKeyBoardDropdown = () => cy.get('[data-cy="math-keyboard-dropdown"]');

  getMathKeyBoardDropdownList = index => cy.get(`[data-cy="math-keyboard-dropdown-list-${index}"]`);

  getPointsInput = () => cy.get('[data-cy="points"]');

  getAddNewMethod = () => cy.get('[data-cy="add-new-method"]');

  deleteLastMethod = () =>
    this.getMathFormulaAnswers()
      .last()
      .find('[data-cy="delete-answer-method"]')
      .click();

  getMathFormulaAnswers = () => cy.get('[data-cy="math-formula-answer"]');

  addAlternateAnswer = () => {
    cy.get('[data-cy="alternate"]')
      .should("be.visible")
      .click();
    return this;
  };

  getAddedAlternateAnswer = () => cy.get('[data-cy="del-alter"]');

  returnToCorrectTab = () => {
    cy.get('[data-cy="correct"]')
      .should("be.visible")
      .click();
    return this;
  };

  clearAnswerValueInput = length => {
    this.getAnswerValueMathInput().type("{del}".repeat(length || 1), { force: true });
  };

  getAnswerMathInputField = () => cy.get('[data-cy="answer-math-input-field"]');

  getAnswerMathInputStyle = () => cy.get(".input__math");

  // getAnswerMathInputStyle = () => cy.get('[data-cy="answer-math-input-style"]');

  checkCorrectAnswer = (expectedValue, preview, inputLength, isCorrect) => {
    preview.header.preview();
    preview.getClear().click();
    this.getPreviewMathQuill().should("be.empty");
    this.getPreviewMathQuill().typeWithDelay(expectedValue);
    preview
      .getCheckAnswer()
      .click()
      .then(() =>
        cy
          .get("body")
          .children()
          .should("contain", `score: ${isCorrect ? "1/1" : `0/1`}`)
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

  checkAttr = isCorrect => {
    if (isCorrect) {
      this.getAnswerMathInputStyle().should("have.attr", "style", "background: rgb(225, 251, 242);");
    } else {
      this.getAnswerMathInputStyle().should("have.attr", "style", "background: rgb(252, 224, 232);");
    }
  };

  getMethodSelectionDropdow = () => cy.get('[data-cy="method-selection-dropdown"]');

  getMethodSelectionDropdowList = index => cy.get(`[data-cy="method-selection-dropdown-list-${index}"]`);

  getAnswerValueMathInput = () =>
    cy
      .get('[data-cy="answer-math-input"]')
      .wait(3000)
      .next()
      .find("textarea");

  enterAnswerValueMathInput = input => this.getAnswerValueMathInput().typeWithDelay(input);

  getAnswerValueMathOutput = () =>
    cy
      .get('[data-cy="answer-math-input"]')
      .next()
      .get(".mq-root-block > [mathquill-command-id]");

  getAnswerAriaLabel = () => cy.get('[data-cy="answer-aria-label"]');

  getAnswerSignificantDecimalPlaces = () => cy.get('[data-cy="answer-significant-decimal-places"]');

  getAnswerIgnoreTextCheckox = () => cy.get('[data-cy="answer-ignore-text-checkbox"]');

  getAnswerCompareSides = () => cy.get('[data-cy="answer-compare-sides"]');

  getAnswerTreatEasEulersNumber = () => cy.get('[data-cy="answer-treat-eas-eulers-number"]');

  getAnswerAllowThousandsSeparator = () => cy.get('[data-cy="answer-allow-thousands-separator"]');

  getAnswerSetDecimalSeparatorDropdown = () => cy.get('[data-cy="answer-set-decimal-separator-dropdown"]');

  getAnswerSetDecimalSeparatorDropdownList = index =>
    cy.get(`[data-cy="answer-set-decimal-separator-dropdown-list-${index}"]`);

  getAddNewThousandsSeparator = () => cy.get('[data-cy="add-new-thousands-separator"]');

  getRemoveThousandsSeparator = () => cy.get('[data-cy="remove-thousands-separator"]');

  getThousandsSeparatorDropdown = () => cy.get('[data-cy="thousands-separator-dropdown"]');

  setThousandSeperator = seperator =>
    this.getThousandsSeparatorDropdown()
      .click()
      .then(() => {
        this.getThousandsSeparatorDropdownList(seperator)
          .should("be.visible")
          .click();
      });

  setDecimalSeperator = separator => {
    this.getAnswerSetDecimalSeparatorDropdown()
      .click()
      .then(() => {
        this.getAnswerSetDecimalSeparatorDropdownList(separator)
          .should("be.visible")
          .click();
      });
  };

  getThousandsSeparatorDropdownList = index => cy.get(`[data-cy="thousands-separator-dropdown-list-${index}"]`);

  getPreviewMathQuill = () =>
    cy
      .get('[data-cy="preview-header"]')
      .wait(500)
      .next()
      .next()
      .find("textarea");

  getAnswerIgnoreOrder = () => cy.get('[data-cy="answer-ignore-order"]');

  getAnswerAllowInterval = () => cy.get('[data-cy="answer-allow-interval"]');

  getAnswerIgnoreTrailingZeros = () => cy.get('[data-cy="answer-ignore-trailing-zeros"]');

  getAnswerIgnoreCoefficientOfOne = () => cy.get('[data-cy="answer-ignore-coefficient-of-one"]');

  getAnswerInverseResult = () => cy.get('[data-cy="answer-inverse-result"]');

  getAnswerTolerance = () => cy.get('[data-cy="answer-tolerance"]');

  getAnswerFieldDropdown = () => cy.get('[data-cy="answer-field-dropdown"]');

  getAnswerAllowedUnits = () => cy.get('[data-cy="answer-allowed-units"]');

  getAnswerIgnoreLeadingAndTrailingSpaces = () => cy.get('[data-cy="answer-ignore-leading-and-trailing-spaces"]');

  getAnswerTreatMultipleSpacesAsOne = () => cy.get('[data-cy="answer-treat-multipleSpacesAsOne"]');

  getAnswerRuleDropdown = () => cy.get('[data-cy="answer-rule-dropdown"]');

  // getComposeQuestionImageInput = () => cy.get('.ql-image .ql-stroke');
  getComposeQuestionImageInput = () => cy.get(".ql-image > svg");

  getCurrentStoreQuestion = () => {
    const storeValue = JSON.parse(window.localStorage.getItem("persist:root")).question;
    return JSON.parse(storeValue).entity.data;
  };

  getComposeQuestionTextBox = () => cy.get(".ql-editor");

  getComposeQuestionTextBoxLink = () => cy.get(".ql-editor p");

  getSaveLink = () => cy.get(".ql-action");

  getAnswerRuleDropdownByValue = val => cy.get(`[data-cy="answer-rule-dropdown-${val}"]`);

  getAnswerRuleArgumentInput = () => cy.get(`[data-cy="answer-rule-argument-input"]`);

  getAnswerRuleArgumentSelect = () => cy.get(`[data-cy="answer-rule-argument-select"]`);

  getAnswerArgumentDropdownByValue = val => cy.get(`[data-cy="answer-argument-dropdown-${val}"]`);

  getAnswerFieldDropdownListValue = val => cy.get(`[data-cy="answer-field-dropdown-list-${val}"]`);

  getAnswerInputMathTextarea = () => cy.get(`[data-cy="answer-input-math-textarea"]`);

  getCorrectAnswerBox = () => cy.get('[data-cy="correct-answer-box"]');

  getUploadImageIcon = () => cy.get(".ql-image");

  getEditorData = () => cy.get(".ql-editor p");

  getBody = () => cy.get("body");

  setMethod = (methods, setFunction = false, argument, setChecBox) => {
    this.getMethodSelectionDropdow()
      .click({ force: true })
      .then(() => {
        this.getMethodSelectionDropdowList(methods).click();
      });
    if (setFunction instanceof Function) setFunction(argument);
    if (setChecBox instanceof Function) setChecBox();
  };

  setValue = input => {
    this.getMathFormulaAnswers()
      .find(`[data-cy="answer-input-math-textarea"]`)
      .then(element => {
        cy.get("[mathquill-block-id]").then(elements => {
          const { length } = elements[1].innerText;
          cy.wrap(element)
            .type("{del}".repeat(length === 0 ? 1 : length), { force: true })
            .type(input, { force: true });
        });
      });
  };

  setRule = rule => {
    this.getAnswerRuleDropdown()
      .click()
      .then(() => this.getAnswerRuleDropdownByValue(rule).click());
  };

  setSeparator = checBoxName => () => {
    cy.get("input[type='checkbox']").uncheck({ force: true });
    if (checBoxName)
      this[checBoxName]()
        .check({ force: true })
        .should("be.checked");
  };

  allowDecimalMarks = (separator, inputLength, expected, preview, isCorrect = false) => {
    this.getAnswerAllowThousandsSeparator().check({ force: true });
    this.getThousandsSeparatorDropdown()
      .click()
      .then(() => {
        this.getThousandsSeparatorDropdownList(separator)
          .should("be.visible")
          .click();
      });
    this.checkCorrectAnswer(expected, preview, inputLength, isCorrect);
    this.getAnswerAllowThousandsSeparator().uncheck({ force: true });
  };

  mapIsFactorisedMethodFields = fields =>
    Object.values(fields).forEach(field =>
      this.getAnswerFieldDropdown()
        .click()
        .then(() =>
          this.getAnswerFieldDropdownListValue(field)
            .click()
            .should("be.visible")
        )
    );

  setAnswerSetDecimalSeparatorDropdown = separator =>
    this.getAnswerSetDecimalSeparatorDropdown()
      .click()
      .then(() => {
        this.getAnswerSetDecimalSeparatorDropdownList(separator)
          .should("be.visible")
          .click();
      });

  setAllowedUnitsInput = units =>
    this.getAnswerAllowedUnits()
      .clear({ force: true })
      .type(units, { force: true });

  setArgumentInput = (selector, input) =>
    this[selector]()
      .clear({ force: true })
      .type("{uparrow}".repeat(input), { force: true });

  checkIfTextExist = data =>
    this.getComposeQuestionTextBox()
      .clear()
      .type(data)
      .then($input => {
        expect($input[0].innerText).to.contain(data);
      });

  getVirtualKeyBoardItem = value => this.getVirtualKeyBoard().find(`button[data-cy="virtual-keyboard-${value}"]`);
}
export default MathFormulaEdit;
