/// <reference types="Cypress"/>

import { math } from "@edulastic/constants";
import MathFractionPage from "../../../../framework/author/itemList/questionType/math/mathFractionPage";
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import FileHelper from "../../../../framework/util/fileHelper";
import EditToolBar from "../../../../framework/author/itemList/questionType/common/editToolBar";
import PreviewItemPage from "../../../../framework/author/itemList/itemDetail/previewPage";

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
        input: "1\\div3",
        expected: "0.33",
        decimalPlaces: 2
      },
      compareSides: {
        expected: "4+5=9",
        input: "4+5=9"
      },
      tolerance: {
        input: "10",
        expected: "8.5",
        tolerance: "±1.5"
      },
      decimalMarks: {
        expected: "25"
      }
    }
  };
  const question = new MathFractionPage();
  const editItem = new EditItemPage();
  const numpadButtons = question.virtualKeyBoardNumpad;
  const buttons = question.virtualKeyBoardButtons;
  const { syntaxes, fields, methods } = math;
  const ruleArguments = question.argumentMethods;
  const editToolBar = new EditToolBar();
  const [fraction, numrator, denominator] = [".mq-fraction", ".mq-numerator", ".mq-denominator"];
  const preview = new PreviewItemPage();

  before(() => {
    cy.setToken();
  });

  context("User creates question", () => {
    before("visit items page and select question type", () => {
      editItem.getItemWithId();
      editItem.deleteAllQuestion();
      // create new que and select type
      editItem.addNew().chooseQuestion(queData.group, queData.queType);
    });

    context("Tc_443 => Enter question text in Compose Question text box", () => {
      it("Write text in textbox", () => {
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

      it("Upload image to server", () => {
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

    context("TC_444 => Template", () => {
      it("Check default template should be fraction", () => {
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

      it("Edit template textarea", () => {
        question.getTemplateInput().type(queData.mockString, { force: true });
        question.getTemplateOutput().should("have.length", queData.mockString.length + 1);
        question.getTemplateInput().type("{backspace}".repeat(queData.mockString.length), { force: true });
        question.getTemplateOutput().should("have.length", 1);
      });

      it("Edit template textarea from virtual keyboard", () => {
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

    context("Tc_445 => Set Correct Answer(s)", () => {
      it("Update Points", () => {
        question
          .getPointsInput()
          .click({ force: true })
          .verifyNumInput(1);
      });
      it("Add and remove new method", () => {
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
      it("Change answer methods", () => {
        Object.values(methods).forEach(item => {
          question.setMethod(item);
          question.getMethodSelectionDropdow().contains("div", item);
        });
      });
      it("Testing equivSymbolic method options", () => {
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

  context("Validate different evaluation methods", () => {
    before("visit items page and select question type", () => {
      editItem.getItemWithId();
      editItem.deleteAllQuestion();
      // create new que and select type
      editItem.addNew().chooseQuestion(queData.group, queData.queType);
      question.clearAnswerValueInput(4);
      question.getTemplateInput().type("{del}".repeat(4), { force: true });
      question.getComposeQuestionTextBox().click();
    });

    context("TC_446 => equivSymbolic method", () => {
      before("Change to equivSymbolic method", () => {
        question.setMethod(methods.EQUIV_SYMBOLIC);
      });

      beforeEach("Go to Edit Mode", () => {
        editItem.header.edit();
        question.clearAnswerValueInput(10);
      });

      it("Testing with basic value", () => {
        const { input, expected } = queData.equivSymbolic.value;
        question.enterAnswerValueMathInput(input);
        question.checkCorrectAnswer(expected, preview, input.length, true, true, "1/1");
      });
      it("Testing with ignore text", () => {
        const { input, expected } = queData.equivSymbolic.ignoreText;
        question.enterAnswerValueMathInput(input);
        question.getAnswerIgnoreTextCheckox().check({ force: true });

        question.checkCorrectAnswer(expected, preview, input.length, true);

        question.getAnswerIgnoreTextCheckox().uncheck({ force: true });
      });
      /* 
      it("Testing with Euler's number", () => {
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
      it("Testing with compare sides", () => {
        const { input, expected } = queData.equivSymbolic.compareSides;
        question.enterAnswerValueMathInput(input);
        question.getAnswerCompareSides().check({ force: true });

        question.checkCorrectAnswer(expected, preview, input.length, true);

        question.getAnswerCompareSides().uncheck({ force: true });
      });
      it("Testing with decimal separator - Comma", () => {
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
      it("Testing with thousands separators - Space and Comma", () => {
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
      it("Testing with significant decimal '3'", () => {
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
      it("Testing with significant decimal '3' and ignore text", () => {
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
      it("Testing with multiple thousand separators", () => {
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

    context("TC_447 => equivLiteral method", () => {
      before("Set method to equivLiteral", () => {
        question.setMethod(methods.EQUIV_LITERAL);
      });

      beforeEach("Go to Edit Mode", () => {
        editItem.header.edit();
        question.clearAnswerValueInput(10);
      });

      it("Testing simple fractions value", () => {
        const { input, expected } = queData.equivLiteral.simpleFractions;
        question.enterAnswerValueMathInput(input);
        // incorrect
        question.checkCorrectAnswer(expected, preview, 0, false);
        // correct
        question.checkCorrectAnswer(input, preview, input.length, true);
      });

      it("Testing with allow Interval", () => {
        const { input, expected } = queData.equivLiteral.allowInterval;
        question.enterAnswerValueMathInput(input);
        question.getAnswerAllowInterval().check({ force: true });
        question.checkCorrectAnswer(expected, preview, input.length, true);
        question.getAnswerIgnoreCoefficientOfOne().uncheck({ force: true });
      });

      it("Testing with ignoring order", () => {
        const { input, expected } = queData.equivLiteral.ignoreOrder;
        question.enterAnswerValueMathInput(input);
        question.getAnswerIgnoreOrder().check({ force: true });

        question.checkCorrectAnswer(expected, preview, input.length, true);

        question.getAnswerIgnoreOrder().uncheck({ force: true });
      });

      it("Testing  with ignore trailing zeros", () => {
        const { input, expected } = queData.equivLiteral.ignoreTrailingZeros;
        question.getAnswerIgnoreTrailingZeros().check({ force: true });
        question.enterAnswerValueMathInput(input);
        expected.forEach((item, index) => {
          question.checkCorrectAnswer(item, preview, index === 0 ? 0 : input.length, true);
        });
        question.getAnswerIgnoreTrailingZeros().uncheck({ force: true });
      });

      it("Testing with ignore coefficient of 1", () => {
        const { input, expected } = queData.equivLiteral.ignoreCoefficientOfOne;
        question.enterAnswerValueMathInput(input);
        question.getAnswerIgnoreCoefficientOfOne().check({ force: true });

        question.checkCorrectAnswer(expected, preview, input.length, true);

        question.getAnswerIgnoreCoefficientOfOne().uncheck({ force: true });
      });

      it("Testing inverse result", () => {
        const { input, expected } = queData.equivLiteral.inverseResult;
        question.enterAnswerValueMathInput(input);
        question.getAnswerInverseResult().check({ force: true });

        question.checkCorrectAnswer(expected, preview, input.length, false);

        question.getAnswerInverseResult().uncheck({ force: true });
      });

      it("Testing with decimal separator - Comma", () => {
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

      it("Testing with thousands separators - Comma, Space", () => {
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
  });
});
