import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import ClozeWithTextPage from "../../../../framework/author/itemList/questionType/fillInBlank/clozeWithTextPage";
import FileHelper from "../../../../framework/util/fileHelper";
import ScoringBlock from "../../../../framework/author/itemList/questionType/common/scoringBlock";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import { SCORING_TYPE } from "../../../../framework/constants/questionAuthoring";
import { queColor } from "../../../../framework/constants/questionTypes";
describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Cloze with Text" type question`, () => {
  const queData = {
    group: "Fill in the Blanks",
    queType: "Cloze with Text",
    queText: "Fill in the blanks?",
    template: "Enter the capital of india = ",
    correctAns: "NEW DELHI",
    forScoringCorrectAns: ["test1", "test2"],
    forScoringAltAns: ["alt1", "test2"],
    extlink: "www.testdomain.com",
    testtext: "testtext",
    formula: "s=ar^2"
  };

  const scoringBlock = new ScoringBlock();
  const question = new ClozeWithTextPage();
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

    it(" > [clz_txt_s1] : user create question with default option and save", () => {
      // enter question
      question
        .getQuestionEditor()
        .clear()
        .type(queData.queText)
        .should("have.text", queData.queText);

      question.getQuestionEditor().click();
      // text input
      question.editToolBar.textInput().click();
      // set ans
      question.getResponseBoxByIndex(0).type(queData.correctAns);
      // save que
      question.header.save();
    });

    it(" > [clz_txt_s2] : preview and validate with right/wrong ans", () => {
      preview = editItem.header.preview();
      // enter right ans
      question.getResponseBoxByIndex(0).type(queData.correctAns);

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.checkScore("1/1");

          question.getResponseOnPreview(0).should("have.css", "background-color", queColor.LIGHT_GREEN);
        });

      preview
        .getClear()
        .click()
        .then(() => {
          question.getResponseBoxByIndex(0).should("have.css", "background-color", queColor.WHITE);
        });

      // enter wrong ans
      question.getResponseBoxByIndex(0).type(queData.testtext);

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.checkScore("0/1");
          question.getResponseOnPreview(0).should("have.css", "background-color", queColor.LIGHT_RED);
        });

      preview
        .getClear()
        .click()
        .then(() => {
          question.getResponseBoxByIndex(0).should("have.css", "background-color", queColor.WHITE);
        });

      // show ans
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
    });

    afterEach(() => {
      preview = question.header.preview();

      preview
        .getClear()
        .click()
        .then(() => {
          question.header.edit();
          // question.clickOnAdvancedOptions();
        });
    });

    it(" > test score with alternate answer", () => {
      queData.forScoringCorrectAns.forEach((ans, index) => {
        question
          .getResponseBoxByIndex(index)
          .clear()
          .type(ans)
          .should("have.value", ans);
      });

      question.getPoints().type("{selectall}8");

      question.addAlternate();

      question.getPoints().type("{selectall}4");

      queData.forScoringAltAns.forEach((ans, index) => {
        question
          .getResponseBoxByIndex(index)
          .type(ans)
          .should("have.value", ans);
      });

      preview = question.header.preview();

      queData.forScoringAltAns.forEach((ans, index) => {
        question
          .getResponseBoxByIndex(index)
          .type(ans)
          .should("have.value", ans);
      });

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.checkScore("4/8");
        });
    });

    /*  it(" > test score with min score if attempted", () => {
      scoringBlock.getEnableAutoScoring().click();

      scoringBlock
        .getMinScore()
        .clear()
        .type(2);

      preview = question.header.preview();

      question.getResponseBoxByIndex(0).type("incorrect1");
      question.getResponseBoxByIndex(1).type("incorrect2");

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.getAntMsg().should("contain", "score: 2/8");
        });
    });
 */
    it(" > test score with partial match and penalty", () => {
      question.clickOnAdvancedOptions();
      scoringBlock.selectScoringType(SCORING_TYPE.PARTIAL);
      scoringBlock.getPanalty().type("{selectall}2");

      preview = question.header.preview();

      question.getResponseBoxByIndex(0).type("incorrect1");
      question.getResponseBoxByIndex(1).type(queData.forScoringAltAns[1]);

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.checkScore("2/8");
        });
    });

    /* it(" > test score with max score", () => {
      scoringBlock.selectScoringType("Exact match");

      scoringBlock.getEnableAutoScoring().click();

      scoringBlock
        .getMaxScore()
        .clear()
        .type(1);

      preview = question.header.preview();

      question.getResponseBoxByIndex(0).type("incorrect1");
      question.getResponseBoxByIndex(1).type(queData.forScoringAltAns[1]);

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.getAntMsg().should("contain", "score: 0/10");
        });
    }); */
  });
});
