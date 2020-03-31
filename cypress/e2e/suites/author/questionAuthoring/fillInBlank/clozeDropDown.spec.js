import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import ClozeDropDownPage from "../../../../framework/author/itemList/questionType/fillInBlank/clozeWithDropDownPage";
import FileHelper from "../../../../framework/util/fileHelper";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import { SCORING_TYPE } from "../../../../framework/constants/questionAuthoring";
import { queColor } from "../../../../framework/constants/questionTypes";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Cloze with Drop Down" type question`, () => {
  const queData = {
    group: "Fill in the Blanks",
    queType: "Cloze with Drop Down",
    queText: "Select the correct option?",
    template: " is the world's largest democracy",
    correctAns: "India",
    choices: ["China", "India"],
    forScoringChoices: [["China", "India"], ["Europe", "Asia"]],
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

    it(" > [clz_dropdown_s1] : user create basic question with default option and save", () => {
      // enter question
      question
        .getQuestionEditor()
        .click()
        .type("{selectall}{backspace}", { force: true })
        .type(queData.queText)
        .should("have.text", queData.queText)
        .click();

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

      // set correct ans
      question.setChoiceForResponseIndex(0, queData.correctAns);

      // save que
      question.header.save();
    });

    it(" > [clz_dropdown_s2] : preview and validate with right/wrong ans", () => {
      preview = editItem.header.preview();
      // enter right ans and validate
      question.setChoiceForResponseIndex(0, queData.correctAns);
      preview.checkScore("1/1");
      question.getResponseOnPreviewByIndex(1).should("have.css", "background-color", queColor.LIGHT_GREEN);

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get(".right .wrong").should("have.length", 0);
        });
      // enter wrong ans and validate
      question.setChoiceForResponseIndex(0, queData.choices[0]);

      preview.checkScore("0/1");

      question.getResponseOnPreviewByIndex(1).should("have.css", "background-color", queColor.LIGHT_RED);

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get('[data-cy="answer-box"]').should("have.length", 0);
        });
      // show ans and verify
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

    afterEach(() => {
      preview = question.header.preview();

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get('[data-cy="answer-box"]').should("have.length", 0);
          preview.header.edit();
        });
    });

    it(" > [clz_dropdown_scoring]: Test score with alternate answer", () => {
      queData.forScoringCorrectAns.forEach((ans, index) => {
        question.setChoiceForResponseIndex(index, ans);
      });

      question.addAlternate();

      queData.forScoringAltAns.forEach((ans, index) => {
        question.setChoiceForResponseIndex(index, ans);
      });

      preview = question.header.preview();

      question.setChoiceForResponseIndex(0, queData.forScoringChoices[0][1]);
      question.setChoiceForResponseIndex(1, queData.forScoringChoices[1][1]);

      preview.checkScore("1/1");

      preview.header.edit();

      question
        .getPoints()
        .clear()
        .type("{selectall}2");

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

    /*  it(" > [clz_dropdown_scoring]: Test score with min score if attempted", () => {
      question.getEnableAutoScoring().click();

      question.getMinScore().type(2);

      preview = question.header.preview();

      question.setChoiceForResponseIndex(0, queData.forScoringChoices[0][1]);
      question.setChoiceForResponseIndex(1, queData.forScoringChoices[1][0]);

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.getAntMsg().should("contain", "score: 2/2");
        });
    }); */

    it(" > [clz_dropdown_scoring]: Test score with partial match and penalty", () => {
      // question.getMinScore().clear();
      question.clickOnAdvancedOptions();
      question.getPanalty().type(2);
      question.selectScoringType(SCORING_TYPE.PARTIAL);
      question.getPoints().type("{selectall}4");
      question.getAlternates().click();
      question.getPoints().type("{selectall}6");
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

    /*  it(" > [clz_dropdown_scoring]: Test score with max score", () => {
      question.getEnableAutoScoring().click();

      question
        .getMaxScore()
        .clear()
        .type(1);

      preview = question.header.preview();

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.getAntMsg().should("contain", "score: 0/10");
        });
    }); */
  });
});
