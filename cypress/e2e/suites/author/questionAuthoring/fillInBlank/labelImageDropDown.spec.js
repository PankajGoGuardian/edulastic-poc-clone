import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import DropDownPage from "../../../../framework/author/itemList/questionType/fillInBlank/dropDownPage";
import FileHelper from "../../../../framework/util/fileHelper";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Label Image with Drop Down" type question`, () => {
  const queData = {
    group: "Fill in the Blanks",
    queType: "Label Image with Drop Down",
    queText: "Indian state known as garden spice is:",
    choices: ["ChoiceARes1", "ChoiceBRes1"],
    answerRes1: "ChoiceARes1",
    answerRes2: "ChoiceARes2",
    answerRes3: "ChoiceARes3",
    alterate: ["KL"],
    extlink: "www.testdomain.com",
    formattext: "formattedtext",
    formula: "s=ar^2",
    points: "2",
    imageWidth: "500",
    imageAlternate: "Background",
    testColor: "#d49c9c",
    maxRes: "1"
  };

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
        /*   cy.fixture("testImages/sample.jpg").then(logo => {
          Cypress.Blob.base64StringToBlob(logo, "image/jpg").then(blob => {
            cy.uploadImage(blob).then(result => {
              // update uploaded image link to store
              const imageUrl = result.response.body.result.fileUri;
              const currentQuestion = question.getCurrentStoreQuestion();
              currentQuestion.imageUrl = imageUrl;
              cy.window()
                .its("store")
                .invoke("dispatch", { type: "[author questions] update questions", payload: currentQuestion });
              cy.get('[data-cy="drag-drop-image-panel"] img').should("have.attr", "src", imageUrl);
            });
          });
        }); */

        cy.uploadFile("testImages/sample.jpg", "input[type=file]").then(() => {
          cy.wait(3000); // wait to image render
        });

        // test with local image
        // const testImageUrl = 'https://edureact-dev.s3.amazonaws.com/1551154644960_blob';
        // const currentQuestion = question.getCurrentStoreQuestion()
        // currentQuestion.imageUrl = testImageUrl;
        // cy.window()
        //   .its('store')
        //   .invoke('dispatch', { type: '[author questions] update questions', payload: currentQuestion });
        // cy.get('[data-cy="drag-drop-image-panel"] img').should('have.attr', 'src', testImageUrl);
      });

      it(" > Width(px)", () => {
        question.changeImageWidth(queData.imageWidth);
        question.getImageWidth().should("have.css", "width", `${queData.imageWidth}px`);
      });

      /* it(" > Image alternative text", () => {
        question.inputImageAlternate(queData.imageAlternate);
        question.checkImageAlternate(queData.imageAlternate);
      });
 */
      it(" > Fill color", () => {
        question.updateColorPicker(queData.testColor);
        question.getAllInputPanel().each($el => {
          cy.wrap($el).should("have.attr", "background", queData.testColor);
        });
      });

      it(" > Maximum responses per container", () => {
        question
          .getMaxResponseInput()
          .click()
          .clear()
          .type(queData.maxRes)
          .should("have.value", queData.maxRes);
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
          .getPointsEditor()
          .clear()
          .type(`{selectall}${queData.points}`)
          .should("have.value", queData.points)
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
      it(" > Click on Preview, CheckAnswer", () => {
        const preview = editItem.header.preview();

        question.setAnswerOnBoard(0, 0);
        question.setAnswerOnBoard(1, 0);
        question.setAnswerOnBoard(2, 0);

        preview.checkScore("3/3");
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

    context(" > [Tc_390]:Tc_2 => Upload image", () => {
      it(" > Upload image to server", () => {
        /* cy.fixture("testImages/sample.jpg").then(logo => {
          Cypress.Blob.base64StringToBlob(logo, "image/jpg").then(blob => {
            cy.uploadImage(blob).then(result => {
              // update uploaded image link to store
              const imageUrl = result.response.body.result.fileUri;
              const currentQuestion = question.getCurrentStoreQuestion();
              currentQuestion.imageUrl = imageUrl;
              cy.window()
                .its("store")
                .invoke("dispatch", { type: "[author questions] update questions", payload: currentQuestion });
              cy.get('[data-cy="drag-drop-image-panel"] img').should("have.attr", "src", imageUrl);
            });
          });
        }); */

        cy.uploadFile("testImages/sample.jpg", "input[type=file]").then(() => {
          cy.wait(3000); // wait to image render
        });

        // test with local image
        // const testImageUrl = 'https://edureact-dev.s3.amazonaws.com/1551154644960_blob';
        // const currentQuestion = question.getCurrentStoreQuestion()
        // currentQuestion.imageUrl = testImageUrl;
        // cy.window()
        //   .its('store')
        //   .invoke('dispatch', { type: '[author questions] update questions', payload: currentQuestion });
        // cy.get('[data-cy="drag-drop-image-panel"] img').should('have.attr', 'src', testImageUrl);
      });

      it(" > Width(px)", () => {
        question.changeImageWidth(queData.imageWidth);
        question.getImageWidth().should("have.css", "width", `${queData.imageWidth}px`);
      });

      /*  it(" > Image alternative text", () => {
        question.inputImageAlternate(queData.imageAlternate);
        question.checkImageAlternate(queData.imageAlternate);
      }); */

      it(" > Fill color", () => {
        question.updateColorPicker(queData.testColor);
        question.getAllInputPanel().each($el => {
          cy.wrap($el).should("have.attr", "background", queData.testColor);
        });
      });

      it(" > Maximum responses per container", () => {
        question
          .getMaxResponseInput()
          .click()
          .clear()
          .type(queData.maxRes)
          .should("have.value", queData.maxRes);
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
    });

    context(" > [Tc_391]:Tc_3 => Edit Response", () => {
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

    context(" > [Tc_392]:Tc_4 => Set Correct Answer(s)", () => {
      it(" > Update points", () => {
        question
          .getPointsEditor()

          .type(`{selectall}${queData.points}`)
          .should("have.value", queData.points)
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

    context(" > [Tc_393]:Tc_5 => Save questions", () => {
      it(" > Click on save button", () => {
        question.header.save(true);
        cy.url().should("contain", "item-detail");
      });
    });

    context(" > [Tc_394]:Tc_6 => Preview items", () => {
      it(" > Click on Preview, CheckAnswer", () => {
        const preview = editItem.header.preview();

        question.setAnswerOnBoard(0, 0);
        question.setAnswerOnBoard(1, 0);
        question.setAnswerOnBoard(2, 0);

        preview.checkScore("3/3");
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
              .should("be.visible");
          });
      });

      it(" > Click on Clear, Edit", () => {
        const preview = editItem.header.preview();
        preview.getClear().click();
        preview.header.edit();
      });
    });
    context(" > [Tc_395]:Tc_1 => Delete option", () => {
      before(" > Click on delete button in Item Details page", () => {
        itemList.sidebar.clickOnItemBank();
        itemList.searchFilters.clearAll();
        itemList.searchFilters.getAuthoredByMe();
      });
      it(" > Click on delete button in Item Details page", () => {
        itemList.clickOnViewItemById(testItemId);
        itemList.itemPreview.clickOnDeleteOnPreview();
        itemList.itemPreview.closePreiview();
        itemList.verifyAbsenceOfitemById(testItemId);
      });
    });
  });
});
