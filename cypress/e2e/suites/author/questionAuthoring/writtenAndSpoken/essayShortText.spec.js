import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import EssayShortTextPage from "../../../../framework/author/itemList/questionType/writtenAndSpoken/essayShortTextPage";
import FileHelper from "../../../../framework/util/fileHelper";
import Helpers from "../../../../framework/util/Helpers";
import validateSolutionBlockTests from "../../../../framework/author/itemList/questionType/common/validateSolutionBlockTests";
import { queColor, questionType } from "../../../../framework/constants/questionTypes";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Short text" type question`, () => {
  const queData = {
    group: "Writing",
    queType: questionType.ESSAY_SHORT,
    queText: "What is the capital of India?",
    extlink: "www.testdomain.com",
    testtext: "testtext",
    correct: "New Delhi",
    altAns: "India",
    testChoices: ["testNew Delhi123", "testIndia123"],
    placeHolder: "Placeholder Text",
    formula: "s=ar^2",
    inputTypes: ["number", "text"],
    fontSize: ["normal", "large", "xlarge", "xxlarge"]
  };

  const ALLOW_METHOD = { exact: "Exact Match", partial: "Any text containing" };
  const question = new EssayShortTextPage();
  const editItem = new EditItemPage();
  let preview;

  before(() => {
    cy.login();
  });

  context(" > User creates question.", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();
      // create new que and select type
      editItem.chooseQuestion(queData.group, queData.queType);
    });

    context(" > [essay_short_s1] =>  Create question and save.", () => {
      it(" > user create question with default option", () => {
        // temporialy visiting preview page in order to question editor box in edit page
        question.header.preview();
        question.header.edit();
        question
          .getQuestionEditor()
          .type(queData.queText)
          .should("have.text", queData.queText);
        question.getCorrectValue().type(queData.correct);
      });

      it(" > Update Points and save", () => {
        question.updatePoints(5);
        question.header.save();
      });
    });

    context(" > [essay_short_s2] => preview and validate with right/wrong ans", () => {
      before("Navigate to Preview Page", () => {
        preview = editItem.header.preview();
      });

      it("> enter right answer and validate check answer", () => {
        question.getAnswerBox().type(queData.correct);
        preview.checkScore("5/5");
        question.getAnswerBox().should("have.css", "background-color", queColor.LIGHT_GREEN);
        preview.getClear().click();
      });

      it("> enter wrong answer and validate check answer", () => {
        question.getAnswerBox().type("wrong answer");
        preview.checkScore("0/5");
        question.getAnswerBox().should("have.css", "background-color", queColor.LIGHT_RED);
      });

      it("> click on Show Answers", () => {
        preview
          .getShowAnswer()
          .click({ force: true })
          .then(() => {
            question
              .getShowAnswerContainer()
              .contains(queData.correct)
              .should("be.visible");
          });
      });

      it("> Click on Clear", () => {
        preview.getClear().click();
        cy.get("body")
          .children()
          .should("not.contain", "Correct Answer");
      });
    });

    context(" > [essay_short_s3] => Scoring Block test", () => {
      context(" Verify Scoring with only correct answer", () => {
        it(" > test scoring with correct answer - exact match option", () => {
          question.header.edit();
          question.selectAllowMethod(ALLOW_METHOD.exact);

          question.header.preview();
          question.getAnswerBox().type(queData.correct);
          preview.checkScore("5/5");
          question.getAnswerBox().should("have.css", "background-color", queColor.LIGHT_GREEN);
          preview.getClear().click();

          // verify wrong ans (pass text containing alternative answer)
          question.getAnswerBox().type(queData.testChoices[0]);
          preview.checkScore("0/5");
          question.getAnswerBox().should("have.css", "background-color", queColor.LIGHT_RED);
          preview.getClear().click();
        });

        it(" > validate ans with Any Text Containing option", () => {
          question.header.edit();
          question.selectAllowMethod(ALLOW_METHOD.partial);
          question.header.preview();
          question.getAnswerBox().type(queData.testChoices[0]);
          preview.checkScore("5/5");
          question.getAnswerBox().should("have.css", "background-color", queColor.LIGHT_GREEN);
          preview.getClear().click();
        });
      });

      context(" Verify Scoring with Alternative answer", () => {
        before("set alternative answer and update points", () => {
          question.header.edit();
          question.updatePoints(5);
        });

        it(" > test scoring with alternative answer -exact match option", () => {
          question.header.edit();
          question.selectAllowMethod(ALLOW_METHOD.exact);
          question.getAddAlternative().click();
          question.getAddedAlternateTab().click();
          question.getCorrectValue().type(queData.altAns);
          question.updatePoints(3);
          preview = editItem.header.preview();
          question.getAnswerBox().type(queData.altAns);
          preview.checkScore("3/5");
          question.getAnswerBox().should("have.css", "background-color", queColor.LIGHT_GREEN);
          preview.getClear().click();

          // verify wrong ans (pass text containing alternative answer)
          question.getAnswerBox().type(queData.testChoices[1]);
          preview.checkScore("0/5");
          question.getAnswerBox().should("have.css", "background-color", queColor.LIGHT_RED);
          preview.getClear().click();
        });

        it(" > delete alt ans and test scoring with alternative answer -Any Text Containing option", () => {
          question.header.edit();
          question.deleteAlternativeAnswer().click();
          question.selectAllowMethod(ALLOW_METHOD.partial);
          question.getAddAlternative().click();
          question.getAddedAlternateTab().click();
          question.getCorrectValue().type(queData.altAns);
          question.updatePoints(3);
          question.header.preview();
          question.getAnswerBox().type(queData.testChoices[1]);
          preview.checkScore("3/5");
          question.getAnswerBox().should("have.css", "background-color", queColor.LIGHT_GREEN);
          preview.getClear().click();
        });
      });
    });

    context(" > [essay_short_s4] => Display Block test", () => {
      it(" > Verify Input type", () => {
        queData.inputTypes.forEach(value => {
          question.header.edit();
          question.clickOnAdvancedOptions();
          question.selectInputType(value);
          question.header.preview();
          question.getAnswerBox().should("have.attr", "type", value);
        });
      });

      it(" > Verify placeholder added", () => {
        question.header.edit();
        question.clickOnAdvancedOptions();
        question.getPlaceholderOption().type(queData.placeHolder);
        question.header.preview();
        question.getAnswerBox().should("have.attr", "placeholder", queData.placeHolder);
      });

      it(" > verify browser spellcheck", () => {
        question.header.edit();
        // check option
        question.getBrowserSpellCheckOption().click({ force: true });
        question.getBrowserSpellCheckOption().should("be.checked");
        question.header.preview();
        question.getAnswerBox().should("have.attr", "spellcheck", "true");

        // uncheck option
        question.header.edit();
        question.getBrowserSpellCheckOption().click({ force: true });
        question.getBrowserSpellCheckOption().should("not.be.checked");
        question.header.preview();
        question.getAnswerBox().should("have.attr", "spellcheck", "false");
      });

      it(" > Verify Special Characters", () => {
        question.header.edit();
        question.getSpecialCharactersOption().click({ force: true });
        question.getSpecialCharactersOption().should("be.checked");
        question.getSpecialCharacterInput().type("&");
        question.header.preview();
        question.selectSpecialCharacterInPreview("&");
      });

      it(" > Verify Font size", () => {
        queData.fontSize.forEach(value => {
          question.header.edit();
          const { name, font } = Helpers.fontSize(value);
          question.selectFont(value);
          question.getFontSizeSelect().should("contain", name);
          question.checkFontSize(font);
        });
      });
    });

    validateSolutionBlockTests(queData.group, queData.queType);
  });
});
