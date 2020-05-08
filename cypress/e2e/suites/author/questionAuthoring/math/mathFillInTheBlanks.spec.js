import { math } from "@edulastic/constants";
import MathFillInTheBlanksPage from "../../../../framework/author/itemList/questionType/math/MathFillInTheBlanksPage";
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import FileHelper from "../../../../framework/util/fileHelper";
import EditToolBar from "../../../../framework/author/itemList/questionType/common/editToolBar";
import PreviewItemPage from "../../../../framework/author/itemList/itemDetail/previewPage";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import { methods } from "../../../../framework/constants/questionAuthoring";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Math – fill in the blanks" type question`, () => {
  const queData = {
    mockString: "10-5+8-4",
    group: "Math",
    queType: "Complete the Equation",
    extlink: "www.testdomain.com",
    testtext: "testtext",
    formula: "s=ar^2",
    answer: {
      value: ["1234"],
      input: ["test"]
    },
    equivSymbolic: {
      value: {
        input: ["100"],
        expected: ["40 + 60"],
        temp: ["r"]
      },
      ignoreText: {
        expected: "25m",
        input: "25",
        checkboxValues: ["getAnswerIgnoreTextCheckox", null],
        isCirrectAnsver: [true, false]
      },
      compareSides: {
        expected: ["4", "3", "7"],
        input: ["3", "4", "7"],
        temp: ["r", "+", "r", "=", "r"]
      },
      eulersNumber: {
        input: ["2.718"],
        expected: "e",
        temp: ["r"]
      },
      setDecimalSeparator: {
        thousands: ["Comma", "Dot"],
        separators: ["Dot", "Comma"],
        expected: [["1.01"], ["1,01"]],
        input: ["1.01"],
        temp: ["r"]
      },
      setThousandsSeparator: {
        thousands: ["Comma", "Dot"],
        separators: ["Dot", "Comma"],
        expected: [["1,00", "0,000"], ["1.00", "0.000"]],
        input: ["100", "0000"],
        temp: ["r", "r"]
      },
      significantDecimal: {
        expected: "0.33",
        input: ["1\\div{enter}3"],
        decimalPlaces: 2,
        temp: ["r"]
      },
      combinationIgnoreTxt: {
        expected: "7.00001m",
        input: "7",
        decimalPlaces: 3
      },
      combinationSetDecimalSeparator: {
        expected: ["1,00", "0,001"],
        input: ["1.00", "0.001"],
        decimalSeparators: "Comma",
        thousandsSeparators: "Dot",
        temp: ["r", "r"]
      },
      setDecimalSeparatorComma: {
        thousand: "Dot",
        separator: "Comma",
        expected: [","],
        input: ["."],
        temp: ["1", "r", "0", "1"]
      },
      isSimplified: {
        input: ["4x+2x"],
        expected: ["6x", "4x+2x"],
        checkboxValues: ["getSimplified", "getSimplified"],
        isCorrectAnswer: [true, false],
        temp: ["r"]
      },
      isFactorised: {
        input: ["x^2{downarrow}-16"],
        expected: ["(x-4)(x+4)", "x^2{downarrow}{downarrow}-16"],
        checkboxValues: ["getFactored", "getFactored"],
        isCorrectAnswer: [true, false],
        temp: ["r"]
      },
      isExpanded: {
        input: ["(a+b{rightarrow}^2"],
        expected: ["a^2{downarrow}+b^2{downarrow}+2ab", "(a+b)^2"],
        checkboxValues: ["getExpanded", "getExpanded"],
        isCorrectAnswer: [true, false],
        temp: ["r"]
      },
      isMixedFraction: {
        input: [`a{backspace}`, "9", "4"],
        expected: [["2", "1", "4"], ["a{backspace}", "9", "4"]], //"2\frac{1}{4}",
        checkboxValues: ["getMixedFraction", "getMixedFraction"],
        isCorrectAnswer: [true, false],
        temp: ["r", "/", "r", "{leftarrow}{leftarrow}{leftarrow}{leftarrow}", "r"]
      },
      isRationalised: {
        input: ["1", "\\sqrt{enter}2{rightarrow}"],
        expected: [["\\sqrt{enter}2{rightarrow}", "2"], ["1", "\\sqrt{enter}2{rightarrow}"]],
        checkboxValues: ["getRationalized", "getRationalized"],
        isCorrectAnswer: [true, false],
        temp: ["r", "/", "r"]
      }
    },
    equivLiteral: {
      value: {
        input: ["1", "2"],
        expected: ["1", "2"],
        temp: ["r", "+", "r"]
      },
      allowInterval: {
        expected: ["0,4", "{leftarrow}".repeat(3), "(", "{backspace}", "]"],
        input: "(0,4]",
        checkboxValues: ["getAnswerAllowInterval", null],
        isCorrectAnswer: [true, false]
      },
      ignoreOrder: {
        expected: ["1", "x"],
        input: ["x", "1"],
        checkboxValues: ["getAnswerIgnoreOrder", null],
        isCorrectAnswer: [true, false],
        temp: ["r", "+", "r"]
      },
      ignoreTrailing: {
        expected: ["10.000"],
        input: ["10"],
        checkboxValues: ["getAnswerIgnoreTrailingZeros", null],
        isCorrectAnswer: [true, false],
        temp: ["r"]
      },
      ignoreCoefficientOfOne: {
        expected: ["1x", "2"],
        input: ["x", "2"],
        checkboxValues: ["getAnswerIgnoreCoefficientOfOne", null],
        isCorrectAnswer: [true, false],
        temp: ["r", "+", "r"]
      },
      inverseResult: {
        expected: ["x+2)2"],
        input: ["(x+2)2"],
        checkboxValues: ["getAnswerInverseResult", null],
        isCorrectAnswer: [false, true],
        temp: ["r"]
      }
    },
    equivValue: {
      value: {
        expected: ["4+6"],
        input: ["4+6"],
        temp: ["r"]
      },
      compareSides: {
        expected: ["4", "5", "9"],
        input: ["5", "4", "9"],
        temp: ["r", "+", "r", "=", "r"]
      },
      inverse: {
        expected: ["44"],
        input: ["44"],
        temp: ["r"]
      },
      ignoreText: {
        expected: "33sdf",
        input: "33"
      },
      significantDecimal: {
        expected: ["0.33"],
        input: ["1/3"],
        decimalPlaces: 2
      },
      tolerance: {
        input: ["10"],
        expected: ["8.5"],
        tolerance: "1.5",
        temp: ["r"]
      }
    },
    isSimplified: {
      simplifiedVersion: {
        expected: ["4x", "1"],
        checkboxValues: ["getAnswerInverseResult", null],
        isCorrectAnswer: [false, true],
        temp: ["r", "+", "r"]
      },
      setThousandsSeparator: {
        thousands: ["Comma", "Dot"],
        separators: ["Dot", "Comma"],
        expected: ["1,000", "1.000.000"]
      }
    },
    isFactorised: {
      inverseResult: {
        expected: ["(x−1)(x+2)"]
      }
    },
    isExpanded: {
      expandedForm: {
        expected: ["x^{uparrow}2+3x"]
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
      },
      setThousandsSeparator: {
        thousands: ["Comma", "Dot"],
        separators: ["Dot", "Comma"],
        expected: ["1,000,000mi", "1.000.000mi"],
        input: "1000000mi",
        units: "mi"
      }
    },
    isTrue: {
      comparison: {
        expected: "6=6"
      },
      significantDecimal: {
        expected: ["0.33"],
        input: 2
      }
    },
    stringMatch: {
      literalStringComparison: {
        expected: ["abc"],
        input: ["abc"]
      },
      leadingAndTrailing: {
        expected: [" a "],
        input: ["a"]
      },
      multipleSpaces: {
        expected: ["a   b"],
        input: ["a b"]
      }
    },
    equivSyntax: {
      decimal: {
        expected: ["2.165"],
        input: "3",
        temp: ["r"]
      },
      simpleFraction: {
        expected: ["1/", "{downarrow}", "2"],
        temp: ["r"]
      },
      mixedFraction: {
        expected: ["1\\frac{enter}1", "{downarrow}", "2"],
        temp: ["r"]
      },
      exponent: {
        expected: ["2^", "{uparrow}", "2"],
        temp: ["r"]
      },
      standardFormLinear: {
        expected: ["Ax+By=C"],
        temp: ["r"]
      },
      standardFormQuadratic: {
        expected: ["5x^", "{uparrow}2", "{downarrow}", "+3x-4=0"],
        temp: ["r"]
      },
      slopeIntercept: {
        expected: ["y=-x+1"],
        temp: ["r"]
      },
      pointSlope: {
        expected: ["(y-1)=2(x+3)"],
        temp: ["r"]
      }
    }
  };
  const question = new MathFillInTheBlanksPage();
  const editItem = new EditItemPage();
  const itemList = new ItemListPage();
  const { syntaxes, fields } = math;
  const editToolBar = new EditToolBar();
  const preview = new PreviewItemPage();
  const ruleArguments = question.argumentMethods;
  let previewItems;

  before(() => {
    cy.login();
  });

  context(" > User creates question", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();
      // create new que and select type
      editItem.chooseQuestion(queData.group, queData.queType);
      cy.get("body")
        .contains("Additional Options")
        .click({ force: true });
    });

    context(" > TC_429 => Enter question text in Compose Question text box", () => {
      it(" > Write text in textbox", () => {
        question.checkIfTextExist(queData.testtext);
      });

      it(" > give external link", () => {
        question.checkIfTextExist(queData.testtext).type("{selectall}");
        editToolBar.linkButton().click({ force: true });
        editToolBar.linkURL().type(queData.testtext, { force: true });
        editToolBar.insertLinkButton().click();
        question
          .getComposeQuestionTextBox()
          .find("a")
          .should("have.attr", "href")
          .and("equal", `http://${queData.testtext}`)
          .then(href => {
            expect(href).to.equal(`http://${queData.testtext}`);
          });
      });

      /* it(" > insert formula", () => {
        question.checkIfTextExist(queData.testtext).clear();
      }); */

      it(" > Upload image to server", () => {
        question
          .getComposeQuestionTextBox()
          .first()
          .click({ force: true });
        cy.get("[data-cmd='insertImage']").click();
        cy.uploadFile("testImages/sample.jpg", ".fr-form > input").then(() => {
          cy.wait(5000);
          cy.get('[contenteditable="true"]')
            .find("img")
            .should("be.visible");
        });
        question.getComposeQuestionTextBox().clear();
      });
    });

    context(" > TC_429 => Enter the text/inputs to Template Markup", () => {
      it(" > On click of template box a latex keyboard should appear", () => {
        question
          .getMathquillBlockId()
          .then(inputElements => {
            expect(inputElements[0].innerText).to.equal("R\nRESPONSE\n+\nR\nRESPONSE\n=\nR\nRESPONSE");
          })
          .first()
          .click({ force: true });

        question.getKeyboard();
      });
    });

    context(" > TC_488 => Set Correct Answer(s)", () => {
      it(" > Update Points", () => {
        question
          .getPointsInput()
          .click({ force: true })
          .focus()
          .clear()
          .type("{selectall}1")
          .should("have.value", "1")
          .type("{uparrow}")
          .should("have.value", "1.5")
          .type("{selectall}1")
          .should("have.value", "1")
          .blur();
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
        //question.returnToCorrectTab();
      });
    });

    // todo
    context(" > TC_489 => equivSymbolic method", () => {
      before("Change to equivSymbolic method", () => {
        Cypress.on("uncaught:exception", (err, runnable) => {
          if (runnable.title === "Testing Value") {
            return false;
          }
          return true;
        });
        question.setMethod("EQUIV_SYMBOLIC");
      });
      beforeEach("Back to create question", () => {
        preview.header.edit();
      });
      it(" > Testing Value", () => {
        const { input, expected, temp } = queData.equivSymbolic.value;
        question.clearTemplateInput();
        question.setResponseInput(temp);
        question.setValueFill(input);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });

      /* it(" > Testing check/uncheck Ignore text check box", () => {
        const { input, expected, checkboxValues, isCirrectAnsver } = queData.equivSymbolic.ignoreText;
        checkboxValues.forEach((checkboxValue, index) => {
          question.setValue(input);
          question.setSeparator(checkboxValue)();
          question.checkCorrectAnswerWithResponse(expected, preview, input.length, isCirrectAnsver[index]);
        }); 
      }); */

      it(" > Testing with compare sides", () => {
        const { expected, input, temp } = queData.equivSymbolic.compareSides;
        question.clearTemplateInput();
        question.setResponseInput(temp);
        question.setValueFill(input);
        question.setSeparator("getAnswerCompareSides")();

        question.checkCorrectAnswerWithResponse(expected, preview, input.length, true);
      });

      it(" > Testing Treat 'e' as Euler's numbe", () => {
        const { expected, input, temp } = queData.equivSymbolic.eulersNumber;
        question.clearTemplateInput();
        question.setResponseInput(temp);
        question.setValueFill(input);
        question.setSeparator("getAnswerTreatEasEulersNumber")();
        question.setArgumentInputSignDec("getAnswerSignificantDecimalPlaces", 2);
        question
          .getAnswerCompareSides()
          .check({ force: true })
          .should("be.checked");
        question.checkCorrectAnswerWithResponse(expected, preview, input.length, true);
      });

      it(" > Testing Simplified method", () => {
        const { input, expected, isCorrectAnswer, checkboxValues, temp } = queData.equivSymbolic.isSimplified;
        question.clearTemplateInput();
        question.setResponseInput(temp);

        checkboxValues.forEach((checkboxValue, index) => {
          question.setValueFill(input);
          question.setSeparator(checkboxValue)();
          question.checkCorrectAnswerWithResponse(expected[index], preview, 0, isCorrectAnswer[index]);
        });
      });

      it(" > Testing Factored method", () => {
        const { input, expected, isCorrectAnswer, checkboxValues, temp } = queData.equivSymbolic.isFactorised;
        question.clearTemplateInput();
        question.setResponseInput(temp);
        checkboxValues.forEach((checkboxValue, index) => {
          question.setValueFill(input);
          question.setSeparator(checkboxValue)();
          question.checkCorrectAnswerWithResponse(expected[index], preview, input.length, isCorrectAnswer[index]);
        });
      });

      it(" > Testing Expanded method", () => {
        const { input, expected, isCorrectAnswer, checkboxValues, temp } = queData.equivSymbolic.isExpanded;
        question.clearTemplateInput();
        question.setResponseInput(temp);
        checkboxValues.forEach((checkboxValue, index) => {
          question.setValueFill(input);
          question.setSeparator(checkboxValue)();
          question.checkCorrectAnswerWithResponse(expected[index], preview, input.length, isCorrectAnswer[index]);
        });
      });

      it(" > Testing MixedFraction method", () => {
        const { input, expected, isCorrectAnswer, checkboxValues, temp } = queData.equivSymbolic.isMixedFraction;
        question.clearTemplateInput();
        question.setResponseInput(temp);
        checkboxValues.forEach((checkboxValue, index) => {
          question.setValueFill(input);
          question.setSeparator(checkboxValue)();
          question.checkCorrectAnswerWithResponse(expected[index], preview, input.length, isCorrectAnswer[index]);
        });
      });

      it(" > Testing Rationalized method", () => {
        const { input, expected, isCorrectAnswer, checkboxValues, temp } = queData.equivSymbolic.isRationalised;
        question.clearTemplateInput();
        question.setResponseInput(temp);

        checkboxValues.forEach((checkboxValue, index) => {
          question.setValueFill(input);
          question.setSeparator(checkboxValue)();
          question.checkCorrectAnswerWithResponse(expected[index], preview, input.length, isCorrectAnswer[index]);
        });
      });

      it(" > Testing with decimal separator - Comma", () => {
        const { input, expected, separator, thousand, temp } = queData.equivSymbolic.setDecimalSeparatorComma;
        question.clearTemplateInput();
        question.setResponseInput(temp);
        question.setValueFill(input);
        question.unCheckAllCheckBox();
        question.allowDecimalMarksWithResponse(separator, thousand, input.length, expected, preview, true);
      });

      it(" > Testing with thousands separators - Space and Comma", () => {
        const { input, expected, separators, thousands, temp } = queData.equivSymbolic.setThousandsSeparator;
        question.clearTemplateInput();
        question.setResponseInput(temp);

        thousands.forEach((thousand, index) => {
          question.setValueFill(input);
          question.unCheckAllCheckBox();
          question.allowDecimalMarksWithResponse(
            separators[index],
            thousand,
            input.length,
            expected[index],
            preview,
            true
          );
        });
      });

      it(" > Testing significant decimal places", () => {
        const { input, expected, decimalPlaces, temp } = queData.equivSymbolic.significantDecimal;
        question.clearTemplateInput();
        question.setResponseInput(temp);
        question.setValueFill(input);
        question.setArgumentInputSignDec("getAnswerSignificantDecimalPlaces", decimalPlaces);

        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });

      /*  it.skip(" > Add and remove new method", () => {
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
      }); */

      /*  it.skip(" > Combination of methods ignoreText and significantDecimalPlaces", () => {
        const { input, decimalPlaces, expected } = queData.equivSymbolic.combinationIgnoreTxt;
        question.setValueFill(input);
        question.setArgumentInput("getAnswerSignificantDecimalPlaces", decimalPlaces);
        question.setSeparator("getAnswerIgnoreTextCheckox")();

        question.checkCorrectAnswerWithResponse(expected, preview, input.length, true);
      }); */

      it(" > Combination of methods setDecimalSeparator", () => {
        const {
          expected,
          input,
          decimalSeparators,
          thousandsSeparators,
          temp
        } = queData.equivSymbolic.combinationSetDecimalSeparator;
        question.clearTemplateInput();
        question.setResponseInput(temp);
        question.setValueFill(input);
        question.setSeparator("getAnswerAllowThousandsSeparator")();
        question.setDecimalSeperator(decimalSeparators);
        question.getAnswerSetDecimalSeparatorDropdownListTab().contains("div", decimalSeparators);
        question.setThousandsSeparatorDropdown(thousandsSeparators);
        question.checkCorrectAnswerWithResponse(expected, preview, input.length + 5, false);
      });
    });

    // todo
    context(" > TC_490 => equivLiteral method", () => {
      beforeEach("Change to equivLiteral method", () => {
        preview.header.edit();
        question.setMethod("EQUIV_LITERAL");
      });
      it(" > Testing Value", () => {
        const { input, expected, temp } = queData.equivLiteral.value;
        question.clearTemplateInput();
        question.setResponseInput(temp);
        question.setValueFill(input);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });
      // it(" > Testing check/uncheck Allow interval check box", () => {
      //   const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivLiteral.allowInterval;

      //   checkboxValues.forEach((checkboxValue, index) => {
      //     question.setValueFill(input);
      //     question.setSeparator(checkboxValue)();
      //     question.checkCorrectAnswerWithResponse(expected, preview, input.length, isCorrectAnswer[index], true);
      //   });
      // });

      it(" > Testing check/uncheck Ignore order check box", () => {
        const { input, expected, checkboxValues, isCorrectAnswer, temp } = queData.equivLiteral.ignoreOrder;

        question.checkUncheckChecboxFill(preview, input, expected, checkboxValues, isCorrectAnswer, temp);
      });

      it(" > Testing check/uncheck Ignore trailing zeros check box", () => {
        const { input, expected, checkboxValues, isCorrectAnswer, temp } = queData.equivLiteral.ignoreTrailing;

        question.checkUncheckChecboxFill(preview, input, expected, checkboxValues, isCorrectAnswer, temp);
      });

      it(" > Testing check/uncheck Ignore coefficient of 1 check box", () => {
        const { input, expected, checkboxValues, isCorrectAnswer, temp } = queData.equivLiteral.ignoreCoefficientOfOne;

        question.checkUncheckChecboxFill(preview, input, expected, checkboxValues, isCorrectAnswer, temp);
      });

      it(" > Testing check/uncheck Inverse result check box", () => {
        const { input, expected, checkboxValues, isCorrectAnswer, temp } = queData.equivLiteral.inverseResult;

        question.checkUncheckChecboxFill(preview, input, expected, checkboxValues, isCorrectAnswer, temp);
      });

      // it(" > Testing Allow decimal marks", () => {
      //   const { expected, separators, input, thousands } = queData.equivSymbolic.setDecimalSeparator;

      //   separators.forEach((separator, index) => {
      //     question.setValueFill(input);
      //     question.allowDecimalMarks(separator, thousands[index], input.length, expected[index], preview, true);
      //   });
      // });
    });
    /*  context(" > TC_491 => equivValue method", () => {
      beforeEach("Change to equivLiteral method", () => {
        preview.header.edit();
        question.setMethod("EQUIV_VALUE");
      });
      // it.skip(" > Testing significant decimal places", () => {
      //   const { input, expected, decimalPlaces } = queData.equivValue.significantDecimal;
      //   question.clearTemplateInput();
      //   question.setValueFill(input);
      //   question.setArgumentInputSignDec("getAnswerSignificantDecimalPlaces", decimalPlaces);
      //   question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      // });
      it(" > Testing Value", () => {
        const { expected, input, temp } = queData.equivValue.value;
        question.clearTemplateInput();
        question.setResponseInput(temp);
        question.setValueFill(input);
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });

      it(" > Testing Inverse result", () => {
        const { expected, input, temp } = queData.equivValue.inverse;
        question.clearTemplateInput();
        question.setResponseInput(temp);
        question.setValueFill(input);
        question.setSeparator("getAnswerInverseResult")();
        question.checkCorrectAnswerWithResponse(expected, preview, 0, false);
      });

      // it(" > Testing with ignore text", () => {
      //   const { expected, input } = queData.equivValue.ignoreText;
      //   question.setValueFill(input);
      //   question.setSeparator("getAnswerIgnoreTextCheckox")();

      //   question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      // });

      it(" > Testing with compare sides", () => {
        const { expected, input, temp } = queData.equivValue.compareSides;
        question.clearTemplateInput();
        question.setResponseInput(temp);
        question.setValueFill(input);
        question.setSeparator("getAnswerCompareSides")();

        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });

      // it(" > Testing Allow decimal marks", () => {
      //   const { expected, separators, input, thousands,temp} = queData.equivSymbolic.setDecimalSeparator;

      //   separators.forEach((separator, index) => {
      //     question.clearTemplateInput();
      //   question.setResponseInput(temp);
      //     question.setValueFill(input);
      //     question.allowDecimalMarks(separator, thousands[index], input.length, expected[index], preview, true);
      //   });
      // });

      it(" > Testing with tolerance that will be deemed as correct", () => {
        const { expected, input, tolerance, temp } = queData.equivValue.tolerance;
        question.clearTemplateInput();
        question.setResponseInput(temp);
        question.setValueFill(input);
        question.unCheckAllCheckBox();
        question.getAnswerTolerancecheckbox().check({ force: true });
        question
          .getAnswerTolerance()
          .clear({ force: true })
          .type(tolerance, { force: true });

        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
        question.getAnswerTolerancecheckbox().uncheck({ force: true });
        question.getAnswerTolerance().clear({ force: true });
      });
    });

    context(" > TC_492 => isSimplified method", () => {
      beforeEach("Change to isSimplified method", () => {
        preview.header.edit();
        question.setMethod("IS_SIMPLIFIED");
      });

      it(" > Testing inverse result", () => {
        const { expected, isCorrectAnswer, checkboxValues, temp } = queData.isSimplified.simplifiedVersion;

        checkboxValues.forEach((checkboxValue, index) => {
          question.clearTemplateInput();
          question.setResponseInput(temp);
          question.setSeparator(checkboxValue)();
          question.checkCorrectAnswerWithResponse(expected, preview, 0, isCorrectAnswer[index]);
        });
      });
      // it(" > Testing with allow decimal marks", () => {
      //   const { expected, separators, thousands } = queData.equivSymbolic.setThousandsSeparator;

      //   thousands.forEach((thousand, index) => {
      //     question.allowDecimalMarks(separators[index], thousand, 0, expected[index], preview, true);
      //   });
      // });
    }); */
    /* only.....*/
    // context.skip(" > TC_493 => isFactorised method", () => {
    //   beforeEach("Change to equivLiteral method", () => {
    //     preview.header.edit();
    //     question.setMethod('IS_FACTORISED');
    //   });
    //   it(" > Testing with field", () => {
    //     question.mapIsFactorisedMethodFields(fields);
    //     question.clearTemplateInput();
    //   });

    //   it.skip(" > Testing with allow decimal marks", () => {
    //     const { expected, separators, thousands,temp} = queData.equivSymbolic.setThousandsSeparator;

    //     thousands.forEach((thousand, index) => {
    //       question.clearTemplateInput();
    //       question.setResponseInput(temp);
    //       question.allowDecimalMarksWithResponse(separators[index], thousand, 0, expected[index], preview, true);
    //     });
    //   });
    //   it.skip(" > Testing inverse result", () => {
    //     const { expected } = queData.isFactorised.inverseResult;

    //     question.setIsFactorisedMethodField(fields.INTEGER);
    //     question.setSeparator("getAnswerInverseResult")();

    //     question.checkCorrectAnswerWithResponse(expected, preview, 0, true, true);
    //   });
    // });

    /*   context(" > TC_494 => isExpanded method", () => {
      beforeEach("Change to isExpanded method", () => {
        preview.header.edit();
        question.setMethod("IS_EXPANDED");
      });
      it.skip(" > Testing that a mathematical expression is in factorised form", () => {
        const { expected } = queData.isExpanded.expandedForm;
        question.clearTemplateInput();
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true, true);
      });
      it(" > Testing with allow decimal marks", () => {
        const { expected, separators, thousands, temp } = queData.equivSymbolic.setThousandsSeparator;

        thousands.forEach((thousand, index) => {
          question.clearTemplateInput();
          question.setResponseInput(temp);
          question.allowDecimalMarksWithResponse(separators[index], thousand, 0, expected[index], preview, true);
        });
      });
    }); */

    // context(" > TC_495 => isUnit method", () => {
    //   beforeEach("Change to isUnit method", () => {
    //     preview.header.edit();
    //     question.setMethod(methods.IS_UNIT);
    //   });
    //   it(" > Testing with expression contains the expected units", () => {
    //     const { input, units } = queData.isUnit.expectedUnits;

    //     question.setValueFill(input);
    //     question.setAllowedUnitsInput(units);
    //     question.checkCorrectAnswerWithResponse(units, preview, input.length, true);
    //   });

    //   it(" > Testing with allowed units", () => {
    //     const { units } = queData.isUnit.allowedUnits;

    //     question.setAllowedUnitsInput(units);
    //     question.checkCorrectAnswerWithResponse(units, preview, 0, true);
    //   });
    //   it(" > Testing with allow decimal marks", () => {
    //     const { expected, separators, thousands, input, units } = queData.isUnit.setThousandsSeparator;

    //     thousands.forEach((thousand, index) => {
    //       question.setValueFill(input);
    //       question.setAllowedUnitsInput(units);
    //       question.allowDecimalMarks(separators[index], thousand, 0, expected[index], preview, true);
    //     });
    //   });
    // });

    /* context(" > TC_496 =>  isTrue method", () => {
      beforeEach("Change to isTrue method", () => {
        preview.header.edit();
        question.setMethod("CHECK_IF_TRUE");
      });
      it(" > Testing that an expression has a comparison, or equality", () => {
        const { expected } = queData.isTrue.comparison;
        question.clearTemplateInput();
        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      });
      // it(" > Testing significant decimal places", () => {
      //   const { input, expected } = queData.isTrue.significantDecimal;

      //   question.setArgumentInput("getAnswerSignificantDecimalPlaces", input);
      //   question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
      // });

      // it(" > Testing with allow decimal marks", () => {
      //   const { expected, separators, thousands,temp } = queData.equivSymbolic.setThousandsSeparator;
      //   thousands.forEach((thousand, index) => {
      //     question.clearTemplateInput();
      //     question.setResponseInput(temp);
      //     question.checkCorrectAnswerWithResponse(separators[index], thousand, 0, expected[index], preview, true);
      //   });
      // });
    }); */
    context(" > TC_413 => Preview Items", () => {
      before("Handel uncaught exception", () => {
        editItem.createNewItem();
        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
        Cypress.on("uncaught:exception", (err, runnable) => {
          if (runnable.title === "Click on preview") {
            return false;
          }
          return true;
        });
      });
      it(" > Click on preview", () => {
        question.clearTemplateInput();
        question.setValueFill(queData.answer.value);
        // question.setResponseInput();
        previewItems = editItem.header.preview();
        previewItems.getCheckAnswer();

        question.getAnswerMathTextArea().typeWithDelay(queData.answer.value[0]);
      });

      it(" > Click on Check answer", () => {
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

      it(" > Click on Show Answers", () => {
        previewItems
          .getShowAnswer()
          .click()
          .then(() => {
            question.getCorrectAnswerBox().should("be.visible");
          });
      });

      it(" > Click on Clear", () => {
        previewItems.getClear().click();
        question.getAnswerMathTextArea().then(inputElements =>
          cy.wrap(inputElements).then(inputElement => {
            expect(inputElement[0].offsetParent.parentElement.innerText).to.be.equal("");
            preview.header.edit();
          })
        );
      });
    });

    context(" > TC_415 => Save question", () => {
      it(" > Click on save button", () => {
        question.checkIfTextExist(queData.testtext);
        question.header.save();
        cy.url().should("contain", "item-detail");
      });
    });
  });
  /*  context(" > TC_497 =>  stringMatch method", () => {
    beforeEach("Change to equivLiteral method", () => {
      editItem.createNewItem();
      // create new que and select type
      editItem.chooseQuestion(queData.group, queData.queType);
      cy.get("body")
        .contains("Additional Options")
        .click({ force: true });
      preview.header.edit();
      question.clearTemplateInput();
      question.setMethod("STRING_MATCH");
    });
    it(" > Testing with literal string comparison", () => {
      const { input, expected } = queData.stringMatch.literalStringComparison;
      question.setValueFill(input);
      question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
    });

    it(" > Testing ignores spaces before and after a value", () => {
      const { input, expected } = queData.stringMatch.leadingAndTrailing;

      question.setValueFill(input);
      question.setSeparator("getAnswerIgnoreLeadingAndTrailingSpaces")();
      question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
    });
    it(" > Testing multiple spaces will be ignored and treated as one", () => {
      const { input, expected } = queData.stringMatch.multipleSpaces;

      question.setValueFill(input);
      question.setSeparator("getAnswerTreatMultipleSpacesAsOne")();
      question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
    });
  }); */
  /* only.....*/
  // todo
  context(" > TC_497 =>  equivSyntax method", () => {
    beforeEach("Change to equivLiteral method", () => {
      editItem.createNewItem();
      // create new que and select type
      editItem.chooseQuestion(queData.group, queData.queType);
      cy.get("body")
        .contains("Additional Options")
        .click({ force: true });
      preview.header.edit();
      question.clearTemplateInput();
      question.setMethod("EQUIV_SYNTAX");
    });
    it(" > Testing Rule : point slope form", () => {
      const { expected, temp } = queData.equivSyntax.pointSlope;
      question.clearTemplateInput();
      question.setResponseInput(temp);
      question.setRule(syntaxes.POINT_SLOPE_FORM);
      question.checkCorrectAnswerWithResponse(expected, preview, 0, true, true);
    });
    it(" > Testing Rule : Exponent", () => {
      const { expected, temp } = queData.equivSyntax.exponent;
      question.clearTemplateInput();
      question.setResponseInput(temp);
      question.setRule(syntaxes.EXPONENT);
      question.checkCorrectAnswerWithResponse(expected, preview, 0, true, true);
    });
    it(" > Testing Rule : Decimal", () => {
      const { input, expected, temp } = queData.equivSyntax.decimal;
      question.clearTemplateInput();
      question.setResponseInput(temp);
      question.setRule(syntaxes.DECIMAL);
      question.setArgumentInput("getAnswerRuleArgumentInput", input);
      question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
    });

    it(" > Testing Rule : Simple Fraction", () => {
      const { expected, temp } = queData.equivSyntax.simpleFraction;
      question.clearTemplateInput();
      question.setResponseInput(temp);
      question.setRule(syntaxes.SIMPLE_FRACTION);
      question.checkCorrectAnswerWithResponse(expected, preview, 0, true, true);
    });

    it(" > Testing Rule : mixed Fraction", () => {
      const { expected, temp } = queData.equivSyntax.mixedFraction;
      question.clearTemplateInput();
      question.setResponseInput(temp);
      question.setRule(syntaxes.MIXED_FRACTION);
      question.checkCorrectAnswerWithResponse(expected, preview, 0, true, true);
    });

    // it(" > Testing Rule : Exponent", () => {
    //   const { expected } = queData.equivSyntax.exponent;

    //   question.setRule(syntaxes.EXPONENT);
    //   question.checkCorrectAnswerWithResponse(expected, preview, 0, true, true);
    // });

    it(" > Testing Rule : Standard form, Argument: linear", () => {
      const { expected, temp } = queData.equivSyntax.standardFormLinear;
      question.clearTemplateInput();
      question.setResponseInput(temp);
      question.setRule(syntaxes.STANDARD_FORM);
      question.setAnswerArgumentDropdownValue(ruleArguments[0]);
      question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
    });

    it(" > Testing Rule : Standard form, Argument: quadratic", () => {
      const { expected, temp } = queData.equivSyntax.standardFormQuadratic;
      question.clearTemplateInput();
      question.setResponseInput(temp);
      question.setRule(syntaxes.STANDARD_FORM);
      question.setAnswerArgumentDropdownValue(ruleArguments[1]);
      question.checkCorrectAnswerWithResponse(expected, preview, 0, true, true);
    });

    it(" > Testing Rule : Slope intercept form", () => {
      const { expected, temp } = queData.equivSyntax.slopeIntercept;
      question.clearTemplateInput();
      question.setResponseInput(temp);
      question.setRule(syntaxes.SLOPE_INTERCEPT_FORM);
      question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
    });
  });
  /*  context(" > TC_491 => equivValue method-2", () => {
    beforeEach("Change to equivLiteral method", () => {
      editItem.createNewItem();
      // create new que and select type
      editItem.chooseQuestion(queData.group, queData.queType);
      cy.get("body")
        .contains("Additional Options")
        .click({ force: true });
      preview.header.edit();
      question.setMethod("EQUIV_VALUE");
    });
    it(" > Testing significant decimal places", () => {
      const { input, expected, decimalPlaces } = queData.equivValue.significantDecimal;
      question.clearTemplateInput();
      question.setValueFill(input);
      question.setArgumentInputSignDec("getAnswerSignificantDecimalPlaces", decimalPlaces);
      question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
    });
  });
  context(" > TC_493 => isFactorised method", () => {
    beforeEach("Change to equivLiteral method", () => {
      editItem.createNewItem();
      // create new que and select type
      editItem.chooseQuestion(queData.group, queData.queType);
      question.clearTemplateInput();
      cy.get("body")
        .contains("Additional Options")
        .click({ force: true });
      preview.header.edit();
      question.setMethod("IS_FACTORISED");
    });
    it(" > Testing inverse result", () => {
      const { expected } = queData.isFactorised.inverseResult;

      question.setSeparator("getAnswerInverseResult")();
      question.setIsFactorisedMethodField(fields.INTEGER);
      cy.get('[data-cy="answer-inverse-result"]').check({ force: true });
      preview.header.preview();
      question.getAnswerMathTextArea().type(expected[0], { force: true });
      preview.getCheckAnswer().click({ force: true });
      question.checkNoticeMessageScore(preview, true, question.checkAttr(true));
      preview.header.edit();
      //this.clearTemplateInput();
      //if (inputLength > 0) question.clearAnswerValueInput(inputLength+5);
      question.checkCorrectAnswerWithResponse(expected, preview, 0, true, true);
    });
    it(" > Testing with field", () => {
      question.mapIsFactorisedMethodFields(fields);
    });

    it(" > Testing with allow decimal marks", () => {
      const { expected, separators, thousands, temp } = queData.equivSymbolic.setThousandsSeparator;
      question.clearTemplateInput();
      question.setResponseInput(temp);
      thousands.forEach((thousand, index) => {
        question.allowDecimalMarksWithResponse(separators[index], thousand, 0, expected[index], preview, true);
      });
    });
  }); */
});
