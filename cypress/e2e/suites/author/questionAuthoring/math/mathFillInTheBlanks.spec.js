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
      }
    }
  };
  const question = new MathFillInTheBlanksPage();
  const editItem = new EditItemPage();
  const { syntaxes, fields, methods } = math;
  const editToolBar = new EditToolBar();
  const preview = new PreviewItemPage();

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
        question
          .getComposeQuestionTextBox()
          .clear()
          .type(queData.testtext)
          .then($input => {
            console.log("$input", $input[0].innerText);
            expect($input[0].innerText).to.contain(queData.testtext);
          });
      });

      it("give external link", () => {
        question
          .getComposeQuestionTextBox()
          .clear()
          .type(queData.testtext)
          .then($input => {
            expect($input[0].innerText).to.contain(queData.testtext);
          })
          .type("{selectall}");
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
        question
          .getComposeQuestionTextBox()
          .clear()
          .type(queData.testtext)
          .then($input => {
            expect($input[0].innerText).to.contain(queData.testtext);
          })
          .clear();
      });
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
            .type("{rightarrow}".repeat(length), { force: true })
            .type(input, { force: true });
        });
        question.setValue(input);
        question.checkCorrectAnswerWithResponse(expected, preview);
      });
      it("Testing check/uncheck Ignore text check box", () => {
        const { input, expected, checkboxValues, isCirrectUnsver } = queData.equivSymbolic.ignoreText;
        question.getMathquillBlockId().then(inputElements => {
          const { length } = inputElements[0].children;
          question.getTemplateInput().type("{del}".repeat(length || 1), { force: true });
        });
        checkboxValues.forEach((checkboxValue, index) => {
          question.setValue(input);
          question.setSeparator(checkboxValue)();
          question.checkCorrectAnswer(expected, preview, input.length, isCirrectUnsver[index]);
        });
      });
      it("Testing with compare sides", () => {
        const { expected, input } = queData.equivSymbolic.compareSides;

        question.setValue(input);
        question.setSeparator("getAnswerCompareSides")();

        question.checkCorrectAnswer(expected, preview, 0, true);
      });
      it("Testing Treat 'e' as Euler's numbe", () => {
        const { expected, input } = queData.equivSymbolic.eulersNumber;

        question.setValue(input);
        question.setSeparator("getAnswerCompareSides")();
        question
          .getAnswerCompareSides()
          .check({ force: true })
          .should("be.checked");
        question.checkCorrectAnswer(expected, preview, input.length, false);
      });

      it("Testing with decimal separator - Comma", () => {
        const { input, expected, separator } = queData.equivSymbolic.setDecimalSeparator;
        question.getAnswerValueMathInput().type(input, { force: true });
        question.setSeparator("getAnswerAllowThousandsSeparator")();
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
          question.checkCorrectAnswer(expected[index], preview, index === 0 ? 0 : input.length, true);
        });
      });

      it("Testing significant decimal places", () => {
        const { input, expected, decimalPlaces } = queData.equivSymbolic.significantDecimal;

        question.setValue(input);
        question
          .getAnswerSignificantDecimalPlaces()
          .clear({ force: true })
          .type("{uparrow}".repeat(decimalPlaces), { force: true });

        question.checkCorrectAnswer(expected, preview, 0, true);
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
    });
  });
});
