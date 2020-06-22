import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import DragAndDropPage from "../../../../framework/author/itemList/questionType/fillInBlank/dragAndDropPage";
import FileHelper from "../../../../framework/util/fileHelper";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import ScoringBlock from "../../../../framework/author/itemList/questionType/common/scoringBlock";
import { SCORING_TYPE } from "../../../../framework/constants/questionAuthoring";
import validateSolutionBlockTests from "../../../../framework/author/itemList/questionType/common/validateSolutionBlockTests";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Label Image with Drag & Drop" type question`, () => {
  const queData = {
    group: "Fill in the Blanks",
    queType: "Label Image with Drag & Drop",
    queText: "Indian state known as garden spice is:",
    choices: ["Kerala", "Delhi", "KL"],
    scoringChoices: ["Kerala", "Delhi", "Karnataka"],
    correct: ["Kerala"],
    alterate: ["KL"],
    extlink: "www.testdomain.com",
    formattext: "formattedtext",
    formula: "s=ar^2",
    points: "2",
    imageWidth: "500",
    imageHeight: "400",
    imagePosLeft: "100",
    imagePosTop: "50",
    imageAlternate: "Background",
    testColor: "#d49c9c",
    maxRes: "2"
  };

  const scoringBlock = new ScoringBlock();
  const question = new DragAndDropPage();
  const editItem = new EditItemPage();
  const itemList = new ItemListPage();

  before(() => {
    cy.login();
  });

  context(" > User creates question.", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();
      // add new question
      editItem.chooseQuestion(queData.group, queData.queType);
    });

    context(" > [Tc_370]:Tc_1 => Upload image and verify options", () => {
      it(" > Upload image to server", () => {
        cy.uploadFile("testImages/sample.jpg", "input[type=file]").then(() => {
          cy.wait(3000); // waiting for image to appear
        });
      });

      it(" > Width(px)", () => {
        question
          .clickOnKeepAspectRation()
          .find("input")
          .should("not.be.checked");
        question.changeImageWidth(queData.imageWidth);
        question.getImageWidth().should("have.css", "width", `${queData.imageWidth}px`);
        question.getImageInPreviewContainer().should("have.css", "width", `${queData.imageWidth}px`);
      });

      it(" > Height(px)", () => {
        question.changeImageHeight(queData.imageHeight);
        question.getImageHeight().should("have.css", "height", `${queData.imageHeight}px`);
        question.getImageInPreviewContainer().should("have.css", "height", `${queData.imageHeight}px`);
      });

      it(" > Left(px)", () => {
        question.changeImagePositionLeft(queData.imagePosLeft);
        question.getImageInPreviewContainer().should("have.css", "left", `${queData.imagePosLeft}px`);
      });

      it(" > Top(px)", () => {
        question.changeImagePositionTop(queData.imagePosTop);
        question.getImageInPreviewContainer().should("have.css", "top", `${queData.imagePosTop}px`);
      });

      it(" > Fill color", () => {
        question.updateColorPicker(queData.testColor);
        question.verifyFillColor(queData.testColor);
        for (let i = 0; i < 3; i++) {
          question.verifyFillColorInPreviewContainer(i, queData.testColor);
        }
      });
    });

    context(" > [Tc_371]:Tc_2 => verify additional options", () => {
      it(" > Maximum responses per container", () => {
        // set max response to 2
        question
          .getMaxResponseInput()
          .click()
          .type(`{selectall}${queData.maxRes}`)
          .should("have.value", queData.maxRes);
        question.dragAndDropResponseToBoard(0);
        question.dragAndDropResponseToBoard(0);
        question.verifyItemsInBoard("Option 1", 0);
        question.verifyItemsInBoard("Option 2", 0);
        question
          .getMaxResponseInput()
          .click()
          .type(`{selectall}${1}`)
          .should("have.value", "1");
      });

      it(" > Show dashed border", () => {
        question
          .getDashboardBorderCheck()
          .click()
          .find("input")
          .should("be.checked");
        question.verifyShowDashborder("2px dashed rgba(0, 0, 0, 0.65)");
        question
          .getDashboardBorderCheck()
          .click()
          .find("input")
          .should("not.be.checked");
        question.verifyShowDashborder("1px solid rgb(211, 211, 211)");
      });

      it(" > Edit ARIA labels", () => {
        question
          .getAriaLabelCheck()
          .click()
          .find("input")
          .should("be.checked");
        cy.get("body")
          .find(".iseditablearialabel")
          .should("be.visible");
        question
          .getAriaLabelCheck()
          .click()
          .find("input")
          .should("not.be.checked");
        cy.get("body")
          .find(".iseditablearialabel")
          .should("not.be.visible");
      });

      it(" > check/uncheck Show Drop Area Border", () => {
        question
          .getShowDropAreaCheck()
          .click()
          .find("input")
          .should("not.be.checked");
        question.verifyDropContainerIsVisible(0, false);

        question
          .getShowDropAreaCheck()
          .click()
          .find("input")
          .should("be.checked");
        question.verifyDropContainerIsVisible(0);
      });
    });

    context(" > [Tc_372]:Tc_3 => Possible responses block", () => {
      it(" > Delete Choices", () => {
        question.deleteAllChoices();
      });

      it(" > Add new choices", () => {
        queData.choices.forEach((ch, index) => {
          question.addNewChoice().updateChoiceByIndex(index, ch);
          question.getChoiceByIndex(index).should("contain.text", ch);

          // check added answers
          question.checkAddedAnswers(index, ch);
        });
      });

      it(" > Edit the default text", () => {
        question.addNewChoice();
        question.updateChoiceByIndex(queData.choices.length, queData.formattext);
        question.getChoiceByIndex(queData.choices.length).should("contain.text", queData.formattext);
        question.deleteChoiceByIndex(queData.choices.length);
      });
    });

    context(" > [Tc_373]:Tc_4 => Set Correct Answer(s)", () => {
      it(" > Update points", () => {
        question
          .updatePoints(queData.points)
          .type("{uparrow}")
          .type("{uparrow}")
          .should("have.value", `${Number(queData.points) + 1}`)
          .blur();
      });

      it(" > Add/Delete alternatives", () => {
        question.addAlternate();
        question.checkAndDeleteAlternates();
      });

      it(" > Drag and drop the responses", () => {
        // box to board
        question.dragAndDropResponseToBoard(0);
        question.dragAndDropBoardToBoard(0, 1);
        // board to board
      });

      it(" > Check/uncheck duplicate response check box", () => {
        question.getMultipleResponse().check({ force: true });
        question.getMultipleResponse().should("be.checked");
        question
          .getResponsesBox()
          .first()
          .invoke("text")
          .then(res => {
            question.dragAndDropResponseToBoard(0);
            question.getAddedAnsByindex(0).should("have.text", res);
            question.getMultipleResponse().uncheck({ force: true });
            question.getMultipleResponse().should("not.be.checked");
            question.getAddedAnsByindex(0).should("not.have.text", res);
            question
              .getResponsesBoard()
              .first()
              .contains(queData.choices[0])
              .should("not.exist");
            question.verifyItemsInBoard(queData.choices[0], 0, false);
          });
      });

      it(" > Check/uncheck Show Drag Handle", () => {
        question.getDragHandle().click({ force: true });
        question.getDragHandle().should("be.checked");
        question.getResponsesBox().each($el => {
          cy.wrap($el).should("be.visible");
        });
        question.getDragHandle().click({ force: true });
        question.getDragHandle().should("not.be.checked");
        question.getResponsesBox().each($el => {
          cy.wrap($el)
            .find("i")
            .should("not.be.visible");
        });
      });

      it(" > Check/uncheck Shuffle Possible responses", () => {
        question.getShuffleResponse().click({ force: true });
        question.getShuffleResponse().should("be.checked");
        question.getResponsesBox().each($el => {
          cy.wrap($el).should("be.visible");
        });
        question.getShuffleResponse().click({ force: true });
        question.getShuffleResponse().should("not.be.checked");
        question.getResponsesBox().each($el => {
          cy.wrap($el).should("be.visible");
        });
      });

      it(" > Check/uncheck Transparent possible responses", () => {
        question.getTransparentResponse().click({ force: true });
        question.getTransparentResponse().should("be.checked");
        question.getResponsesBoxTransparent();
        question.getTransparentResponse().click({ force: true });
        question.getTransparentResponse().should("not.be.checked");
        question.getResponsesBox();
      });

      it(" > Check/uncheck Transparent possible responses", () => {
        question.getTransparentResponse().click({ force: true });
      });

      it(" > Add Annotation in the question", () => {
        question.getAddAnnotationButton().click({ force: true });
        question.getAnnotationTextArea().type("Annotation");
        cy.wait(500);
        question.VerifyAnnotation("Annotation");
      });

      it(" >Set Correct Answers", () => {
        const preview = editItem.header.preview();
        preview.header.edit();
        question.deleteAllChoices();
        queData.choices.forEach((ch, index) => {
          question.addNewChoice().updateChoiceByIndex(index, ch);
          question.getChoiceByIndex(index).should("contain.text", ch);
          question.checkAddedAnswers(index, ch);
        });
        question.dragAndDropResponseToBoard(0);
        question.dragAndDropResponseToBoard(1);
        question.dragAndDropResponseToBoard(2);
      });
    });

    context(" > [Tc_374]:Tc_5 => Save Question", () => {
      it(" > Click on save button", () => {
        question.header.save();
        cy.url().should("contain", "item-detail");
      });
    });

    context(" > [Tc_375]:Tc_6 => Preview items", () => {
      it(" > Click on Preview, CheckAnswer", () => {
        const preview = editItem.header.preview();
        question.dragAndDropResponseToBoard(0);
        question.dragAndDropResponseToBoard(1);
        question.dragAndDropResponseToBoard(2);
        preview.checkScore("3/3");
      });

      it(" > Click on ShowAnswer", () => {
        const preview = editItem.header.preview();
        preview.getClear().click();
        preview
          .getShowAnswer()
          .click()
          .then(() => {
            queData.choices.forEach(ch => {
              cy.get(".correctanswer-box").should("contain.text", ch);
            });
          });
      });

      it(" > Click on Clear, Edit", () => {
        const preview = editItem.header.preview();
        preview
          .getClear()
          .click()
          .then(() => {
            cy.get(".correctanswer-box").should("not.exist");
            question.getResponsesBoard().should("have.length", 3);
          });
        preview.header.edit();
      });
    });
  });
  // [TODO]- pending- aspect ratio, pointers , SNAP FIT TO DROP AREA

  context(" > Edit the question created", () => {
    before("delete old question and create dummy que to edit", () => {
      editItem.createNewItem();
      editItem.chooseQuestion(queData.group, queData.queType);
      question.dragAndDropResponseToBoard(0);
      // add new question
      question.header.saveAndgetId().then(id => {
        cy.wait(3000);
        editItem.sideBar.clickOnItemBank();
        itemList.searchFilters.clearAll();
        itemList.searchFilters.getAuthoredByMe();
        itemList.clickOnViewItemById(id);
        itemList.itemPreview.clickOnEditItemOnPreview();
      });
    });

    context(" > [Tc_370]:Tc_1 => Upload image and verify options", () => {
      it(" > Upload image to server", () => {
        cy.uploadFile("testImages/sample.jpg", "input[type=file]").then(() => {
          cy.wait(3000); // waiting for image to appear
        });
      });

      it(" > Width(px)", () => {
        question
          .clickOnKeepAspectRation()
          .find("input")
          .should("not.be.checked");
        question.changeImageWidth(queData.imageWidth);
        question.getImageWidth().should("have.css", "width", `${queData.imageWidth}px`);
        question.getImageInPreviewContainer().should("have.css", "width", `${queData.imageWidth}px`);
      });

      it(" > Height(px)", () => {
        question.changeImageHeight(queData.imageHeight);
        question.getImageHeight().should("have.css", "height", `${queData.imageHeight}px`);
        question.getImageInPreviewContainer().should("have.css", "height", `${queData.imageHeight}px`);
      });

      it(" > Left(px)", () => {
        question.changeImagePositionLeft(queData.imagePosLeft);
        question.getImageInPreviewContainer().should("have.css", "left", `${queData.imagePosLeft}px`);
      });

      it(" > Top(px)", () => {
        question.changeImagePositionTop(queData.imagePosTop);
        question.getImageInPreviewContainer().should("have.css", "top", `${queData.imagePosTop}px`);
      });

      it(" > Fill color", () => {
        question.updateColorPicker(queData.testColor);
        question.verifyFillColor(queData.testColor);
        for (let i = 0; i < 3; i++) {
          question.verifyFillColorInPreviewContainer(i, queData.testColor);
        }
      });
    });
    context(" > [Tc_371]:Tc_2 => verify additional options", () => {
      it(" > Maximum responses per container", () => {
        question.deleteAllChoices();
        queData.choices.forEach((ch, index) => {
          question.addNewChoice().updateChoiceByIndex(index, ch);
          question.getChoiceByIndex(index).should("contain.text", ch);
          question.checkAddedAnswers(index, ch);
        });
        // set max response to 2
        question
          .getMaxResponseInput()
          .click()
          .type(`{selectall}${queData.maxRes}`)
          .should("have.value", queData.maxRes);
        question.dragAndDropResponseToBoard(0);
        question.dragAndDropResponseToBoard(0);
        question.verifyItemsInBoard(queData.choices[0], 0);
        question.verifyItemsInBoard(queData.choices[1], 0);
        question
          .getMaxResponseInput()
          .click()
          .type(`{selectall}${1}`)
          .should("have.value", "1");
      });

      it(" > Show dashed border", () => {
        question
          .getDashboardBorderCheck()
          .click()
          .find("input")
          .should("be.checked");
        question.verifyShowDashborder("2px dashed rgba(0, 0, 0, 0.65)");
        question
          .getDashboardBorderCheck()
          .click()
          .find("input")
          .should("not.be.checked");
        question.verifyShowDashborder("1px solid rgb(211, 211, 211)");
      });

      it(" > Edit ARIA labels", () => {
        question
          .getAriaLabelCheck()
          .click()
          .find("input")
          .should("be.checked");
        cy.get("body")
          .find(".iseditablearialabel")
          .should("be.visible");
        question
          .getAriaLabelCheck()
          .click()
          .find("input")
          .should("not.be.checked");
        cy.get("body")
          .find(".iseditablearialabel")
          .should("not.be.visible");
      });

      it(" > check/uncheck Show Drop Area Border", () => {
        question
          .getShowDropAreaCheck()
          .click()
          .find("input")
          .should("not.be.checked");
        question.verifyDropContainerIsVisible(0, false);

        question
          .getShowDropAreaCheck()
          .click()
          .find("input")
          .should("be.checked");
        question.verifyDropContainerIsVisible(0);
      });
    });

    context(" > [Tc_372]:Tc_3 => Possible responses block", () => {
      it(" > Delete Choices", () => {
        question.deleteAllChoices();
      });

      it(" > Add new choices", () => {
        queData.choices.forEach((ch, index) => {
          question.addNewChoice().updateChoiceByIndex(index, ch);
          question.getChoiceByIndex(index).should("contain.text", ch);

          // check added answers
          question.checkAddedAnswers(index, ch);
        });
      });

      it(" > Edit the default text", () => {
        question.addNewChoice();
        question.updateChoiceByIndex(queData.choices.length, queData.formattext);
        question.getChoiceByIndex(queData.choices.length).should("contain.text", queData.formattext);
        question.deleteChoiceByIndex(queData.choices.length);
      });
    });

    context(" > [Tc_373]:Tc_4 => Set Correct Answer(s)", () => {
      it(" > Update points", () => {
        question
          .updatePoints(queData.points)
          .type("{uparrow}")
          .type("{uparrow}")
          .should("have.value", `${Number(queData.points) + 1}`)
          .blur();
      });

      it(" > Add/Delete alternatives", () => {
        question.addAlternate();
        question.checkAndDeleteAlternates();
      });

      it(" > Drag and drop the responses", () => {
        // box to board
        question.dragAndDropResponseToBoard(0);
        question.dragAndDropBoardToBoard(0, 1);
        // board to board
      });

      it(" > Check/uncheck duplicate response check box", () => {
        question.getMultipleResponse().check({ force: true });
        question.getMultipleResponse().should("be.checked");
        question
          .getResponsesBox()
          .first()
          .invoke("text")
          .then(res => {
            question.dragAndDropResponseToBoard(0);
            question.getAddedAnsByindex(0).should("have.text", res);
            question.getMultipleResponse().uncheck({ force: true });
            question.getMultipleResponse().should("not.be.checked");
            question.getAddedAnsByindex(0).should("not.have.text", res);
            question
              .getResponsesBoard()
              .first()
              .contains(queData.choices[0])
              .should("not.exist");
            question.verifyItemsInBoard(queData.choices[0], 0, false);
          });
      });

      it(" > Check/uncheck Show Drag Handle", () => {
        question.getDragHandle().click({ force: true });
        question.getDragHandle().should("be.checked");
        question.getResponsesBox().each($el => {
          cy.wrap($el).should("be.visible");
        });
        question.getDragHandle().click({ force: true });
        question.getDragHandle().should("not.be.checked");
        question.getResponsesBox().each($el => {
          cy.wrap($el)
            .find("i")
            .should("not.be.visible");
        });
      });

      it(" > Check/uncheck Shuffle Possible responses", () => {
        question.getShuffleResponse().click({ force: true });
        question.getShuffleResponse().should("be.checked");
        question.getResponsesBox().each($el => {
          cy.wrap($el).should("be.visible");
        });
        question.getShuffleResponse().click({ force: true });
        question.getShuffleResponse().should("not.be.checked");
        question.getResponsesBox().each($el => {
          cy.wrap($el).should("be.visible");
        });
      });

      it(" > Check/uncheck Transparent possible responses", () => {
        question.getTransparentResponse().click({ force: true });
        question.getTransparentResponse().should("be.checked");
        question.getResponsesBoxTransparent();
        question.getTransparentResponse().click({ force: true });
        question.getTransparentResponse().should("not.be.checked");
        question.getResponsesBox();
      });

      it(" > Check/uncheck Transparent possible responses", () => {
        question.getTransparentResponse().click({ force: true });
      });

      it(" > Add Annotation in the question", () => {
        question.getAddAnnotationButton().click({ force: true });
        question.getAnnotationTextArea().type("Annotation");
        cy.wait(500);
        question.VerifyAnnotation("Annotation");
      });

      it(" >Set Correct Answers", () => {
        const preview = editItem.header.preview();
        preview.header.edit();
        question.deleteAllChoices();
        queData.choices.forEach((ch, index) => {
          question.addNewChoice().updateChoiceByIndex(index, ch);
          question.getChoiceByIndex(index).should("contain.text", ch);
          question.checkAddedAnswers(index, ch);
        });
        question.dragAndDropResponseToBoard(0);
        question.dragAndDropResponseToBoard(1);
        question.dragAndDropResponseToBoard(2);
      });
    });

    context(" > [Tc_374]:Tc_5 => Save Question", () => {
      it(" > Click on save button", () => {
        question.header.getSaveButton().click();
      });
    });

    context(" > [Tc_375]:Tc_6 => Preview items", () => {
      it(" > Click on Preview, CheckAnswer", () => {
        const preview = editItem.header.preview();
        question.dragAndDropResponseToBoard(0);
        question.dragAndDropResponseToBoard(1);
        question.dragAndDropResponseToBoard(2);
        preview.checkScore("3/3");
      });

      it(" > Click on ShowAnswer", () => {
        const preview = editItem.header.preview();
        preview.getClear().click();
        preview
          .getShowAnswer()
          .click({ force: true })
          .then(() => {
            queData.choices.forEach(ch => {
              cy.get(".correctanswer-box").should("contain.text", ch);
            });
          });
      });

      it(" > Click on Clear, Edit", () => {
        const preview = editItem.header.preview();
        preview
          .getClear()
          .click()
          .then(() => {
            cy.get(".correctanswer-box").should("not.exist");
            question.getResponsesBoard().should("have.length", 3);
          });
        preview.header.edit();
      });
    });
  });

  context(" > [Tc_376]: Scoring block tests", () => {
    before("Create question and set correct answer", () => {
      editItem.createNewItem();
      // add new question
      editItem.chooseQuestion(queData.group, queData.queType);
      cy.uploadFile("testImages/sample.jpg", "input[type=file]").then(() => {
        cy.wait(3000);
      });
      queData.scoringChoices.forEach((ch, index) => {
        question.updateChoiceByIndex(index, ch);
        question.getChoiceByIndex(index).should("contain.text", ch);
      });
      question.dragAndDropResponseToBoard(1);
      question.dragAndDropResponseToBoard(0);
      question.dragAndDropResponseToBoard(2);
    });

    it(" > test score with partial match", () => {
      const preview = editItem.header.preview();
      preview.header.edit();
      question.updatePoints(2.5);
      question.clickOnAdvancedOptions();
      scoringBlock.selectScoringType(SCORING_TYPE.PARTIAL);
      preview.header.preview();
      question.dragAndDropResponseToBoard(1);
      question.dragAndDropResponseToBoard(0);
      preview.checkScore("1.67/2.5");
      for (let i = 0; i < 2; i++) {
        question.VerifyAnswerBoxColorByIndex(i, "correct");
      }
    });

    it(" > test score with partial match and penality", () => {
      const preview = editItem.header.preview();
      preview.header.edit();
      question.updatePoints(2.5);
      question.clickOnAdvancedOptions();
      scoringBlock.selectScoringType(SCORING_TYPE.PARTIAL);
      scoringBlock.getPanalty().type("{selectall}1");
      preview.header.preview();
      question.dragAndDropResponseToBoard(1);
      question.dragAndDropResponseToBoard(2);
      preview.checkScore("0.17/2.5");
      question.VerifyAnswerBoxColorByIndex(1, "correct");
      question.VerifyAnswerBoxColorByIndex(2, "wrong");
    });

    it(" > test score with partial match ,penality and Rounding, ", () => {
      const preview = editItem.header.preview();
      preview.header.edit();
      question.updatePoints(2.5);
      question.clickOnAdvancedOptions();
      scoringBlock.selectScoringType(SCORING_TYPE.PARTIAL);
      scoringBlock.getPanalty().type("{selectall}1");
      question.selectRoundingType("None");
      preview.header.preview();
      question.dragAndDropResponseToBoard(1);
      question.dragAndDropResponseToBoard(2);
      preview.checkScore("0.17/2.5");
      preview.header.edit();
      question.selectRoundingType("Round down");
      preview.header.preview();
      question.dragAndDropResponseToBoard(1);
      question.dragAndDropResponseToBoard(2);
      preview.checkScore("0/2.5");
      question.VerifyAnswerBoxColorByIndex(1, "correct");
      question.VerifyAnswerBoxColorByIndex(2, "wrong");
    });

    it(" > test score with alternate answer", () => {
      const preview = editItem.header.preview();
      preview.header.edit();
      question.addAlternate();
      question.updatePoints(2);
      question.dragAndDropResponseToBoard(0);
      question.dragAndDropResponseToBoard(1);
      question.dragAndDropResponseToBoard(2);
      preview.header.preview();
      question.dragAndDropResponseToBoard(0);
      question.dragAndDropResponseToBoard(1);
      question.dragAndDropResponseToBoard(2);
      preview.checkScore("2/2.5");
      for (let i = 0; i < 3; i++) {
        question.VerifyAnswerBoxColorByIndex(i, "correct");
      }
    });
  });

  validateSolutionBlockTests(queData.group, queData.queType);
});
