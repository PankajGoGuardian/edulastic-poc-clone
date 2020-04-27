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
        label: "in",
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
      .click({ force: true });

  getMathKeyBoardDropdown = () => cy.get('[data-cy="math-keyboard-dropdown"]');

  getMathKeyBoardDropdownList = index => cy.get(`[data-cy="math-keyboard-dropdown-list-${index}"]`);

  getPointsInput = () => cy.get('[data-cy="points"]');

  getAddNewMethod = () => cy.get('[data-cy="add-new-method"]');

  deleteLastMethod = () =>
    this.getMathFormulaAnswers()
      .last()
      .find('[data-cy="delete-answer-method"]')
      .click({ force: true });

  getMathFormulaAnswers = () => cy.get('[data-cy="math-formula-answer"]');

  addAlternateAnswer = () => {
    cy.get("body")
      .contains("+ Alternative Answer")
      //.should("be.visible")
      .click({ force: true });
    return this;
  };

  getAddedAlternateAnswer = () => cy.get('[data-cy="del-alter"]');

  returnToCorrectTab = () => {
    cy.get('[data-cy="correct"]')
      .should("be.visible")
      .click({ force: true });
    return this;
  };

  clearAnswerValueInput = length => {
    this.getAnswerValueMathInput().type("{del}".repeat(length || 1), { force: true });
  };

  getAnswerMathInputField = () => cy.get('[data-cy="answer-math-input-field"]');

  getAnswerMathInputStyle = () => cy.get(".input__math");

  getAnswerMathInputStyleasd = () => cy.get('[data-cy="answer-math-input-style"]');

  getAnswerMathTextArea = () => this.getAnswerMathInputField().find("textarea");

  checkCorrectAnswer = (expectedValue, preview, inputLength, isCorrect, score = false, scoreValuse = "1/1") => {
    preview.header.preview();
    preview.getClear().click({ force: true });
    this.getAnswerMathTextArea().should("be.empty");

    if (Array.isArray(expectedValue)) {
      expectedValue.forEach(expValue => this.getAnswerMathTextArea().typeWithDelay(expValue));
    } else {
      this.getAnswerMathTextArea().typeWithDelay(expectedValue);
    }

    this.checkNoticeMessageScore(preview, isCorrect, this.checkAttr(isCorrect), scoreValuse);

    preview.header.edit();
    cy.wait(3000);
    if (inputLength > 0) this.clearAnswerValueInput(inputLength);
  };

  checkAttr = isCorrect => () => {
    // if (isCorrect) {
    //   this.getAnswerMathInputStyle().should("have.css", "background-color", "rgb(132, 205, 54)");
    // } else {
    //   this.getAnswerMathInputStyle().should("have.css", "background-color", "rgb(252, 224, 232)");
    // }
  };

  getMethodSelectionDropdow = () => cy.get('[data-cy="method-selection-dropdown"]');

  getMethodSelectionDropdowList = index => cy.get(`[data-cy="method-selection-dropdown-list-${index}"]`);

  getAnswerValueMathInput = () =>
    cy
      .get('[data-cy="answer-math-input"]')
      .wait(300)
      .next()
      .find("textarea");

  enterAnswerValueMathInput = input => this.getAnswerValueMathInput().typeWithDelay(input);

  getAnswerValueMathOutput = () =>
    cy
      .get('[data-cy="answer-math-input"]')
      .next()
      .get(".mq-root-block > [mathquill-command-id]");

  getAnswerAriaLabel = () => cy.get('[data-cy="answer-aria-label"]');

  getAnswerSignificantDecimalPlaces = () => cy.get('[data-cy="answer-allow-significant-decimal-places"]');

  getAnswerIgnoreTextCheckox = () => cy.get('[data-cy="answer-ignore-text-checkbox"]');

  getAnswerCompareSides = () => cy.get('[data-cy="answer-compare-sides"]');

  getAnswerTreatEasEulersNumber = () => cy.get('[data-cy="answer-allow-eulers-number"]');

  getAnswerAllowThousandsSeparator = () => cy.get('[data-cy="answer-allow-thousand-separator"]');

  getAnswerSetDecimalSeparatorDropdown = () => cy.get('[data-cy="answer-allow-decimal-separator"]');

  getAnswerSetDecimalSeparatorDropdownListTab = () => cy.get('[data-cy="answer-set-decimal-separator-dropdown"]');

  getAnswerSetDecimalSeparatorDropdownList = index =>
    cy.get(`[data-cy="answer-set-decimal-separator-dropdown-list-${index}"]`);

  getAddNewThousandsSeparator = () => cy.get('[data-cy="add-new-thousands-separator"]');

  getRemoveThousandsSeparator = () => cy.get('[data-cy="remove-thousands-separator"]');

  getThousandsSeparatorDropdown = () => cy.get('[data-cy="thousands-separator-dropdown"]');

  setThousandSeperator = seperator =>
    this.getThousandsSeparatorDropdown()
      .click({ force: true })
      .then(() => {
        this.getThousandsSeparatorDropdownList(seperator)

          //.should("be.visible")

          .click({ force: true });
      });

  setDecimalSeperator = separator => {
    this.getAnswerSetDecimalSeparatorDropdown()

      .check({ force: true })
      .should("be.checked");
    this.getAnswerSetDecimalSeparatorDropdownListTab()
      .click({ force: true })
      .then(() => {
        this.getAnswerSetDecimalSeparatorDropdownList(separator)
          //.should("be.visible")

          .click({ force: true });
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

  getSimplified = () => cy.get('[data-cy="answer-is-simplified"]');

  getFactored = () => cy.get('[data-cy="answer-is-factorised"]');

  getExpanded = () => cy.get('[data-cy="answer-is-expanded"]');

  getMixedFraction = () => cy.get('[data-cy="answer-is-mixed-fraction"]');

  getRationalized = () => cy.get('[data-cy="answer-rationalized"]');

  getInterpretAsSet = () => cy.get('[value="interpretAsSet"]');

  getInterpretAsInterval = () => cy.get('[value="interpretAsInterval"]');

  getInterpretAsNumber = () => cy.get('[value="interpretAsNumber"]');

  getInterpretAsResponse = () => cy.get('[value="setListTypeResponse"]');

  getAnswerIgnoreOrder = () => cy.get('[data-cy="answer-ignore-order"]');

  getAnswerAllowInterval = () => cy.get('[data-cy="answer-allow-interval"]');

  getAnswerIgnoreTrailingZeros = () => cy.get('[data-cy="answer-ignore-trailing-zeros"]');

  getAnswerIgnoreCoefficientOfOne = () => cy.get('[data-cy="answer-ignore-coefficient-of-one"]');

  getAnswerInverseResult = () => cy.get('[data-cy="answer-inverse-result"]');
  getAnswerTolerancecheckbox = () => cy.get('[data-cy="answer-allow-tolerance"]');
  getAnswerTolerance = () => cy.get('[data-cy="answer-tolerance"]');

  getAnswerFieldDropdown = () => cy.get('[data-cy="answer-field-dropdown"]');

  getAnswerAllowedUnits = () => cy.get('[data-cy="answer-allowed-units"]');

  getAnswerIgnoreLeadingAndTrailingSpaces = () => cy.get('[data-cy="answer-ignore-leading-and-trailing-spaces"]');

  getAnswerTreatMultipleSpacesAsOne = () => cy.get('[data-cy="answer-treat-multiple-spaces-as-one"]');

  getAnswerRuleDropdown = () => cy.get('[data-cy="answer-rule-dropdown"]');

  // getComposeQuestionImageInput = () => cy.get('.ql-image .ql-stroke');
  getComposeQuestionImageInput = () => cy.get(".ql-image > svg");

  getCurrentStoreQuestion = () => {
    const storeValue = JSON.parse(window.localStorage.getItem("persist:root")).question;
    return JSON.parse(storeValue).entity.data;
  };

  getComposeQuestionTextBox = () => this.getComposeQuestionQuillComponent().find("p");

  getComposeQuestionTextBoxLink = () => this.getComposeQuestionQuillComponent().find(".ql-editor p");

  getSaveLink = () => this.getComposeQuestionQuillComponent().find(".ql-action");

  getAnswerRuleDropdownByValue = val => cy.get(`[data-cy="answer-rule-dropdown-${val}"]`);

  getAnswerRuleArgumentInput = () => cy.get(`[data-cy="answer-rule-argument-input"]`);

  getAnswerRuleArgumentSelect = () => cy.get(`[data-cy="answer-rule-argument-select"]`);

  getAnswerArgumentDropdownByValue = val => cy.get(`[data-cy="answer-argument-dropdown-${val}"]`);

  getAnswerFieldDropdownListValue = val => cy.get(`[data-cy="answer-field-dropdown-list-${val}"]`);

  getAnswerInputMathTextarea = () => cy.get(`[data-cy="answer-input-math-textarea"]`);

  getCorrectAnswerBox = () => cy.get('[class^="MathFormulaDisplay"]'); // cy.get('[data-cy="correct-answer-box"]');

  getComposeQuestionQuillComponent = () => cy.get(".fr-element").first();

  getUploadImageIcon = () => this.getComposeQuestionQuillComponent().find(".ql-image");

  getEditorData = () => this.getComposeQuestionQuillComponent().find(".ql-editor p");

  getBody = () => cy.get("body");

  getOrder = order => (order ? "last" : "first");

  setMethod = (methods, order = 0) => {
    const methodOrder = this.getOrder(order);
    this.getMethodSelectionDropdow()
      [methodOrder]()
      .click({ force: true })
      .then(() => {
        this.getMethodSelectionDropdowList(methods)
          [methodOrder]()
          .click({ force: true });
      });
  };

  setValue = (input, order = 1) => {
    const inputOrder = this.getOrder(order);
    this.getMathFormulaAnswers()
      [inputOrder]()
      .find(`[data-cy="answer-input-math-textarea"]`)
      .type("a", { force: true })
      .type("{backspace}", { force: true })
      .then(element => {
        cy.get("[mathquill-block-id]").then(elements => {
          const newOrder = elements.length === 4 && order === 1 ? 2 : order;
          const { length } = elements[newOrder].innerText;
          cy.wrap(element)
            [inputOrder]()
            .type("{del}".repeat(length === 0 ? 1 : length + 1), { force: true })
            .typeWithDelay(input, { force: true });
        });
      });
  };

  setRule = rule => {
    this.getAnswerRuleDropdown()
      .click({ force: true })
      .then(() => this.getAnswerRuleDropdownByValue(rule).click());
  };

  unCheckAllCheckBoxInAnswers = checkBoxOrder =>
    this.getMathFormulaAnswers()
      [checkBoxOrder]()
      .find("input[type='checkbox']")
      .uncheck({ force: true });

  unCheckAllCheckBox = () => cy.get("input[type='checkbox']").uncheck({ force: true });

  setSeparator = checkBoxName => (order = 0) => {
    const checkBoxOrder = this.getOrder(order);
    this.unCheckAllCheckBoxInAnswers(checkBoxOrder);
    if (checkBoxName)
      this[checkBoxName]()
        [checkBoxOrder]()
        .check({ force: true })
        .wait(2000)
        .should("be.checked");
  };

  setThousandsSeparatorDropdown = separator =>
    this.getThousandsSeparatorDropdown()
      .click({ force: true })
      .then(() => {
        this.getThousandsSeparatorDropdownList(separator)
          //.should("be.visible")
          .click({ force: true });
      });

  allowDecimalMarks = (separator, thousand, inputLength, expected, preview, isCorrect = false) => {
    this.getAnswerAllowThousandsSeparator().check({ force: true });
    this.setAnswerSetDecimalSeparatorDropdown(separator);
    this.setThousandsSeparatorDropdown(thousand);
    this.checkCorrectAnswer(expected, preview, inputLength, isCorrect);
    this.getAnswerAllowThousandsSeparator().uncheck({ force: true });
  };

  setIsFactorisedMethodField = (field, order = 0) => {
    const inputOrder = this.getOrder(order);

    this.getAnswerFieldDropdown()
      [inputOrder]()
      .click({ force: true })
      .then(() =>
        this.getAnswerFieldDropdownListValue(field)
          .click({ force: true })
          .should("be.visible")
      );
  };

  mapIsFactorisedMethodFields = fields =>
    Object.values(fields).forEach(field => this.setIsFactorisedMethodField(field));

  setAnswerSetDecimalSeparatorDropdown = (separator, order = 0) => {
    const inputOrder = this.getOrder(order);
    this.getAnswerSetDecimalSeparatorDropdown()
      [inputOrder]()
      .check({ force: true })
      .should("be.checked");

    this.getAnswerSetDecimalSeparatorDropdownListTab()

      .click({ force: true })
      .then(() => {
        this.getAnswerSetDecimalSeparatorDropdownList(separator)
          [inputOrder]()
          // .should("be.visible")
          .click({ force: true });
      });
  };

  setAllowedUnitsInput = units =>
    this.getAnswerAllowedUnits()
      .clear({ force: true })
      .type(units, { force: true });

  setArgumentInput = (selector, input, order = 0) => {
    const inputOrder = this.getOrder(order);

    this[selector]()
      [inputOrder]()
      //.clear({ force: true })
      .type("{uparrow}".repeat(input), { force: true });
  };

  setArgumentInputSignDec = (selector, input, order = 0) => {
    const inputOrder = this.getOrder(order);

    this[selector]()
      [inputOrder]()
      .check({ force: true });
    cy.get('[data-cy="answer-significant-decimal-places"]')
      .clear({ force: true })
      .type(input, { force: true });
  };

  checkIfTextExist = data =>
    this.getComposeQuestionTextBox()
      .first()
      .should("be.visible")
      .type("{selectall}")
      .type(data)

      .then($input => {
        expect($input[0].innerText).to.contain(data);
        return this.getComposeQuestionTextBox().first();
      });

  getVirtualKeyBoardItem = value => this.getVirtualKeyBoard().find(`button[data-cy="virtual-keyboard-${value}"]`);

  getVirtualKeyBoardResponse = () => this.getVirtualKeyBoard().find("span.response-embed");

  checkUncheckChecbox = (preview, input, expected, checkboxValues, isCorrectAnswer) => {
    checkboxValues.forEach((checkboxValue, index) => {
      this.setValue(input);
      this.setSeparator(checkboxValue)();
      this.checkCorrectAnswer(expected, preview, input.length, isCorrectAnswer[index]);
    });
  };

  setAnswerArgumentDropdownValue = value =>
    this.getAnswerRuleArgumentSelect()
      .click({ force: true })
      .then(() => this.getAnswerArgumentDropdownByValue(value).click({ force: true }));

  checkNoticeMessageScore = (preview, isCorrect, checkAnswerHighlightColor, scoreValuse = "1/1") => {
    preview
      .getCheckAnswer()
      .click({ force: true })
      .then(() =>
        cy
          .get("body")
          .children()
          .should("contain", `Score ${isCorrect ? scoreValuse : "0/1"}`)
      );
    checkAnswerHighlightColor();

    preview
      .getClear()
      .click({ force: true })
      .then(() => {
        cy.get("body")
          .children()
          .should("not.contain", "Correct Answers");
      });
  };
  allowNumeric = () => cy.get('[data-cy="answer-allow-numeric-only"]');

  getAddOptions = () =>
    cy
      .get("body")
      .contains("Additional Options")
      .click({ force: true });
}
export default MathFormulaEdit;
