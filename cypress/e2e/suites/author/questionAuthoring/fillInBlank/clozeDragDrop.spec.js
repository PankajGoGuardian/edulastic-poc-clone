import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import ClozeDragDropPage from "../../../../framework/author/itemList/questionType/fillInBlank/clozeWithDragDropPage";
import FileHelper from "../../../../framework/util/fileHelper";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import PreviewItemPopup from "../../../../framework/author/itemList/itemPreview";
import validateSolutionBlockTests from "../../../../framework/author/itemList/questionType/common/validateSolutionBlockTests";
import { queColor, questionType } from "../../../../framework/constants/questionTypes";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Cloze with Drag & Drop" type question`, () => {
  const queData = {
    group: "Fill in the Blanks",
    queType: questionType.CLOZE_DRAG_DROP,
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
        question.deleteAllChoices();
      });

      it(" > Check the group possible responses checkbox", () => {
        question
          .getGroupResponsesCheckbox()
          .as("group-check")
          .check({ force: true });

        cy.get("@group-check").should("be.checked");

        question
          .getAddedGroupTitle()
          .next()
          .click()
          .should("not.exist");
        cy.get("@group-check").uncheck({ force: true });
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
        question.header.preview();
        question.verifyShuffledChoices(queData.choices);
        question.header.edit();

        question.getShuffleOptionCheck().click();
        question
          .getShuffleOptionCheck()
          .find("input")
          .should("not.checked");
        question.header.preview();
        question.verifyShuffledChoices(queData.choices, false);
      });

      it(" > Click on + symbol", () => {
        question.header.edit();
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
        preview.checkScore("2/2");
      });

      it(" > Click on Show Answers", () => {
        preview
          .getShowAnswer()
          .click()
          .then(() => {
            cy.get(`[data-cy="answerBox"]`)
              .find("div")
              .first()
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
      question.templateMarkupBar
        .response()
        .click({ force: true })
        .then(() => {
          question
            .getTemplateEditor()
            .find("response")
            .should("be.visible");
        });
      queData.choices.forEach((ch, index) => {
        question.getChoiceInputByIndex(index).type(`{selectall}${ch}`);
      });

      question.setAnswerToResponseBox(queData.choices[0], 0, 0);
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
        cy.wait(5000);
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
        question.deleteAllChoices();
      });

      it(" > Check the group possible responses checkbox", () => {
        question.getGroupResponsesCheckbox().as("group-check");
        cy.get("@group-check")
          .click({ force: true })
          .then(() => {
            cy.get("@group-check").should("be.checked");
            question
              .getAddedGroupTitle()
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
        question.header.preview();
        question.verifyShuffledChoices(queData.choices);
        question.header.edit();

        question.getShuffleOptionCheck().click();
        question
          .getShuffleOptionCheck()
          .find("input")
          .should("not.checked");
        question.header.preview();
        question.verifyShuffledChoices(queData.choices);
      });

      it(" > Click on + symbol", () => {
        question.header.edit();
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
        itemPreview.closePreiview();
        cy.get(`[data-cy=${item_id}]`).should("not.exist");
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
    });

    afterEach(() => {
      preview = question.header.preview();
      preview.getClear().click();
      preview.header.edit();
    });

    it(" > Test scoring with alternate answer", () => {
      question.updatePoints(4);
      question.setAnswerToResponseBox(queData.forScoring[0], 0, 0);
      question.setAnswerToResponseBox(queData.forScoring[2], 1, 1);

      question.getAddAlternative().click();
      question.getAddedAlternateTab().click();
      question.updatePoints(3);

      question.setAnswerToResponseBox(queData.forScoring[1], 0, 1);
      question.setAnswerToResponseBox(queData.forScoring[2], 1, 1);

      preview = question.header.preview();

      question.setAnswerToResponseBox(queData.forScoring[0], 0, 0);
      question.setAnswerToResponseBox(queData.forScoring[2], 1, 1);

      preview.checkScore("4/4");
      question.getPreviewAnswerBoxContainerByIndex(0).should("have.css", "background-color", queColor.LIGHT_GREEN);
      question.getPreviewAnswerBoxContainerByIndex(1).should("have.css", "background-color", queColor.LIGHT_GREEN);

      preview.getClear().click();

      question.setAnswerToResponseBox(queData.forScoring[1], 0, 1);
      question.setAnswerToResponseBox(queData.forScoring[2], 1, 1);

      preview.checkScore("3/4");
      question.getPreviewAnswerBoxContainerByIndex(0).should("have.css", "background-color", queColor.LIGHT_GREEN);
      question.getPreviewAnswerBoxContainerByIndex(1).should("have.css", "background-color", queColor.LIGHT_GREEN);
    });

    it(" > Test scoring with partial match, Round down and penalty", () => {
      question.clickOnAdvancedOptions();

      question.getEnableAutoScoring().check({ force: true });

      question.selectScoringType("Partial match");
      question.selectRoundingType("Round down");
      question.updatePenalty(1);

      preview = question.header.preview();

      question.setAnswerToResponseBox(queData.forScoring[1], 0, 1);
      question.setAnswerToResponseBox(queData.forScoring[0], 1, 0);

      preview.checkScore("1/4");
      question.getPreviewAnswerBoxContainerByIndex(0).should("have.css", "background-color", queColor.LIGHT_GREEN);
      question.getPreviewAnswerBoxContainerByIndex(1).should("have.css", "background-color", queColor.LIGHT_RED);
      preview.header.edit();
      question.clickOnAdvancedOptions();
      question.updatePenalty(2);
      editItem.header.preview();

      question.setAnswerToResponseBox(queData.forScoring[1], 0, 1);
      question.setAnswerToResponseBox(queData.forScoring[0], 1, 0);

      preview.checkScore("0/4");
      question.getPreviewAnswerBoxContainerByIndex(0).should("have.css", "background-color", queColor.LIGHT_GREEN);
      question.getPreviewAnswerBoxContainerByIndex(1).should("have.css", "background-color", queColor.LIGHT_RED);
    });
  });

  validateSolutionBlockTests(queData.group, queData.queType);

  // TODO - Display Block Testing
});
