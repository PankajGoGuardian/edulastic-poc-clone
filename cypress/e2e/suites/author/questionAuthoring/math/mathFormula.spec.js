import { math } from "@edulastic/constants";
import MathFormulaEdit from "../../../../framework/author/itemList/questionType/math/mathFormulaEdit";
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import FileHelper from "../../../../framework/util/fileHelper";
import EditToolBar from "../../../../framework/author/itemList/questionType/common/editToolBar";
import PreviewItemPage from "../../../../framework/author/itemList/itemDetail/previewPage";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Math formula" type question`, () => {
  const queData = {
    mockString: "10-5+8-4",
    group: "Math",
    queType: "Math formula",
    extlink: "www.testdomain.com",
    testtext: "testtext",
    formula: "s=ar^2",
    answer: {
      value: "123456",
      ariaLabel: "test"
    },
    equivSymbolic: {
      ignoreText: {
        expected: "25m",
        input: "25"
      },
      compareSides: {
        expected: "3+4=7",
        input: "4+3=7"
      },
      eulersNumber: {
        input: "e",
        expected: "2.718"
      },
      setDecimalSeparatorComma: {
        thousand: "Dot",
        separator: "Comma",
        expected: "1,01",
        input: "1.01"
      },
      setThousandsSeparator: {
        expected: ["\\frac{enter}1{downarrow}1,000", "\\frac{enter}1{downarrow}1.000"],
        input: ["0.001", "0,001"]
      },
      significantDecimalPlaces: {
        decimalPlaces: 3,
        expected: "5.0001",
        input: 5
      },
      significantDecimalAndIgnoreText: {
        expected: "7.0001m",
        input: "7",
        decimalPlaces: 3
      },
      multipleDecimalSeparators: {
        separators: ["Space"],
        expected: "1,000001",
        input: "1.000001"
      },
      multipleThousandSeparators: {
        separators: ["Space"],
        expected: ["100,000.1", "100 000.1"],
        input: "100000.1"
      },
      significantDecimal: {
        expected: "0.33",
        input: "1\\div3",
        decimalPlaces: 2
      },
      setDecimalSeparator: {
        expected: ["1.01", "1,01"],
        input: "1.01"
      }
    },
    equivLiteral: {
      value: {
        input: "1+2",
        expected: "1+2"
      },
      simpleFractions: {
        expected: "\\frac{enter}1{downarrow}2",
        input: "\\frac{enter}1{downarrow}2"
      },
      inverseResult: {
        expected: "x+2)2",
        input: "(x+2)2",
        checkboxValues: ["getAnswerInverseResult", null],
        isCorrectAnswer: [false, true]
      },
      ignoreTrailing: {
        expected: "1000.000",
        input: "1000",
        checkboxValues: ["getAnswerIgnoreTrailingZeros", null],
        isCorrectAnswer: [true, false]
      },
      setDecimalSeparator: {
        separator: "Comma",
        expected: ["1,1", "1,1+1"],
        input: ["1.1", "1.1+1"]
      },
      setThousandsSeparator: {
        separators: ["Comma", "Space"],
        expected: ["1,000,000", "1 000 000"],
        input: "1000000"
      },
      ignoreOrder: {
        expected: "1+x",
        input: "x+1",
        checkboxValues: ["getAnswerIgnoreOrder", null],
        isCorrectAnswer: [true, false]
      },
      ignoreCoefficientOfOne: {
        expected: "1x+2",
        input: "x+2",
        checkboxValues: ["getAnswerIgnoreCoefficientOfOne", null],
        isCorrectAnswer: [true, false]
      },
      allowInterval: {
        expected: ["(0,4) ", "{backspace}".repeat(2), "]"],
        input: "(0,4]",
        checkboxValues: ["getAnswerAllowInterval", null],
        isCorrectAnswer: [true, false]
      }
    },
    equivSyntax: {
      decimal: {
        expected: "5.000",
        input: "3"
      },
      simpleFraction: {
        expected: "2/4"
      },
      mixedFraction: {
        expected: ["1\frac{enter}1", "{downarrow}", "2"]
      },
      exponent: {
        expected: "2^2"
      },
      standardFormLinear: {
        expected: "Ax+By=C"
      },
      standardFormQuadratic: {
        expected: ["5x^", "{uparrow}", "2", "{downarrow}", "+3x=4"]
      },
      slopeIntercept: {
        expected: "y=-x+1"
      },
      pointSlope: {
        expected: ["y-1)=2x+3", "{leftarrow}".repeat(3), "("]
      }
    },
    isSimplified: {
      simplifiedVersion: {
        expected: "4x+1",
        checkboxValues: ["getAnswerInverseResult", null],
        isCorrectAnswer: [false, true]
      }
    },
    isFactorised: {
      inverseResult: {
        expected: "(x−1)(x−2)"
      },
      setThousandsSeparator: {
        expected: ["1/1,000", "1/1.000"]
      }
    },
    isExpanded: {
      expandedForm: {
        expected: ["x^", "{uparrow}", "2", "{downarrow}", "+5x+6"]
      }
    },
    isUnit: {
      expectedUnits: {
        expected: "5mi",
        input: "5mi",
        units: "mi"
      },
      allowedUnits: {
        expected: "12km",
        units: "km"
      },
      setThousandsSeparator: {
        expected: ["1,000,000mi", "1.000.000mi"],
        input: "1000000mi",
        units: "mi"
      }
    },
    isTrue: {
      comparison: {
        expected: "5<6"
      },
      significantDecimal: {
        expected: "0.33",
        input: 2
      }
    },
    stringMatch: {
      literalStringComparison: {
        expected: "abc",
        input: "abc"
      },
      leadingAndTrailing: {
        expected: " a ",
        input: "a"
      },
      multipleSpaces: {
        expected: "a   b",
        input: "a b"
      }
    },
    equivValue: {
      numericalForm: {
        input: "1m",
        expected: "100cm"
      },
      inverse: {
        expected: "44",
        input: "44"
      },
      ignoreText: {
        expected: "33sdf",
        input: "33"
      },
      significantDecimal: {
        input: "1\\div3",
        expected: "0.33",
        decimalPlaces: 2
      },
      compareSides: {
        expected: "4+5=9",
        input: "4+5=9",
        decimalPlaces: 1
      },
      tolerance: {
        input: "10",
        expected: "8.5",
        tolerance: "1.5"
      }
    },
    symbols: ["units_si", "units_us"],
    decimalSeparators: ["Dot", "Comma"],
    thousandsTestingSeparators: ["Comma", "Dot"],
    thousandsSeparators: ["Space", "Dot", "Comma"]
  };

  const question = new MathFormulaEdit();
  const editItem = new EditItemPage();
  const itemList = new ItemListPage();
  const numpadButtons = question.virtualKeyBoardNumpad;
  const buttons = question.virtualKeyBoardButtons;
  const { syntaxes, fields, methods } = math;
  const ruleArguments = question.argumentMethods;
  const editToolBar = new EditToolBar();
  const preview = new PreviewItemPage();
  let previewItems;

  let testItemId;

  before(() => {
    cy.login();
    itemList.clickOnCreate().then(id => {
      testItemId = id;
    });
  });

  context(" > User creates question", () => {
    before("visit items page and select question type", () => {
      Cypress.on("uncaught:exception", (err, runnable) => false);
      editItem.getItemWithId(testItemId);
      editItem.deleteAllQuestion();
      // create new que and select type

      editItem.addNew().chooseQuestion(queData.group, queData.queType);
    });

    context(" > TC_429 => Enter question text in Compose Question text box", () => {
      it(" > Write text in textbox", () => {
        question.checkIfTextExist(queData.testtext);
      });

      it(" > give external link", () => {
        question.checkIfTextExist(queData.testtext).type("{selectall}");
        editToolBar.link().click();
        question.getSaveLink().click();
        question
          .getComposeQuestionTextBoxLink()
          .find("a")
          .should("have.attr", "href")
          .and("equal", queData.testtext)
          .then(href => {
            expect(href).to.equal(queData.testtext);
          });
      });

      it(" > insert formula", () => {
        question.checkIfTextExist(queData.testtext).clear();
      });
      it(" > Upload image to server", () => {
        question.getComposeQuestionTextBox().focus();

        question.getUploadImageIcon().click();
        cy.uploadFile("testImages/sample.jpg", "input.ql-image[type=file]").then(() =>
          question
            .getEditorData()
            .find("img")
            .should("be.visible")
        );

        question.getComposeQuestionTextBox().clear();
      });
    });

    context(" > TC_411 => Template", () => {
      it(" > Edit template textarea", () => {
        const { length } = queData.mockString;
        question.getTemplateInput().type(queData.mockString, { force: true });
        question.getTemplateOutput().should("have.length", length);
        question.getTemplateInput().type("{backspace}".repeat(length || 1), { force: true });
        question.getTemplateOutput().should("have.length", 0);
      });
      it(" > Edit template textarea from virtual keyboard", () => {
        question
          .getTemplateInput()
          .parent()
          .parent()
          .click();
        question.getVirtualKeyBoardResponse().click();
        question
          .getTemplateOutput()
          .last()
          .contains("Response");
        question.removeLastValue();
        numpadButtons.forEach(button => {
          const { value, label } = button;
          question.getVirtualKeyBoardItem(value).click();
          question
            .getTemplateOutput()
            .last()
            .contains(label);
          question.removeLastValue();
        });
        buttons
          .filter(item => item.types.includes(queData.symbols[0]))
          .forEach(button => {
            const { label } = button;
            question.getVirtualKeyBoardItem(label).click();
            question
              .getTemplateOutput()
              .last()
              .contains(label);
            question.removeLastValue();
          });
        question
          .getMathKeyBoardDropdown()
          .click()
          .then(() => {
            question
              .getMathKeyBoardDropdownList(1)
              .should("be.visible")
              .click();
          });
        question.getMathKeyBoardDropdown().contains("div", "Units (US Customary)");
        buttons
          .filter(item => item.types.includes(queData.symbols[1]))
          .forEach(button => {
            const { label, handler } = button;
            question.getVirtualKeyBoardItem(handler).click();
            question
              .getTemplateOutput()
              .last()
              .contains(label);
            question.removeLastValue();
          });
      });
    });

    context(" > TC_412 => Set Correct Answer(s)", () => {
      it(" > Update Points", () => {
        question
          .getPointsInput()
          .click({ force: true })
          .focus()
          .clear()
          .type("{selectall}1")
          .should("have.value", "1")
          .type("{uparrow}")
          .should("have.value", "2")
          .type("{selectall}1")
          .should("have.value", "1")
          .blur();
      });
      it(" > Add and remove new method", () => {
        question
          .getAddNewMethod()
          .click()
          .then(() => {
            question.getMathFormulaAnswers().should("have.length", 2);
          });
        question.deleteLastMethod().then(() => {
          question.getMathFormulaAnswers().should("have.length", 1);
        });
      });
      it(" > Add and remove alternate answer", () => {
        question.addAlternateAnswer();
        question
          .getAddedAlternateAnswer()
          .then(element => {
            cy.wrap(element)
              .should("be.visible")
              .click();
          })
          .should("not.exist");
        question.returnToCorrectTab();
      });
      it(" > Change answer methods", () => {
        Object.values(methods).forEach(item => {
          question.setMethod(item);
          question.getMethodSelectionDropdow().contains("div", item);
        });
      });
      it(" > Testing equivSymbolic method", () => {
        question.setMethod(methods.EQUIV_SYMBOLIC);
        question.setValue(queData.answer.value);
        question.getAnswerValueMathOutput().should("have.length", 6);
        question
          .getAnswerAriaLabel()
          .click({ force: true })
          .type(queData.answer.ariaLabel)
          .should("contain", queData.answer.ariaLabel);

        question
          .getAnswerIgnoreTextCheckox()
          .check({ force: true })
          .should("be.checked")
          .uncheck({ force: true });

        question
          .getAnswerSignificantDecimalPlaces()
          .focus()
          .clear()
          .type("{selectall}10")
          .should("have.value", "10")
          .blur();
        question
          .getAnswerCompareSides()
          .check({ force: true })
          .should("be.checked")
          .uncheck({ force: true });
        question
          .getAnswerTreatEasEulersNumber()
          .check({ force: true })
          .should("be.checked")
          .uncheck({ force: true });
        question
          .getAnswerAllowThousandsSeparator()
          .check({ force: true })
          .should("be.checked");
        queData.decimalSeparators.forEach(item => {
          question.setAnswerSetDecimalSeparatorDropdown(item);
          question.getAnswerSetDecimalSeparatorDropdown().contains("div", item);
        });
        question
          .getAddNewThousandsSeparator()
          .click()
          .then(() => {
            question.getThousandsSeparatorDropdown().should("have.length", 2);
          });
        question
          .getRemoveThousandsSeparator()
          .last()
          .click()
          .then(() => {
            question.getThousandsSeparatorDropdown().should("have.length", 1);
          });
        queData.thousandsSeparators.forEach(item => {
          question
            .getThousandsSeparatorDropdown()
            .click()
            .then(() => {
              question
                .getThousandsSeparatorDropdownList(item)
                .should("be.visible")
                .click();
            });
        });
        question.getAnswerAllowThousandsSeparator().uncheck({ force: true });
      });
    });
  });
  context(" > TC_413 => Preview Items", () => {
    it(" > Click on preview", () => {
      previewItems = editItem.header.preview();
      question.getBody().contains("span", "Check Answer");

      question.getAnswerMathTextArea().typeWithDelay(queData.answer.value);
    });

    it(" > Click on Check answer", () => {
      previewItems
        .getCheckAnswer()
        .click()
        .then(() =>
          question
            .getBody()
            .children()
            .should("contain", "score: 1/1")
        );
    });

    it(" > Click on Show Answers", () => {
      previewItems
        .getShowAnswer()
        .click()
        .then(() => {
          question.getCorrectAnswerBox().should("be.visible");
        });
    });

    it(" > Click on Clear", () => {
      previewItems
        .getClear()
        .click()
        .then(() => {
          question
            .getBody()
            .children()
            .should("not.contain", "Correct Answers");
        });

      preview.header.edit();
      const { length } = queData.answer.value;
      question.clearAnswerValueInput(length);
      question.getAnswerValueMathOutput().should("have.length", 0);
    });
  });

  context(" > TC_417 => equivSymbolic method", () => {
    beforeEach("Change to equivSymbolic method", () => {
      preview.header.edit();
      question.setMethod(methods.EQUIV_SYMBOLIC);
    });
    it(" > Testing with ignore text", () => {
      const { input, expected } = queData.equivSymbolic.ignoreText;

      question.setValue(input);
      question.setSeparator("getAnswerIgnoreTextCheckox")();

      question.checkCorrectAnswer(expected, preview, 0, true);
    });
    it(" > Testing with compare sides", () => {
      const { input, expected } = queData.equivSymbolic.compareSides;
      question.setValue(input);
      question.setSeparator("getAnswerCompareSides")();

      question.checkCorrectAnswer(expected, preview, 0, true);
    });
    it(" > Testing Treat 'e' as Euler's numbe", () => {
      const { expected, input } = queData.equivSymbolic.eulersNumber;
      question.setValue(input);
      question.setSeparator("getAnswerTreatEasEulersNumber")();
      question.checkCorrectAnswer(expected, preview, input.length, true);
    });
    it(" > Testing with decimal separator - Comma", () => {
      const { input, expected, separator, thousand } = queData.equivSymbolic.setDecimalSeparatorComma;
      question.setValue(input);
      question.unCheckAllCheckBox();
      question.allowDecimalMarks(separator, thousand, input.length, expected, preview, true);
    });

    it(" > Testing with thousands separators - Space and Comma", () => {
      const { input, expected } = queData.equivSymbolic.setThousandsSeparator;
      const { decimalSeparators, thousandsTestingSeparators } = queData;

      decimalSeparators.forEach((separator, index) => {
        question.setValue(input[index]);
        question.allowDecimalMarks(
          separator,
          thousandsTestingSeparators[index],
          input.length,
          expected[index],
          preview,
          true
        );
      });
    });

    it(" > Testing with significant decimal '3'", () => {
      const { input, expected, decimalPlaces } = queData.equivSymbolic.significantDecimalPlaces;
      question.setValue(input);
      question.setArgumentInput("getAnswerSignificantDecimalPlaces", decimalPlaces);
      question.checkCorrectAnswer(expected, preview, 2, true);
    });
    it(" > Testing with significant decimal '3' and ignore text", () => {
      const { input, expected } = queData.equivSymbolic.significantDecimalAndIgnoreText;
      question.setValue(input);
      question
        .getAnswerIgnoreTextCheckox()
        .check({ force: true })
        .should("be.checked");
      question.checkCorrectAnswer(expected, preview, input.length, true);
    });
    it(" > Testing with multiple thousand separators", () => {
      const { input, expected, separators } = queData.equivSymbolic.multipleThousandSeparators;
      question.getAnswerAllowThousandsSeparator().check({ force: true });

      separators.forEach(item => {
        question
          .getAddNewThousandsSeparator()
          .click()
          .then(() => {
            question
              .getThousandsSeparatorDropdown()
              .last()
              .click()
              .then(() => {
                question
                  .getThousandsSeparatorDropdownList(item)
                  .last()
                  .click();
              });
          });
      });

      expected.forEach(expectedVal => {
        question.enterAnswerValueMathInput(input);
        question.checkCorrectAnswer(expectedVal, preview, input.length, true);
      });

      question.getAnswerAllowThousandsSeparator().uncheck({ force: true });
    });
  });
  context(" > TC_418 => equivLiteral method", () => {
    beforeEach("Change to equivLiteral method", () => {
      preview.header.edit();
      question.setMethod(methods.EQUIV_LITERAL);
    });
    it(" > Testing Value", () => {
      const { input, expected } = queData.equivLiteral.value;
      question.setValue(input);
      question.checkCorrectAnswer(expected, preview, 0, true);
    });
    it(" > Testing simple fractions", () => {
      const { input, expected } = queData.equivLiteral.simpleFractions;
      question.setValue(input);

      question.checkCorrectAnswer(expected, preview, 4, true);
    });
    it(" > Testing check/uncheck Inverse result check box", () => {
      const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivLiteral.inverseResult;

      question.checkUncheckChecbox(preview, input, expected, checkboxValues, isCorrectAnswer);
    });
    it(" > Testing check/uncheck Ignore trailing zeros check box", () => {
      const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivLiteral.ignoreTrailing;

      question.checkUncheckChecbox(preview, input, expected, checkboxValues, isCorrectAnswer);
    });

    it(" > Testing check/uncheck Allow interval check boxl", () => {
      const { expected, checkboxValues, isCorrectAnswer, input } = queData.equivLiteral.allowInterval;

      checkboxValues.forEach((checkboxValue, index) => {
        question.setValue(input);
        question.setSeparator(checkboxValue)();
        question.checkCorrectAnswer(expected, preview, input.length, isCorrectAnswer[index]);
      });
    });

    it(" > Testing check/uncheck Ignore coefficient of 1 check box", () => {
      const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivLiteral.ignoreCoefficientOfOne;

      question.checkUncheckChecbox(preview, input, expected, checkboxValues, isCorrectAnswer);
    });

    it(" > Testing check/uncheck Ignore order check box", () => {
      const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivLiteral.ignoreOrder;

      question.checkUncheckChecbox(preview, input, expected, checkboxValues, isCorrectAnswer);
    });

    it(" > Testing Allow decimal marks", () => {
      const { expected, input } = queData.equivSymbolic.setDecimalSeparator;
      const { decimalSeparators, thousandsTestingSeparators } = queData;

      decimalSeparators.forEach((separator, index) => {
        question.setValue(input);
        question.allowDecimalMarks(
          separator,
          thousandsTestingSeparators[index],
          input.length,
          expected[index],
          preview,
          true
        );
      });
    });
  });

  context(" > Edit the Math formula created", () => {
    before("delete old question and create dummy que to edit", () => {
      editItem.getItemWithId(testItemId);
      editItem.deleteAllQuestion();

      //create new que and select type
      editItem.addNew().chooseQuestion(queData.group, queData.queType);
    });

    context(" > TC_414 => Testing different answer methods", () => {
      it(" > Testing equivLiteral method", () => {
        question.setMethod(methods.EQUIV_LITERAL);
        question.getAnswerValueMathInput().should("be.visible");
        question.getAnswerAriaLabel().should("be.visible");
        question
          .getAnswerAllowInterval()
          .check({ force: true })
          .should("be.checked")
          .uncheck({ force: true });
        question
          .getAnswerIgnoreOrder()
          .check({ force: true })
          .should("be.checked")
          .uncheck({ force: true });
        question
          .getAnswerIgnoreTrailingZeros()
          .check({ force: true })
          .should("be.checked")
          .uncheck({ force: true });
        question
          .getAnswerIgnoreCoefficientOfOne()
          .check({ force: true })
          .should("be.checked")
          .uncheck({ force: true });
        question
          .getAnswerInverseResult()
          .check({ force: true })
          .should("be.checked")
          .uncheck({ force: true });

        question.getAnswerAllowThousandsSeparator().should("be.visible");
      });

      it(" > Testing equivValue method", () => {
        question.setMethod(methods.EQUIV_VALUE);

        question.getAnswerValueMathInput().should("be.visible");
        question.getAnswerAriaLabel().should("be.visible");
        question.getAnswerInverseResult().should("be.visible");
        question.getAnswerIgnoreTextCheckox().should("be.visible");
        question.getAnswerSignificantDecimalPlaces().should("be.visible");
        question.getAnswerCompareSides().should("be.visible");
        question.getAnswerTolerance().should("be.visible");
        question.getAnswerAllowThousandsSeparator().should("be.visible");
      });

      it(" > Testing equivSimplified method", () => {
        question.setMethod(methods.IS_SIMPLIFIED);

        question.getAnswerInverseResult().should("be.visible");
        question.getAnswerAllowThousandsSeparator().should("be.visible");
      });

      it(" > Testing isFactorised method", () => {
        question.setMethod(methods.IS_FACTORISED);

        question.getAnswerFieldDropdown().should("be.visible");
        question.getAnswerInverseResult().should("be.visible");
        question.getAnswerAllowThousandsSeparator().should("be.visible");
      });
      it(" > Testing isExpanded method", () => {
        question.setMethod(methods.IS_EXPANDED);

        question.getAnswerAllowThousandsSeparator().should("be.visible");
      });
      it(" > Testing isUnits method", () => {
        question.setMethod(methods.IS_UNIT);

        question.getAnswerValueMathInput().should("be.visible");
        question.getAnswerAriaLabel().should("be.visible");
        question.getAnswerAllowedUnits().should("be.visible");
        question.getAnswerAllowThousandsSeparator().should("be.visible");
      });
      it(" > Testing isTrue method", () => {
        question.setMethod(methods.IS_TRUE);

        question.getAnswerSignificantDecimalPlaces().should("be.visible");
        question.getAnswerAllowThousandsSeparator().should("be.visible");
      });
      it(" > Testing stringMatch method", () => {
        question.setMethod(methods.STRING_MATCH);

        question.getAnswerValueMathInput().should("be.visible");
        question.getAnswerAriaLabel().should("be.visible");
        question.getAnswerIgnoreLeadingAndTrailingSpaces().should("be.visible");
        question.getAnswerTreatMultipleSpacesAsOne().should("be.visible");
      });
      it(" > Testing equivSyntax method", () => {
        question.setMethod(methods.EQUIV_SYNTAX);

        question.getAnswerRuleDropdown().should("be.visible");
        question.getAnswerIgnoreTextCheckox().should("be.visible");
      });
    });
  });

  context(" > Testing equivSyntax methods", () => {
    before("delete old question and create dummy que to edit", () => {
      editItem.getItemWithId(testItemId);
      editItem.deleteAllQuestion();

      editItem.addNew().chooseQuestion(queData.group, queData.queType);
    });
    beforeEach("Change to equivSyntax method", () => {
      preview.header.edit();
      question.setMethod(methods.EQUIV_SYNTAX);
    });

    it(" > Testing Rule : Decimal", () => {
      const { input, expected } = queData.equivSyntax.decimal;

      question.setRule(syntaxes.DECIMAL);
      question.setArgumentInput("getAnswerRuleArgumentInput", input);

      question.checkCorrectAnswer(expected, preview, 0, true);
    });
    it(" > Testing Rule : Simple Fraction", () => {
      const { expected } = queData.equivSyntax.simpleFraction;

      question.setRule(syntaxes.SIMPLE_FRACTION);
      question.checkCorrectAnswer(expected, preview, 0, true);
    });
    it(" > Testing Rule : mixed Fraction", () => {
      const { expected } = queData.equivSyntax.mixedFraction;

      question.setRule(syntaxes.MIXED_FRACTION);
      question.checkCorrectAnswer(expected, preview, 0, true);
    });
    it(" > Testing Rule : Exponent", () => {
      const { expected } = queData.equivSyntax.exponent;

      question.setRule(syntaxes.EXPONENT);
      question.checkCorrectAnswer(expected, preview, 0, true);
    });
    it(" > Testing Rule : Standard form, Argument: linear", () => {
      const { expected } = queData.equivSyntax.standardFormLinear;

      question.setRule(syntaxes.STANDARD_FORM);
      question.setAnswerArgumentDropdownValue(ruleArguments[0]);
      question.checkCorrectAnswer(expected, preview, 0, true);
    });
    it(" > Testing Rule : Standard form, Argument: quadratic", () => {
      const { expected } = queData.equivSyntax.standardFormQuadratic;

      question.setRule(syntaxes.STANDARD_FORM);
      question.setAnswerArgumentDropdownValue(ruleArguments[1]);
      question.checkCorrectAnswer(expected, preview, 0, true);
    });
    it(" > Testing Rule : Slope intercept form", () => {
      const { expected } = queData.equivSyntax.slopeIntercept;

      question.setRule(syntaxes.SLOPE_INTERCEPT_FORM);
      question.checkCorrectAnswer(expected, preview, 0, true);
    });
    it(" > Testing Rule : point slope form", () => {
      const { expected } = queData.equivSyntax.pointSlope;

      question.setRule(syntaxes.POINT_SLOPE_FORM);
      question.checkCorrectAnswer(expected, preview, 0, true);
    });
  });

  context(" > Testing isSimplified method", () => {
    beforeEach("Change to isSimplified method", () => {
      preview.header.edit();
      question.setMethod(methods.IS_SIMPLIFIED);
    });
    it(" > Testing inverse result", () => {
      const { expected, isCorrectAnswer, checkboxValues } = queData.isSimplified.simplifiedVersion;

      checkboxValues.forEach((checkboxValue, index) => {
        question.setSeparator(checkboxValue)();
        question.checkCorrectAnswer(expected, preview, 0, isCorrectAnswer[index]);
      });
    });

    it(" > Testing with allow decimal marks", () => {
      const { expected } = queData.equivSymbolic.setThousandsSeparator;
      const { decimalSeparators, thousandsTestingSeparators } = queData;

      decimalSeparators.forEach((separator, index) => {
        question.allowDecimalMarks(separator, thousandsTestingSeparators[index], 0, expected[index], preview, true);
      });
    });
  });

  context(" > Testing isFactorised method", () => {
    beforeEach("Change to isFactorised method", () => {
      preview.header.edit();
      question.setMethod(methods.IS_FACTORISED);
    });
    it(" > Testing with field", () => {
      question.mapIsFactorisedMethodFields(fields);
    });
    it(" > Testing inverse result", () => {
      const { expected } = queData.isFactorised.inverseResult;

      question.setSeparator("getAnswerInverseResult")();
      question.checkCorrectAnswer(expected, preview, 0, false);
    });
    it(" > Testing with allow decimal marks", () => {
      const { expected } = queData.isFactorised.setThousandsSeparator;
      const { decimalSeparators, thousandsTestingSeparators } = queData;

      question.setIsFactorisedMethodField(fields.INTEGER);

      decimalSeparators.forEach((separator, index) => {
        question.allowDecimalMarks(separator, thousandsTestingSeparators[index], 0, expected[index], preview, true);
      });
    });
  });

  context(" > Testing isExpanded method", () => {
    beforeEach("Change to isExpanded method", () => {
      preview.header.edit();
      question.setMethod(methods.IS_EXPANDED);
    });
    it(" > Testing that a mathematical expression is in factorised form", () => {
      const { expected } = queData.isExpanded.expandedForm;

      question.checkCorrectAnswer(expected, preview, 0, true, true);
    });
    it(" > Testing with allow decimal marks", () => {
      const { expected } = queData.equivSymbolic.setThousandsSeparator;
      const { decimalSeparators, thousandsTestingSeparators } = queData;

      decimalSeparators.forEach((separator, index) => {
        question.allowDecimalMarks(separator, thousandsTestingSeparators[index], 0, expected[index], preview, true);
      });
    });
  });

  context(" > Testing isTrue method", () => {
    beforeEach("Change to isTrue method", () => {
      preview.header.edit();
      question.setMethod(methods.IS_TRUE);
    });

    it(" > Testing that an expression has a comparison, or equality", () => {
      const { expected } = queData.isTrue.comparison;

      question.checkCorrectAnswer(expected, preview, 0, true);
    });

    it(" > Testing significant decimal places", () => {
      const { input, expected } = queData.isTrue.significantDecimal;

      question.setArgumentInput("getAnswerSignificantDecimalPlaces", input);
      question.checkCorrectAnswer(expected, preview, input.length, true);
    });

    it(" > Testing with allow decimal marks", () => {
      const { expected } = queData.isFactorised.setThousandsSeparator;
      const { decimalSeparators, thousandsTestingSeparators } = queData;

      decimalSeparators.forEach((separator, index) => {
        question.allowDecimalMarks(separator, thousandsTestingSeparators[index], 0, expected[index], preview, true);
      });
    });
  });

  context(" > Testing stringMatch method", () => {
    beforeEach("Change to isTrue method", () => {
      preview.header.edit();
      question.setMethod(methods.STRING_MATCH);
    });
    it(" > Testing with literal string comparison", () => {
      const { input, expected } = queData.stringMatch.literalStringComparison;

      question.setValue(input);

      question.checkCorrectAnswer(expected, preview, input.length, true);
    });

    it(" > Testing ignores spaces before and after a value", () => {
      const { input, expected } = queData.stringMatch.leadingAndTrailing;

      question.setValue(input);
      question.setSeparator("getAnswerIgnoreLeadingAndTrailingSpaces")();
      question.checkCorrectAnswer(expected, preview, input.length, true);
    });

    it(" > Testing multiple spaces will be ignored and treated as one", () => {
      const { input, expected } = queData.stringMatch.multipleSpaces;

      question.setValue(input);
      question.setSeparator("getAnswerTreatMultipleSpacesAsOne")();
      question.checkCorrectAnswer(expected, preview, input.length, true);
    });
  });

  context(" > Testing isUnit method", () => {
    beforeEach("Change to isUnit method", () => {
      preview.header.edit();
      question.setMethod(methods.IS_UNIT);
    });
    it(" > Testing with expression contains the expected units", () => {
      const { input, units } = queData.isUnit.expectedUnits;

      question.setValue(input);
      question.setAllowedUnitsInput(units);
      question.checkCorrectAnswer(units, preview, input.length, true);
    });
    it(" > Testing with allowed units", () => {
      const { units } = queData.isUnit.allowedUnits;

      question.setAllowedUnitsInput(units);
      question.checkCorrectAnswer(units, preview, 0, true);
    });
    it(" > Testing with allow decimal marks", () => {
      const { expected, input, units } = queData.isUnit.setThousandsSeparator;
      const { decimalSeparators, thousandsTestingSeparators } = queData;

      decimalSeparators.forEach((separator, index) => {
        question.setValue(input);
        question.setAllowedUnitsInput(units);
        question.allowDecimalMarks(separator, thousandsTestingSeparators[index], 0, expected[index], preview, true);
      });
    });
  });

  context(" > Testing equivValue method", () => {
    beforeEach("Change to equivValue method", () => {
      preview.header.edit();
      question.setMethod(methods.EQUIV_VALUE);
    });
    it(" > Testing with evaluate the expression to a numerical form for comparison", () => {
      const { expected, input } = queData.equivValue.numericalForm;

      question.setValue(input);
      question.checkCorrectAnswer(expected, preview, input.length, true);
    });
    it(" > Testing with inverse result", () => {
      const { expected, input } = queData.equivValue.inverse;

      question.setValue(input);
      question.setSeparator("getAnswerInverseResult")();
      question.checkCorrectAnswer(expected, preview, input.length, false);
    });
    it(" > Testing with ignore text", () => {
      const { expected, input } = queData.equivValue.ignoreText;

      question.setValue(input);
      question.setSeparator("getAnswerIgnoreTextCheckox")();
      question.checkCorrectAnswer(expected, preview, input.length, true);
    });
    it(" > Testing with significant decimal places", () => {
      const { expected, input, decimalPlaces } = queData.equivValue.significantDecimal;

      question.setValue(input);
      question.setArgumentInput("getAnswerSignificantDecimalPlaces", decimalPlaces);
      question.checkCorrectAnswer(expected, preview, input.length, true);
      question.getAnswerSignificantDecimalPlaces().clear({ force: true });
    });
    it(" > Testing with compare sides", () => {
      const { expected, input, decimalPlaces } = queData.equivValue.compareSides;

      question.setValue(input);
      question.setArgumentInput("getAnswerSignificantDecimalPlaces", decimalPlaces);
      question.setSeparator("getAnswerCompareSides")();

      question.checkCorrectAnswer(expected, preview, 0, true);
    });

    it(" > Testing Allow decimal marks", () => {
      const { expected, input } = queData.equivSymbolic.setDecimalSeparator;
      const { decimalSeparators, thousandsTestingSeparators } = queData;

      decimalSeparators.forEach((separator, index) => {
        question.setValue(input);
        question.allowDecimalMarks(
          separator,
          thousandsTestingSeparators[index],
          input.length,
          expected[index],
          preview,
          true
        );
      });
    });

    it(" > Testing with tolerance that will be deemed as correct", () => {
      const { expected, input, tolerance } = queData.equivValue.tolerance;

      question.setValue(input);

      question
        .getAnswerTolerance()
        .clear({ force: true })
        .type(tolerance, { force: true });

      question.checkCorrectAnswer(expected, preview, 0, true);
      question.getAnswerTolerance().clear({ force: true });
    });
  });

  context(" > TC_415 => Save question", () => {
    it(" > Click on save button", () => {
      question.header.save();
      cy.url().should("contain", "item-detail");
    });
  });

  context(" > TC_416 => Delete the question after creation", () => {
    it(" > Click on delete button in Item Details page", () => {
      editItem
        .getDelButton()
        .should("have.length", 1)
        .click()
        .should("have.length", 0);
    });
  });
});
