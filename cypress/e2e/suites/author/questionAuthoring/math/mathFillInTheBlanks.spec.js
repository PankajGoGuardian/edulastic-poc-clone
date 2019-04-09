import { math } from "@edulastic/constants";
import MathFillInTheBlanksPage from "../../../../framework/author/itemList/questionType/math/MathFillInTheBlanksPage";
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import FileHelper from "../../../../framework/util/fileHelper";
import EditToolBar from "../../../../framework/author/itemList/questionType/common/editToolBar";
import PreviewItemPage from "../../../../framework/author/itemList/itemDetail/previewPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Math – fill in the blanks" type question`, () => {
  const queData = {
    mockString: "10-5+8-4",
    group: "Math",
    queType: "Math – fill in the blanks",
    extlink: "www.testdomain.com",
    testtext: "testtext",
    formula: "s=ar^2",
    answer: {
      value: "1234",
      ariaLabel: "test"
    },
    equivSymbolic: {
      value: {
        input: "100",
        expected: ["40", "60"]
      },
      ignoreText: {
        expected: "25m",
        input: "25",
        checkboxValues: ["getAnswerIgnoreTextCheckox", null],
        isCirrectUnsver: [true, false]
      },
      compareSides: {
        expected: "4 + 3 = 7",
        input: "3+4=7"
      },
      eulersNumber: {
        input: "2.718+2.718=5,436",
        expected: "e+e=5,436"
      },
      setDecimalSeparator: {
        separator: "Comma",
        expected: "1,01",
        input: "1.01"
      },
      setThousandsSeparator: {
        separators: ["Comma", "Space"],
        expected: ["1,000,000", "1 000 000"],
        input: "1000000"
      },
      significantDecimal: {
        expected: "0.33",
        input: "1\\div3",
        decimalPlaces: 2
      },
      combinationIgnoreTxt: {
        expected: "7.00001m",
        input: "7",
        decimalPlaces: 3
      },
      combinationSetDecimalSeparator: {
        expected: "1,000001",
        input: "1.000001"
      }
    },
    equivLiteral: {
      value: {
        input: "1+2",
        expected: "1+2"
      },
      allowInterval: {
        expected: "(0,4]",
        input: "(0,4]",
        checkboxValues: ["getAnswerAllowInterval", null],
        // TODO
        isCorrectAnswer: [false, false]
      },
      ignoreOrder: {
        expected: "1+x",
        input: "x+1",
        checkboxValues: ["getAnswerIgnoreOrder", null],
        isCorrectAnswer: [true, false]
      },
      ignoreTrailing: {
        expected: "1000.000",
        input: "1000",
        checkboxValues: ["getAnswerIgnoreTrailingZeros", null],
        isCorrectAnswer: [false, false]
      },
      ignoreCoefficientOfOne: {
        expected: "1x+2",
        input: "x+2",
        checkboxValues: ["getAnswerIgnoreCoefficientOfOne", null],
        isCorrectAnswer: [true, false]
      },
      inverseResult: {
        expected: "(x+2)2",
        input: "(x+2)2",
        checkboxValues: ["getAnswerInverseResult", null],
        // TODO {result: error}
        // isCorrectAnswer: [false, true]
        isCorrectAnswer: [false, false]
      }
    },
    equivValue: {
      compareSides: {
        expected: "4 + 5 = 9",
        input: "5+4=9"
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
        expected: "0.33",
        input: "1\\div3",
        decimalPlaces: 2
      },
      tolerance: {
        input: "10",
        expected: "8.5",
        tolerance: "±1.5"
      }
    },
    isSimplified: {
      simplifiedVersion: {
        expected: "4x+1"
      }
    },
    isFactorised: {
      inverseResult: {
        expected: "(x−1)(x−2)"
      }
    },
    isExpanded: {
      expandedForm: {
        expected: "x^2+3x"
      }
    },
    isUnit: {
      expectedUnits: {
        expected: "7ft",
        input: "7ft",
        units: "ft"
      },
      allowedUnits: {
        expected: "12km",
        units: "km"
      }
    },
    isTrue: {
      comparison: {
        expected: "6=6"
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
    equivSyntax: {
      decimal: {
        expected: "2.165",
        input: "3"
      },
      simpleFraction: {
        expected: "1/2"
      },
      mixedFraction: {
        expected: "1+1/2"
      },
      exponent: {
        expected: "2^2"
      },
      standardFormLinear: {
        expected: "Ax+By=C"
      },
      standardFormQuadratic: {
        expected: "5x^2+3x=4"
      },
      slopeIntercept: {
        expected: "y=-x+1"
      },
      pointSlope: {
        expected: "(y-1)=2(x+3)"
      }
    }
  };
  const question = new MathFillInTheBlanksPage();
  const editItem = new EditItemPage();
  const { syntaxes, fields, methods } = math;
  const editToolBar = new EditToolBar();
  const preview = new PreviewItemPage();
  const ruleArguments = question.argumentMethods;
  let previewItems;

  before(() => {
    cy.setToken();
  });

  context("User creates question", () => {
    before("visit items page and select question type", () => {
      editItem.getItemWithId("5ca369b88682ac3dab2fe2aa");
      editItem.deleteAllQuestion();
      // create new que and select type
      editItem.addNew().chooseQuestion(queData.group, queData.queType);
    });

    context("TC_429 => Enter question text in Compose Question text box", () => {
      it("Write text in textbox", () => {
        question.checkIfTextExist(queData.testtext);
      });

      it("give external link", () => {
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

      it("insert formula", () => {
        question.checkIfTextExist(queData.testtext).clear();
      });
      it("Upload image to server", () => {
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

    context("TC_429 => Enter the text/inputs to Template Markup", () => {
      it("On click of template box a latex keyboard should appear", () => {
        question
          .getMathquillBlockId()
          .then(inputElements => {
            expect(inputElements[0].innerText).to.equal("R\nRESPONSE\n+\nR\nRESPONSE\n=");
          })
          .first()
          .click();

        question.getKeyboard().should("be.visible");
      });
    });

    context("TC_488 => Set Correct Answer(s)", () => {
      it("Update Points", () => {
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
      it("Add and remove alternate answer", () => {
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
    });

    context("TC_489 => equivSymbolic method", () => {
      before("Change to equivSymbolic method", () => {
        question.setMethod(methods.EQUIV_SYMBOLIC);
        Cypress.on("uncaught:exception", (err, runnable) => {
          if (runnable.title === "Testing Value") {
            return false;
          }
          return true;
        });
      });
      it("Testing Value", () => {
        const { input, expected } = queData.equivSymbolic.value;
        question.getMathquillBlockId().then(inputElements => {
          const { length } = inputElements[0].children;
          question
            .getTemplateInput()
            .movesCursorToEnd(length)
            .type(input, { force: true });
        });
        question.setValue(input);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, false);
      });
      it("Testing check/uncheck Ignore text check box", () => {
        const { input, expected, checkboxValues, isCirrectUnsver } = queData.equivSymbolic.ignoreText;
        question.getMathquillBlockId().then(inputElements => {
          const { length } = inputElements[0].children;
          question
            .getTemplateInput()
            .movesCursorToEnd(length)
            .type("{backspace}".repeat(length - 1 || 1), { force: true });
        });
        checkboxValues.forEach((checkboxValue, index) => {
          question.setValue(input);
          question.setSeparator(checkboxValue)();
          question.checkCorrectAnswerWithResponse(expected, preview, input.length, isCirrectUnsver[index]);
        });
      });
      it("Testing with compare sides", () => {
        const { expected, input } = queData.equivSymbolic.compareSides;

        question.setValue(input);
        question.setSeparator("getAnswerCompareSides")();

        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });
      it("Testing Treat 'e' as Euler's numbe", () => {
        const { expected, input } = queData.equivSymbolic.eulersNumber;

        question.setValue(input);
        question.setSeparator("getAnswerCompareSides")();
        question
          .getAnswerCompareSides()
          .check({ force: true })
          .should("be.checked");
        question.checkCorrectAnswerWithResponse(expected, preview, input.length, false);
      });

      it("Testing with decimal separator - Comma", () => {
        const { input, expected, separator } = queData.equivSymbolic.setDecimalSeparator;
        question.getAnswerValueMathInput().type(input, { force: true });
        question.setSeparator("getAnswerAllowThousandsSeparator")();
        question.setAnswerSetDecimalSeparatorDropdown(separator);
        question.checkCorrectAnswerWithResponse(expected, preview, input.length, false);
      });

      it("Testing with thousands separators - Space and Comma", () => {
        const { input, expected, separators } = queData.equivSymbolic.setThousandsSeparator;
        question.getAnswerValueMathInput().type(input, { force: true });
        separators.forEach((separator, index) => {
          question.setSeparator("getAnswerAllowThousandsSeparator")();
          question
            .getThousandsSeparatorDropdown()
            .click()
            .then(() => {
              question
                .getThousandsSeparatorDropdownList(separator)
                .should("be.visible")
                .click();
            });
          question.checkCorrectAnswerWithResponse(expected[index], preview, index === 0 ? 0 : input.length, true);
        });
      });

      it("Testing significant decimal places", () => {
        const { input, expected, decimalPlaces } = queData.equivSymbolic.significantDecimal;

        question.setValue(input);
        question.setArgumentInput("getAnswerSignificantDecimalPlaces", decimalPlaces);

        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });

      it("Add and remove new method", () => {
        question
          .getAddNewMethod()
          .click()
          .then(() => {
            question.getMathFormulaAnswers().should("have.length", 2);
          });
        question
          .getDeleteAnswerMethod()
          .click()
          .then(() => {
            question.getMathFormulaAnswers().should("have.length", 1);
          });
      });

      it("Combination of methods ignoreText and significantDecimalPlaces", () => {
        const { input, decimalPlaces, expected } = queData.equivSymbolic.combinationIgnoreTxt;
        question.setValue(input);
        question.setArgumentInput("getAnswerSignificantDecimalPlaces", decimalPlaces);
        question.setSeparator("getAnswerIgnoreTextCheckox")();

        question.checkCorrectAnswerWithResponse(expected, preview, input.length, true);
      });

      it("Combination of methods setDecimalSeparator", () => {
        const { expected, input } = queData.equivSymbolic.combinationSetDecimalSeparator;
        question.setValue(input);
        question.setSeparator("getAnswerAllowThousandsSeparator")();
        question.checkCorrectAnswerWithResponse(expected, preview, input.length, false);
      });
    });

    context("TC_490 => equivLiteral method", () => {
      before("Change to equivLiteral method", () => {
        question.setMethod(methods.EQUIV_LITERAL);
      });
      it("Testing Value", () => {
        const { input, expected } = queData.equivLiteral.value;
        question.setValue(input);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });
      it("Testing check/uncheck Allow interval check boxl", () => {
        const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivLiteral.allowInterval;

        question.checkUncheckChecbox(preview, input, expected, checkboxValues, isCorrectAnswer);
      });

      it("Testing check/uncheck Ignore order check box", () => {
        const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivLiteral.ignoreOrder;

        question.checkUncheckChecbox(preview, input, expected, checkboxValues, isCorrectAnswer);
      });

      it("Testing check/uncheck Ignore trailing zeros check box", () => {
        const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivLiteral.ignoreTrailing;

        question.checkUncheckChecbox(preview, input, expected, checkboxValues, isCorrectAnswer);
      });

      it("Testing check/uncheck Ignore trailing zeros check box", () => {
        const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivLiteral.ignoreTrailing;

        question.checkUncheckChecbox(preview, input, expected, checkboxValues, isCorrectAnswer);
      });

      it("Testing check/uncheck Ignore coefficient of 1 check box", () => {
        const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivLiteral.ignoreCoefficientOfOne;

        question.checkUncheckChecbox(preview, input, expected, checkboxValues, isCorrectAnswer);
      });

      it("Testing check/uncheck Inverse result check box", () => {
        const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivLiteral.inverseResult;

        question.checkUncheckChecbox(preview, input, expected, checkboxValues, isCorrectAnswer);
      });

      it("Testing Allow decimal marks", () => {
        const { input, expected, separator } = queData.equivSymbolic.setDecimalSeparator;
        question.getAnswerValueMathInput().type(input, { force: true });
        question.setSeparator("getAnswerAllowThousandsSeparator")();
        question.setAnswerSetDecimalSeparatorDropdown(separator);
        question.checkCorrectAnswerWithResponse(expected, preview, input.length, false);
      });
    });
    context("TC_491 => equivValue method", () => {
      before("Change to equivLiteral method", () => {
        question.setMethod(methods.EQUIV_VALUE);
      });
      it("Testing Value", () => {
        const { expected, input } = queData.equivValue.compareSides;

        question.setValue(input);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, false);
      });

      it("Testing Inverse result", () => {
        const { expected, input } = queData.equivValue.inverse;

        question.setValue(input);
        question.setSeparator("getAnswerInverseResult")();
        question.checkCorrectAnswerWithResponse(expected, preview, 0, false);
      });

      it("Testing with ignore text", () => {
        const { expected, input } = queData.equivValue.ignoreText;
        question.setValue(input);
        question.setSeparator("getAnswerIgnoreTextCheckox")();

        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });

      it("Testing significant decimal places", () => {
        const { input, expected, decimalPlaces } = queData.equivValue.significantDecimal;

        question.setValue(input);
        question.setArgumentInput("getAnswerSignificantDecimalPlaces", decimalPlaces);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });

      it("Testing with compare sides", () => {
        const { expected, input } = queData.equivValue.compareSides;

        question.setValue(input);
        question.setSeparator("getAnswerCompareSides")();

        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });

      it("Testing with tolerance that will be deemed as correct", () => {
        const { expected, input, tolerance } = queData.equivValue.tolerance;

        question.setValue(input);

        question
          .getAnswerTolerance()
          .clear({ force: true })
          .type(tolerance, { force: true });

        question.checkCorrectAnswerWithResponse(expected, preview, 0, false);
        question.getAnswerTolerance().clear({ force: true });
      });

      it("Testing Allow decimal marks", () => {
        const { input, expected, separator } = queData.equivSymbolic.setDecimalSeparator;

        question.setValue(input);
        question.setSeparator("getAnswerAllowThousandsSeparator")();
        question.setAnswerSetDecimalSeparatorDropdown(separator);
        question.checkCorrectAnswerWithResponse(expected, preview, input.length, false);
      });
    });

    context("TC_492 => isSimplified method", () => {
      before("Change to isSimplified method", () => {
        question.setMethod(methods.IS_SIMPLIFIED);
      });

      it("Testing inverse result", () => {
        const { expected } = queData.isSimplified.simplifiedVersion;

        question.setSeparator("getAnswerInverseResult")();

        question.checkCorrectAnswerWithResponse(expected, preview, 0, false);
      });
      it("Testing with allow decimal marks", () => {
        const { expected, separators } = queData.equivSymbolic.setThousandsSeparator;

        separators.forEach((separator, index) =>
          question.allowDecimalMarksWithResponse(separator, 0, expected[index], preview, false)
        );
      });
    });

    context("TC_493 => isFactorised method", () => {
      before("Change to isFactorised method", () => {
        question.setMethod(methods.IS_FACTORISED);
      });
      it("Testing with field", () => {
        question.mapIsFactorisedMethodFields(fields);
      });

      it("Testing inverse result", () => {
        const { expected } = queData.isFactorised.inverseResult;

        question.setMethod(methods.IS_FACTORISED, question.setSeparator("getAnswerInverseResult"));

        question.checkCorrectAnswerWithResponse(expected, preview, 0, false);
      });
      it("Testing with allow decimal marks", () => {
        const { expected, separators } = queData.equivSymbolic.setThousandsSeparator;

        separators.forEach((separator, index) =>
          question.allowDecimalMarksWithResponse(separator, 0, expected[index], preview)
        );
      });
    });

    context("TC_494 => isExpanded method", () => {
      before("Change to isFactorised method", () => {
        question.setMethod(methods.IS_EXPANDED);
      });
      it("Testing that a mathematical expression is in factorised form", () => {
        const { expected } = queData.isExpanded.expandedForm;

        question.checkCorrectAnswerWithResponse(expected, preview, 0, false);
      });
      it("Testing with allow decimal marks", () => {
        const { expected, separators } = queData.equivSymbolic.setThousandsSeparator;

        separators.forEach((separator, index) =>
          question.allowDecimalMarksWithResponse(separator, 0, expected[index], preview, true)
        );
      });
    });

    context("TC_495 => isUnit method", () => {
      before("Change to isFactorised method", () => {
        question.setMethod(methods.IS_UNIT);
      });
      it("Testing with expression contains the expected units", () => {
        const { input, expected, units } = queData.isUnit.expectedUnits;

        question.setValue(input);
        question.setAllowedUnitsInput(units);
        question.checkCorrectAnswerWithResponse(expected, preview, input.length, false);
      });

      it("Testing with allowed units", () => {
        const { expected, units } = queData.isUnit.allowedUnits;

        question.setAllowedUnitsInput(units);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, false);
      });
      it("Testing with allow decimal marks", () => {
        const { expected, separators, input } = queData.equivSymbolic.setThousandsSeparator;
        question.getAnswerValueMathInput().type(input, { force: true });
        separators.forEach((separator, index) =>
          question.allowDecimalMarksWithResponse(separator, input.length, expected[index], preview, false)
        );
      });
    });

    context("TC_496 =>  isTrue method", () => {
      before("Change to isFactorised method", () => {
        question.setMethod(methods.IS_TRUE);
      });
      it("Testing that an expression has a comparison, or equality", () => {
        const { expected } = queData.isTrue.comparison;

        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });
      it("Testing significant decimal places", () => {
        const { input, expected } = queData.isTrue.significantDecimal;

        question.setArgumentInput("getAnswerSignificantDecimalPlaces", input);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, false);
      });

      it("Testing with allow decimal marks", () => {
        const { expected, separators } = queData.equivSymbolic.setThousandsSeparator;

        separators.forEach((separator, index) =>
          question.allowDecimalMarksWithResponse(separator, 0, expected[index], preview, true)
        );
      });
    });

    context("TC_497 =>  stringMatch method", () => {
      before("Change to isFactorised method", () => {
        question.setMethod(methods.STRING_MATCH);
      });
      it("Testing with literal string comparison", () => {
        const { input, expected } = queData.stringMatch.literalStringComparison;

        question.setValue(input);

        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });

      it("Testing ignores spaces before and after a value", () => {
        const { input, expected } = queData.stringMatch.leadingAndTrailing;

        question.setValue(input);
        question.setSeparator("getAnswerIgnoreLeadingAndTrailingSpaces")();
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });
      it("Testing multiple spaces will be ignored and treated as one", () => {
        const { input, expected } = queData.stringMatch.multipleSpaces;

        question.setValue(input);
        question.setSeparator("getAnswerTreatMultipleSpacesAsOne")();
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });
    });

    context("TC_497 =>  equivSyntax method", () => {
      before("Change to equivSyntax method", () => {
        question.setMethod(methods.EQUIV_SYNTAX);
      });

      it("Testing Rule : Decimal", () => {
        const { input, expected } = queData.equivSyntax.decimal;

        question.setRule(syntaxes.DECIMAL);
        question.setArgumentInput("getAnswerRuleArgumentInput", input);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });

      it("Testing Rule : Simple Fraction", () => {
        const { expected } = queData.equivSyntax.simpleFraction;

        question.setRule(syntaxes.SIMPLE_FRACTION);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });

      it("Testing Rule : mixed Fraction", () => {
        const { expected } = queData.equivSyntax.mixedFraction;

        question.setRule(syntaxes.MIXED_FRACTION);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, false);
      });

      it("Testing Rule : Exponent", () => {
        const { expected } = queData.equivSyntax.exponent;

        question.setRule(syntaxes.EXPONENT);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, false);
      });

      it("Testing Rule : Standard form, Argument: linear", () => {
        const { expected } = queData.equivSyntax.standardFormLinear;

        question.setRule(syntaxes.STANDARD_FORM);
        question.setAnswerArgumentDropdownValue(ruleArguments[0]);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });

      it("Testing Rule : Standard form, Argument: quadratic", () => {
        const { expected } = queData.equivSyntax.standardFormQuadratic;

        question.setRule(syntaxes.STANDARD_FORM);
        question.setAnswerArgumentDropdownValue(ruleArguments[1]);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, false);
      });

      it("Testing Rule : Slope intercept form", () => {
        const { expected } = queData.equivSyntax.slopeIntercept;

        question.setRule(syntaxes.SLOPE_INTERCEPT_FORM);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });

      it("Testing Rule : point slope form", () => {
        const { expected } = queData.equivSyntax.pointSlope;

        question.setRule(syntaxes.POINT_SLOPE_FORM);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });
    });

    context("TC_413 => Preview Items", () => {
      before("Handel uncaught exception", () => {
        Cypress.on("uncaught:exception", (err, runnable) => {
          if (runnable.title === "Click on preview") {
            return false;
          }
          return true;
        });
      });
      it("Click on preview", () => {
        previewItems = editItem.header.preview();
        question.getBody().contains("span", "Check Answer");

        question.getPreviewMathQuill().typeWithDelay(queData.answer.value);
      });

      it("Click on Check answer", () => {
        previewItems
          .getCheckAnswer()
          .click()
          .then(() =>
            question
              .getBody()
              .children()
              .should("contain", "score: 0/1")
          );
      });

      it("Click on Show Answers", () => {
        previewItems
          .getShowAnswer()
          .click()
          .then(() => {
            question.getCorrectAnswerBox().should("be.visible");
          });
      });

      it("Click on Clear", () => {
        previewItems.getClear().click();
        question.getPreviewMathQuill().then(inputElements =>
          cy.wrap(inputElements).then(inputElement => {
            expect(inputElement[0].offsetParent.parentElement.innerText).to.be.equal("");
            preview.header.edit();
          })
        );
      });
    });

    context("TC_415 => Save question", () => {
      it("Click on save button", () => {
        question.header.save();
        cy.url().should("contain", "item-detail");
      });
    });
  });
});
