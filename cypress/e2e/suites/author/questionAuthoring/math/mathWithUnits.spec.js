import { math } from "@edulastic/constants";
import MathWithUnitsPage from "../../../../framework/author/itemList/questionType/math/mathWithUnitsPage";
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import FileHelper from "../../../../framework/util/fileHelper";
import EditToolBar from "../../../../framework/author/itemList/questionType/common/editToolBar";
import PreviewItemPage from "../../../../framework/author/itemList/itemDetail/previewPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Math – fill in the blanks" type question`, () => {
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
        isCirrectAnsver: [true, false]
      },
      eulersNumber: {
        input: "2.718+2.718=5,436",
        expected: "e+e=5,436"
      },
      setDecimalSeparator: {
        thousand: "Dot",
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
        expected: "4cm+5cm=9cm",
        input: "5cm+4cm=9cm"
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
    }
  };
  const question = new MathWithUnitsPage();
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
      editItem.getItemWithId();
      editItem.deleteAllQuestion();
      // create new que and select type
      editItem.addNew().chooseQuestion(queData.group, queData.queType);
      Cypress.on("uncaught:exception", () => false);
    });

    context("TC_520 => Enter question text in Compose Question text box", () => {
      it("Write text in textbox", () => {
        const { testText } = queData;

        question.checkIfTextExist(testText);
      });

      it("give external link", () => {
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

      it("insert formula", () => {
        const { testText } = queData;

        question.checkIfTextExist(testText).clear();
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

    context("TC_521 => Enter the text/inputs to Template Markup", () => {
      it("On click of template box a latex keyboard should appear", () => {
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

    context("TC_522 => Set Correct Answer(s)", () => {
      it("Update Points", () => {
        question
          .getPointsInput()
          .click({ force: true })
          .verifyNumInput(1);
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

    context("TC_523 => equivSymbolic method", () => {
      beforeEach("Back to create question", () => {
        preview.header.edit();
        question.setMethod(methods.EQUIV_SYMBOLIC);
      });

      it("Testing Value", () => {
        const { input, expected } = queData.equivSymbolic.value;
        question.setValue(input);
        question.checkCorrectAnswerWithResponse(expected, preview, input.length, true);
      });

      it("Testing with compare sides", () => {
        const { expected, input, templateInput } = queData.equivSymbolic.compareSides;
        question.clearTemplateInput();
        question.getTemplateInput().type(templateInput, { force: true });
        question.setResponseInput();

        question.setValue(input);
        question.setSeparator("getAnswerCompareSides")();

        question.checkCorrectAnswerWithResponse(expected, preview, input.length, true);
      });

      it("Testing check/uncheck Ignore text check box", () => {
        const { input, expected, checkboxValues, isCirrectAnsver } = queData.equivSymbolic.ignoreText;

        question.clearTemplateInput();
        question.setResponseInput();

        checkboxValues.forEach((checkboxValue, index) => {
          question.setValue(input);
          question.setSeparator(checkboxValue)();
          question.checkCorrectAnswerWithResponse(expected, preview, input.length, isCirrectAnsver[index]);
        });
      });

      it("Testing Treat 'e' as Euler's numbe", () => {
        const { expected, input } = queData.equivSymbolic.eulersNumber;

        question.setValue(input);
        question.setSeparator("getAnswerCompareSides")();
        question
          .getAnswerCompareSides()
          .check({ force: true })
          .should("be.checked");
        question.checkCorrectAnswerWithResponse(expected, preview, input.length, true);
      });

      it("Testing with decimal separator - Comma", () => {
        const { input, expected, separator, thousand } = queData.equivSymbolic.setDecimalSeparator;
        question.setValue(input);
        question.setSeparator("getAnswerAllowThousandsSeparator")();
        question.setAnswerSetDecimalSeparatorDropdown(separator);
        question.setThousandSeperator(thousand);
        question.checkCorrectAnswerWithResponse(expected, preview, input.length, true);
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

        question.checkCorrectAnswerWithResponse(expected, preview, input.length, true);
      });

      it("Add and remove new method", () => {
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

    context("TC_524 => equivLiteral method", () => {
      beforeEach("Back to create question", () => {
        preview.header.edit();
        question.setMethod(methods.EQUIV_LITERAL);
      });
      it("Testing Value", () => {
        const { input, expected, isCorrectAnswer } = queData.equivLiteral.value;
        question.clearTemplateInput();
        question.setResponseInput();
        question.setValue(input);
        expected.forEach((value, index) =>
          question.checkCorrectAnswerWithResponse(value, preview, 0, isCorrectAnswer[index])
        );
      });

      it("Testing check/uncheck Allow interval check box", () => {
        const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivLiteral.allowInterval;
        question.clearTemplateInput();
        question.checkUncheckChecbox(preview, input, expected, checkboxValues, isCorrectAnswer);
        question.setResponseInput();
      });

      it("Testing check/uncheck Ignore order check box", () => {
        const { input, expected, checkboxValues, isCorrectAnswer } = queData.equivLiteral.ignoreOrder;

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
        const { input, expected, separator, thousand } = queData.equivSymbolic.setDecimalSeparator;
        question.getAnswerValueMathInput().type(input, { force: true });
        question.setSeparator("getAnswerAllowThousandsSeparator")();
        question.setAnswerSetDecimalSeparatorDropdown(separator);
        question.setThousandSeperator(thousand);
        question.checkCorrectAnswerWithResponse(expected, preview, input.length, true);
      });
    });

    context("TC_525 => equivValue method", () => {
      beforeEach("Back to create question", () => {
        preview.header.edit();
        question.setMethod(methods.EQUIV_VALUE);
      });
      it("Testing Value", () => {
        const { input } = queData.equivValue.compareSides;

        question.setValue(input);
        question.checkCorrectAnswerWithResponse(input, preview, input.length, true);
      });
      it("Testing Allow decimal marks", () => {
        const { input, expected, separator, thousand } = queData.equivSymbolic.setDecimalSeparator;
        question.setValue(input);
        question.setSeparator("getAnswerAllowThousandsSeparator")();
        question.setAnswerSetDecimalSeparatorDropdown(separator);
        question.setThousandSeperator(thousand);
        question.checkCorrectAnswerWithResponse(expected, preview, input.length, true);
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

        question.checkCorrectAnswerWithResponse(expected, preview, 0, true);
        question.getAnswerTolerance().clear({ force: true });
      });
    });

    // context("TC_552 => Combination of methods", () => {
    // TODO
    // });
  });
});
