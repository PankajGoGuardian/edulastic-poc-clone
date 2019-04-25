import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import ClozeDropDownPage from "../../../../framework/author/itemList/questionType/fillInBlank/clozeWithDropDownPage";
import FileHelper from "../../../../framework/util/fileHelper";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";

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

    it("[clz_dropdown_s1] : user create basic question with default option and save", () => {
      // enter question
      question
        .getQuestionEditor()
        .clear()
        .type(queData.queText)
        .should("have.text", queData.queText);

      // edit template
      question
        .getTemplateEditor()
        .clear()
        .type(" ");

      question.templateMarkupBar.response().click();

      question
        .getTemplateEditor()
        .type(queData.template)
        .should("contain", queData.template);

      // edit choice option for response1
      queData.choices.forEach((ch, index) => {
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

    it("[clz_dropdown_s2] : preview and validate with right/wrong ans", () => {
      preview = editItem.header.preview();
      // enter right ans and validate
      question.setChoiceForResponseIndex(0, queData.correctAns);

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
      // enter wrong ans and validate
      question.setChoiceForResponseIndex(0, queData.choices[0]);

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.getAntMsg().should("contain", "score: 0/1");

          question.getResponseOnPreview().should("have.class", "wrong");
        });

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get(".right .wrong").should("have.length", 0);
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

  context("Scoring Block test", () => {
    before("visit items page and select question type", () => {
      editItem.getItemWithId(testItemId);
      editItem.deleteAllQuestion();
      // create new que and select type
      editItem.addNew().chooseQuestion(queData.group, queData.queType);

      question
        .getQuestionEditor()
        .clear()
        .type(queData.queText)
        .should("have.text", queData.queText);

      // edit template
      question
        .getTemplateEditor()
        .clear()
        .type(" ");

      question.templateMarkupBar.response().click();

      question
        .getTemplateEditor()
        .type(queData.template)
        .should("contain", queData.template);

      question.templateMarkupBar.response().click();

      question
        .getTemplateEditor()
        .type(queData.template)
        .should("contain", queData.template);

      // edit choice option for response1
      queData.forScoringChoices.forEach((resp, respIndex) => {
        resp.forEach((ch, index) => {
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
          cy.get("div.right,div.wrong").should("have.length", 0);
          preview.header.edit();

          // question.clickOnAdvancedOptions();
        });
    });

    it("[clz_dropdown_scoring]: Test score with alternate answer", () => {
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

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.getAntMsg().should("contain", "score: 1/1");
        });

      preview.header.edit();

      question
        .getPoints()
        .clear()
        .type(2);

      preview = question.header.preview();

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.getAntMsg().should("contain", "score: 1/2");
        });

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get("div.right,div.wrong").should("have.length", 0);
        });

      question.setChoiceForResponseIndex(0, queData.forScoringChoices[0][1]);
      question.setChoiceForResponseIndex(1, queData.forScoringChoices[1][0]);

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.getAntMsg().should("contain", "score: 0/2");
        });
    });

    it("[clz_dropdown_scoring]: Test score with min score if attempted", () => {
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
    });

    it("[clz_dropdown_scoring]: Test score with partial match and penalty", () => {
      question.getMinScore().clear();

      question.getPanalty().type(2);

      question.selectScoringType("Partial match");

      question
        .getPoints()
        .clear()
        .type(4);

      question.getAlternates().click();

      question
        .getPoints()
        .clear()
        .type(6);

      preview = question.header.preview();

      question.setChoiceForResponseIndex(0, queData.forScoringChoices[0][0]);
      question.setChoiceForResponseIndex(1, queData.forScoringChoices[1][0]);

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.getAntMsg().should("contain", "score: 1/6");
        });

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get("div.right,div.wrong").should("have.length", 0);
        });

      question.setChoiceForResponseIndex(0, queData.forScoringChoices[0][1]);
      question.setChoiceForResponseIndex(1, queData.forScoringChoices[1][0]);

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.getAntMsg().should("contain", "score: 2/6");
        });
    });

    it("[clz_dropdown_scoring]: Test score with max score", () => {
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
    });
  });
});
