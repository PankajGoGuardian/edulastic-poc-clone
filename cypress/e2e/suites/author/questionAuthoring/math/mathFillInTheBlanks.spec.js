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
    }
  };
  const question = new MathFillInTheBlanksPage();
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
          .getAnswerMathInputField()
          .find("[mathquill-block-id]")
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
  });
});
