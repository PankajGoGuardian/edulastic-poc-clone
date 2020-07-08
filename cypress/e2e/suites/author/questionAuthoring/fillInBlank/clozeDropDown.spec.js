import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import ClozeDropDownPage from "../../../../framework/author/itemList/questionType/fillInBlank/clozeWithDropDownPage";
import FileHelper from "../../../../framework/util/fileHelper";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import { SCORING_TYPE } from "../../../../framework/constants/questionAuthoring";
import { queColor, questionType } from "../../../../framework/constants/questionTypes";
import validateSolutionBlockTests from "../../../../framework/author/itemList/questionType/common/validateSolutionBlockTests.js";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Cloze with Drop Down" type question`, () => {
  const queData = {
    group: "Fill in the Blanks",
    queType: questionType.CLOZE_DROP_DOWN,
    queText: "Select the correct option?",
    template: " is the world's largest democracy",
    correctAns: "India",
    choices: ["China", "India"],
    forScoringChoices: [["China", "India"], ["Europe", "Asia"]],
    forShuffleChoices: [["China", "India", "Dubai", "America"], ["Europe", "Asia", "Africa", "Australia"]],
    forScoringCorrectAns: ["China", "Asia"],
    forScoringAltAns: ["India", "Asia"],
    extlink: "www.testdomain.com",
    testtext: "testtext",
    formula: "s=ar^2"
  };

  const question = new ClozeDropDownPage();
  const editItem = new EditItemPage();
  const itemList = new ItemListPage();
  let preview;

  let testItemId;

  before(() => {
    cy.login();
  });

  context(" > Create basic question and validate.", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();
      // add new question
      editItem.chooseQuestion(queData.group, queData.queType);
    });

    context(" > [clz_dropdown_s1] : user create basic question with default option and save", () => {
      it("> Write text in textbox", () => {
        // enter question
        question
          .getQuestionEditor()
          .click()
          .type("{selectall}{backspace}", { force: true })
          .type(queData.queText)
          .should("have.text", queData.queText)
          .click();
      });

      it("> Add choices to the question", () => {
        question.getQuestionEditor().click();
        // response1
        question.editToolBar.textDropDown().click();
        // add choice option for response
        queData.choices.forEach((ch, index) => {
          question.addNewChoiceByResponseIndex(0);
          question
            .getChoiceByIndexAndResponseIndex(0, index)
            .clear()
            .type(ch)
            .should("have.value", ch);
        });
      });

      it("> Set Correct Answer and save question", () => {
        // set correct ans
        question.setChoiceForResponseIndex(0, queData.correctAns);
        // save question
        question.header.save();
      });
    });

    context(" > [clz_dropdown_s2] : preview and validate with right/wrong ans", () => {
      before("Navigate to Preview Page", () => {
        preview = editItem.header.preview();
      });

      it("> enter right answer and validate check answer", () => {
        question.setChoiceForResponseIndex(0, queData.correctAns);
        preview.checkScore("1/1");
        question.getResponseOnPreviewByIndex(1).should("have.css", "background-color", queColor.LIGHT_GREEN);
        preview
          .getClear()
          .click()
          .then(() => {
            cy.get(".right .wrong").should("have.length", 0);
          });
      });

      it("> enter wrong answer and validate check answer", () => {
        question.setChoiceForResponseIndex(0, queData.choices[0]);
        preview.checkScore("0/1");
        question.getResponseOnPreviewByIndex(1).should("have.css", "background-color", queColor.LIGHT_RED);
      });

      it("> click on Show Answers", () => {
        preview
          .getShowAnswer()
          .click()
          .then(() => {
            question
              .getShowAnsBoxOnPreview()
              .contains(queData.correctAns)
              .should("be.visible");
          });
      });

      it("> Click on Clear", () => {
        preview
          .getClear()
          .click()
          .then(() => {
            cy.get('[data-cy="answer-box"]').should("have.length", 0);
          });
        cy.get("body")
          .children()
          .should("not.contain", "Correct Answer");
      });
    });

    context(" > [clz_dropdown_s3] : Verify shuffle Option and delete choices with multiple response boxes", () => {
      before("Add Multiple Response box and choices", () => {
        question.header.edit();
        question
          .getQuestionEditor()
          .click()
          .type("{selectall}{backspace}", { force: true })
          .type(queData.queText)
          .should("have.text", queData.queText)
          .click();
        // response1
        question.editToolBar.textDropDown().click();
        // response2
        question.editToolBar.textDropDown().click();

        queData.forShuffleChoices.forEach((resp, respIndex) => {
          resp.forEach((ch, index) => {
            question.addNewChoiceByResponseIndex(respIndex);
            question
              .getChoiceByIndexAndResponseIndex(respIndex, index)
              .clear()
              .type(ch);
          });
        });
      });

      it("> Check/Uncheck Shuffle Option", () => {
        // check shuffle option
        question.getShuffleOptionCheck().click();
        question
          .getShuffleOptionCheck()
          .find("input")
          .should("be.checked");
        question.header.preview();
        queData.forShuffleChoices.forEach((resp, respIndex) => {
          question.verifyShuffleChoices(respIndex, resp);
        });
        question.header.edit();
        // uncheck shuffle option
        question.getShuffleOptionCheck().click();
        question
          .getShuffleOptionCheck()
          .find("input")
          .should("not.checked");
        question.header.preview();
        queData.forShuffleChoices.forEach((resp, respIndex) => {
          question.verifyShuffleChoices(respIndex, resp, false);
        });
      });

      it("> Delete All Choices", () => {
        question.header.edit();
        queData.forShuffleChoices.forEach((resp, respIndex) => {
          let lengthOfresp = resp.length;
          for (let i = 0; i < resp.length; i++) {
            question.deleteChoices(respIndex, --lengthOfresp);
          }
          resp.forEach((ch, index) => {
            question.checkAnsChoicesLength(respIndex, ch.length, 0);
          });
        });
      });
    });
  });

  context(" > Scoring Block test", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();
      // add new question
      editItem.chooseQuestion(queData.group, queData.queType);
      question
        .getQuestionEditor()
        .click()
        .type("{selectall}{backspace}", { force: true })
        .type(queData.queText)
        .should("have.text", queData.queText);
      question.getQuestionEditor().click();
      // response1
      question.editToolBar.textDropDown().click();
      // response2
      question.editToolBar.textDropDown().click();
      // add choice option for responses
      queData.forScoringChoices.forEach((resp, respIndex) => {
        resp.forEach((ch, index) => {
          question.addNewChoiceByResponseIndex(respIndex);
          question
            .getChoiceByIndexAndResponseIndex(respIndex, index)
            .clear()
            .type(ch);
        });
      });
    });

    it(" > [clz_dropdown_scoring]: Test score with partial match", () => {
      preview.header.edit();
      queData.forScoringCorrectAns.forEach((ans, index) => {
        question.setChoiceForResponseIndex(index, ans);
      });
      question.clickOnAdvancedOptions();
      question.selectScoringType(SCORING_TYPE.PARTIAL);
      question.updatePoints(4);
      preview = question.header.preview();
      question.setChoiceForResponseIndex(0, queData.forScoringChoices[0][0]);
      question.setChoiceForResponseIndex(1, queData.forScoringChoices[1][0]);
      preview.checkScore("2/4");
      preview
        .getClear()
        .click()
        .then(() => {
          cy.get('[data-cy="answer-box"]').should("have.length", 0);
        });
      question.setChoiceForResponseIndex(0, queData.forScoringChoices[0][1]);
      question.setChoiceForResponseIndex(1, queData.forScoringChoices[1][1]);
      preview.checkScore("2/4");
    });

    it(" > [clz_dropdown_scoring]: Test score with partial match and Round Down", () => {
      question.header.edit();
      question.clickOnAdvancedOptions();
      question.selectScoringType(SCORING_TYPE.PARTIAL);
      question.selectRoundingType("Round down");
      question.updatePoints(5);
      preview = question.header.preview();
      question.setChoiceForResponseIndex(0, queData.forScoringChoices[0][0]);
      question.setChoiceForResponseIndex(1, queData.forScoringChoices[1][0]);
      preview.checkScore("2/5");
      preview
        .getClear()
        .click()
        .then(() => {
          cy.get('[data-cy="answer-box"]').should("have.length", 0);
        });
      question.header.edit();
      question.selectRoundingType("None");
      preview = question.header.preview();
      question.setChoiceForResponseIndex(0, queData.forScoringChoices[0][1]);
      question.setChoiceForResponseIndex(1, queData.forScoringChoices[1][1]);
      preview.checkScore("2.5/5");
    });

    it(" > [clz_dropdown_scoring]: Test score with alternate answer", () => {
      preview.header.edit();
      queData.forScoringCorrectAns.forEach((ans, index) => {
        question.setChoiceForResponseIndex(index, ans);
      });
      question.updatePoints(1);
      question.addAlternate();
      queData.forScoringAltAns.forEach((ans, index) => {
        question.setChoiceForResponseIndex(index, ans);
      });
      question.selectScoringType(SCORING_TYPE.EXACT);
      preview = question.header.preview();
      question.setChoiceForResponseIndex(0, queData.forScoringChoices[0][1]);
      question.setChoiceForResponseIndex(1, queData.forScoringChoices[1][1]);
      preview.checkScore("1/1");
      preview.header.edit();
      question.updatePoints(2);
      preview = question.header.preview();
      question.setChoiceForResponseIndex(0, queData.forScoringChoices[0][1]);
      question.setChoiceForResponseIndex(1, queData.forScoringChoices[1][1]);
      preview.checkScore("1/2");
      preview
        .getClear()
        .click()
        .then(() => {
          cy.get('[data-cy="answer-box"]').should("have.length", 0);
        });
      question.setChoiceForResponseIndex(0, queData.forScoringChoices[0][1]);
      question.setChoiceForResponseIndex(1, queData.forScoringChoices[1][0]);
      preview.checkScore("0/2");
    });

    it(" > [clz_dropdown_scoring]: Test score with alternate answer, partial match and penalty", () => {
      preview.header.edit();
      question.clickOnAdvancedOptions();
      question.selectScoringType(SCORING_TYPE.PARTIAL);
      question
        .getPanalty()
        .clear()
        .type(2);
      question.updatePoints(4);
      question.getAlternates().click();
      question.updatePoints(6);
      preview = question.header.preview();
      question.setChoiceForResponseIndex(0, queData.forScoringChoices[0][0]);
      question.setChoiceForResponseIndex(1, queData.forScoringChoices[1][0]);
      preview.checkScore("0/6");
      preview
        .getClear()
        .click()
        .then(() => {
          cy.get('[data-cy="answer-box"]').should("have.length", 0);
        });
      question.setChoiceForResponseIndex(0, queData.forScoringChoices[0][1]);
      question.setChoiceForResponseIndex(1, queData.forScoringChoices[1][0]);
      preview.checkScore("1/6");
    });

    it(" > [clz_dropdown_scoring]: Test score with alternate answer, partial match, Round Down and penalty", () => {
      preview.header.edit();
      question.clickOnAdvancedOptions();
      question.selectScoringType(SCORING_TYPE.PARTIAL);
      question
        .getPanalty()
        .clear()
        .type(1.5);
      question.selectRoundingType("Round down");
      question.updatePoints(4);
      question.getAlternates().click();
      question.updatePoints(6);
      preview = question.header.preview();
      question.setChoiceForResponseIndex(0, queData.forScoringChoices[0][1]);
      question.setChoiceForResponseIndex(1, queData.forScoringChoices[1][0]);
      preview.checkScore("1/6");
    });
  });

  validateSolutionBlockTests(queData.group, queData.queType);

  //TODO - Display Block Testing
});
