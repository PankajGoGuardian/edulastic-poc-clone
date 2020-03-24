import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import ClozeDragDropPage from "../../../../framework/author/itemList/questionType/fillInBlank/clozeWithDragDropPage";
import FileHelper from "../../../../framework/util/fileHelper";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import MetadataPage from "../../../../framework/author/itemList/itemDetail/metadataPage";
import PreviewItemPopup from "../../../../framework/author/itemList/itemPreview";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Cloze with Drag & Drop" type question`, () => {
  const queData = {
    group: "Fill in the Blanks",
    queType: "Cloze with Drag & Drop",
    queText: "Select the correct option?",
    template: " is the world's largest democracy",
    correctAns: "India",
    choices: ["China", "India", "US"],
    editedchoices: ["India", "China", "US"],
    forScoring: ["Option 1", "Option 2", "Option 3"],
    extlink: "www.testdomain.com",
    testtext: "testtext",
    editedtext: "editedtext",
    formula: "s=ar^2"
  };

  const question = new ClozeDragDropPage();
  const editItem = new EditItemPage();
  const itemList = new ItemListPage();
  const itemPreview = new PreviewItemPopup();

  let preview;
  let item_id;
  let testItemId;

  before(() => {
    cy.login();
  });

  context(" > User creates question", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();
      // add new question
      editItem.chooseQuestion(queData.group, queData.queType);
    });

    context(" > TC_2 => Enter the text/inputs to Template Markup", () => {
      it(" > Write text in textbox", () => {
        question.typeQuestionText(queData.testtext);
        question.getTemplateEditor().should("contain", queData.testtext);

        question.templateMarkupBar
          .response()
          .click({ force: true })
          .then(() => {
            question
              .getTemplateEditor()
              .find("response")
              .should("be.visible");
          });
      });
    });

    context(" > TC_3 => Use Group possible responses block", () => {
      it(" > Delete choices", () => {
        question
          .getChoiceResponseContainer()
          .each(($el, index, $list) => {
            const cusIndex = $list.length - (index + 1);
            cy.wrap($list[cusIndex])
              //.should("be.visible")
              .find(".main")
              .next()
              .click();
          })
          .should("have.length", 0);
      });

      it(" > Check the group possible responses checkbox", () => {
        question
          .getGroupResponsesCheckbox()
          .as("group-check")
          .check({ force: true });

        //.should("be.checked");

        cy.get("@group-check").should("be.checked");

        question
          .getAddedGroupTitle()
          //.should("be.visible")
          .next()
          .click()
          .should("not.exist");
        cy.get("@group-check").uncheck({ force: true });
        //.should("not.checked");
      });

      it(" > Add new choices", () => {
        queData.choices.forEach((ch, index) => {
          question
            .getAddChoiceButton()
            .click({ force: true })
            .then(() => {
              question.getChoiceInputByIndex(index).type(`{selectall}${ch}`);
              question.getChoiceInputByIndex(index).should("have.text", ch);
              question.getResponseItemByIndex(index).should("be.visible");
            });
        });
      });
    });

    context(" > TC_4 => Set Correct Answer(s)", () => {
      it(" > Update Points", () => {
        question
          .getPontsInput()
          .clear()
          .type(`{selectall}1`);
        question.getPontsInput().should("have.value", "1");
        question.getPontsInput().type("{uparrow}{uparrow}");
        question.getPontsInput().should("have.value", "2");
      });

      it(" > Drag and drop the responses", () => {
        question.setAnswerToResponseBox(queData.choices[0], 0, 0);
      });

      it(" > Check/Uncheck duplicate response checkbox", () => {
        question.getDuplicatedResposneCheck().click();
        question
          .getDuplicatedResposneCheck()
          .find("input")
          .should("be.checked")
          .then(() => {
            question.getResponseItemByIndex(0).contains("div", queData.choices[0]);
          });

        question.getDuplicatedResposneCheck().click();
        question
          .getDuplicatedResposneCheck()
          .find("input")
          .should("not.checked")
          .then(() => {
            question.getResponseItemByIndex(0).contains("div", queData.choices[1]);
          });
      });

      it(" > Check/Uncheck Show Drag Handle", () => {
        question.getDraghandleCheck().click();
        question
          .getDraghandleCheck()
          .find("input")
          .should("be.checked");
        question
          .getResponseItemByIndex(0)
          .find("i")
          .should("be.visible");

        question.getDraghandleCheck().click();
        question
          .getDraghandleCheck()
          .find("input")
          .should("not.checked");
        question
          .getResponseItemByIndex(0)
          .find("i")
          .should("not.exist");
      });

      it(" > Check/uncheck Shuffle Options", () => {
        question.getShuffleOptionCheck().click();
        question
          .getShuffleOptionCheck()
          .find("input")
          .should("be.checked");

        question
          .getResponseItemByIndex(0)
          .parent()
          .contains("div", queData.choices[1]);

        question
          .getResponseItemByIndex(0)
          .parent()
          .contains("div", queData.choices[2]);

        question.getShuffleOptionCheck().click();
        question
          .getShuffleOptionCheck()
          .find("input")
          .should("not.checked");

        // question.setAnswerToResponseBox();

        question
          .getResponseItemByIndex(1)
          .parent()
          .contains("div", queData.choices[1]);

        question
          .getResponseItemByIndex(0)
          .parent()
          .contains("div", queData.choices[2]);
      });

      it(" > Click on + symbol", () => {
        question.addAlternative().then(() => {
          question.getAddedAlternateTab().should("be.visible");
          question
            .getAddedAlternateTab()
            .parent()
            .find("svg")
            .click({ force: true });
          question.getAddedAlternateTab().should("not.exist");
        });
      });
    });

    context(" > TC_5 => Save question", () => {
      it(" > Click on save button", () => {
        question.header.save();
        cy.url().should("contain", "item-detail");
      });
    });

    context(" > TC_6 => Preview Items", () => {
      before("preview", () => {
        preview = editItem.header.preview();
      });
      it(" > Click on preview", () => {
        preview.getCheckAnswer();
        question.getResponseItemByIndex(0).customDragDrop("#drop-container-0");
        question.getResponseContainerByIndex(0).contains("div", queData.choices[0]);
      });

      it(" > Click on Check answer", () => {
        preview.checkScore("1/1");
      });

      it(" > Click on Show Answers", () => {
        preview
          .getShowAnswer()
          .click()
          .then(() => {
            cy.contains("h2", "Correct Answer")
              .parent()
              .find("span", queData.choices[0])
              .should("be.visible");
          });
      });

      it(" > Click on Clear", () => {
        preview
          .getClear()
          .click()
          .then(() => {
            question.getResponseContainerByIndex(0).should("not.contain", queData.choices[0]);
            queData.choices.forEach((ch, index) => {
              question.getResponseItemByIndex(index).should("contain", ch);
            });
            cy.get("body")
              .children()
              .should("not.contain", "Correct Answer");
          });

        preview.header.edit();
      });
    });
  });

  context(" > Edit the question created", () => {
    before("delete old question and create dummy que to edit", () => {
      editItem.createNewItem();
      // add new question
      editItem.chooseQuestion(queData.group, queData.queType);
      question.typeQuestionText(queData.testtext);
      queData.choices.forEach((ch, index) => {
        question.getChoiceInputByIndex(index).type(`{selectall}${ch}`);
      });
      editItem.header.saveAndgetId().then(id => {
        item_id = id;
        cy.saveItemDetailToDelete(id);
      });
      cy.server();
      cy.route("PUT", "**/publish?status=published").as("publish");
      cy.get('[data-cy="publishItem"]').click();
      cy.contains("span", "PROCEED").click({ force: true });
      cy.wait("@publish");
    });

    context(" > TC_8 => Enter the text/inputs to Template Markup", () => {
      before("get item", () => {
        cy.visit(`author/items/${item_id}/item-detail`);
      });
      it(" > change text in textbox", () => {
        question.typeQuestionText(queData.editedtext);
        question.getTemplateEditor().should("contain", queData.editedtext);

        question.templateMarkupBar
          .response()
          .click()
          .then(() => {
            question
              .getTemplateEditor()
              .find("response")
              .should("be.visible");
          });
      });
    });

    context(" > TC_9 => Use Group possible responses block", () => {
      it(" > Delete choices", () => {
        question
          .getChoiceResponseContainer()
          .each(($el, index, $list) => {
            const cusIndex = $list.length - (index + 1);
            cy.wrap($list[cusIndex])
              //.should("be.visible")
              .find(".main")
              .next()
              .click();
          })
          .should("have.length", 0);
      });
      it(" > Check the group possible responses checkbox", () => {
        question.getGroupResponsesCheckbox().as("group-check");
        cy.get("@group-check")
          .click({ force: true })
          .then($el => {
            cy.get("@group-check").should("be.checked");
            question
              .getAddedGroupTitle()
              //.should("be.visible")
              .next()
              .click()
              .should("not.exist");
          });
        cy.get("@group-check").uncheck({ force: true });
        cy.get("@group-check").should("not.checked");
      });
      it(" > Add new choices", () => {
        queData.editedchoices.forEach((ch, index) => {
          question
            .getAddChoiceButton()
            .click({ force: true })
            .then(() => {
              question.getChoiceInputByIndex(index).type(`{selectall}${ch}`);
              question.getChoiceInputByIndex(index).should("have.text", ch);
              question.getResponseItemByIndex(index).should("be.visible");
            });
        });
      });
    });

    context(" > TC_10 => Set Correct Answer(s)", () => {
      it(" > Update Points", () => {
        question
          .getPontsInput()
          .type("{selectall}5")
          .should("have.value", "5");
      });

      it(" > Drag and drop the responses", () => {
        question.setAnswerToResponseBox(queData.editedchoices[0], 0, 0);
      });

      it(" > Check/Uncheck duplicate response checkbox", () => {
        question.getDuplicatedResposneCheck().click();
        question
          .getDuplicatedResposneCheck()
          .find("input")
          .should("be.checked")
          .then(() => {
            question.getResponseItemByIndex(0).contains(queData.editedchoices[0]);
          });

        question.getDuplicatedResposneCheck().click();
        question
          .getDuplicatedResposneCheck()
          .find("input")
          .should("not.checked")
          .then(() => {
            question.getResponseItemByIndex(0).contains(queData.editedchoices[1]);
          });
      });

      it(" > Check/Uncheck Show Drag Handle", () => {
        question.getDraghandleCheck().click();
        question
          .getDraghandleCheck()
          .find("input")
          .should("be.checked");
        question
          .getResponseItemByIndex(0)
          .find("i")
          .should("be.visible");

        question.getDraghandleCheck().click();
        question
          .getDraghandleCheck()
          .find("input")
          .should("not.checked");
        question
          .getResponseItemByIndex(0)
          .find("i")
          .should("not.exist");
      });

      it(" > Check/uncheck Shuffle Options", () => {
        question.getShuffleOptionCheck().click();
        question
          .getShuffleOptionCheck()
          .find("input")
          .should("be.checked");

        question.getResponseItemByIndex(0).contains(queData.choices[2]);
        question.getResponseItemByIndex(1).contains(queData.choices[0]);

        question.getShuffleOptionCheck().click();
        question
          .getShuffleOptionCheck()
          .find("input")
          .should("not.checked");

        question.getResponseItemByIndex(0).contains(queData.choices[0]);
        question.getResponseItemByIndex(1).contains(queData.choices[2]);
      });

      it(" > Click on + symbol", () => {
        question.addAlternative().then(() => {
          question.getAddedAlternateTab().should("be.visible");
          question
            .getAddedAlternateTab()
            .parent()
            .find("svg")
            .click({ force: true });
          question.getAddedAlternateTab().should("not.exist");
        });
      });
    });

    context(" > TC_11 => Save question", () => {
      it(" > Click on save button", () => {
        question.header.save(true);
      });
    });

    context(" > TC_12 => Delete options", () => {
      it(" > Click on delete button in Item list page", () => {
        itemList.sidebar.clickOnItemBank();
        itemList.searchFilters.clearAll();
        itemList.searchFilters.getAuthoredByMe();
        itemList.clickOnViewItemById(item_id);
        itemPreview.clickOnDeleteOnPreview();
        itemList.getViewItemById(item_id).should("have.length", 0);
      });
    });
  });

  context(" > Scoring block tests", () => {
    before("visit items page and select question type", () => {
      itemList.sidebar.clickOnTestLibrary();
      editItem.createNewItem();

      // add new question
      editItem.chooseQuestion(queData.group, queData.queType);
      question.getTemplateEditor().click();
      question.templateMarkupBar.response().click();
      // question.templateMarkupBar.response().click();
    });

    afterEach(() => {
      preview = question.header.preview();
      preview.getClear().click();
      preview.header.edit();

      // question.clickOnAdvancedOptions();
    });

    // it(" > Test scoring with max score", () => {
    //   // question.clickOnAdvancedOptions();

    //   question.updatePoints(1);

    //   preview = question.header.preview();

    //   preview
    //     .getCheckAnswer()
    //     .click()
    //     .then(() => {
    //       question.checkExpectedScore("0/1");
    //     });
    // });

    it(" > Test scoring with alternate answer", () => {
      // question.getMaxScore().clear();

      question.updatePoints(2);
      question.setAnswerToResponseBox(queData.forScoring[0], 0, 0);
      question.setAnswerToResponseBox(queData.forScoring[2], 1, 1);

      question.getAddAlternative().click();
      question.getAddedAlternateTab().click();
      question.updatePoints(6);

      question.setAnswerToResponseBox(queData.forScoring[1], 0, 1);
      question.setAnswerToResponseBox(queData.forScoring[2], 1, 1);

      preview = question.header.preview();

      question.setAnswerToResponseBox(queData.forScoring[0], 0, 0);
      question.setAnswerToResponseBox(queData.forScoring[2], 1, 1);

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          question.checkExpectedScore("2/6");
        });

      preview.getClear().click();

      question.setAnswerToResponseBox(queData.forScoring[1], 0, 1);
      question.setAnswerToResponseBox(queData.forScoring[2], 1, 1);

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          question.checkExpectedScore("6/6");
        });
    });

    // it(" > Test scoring with partial match, min score if attempted and penalty", () => {
    //   question.clickOnAdvancedOptions();

    //   question.getEnableAutoScoring().check({ force: true });
    //   // question.getMinScore().type(1);

    //   question.selectScoringType("Partial match");
    //   question.updatePenalty(4);

    //   preview = question.header.preview();

    //   question.setAnswerToResponseBox(queData.forScoring[1], 0, 1);
    //   question.setAnswerToResponseBox(queData.forScoring[0], 1, 0);

    //   preview
    //     .getCheckAnswer()
    //     .click()
    //     .then(() => {
    //       question.checkExpectedScore("1/6");
    //     });

    //   preview.header.edit();
    //   question.clickOnAdvancedOptions();
    //   question.updatePenalty(2);
    //   editItem.header.preview();

    //   question.setAnswerToResponseBox(queData.forScoring[1], 0, 1);
    //   question.setAnswerToResponseBox(queData.forScoring[0], 1, 0);

    //   preview
    //     .getCheckAnswer()
    //     .click()
    //     .then(() => {
    //       question.checkExpectedScore("2/6");
    //     });
    // });
  });
});
