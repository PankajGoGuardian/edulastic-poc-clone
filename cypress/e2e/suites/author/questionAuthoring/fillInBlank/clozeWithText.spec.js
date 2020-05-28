import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import ClozeWithTextPage from "../../../../framework/author/itemList/questionType/fillInBlank/clozeWithTextPage";
import FileHelper from "../../../../framework/util/fileHelper";
import ScoringBlock from "../../../../framework/author/itemList/questionType/common/scoringBlock";
import { SCORING_TYPE } from "../../../../framework/constants/questionAuthoring";
import { queColor } from "../../../../framework/constants/questionTypes";
import validateSolutionBlockTests from "../../../../framework/author/itemList/questionType/common/validateSolutionBlockTests";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Cloze with Text" type question`, () => {
  const queData = {
    group: "Fill in the Blanks",
    queType: "Cloze with Text",
    queText: "Fill in the blanks?",
    template: "Enter the capital of india = ",
    correctAns: "NEW DELHI",
    forScoringCorrectAns: ["test1", "test2"],
    forIgnoreCaseCorrectAns: ["TEst1", "TEST2"],
    forSingleLetterMistakeCorrectAns: ["test", "test"],
    forMixNMatchAltAns: ["alt1", "alt2"],
    forMixNMatchCorrectAns: ["test1", "alt2"],
    forScoringAltAns: ["alt1", "test2"],
    extlink: "www.testdomain.com",
    testtext: "testtext",
    formula: "s=ar^2"
  };

  const scoringBlock = new ScoringBlock();
  const question = new ClozeWithTextPage();
  const editItem = new EditItemPage();
  let preview;

  before(() => {
    cy.login();
  });

  context(" > Create basic question and validate.", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();
      // add new question
      editItem.chooseQuestion(queData.group, queData.queType);
    });

    context(" > [clz_txt_s1] : user create basic question with default option and save", () => {
      it("> Write text in textbox and add response box", () => {
        // enter question
        question
          .getQuestionEditor()
          .clear()
          .type(queData.queText)
          .should("have.text", queData.queText);
        question.getQuestionEditor().click();
        // text input
        question.editToolBar.textInput().click();
      });

      it("> Set correct answer and save", () => {
        // set ans
        question.getResponseBoxByIndex(0).type(queData.correctAns);
        // save que
        question.header.save();
      });
    });

    context(" > [clz_txt_s2] : preview and validate with right/wrong ans", () => {
      before("Navigate to Preview Page", () => {
        preview = editItem.header.preview();
      });

      it("> enter right answer and validate check answer", () => {
        // enter right ans
        question.getResponseBoxByIndex(0).type(queData.correctAns);
        preview.checkScore("1/1");
        question.getResponseOnPreview(0).should("have.css", "background-color", queColor.LIGHT_GREEN);

        preview.clickOnClear();
      });

      it("> enter wrong answer and validate check answer", () => {
        // enter wrong ans
        question.getResponseBoxByIndex(0).type(queData.testtext);
        preview.checkScore("0/1");
        question.getResponseOnPreview(0).should("have.css", "background-color", queColor.LIGHT_RED);
      });

      it("> click on Show Answers", () => {
        preview.checkOnShowAnswer().then(() => {
          question
            .getShowAnsBoxOnPreview()
            .contains(queData.correctAns)
            .should("be.visible");
        });
      });

      it("> Click on Clear", () => {
        preview.clickOnClear().then(() => {
          cy.get('[data-cy="answer-box"]').should("have.length", 0);
          question.getResponseBoxByIndex(0).should("have.css", "background-color", queColor.WHITE_1);
        });
        cy.get("body")
          .children()
          .should("not.contain", "Correct Answer");
      });
    });

    context(" > [clz_txt_s3] : Check Additional Options with multiple text inputs", () => {
      before("Enter question with multiple text inputs", () => {
        // enter question
        question.header.edit();
        question
          .getQuestionEditor()
          .clear()
          .type(queData.queText)
          .should("have.text", queData.queText);
        // text input
        question.editToolBar.textInput().click();
        question.editToolBar.textInput().click();
        queData.forScoringCorrectAns.forEach((ans, index) => {
          question
            .getResponseBoxByIndex(index)
            .clear()
            .type(ans)
            .should("have.value", ans);
        });
      });

      it("Check Ignore Case", () => {
        question.header.edit();
        question.updatePoints(2);
        // check Ignore Case
        question.getIgnoreCase().click({ force: true });
        question.getIgnoreCase().should("be.checked");
        question.header.preview();
        queData.forIgnoreCaseCorrectAns.forEach((ans, index) => {
          question
            .getResponseBoxByIndex(index)
            .type(ans)
            .should("have.value", ans);
        });
        preview.checkScore("2/2");

        // uncheck Ignore Case
        question.header.edit();
        question.getIgnoreCase().click({ force: true });
        question.getIgnoreCase().should("not.checked");
        question.header.preview();
        queData.forIgnoreCaseCorrectAns.forEach((ans, index) => {
          question
            .getResponseBoxByIndex(index)
            .type(ans)
            .should("have.value", ans);
        });
        preview.checkScore("0/2");
      });

      it("check Allow Single Letter Mistake", () => {
        question.header.edit();
        question.updatePoints(2);
        // check Allow Single Letter Mistake
        question.getAllowSingleLetterMistake().click({ force: true });
        question.getAllowSingleLetterMistake().should("be.checked");
        question.header.preview();
        queData.forSingleLetterMistakeCorrectAns.forEach((ans, index) => {
          question
            .getResponseBoxByIndex(index)
            .type(ans)
            .should("have.value", ans);
        });
        preview.checkScore("2/2");

        // uncheck Allow Single Letter Mistake
        question.header.edit();
        question.getAllowSingleLetterMistake().click({ force: true });
        question.getAllowSingleLetterMistake().should("not.checked");
        question.header.preview();
        queData.forSingleLetterMistakeCorrectAns.forEach((ans, index) => {
          question
            .getResponseBoxByIndex(index)
            .type(ans)
            .should("have.value", ans);
        });
        preview.checkScore("0/2");
      });

      it("check MIX-N-MATCH Alternative Answers", () => {
        question.header.edit();
        question.updatePoints(2);
        // By default Mix N Match checkbox is enabled
        question.getMixAndMatchAltAnswer().should("be.checked");
        question.addAlternate();
        queData.forMixNMatchAltAns.forEach((ans, index) => {
          question.setMixNMatchAltAnswers(index, ans);
        });
        question.header.preview();
        queData.forMixNMatchCorrectAns.forEach((ans, index) => {
          question
            .getResponseBoxByIndex(index)
            .type(ans)
            .should("have.value", ans);
        });
        preview.checkScore("2/2");

        // uncheck MixNMatch
        question.header.edit();
        question.getMixAndMatchAltAnswer().click({ force: true });
        question.getMixAndMatchAltAnswer().should("not.checked");
        question.header.preview();
        queData.forMixNMatchAltAns.forEach((ans, index) => {
          question
            .getResponseBoxByIndex(index)
            .type(ans)
            .should("have.value", ans);
        });
        preview.checkScore("1/2");
      });
    });

    context(" > Scoring Block test", () => {
      before("visit items page and select question type", () => {
        editItem.createNewItem();
        // add new question
        editItem.chooseQuestion(queData.group, queData.queType);
      });

      it(" > test score with partial match", () => {
        queData.forScoringCorrectAns.forEach((ans, index) => {
          question
            .getResponseBoxByIndex(index)
            .clear()
            .type(ans)
            .should("have.value", ans);
        });
        question.updatePoints(8);
        question.clickOnAdvancedOptions();
        scoringBlock.selectScoringType(SCORING_TYPE.PARTIAL);
        preview = question.header.preview();
        question.getResponseBoxByIndex(0).type("incorrect1");
        question.getResponseBoxByIndex(1).type(queData.forScoringAltAns[1]);
        preview.checkScore("4/8");
        question.getResponseOnPreview(0).should("have.css", "background-color", queColor.LIGHT_RED);
        question.getResponseOnPreview(1).should("have.css", "background-color", queColor.LIGHT_GREEN);
      });

      it(" > test score with partial match and Rounding", () => {
        question.header.edit();
        queData.forScoringCorrectAns.forEach((ans, index) => {
          question
            .getResponseBoxByIndex(index)
            .clear()
            .type(ans)
            .should("have.value", ans);
        });
        question.updatePoints(5);
        question.clickOnAdvancedOptions();
        scoringBlock.selectScoringType(SCORING_TYPE.PARTIAL);
        question.selectRoundingType("None");
        preview = question.header.preview();
        question.getResponseBoxByIndex(0).type("incorrect1");
        question.getResponseBoxByIndex(1).type(queData.forScoringAltAns[1]);
        preview.checkScore("2.5/5");
        question.header.edit();
        question.selectRoundingType("Round down");
        preview = question.header.preview();
        question.getResponseBoxByIndex(0).type("incorrect1");
        question.getResponseBoxByIndex(1).type(queData.forScoringAltAns[1]);
        preview.checkScore("2/5");
      });

      it(" > test score with alternate answer", () => {
        question.header.edit();
        queData.forScoringCorrectAns.forEach((ans, index) => {
          question
            .getResponseBoxByIndex(index)
            .clear()
            .type(ans)
            .should("have.value", ans);
        });

        question.getMixAndMatchAltAnswer().click({ force: true });
        question.getMixAndMatchAltAnswer().should("not.checked");
        question.updatePoints(8);
        question.addAlternate();
        question.updatePoints(4);
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
        preview.checkScore("4/8");
      });

      it(" > test score with alternate answer, partial match and penalty", () => {
        question.header.edit();
        question.clickOnAdvancedOptions();
        scoringBlock.selectScoringType(SCORING_TYPE.PARTIAL);
        scoringBlock.getPanalty().type("{selectall}2");
        preview = question.header.preview();
        question.getResponseBoxByIndex(0).type("incorrect1");
        question.getResponseBoxByIndex(1).type(queData.forScoringAltAns[1]);
        preview.checkScore("2/8");
      });
    });

    validateSolutionBlockTests(queData.group, queData.queType);
  });
});
