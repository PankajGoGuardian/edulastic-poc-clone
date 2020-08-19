import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import HotspotPage from "../../../../framework/author/itemList/questionType/highlight/hotspotPage";
import FileHelper from "../../../../framework/util/fileHelper";
import Helpers from "../../../../framework/util/Helpers";
import validateSolutionBlockTests from "../../../../framework/author/itemList/questionType/common/validateSolutionBlockTests";
import { queColor } from "../../../../framework/constants/questionTypes";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Hotspot" type question`, () => {
  const queData = {
    group: "Highlight",
    queType: "Hotspot",
    queText: "Hotsport test",
    imageWidth: "600",
    imageHeight: "400",
    altText: "Image Alt Text",
    outLineColor: "rgba(214, 50, 23, 1)",
    outLineColorCode: "d63217",
    fillColorCode: "1e4c60",
    fillColor: "rgba(30, 76, 96, 0.8)",
    strokeColorSelected: "rgb(150, 35, 16)"
  };

  const spotPoints1 = [[50, 50], [50, 100], [100, 100], [100, 50], [50, 50]];

  const spotPoints2 = [[150, 150], [150, 200], [200, 200], [200, 150], [150, 150]];

  const spotPoints3 = [[250, 250], [250, 300], [300, 300], [300, 250], [250, 250]];

  const question = new HotspotPage();
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

    context(" > TC_195 => Enter question text in Compose Questino text box", () => {
      it(" > Upload image to server", () => {
        cy.uploadFile("testImages/sample.jpg", "input[type=file]");
        question.isImageDisplayedInQuesArea();
        question.isImageDisplayedInAnsArea();
      });

      it(" > Enter Width (px)", () => {
        question.changeImageWidth(queData.imageWidth);
        question.verifyImageWidthInQuesArea(queData.imageWidth);
        question.verifyImageWidthInAnsArea(queData.imageWidth);
      });

      it(" > Enter Height (px)", () => {
        question.changeImageHeight(queData.imageHeight);
        question.verifyImageHeightInQuesArea(queData.imageHeight);
        question.verifyImageHeightInAnsArea(queData.imageHeight);
      });
    });

    context(" > TC_196 => Area", () => {
      it(" > Draw spots", () => {
        question.clickDrawMode();
        question.drawRectangle(spotPoints1);
        question.drawRectangle(spotPoints2);
        question.verifyNumberOfPolygonInDrawArea(2);
      });

      it(" > Delete spots", () => {
        question.clickDeleteMode();
        question.verifyNumberOfPolygonInDrawArea(2);
        question.clickPolygonInDrawArea(0);
        question.clickPolygonInDrawArea(0);
        question.verifyNumberOfPolygonInDrawArea(0);
      });

      it(" > Undo", () => {
        question.clickDrawMode();
        question.drawRectangle(spotPoints1);
        question.verifyNumberOfPolygonInDrawArea(1);
        question.clickAreaUndo();
        question.verifyNumberOfPolygonInDrawArea(0);
      });

      it(" > Redo", () => {
        question.clickAreaRedo();
        question.verifyNumberOfPolygonInDrawArea(1);
      });

      it(" > Clear", () => {
        question.clickAreaClear();
        question.verifyNumberOfPolygonInDrawArea(0);
      });
    });

    context(" > TC_197 => Attributes", () => {
      before("add sample data", () => {
        question.clickDrawMode();
        question.drawRectangle(spotPoints1);
        question.drawRectangle(spotPoints2);
        question.verifyNumberOfPolygonInDrawArea(2);
      });

      it(" > Fill Color", () => {
        question.changeFillColor(queData.fillColorCode, "80", queData.fillColor);
        question.verifyPolygonFillColor(queData.fillColor);
      });

      it(" > Outline Color", () => {
        question.changeOutlineColor(queData.outLineColorCode, "100");
        question.verifyPolygonOutlineColor(queData.outLineColor);
      });
    });

    context(" > TC_198 => Set Correct Ansswers", () => {
      it(" > Click on + symbol", () => {
        question.addAlternate();
        question.closelternate();
      });

      it(" > Update Points", () => {
        question.enterPoints("1");
        question.enterPoints("1.5");
        question.enterPoints("1");
      });

      it(" > Provide the answer choices", () => {
        question.clickPolygonInAnswerArea(0, true, queData.strokeColorSelected);
        question.verifyPolygonSelectedInAnsArea(0, true);
      });

      it(" > Multiple response", () => {
        question.clickMultipleCheck(true);

        question.verifyPolygonSelectedInAnsArea(0, true);
        question.clickPolygonInAnswerArea(1, true, queData.strokeColorSelected);
        question.verifyPolygonSelectedInAnsArea(1, true);

        question.clickMultipleCheck(false);
        question.verifyPolygonSelectedInAnsArea(0, true);
        question.verifyPolygonSelectedInAnsArea(1, false);
      });
    });

    context(" > TC_199 => Save question", () => {
      it("> enter question text", () => {
        question.getQuestionText().type(queData.queText);
      });
      it(" > Click on save button", () => {
        question.header.save();
        cy.url().should("contain", "item-detail");
      });
    });

    context(" > TC_200 => Preview items", () => {
      it(" > Click on Check answer", () => {
        preview = editItem.header.preview();
        preview.checkScore("0/1");

        preview.getClear().click();
        question.clickPolygonInAnswerArea(0, true, queData.strokeColorSelected);
        question.verifyPolygonSelectedInAnsArea(0, true);

        preview.checkScore("1/1");
      });

      it(" > Click on Show Answers", () => {
        preview.getClear().click();
        preview.getShowAnswer().click();
        question.verifyAnswerShown(0, "rgb(0, 173, 80)");
      });

      it(" > Click on Clear", () => {
        preview.getClear().click();
        question.verifyPolygonOutlineColor("rgba(214, 50, 23, 1)");
        preview.header.edit();
      });
    });
  });

  context(" > Advanced Options", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();

      // create new que and select type
      editItem.chooseQuestion(queData.group, queData.queType);
    });

    beforeEach(() => {
      editItem.header.edit();
      // editItem.showAdvancedOptions(); // UI toggle has been removed
    });

    afterEach(() => {
      editItem.header.edit();
    });
  });
  describe(" > Layout", () => {
    it(" > should be able to select small font size", () => {
      question.getQuestionText().type(queData.queText);
      const select = question.getFontSizeSelect();
      const { name, font } = Helpers.fontSize("small");

      select.click({ force: true });

      question.getSmallFontSizeOption().click({ force: true });

      select.should("contain", name);
      question.checkFontSize(font);
    });
    it(" > should be able to select normal font size", () => {
      const select = question.getFontSizeSelect();
      const { name, font } = Helpers.fontSize("normal");

      select.click({ force: true });

      question.getNormalFontSizeOption().click({ force: true });

      select.should("contain", name);
      question.checkFontSize(font);
    });
    it(" > should be able to select large font size", () => {
      const select = question.getFontSizeSelect();
      const { name, font } = Helpers.fontSize("large");

      select.click({ force: true });

      question.getLargeFontSizeOption().click({ force: true });

      select.should("contain", name);
      question.checkFontSize(font);
    });
    it(" > should be able to select extra large font size", () => {
      const select = question.getFontSizeSelect();
      const { name, font } = Helpers.fontSize("xlarge");

      select.click({ force: true });

      question.getExtraLargeFontSizeOption().click({ force: true });

      select.should("contain", name);
      question.checkFontSize(font);
    });
    it(" > should be able to select huge font size", () => {
      const select = question.getFontSizeSelect();
      const { name, font } = Helpers.fontSize("xxlarge");

      select.click({ force: true });

      question.getHugeFontSizeOption().click({ force: true });

      select.should("contain", name);
      question.checkFontSize(font);
    });
    it(" > should be able to change maximum width", () => {
      const width = 666;
      question.expandAdvancedOptions();

      question
        .getMaxWidth()
        .type(`{selectall}${width}`)
        .should("have.value", `${width}`);

      question
        .getHotspotMap()
        .should("have.css", "max-width")
        .and("eq", `${width}px`);
    });

    context("Hint and solution block testing", () => {
      validateSolutionBlockTests(queData.group, queData.queType);
    });
  });

  context(" > Scoring block", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();
      // create new que and select type
      editItem.chooseQuestion(queData.group, queData.queType);
      cy.uploadFile("testImages/sample.jpg", "input[type=file]");
      question.isImageDisplayedInQuesArea();
      question.isImageDisplayedInAnsArea();
      question.changeImageHeight(queData.imageHeight);
      question.changeImageWidth(queData.imageWidth);
      question.drawRectangle(spotPoints1);
      question.drawRectangle(spotPoints2);
      question.drawRectangle(spotPoints3);
      question.verifyNumberOfPolygonInDrawArea(3);
    });

    afterEach(() => {
      preview = editItem.header.preview();
      question.clickClearInPreview();
      editItem.header.edit();
    });

    it(" > Test score with exact match", () => {
      // Set answer and points
      question.enterPoints("4");
      question.clickPolygonInAnswerArea(0);

      preview = question.header.preview();
      // Correct answer
      question.clickPolygonInAnswerArea(0);
      preview.checkScore("4/4");
      question.verifyPolygonColorInPreview(0, queColor.GREEN_1);

      question.clickClearInPreview();
      // Incorrect answer
      question.clickPolygonInAnswerArea(1);
      preview.checkScore("0/4");
      question.verifyPolygonColorInPreview(1, queColor.LIGHT_RED2);

      editItem.header.edit();

      question.clickMultipleCheck(true);
      question.clickPolygonInAnswerArea(1);

      // Partial answer
      preview = question.header.preview();
      question.clickPolygonInAnswerArea(0);
      preview.checkScore("0/4");
      question.verifyPolygonColorInPreview(0, queColor.GREEN_1);
      question.clickClearInPreview();

      // Correct answer
      question.clickPolygonInAnswerArea(0);
      question.clickPolygonInAnswerArea(1);
      preview.checkScore("4/4");
      question.verifyPolygonColorInPreview(0, queColor.GREEN_1);
      question.verifyPolygonColorInPreview(1, queColor.GREEN_1);
    });

    it(" > Test score with partial match", () => {
      question.enterPoints("3");
      editItem.showAdvancedOptions();
      question.selectScoringType("Partial match");

      preview = question.header.preview();
      question.clickPolygonInAnswerArea(0);
      question.clickPolygonInAnswerArea(2);
      preview.checkScore("1.5/3");
      question.verifyPolygonColorInPreview(0, queColor.GREEN_1);
      question.verifyPolygonColorInPreview(2, queColor.LIGHT_RED2);
      question.clickClearInPreview();

      question.clickPolygonInAnswerArea(0);
      question.clickPolygonInAnswerArea(1);
      preview.checkScore("3/3");
      question.verifyPolygonColorInPreview(0, queColor.GREEN_1);
      question.verifyPolygonColorInPreview(1, queColor.GREEN_1);
    });

    it(" > Test score with partial match with round", () => {
      editItem.showAdvancedOptions();
      question.selectRoundingOption("Round down");

      preview = question.header.preview();
      question.clickPolygonInAnswerArea(0);
      question.clickPolygonInAnswerArea(2);
      preview.checkScore("1/3");
      question.verifyPolygonColorInPreview(0, queColor.GREEN_1);
      question.verifyPolygonColorInPreview(2, queColor.LIGHT_RED2);
      question.clickClearInPreview();

      question.clickPolygonInAnswerArea(0);
      question.clickPolygonInAnswerArea(1);
      preview.checkScore("3/3");
      question.verifyPolygonColorInPreview(0, queColor.GREEN_1);
      question.verifyPolygonColorInPreview(1, queColor.GREEN_1);
    });

    it(" > Test score with partial match with round and with penalty", () => {
      editItem.showAdvancedOptions();
      question.selectRoundingOption("None");
      question.enterPenalty("2");

      preview = question.header.preview();
      question.clickPolygonInAnswerArea(0);
      question.clickPolygonInAnswerArea(2);
      preview.checkScore("0.5/3");
      question.verifyPolygonColorInPreview(0, queColor.GREEN_1);
      question.verifyPolygonColorInPreview(2, queColor.LIGHT_RED2);
      question.clickClearInPreview();

      question.clickPolygonInAnswerArea(0);
      question.clickPolygonInAnswerArea(1);
      preview.checkScore("3/3");
      question.verifyPolygonColorInPreview(0, queColor.GREEN_1);
      question.verifyPolygonColorInPreview(1, queColor.GREEN_1);

      editItem.header.edit();
      editItem.showAdvancedOptions();
      question.enterPoints("5");
      question.selectRoundingOption("Round down");

      preview = question.header.preview();
      question.clickPolygonInAnswerArea(0);
      question.clickPolygonInAnswerArea(2);
      preview.checkScore("1/5");
      question.verifyPolygonColorInPreview(0, queColor.GREEN_1);
      question.verifyPolygonColorInPreview(2, queColor.LIGHT_RED2);
      question.clickClearInPreview();

      question.clickPolygonInAnswerArea(0);
      question.clickPolygonInAnswerArea(1);
      preview.checkScore("5/5");
      question.verifyPolygonColorInPreview(0, queColor.GREEN_1);
      question.verifyPolygonColorInPreview(1, queColor.GREEN_1);
    });

    /* it(" > Test score with partial match with round and with penalty", () => {
      editItem.showAdvancedOptions()
      question.selectRoundingOption("None")
      question.enterPenalty("0")

      question.addAlternate()
    }) */
  });
});
