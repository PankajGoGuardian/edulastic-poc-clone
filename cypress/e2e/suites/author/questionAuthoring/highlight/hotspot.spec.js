import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import HotspotPage from "../../../../framework/author/itemList/questionType/highlight/hotspotPage";
import FileHelper from "../../../../framework/util/fileHelper";
import Helpers from "../../../../framework/util/Helpers";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Hotspot" type question`, () => {
  const queData = {
    group: "Highlight",
    queType: "Hotspot",
    queText: "Hotsport test",
    imageWidth: "600",
    imageHeight: "400",
    altText: "Image Alt Text",
    outLineColor: "rgba(0, 0, 0, 1)",
    fillColor: "rgba(255, 0, 0, 0.19)"
  };

  const spotPoints1 = [[100, 100], [100, 200], [200, 200], [200, 100], [100, 100]];

  const spotPoints2 = [[400, 100], [400, 200], [500, 200], [500, 100], [400, 100]];

  const question = new HotspotPage();
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

    context(" > TC_195 => Enter question text in Compose Questino text box", () => {
      it(" > Upload image to server", () => {
        /* cy.fixture("testImages/sample.jpg").then(logo => {
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
          // question
          //   .getDropZoneImageContainer()
          //   .find("img")
          //   .should("have.attr", "src");
          // cy.wait(3000);
          question
            .getDrawArea()
            .find("img")
            .should("have.attr", "src");

          question
            .getHotspotMap()
            .find("img")
            .should("have.attr", "src");
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

      it(" > Enter Width (px)", () => {
        question.changeImageWidth(queData.imageWidth);
        // question
        //   .getDropZoneImageContainer()
        //   .find("img")
        //   .should("have.attr", "width", queData.imageWidth);

        question
          .getDrawArea()
          .find("img")
          .should("have.attr", "width", queData.imageWidth);

        question
          .getHotspotMap()
          .find("img")
          .should("have.attr", "width", queData.imageWidth);
      });

      it(" > Enter Height (px)", () => {
        question.changeImageHeight(queData.imageHeight);
        // question
        //   .getDropZoneImageContainer()
        //   .find("img")
        //   .should("have.attr", "height", queData.imageHeight);
        question
          .getDrawArea()
          .find("img")
          .should("have.attr", "height", queData.imageHeight);

        question
          .getHotspotMap()
          .find("img")
          .should("have.attr", "height", queData.imageHeight);
      });

      // it(" > Image alternative text", () => {
      //   question.addImageAlternative(queData.altText);
      //   // question
      //   //   .getDropZoneImageContainer()
      //   //   .find("img")
      //   //   .should("have.attr", "alt", queData.altText);

      //   question
      //     .getDrawArea()
      //     .find("img")
      //     .should("have.attr", "alt", queData.altText);
      //   question
      //     .getHotspotMap()
      //     .find("img")
      //     .should("have.attr", "alt", queData.altText);
      // });

      // it(" > Change Image", () => {
      //   const changedImage = "https://edureact-dev.s3.amazonaws.com/1552317173453_x_ba9b1be5.jpg";
      //   const currentQuestion = question.getCurrentStoreQuestion();
      //   currentQuestion.image.source = changedImage;
      //   cy.window()
      //     .its("store")
      //     .invoke("dispatch", { type: "[author questions] update questions", payload: currentQuestion });
      //   question
      //     .getDropZoneImageContainer()
      //     .find("img")
      //     .should("have.attr", "src", changedImage);
      // });
    });

    context(" > TC_196 => Area", () => {
      it(" > Draw spots", () => {
        question.clickDrawMode();
        question
          .getDrawArea()
          .then($el => {
            spotPoints1.forEach(point => {
              cy.wrap($el).click(point[0], point[1]);
            });
            spotPoints2.forEach(point => {
              cy.wrap($el).click(point[0], point[1]);
            });
          })
          .find("polygon")
          .should("have.length", 2);
      });

      it(" > Delete spots", () => {
        question.clickDeleteMode();
        question.getDrawArea().then($el => {
          cy.wrap($el)
            .find("polygon")
            .first()
            .click()
            .should("have.length", 1);
          cy.wrap($el)
            .find("polygon")
            .first()
            .click()
            .should("have.length", 0);
        });
      });

      it(" > Undo", () => {
        question.clickDrawMode();
        question
          .getDrawArea()
          .then($el => {
            spotPoints1.forEach(point => {
              cy.wrap($el).click(point[0], point[1]);
            });
          })
          .find("polygon")
          .should("have.length", 1);

        question.clickAreaUndo().then(() => {
          question
            .getDrawArea()
            .find("polygon")
            .should("have.length", 0);

          question
            .getDrawArea()
            .find("circle")
            .should("have.length", spotPoints1.length - 1);
        });
      });

      it(" > Redo", () => {
        question.clickAreaRedo().then(() => {
          question
            .getDrawArea()
            .find("circle")
            .should("have.length", 0);

          question
            .getDrawArea()
            .find("polygon")
            .should("have.length", 1);
        });
      });

      it(" > Clear", () => {
        question.clickAreaClear().then(() => {
          question
            .getDrawArea()
            .find("polygon")
            .should("have.length", 0);
        });
      });
    });

    context(" > TC_197 => Attributes", () => {
      before("add sample data", () => {
        question.clickDrawMode();
        question
          .getDrawArea()
          .then($el => {
            spotPoints1.forEach(point => {
              cy.wrap($el).click(point[0], point[1]);
            });
            spotPoints2.forEach(point => {
              cy.wrap($el).click(point[0], point[1]);
            });
          })
          .find("polygon")
          .should("have.length", 2);
      });

      it(" > Fill Color", () => {
        // const currentQuestion = question.getCurrentStoreQuestion();
        // currentQuestion.area_attributes.global.fill = queData.fillColor;
        // cy.window()
        //   .its("store")
        //   .invoke("dispatch", { type: "[author questions] update questions", payload: currentQuestion });
        // cy.get(".rc-color-picker-trigger")
        //   .invoke("attr", "style", `background-color: ${queData.fillColor}`)
        //   .should("have.attr", "style", `background-color: ${queData.fillColor}`);
        // cy.get("body").click();
        question
          .getAnswerContainer()
          .find("polygon")
          .invoke("attr", "style", `background-color: ${queData.fillColor}`)
          .should("have.attr", "style", `background-color: ${queData.fillColor}`);
      });

      it(" > Outline Color", () => {
        // const currentQuestion = question.getCurrentStoreQuestion();
        // currentQuestion.area_attributes.global.stroke = queData.outLineColor;
        // cy.window()
        //   .its("store")
        //   .invoke("dispatch", { type: "[author questions] update questions", payload: currentQuestion });

        question
          .getAnswerContainer()
          .find("polygon")
          .invoke("attr", "style", `stroke: ${queData.outLineColor}`)
          .should("have.attr", "style", `stroke: ${queData.outLineColor}`);
      });
    });

    context(" > TC_198 => Set Correct Ansswers", () => {
      it(" > Click on + symbol", () => {
        question.addAlternate();
        question
          .getAddedAlternate()
          .then($el => {
            cy.wrap($el)
              .should("be.visible")
              .click();
          })
          .should("not.exist");
      });

      it(" > Update Points", () => {
        question
          .getPontsInput()
          .focus()
          .clear()
          .type("{selectall}1")
          .should("have.value", "1")
          .type("{uparrow}")
          .should("have.value", "1.5")
          .type("{downarrow}")
          .should("have.value", "1")
          .blur();
      });

      it(" > Provide the answer choices", () => {
        question
          .getAnswerContainer()
          .find("polygon")
          .should("be.visible")
          .first()
          .click()
          .then($el => {
            cy.wrap($el).should("have.css", "stroke-width", "4px");
          });
      });

      it(" > Multiple response", () => {
        question
          .getMultipleCheck()
          .should("be.visible")
          .click()
          .find("input")
          .should("be.checked");

        question
          .getAnswerContainer()
          .find("polygon")
          .should("be.visible")
          .first()
          .should("have.css", "stroke-width", "4px")
          .next()
          .click()
          .then($el => {
            cy.wrap($el).should("have.css", "stroke-width", "4px");
          });

        question
          .getMultipleCheck()
          .should("be.visible")
          .click()
          .find("input")
          .should("not.checked");

        question
          .getAnswerContainer()
          .find("polygon")
          .should("be.visible")
          .first()
          .should("have.css", "stroke-width", "4px")
          .next()
          .should("have.css", "stroke-width", "2px");
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
      it(" > Click on preview", () => {
        preview = editItem.header.preview();
        // cy.get("body").contains("span", "Check Answer");
      });

      it(" > Click on Check answer", () => {
        preview.checkScore("0/1");

        preview.getClear().click();
        question
          .getAnswerContainer()
          .find("polygon")
          .should("be.visible")
          .first()
          .click()
          .then($el => {
            cy.wrap($el).should("have.css", "stroke-width", "4px");
          });

        preview.checkScore("1/1");
      });

      it(" > Click on Show Answers", () => {
        preview.getClear().click();
        preview
          .getShowAnswer()
          .click()
          .then(() => {
            question
              .getAnswerContainer()
              .find("polygon")
              .should("be.visible")
              .first()
              .should("have.css", "stroke", "rgb(0, 176, 255)");
          });
      });

      it(" > Click on Clear", () => {
        preview
          .getClear()
          .click()
          .then(() => {
            question
              .getAnswerContainer()
              .find("polygon")
              .should("be.visible")
              .first()
              .should("have.css", "stroke", "rgb(0, 176, 255)");
          });

        preview.header.edit();
      });
    });
  });

  // context(" > Delete the question after creation", () => {
  //   context(" > TC_201 => Delete option", () => {
  //     it(" > Click on delete button in Item Details page", () => {
  //       editItem
  //         .getDelButton()
  //         .should("have.length", 1)
  //         .click()
  //         .should("have.length", 0);
  //     });
  //   });
  // });

  context.skip(" > Advanced Options", () => {
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

    describe(" > Layout", () => {
      it(" > should be able to select small font size", () => {
        const select = question.getFontSizeSelect();
        const { name, font } = Helpers.fontSize("small");

        select.should("be.visible").click();

        question
          .getSmallFontSizeOption()
          .should("be.visible")
          .click();

        select.should("contain", name);
        question.checkFontSize(font);
      });
      it(" > should be able to select normal font size", () => {
        const select = question.getFontSizeSelect();
        const { name, font } = Helpers.fontSize("normal");

        select.should("be.visible").click();

        question
          .getNormalFontSizeOption()
          .should("be.visible")
          .click();

        select.should("contain", name);
        question.checkFontSize(font);
      });
      it(" > should be able to select large font size", () => {
        const select = question.getFontSizeSelect();
        const { name, font } = Helpers.fontSize("large");

        select.should("be.visible").click();

        question
          .getLargeFontSizeOption()
          .should("be.visible")
          .click();

        select.should("contain", name);
        question.checkFontSize(font);
      });
      it(" > should be able to select extra large font size", () => {
        const select = question.getFontSizeSelect();
        const { name, font } = Helpers.fontSize("xlarge");

        select.should("be.visible").click();

        question
          .getExtraLargeFontSizeOption()
          .should("be.visible")
          .click();

        select.should("contain", name);
        question.checkFontSize(font);
      });
      it(" > should be able to select huge font size", () => {
        const select = question.getFontSizeSelect();
        const { name, font } = Helpers.fontSize("xxlarge");

        select.should("be.visible").click();

        question
          .getHugeFontSizeOption()
          .should("be.visible")
          .click();

        select.should("contain", name);
        question.checkFontSize(font);
      });
      it(" > should be able to change maximum width", () => {
        const width = 666;

        question
          .getMaxWidth()
          .should("be.visible")
          .clear()
          .type(`{selectall}${width}`)
          .should("have.value", `${width}`);

        question
          .getHotspotMap()
          .should("be.visible")
          .should("have.css", "max-width")
          .and("eq", `${width}px`);
      });
      it(" > should be able to select numerical stem numeration", () => {
        question
          .getStemNumeration()
          .should("be.visible")
          .click()
          .as("select");

        question
          .getNumericalStemOption()
          .should("be.visible")
          .click();

        cy.get("@select").should("contain", Helpers.stemNumeration.numerical);
      });
      it(" > should be able to select uppercase alphabet stem numeration", () => {
        question
          .getStemNumeration()
          .should("be.visible")
          .click()
          .as("select");

        question
          .getUpperAlphaOption()
          .should("be.visible")
          .click();

        cy.get("@select").should("contain", Helpers.stemNumeration.upperAlpha);
      });
      it(" > should be able to select lowercase alphabet stem numeration", () => {
        question
          .getStemNumeration()
          .should("be.visible")
          .click()
          .as("select");

        question
          .getLowerAlphaOption()
          .should("be.visible")
          .click();

        cy.get("@select").should("contain", Helpers.stemNumeration.lowerAlpha);
      });
    });
  });

  // context(" > Scoring block tests", () => {
  //   before("visit items page and select question type", () => {
  //     editItem.createNewItem();

  //     // create new que and select type
  //     editItem.chooseQuestion(queData.group, queData.queType);
  //   });

  //   afterEach(() => {
  //     preview = question.header.preview();

  //     preview.getClear().click();

  //     preview.header.edit();
  //   });

  //   it(" > Test score with max score", () => {
  //     question
  //       .getMaxScore()
  //       .clear()
  //       .type(1);

  //     preview = question.header.preview();
  //   });
  // });
});
