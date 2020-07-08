import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import DropDownPage from "../../../../framework/author/itemList/questionType/fillInBlank/dropDownPage";
import FileHelper from "../../../../framework/util/fileHelper";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import validateSolutionBlockTests from "../../../../framework/author/itemList/questionType/common/validateSolutionBlockTests";
import ScoringBlock from "../../../../framework/author/itemList/questionType/common/scoringBlock";
import { SCORING_TYPE } from "../../../../framework/constants/questionAuthoring";
import { questionType } from "../../../../framework/constants/questionTypes";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Label Image with Drop Down" type question`, () => {
  const queData = {
    group: "Fill in the Blanks",
    queType: questionType.IMAGE_DROP_DOWN,
    queText: "Indian state known as garden spice is:",
    choices: ["Choice A", "Choice B"],
    ScoringChoices: ["Scoring Choice A", "Scoring Choice B"],
    formattext: "formattedtext",
    points: "2",
    imageWidth: "500",
    imageHeight: "400",
    imagePosLeft: "100",
    imagePosTop: "50",
    imageAlternate: "Background",
    testColor: "#d49c9c"
  };

  const scoringBlock = new ScoringBlock();
  const question = new DropDownPage();
  const editItem = new EditItemPage();
  const itemList = new ItemListPage();

  let testItemId;

  before(() => {
    cy.login();
  });

  context(" > User creates question.", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();
      // add new question
      editItem.chooseQuestion(queData.group, queData.queType);
    });

    context(" > [Tc_384]:Tc_2 => Upload image", () => {
      it(" > Upload image to server", () => {
        cy.uploadFile("testImages/sample.jpg", "input[type=file]").then(() => {
          cy.wait(3000); // wait to image render
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
        for (let i = 0; i < 2; i++) {
          question.verifyFillColorInPreviewContainer(i, queData.testColor);
        }
      });
    });

    context(" > [Tc_371]:Tc_2 => verify additional options", () => {
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
    });

    context(" > [Tc_385]:Tc_3 => Response", () => {
      it(" > Edit default text", () => {
        question
          .addNewChoiceOnResponse(0)
          .getChoiceByIndexRes(0, 2)
          .click()
          .clear()
          .type(queData.formattext)
          .should("have.value", queData.formattext);
      });

      for (let i = 0; i < 3; i++) {
        context(`Response ${i + 1}`, () => {
          it(" > Delete Choices", () => {
            question
              .getAllChoicesRes(i)
              .each(($el, index, $list) => {
                const cusIndex = $list.length - (index + 1);
                question.deleteChoiceIndexRes(i, cusIndex);
              })
              .should("have.length", 0);
          });

          it(" > Add new choices", () => {
            queData.choices.forEach((ch, index) => {
              question
                .addNewChoiceOnResponse(i)
                .getChoiceByIndexRes(i, index)
                .clear()
                .type(ch)
                .should("have.value", ch);
              // check added answers
              question.checkAddedAnswersRes(i, ch);
            });
          });
        });
      }
    });

    context(" > [Tc_386]:Tc_4 => Set Correct Answer(s)", () => {
      it(" > Update points", () => {
        question
          .updatePoints(queData.points)
          .type("{uparrow}")
          .type("{uparrow}")
          .should("have.value", `${Number(queData.points) + 1}`)
          .blur();
      });

      it(" > Select the responses from drop down", () => {
        question.setAnswerOnBoard(0, 0);
        question.setAnswerOnBoard(1, 0);
        question.setAnswerOnBoard(2, 0);
      });

      it(" > Add/Delete alternatives", () => {
        question.addAlternate();
        question.checkAndDeleteAlternates();
      });

      it(" > Check/uncheck Shuffle Possible responses", () => {
        question
          .getShuffleDropDown()
          .check({ force: true })
          .should("be.checked");
        question.getDropDownByRes(0).click();
        queData.choices.forEach(ch => {
          question.checkShuffled(0, ch);
        });
        question.getDropDownByRes(0).click();
        question
          .getShuffleDropDown()
          .uncheck({ force: true })
          .should("not.be.checked");
      });
    });

    context(" > [Tc_387]:Tc_5 => Save Question", () => {
      it(" > Click on save button", () => {
        question.header.save();
        cy.url().should("contain", "item-detail");
      });
    });

    context(" > [Tc_388]:Tc_6 => Preview items", () => {
      it(" > Check correct answer in preview", () => {
        const preview = editItem.header.preview();
        question.setAnswerOnBoard(0, 0);
        question.setAnswerOnBoard(1, 0);
        question.setAnswerOnBoard(2, 0);
        preview.checkScore("3/3");
        for (let i = 0; i < 3; i++) {
          question.VerifyAnswerBoxColorByIndex(i, "correct");
        }
      });

      it(" > Check incorrect answer in preview", () => {
        const preview = editItem.header.preview();
        preview.getClear().click();
        question.setAnswerOnBoard(0, 1);
        question.setAnswerOnBoard(1, 1);
        question.setAnswerOnBoard(2, 1);
        preview.checkScore("0/3");
        for (let i = 0; i < 3; i++) {
          question.VerifyAnswerBoxColorByIndex(i, "wrong");
        }
      });

      it(" > Click on ShowAnswer", () => {
        const preview = editItem.header.preview();
        preview.getClear().click();

        preview
          .getShowAnswer()
          .click()
          .then(() => {
            cy.contains("h2", "Correct Answer")
              .should("be.visible")
              .next()
              .contains("span", queData.choices[0])
              .should("exist");
          });
      });

      it(" > Click on Clear, Edit", () => {
        const preview = editItem.header.preview();
        preview.getClear().click();

        preview.header.edit();
      });
    });
  });

  context(" > Edit the question created", () => {
    before("delete old question and create dummy que to edit", () => {
      editItem.createNewItem();
      // add new question
      editItem.chooseQuestion(queData.group, queData.queType);
      for (let i = 0; i < 2; i++) {
        queData.ScoringChoices.forEach((ch, index) => {
          question
            .getChoiceByIndexRes(i, index)
            .clear()
            .type(ch)
            .should("have.value", ch);
          question.checkAddedAnswersRes(i, ch);
        });
      }
      question.setAnswerOnBoard(0, 0);
      question.setAnswerOnBoard(1, 0);
      question.header.saveAndgetId().then(id => {
        cy.saveItemDetailToDelete(id);
        cy.server();
        cy.route("PUT", "**/publish?status=published").as("publish");
        cy.get('[data-cy="publishItem"]').click();
        cy.contains("span", "PROCEED").click({ force: true });
        cy.wait("@publish");
        // edit
        itemList.searchFilters.clearAll();
        itemList.searchFilters.getAuthoredByMe();
        itemList.clickOnViewItemById(id);
        itemList.itemPreview.clickEditOnPreview();
        testItemId = id;
      });
    });
    context(" > [Tc_384]:Tc_2 => Upload image", () => {
      it(" > Upload image to server", () => {
        cy.uploadFile("testImages/sample.jpg", "input[type=file]").then(() => {
          cy.wait(3000); // wait to image render
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
        for (let i = 0; i < 2; i++) {
          question.verifyFillColorInPreviewContainer(i, queData.testColor);
        }
      });
    });

    context(" > [Tc_371]:Tc_2 => verify additional options", () => {
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
    });

    context(" > [Tc_385]:Tc_3 => Response", () => {
      it(" > Edit default text", () => {
        question
          .addNewChoiceOnResponse(0)
          .getChoiceByIndexRes(0, 2)
          .click()
          .clear()
          .type(queData.formattext)
          .should("have.value", queData.formattext);
      });

      for (let i = 0; i < 3; i++) {
        context(`Response ${i + 1}`, () => {
          it(" > Delete Choices", () => {
            question
              .getAllChoicesRes(i)
              .each(($el, index, $list) => {
                const cusIndex = $list.length - (index + 1);
                question.deleteChoiceIndexRes(i, cusIndex);
              })
              .should("have.length", 0);
          });

          it(" > Add new choices", () => {
            queData.choices.forEach((ch, index) => {
              question
                .addNewChoiceOnResponse(i)
                .getChoiceByIndexRes(i, index)
                .clear()
                .type(ch)
                .should("have.value", ch);
              // check added answers
              question.checkAddedAnswersRes(i, ch);
            });
          });
        });
      }
    });

    context(" > [Tc_386]:Tc_4 => Set Correct Answer(s)", () => {
      it(" > Update points", () => {
        question
          .updatePoints(queData.points)
          .type("{uparrow}")
          .type("{uparrow}")
          .should("have.value", `${Number(queData.points) + 1}`)
          .blur();
      });

      it(" > Select the responses from drop down", () => {
        question.setAnswerOnBoard(0, 0);
        question.setAnswerOnBoard(1, 0);
        question.setAnswerOnBoard(2, 0);
      });

      it(" > Add/Delete alternatives", () => {
        question.addAlternate();
        question.checkAndDeleteAlternates();
      });

      it(" > Check/uncheck Shuffle Possible responses", () => {
        question
          .getShuffleDropDown()
          .check({ force: true })
          .should("be.checked");
        question.getDropDownByRes(0).click();
        queData.choices.forEach(ch => {
          question.checkShuffled(0, ch);
        });
        question.getDropDownByRes(0).click();
        question
          .getShuffleDropDown()
          .uncheck({ force: true })
          .should("not.be.checked");
      });
    });

    context(" > [Tc_387]:Tc_5 => Save Question", () => {
      it(" > Click on save button", () => {
        question.header.getSaveButton().click();
      });
    });

    context(" > [Tc_388]:Tc_6 => Preview items", () => {
      it(" > Check correct answer in preview", () => {
        const preview = editItem.header.preview();
        question.setAnswerOnBoard(0, 0);
        question.setAnswerOnBoard(1, 0);
        question.setAnswerOnBoard(2, 0);
        preview.checkScore("3/3");
        for (let i = 0; i < 3; i++) {
          question.VerifyAnswerBoxColorByIndex(i, "correct");
        }
      });

      it(" > Check incorrect answer in preview", () => {
        const preview = editItem.header.preview();
        preview.getClear().click();
        question.setAnswerOnBoard(0, 1);
        question.setAnswerOnBoard(1, 1);
        question.setAnswerOnBoard(2, 1);
        preview.checkScore("0/3");
        for (let i = 0; i < 3; i++) {
          question.VerifyAnswerBoxColorByIndex(i, "wrong");
        }
      });

      it(" > Click on ShowAnswer", () => {
        const preview = editItem.header.preview();
        preview.getClear().click();

        preview
          .getShowAnswer()
          .click()
          .then(() => {
            cy.contains("h2", "Correct Answer")
              .should("be.visible")
              .next()
              .contains("span", queData.choices[0])
              .should("exist");
          });
      });

      it(" > Click on Clear, Edit", () => {
        const preview = editItem.header.preview();
        preview.getClear().click();

        preview.header.edit();
      });
    });

    context(" > [Tc_395]:Tc_1 => Delete option", () => {
      before(" > Navigate to Item Details page", () => {
        itemList.sidebar.clickOnItemBank();
        itemList.searchFilters.clearAll();
        itemList.searchFilters.getAuthoredByMe();
      });

      it(" > Click on delete button in Item Details page", () => {
        itemList.clickOnViewItemById(testItemId);
        itemList.itemPreview.clickOnDeleteOnPreview();
        itemList.itemPreview.closePreiview();
        cy.get(`[data-cy=${testItemId}]`).should("not.exist");
      });
    });
  });

  context(" > [Tc_376]: Scoring block tests", () => {
    before("Create question and set correct answer", () => {
      editItem.sideBar.clickOnTestLibrary();
      editItem.createNewItem();
      // add new question
      editItem.chooseQuestion(queData.group, queData.queType);
      cy.uploadFile("testImages/sample.jpg", "input[type=file]").then(() => {
        cy.wait(3000);
      });
      for (let i = 0; i < 2; i++) {
        queData.ScoringChoices.forEach((ch, index) => {
          question
            .getChoiceByIndexRes(i, index)
            .clear()
            .type(ch)
            .should("have.value", ch);
          question.checkAddedAnswersRes(i, ch);
        });
      }
      question.setAnswerOnBoard(0, 0);
      question.setAnswerOnBoard(1, 0);
    });

    it(" > test score with partial match", () => {
      const preview = editItem.header.preview();
      preview.header.edit();
      question.updatePoints(4);
      question.clickOnAdvancedOptions();
      scoringBlock.selectScoringType(SCORING_TYPE.PARTIAL);
      preview.header.preview();
      question.setAnswerOnBoard(0, 0);
      question.setAnswerOnBoard(1, 1);
      preview.checkScore("2/4");
      question.VerifyAnswerBoxColorByIndex(0, "correct");
      question.VerifyAnswerBoxColorByIndex(1, "wrong");
    });

    it(" > test score with partial match and penality", () => {
      const preview = editItem.header.preview();
      preview.header.edit();
      question.updatePoints(4);
      question.clickOnAdvancedOptions();
      scoringBlock.selectScoringType(SCORING_TYPE.PARTIAL);
      scoringBlock.getPanalty().type("{selectall}1");
      preview.header.preview();
      question.setAnswerOnBoard(0, 0);
      question.setAnswerOnBoard(1, 1);
      preview.checkScore("1.5/4");
      question.VerifyAnswerBoxColorByIndex(0, "correct");
      question.VerifyAnswerBoxColorByIndex(1, "wrong");
    });

    it(" > test score with partial match ,penality and Rounding, ", () => {
      const preview = editItem.header.preview();
      preview.header.edit();
      question.updatePoints(5);
      question.clickOnAdvancedOptions();
      scoringBlock.selectScoringType(SCORING_TYPE.PARTIAL);
      scoringBlock.getPanalty().type("{selectall}0.5");
      question.selectRoundingType("None");
      preview.header.preview();
      question.setAnswerOnBoard(0, 0);
      question.setAnswerOnBoard(1, 1);
      preview.checkScore("2.25/5");
      preview.header.edit();
      question.selectRoundingType("Round down");
      preview.header.preview();
      question.setAnswerOnBoard(0, 0);
      question.setAnswerOnBoard(1, 1);
      preview.checkScore("2/5");
      question.VerifyAnswerBoxColorByIndex(0, "correct");
      question.VerifyAnswerBoxColorByIndex(1, "wrong");
    });

    it(" > test score with alternate answer", () => {
      const preview = editItem.header.preview();
      preview.header.edit();
      question.addAlternate();
      question.updatePoints(4);
      scoringBlock.selectScoringType(SCORING_TYPE.EXACT);
      question.setAnswerOnBoard(0, 1);
      question.setAnswerOnBoard(1, 1);
      preview.header.preview();
      question.setAnswerOnBoard(0, 1);
      question.setAnswerOnBoard(1, 1);
      preview.checkScore("4/5");
      question.VerifyAnswerBoxColorByIndex(0, "correct");
      question.VerifyAnswerBoxColorByIndex(1, "correct");
    });
  });

  validateSolutionBlockTests(queData.group, queData.queType);
});
// TODO - Verification of Pointers and keep aspect ratio options
