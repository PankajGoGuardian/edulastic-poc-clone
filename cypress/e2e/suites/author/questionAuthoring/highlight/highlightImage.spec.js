import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import HightlightImagePage from "../../../../framework/author/itemList/questionType/highlight/highlightImagePage";
import FileHelper from "../../../../framework/util/fileHelper";
import Helpers from "../../../../framework/util/Helpers";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import { DRAWING_TOOLS } from "../../../../framework/constants/questionAuthoring";
import validateSolutionBlockTests from "../../../../framework/author/itemList/questionType/common/validateSolutionBlockTests";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Highlight Image" type question`, () => {
  const queData = {
    group: "Highlight",
    queType: "Drawing Response",
    queText: "Highlight image test",
    imageWidth: "600",
    imageHeight: "400",
    altText: "Image Alt Text",
    color1: "rgb(0, 255, 0)",
    color2: "rgb(0, 0, 0)"
  };

  const question = new HightlightImagePage();
  const editItem = new EditItemPage();
  const itemList = new ItemListPage();
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

    context(" > TC_238 => Image upload area", () => {
      it(" > Upload image to server", () => {
        question.getImagePreview().should("not.exist");
        cy.uploadFile("testImages/sample.jpg", "input[type=file]").then(() => {
          question
            .getImagePreview()
            .should("exist")
            .and("have.css", "background-image");
        });
      });

      it(" > Enter Width (px) and Height (px)", () => {
        question.changeImageWidth(queData.imageWidth);
        question.changeImageHeight(queData.imageHeight);
        question
          .getImagePreview()
          .should("have.css", "background-size", `${queData.imageWidth}px ${queData.imageHeight}px`);
      });

      it(" > Verify image alternative text", () => {
        question.addImageAlternative(queData.altText);
        preview = editItem.header.preview();
        question.verifyAlternativeTextInImage(queData.altText);
        preview.header.edit();
      });
    });

    context(" > TC_240 => Save question", () => {
      it(" > Click on save button", () => {
        question.getQuestionText().type(`{selectall}${queData.queText}`);
        question.header.save();
        cy.url().should("contain", "item-detail");
      });
    });

    context(" > TC_241 => Preview", () => {
      it(" > Shoud not be visible Check Answer", () => {
        preview = editItem.header.preview();
        cy.contains("span", "Check Answer").should("not.be.visible");
      });

      it(" > Click on Clear", () => {
        preview
          .getClear()
          .should("be.visible")
          .click();
        question.getDrawedElements().should("have.length", 0);
        preview.header.edit();
      });
    });

    context(" > Verify Drawing tool's in preview", () => {
      before("click on preview", () => {
        preview = editItem.header.preview();
      });
      // click and drag needs analysis
      it("> Verify freedraw tool", () => {
        question.selectDrawingToolsByName(DRAWING_TOOLS.FREE_DRAW);
        question.getDrawableElementInPreview().trigger("mousedown", { clientX: 200, clientY: 300 });
        question.getDrawableElementInPreview().trigger("mousemove", { clientX: 300, clientY: 300 });
        question.getDrawableElementInPreview().trigger("mouseleave", { clientX: 300, clientY: 300 });
        preview.getClear().click();
        // asertion pending
      });

      it(" > Verify breaking line", () => {
        question.getDrawedElements().should("have.length", 0);
        preview = editItem.header.preview();
        question.selectDrawingToolsByName(DRAWING_TOOLS.BREAKING_LINE);
        question
          .getDrawableElementInPreview()
          .click(100, 100)
          .click(200, 100)
          .click(200, 200)
          .click(100, 200)
          .dblclick(100, 100);
        preview.getClear().click();
        //    assert drawn content pending
      });
      it(" > Verify Curve line", () => {
        question.getDrawedElements().should("have.length", 0);
        preview = editItem.header.preview();
        question.selectDrawingToolsByName(DRAWING_TOOLS.CURVE_LINE);
        question
          .getDrawableElementInPreview()
          .click(100, 100)
          .click(200, 100)
          .click(200, 200)
          .click(100, 200)
          .dblclick(100, 100);
        preview.getClear().click();
        //    assert drawn content pending
      });
      it(" > Verify Square draw tool", () => {
        question.getDrawedElements().should("have.length", 0);
        preview = editItem.header.preview();
        question.selectDrawingToolsByName(DRAWING_TOOLS.SQUARE);
        preview.getClear().click();
        // needs drag
        //    assert drawn content pending
      });
      it(" > Verify Circle draw tool", () => {
        question.getDrawedElements().should("have.length", 0);
        preview = editItem.header.preview();
        question.selectDrawingToolsByName(DRAWING_TOOLS.CIRCLE);
        preview.getClear().click();
        // needs drag
        //    assert drawn content pending
      });
      it(" > Verify Triangle draw tool", () => {
        question.getDrawedElements().should("have.length", 0);
        preview = editItem.header.preview();
        question.selectDrawingToolsByName(DRAWING_TOOLS.TRIANGLE);
        // needs drag
        preview.getClear().click();
        //    assert drawn content pending
      });
      it(" > Verify Text", () => {
        question.getDrawedElements().should("have.length", 0);
        preview = editItem.header.preview();
        question.selectDrawingToolsByName(DRAWING_TOOLS.TEXT);
        question
          .getDrawableElementInPreview()
          .click(100, 100)
          .type("text in image");
        preview.getClear().click();
        //    assert drawn content pending
      });
      it(" > Verify Math tool", () => {
        preview = editItem.header.preview();
        question.selectDrawingToolsByName(DRAWING_TOOLS.MATH);
        question.getDrawableElementInPreview().click(100, 100);
        question.getMathInputBox().type("2/4{ENTER}");
        preview.getClear().click();
        //    assert drawn content pending
      });
    });

    context(" > Advanced Options", () => {
      before("visit items page and select question type", () => {
        editItem.createNewItem();

        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
        cy.get("body")
          .contains(" ADVANCED OPTIONS")
          .click();
      });

      beforeEach(() => {
        editItem.header.edit();
      });

      afterEach(() => {
        editItem.header.edit();
      });

      describe(" > Layout", () => {
        it(" > should be able to select small font size", () => {
          const select = question.getFontSizeSelect();
          const { name, font } = Helpers.fontSize("small");

          select.click({ force: true });

          question.getSmallFontSizeOption().click({ force: true });

          select.should("contain", name);
          question.getQuestionText().type(`{selectall}${queData.queText}`);
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
        it(" > should be able to change line width", () => {
          const width = 6;

          question
            .getLineWidth()
            .clear()
            .type(`{selectall}${width}`)
            .should("have.value", `${width}`);
        });
      });
    });
  });
  context(" > Edit the question created", () => {
    before("delete old question and create dummy que to edit", () => {
      editItem.createNewItem();

      // create new que and select type
      editItem.chooseQuestion(queData.group, queData.queType);
      question.getQuestionText().type(`{selectall}${queData.queText}`);

      question.header.saveAndgetId().then(id => {
        cy.url().should("contain", "item-detail");
        itemList.sidebar.clickOnItemBank();
        itemList.searchFilters.clearAll();
        itemList.searchFilters.getAuthoredByMe();
        itemList.clickOnViewItemById(id);
        itemList.itemPreview.clickEditOnPreview();
      });
    });
    context(" > TC_238 => Image upload area", () => {
      it(" > Upload image to server", () => {
        question.getImagePreview().should("not.exist");
        cy.uploadFile("testImages/sample.jpg", "input[type=file]").then(() => {
          question
            .getImagePreview()
            .should("exist")
            .and("have.css", "background-image");
        });
      });

      it(" > Enter Width (px) and Height (px)", () => {
        question.changeImageWidth(queData.imageWidth);
        question.changeImageHeight(queData.imageHeight);
        question
          .getImagePreview()
          .should("have.css", "background-size", `${queData.imageWidth}px ${queData.imageHeight}px`);
      });

      it(" > Verify image alternative text", () => {
        question.addImageAlternative(queData.altText);
        preview = editItem.header.preview();
        question.verifyAlternativeTextInImage(queData.altText);
        preview.header.edit();
      });
    });

    context(" > TC_240 => Save question", () => {
      it(" > Click on save button", () => {
        question.getQuestionText().type(`{selectall}${queData.queText}`);
        question.header.getSaveButton().click({ force: true });
        cy.url().should("contain", "item-detail");
      });
    });

    context(" > TC_241 => Preview", () => {
      it(" > Shoud not be visible Check Answer", () => {
        preview = editItem.header.preview();
        cy.contains("span", "Check Answer").should("not.be.visible");
      });

      it(" > Click on Clear", () => {
        preview
          .getClear()
          .should("be.visible")
          .click();
        question.getDrawedElements().should("have.length", 0);
        preview.header.edit();
      });
    });

    context(" > Verify Drawing tool's in preview", () => {
      before("click on preview", () => {
        preview = editItem.header.preview();
      });

      it("> Verify freedraw tool", () => {
        question.selectDrawingToolsByName(DRAWING_TOOLS.FREE_DRAW);
        question.getDrawableElementInPreview().trigger("mousedown", { clientX: 200, clientY: 300 });
        question.getDrawableElementInPreview().trigger("mousemove", { clientX: 300, clientY: 300 });
        question.getDrawableElementInPreview().trigger("mouseleave", { clientX: 300, clientY: 300 });
        preview.getClear().click();
      });

      it(" > Verify breaking line", () => {
        question.getDrawedElements().should("have.length", 0);
        preview = editItem.header.preview();
        question.selectDrawingToolsByName(DRAWING_TOOLS.BREAKING_LINE);
        question
          .getDrawableElementInPreview()
          .click(100, 100)
          .click(200, 100)
          .click(200, 200)
          .click(100, 200)
          .dblclick(100, 100);
        preview.getClear().click();
        //    assert drawn content pending
      });
      it(" > Verify Curve line", () => {
        question.getDrawedElements().should("have.length", 0);
        preview = editItem.header.preview();
        question.selectDrawingToolsByName(DRAWING_TOOLS.CURVE_LINE);
        question
          .getDrawableElementInPreview()
          .click(100, 100)
          .click(200, 100)
          .click(200, 200)
          .click(100, 200)
          .dblclick(100, 100);
        preview.getClear().click();
        //    assert drawn content pending
      });
      it(" > Verify Square draw tool", () => {
        question.getDrawedElements().should("have.length", 0);
        preview = editItem.header.preview();
        question.selectDrawingToolsByName(DRAWING_TOOLS.SQUARE);
        preview.getClear().click();
        // needs drag
        //    assert drawn content pending
      });
      it(" > Verify Circle draw tool", () => {
        question.getDrawedElements().should("have.length", 0);
        preview = editItem.header.preview();
        question.selectDrawingToolsByName(DRAWING_TOOLS.CIRCLE);
        preview.getClear().click();
        // needs drag
        //    assert drawn content pending
      });
      it(" > Verify Triangle draw tool", () => {
        question.getDrawedElements().should("have.length", 0);
        preview = editItem.header.preview();
        question.selectDrawingToolsByName(DRAWING_TOOLS.TRIANGLE);
        // needs drag
        preview.getClear().click();
        //    assert drawn content pending
      });
      it(" > Verify Text", () => {
        question.getDrawedElements().should("have.length", 0);
        preview = editItem.header.preview();
        question.selectDrawingToolsByName(DRAWING_TOOLS.TEXT);
        question
          .getDrawableElementInPreview()
          .click(100, 100)
          .type("text in image");
        preview.getClear().click();
        //    assert drawn content pending
      });
      it(" > Verify Math tool", () => {
        preview = editItem.header.preview();
        question.selectDrawingToolsByName(DRAWING_TOOLS.MATH);
        question.getDrawableElementInPreview().click(100, 100);
        question.getMathInputBox().type("2/4{ENTER}");
        //    assert drawn content pending
        preview.getClear().click();
      });
    });
    context(" > Advanced Options", () => {
      before("visit items page and select question type", () => {
        editItem.createNewItem();

        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
        cy.get("body")
          .contains(" ADVANCED OPTIONS")
          .click();
      });

      beforeEach(() => {
        editItem.header.edit();
      });

      afterEach(() => {
        editItem.header.edit();
      });

      describe(" > Layout", () => {
        it(" > should be able to select small font size", () => {
          const select = question.getFontSizeSelect();
          const { name, font } = Helpers.fontSize("small");

          select.click({ force: true });

          question.getSmallFontSizeOption().click({ force: true });

          select.should("contain", name);
          question.getQuestionText().type(`{selectall}${queData.queText}`);
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
        it(" > should be able to change line width", () => {
          cy.get("body")
            .contains(" ADVANCED OPTIONS")
            .click();

          const width = 6;

          question
            .getLineWidth()
            .clear()
            .type(`{selectall}${width}`)
            .should("have.value", `${width}`);
        });
      });
    });
  });
  validateSolutionBlockTests(queData.group, queData.queType);
});

// Pending -> click and draw in drawing pad and assertion of drawn content in Preview
