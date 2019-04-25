import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import ClozeWithTextPage from "../../../../framework/author/itemList/questionType/fillInBlank/clozeWithTextPage";
import FileHelper from "../../../../framework/util/fileHelper";
import ScoringBlock from "../../../../framework/author/itemList/questionType/common/scoringBlock";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";

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
    itemList.clickOnCreate().then(id => {
      testItemId = id;
    });
  });

  context("Create basic question and validate.", () => {
    before("visit items page and select question type", () => {
      editItem.getItemWithId(testItemId);
      editItem.deleteAllQuestion();
      // create new que and select type
      editItem.addNew().chooseQuestion(queData.group, queData.queType);
    });

    it("[clz_txt_s1] : user create question with default option and save", () => {
      // enter question
      question
        .getQuestionEditor()
        .clear()
        .type(queData.queText)
        .should("have.text", queData.queText);

      question
        .getTemplateEditor()
        .clear()
        .type(queData.template)
        .should("have.text", queData.template);

      question.TemplateMarkupBar.response().click();

      question.getResponseBoxByIndex(0).type(queData.correctAns);
      // save que
      question.header.save();
    });

    it("[clz_txt_s2] : preview and validate with right/wrong ans", () => {
      preview = editItem.header.preview();
      // enter right ans
      question.getResponseBoxByIndex(0).type(queData.correctAns);

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.getAntMsg().should("contain", "score: 1/1");

          question.getResponseOnPreview().should("have.class", "right");
        });

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get(".right .wrong").should("have.length", 0);
        });

      // enter wrong ans
      question.getResponseBoxByIndex(0).type(queData.testtext);

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.getAntMsg().should("contain", "score: 0/1");

          question
            .getResponseOnPreview()
            .should("have.class", "wrong")
            .and("not.have.class", "right");
        });

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get(".right .wrong").should("have.length", 0);
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

  context("Scoring Block test", () => {
    before("visit items page and select question type", () => {
      editItem.getItemWithId(testItemId);
      editItem.deleteAllQuestion();
      // create new que and select type
      editItem.addNew().chooseQuestion(queData.group, queData.queType);
    });

    afterEach(() => {
      preview = question.header.preview();

      preview
        .getClear()
        .click()
        .then(() => {
          question.header.edit();
          question.clickOnAdvancedOptions();
        });
    });

    it("test score with alternate answer", () => {
      queData.forScoringCorrectAns.forEach((ans, index) => {
        question
          .getResponseBoxByIndex(index)
          .type(ans)
          .should("have.value", ans);
      });

      question
        .getPoints()
        .clear()
        .type(8);

      question.addAlternate();

      question
        .getPoints()
        .clear()
        .type(4);

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
          preview.getAntMsg().should("contain", "score: 4/8");
        });
    });

    it("test score with min score if attempted", () => {
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

    it("test score with partial match and penalty", () => {
      scoringBlock.getMinScore().clear();

      scoringBlock
        .getPanalty()
        .clear()
        .type(4);

      scoringBlock.selectScoringType("Partial match");

      preview = question.header.preview();

      question.getResponseBoxByIndex(0).type("incorrect1");
      question.getResponseBoxByIndex(1).type(queData.forScoringAltAns[1]);

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.getAntMsg().should("contain", "score: 2/8");
        });
    });

    it("test score with max score", () => {
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
    });
  });
});
