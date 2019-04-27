import { math } from "@edulastic/constants";
import MathWithUnitsPage from "../../../../framework/author/itemList/questionType/math/mathWithUnitsPage";
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import FileHelper from "../../../../framework/util/fileHelper";
import EditToolBar from "../../../../framework/author/itemList/questionType/common/editToolBar";
import PreviewItemPage from "../../../../framework/author/itemList/itemDetail/previewPage";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Math units" type question`, () => {
  const queData = {
    mockString: "10-5+8-4",
    group: "Math",
    queType: "Math with units",
    extlink: "www.testdomain.com",
    testText: "testtext",
    formula: "s=ar^2",
    answer: {
      value: "1234",
      ariaLabel: "test"
    },
    equivSymbolic: {
      value: {
        input: "40cm+60cm=1m",
        expected: "40cm+60cm"
      },
      compareSides: {
        input: "40cm+60cm=100cm",
        expected: "60cm+40cm",
        templateInput: "=100cm"
      },
      ignoreText: {
        expected: "25m",
        input: "25",
        checkboxValues: ["getAnswerIgnoreTextCheckox", null],
        isCorrectAnswer: [true, false]
      },
      eulersNumber: {
        input: "2.718",
        expected: "e"
      },
      setDecimalSeparator: {
        thousand: "Dot",
        separator: "Comma",
        expected: "1,01cm",
        input: "1.01cm"
      },
      setThousandsSeparator: {
        thousand: ["Comma", "Space"],
        separators: ["Dot", "Comma"],
        expected: ["1,000,000", "1 000 000"],
        input: "1000000"
      },
      significantDecimal: {
        expected: "0.33",
        input: "1\\div3",
        decimalPlaces: 2
      }
    },
    equivLiteral: {
      value: {
        input: "100cm",
        expected: ["50cm+50cm", "100cm"],
        isCorrectAnswer: [false, true]
      },
      allowInterval: {
        expected: "(0,4]",
        input: "(0,4]",
        checkboxValues: ["getAnswerAllowInterval", null],
        isCorrectAnswer: [true, false]
      },
      ignoreOrder: {
        expected: "60cm+40cm=1m",
        input: "40cm+60cm=1m",
        checkboxValues: ["getAnswerIgnoreOrder", null],
        isCorrectAnswer: [true, false]
      },
      ignoreTrailing: {
        expected: "1000.000cm",
        input: "1000cm",
        checkboxValues: ["getAnswerIgnoreTrailingZeros", null],
        isCorrectAnswer: [true, false]
      },
      ignoreCoefficientOfOne: {
        expected: "1x+100cm=1m",
        input: "x+100cm=1m",
        checkboxValues: ["getAnswerIgnoreCoefficientOfOne", null],
        isCorrectAnswer: [true, false]
      },
      inverseResult: {
        expected: "100cm",
        input: "100cm",
        checkboxValues: [null, "getAnswerInverseResult"],
        isCorrectAnswer: [true, false]
      }
    },
    equivValue: {
      compareSides: {
        expected: "6cm+4cm=10cm",
        input: "4cm+6cm=10cm"
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
        tolerance: "1.5"
      }
    },
    isSimplified: {
      simplifiedVersion: {
        expected: "10cm"
      },
      setThousandsSeparator: {
        thousand: ["Comma", "Space"],
        separators: ["Dot", "Comma"],
        expected: ["1,000,000", "1 000 000"]
      }
    },
    isFactorised: {
      inverseResult: {
        expected: "(x−1)(x−2)"
      }
    },
    isExpanded: {
      expandedForm: {
        expected: "x"
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
        expected: "6cm=6cm"
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
        expected: "2.165cm",
        input: "3"
      },
      simpleFraction: {
        expected: "2÷4"
      },
      mixedFraction: {
        expected: "1+2cm÷5cm"
      },
      exponent: {
        expected: ["2^2", "{downarrow}", "cm"]
      },
      standardFormLinear: {
        expected: "Ax+By=C"
      },
      standardFormQuadratic: {
        expected: ["5x^2", "{downarrow}", "+3x=4"]
      },
      slopeIntercept: {
        expected: "y=-x+1"
      },
      pointSlope: {
        expected: "(y-1)=2(x+3)"
      }
    },
    combination: {
      ignoreTxt: {
        expected: "7.00001m",
        input: "7",
        decimalPlaces: 3
      },
      significantDecimalPlaces: {
        input: "5cm",
        expected: ["5.001cm", "5.0001cm"],
        isCorrectAnswer: [false, true],
        decimalPlaces: 3
      },
      setDecimalSeparator: {
        expected: "1.000001cm",
        input: "1,000001cm",
        decimalSeparators: "Comma",
        thousandsSeparators: "Dot"
      },
      setThousandsSeparator: {
        thousands: ["Space", "Comma"],
        separators: ["Dot", "Dot"],
        expected: ["1/1 000cm", "1/1,000cm"],
        input: "0.001cm",
        isCorrectAnswer: [true, true]
      },
      compareSides: {
        input: "6cm+4cm=10cm",
        expected: "4cm+6cm=10cm"
      }
    },
    decimalSeparators: ["Dot", "Comma"],
    thousandsSeparators: ["Space", "Dot", "Comma"]
  };
  const question = new MathWithUnitsPage();
  const editItem = new EditItemPage();
  const itemList = new ItemListPage();
  const { syntaxes, fields, methods } = math;
  const editToolBar = new EditToolBar();
  const preview = new PreviewItemPage();
  const ruleArguments = question.argumentMethods;
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
      editItem.getItemWithId(testItemId);
      editItem.deleteAllQuestion();
      // create new que and select type
      editItem.addNew().chooseQuestion(queData.group, queData.queType);
      Cypress.on("uncaught:exception", () => false);
    });

    context(" > TC_520 => Enter question text in Compose Question text box", () => {
      it(" > Write text in textbox", () => {
        const { testText } = queData;

        question.checkIfTextExist(testText);
      });

      it(" > give external link", () => {
        const { testText } = queData;

        question.checkIfTextExist(testText).type("{selectall}");
        editToolBar.link().click();
        question.getSaveLink().click();
        question
          .getComposeQuestionTextBoxLink()
          .find("a")
          .should("have.attr", "href")
          .and("equal", testText)
          .then(href => {
            expect(href).to.equal(testText);
          });
      });

      it(" > insert formula", () => {
        const { testText } = queData;

        question.checkIfTextExist(testText).clear();
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

    context(" > TC_521 => Enter the text/inputs to Template Markup", () => {
      it(" > On click of template box a latex keyboard should appear", () => {
        const templateText = "\n        R\n        Response\n      =1m";
        question
          .getMathquillBlockId()
          .first()
          .then(inputElements => {
            cy.wrap(inputElements).should("have.text", templateText);
          })
          .first()
          .click();

        question.getKeyboard().should("be.visible");
      });
    });

    context(" > TC_522 => Set Correct Answer(s)", () => {
      it(" > Update Points", () => {
        question
          .getPointsInput()
          .click({ force: true })
          .verifyNumInput(1);
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
    });

    context(" > TC_523 => equivSymbolic method", () => {
      beforeEach("Back to create question and set math method", () => {
        preview.header.edit();
        question.setMethod(methods.EQUIV_SYMBOLIC);
      });

      it(" > Testing Value", () => {
        const { input, expected } = queData.equivSymbolic.value;
        question.setValue(input);
        question.checkCorrectAnswerWithResponse(expected, preview, input.length, true);
      });

      it(" > Testing with compare sides", () => {
        const { expected, input, templateInput } = queData.equivSymbolic.compareSides;
        question.clearTemplateInput();
        question.getTemplateInput().type(templateInput, { force: true });
        question.setResponseInput();

        question.setValue(input);
        question.setSeparator("getAnswerCompareSides")();

        question.checkCorrectAnswerWithResponse(expected, preview, input.length, true);
      });

      it(" > Testing check/uncheck Ignore text check box", () => {
        const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivSymbolic.ignoreText;

        question.clearTemplateInput();
        question.setResponseInput();

        checkboxValues.forEach((checkboxValue, index) => {
          question.setValue(input);
          question.setSeparator(checkboxValue)();
          question.checkCorrectAnswerWithResponse(expected, preview, input.length, isCorrectAnswer[index]);
        });
      });

      it(" > Testing Treat 'e' as Euler's numbe", () => {
        const { expected, input } = queData.equivSymbolic.eulersNumber;

        question.setValue(input);
        question.setSeparator("getAnswerTreatEasEulersNumber")();
        question.checkCorrectAnswerWithResponse(expected, preview, input.length, true);
      });

      it(" > Testing with decimal separator - Comma", () => {
        const { input, expected, separator, thousand } = queData.equivSymbolic.setDecimalSeparator;
        question.setValue(input);
        question.setSeparator("getAnswerAllowThousandsSeparator")();
        question.setAnswerSetDecimalSeparatorDropdown(separator);
        question.setThousandSeperator(thousand);
        question.checkCorrectAnswerWithResponse(expected, preview, input.length, true);
      });

      it(" > Testing with thousands separators - Space and Comma", () => {
        const { input, expected, separators, thousand } = queData.equivSymbolic.setThousandsSeparator;
        question.getAnswerValueMathInput().type(input, { force: true });
        separators.forEach((separator, index) => {
          question.setSeparator("getAnswerAllowThousandsSeparator")();
          question.setAnswerSetDecimalSeparatorDropdown(separator);
          question
            .getThousandsSeparatorDropdown()
            .click()
            .then(() => {
              question
                .getThousandsSeparatorDropdownList(thousand[index])
                .should("be.visible")
                .click();
            });
          question.checkCorrectAnswerWithResponse(expected[index], preview, index === 0 ? 0 : input.length, true);
        });
      });

      it(" > Testing significant decimal places", () => {
        const { input, expected, decimalPlaces } = queData.equivSymbolic.significantDecimal;

        question.setValue(input);
        question.setArgumentInput("getAnswerSignificantDecimalPlaces", decimalPlaces);

        question.checkCorrectAnswerWithResponse(expected, preview, input.length, true);
      });

      it(" > Add and remove new method", () => {
        question
          .getAddNewMethod()
          .click({ force: true })
          .then(() => {
            question.getMathFormulaAnswers().should("have.length", 2);
          });
        question.deleteLastMethod().then(() => {
          question.getMathFormulaAnswers().should("have.length", 1);
        });
      });
    });

    context(" > TC_524 => equivLiteral method", () => {
      beforeEach("Back to create question and set math method", () => {
        preview.header.edit();
        question.setMethod(methods.EQUIV_LITERAL);
      });
      it(" > Testing Value", () => {
        const { input, expected, isCorrectAnswer } = queData.equivLiteral.value;
        question.clearTemplateInput();
        question.setResponseInput();
        question.setValue(input);
        expected.forEach((value, index) =>
          question.checkCorrectAnswerWithResponse(value, preview, 0, isCorrectAnswer[index])
        );
      });

      it(" > Testing check/uncheck Allow interval check box", () => {
        const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivLiteral.allowInterval;
        question.clearTemplateInput();
        question.checkUncheckChecbox(preview, input, expected, checkboxValues, isCorrectAnswer);
        question.setResponseInput();
      });

      it(" > Testing check/uncheck Ignore order check box", () => {
        const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivLiteral.ignoreOrder;

        question.checkUncheckChecbox(preview, input, expected, checkboxValues, isCorrectAnswer);
      });

      it(" > Testing check/uncheck Ignore trailing zeros check box", () => {
        const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivLiteral.ignoreTrailing;

        question.checkUncheckChecbox(preview, input, expected, checkboxValues, isCorrectAnswer);
      });

      it(" > Testing check/uncheck Ignore coefficient of 1 check box", () => {
        const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivLiteral.ignoreCoefficientOfOne;

        question.checkUncheckChecbox(preview, input, expected, checkboxValues, isCorrectAnswer);
      });

      it(" > Testing check/uncheck Inverse result check box", () => {
        const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivLiteral.inverseResult;

        question.checkUncheckChecbox(preview, input, expected, checkboxValues, isCorrectAnswer);
      });

      it(" > Testing Allow decimal marks", () => {
        const { input, expected, separator, thousand } = queData.equivSymbolic.setDecimalSeparator;
        question.getAnswerValueMathInput().type(input, { force: true });
        question.setSeparator("getAnswerAllowThousandsSeparator")();
        question.setAnswerSetDecimalSeparatorDropdown(separator);
        question.setThousandSeperator(thousand);
        question.checkCorrectAnswerWithResponse(expected, preview, input.length, true);
      });
    });

    context(" > TC_525 => equivValue method", () => {
      beforeEach("Back to create question and set math method", () => {
        preview.header.edit();
        question.setMethod(methods.EQUIV_VALUE);
      });
      it(" > Testing Value", () => {
        const { input } = queData.equivValue.compareSides;

        question.setValue(input);
        question.setSeparator("getAnswerCompareSides")();
        question.checkCorrectAnswerWithResponse(input, preview, input.length, true);
      });
      it(" > Testing Allow decimal marks", () => {
        const { input, expected, separator, thousand } = queData.equivSymbolic.setDecimalSeparator;
        question.setValue(input);
        question.setSeparator("getAnswerAllowThousandsSeparator")();
        question.setAnswerSetDecimalSeparatorDropdown(separator);
        question.setThousandSeperator(thousand);
        question.checkCorrectAnswerWithResponse(expected, preview, input.length, true);
      });
      it(" > Testing Inverse result", () => {
        const { expected, input } = queData.equivValue.inverse;

        question.setValue(input);
        question.setSeparator("getAnswerInverseResult")();
        question.checkCorrectAnswerWithResponse(expected, preview, 0, false);
      });

      it(" > Testing with ignore text", () => {
        const { expected, input } = queData.equivValue.ignoreText;
        question.setValue(input);
        question.setSeparator("getAnswerIgnoreTextCheckox")();

        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });

      it(" > Testing significant decimal places", () => {
        const { input, expected, decimalPlaces } = queData.equivValue.significantDecimal;

        question.setValue(input);
        question.setArgumentInput("getAnswerSignificantDecimalPlaces", decimalPlaces);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });

      it(" > Testing with compare sides", () => {
        const { expected, input } = queData.equivValue.compareSides;

        question.setValue(input);
        question.setSeparator("getAnswerCompareSides")();

        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });

      it(" > Testing with tolerance that will be deemed as correct", () => {
        const { expected, input, tolerance } = queData.equivValue.tolerance;

        question.setValue(input);

        question
          .getAnswerTolerance()
          .clear({ force: true })
          .type(tolerance, { force: true });

        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
        question.getAnswerTolerance().clear({ force: true });
      });
    });

    context(" > TC_526 => isSimplified method", () => {
      beforeEach("Back to create question and set math method", () => {
        preview.header.edit();
        question.setMethod(methods.IS_SIMPLIFIED);
      });
      it(" > Testing inverse result", () => {
        const { expected } = queData.isSimplified.simplifiedVersion;

        question.setSeparator("getAnswerInverseResult")();

        question.checkCorrectAnswerWithResponse(expected, preview, 0, false);
      });
      it(" > Testing with allow decimal marks", () => {
        const { expected, separators, thousand } = queData.isSimplified.setThousandsSeparator;

        separators.forEach((separator, index) =>
          question.allowDecimalMarksWithResponse(separator, thousand[index], 0, expected[index], preview, true)
        );
      });
    });

    context(" > TC_527 => isFactorised method", () => {
      beforeEach("Back to create question and set math method", () => {
        preview.header.edit();
        question.setMethod(methods.IS_FACTORISED);
      });
      it(" > Testing with allow decimal marks", () => {
        const { expected, separators, thousand } = queData.isSimplified.setThousandsSeparator;
        separators.forEach((separator, index) =>
          question.allowDecimalMarksWithResponse(separator, thousand[index], 0, expected[index], preview, true)
        );
      });
      it(" > Testing with field", () => {
        question.mapIsFactorisedMethodFields(fields);
      });

      it(" > Testing inverse result", () => {
        const { expected } = queData.isFactorised.inverseResult;

        question.setMethod(methods.IS_FACTORISED);
        question.setSeparator("getAnswerInverseResult")();

        question.checkCorrectAnswerWithResponse(expected, preview, 0, false);
      });
    });

    context(" > TC_528 => isExpanded method", () => {
      beforeEach("Back to create question and set math method", () => {
        preview.header.edit();
        question.setMethod(methods.IS_EXPANDED);
      });
      it(" > Testing with allow decimal marks", () => {
        const { expected, separators, thousand } = queData.isSimplified.setThousandsSeparator;

        separators.forEach((separator, index) =>
          question.allowDecimalMarksWithResponse(separator, thousand[index], 0, expected[index], preview, true)
        );
      });
      it(" > Testing that a mathematical expression is in factorised form", () => {
        const { expected } = queData.isExpanded.expandedForm;

        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });
    });

    context(" > TC_529 => isUnit method", () => {
      beforeEach("Back to create question and set math method", () => {
        preview.header.edit();
        question.setMethod(methods.IS_UNIT);
      });
      it(" > Testing with allow decimal marks", () => {
        const { expected, separators, input, thousand } = queData.equivSymbolic.setThousandsSeparator;
        question.setValue(input);
        separators.forEach((separator, index) =>
          question.allowDecimalMarksWithResponse(
            separator,
            thousand[index],
            input.length,
            expected[index],
            preview,
            true
          )
        );
      });
      it(" > Testing with expression contains the expected units", () => {
        const { input, expected, units } = queData.isUnit.expectedUnits;

        question.setValue(input);
        question.setAllowedUnitsInput(units);
        question.checkCorrectAnswerWithResponse(expected, preview, input.length, true);
      });

      it(" > Testing with allowed units", () => {
        const { expected, units } = queData.isUnit.allowedUnits;

        question.setAllowedUnitsInput(units);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
        question.getAnswerAllowedUnits().clear({ force: true });
      });
    });

    context(" > TC_530 =>  isTrue method", () => {
      beforeEach("Back to create question and set math method", () => {
        preview.header.edit();
        question.setMethod(methods.IS_TRUE);
      });
      it(" > Testing that an expression has a comparison, or equality", () => {
        const { expected } = queData.isTrue.comparison;

        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });
      it(" > Testing significant decimal places", () => {
        const { input, expected } = queData.isTrue.significantDecimal;

        question.setArgumentInput("getAnswerSignificantDecimalPlaces", input);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });

      it(" > Testing with allow decimal marks", () => {
        const { expected, separators, thousand } = queData.equivSymbolic.setThousandsSeparator;

        separators.forEach((separator, index) =>
          question.allowDecimalMarksWithResponse(separator, thousand[index], 0, expected[index], preview, true)
        );
      });
    });

    context(" > TC_531 =>  stringMatch method", () => {
      beforeEach("Back to create question and set math method", () => {
        preview.header.edit();
        question.setMethod(methods.STRING_MATCH);
      });
      it(" > Testing with literal string comparison", () => {
        const { input, expected } = queData.stringMatch.literalStringComparison;

        question.setValue(input);

        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });

      it(" > Testing ignores spaces before and after a value", () => {
        const { input, expected } = queData.stringMatch.leadingAndTrailing;

        question.setValue(input);
        question.setSeparator("getAnswerIgnoreLeadingAndTrailingSpaces")();
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });
      it(" > Testing multiple spaces will be ignored and treated as one", () => {
        const { input, expected } = queData.stringMatch.multipleSpaces;

        question.setValue(input);
        question.setSeparator("getAnswerTreatMultipleSpacesAsOne")();
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });
    });

    context(" > TC_532 =>  equivSyntax method", () => {
      beforeEach("Change to equivSyntax method", () => {
        preview.header.edit();
        question.setMethod(methods.EQUIV_SYNTAX);
      });

      it(" > Testing Rule : Decimal", () => {
        const { input, expected } = queData.equivSyntax.decimal;

        question.setRule(syntaxes.DECIMAL);
        question.setArgumentInput("getAnswerRuleArgumentInput", input);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });

      it(" > Testing Rule : Simple Fraction", () => {
        const { expected } = queData.equivSyntax.simpleFraction;

        question.setRule(syntaxes.SIMPLE_FRACTION);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });

      it(" > Testing Rule : mixed Fraction", () => {
        const { expected } = queData.equivSyntax.mixedFraction;

        question.setRule(syntaxes.MIXED_FRACTION);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });

      it(" > Testing Rule : Exponent", () => {
        const { expected } = queData.equivSyntax.exponent;

        question.setRule(syntaxes.EXPONENT);
        question.clearTemplateInput();

        question.checkCorrectAnswerWithResponse(expected, preview, 0, true, true);
        question.setResponseInput();
      });

      it(" > Testing Rule : Standard form, Argument: linear", () => {
        const { expected } = queData.equivSyntax.standardFormLinear;

        question.setRule(syntaxes.STANDARD_FORM);
        question.setAnswerArgumentDropdownValue(ruleArguments[0]);
        question.setResponseInput();
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });

      it(" > Testing Rule : Standard form, Argument: quadratic", () => {
        const { expected } = queData.equivSyntax.standardFormQuadratic;

        question.setRule(syntaxes.STANDARD_FORM);
        question.setAnswerArgumentDropdownValue(ruleArguments[1]);
        question.clearTemplateInput();
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true, true);
        question.setResponseInput();
      });

      it(" > Testing Rule : Slope intercept form", () => {
        const { expected } = queData.equivSyntax.slopeIntercept;

        question.setRule(syntaxes.SLOPE_INTERCEPT_FORM);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });

      it(" > Testing Rule : point slope form", () => {
        const { expected } = queData.equivSyntax.pointSlope;

        question.setRule(syntaxes.POINT_SLOPE_FORM);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });
    });

    context(" > TC_552 => Validate different evaluation methods", () => {
      before("visit items page and select question type", () => {
        editItem.getItemWithId(testItemId);
        editItem.deleteAllQuestion();
        // create new que and select type
        editItem.addNew().chooseQuestion(queData.group, queData.queType);
      });
      beforeEach("Change to equivSyntax method", () => {
        preview.header.edit();
        question.setMethod(methods.EQUIV_SYMBOLIC);
      });

      it(" > Combination of methods ignoreText and significantDecimalPlaces", () => {
        const { input, decimalPlaces, expected } = queData.combination.ignoreTxt;
        question.clearTemplateInput();
        question.setResponseInput();
        question.setValue(input);
        question.setArgumentInput("getAnswerSignificantDecimalPlaces", decimalPlaces);
        question.setSeparator("getAnswerIgnoreTextCheckox")();

        question.checkCorrectAnswerWithResponse(expected, preview, input.length, true);
      });

      it(" > Combination of methods setDecimalSeparator", () => {
        const { expected, input, decimalSeparators, thousandsSeparators } = queData.combination.setDecimalSeparator;

        question.setValue(input);
        question.setSeparator("getAnswerAllowThousandsSeparator")();
        question.setDecimalSeperator(decimalSeparators);
        question.getAnswerSetDecimalSeparatorDropdown().contains("div", decimalSeparators);
        question.setThousandsSeparatorDropdown(thousandsSeparators);

        question.checkCorrectAnswerWithResponse(expected, preview, input.length, true);
      });

      it(" > Combination of methods significantDecimalPlaces", () => {
        const { expected, input, isCorrectAnswer, decimalPlaces } = queData.combination.significantDecimalPlaces;
        question.clearTemplateInput();
        question.setResponseInput();
        question.unCheckAllCheckBox();

        expected.forEach((exp, index) => {
          question.setValue(input);
          question.setArgumentInput("getAnswerSignificantDecimalPlaces", decimalPlaces);
          question.checkCorrectAnswerWithResponse(exp, preview, input.length, isCorrectAnswer[index]);
        });
      });

      it(" > Combination of methods setThousandsSeparator - Space and Comma", () => {
        const { input, expected, separators, isCorrectAnswer, thousands } = queData.combination.setThousandsSeparator;
        question.clearTemplateInput();
        separators.forEach((separator, index) => {
          question.setValue(input);
          question.allowDecimalMarks(
            separator,
            thousands[index],
            input.length,
            expected[index],
            preview,
            isCorrectAnswer[index]
          );
        });
      });
      it(" > Combination of methods compareSides", () => {
        const { expected, input } = queData.combination.compareSides;
        question.setResponseInput();
        question.setValue(input);
        question.setSeparator("getAnswerCompareSides")();
        question.checkCorrectAnswer(expected, preview, 0, true);
      });
    });

    context(" > TC_534 => Preview Items", () => {
      before("Handel uncaught exception", () => {
        editItem.getItemWithId(testItemId);
        editItem.deleteAllQuestion();
        // create new que and select type
        editItem.addNew().chooseQuestion(queData.group, queData.queType);
      });
      it(" > Click on preview", () => {
        question.setValue(queData.answer.value);
        question.clearTemplateInput();
        question.setResponseInput();
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
        preview.getClear().click();
        question.getAnswerMathTextArea().then(inputElements =>
          cy.wrap(inputElements).then(inputElement => {
            expect(inputElement[0].offsetParent.parentElement.innerText).to.be.equal("");
            preview.header.edit();
          })
        );
      });
    });

    context(" > TC_533 => Save question", () => {
      it(" > Click on save button", () => {
        question.header.save();
        cy.url().should("contain", "item-detail");
      });
    });
  });
});
