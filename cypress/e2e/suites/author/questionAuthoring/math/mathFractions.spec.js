/// <reference types="Cypress"/>

import { math } from "@edulastic/constants";
import MathFractionPage from "../../../../framework/author/itemList/questionType/math/mathFractionPage";
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import FileHelper from "../../../../framework/util/fileHelper";
import EditToolBar from "../../../../framework/author/itemList/questionType/common/editToolBar";
import PreviewItemPage from "../../../../framework/author/itemList/itemDetail/previewPage";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Math formula" type question`, () => {
  const queData = {
    mockString: "10-5+8-4",
    group: "Math",
    queType: "Math with fractions",
    extlink: "www.testdomain.com",
    testtext: "testtext",
    formula: "s=ar^2",
    answer: {
      value: "1234",
      ariaLabel: "test"
    },
    symbols: ["units_si", "units_us"],
    decimalSeparators: ["Dot", "Comma"],
    thousandsSeparators: ["Space", "Dot", "Comma"],
    equivSymbolic: {
      value: {
        expected: "12/2",
        input: "3*2"
      },
      ignoreText: {
        expected: "25m",
        input: "25"
      },
      eulerNumber: {
        expected: "e",
        input: "2.718",
        value: 3
      },
      compareSides: {
        expected: "3+4=7",
        input: "4+3=7"
      },
      setDecimalSeparator: {
        separator: "Comma",
        expected: "1,01",
        input: "1.01"
      },
      setThousandsSeparator: {
        separators: ["Space", "Comma"],
        expected: ["1/1 000", "1/1,000"],
        input: "0.001"
      },
      significantDecimalPlaces: {
        value: 3,
        expected: "0.333",
        input: "1/3"
      },
      significantDecimalAndIgnoreText: {
        expected: "7.0001m",
        input: 7.00012,
        value: 4
      },
      multipleThousandSeparators: {
        separators: ["Space"],
        expected: ["100,000.1", "100 000.1"],
        input: "100000.1"
      }
    },
    equivLiteral: {
      simpleFractions: {
        expected: "2/4",
        input: "1/2"
      },
      inverseResult: {
        expected: "2*3",
        input: "2*3"
      },
      ignoreTrailingZeros: {
        expected: ["1.50", "1.500"],
        input: "1.5"
      },
      setDecimalSeparator: {
        thousand: "Dot",
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
        input: "x+1"
      },
      ignoreCoefficientOfOne: {
        expected: "1x+2",
        input: "x+2"
      },
      allowInterval: {
        expected: "[1, 2)",
        input: "[1, 2)"
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
        input: "1/3",
        expected: "0.33",
        decimalPlaces: 2
      },
      compareSides: {
        expected: "4+5=9",
        input: "3+6=9"
      },
      tolerance: {
        input: "10",
        expected: ["8.5", "9", "11.5"],
        tolerance: "1.5"
      },
      setDecimalSeparator: {
        thousand: "Dot",
        separator: "Comma",
        expected: ["1,1", "1,1+1"],
        input: ["1.1", "1.1+1"]
      },
      setThousandsSeparator: {
        separators: ["Comma", "Space"],
        expected: ["1,000,000", "1 000 000"],
        input: "1000000"
      }
    },
    isSimplified: {
      simplifiedVersion: {
        expected: "4x+1"
      },
      inverse: {
        expected: "4+x"
      },
      setDecimalSeparator: {
        thousand: "Dot",
        separator: "Comma",
        expected: "1,1+1"
      },
      setThousandsSeparator: {
        separators: ["Space", "Comma"],
        expected: ["1/1 000", "1/1,000"],
        input: "0.001"
      }
    },
    isFactorised: {
      factorisedForm: {
        expected: "4"
      },
      inverseResult: {
        expected: "x+2"
      },
      setDecimalSeparator: {
        thousand: "Dot",
        separator: "Comma",
        expected: "1,1+1"
      },
      setThousandsSeparator: {
        separators: ["Space", "Comma"],
        expected: ["1/1 000", "1/1,000"],
        input: "0.001"
      }
    },
    isExpanded: {
      expandedForm: {
        expected: "x^2{downarrow}+5x+6"
      },
      setDecimalSeparator: {
        thousand: "Dot",
        separator: "Comma",
        expected: ["1,1", "1,1+1"],
        input: ["1.1", "1.1+1"]
      },
      setThousandsSeparator: {
        separators: ["Space", "Comma"],
        expected: ["1/1 000", "1/1,000"],
        input: "0.001"
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
        input: "12km",
        units: "km"
      },
      setDecimalSeparator: {
        thousand: "Dot",
        separator: "Comma",
        expected: "1,1",
        input: "1.1"
      },
      setThousandsSeparator: {
        separators: ["Space", "Comma"],
        expected: ["10 000", "10,000"],
        input: "10000"
      }
    },
    isTrue: {
      comparison: {
        expected: "5<6"
      },
      significantDecimal: {
        expected: "0.33",
        input: 2
      },
      setDecimalSeparator: {
        thousand: "Dot",
        separator: "Comma",
        expected: "1,1+1",
        input: "1,1+1"
      },
      setThousandsSeparator: {
        separators: ["Space", "Comma"],
        expected: ["1/1 000", "1/1,000"],
        input: "0.001"
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
        expected: "5.123",
        input: "3"
      },
      simpleFraction: {
        expected: "2/4"
      },
      mixedFraction: {
        expected: "1+1/2"
      },
      exponent: {
        expected: "2^2"
      },
      standardFormLinear: {
        expected: "2x+3y=10"
      },
      standardFormQuadratic: {
        expected: "5x^2{downarrow}+3x=4"
      },
      slopeIntercept: {
        expected: "y=-x+1"
      },
      pointSlope: {
        expected: "(y-1)=2(x+3)"
      }
    }
  };
  const question = new MathFractionPage();
  const editItem = new EditItemPage();
  const itemList = new ItemListPage();
  const numpadButtons = question.virtualKeyBoardNumpad;
  const buttons = question.virtualKeyBoardButtons;
  const { syntaxes, fields, methods } = math;
  const ruleArguments = question.argumentMethods;
  const editToolBar = new EditToolBar();
  const [fraction, numrator, denominator] = [".mq-fraction", ".mq-numerator", ".mq-denominator"];
  const preview = new PreviewItemPage();

  before(() => {
    cy.login();
  });

  context(" > User creates question", () => {
    before("visit items page and select question type", () => {
      itemList.clickOnCreate();
      // create new que and select type
      editItem.chooseQuestion(queData.group, queData.queType);
    });

    context(" > Tc_443 => Enter question text in Compose Question text box", () => {
      it(" > Write text in textbox", () => {
        question
          .getComposeQuestionTextBox()
          .clear()
          .type(queData.testtext)
          .then($input => {
            console.log("$input", $input[0].innerText);
            expect($input[0].innerText).to.contain(queData.testtext);
          });
      });

      // TODO give external link

      // TODO insert formula

      it(" > Upload image to server", () => {
        question.getComposeQuestionTextBox().focus();

        cy.get(".ql-image").click();
        cy.uploadFile("testImages/sample.jpg", "input.ql-image[type=file]").then(() =>
          cy
            .get(".ql-editor p")
            .find("img")
            .should("be.visible")
        );
        question.getComposeQuestionTextBox().clear();
      });
    });

    context(" > TC_444 => Template", () => {
      it(" > Check default template should be fraction", () => {
        question
          .getTemplateRoot()
          .find(fraction)
          .should("be.visible");
        question.getTemplateInput().type("{del}".repeat(5), { force: true });

        question
          .getTemplateInput()
          .click({ force: true })
          .then(() => {
            question.getVirtualKeyBoard().should("be.exist");
          });
      });

      it(" > Edit template textarea", () => {
        question.getTemplateInput().type(queData.mockString, { force: true });
        question.getTemplateOutput().should("have.length", queData.mockString.length + 1);
        question.getTemplateInput().type("{backspace}".repeat(queData.mockString.length), { force: true });
        question.getTemplateOutput().should("have.length", 1);
      });

      it(" > Edit template textarea from virtual keyboard", () => {
        question
          .getTemplateInput()
          .parent()
          .parent()
          .click();
        question.addResponseBox();
        question.removeLastValue();

        // numpad from virtual keyboard
        numpadButtons.forEach(button => {
          const { value, label } = button;
          question
            .getVirtualKeyBoard()
            .find(`button[data-cy="virtual-keyboard-${value}"]`)
            .click();
          question
            .getTemplateOutput()
            .first()
            .contains(label)
            .should("be.visible");
          question.removeLastValue();
        });

        // button from virtual keyboard
        buttons.forEach(button => {
          const { label, clas } = button;
          question
            .getVirtualKeyBoard()
            .find(`button[data-cy="virtual-keyboard-${label}"]`)
            .click();
          if (clas) {
            question
              .getTemplateOutput()
              .find(clas)
              .should("be.visible");
          } else {
            question
              .getTemplateOutput()
              .first()
              .contains(label)
              .should("be.visible");
          }

          question.removeLastValue();
        });
      });
    });

    context(" > Tc_445 => Set Correct Answer(s)", () => {
      it(" > Update Points", () => {
        question
          .getPointsInput()
          .click({ force: true })
          .verifyNumInput(1);
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
      it(" > Testing equivSymbolic method options", () => {
        question.setMethod(methods.EQUIV_SYMBOLIC);
        question.enterAnswerValueMathInput(queData.answer.value);
        question.getAnswerValueMathOutput().should("have.length", 5);
        question
          .getAnswerAriaLabel()
          .click()
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
          question
            .getAnswerSetDecimalSeparatorDropdown()
            .click()
            .then(() => {
              question
                .getAnswerSetDecimalSeparatorDropdownList(item)
                .should("be.visible")
                .click();
            });
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

  context(" > Validate different evaluation methods", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();

      // create new que and select type
      editItem.chooseQuestion(queData.group, queData.queType);
      question.clearAnswerValueInput(4);
      question.getTemplateInput().type("{del}".repeat(4), { force: true });
      question.getComposeQuestionTextBox().click();
    });

    context(" > TC_446 => equivSymbolic method", () => {
      before("Change to equivSymbolic method", () => {
        editItem.header.edit();
        question.setMethod(methods.EQUIV_SYMBOLIC);
      });

      beforeEach("Go to Edit Mode", () => {
        editItem.header.edit();
        question.clearAnswerValueInput(10);
      });

      it(" > Testing with basic value", () => {
        const { input, expected } = queData.equivSymbolic.value;
        question.enterAnswerValueMathInput(input);
        question.checkCorrectAnswer(expected, preview, input.length, true, true, "1/1");
      });
      it(" > Testing with ignore text", () => {
        const { input, expected } = queData.equivSymbolic.ignoreText;
        question.enterAnswerValueMathInput(input);
        question.getAnswerIgnoreTextCheckox().check({ force: true });

        question.checkCorrectAnswer(expected, preview, input.length, true);

        question.getAnswerIgnoreTextCheckox().uncheck({ force: true });
      });
      /* 
      it(" > Testing with Euler's number", () => {
        const { input, expected, value } = queData.equivSymbolic.eulerNumber;
        question.enterAnswerValueMathInput(input);
        question
          .getAnswerSignificantDecimalPlaces()
          .click({ force: true })
          .focus()
          .clear()
          .type(`{selectall}${value}`)
          .blur();

        question.getAnswerTreatEasEulersNumber().check({ force: true });

        question.checkCorrectAnswer(expected, preview, input.length, true);

        question.getAnswerTreatEasEulersNumber().uncheck({ force: true });
      });
 */
      it(" > Testing with compare sides", () => {
        const { input, expected } = queData.equivSymbolic.compareSides;
        question.enterAnswerValueMathInput(input);
        question.getAnswerCompareSides().check({ force: true });

        question.checkCorrectAnswer(expected, preview, input.length, true);

        question.getAnswerCompareSides().uncheck({ force: true });
      });
      it(" > Testing with decimal separator - Comma", () => {
        const { input, expected, separator } = queData.equivSymbolic.setDecimalSeparator;
        question.enterAnswerValueMathInput(input);
        question.getAnswerAllowThousandsSeparator().check({ force: true });
        question
          .getAnswerSetDecimalSeparatorDropdown()
          .click()
          .then(() => {
            question
              .getAnswerSetDecimalSeparatorDropdownList(separator)
              .should("be.visible")
              .click();
          });

        question.checkCorrectAnswer(expected, preview, input.length, false);

        question.getAnswerAllowThousandsSeparator().uncheck({ force: true });
      });
      it(" > Testing with thousands separators - Space and Comma", () => {
        const { input, expected, separators } = queData.equivSymbolic.setThousandsSeparator;
        question.enterAnswerValueMathInput(input);
        separators.forEach((separator, index) => {
          question.getAnswerAllowThousandsSeparator().check({ force: true });
          question
            .getThousandsSeparatorDropdown()
            .click()
            .then(() => {
              question
                .getThousandsSeparatorDropdownList(separator)
                .should("be.visible")
                .click();
            });
          question.checkCorrectAnswer(expected[index], preview, index === 0 ? 0 : input.length, true);

          question.getAnswerAllowThousandsSeparator().uncheck({ force: true });
        });
      });
      it(" > Testing with significant decimal '3'", () => {
        const { input, expected, value } = queData.equivSymbolic.significantDecimalPlaces;
        question.enterAnswerValueMathInput(input);
        question
          .getAnswerSignificantDecimalPlaces()
          .click({ force: true })
          .focus()
          .clear()
          .type(`{selectall}${value}`)
          .blur();
        question.checkCorrectAnswer(expected, preview, 4, true);
      });
      it(" > Testing with significant decimal '3' and ignore text", () => {
        const { input, expected, value } = queData.equivSymbolic.significantDecimalAndIgnoreText;
        question.enterAnswerValueMathInput(input);
        question
          .getAnswerSignificantDecimalPlaces()
          .click({ force: true })
          .focus()
          .clear()
          .type(`{selectall}${value}`)
          .blur();
        question.getAnswerIgnoreTextCheckox().check({ force: true });

        question.checkCorrectAnswer(expected, preview, 2, true);

        question.getAnswerIgnoreTextCheckox().uncheck({ force: true });
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

    context(" > TC_447 => equivLiteral method", () => {
      before("Set method to equivLiteral", () => {
        editItem.header.edit();
        question.setMethod(methods.EQUIV_LITERAL);
      });

      beforeEach("Go to Edit Mode", () => {
        editItem.header.edit();
        question.clearAnswerValueInput(10);
      });

      it(" > Testing simple fractions value", () => {
        const { input, expected } = queData.equivLiteral.simpleFractions;
        question.enterAnswerValueMathInput(input);
        // incorrect
        question.checkCorrectAnswer(expected, preview, 0, false);
        // correct
        question.checkCorrectAnswer(input, preview, input.length, true);
      });

      it(" > Testing with allow Interval", () => {
        const { input, expected } = queData.equivLiteral.allowInterval;
        question.enterAnswerValueMathInput(input);
        question.getAnswerAllowInterval().check({ force: true });
        question.checkCorrectAnswer(expected, preview, input.length, true);
        question.getAnswerIgnoreCoefficientOfOne().uncheck({ force: true });
      });

      it(" > Testing with ignoring order", () => {
        const { input, expected } = queData.equivLiteral.ignoreOrder;
        question.enterAnswerValueMathInput(input);
        question.getAnswerIgnoreOrder().check({ force: true });

        question.checkCorrectAnswer(expected, preview, input.length, true);

        question.getAnswerIgnoreOrder().uncheck({ force: true });
      });

      it(" > Testing  with ignore trailing zeros", () => {
        const { input, expected } = queData.equivLiteral.ignoreTrailingZeros;
        question.getAnswerIgnoreTrailingZeros().check({ force: true });
        question.enterAnswerValueMathInput(input);
        expected.forEach((item, index) => {
          question.checkCorrectAnswer(item, preview, index === 0 ? 0 : input.length, true);
        });
        question.getAnswerIgnoreTrailingZeros().uncheck({ force: true });
      });

      it(" > Testing with ignore coefficient of 1", () => {
        const { input, expected } = queData.equivLiteral.ignoreCoefficientOfOne;
        question.enterAnswerValueMathInput(input);
        question.getAnswerIgnoreCoefficientOfOne().check({ force: true });

        question.checkCorrectAnswer(expected, preview, input.length, true);

        question.getAnswerIgnoreCoefficientOfOne().uncheck({ force: true });
      });

      it(" > Testing inverse result", () => {
        const { input, expected } = queData.equivLiteral.inverseResult;
        question.enterAnswerValueMathInput(input);
        question.getAnswerInverseResult().check({ force: true });

        question.checkCorrectAnswer(expected, preview, input.length, false);

        question.getAnswerInverseResult().uncheck({ force: true });
      });

      it(" > Testing with decimal separator - Comma", () => {
        const { input, expected, separator, thousand } = queData.equivLiteral.setDecimalSeparator;
        question.getAnswerAllowThousandsSeparator().check({ force: true });
        question
          .getAnswerSetDecimalSeparatorDropdown()
          .click()
          .then(() => {
            question
              .getAnswerSetDecimalSeparatorDropdownList(separator)
              .should("be.visible")
              .click();
          });
        // change thounsand seperator as both can not be same
        question
          .getThousandsSeparatorDropdown()
          .click()
          .then(() => {
            question
              .getThousandsSeparatorDropdownList(thousand)
              .should("be.visible")
              .click();
          });

        input.forEach((item, index) => {
          question.enterAnswerValueMathInput(item);
          question.checkCorrectAnswer(expected[index], preview, item.length, true);
        });

        question.getAnswerAllowThousandsSeparator().uncheck({ force: true });
      });

      it(" > Testing with thousands separators - Comma, Space", () => {
        const { separators, input, expected } = queData.equivLiteral.setThousandsSeparator;
        question.getAnswerAllowThousandsSeparator().check({ force: true });
        question.enterAnswerValueMathInput(input);
        separators.forEach((item, index) => {
          question
            .getThousandsSeparatorDropdown()
            .click()
            .then(() => {
              question.getThousandsSeparatorDropdownList(item).click();
            });

          question.checkCorrectAnswer(expected[index], preview, index === 0 ? 0 : input.length, true);
        });
      });
    });

    context(" > TC_448 => equivValue method", () => {
      before("Set method to equivLiteral", () => {
        editItem.header.edit();
        question.setMethod(methods.EQUIV_VALUE);
      });

      beforeEach("Go to Edit Mode", () => {
        editItem.header.edit();
        question.clearAnswerValueInput(10);
      });
      it(" > Testing with evaluate the expression to a numerical form for comparison", () => {
        const { expected, input } = queData.equivValue.numericalForm;

        question.setMethod(methods.EQUIV_VALUE);
        question.setValue(input);
        question.checkCorrectAnswer(expected, preview, 0, true);
      });
      it(" > Testing with inverse result", () => {
        const { expected, input } = queData.equivValue.inverse;

        question.setMethod(methods.EQUIV_VALUE);
        question.setValue(input);
        question.setSeparator("getAnswerInverseResult")();
        question.checkCorrectAnswer(expected, preview, 0, false);
      });
      it(" > Testing with ignore text", () => {
        const { expected, input } = queData.equivValue.ignoreText;

        question.setMethod(methods.EQUIV_VALUE);
        question.setValue(input);
        question.setSeparator("getAnswerIgnoreTextCheckox")();
        question.checkCorrectAnswer(expected, preview, 0, true);
      });
      it(" > Testing with significant decimal places", () => {
        const { expected, input, decimalPlaces } = queData.equivValue.significantDecimal;

        question.setMethod(methods.EQUIV_VALUE);
        question.setValue(input);
        question
          .getAnswerSignificantDecimalPlaces()
          .clear({ force: true })
          .type("{uparrow}".repeat(decimalPlaces), { force: true });

        question.checkCorrectAnswer(expected, preview, 0, true);
      });
      it(" > Testing with compare sides", () => {
        const { expected, input } = queData.equivValue.compareSides;

        question.setMethod(methods.EQUIV_VALUE);
        question.setValue(input);
        question.setSeparator("getAnswerCompareSides")();
        question.checkCorrectAnswer(expected, preview, 0, true);
      });
      it(" > Testing with tolerance that will be deemed as correct", () => {
        const { expected, input, tolerance } = queData.equivValue.tolerance;

        question.setMethod(methods.EQUIV_VALUE);
        question.setValue(input);
        question
          .getAnswerTolerance()
          .clear({ force: true })
          .type(tolerance, { force: true });
        expected.forEach((expectedVal, index) => {
          question.checkCorrectAnswer(expectedVal, preview, index + 1 === expected.length ? input.length : 0, true);
        });
        question.getAnswerTolerance().clear({ force: true });
      });

      context(" > Testing with allow decimal marks", () => {
        it(" > Testing with decimal separator - Comma", () => {
          const { input, expected, separator, thousand } = queData.equivValue.setDecimalSeparator;
          question.getAnswerAllowThousandsSeparator().check({ force: true });
          question.setDecimalSeperator(separator);
          // change thounsand seperator as both can not be same
          question.setThousandSeperator(thousand);
          input.forEach((item, index) => {
            question.enterAnswerValueMathInput(item);
            question.checkCorrectAnswer(expected[index], preview, item.length, true);
          });
          question.getAnswerAllowThousandsSeparator().uncheck({ force: true });
        });

        it(" > Testing with thousands separators - Comma, Space", () => {
          const { separators, input, expected } = queData.equivValue.setThousandsSeparator;
          question.getAnswerAllowThousandsSeparator().check({ force: true });
          question.enterAnswerValueMathInput(input);
          separators.forEach((item, index) => {
            question.setThousandSeperator(item);
            question.checkCorrectAnswer(expected[index], preview, index === 0 ? 0 : input.length, true);
          });
        });
      });
    });

    context(" > TC_449 => isSimplified method", () => {
      before("Set method to isSimplified", () => {
        editItem.header.edit();
        question.setMethod(methods.IS_SIMPLIFIED);
      });

      beforeEach("Go to Edit Mode", () => {
        editItem.header.edit();
      });

      it(" > Testing simplified version", () => {
        const { expected } = queData.isSimplified.simplifiedVersion;

        question.setMethod(methods.IS_SIMPLIFIED);
        question.checkCorrectAnswer(expected, preview, 0, true);
      });
      it(" > Testing inverse result", () => {
        const { expected } = queData.isSimplified.inverse;

        question.setMethod(methods.IS_SIMPLIFIED);
        question.setSeparator("getAnswerInverseResult")();
        question.checkCorrectAnswer(expected, preview, 0, false);
      });

      context(" > Testing with allow decimal marks", () => {
        it(" > Testing with decimal separator - Comma", () => {
          const { input, expected, separator, thousand } = queData.isSimplified.setDecimalSeparator;
          question.getAnswerAllowThousandsSeparator().check({ force: true });
          question.setDecimalSeperator(separator);
          // change thounsand seperator as both can not be same
          question.setThousandSeperator(thousand);
          question.checkCorrectAnswer(expected, preview, 0, true);

          question.getAnswerAllowThousandsSeparator().uncheck({ force: true });
        });

        it(" > Testing with thousands separators - Comma, Space", () => {
          const { separators, input, expected } = queData.isSimplified.setThousandsSeparator;
          question.getAnswerAllowThousandsSeparator().check({ force: true });
          separators.forEach((item, index) => {
            question.setThousandSeperator(item);
            question.checkCorrectAnswer(expected[index], preview, 0, true);
          });
          question.getAnswerAllowThousandsSeparator().uncheck({ force: true });
        });
      });
    });

    context(" > TC_450 => isFactorised method", () => {
      before("Set method to isSimplified", () => {
        editItem.header.edit();
        question.setMethod(methods.IS_FACTORISED);
      });

      beforeEach("Go to Edit Mode", () => {
        editItem.header.edit();
      });

      it(" > Testing that a mathematical expression is in factorised form", () => {
        const { expected } = queData.isFactorised.factorisedForm;

        question.setMethod(methods.IS_FACTORISED);

        question.checkCorrectAnswer(expected, preview, 0, true);
      });
      it(" > Testing with field", () => {
        question.setMethod(methods.IS_FACTORISED);

        Object.values(fields).forEach(field =>
          question
            .getAnswerFieldDropdown()
            .click()
            .then(() =>
              question
                .getAnswerFieldDropdownListValue(field)
                .click()
                .should("be.visible")
            )
        );
      });
      it(" > Testing inverse result", () => {
        const { expected } = queData.isFactorised.inverseResult;

        question.setMethod(methods.IS_FACTORISED);
        question.setSeparator("getAnswerInverseResult")();
        question.checkCorrectAnswer(expected, preview, 0, false);
      });
      context(" > Testing with allow decimal marks", () => {
        it(" > Testing with decimal separator - Comma", () => {
          const { input, expected, separator, thousand } = queData.isSimplified.setDecimalSeparator;
          question.getAnswerAllowThousandsSeparator().check({ force: true });
          question.setDecimalSeperator(separator);
          // change thounsand seperator as both can not be same
          question.setThousandSeperator(thousand);
          question.checkCorrectAnswer(expected, preview, 0, true);

          question.getAnswerAllowThousandsSeparator().uncheck({ force: true });
        });

        it(" > Testing with thousands separators - Comma, Space", () => {
          const { separators, input, expected } = queData.isSimplified.setThousandsSeparator;
          question.getAnswerAllowThousandsSeparator().check({ force: true });
          separators.forEach((item, index) => {
            question.setThousandSeperator(item);
            question.checkCorrectAnswer(expected[index], preview, 0, true);
          });
          question.getAnswerAllowThousandsSeparator().uncheck({ force: true });
        });
      });
    });

    context(" > TC_451 => isExpanded method", () => {
      before("Set method to isExpanded", () => {
        editItem.header.edit();
        question.setMethod(methods.IS_EXPANDED);
      });

      beforeEach("Go to Edit Mode", () => {
        editItem.header.edit();
      });

      it(" > Testing that a mathematical expression is in expanded form", () => {
        const { expected } = queData.isExpanded.expandedForm;
        question.setMethod(methods.IS_EXPANDED);
        question.checkCorrectAnswer(expected, preview, 0, true);
      });

      context(" > Testing with allow decimal marks", () => {
        it(" > Testing with decimal separator - Comma", () => {
          const { input, expected, separator, thousand } = queData.isSimplified.setDecimalSeparator;
          question.getAnswerAllowThousandsSeparator().check({ force: true });
          question.setDecimalSeperator(separator);
          // change thounsand seperator as both can not be same
          question.setThousandSeperator(thousand);
          question.checkCorrectAnswer(expected, preview, 0, true);

          question.getAnswerAllowThousandsSeparator().uncheck({ force: true });
        });

        it(" > Testing with thousands separators - Comma, Space", () => {
          const { separators, input, expected } = queData.isSimplified.setThousandsSeparator;
          question.getAnswerAllowThousandsSeparator().check({ force: true });
          separators.forEach((item, index) => {
            question.setThousandSeperator(item);
            question.checkCorrectAnswer(expected[index], preview, 0, true);
          });
          question.getAnswerAllowThousandsSeparator().uncheck({ force: true });
        });
      });
    });

    context(" > TC_453 => isTrue method", () => {
      before("Set method to isTrue", () => {
        editItem.header.edit();
        question.setMethod(methods.IS_TRUE);
      });

      beforeEach("Go to Edit Mode", () => {
        editItem.header.edit();
      });

      it(" > Testing that an expression has a comparison, or equality", () => {
        const { expected } = queData.isTrue.comparison;

        question.setMethod(methods.IS_TRUE);

        question.checkCorrectAnswer(expected, preview, 0, true, true, "1/1");
      });

      it(" > Testing significant decimal places", () => {
        const { input, expected } = queData.isTrue.significantDecimal;

        question.setMethod(methods.IS_TRUE);
        question
          .getAnswerSignificantDecimalPlaces()
          .clear()
          .type("{uparrow}".repeat(input), { force: true });
        question.checkCorrectAnswer(expected, preview, 0, true);
      });

      context(" > Testing with allow decimal marks", () => {
        it(" > Testing with decimal separator - Comma", () => {
          const { expected, separator, thousand } = queData.isTrue.setDecimalSeparator;
          question.getAnswerAllowThousandsSeparator().check({ force: true });
          question.setDecimalSeperator(separator);
          // change thounsand seperator as both can not be same
          question.setThousandSeperator(thousand);
          question.checkCorrectAnswer(expected, preview, 0, true);

          question.getAnswerAllowThousandsSeparator().uncheck({ force: true });
        });

        it(" > Testing with thousands separators - Comma, Space", () => {
          const { separators, expected } = queData.isTrue.setThousandsSeparator;
          question.getAnswerAllowThousandsSeparator().check({ force: true });
          separators.forEach((item, index) => {
            question.setThousandSeperator(item);
            question.checkCorrectAnswer(expected[index], preview, 0, true);
          });
          question.getAnswerAllowThousandsSeparator().uncheck({ force: true });
        });
      });
    });

    context(" > TC_454 => stringMatch method", () => {
      before("Set method to stringMatch", () => {
        editItem.header.edit();
        question.setMethod(methods.STRING_MATCH);
      });

      beforeEach("Go to Edit Mode", () => {
        editItem.header.edit();
      });

      it(" > Testing with literal string comparison", () => {
        const { input, expected } = queData.stringMatch.literalStringComparison;
        question.setMethod(methods.STRING_MATCH);
        question.setValue(input);
        question.checkCorrectAnswer(expected, preview, 0, true);
      });

      it(" > Testing ignores spaces before and after a value", () => {
        const { input, expected } = queData.stringMatch.leadingAndTrailing;
        question.setMethod(methods.STRING_MATCH);
        question.setValue(input);
        question.setSeparator("getAnswerIgnoreLeadingAndTrailingSpaces")();
        question.checkCorrectAnswer(expected, preview, 0, true);
      });

      it(" > Testing multiple spaces will be ignored and treated as one", () => {
        const { input, expected } = queData.stringMatch.multipleSpaces;
        question.setMethod(methods.STRING_MATCH);
        question.setValue(input);
        question.setSeparator("getAnswerTreatMultipleSpacesAsOne")();
        question.checkCorrectAnswer(expected, preview, 0, true);
      });
    });

    context(" > TC_452 => isUnit method", () => {
      before("Set method to isUnit", () => {
        editItem.header.edit();
        question.setMethod(methods.IS_UNIT);
      });

      beforeEach("Go to Edit Mode", () => {
        editItem.header.edit();
      });

      it(" > Testing with expression contains the expected units", () => {
        const { input, expected, units } = queData.isUnit.expectedUnits;
        question.setMethod(methods.IS_UNIT);
        question.setValue(input);
        question
          .getAnswerAllowedUnits()
          .clear({ force: true })
          .type(units, { force: true });
        question.checkCorrectAnswer(expected, preview, input.length, true);
      });
      it(" > Testing with allowed units", () => {
        const { input, expected, units } = queData.isUnit.allowedUnits;
        question.setMethod(methods.IS_UNIT);
        question.setValue(input);
        question
          .getAnswerAllowedUnits()
          .clear({ force: true })
          .type(units, { force: true });
        question.checkCorrectAnswer(expected, preview, input.length, true);
      });
      context(" > Testing with allow decimal marks", () => {
        it(" > Testing with decimal separator - Comma", () => {
          const { input, expected, separator, thousand } = queData.isUnit.setDecimalSeparator;
          question.getAnswerAllowThousandsSeparator().check({ force: true });
          question.setDecimalSeperator(separator);
          // change thounsand seperator as both can not be same
          question.setThousandSeperator(thousand);
          question.enterAnswerValueMathInput(input);
          question.checkCorrectAnswer(expected, preview, input.length, true);
          question.getAnswerAllowThousandsSeparator().uncheck({ force: true });
        });

        it(" > Testing with thousands separators - Comma, Space", () => {
          const { input, separators, expected } = queData.isUnit.setThousandsSeparator;
          question.getAnswerAllowThousandsSeparator().check({ force: true });
          question.enterAnswerValueMathInput(input);
          separators.forEach((item, index) => {
            question.setThousandSeperator(item);
            question.checkCorrectAnswer(expected[index], preview, index === 0 ? 0 : input.length, true);
          });
          question.getAnswerAllowThousandsSeparator().uncheck({ force: true });
        });
      });
    });

    context(" > TC_455 => equivSyntax methods", () => {
      before("Set method to equivSyntax", () => {
        editItem.header.edit();
        question.setMethod(methods.EQUIV_SYNTAX);
      });

      beforeEach("Go to Edit Mode", () => {
        editItem.header.edit();
      });

      it(" > Testing Rule : Decimal", () => {
        const { expected } = queData.equivSyntax.decimal;
        question.setMethod(methods.EQUIV_SYNTAX);
        question.setRule(syntaxes.DECIMAL);
        question.checkCorrectAnswer(expected, preview, 0, true);
      });

      it(" > Testing Rule : Simple Fraction", () => {
        const { expected } = queData.equivSyntax.simpleFraction;
        question.setMethod(methods.EQUIV_SYNTAX);
        question.setRule(syntaxes.SIMPLE_FRACTION);
        question.checkCorrectAnswer(expected, preview, 0, true, false, "1/1");
      });

      it(" > Testing Rule : mixed Fraction", () => {
        const { expected } = queData.equivSyntax.mixedFraction;
        question.setMethod(methods.EQUIV_SYNTAX);
        question.setRule(syntaxes.MIXED_FRACTION);
        question.checkCorrectAnswer(expected, preview, 0, false, false, "1/1");
      });

      it(" > Testing Rule : Exponent", () => {
        const { expected } = queData.equivSyntax.exponent;
        question.setMethod(methods.EQUIV_SYNTAX);
        question.setRule(syntaxes.EXPONENT);
        question.checkCorrectAnswer(expected, preview, 0, false, false, "1/1");
      });

      it(" > Testing Rule : Standard form, Argument: linear", () => {
        const { expected } = queData.equivSyntax.standardFormLinear;
        question.setMethod(methods.EQUIV_SYNTAX);
        question.setRule(syntaxes.STANDARD_FORM);
        question
          .getAnswerRuleArgumentSelect()
          .click()
          .then(() => question.getAnswerArgumentDropdownByValue(ruleArguments[0]).click());
        question.checkCorrectAnswer(expected, preview, 0, true);
      });

      it(" > Testing Rule : Standard form, Argument: quadratic", () => {
        const { expected } = queData.equivSyntax.standardFormQuadratic;
        question.setMethod(methods.EQUIV_SYNTAX);
        question.setRule(syntaxes.STANDARD_FORM);
        question
          .getAnswerRuleArgumentSelect()
          .click()
          .then(() => question.getAnswerArgumentDropdownByValue(ruleArguments[1]).click());
        question.checkCorrectAnswer(expected, preview, 0, true);
      });

      it(" > Testing Rule : Slope intercept form", () => {
        const { expected } = queData.equivSyntax.slopeIntercept;
        question.setMethod(methods.EQUIV_SYNTAX);
        question.setRule(syntaxes.SLOPE_INTERCEPT_FORM);
        question.checkCorrectAnswer(expected, preview, 0, true);
      });

      it(" > Testing Rule : point slope form", () => {
        const { expected } = queData.equivSyntax.pointSlope;
        question.setMethod(methods.EQUIV_SYNTAX);
        question.setRule(syntaxes.POINT_SLOPE_FORM);
        question.checkCorrectAnswer(expected, preview, 0, true);
      });
    });
  });
});
