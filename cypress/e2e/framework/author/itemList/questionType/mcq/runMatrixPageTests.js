import Helpers from "../../../../util/Helpers";
import ChoiceMatrixPage from "./choiceMatrixPage";
import EditItemPage from "../../itemDetail/editPage";
import { SCORING_TYPE } from "../../../../constants/questionAuthoring";
import PreviewItemPopup from "../../itemPreview";
import { attemptTypes } from "../../../../constants/questionTypes";

const runMatrixPageTests = queData => {
  const editItem = new EditItemPage();
  const question = new ChoiceMatrixPage();
  const itemPreview = new PreviewItemPopup();

  before(() => {
    cy.login();
  });

  context("User creates question", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();
      // select que type
      editItem.chooseQuestion(queData.group, queData.queType);
    });
    it("[Tc_318] => edit question text", () => {
      question
        .getQuestionEditor()
        .clear()
        .type(queData.queText)
        .should("contain", queData.queText);
    });

    it("[Tc_319] => edit/delete multiple choice options", () => {
      // edit the 1st ans choice
      question
        .getChoiceByIndex(0)
        .clear()
        .type(queData.formattext)
        .should("contain", queData.formattext);

      // delete the 1st ans choice
      question.deleteChoiceByIndex(0);

      question.getChoiceByIndex(0).should("not.contain", queData.formattext);

      // add new choice
      question.addNewChoice();

      question
        .getChoiceByIndex(3)
        .type(queData.formattext)
        .should("contain", queData.formattext);

      question.getallChoices().should("be.have.length", 4);
    });

    it("[Tc_320] => edit/delete steam options", () => {
      // edit the 1st steam
      question
        .getSteamByIndex(0)
        .clear()
        .type(queData.formattext)
        .should("contain", queData.formattext);

      // delete the 1st steam
      question.deleteSteamByIndex(0);

      question.getSteamByIndex(0).should("not.contain", queData.formattext);

      // add new steam
      question.addNewSteam();

      question
        .getSteamByIndex(1)
        .type(queData.formattext)
        .should("contain", queData.formattext);

      question.getallSteam().should("be.have.length", 2);
    });

    it("[Tc_321] => set correct ans,multiple response,alternate", () => {
      // setting correct ans
      question.getCorrectAnsTableRow().each(($ele, index) => {
        cy.wrap($ele)
          .find("input")
          .eq(index % 2)
          .click();
      });

      // points

      // add alternate
      question.addAlternate();

      question.getAlternateTabs().should("have.length", 1);

      // delete alternate
      question.deleteAlternate();

      question.checkAlternateTabNotVisible();

      // check muplti response
      question.getMultipleResponse().click();
      question.getCorrectAnsTableRow().each($ele => {
        cy.wrap($ele)
          .find("input")
          .should("have.attr", "type", "checkbox");
      });
    });
  });

  context("Display", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();
      // add new question
      editItem.chooseQuestion(queData.group, queData.queType);
      question.clickOnAdvancedOptions();
    });

    beforeEach(() => {
      editItem.header.edit();
    });

    it("should be able to select small font size", () => {
      const select = question.getFontSizeSelect();
      const { name, font } = Helpers.fontSize("small");

      select.click();

      question
        .getSmallFontSizeOption()
        // .should("be.visible")
        .click();

      select.should("contain", name);
      question.checkFontSize(font);
    });
    it("should be able to select normal font size", () => {
      const select = question.getFontSizeSelect();
      const { name, font } = Helpers.fontSize("normal");

      select.click();

      question
        .getNormalFontSizeOption()
        // .should("be.visible")
        .click();

      select.should("contain", name);
      question.checkFontSize(font);
    });
    it("should be able to select large font size", () => {
      const select = question.getFontSizeSelect();
      const { name, font } = Helpers.fontSize("large");

      select.click();

      question
        .getLargeFontSizeOption()
        // .should("be.visible")
        .click();

      select.should("contain", name);
      question.checkFontSize(font);
    });
    it("should be able to select extra large font size", () => {
      const select = question.getFontSizeSelect();
      const { name, font } = Helpers.fontSize("xlarge");

      select.click();

      question
        .getExtraLargeFontSizeOption()
        // .should("be.visible")
        .click();

      select.should("contain", name);
      question.checkFontSize(font);
    });
    it("should be able to select huge font size", () => {
      const select = question.getFontSizeSelect();
      const { name, font } = Helpers.fontSize("xxlarge");

      select.click();

      question
        .getHugeFontSizeOption()
        // .should("be.visible")
        .click();

      select.should("contain", name);
      question.checkFontSize(font);
    });
    it("should be able to select Inline matrix style", () => {
      const option = "Table";
      question.selectMatrixStyle(option);
      question.checkMatrixStyle(option);
    });
    it("should be able to select Table matrix style", () => {
      const option = "Table";
      question.selectMatrixStyle(option);
      question.checkMatrixStyle(option);
    });
    it("should be able to show a stem numeration select after a table matrix style selected", () => {
      question.selectMatrixStyle("Table");
      question.getStemNumerationSelect().should("be.visible");
    });
    it("should be able to hide a stem numeration select after a inline matrix style selected", () => {
      question.selectMatrixStyle("Inline");
      question.getStemNumerationSelect().should("not.be.visible");
    });
    it("should be able to select a numerical stem numeration", () => {
      question.selectMatrixStyle("Table");
      question.selectStemNumeration("Numerical");
    });
    it("should be able to select an uppercase alphabet stem numeration", () => {
      question.selectMatrixStyle("Table");
      question.selectStemNumeration("Uppercase alphabet");
    });
    it("should be able to select an lowercase alphabet stem numeration", () => {
      question.selectMatrixStyle("Table");
      question.selectStemNumeration("Lowercase alphabet");
    });
    it("should be able to type stem column title", () => {
      const text = "Stem column title";

      question
        .getStemColumnTitle()
        // .should("be.visible")

        .type(`{selectall}${text}`)
        .should("contain", text);

      question.checkTableTitle(text);
    });
    it("should be able to type option row title", () => {
      const text = "Option row title";

      question
        .getOptionRowTitle()
        // .should("be.visible")
        .clear()
        .type(text)
        .should("contain", text);

      question.checkTableTitle(text);
    });
    it("should be able to change stem width if table style selected", () => {
      const width = 200;
      question.selectMatrixStyle("Table");

      question
        .getStemWidth()
        // .should("be.visible")
        .type(`{selectall}${width}`, { force: true })
        .should("have.value", `${width}`);

      question.checkTableColumnWidth(1, width);
    });
    it("should be able to change stem width if inline style selected", () => {
      const width = 200;
      question.selectMatrixStyle("Inline");

      question
        .getStemWidth()
        .should("be.visible")
        .type(`{selectall}${width}`, { force: true })
        .should("have.value", `${width}`);
      question.checkTableColumnWidth(0, width);
    });
    it("should be able to change stem width if table style selected and Numerical Stem numeration selected", () => {
      const width = 121;

      question
        .getStemWidth()
        // .should("be.visible")
        .type(`{selectall}${width}`, { force: true })
        .should("have.value", `${width}`);

      question.selectMatrixStyle("Table");
      question.getStemNumerationSelect().should("be.visible");
      question.selectStemNumeration("Numerical");
      question.checkTableColumnWidth(1, width);
    });
    it("should be able to select Numerical stem numeration", () => {
      question.selectMatrixStyle("Table");
      question.getStemNumerationSelect().should("be.visible");
      question.selectStemNumeration("Numerical");
      question.checkStemNumeration("number");
    });
    it("should be able to select Uppercase alphabet stem numeration", () => {
      question.selectMatrixStyle("Table");
      question.getStemNumerationSelect().should("be.visible");
      question.selectStemNumeration("Uppercase alphabet");
      question.checkStemNumeration("upper-alpha");
    });
    it("should be able to select Lowercase alphabet stem numeration", () => {
      question.selectMatrixStyle("Table");
      question.getStemNumerationSelect().should("be.visible");
      question.selectStemNumeration("Lowercase alphabet");
      question.checkStemNumeration("lower-alpha");
    });
    it("should be able to change stem width if table style selected and Uppercase alphabet Stem numeration selected", () => {
      const width = 120;

      question
        .getStemWidth()
        // .should("be.visible")
        .type(`{selectall}${width}`, { force: true })
        .should("have.value", `${width}`);

      question.selectMatrixStyle("Table");
      question.getStemNumerationSelect().should("be.visible");
      question.selectStemNumeration("Uppercase alphabet");
      question.checkTableColumnWidth(1, width);
    });
    it("should be able to change stem width if table style selected and Lowercase alphabet Stem numeration selected", () => {
      const width = 211;

      question
        .getStemWidth()
        // .should("be.visible")
        .type(`{selectall}${width}`, { force: true })
        .should("have.value", `${width}`);

      question.selectMatrixStyle("Table");
      question.getStemNumerationSelect().should("be.visible");
      question.selectStemNumeration("Lowercase alphabet");
      question.checkTableColumnWidth(1, width);
    });
    it("should be able to change option width if if table style selected and Numerical Stem numeration selected", () => {
      const width = 135;

      question
        .getOptionWidth()
        // .should("be.visible")
        .type(`{selectall}${width}`, { force: true })
        .should("have.value", `${width}`);

      question.selectMatrixStyle("Table");
      question.getStemNumerationSelect().should("be.visible");
      question.selectStemNumeration("Numerical");
      question.checkTableColumnWidth(2, width);
      question.checkTableColumnWidth(3, width);
    });
    it("should be able to change option width if if table style selected and Uppercase alphabet Stem numeration selected", () => {
      const width = 140;

      question
        .getOptionWidth()
        // .should("be.visible")
        .type(`{selectall}${width}`, { force: true })
        .should("have.value", `${width}`);

      question.selectMatrixStyle("Table");
      question.getStemNumerationSelect().should("be.visible");
      question.selectStemNumeration("Uppercase alphabet");
      question.checkTableColumnWidth(2, width);
      question.checkTableColumnWidth(3, width);
    });
    it("should be able to change option width if if table style selected and Lowercase alphabet Stem numeration selected", () => {
      const width = 155;

      question
        .getOptionWidth()
        // .should("be.visible")
        .type(`{selectall}${width}`, { force: true })
        .should("have.value", `${width}`);

      question.selectMatrixStyle("Table");
      question.getStemNumerationSelect().should("be.visible");
      question.selectStemNumeration("Lowercase alphabet");
      question.checkTableColumnWidth(2, width);
      question.checkTableColumnWidth(3, width);
    });
    it("should be able to check dividers checkbox", () => {
      question
        .getDividersCheckbox()
        // .should("be.visible")
        .check({ force: true })
        .should("be.checked");

      question.checkDividers(true);
    });
    it("should be able to uncheck dividers checkbox", () => {
      question
        .getDividersCheckbox()
        // .should("be.visible")
        .uncheck({ force: true })
        .should("not.be.checked");

      question.checkDividers(false);
    });
  });

  context("[sanity-test] => create basic question and validate", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();
      // add new question
      editItem.chooseQuestion(queData.group, queData.queType);
      question
        .getChoiceByIndex(0)
        .clear()
        .type(queData.formattext)
        .should("contain", queData.formattext);
    });
    it("[choice_std_s1] => create basic question and save", () => {
      // question
      question
        .getQuestionEditor()
        .clear()
        .type(queData.queText)
        .should("contain", queData.queText);

      // add choices
      question
        .getallChoices()
        .each(($el, index, $list) => {
          const cusIndex = $list.length - (index + 1);
          question.deleteChoiceByIndex(cusIndex);
        })
        .should("have.length", 0);

      queData.ansChoice.forEach((ch, index) => {
        question
          .addNewChoice()
          .getChoiceByIndex(index)
          .clear()
          .type(ch)
          .should("contain", ch);
      });

      // add steam
      question
        .getallSteam()
        .each(($el, index, $list) => {
          const cusIndex = $list.length - (index + 1);
          question.deleteSteamByIndex(cusIndex);
        })
        .should("have.length", 0);

      queData.steams.forEach((ch, index) => {
        question
          .addNewSteam()
          .getSteamByIndex(index)
          .clear()
          .type(ch)
          .should("contain", ch);
      });

      // set correct ans
      question.getCorrectAnsTableRow().each(($ele, index) => {
        cy.wrap($ele)
          .find("input")
          .eq((index + 1) % 2)
          .click();
      });
      // save question
      question.header.save();
      cy.contains(queData.queText).should("be.visible");
    });

    it("[choice_std_s1] => validate basic question with default setting", () => {
      // preview
      const preview = editItem.header.preview();

      // give correct ans and validate
      question.getCorrectAnsTableRow().each(($ele, index) => {
        cy.wrap($ele)
          .find("input")
          .eq((index + 1) % 2)
          .click();
      });

      preview.checkScore("1/1");

      preview.getClear().click();

      // give wrong ans and validate
      question.getCorrectAnsTableRow().each(($ele, index) => {
        cy.wrap($ele)
          .find("input")
          .eq(index % 2)
          .click();
      });

      preview.getCheckAnswer().click({ force: true });

      preview.checkScore("0/1");
    });
  });

  context("Scoring Block test", () => {
    before("visit items page and select question type", () => {
      // add new question
      question.createQuestion(queData.qShortKey);

      question.getPoints().type("{selectall}8");
    });

    /*  afterEach(() => {
       const preview = question.header.preview();
 
       preview
         .getClear()
         .click()
         .then(() => {
           question.header.edit();
 
           // question.clickOnAdvancedOptions();
         });
     }); */

    it("test with exact score", () => {
      question.header.edit();

      question.selectScoringType(SCORING_TYPE.EXACT);

      const preview = editItem.header.preview();

      preview.checkOnShowAnswer();
      itemPreview.verifyQuestionResponseCard(queData.qShortKey, queData.attemptData, attemptTypes.RIGHT, true);

      question.selectAnswerChoice(queData.forScoringCorrectAns);

      preview.checkOnCheckAnswer();
      itemPreview.verifyQuestionResponseCard(queData.qShortKey, queData.attemptData, attemptTypes.RIGHT);

      preview.checkScore("8/8");

      preview.clickOnClear();

      question.selectAnswerChoice(queData.inCorrectAns);

      preview.checkOnCheckAnswer();

      itemPreview.verifyQuestionResponseCard(queData.qShortKey, queData.attemptData, attemptTypes.WRONG);

      preview.checkScore("0/8");
    });

    it("test with partial score", () => {
      question.header.edit();

      question.selectScoringType(SCORING_TYPE.PARTIAL);

      const preview = editItem.header.preview();

      question.selectAnswerChoice(queData.CorrectPartialAns);

      preview.checkOnCheckAnswer();
      itemPreview.verifyQuestionResponseCard(queData.qShortKey, queData.attemptData, attemptTypes.PARTIAL);

      preview.checkScore("4/8");
    });

    it("verify penalty", () => {
      question.header.edit();
      question.clickOnAdvancedOptions();
      question.getPenalty().type("{selectAll}2");

      const preview = editItem.header.preview();

      question.selectAnswerChoice(queData.forPenaltyScoring);

      preview.checkScore("3.5/8");
    });

    it("Score with rounding and penalty", () => {
      const preview = editItem.header.preview();

      question.header.edit();
      question.selectScoringType(SCORING_TYPE.PARTIAL);

      question.selectRoundingType("Round down");

      question.header.preview();

      question.selectAnswerChoice(queData.forPenaltyScoring);
      preview.checkScore("3/8");
    });
    it("score without rounding and penalty", () => {
      const preview = editItem.header.preview();

      question.header.edit();
      question.selectScoringType(SCORING_TYPE.PARTIAL);

      question.selectRoundingType("None");

      question.header.preview();

      question.selectAnswerChoice(queData.forPenaltyScoring);

      preview.checkScore("3.5/8");
    });

    it("test score with alternate answer", () => {
      // question.clickOnAdvancedOptions();

      question.header.edit();

      question.addAlternate();

      question.selectAnswerChoice(queData.forScoringAltAns);

      question.getPoints().type("{selectall}7");

      const preview = question.header.preview();

      preview.checkOnShowAnswer();

      itemPreview.verifyQuestionResponseCard(
        queData.qShortKey,
        queData.attemptData,
        attemptTypes.ALTERNATE,
        true,
        0,
        true
      );

      question.selectAnswerChoice(queData.forScoringAltAns);

      preview.checkOnCheckAnswer();
      itemPreview.verifyQuestionResponseCard(queData.qShortKey, queData.attemptData, attemptTypes.ALTERNATE);

      preview.checkScore("7/7");
    });
  });
};

export default runMatrixPageTests;
