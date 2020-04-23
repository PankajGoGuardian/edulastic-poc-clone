import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import HightlightImagePage from "../../../../framework/author/itemList/questionType/highlight/highlightImagePage";
import FileHelper from "../../../../framework/util/fileHelper";
import Helpers from "../../../../framework/util/Helpers";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import { DRAWING_TOOLS } from "../../../../framework/constants/questionAuthoring";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Highlight Image" type question`, () => {
  const queData = {
    group: "Highlight",
    queType: "Highlight Image",
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
        /*   cy.fixture("testImages/sample.jpg").then(logo => {
          Cypress.Blob.base64StringToBlob(logo, "image/jpg").then(blob => {
            cy.uploadImage(blob).then(result => {
              // update uploaded image link to store
              const imageUrl = result.response.body.result.fileUri;
              const currentQuestion = question.getCurrentStoreQuestion();
              currentQuestion.image.source = imageUrl;
              cy.window()
                .its("store")
                .invoke("dispatch", { type: "[author questions] update questions", payload: currentQuestion });
              question
                .getDropZoneImageContainer()
                .find("img")
                .should("have.attr", "src", imageUrl);
            });
          });
        }); */
        question.getImagePreview().should("not.exist");
        cy.uploadFile("testImages/sample.jpg", "input[type=file]").then(() => {
          question
            .getImagePreview()
            .should("exist")
            .and("have.css", "background-image");
        });

        // test with local image
        // const testImageUrl = "https://edureact-dev.s3.amazonaws.com/1551154644960_blob";
        // const currentQuestion = question.getCurrentStoreQuestion();
        // currentQuestion.image.source = testImageUrl;
        // cy.window()
        //   .its("store")
        //   .invoke("dispatch", { type: "[author questions] update questions", payload: currentQuestion });
        // question
        //   .getDropZoneImageContainer()
        //   .find("img")
        //   .should("have.attr", "src", testImageUrl);
      });

      it(" > Enter Width (px) and Height (px)", () => {
        question.changeImageWidth(queData.imageWidth);
        question.changeImageHeight(queData.imageHeight);
        question
          .getImagePreview()
          .should("have.css", "background-size", `${queData.imageWidth}px ${queData.imageHeight}px`);
      });

      // it(" > Image alternative text", () => {
      //   question.addImageAlternative(queData.altText);
      //   question
      //     .getDropZoneImageContainer()
      //     .find("img")
      //     .should("have.attr", "alt", queData.altText);
      // });
    });

    context.skip(" > TC_239 => Line color options", () => {
      it(" > Click on color", () => {
        const currentQuestion = question.getCurrentStoreQuestion();
        currentQuestion.line_color[0] = queData.color1;
        cy.window()
          .its("store")
          .invoke("dispatch", { type: "[author questions] update questions", payload: currentQuestion });
        cy.contains("div", "Line color 1")
          .next()
          .find(".rc-color-picker-trigger")
          .should("be.visible")
          .should("have.css", "background-color", queData.color1);
      });

      it(" > Add new color", () => {
        question.clickAddColor();
        cy.contains("div", "Line color 2").should("be.visible");
      });

      it(" > Delete Color", () => {
        cy.contains("div", "Line color 2")
          .next()
          .children()
          .last()
          .click()
          .then(() => {
            cy.contains("div", "Line color 2").should("not.exist");
          });
      });
    });

    context(" > TC_240 => Save question", () => {
      it(" > Click on save button", () => {
        question.getQuestionText().type(`{selectall}${queData.queText}`);
        question.header.save();
        cy.url().should("contain", "item-detail");
      });
    });

    context(" > TC_241 => Preview items", () => {
      it(" > Click on preview", () => {
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
        question.getDrawedElements().should("have.length", 1);
      });

      it(" > Shoud not be visible Check Answer", () => {
        cy.contains("span", "Check Answer").should("not.be.visible");
        // cy.contains("span", "Show Answers").should("not.visible");
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
      // editItem.showAdvancedOptions();// UI toggle has been removed
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

    context(" > TC_243 => Image upload area", () => {
      it(" > Upload image to server", () => {
        /*  cy.fixture("testImages/sample.jpg").then(logo => {
          Cypress.Blob.base64StringToBlob(logo, "image/jpg").then(blob => {
            cy.uploadImage(blob).then(result => {
              // update uploaded image link to store
              const imageUrl = result.response.body.result.fileUri;
              const currentQuestion = question.getCurrentStoreQuestion();
              currentQuestion.image.source = imageUrl;
              cy.window()
                .its("store")
                .invoke("dispatch", { type: "[author questions] update questions", payload: currentQuestion });
              question
                .getDropZoneImageContainer()
                .find("img")
                .should("have.attr", "src", imageUrl);
            });
          });
        }); */

        cy.uploadFile("testImages/sample.jpg", "input[type=file]").then(() => {
          question
            .getImagePreview()
            .should("exist")
            .and("have.css", "background-image");
        });

        // test with local image
        // const testImageUrl = 'https://edureact-dev.s3.amazonaws.com/1551154644960_blob';
        // const currentQuestion = question.getCurrentStoreQuestion()
        // currentQuestion.image.source = testImageUrl;
        // cy.window()
        //   .its('store')
        //   .invoke('dispatch', { type: '[author questions] update questions', payload: currentQuestion });
        // question.getDropZoneImageContainer().find('img').should("have.attr", "src", testImageUrl);
      });

      it(" > Enter Width (px) and Height (px)", () => {
        question.changeImageWidth(queData.imageWidth);
        question.changeImageHeight(queData.imageHeight);
        question
          .getImagePreview()
          .should("have.css", "background-size", `${queData.imageWidth}px ${queData.imageHeight}px`);
      });

      // it(" > Image alternative text", () => {
      //   question.addImageAlternative(queData.altText);
      //   question
      //     .getDropZoneImageContainer()
      //     .find("img")
      //     .should("have.attr", "alt", queData.altText);
      // });
    });

    context.skip(" > TC_244 => Line color options", () => {
      it(" > Click on color", () => {
        const currentQuestion = question.getCurrentStoreQuestion();
        currentQuestion.line_color[0] = queData.color1;
        cy.window()
          .its("store")
          .invoke("dispatch", { type: "[author questions] update questions", payload: currentQuestion });
        cy.contains("div", "Line color 1")
          .next()
          .find(".rc-color-picker-trigger")
          .should("be.visible")
          .should("have.css", "background-color", queData.color1);
      });

      it(" > Add new color", () => {
        question.clickAddColor();
        cy.contains("div", "Line color 2").should("be.visible");
      });

      it(" > Delete Color", () => {
        cy.contains("div", "Line color 2")
          .next()
          .children()
          .last()
          .click()
          .then(() => {
            cy.contains("div", "Line color 2").should("not.exist");
          });
      });
    });

    context(" > TC_245 => Save question", () => {
      it(" > Click on save button", () => {
        question.header.save(true);
        cy.url().should("contain", "item-detail");
      });
    });

    context(" > TC_246 => Preview Items", () => {
      it(" > Click on preview", () => {
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
        question.getDrawedElements().should("have.length", 1);
      });

      it(" > Shoud not be visible Check Answer", () => {
        cy.contains("span", "Check Answer").should("not.be.visible");
        // cy.contains("span", "Show Answers").should("not.visible");
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

    // context(" > TC_247 => Delete option", () => {
    //   it(" > Click on delete button in Item Details page", () => {
    //     editItem
    //       .getDelButton()
    //       .should("have.length", 1)
    //       .click()
    //       .should("have.length", 0);
    //   });
    // });
  });
});
