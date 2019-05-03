import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import SortListPage from "../../../../framework/author/itemList/questionType/classifyMatchOrder/sortListPage";
import FileHelper from "../../../../framework/util/fileHelper";
import Helpers from "../../../../framework/util/Helpers";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Sort List" type question`, () => {
  const queData = {
    group: "Classify, Match & Order",
    queType: "Sort List",
    list: ["List1", "List2", "List3", "List4"],
    correctList: ["List1", "List2", "List3", "List4"]
  };

  const question = new SortListPage();
  const editItem = new EditItemPage();
  const itemList = new ItemListPage();
  let preview;

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

    context(" > TC_98 => List", () => {
      it(" > Edit the list existing names", () => {
        question.getListInputs().each(($el, index) => {
          cy.wrap($el)
            .clear()
            .type(queData.list[index])
            .should("contain", queData.list[index]);
        });
        cy.get("body").click();
      });

      it(" > Add new choice", () => {
        question
          .getAddInputButton()
          .click()
          .then(() => {
            question.getListInputs().should("have.length", queData.list.length + 1);
          });
      });

      it(" > Delete all and add sample list", () => {
        question.getDeleteChoiceButtons().each(($el, index, $list) => {
          const cusIndex = $list.length - (index + 1);
          cy.get(`[data-cy="deleteprefix${cusIndex}"]`)
            .click()
            .then(() => {
              question.getListInputs().should("have.length", cusIndex);
            });
        });

        queData.list.forEach((item, index) => {
          cy.get('[data-cy="addButton"]')
            .click()
            .then(() => {
              question.getListInputs().should("have.length", index + 1);
            });
          question
            .getListInputByIndex(index)
            .clear()
            .type(queData.list[index])
            .should("contain", queData.list[index]);
        });
      });
    });

    context(" > TC_99 => Set Correct Answer(s)", () => {
      it(" > Update Points", () => {
        question
          .getPonitsInput()
          .focus()
          .clear()
          .type("{selectall}1")
          .should("have.value", "1")
          .type("{uparrow}")
          .should("have.value", "2")
          .blur();
      });

      it(" > Provide the order of answers list", () => {
        question.getAnswerLists().each(($el, index) => {
          cy.wrap($el).contains("p", queData.correctList[index]);
        });
      });

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
    });

    context(" > TC_100 => Save question", () => {
      it(" > Click on save button", () => {
        question.header.save();
        cy.url().should("contain", "item-detail");
      });
    });

    context(" > TC_101 => Preview Items", () => {
      it(" > Click on preview", () => {
        preview = editItem.header.preview();
        cy.get("body").contains("span", "Check Answer");

        question.getPreviewList().each(($el, index) => {
          cy.wrap($el).contains(queData.list[index]);
        });
      });

      it(" > Check wrong answer", () => {
        question.dragAndDropFromAnswerToBoard(queData.list[0], 0, 1);
        question.dragAndDropFromAnswerToBoard(queData.list[1], 1, 0);
        question.dragAndDropFromAnswerToBoard(queData.list[2], 2, 2);
        question.dragAndDropFromAnswerToBoard(queData.list[3], 3, 3);
      });

      it(" > Click on Check wrong answer", () => {
        preview
          .getCheckAnswer()
          .click()
          .then(() => {
            cy.get("body")
              .children()
              .should("contain", "score: 0/2");
          });
      });

      it(" > Check right answer", () => {
        question.dragAndDropInsideTarget(queData.list[0], 1, 0);
      });

      it(" > Click on Check right answer", () => {
        preview
          .getCheckAnswer()
          .click()
          .then(() => {
            cy.get("body")
              .children()
              .should("contain", "score: 2/2");
          });
      });

      it(" > Click on Clear", () => {
        preview
          .getClear()
          .click()
          .then(() => {
            cy.get("body")
              .children()
              .should("not.contain", "Correct Answer:");
          });
      });

      it(" > Click on Show Answers", () => {
        preview
          .getShowAnswer()
          .click()
          .then(() => {
            question.getCorrectAnswerList().each(($el, index) => {
              cy.wrap($el).contains("p", queData.correctList[index]);
            });
          });
      });

      it(" > Click on Clear after show answer", () => {
        preview
          .getClear()
          .click()
          .then(() => {
            cy.get("body")
              .children()
              .should("not.contain", "Correct Answers");
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
    });

    context(" > TC_103 => List", () => {
      it(" > Edit the list existing names", () => {
        question.getListInputs().each(($el, index) => {
          cy.wrap($el)
            .clear()
            .type(queData.list[index])
            .should("contain", queData.list[index]);
        });
        cy.get("body").click();
      });

      it(" > Add new choice", () => {
        question
          .getAddInputButton()
          .click()
          .then(() => {
            question.getListInputs().should("have.length", queData.list.length + 1);
          });
      });

      it(" > Delete all and add sample list", () => {
        question.getDeleteChoiceButtons().each(($el, index, $list) => {
          const cusIndex = $list.length - (index + 1);
          cy.get(`[data-cy="deleteprefix${cusIndex}"]`)
            .click()
            .then(() => {
              question.getListInputs().should("have.length", cusIndex);
            });
        });

        queData.list.forEach((item, index) => {
          cy.get('[data-cy="addButton"]')
            .click()
            .then(() => {
              question.getListInputs().should("have.length", index + 1);
            });
          question
            .getListInputByIndex(index)
            .clear()
            .type(queData.list[index])
            .should("contain", queData.list[index]);
        });
      });
    });

    context(" > TC_104 => Set Correct Answer(s)", () => {
      it(" > Update Points", () => {
        question
          .getPonitsInput()
          .focus()
          .clear()
          .type("{selectall}1")
          .should("have.value", "1")
          .type("{uparrow}")
          .should("have.value", "2")
          .blur();
      });

      it(" > Provide the order of answers list", () => {
        question.getAnswerLists().each(($el, index) => {
          cy.wrap($el).contains("p", queData.correctList[index]);
        });
      });

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
    });

    context(" > TC_105 => Save question", () => {
      it(" > Click on save button", () => {
        question.header.save();
        cy.url().should("contain", "item-detail");
      });
    });

    context(" > Tc_106 => Delete option", () => {
      it(" > Click on delete button in Item Details page", () => {
        editItem
          .getDelButton()
          .should("have.length", 1)
          .click()
          .should("have.length", 0);
      });
    });
  });

  context(" > Advanced Options", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();
      // add new question
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
      it(" > should be able to select horizontal orientation", () => {
        const select = question.getOrientationSelect();

        select.should("be.visible").click();

        question
          .getHorizontalOption()
          .should("be.visible")
          .click();

        select.should("contain", "Horizontal");
        question.checkOrientation("horizontal");
      });
      it(" > should be able to select vertical orientation", () => {
        const select = question.getOrientationSelect();

        select.should("be.visible").click();

        question
          .getVerticalOption()
          .should("be.visible")
          .click();

        select.should("contain", "Vertical");
        question.checkOrientation("vertical");
      });
    });
  });
});
