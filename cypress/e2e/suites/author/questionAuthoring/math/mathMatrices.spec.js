import { math } from "@edulastic/constants";
import MathMatricesPage from "../../../../framework/author/itemList/questionType/math/mathMatricesPage";
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import FileHelper from "../../../../framework/util/fileHelper";
import EditToolBar from "../../../../framework/author/itemList/questionType/common/editToolBar";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Math with matrices" type question`, () => {
  const queData = {
    mockString: "10-5+8-4",
    group: "Math",
    queType: "Math with matrices",
    extlink: "www.testdomain.com",
    testText: "testtext",
    formula: "s=ar^2",
    answer: {
      value: "1234",
      ariaLabel: "test"
    },

    keyboardType: {
      value: "matrices",
      label: "Matrices"
    },
    decimalSeparators: ["Dot", "Comma"],
    thousandsSeparators: ["Space", "Dot", "Comma"]
  };

  const question = new MathMatricesPage();
  const editItem = new EditItemPage();
  const itemList = new ItemListPage();
  const numpadButtons = question.virtualKeyBoardNumpad;
  const buttons = question.virtualMatrixKeyBoardButtons;
  const { syntaxes, fields, methods } = math;
  const ruleArguments = question.argumentMethods;
  const editToolBar = new EditToolBar();
  let preview;

  before(() => {
    cy.login();
  });

  context(" > User creates question", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();
      // create new que and select type

      editItem.chooseQuestion(queData.group, queData.queType);
    });
    context(" > TC_429 => Enter question text in Compose Question text box", () => {
      it(" > Write text in textbox", () => {
        const { testText } = queData;

        question.checkIfTextExist(testText);
      });

      it(" > give external link", () => {
        const { testText } = queData;
        question
          .getComposeQuestionTextBox()
          .clear()
          .type(testText)
          .then($input => {
            expect($input[0].innerText).to.contain(testText);
          })
          .type("{selectall}");

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
  });

  context(" > TC_411 => Template", () => {
    it(" > Check default template should be Matrices", () => {
      const { label } = queData.keyboardType;

      question
        .getTemplateOutputCY()
        .first()
        .click()
        .then(() => {
          question.getVirtualKeyBoard().should("be.exist");
        });

      question
        .getVirtualKeyBoard()
        .contains(label)
        .should("be.visible");
    });

    it(" > Edit template textarea", () => {
      const { mockString } = queData;
      question.getAnswerMathInputTemplate().then(inputElements => {
        const { length } = inputElements[0].innerText;
        question.getTemplateInput().type("{backspace}".repeat(length || 1), { force: true });
      });
      question.getTemplateOutput().should("have.length", 0);

      question.getTemplateInput().type(mockString, { force: true });
      question.getTemplateOutput().should("have.length", mockString.length);
      question.getTemplateInput().type("{backspace}".repeat(mockString.length), { force: true });
      question.getTemplateOutput().should("have.length", 0);
    });

    it(" > Edit template textarea from virtual keyboard", () => {
      question.getTemplateInput().clear({ force: true });

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
          .contains(label)
          .should("be.visible");
        question.removeLastValue();
      });

      buttons.forEach(({ name, clas, label }) => {
        cy.get(".keyboard")
          .find(`[data-cy="virtual-keyboard-${name}"]`)
          .click();

        if (clas) {
          question
            .getTemplateOutputCY()
            .first()
            .find(clas)
            .should("be.visible");
        } else {
          question
            .getTemplateOutputCY()
            .first()
            .contains(label)
            .should("be.visible");
        }
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
    });
  });

  context(" > TC_412 => Set Correct Answer(s)", () => {
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
    it(" > Testing equivSymbolic method", () => {
      question.setMethod(methods.EQUIV_SYMBOLIC);
      question.setValue(queData.answer.value);
      question
        .getAnswerValueMathOutput()
        .last()
        .should("have.length", 1);
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

  context(" > TC_413 => Preview Items", () => {
    it(" > Click on preview", () => {
      preview = editItem.header.preview();
      question.getBody().contains("span", "Check Answer");

      question.getAnswerMathTextArea().typeWithDelay(queData.answer.value);
    });

    it(" > Click on Check answer", () => {
      preview
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
      preview
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

  context(" > TC_415 => Save question", () => {
    it(" > Click on save button", () => {
      question.header.save();
      cy.url().should("contain", "item-detail");
    });
  });
});
