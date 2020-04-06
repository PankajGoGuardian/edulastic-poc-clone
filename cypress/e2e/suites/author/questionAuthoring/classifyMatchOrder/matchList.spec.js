import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import MatchListPage from "../../../../framework/author/itemList/questionType/classifyMatchOrder/matchListPage";
import FileHelper from "../../../../framework/util/fileHelper";
import Helpers from "../../../../framework/util/Helpers";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Match list" type question`, () => {
  const queData = {
    group: "Classify, Match & Order",
    queType: "Match list",
    queText: "Select the correct option?",
    template: " is the world's largest democracy",
    correctAns: "India",
    list: ["List1", "List2", "List3"],
    choices: ["Choice1", "Choice2", "Choice3"],
    edited: ["Choice11", "Choice21", "Choice31"],
    forScoring: ["Choice B", "Choice A", "Choice C"],
    extlink: "www.testdomain.com",
    testtext: "testtext",
    formula: "s=ar^2",
    column: 2,
    row: 1,
    points: 2
  };

  const question = new MatchListPage();
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
    it(" > question text", () => {
      question.getQuestionText().type("{selectall}question");
    });
    context(" > TC_74 => List", () => {
      it(" > Edit the list existing names", () => {
        question.getListInputs().each(($el, index) => {
          cy.wrap($el)
            .clear()
            .type(queData.list[index])
            .should("contain", queData.list[index]);
        });
        cy.get("body").click();
      });

      it(" > Add new list items", () => {
        question
          .getAddInputButton()
          .click({ force: true })
          .then(() => {
            question.getListInputs().should("have.length", queData.list.length + 1);
            question
              .getListDeleteByIndex(queData.list.length)
              .click({ force: true })
              .then(() => {
                question.getListInputs().should("have.length", queData.list.length);
              });
          });
      });
    });

    context(" > TC_75 => Group possible responses", () => {
      it(" > Check the group possible responses checkbox", () => {
        question.getGroupResponsesCheckbox().click();

        question
          .getGroupResponsesCheckbox()
          .find("input")
          .should("be.checked");

        question.getGroupContainerByIndex(0).should("be.visible");
      });

      it(" > Enter the title of group", () => {
        question
          .getTitleInputByIndex(0)
          .clear()
          .type("Group1")
          .should("have.value", "Group1");
      });

      it(" > Add/Delete new choices", () => {
        question
          .getChoiceListByGroup(0)
          .each(($el, index, $list) => {
            const cusIndex = $list.length - (index + 1);
            question.deleteChoiceByGroup(0, cusIndex);
          })
          .should("have.length", 0);

        queData.choices.forEach((ch, index) => {
          question
            .getAddNewChoiceByIndex(0)
            .should("be.visible")
            .click();
          question
            .getChoiceEditorByGroup(0, index)
            .type(`{selectall}${ch}`)
            .should("be.visible");
          question
            .getDragDropBox()
            .contains("p", ch)
            .should("be.visible");
        });
        question.getAddNewChoiceByIndex(0).click({ force: true });
        question
          .getChoiceEditorByGroup(0, 3)
          .type(`{selectall}dummy`)
          .should("be.visible");
      });

      it(" > Add new group", () => {
        question
          .getAddNewGroupButton()
          .click()
          .then(() => {
            question.getGroupContainerByIndex(1).should("be.visible");
          });
      });

      it(" > Delete group", () => {
        question
          .getGroupContainerByIndex(1)
          .contains("div", "Group 2")
          .parent()
          .next()
          .should("be.visible")
          .click()
          .then(() => {
            question.getGroupContainerByIndex(1).should("not.exist");
          });
      });
    });

    context(" > TC_76 => Set Correct Answer(s)", () => {
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
      it(" > Drag and drop the answer choices inside the box", () => {
        queData.choices.forEach((ch, index) => {
          question.getDragDropItemByIndex(index).scrollIntoView();
          question.getDragDropItemByIndex(index).customDragDrop(`#drag-drop-board-${index}`);
          cy.get(`.drag-drop-item-match-list`)
            .last()
            .trigger("dragstart", {});
          question.getDragDropBoardByIndex(index).contains("p", ch);
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

    context(" > TC_77 => Save question", () => {
      it(" > Click on save button", () => {
        question.header.saveAndgetId().then(id => {
          testItemId = id;
        });
        cy.url().should("contain", "item-detail");
      });
    });

    context(" > TC_78 => Preview Items", () => {
      it(" > Click on preview", () => {
        preview = editItem.header.preview();

        queData.choices.forEach((ch, index) => {
          question.getDragDropItemByIndex(index).customDragDrop(`#drag-drop-board-${index}`);
          cy.get(`.drag-drop-item-match-list`)
            .last()
            .trigger("dragstart", {});
          question.getDragDropBoardByIndex(index).contains("p", ch);
        });
      });

      it(" > Click on Check answer", () => {
        preview.checkScore("1/1");
      });

      it(" > Click on Show Answers", () => {
        preview
          .getShowAnswer()
          .click()
          .then(() => {
            cy.get("body")
              .children()
              .contains("h3", "Correct Answers");
          });
      });

      it(" > Click on Clear", () => {
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

  context(" > Edit the questin created", () => {
    before("delete old question and create dummy que to edit", () => {
      editItem.sideBar.clickOnItemBank();
      itemList.searchFilters.clearAll();
      itemList.searchFilters.getAuthoredByMe();
      itemList.clickOnViewItemById(testItemId);
      itemList.itemPreview.clickEditOnPreview();
    });

    context(" > TC_81 => List", () => {
      it(" > Edit the list existing names", () => {
        question.getListInputs().each(($el, index) => {
          cy.wrap($el)
            .clear()
            .type(queData.list[index])
            .should("contain", queData.list[index]);
        });
        cy.get("body").click();
      });

      it(" > Add new list items", () => {
        question
          .getAddInputButton()
          .click({ force: true })
          .then(() => {
            question.getListInputs().should("have.length", queData.list.length + 1);
            question
              .getListDeleteByIndex(queData.list.length)
              .click({ force: true })
              .then(() => {
                question.getListInputs().should("have.length", queData.list.length);
              });
          });
      });
    });

    context(" > TC_81 => Group possible responses", () => {
      it(" > Check the group possible responses checkbox", () => {
        question
          .getGroupResponsesCheckbox()
          .find("input")
          .should("be.checked");

        question.getGroupContainerByIndex(0).should("be.visible");
      });

      it(" > Enter the title of group", () => {
        question
          .getTitleInputByIndex(0)
          .clear()
          .type("Group1")
          .should("have.value", "Group1");
      });

      it(" > Add/Delete new choices", () => {
        question
          .getChoiceListByGroup(0)
          .each(($el, index, $list) => {
            const cusIndex = $list.length - (index + 1);
            question.deleteChoiceByGroup(0, cusIndex);
          })
          .should("have.length", 0);

        queData.edited.forEach((ch, index) => {
          question
            .getAddNewChoiceByIndex(0)
            .should("be.visible")
            .click();
          question
            .getChoiceEditorByGroup(0, index)
            .type(`{selectall}${ch}`)
            .should("be.visible");
          question
            .getDragDropBox()
            .contains("p", ch)
            .should("be.visible");
        });
        question.getAddNewChoiceByIndex(0).click({ force: true });
        question
          .getChoiceEditorByGroup(0, 3)
          .type(`{selectall}dummy`)
          .should("be.visible");
      });

      it(" > Add new group", () => {
        question
          .getAddNewGroupButton()
          .click()
          .then(() => {
            question.getGroupContainerByIndex(1).should("be.visible");
          });
      });

      it(" > Delete group", () => {
        question
          .getGroupContainerByIndex(1)
          .contains("div", "Group 2")
          .parent()
          .next()
          .should("be.visible")
          .click()
          .then(() => {
            question.getGroupContainerByIndex(1).should("not.exist");
          });
      });
    });

    context(" > TC_82 => Set Correct Answer(s)", () => {
      it(" > Update Points", () => {
        question
          .getPontsInput()
          .focus()
          .clear()
          .type("{selectall}1")
          .should("have.value", "1")
          .type("{uparrow}")
          .should("have.value", "1.5")
          .blur();
      });

      it(" > Drag and drop the answer choices inside the box", () => {
        queData.choices.forEach((ch, index) => {
          question.getDragDropItemByIndex(index).scrollIntoView();
          question.getDragDropItemByIndex(index).customDragDrop(`#drag-drop-board-${index}`);
          cy.get(`.drag-drop-item-match-list`)
            .last()
            .trigger("dragstart", {});
          question.getDragDropBoardByIndex(index).contains("p", ch);
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

    context(" > TC_83 => Save question", () => {
      it(" > Click on save button", () => {
        question.header.save(true);
        cy.url().should("contain", "item-detail");
      });
    });
  });

  /* context.skip(" > Delete the question after creation", () => {
    context(" > TC_84 => Delete option", () => {
      before("visit items page and select question type", () => {
        editItem.createNewItem();
        // add new question
        editItem.chooseQuestion(queData.group, queData.queType);
        question.header.save();
      });

      it(" > Click on delete button in Item Details page", () => {
        editItem
          .getDelButton()
          .should("have.length", 1)
          .click()
          .should("have.length", 0);
      });
    });
  }); */

  context(" > Advanced Options", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();
      // add new question
      editItem.chooseQuestion(queData.group, queData.queType);
    });

    beforeEach(() => {
      editItem.header.edit();
      editItem.showAdvancedOptions();
      // editItem.showAdvancedOptions(); // UI toggle has been removed
    });

    afterEach(() => {
      editItem.header.edit();
    });

    describe(" > Layout", () => {
      it(" > should be able to select top response container position", () => {
        const select = question.getResponseContainerPositionSelect().scrollIntoView();

        select.should("be.visible").click();

        question
          .getTopResContainerOption()
          .should("be.visible")
          .click();

        select.should("contain", "Top");
        question.checkResponseContainerPosition("top");
      });
      it(" > should be able to select bottom response container position", () => {
        const select = question.getResponseContainerPositionSelect().scrollIntoView();

        select.should("be.visible").click();

        question
          .getBottomResContainerOption()
          .should("be.visible")
          .click();

        select.should("contain", "Bottom");
        question.checkResponseContainerPosition("bottom");
      });
      it(" > should be able to select left response container position", () => {
        const select = question.getResponseContainerPositionSelect().scrollIntoView();

        select.should("be.visible").click();

        question
          .getLeftResContainerOption()
          .should("be.visible")
          .click();

        select.should("contain", "Left");
        question.checkResponseContainerPosition("left");
      });
      it(" > should be able to select right response container position", () => {
        const select = question.getResponseContainerPositionSelect().scrollIntoView();

        select.should("be.visible").click();

        question
          .getRightResContainerOption()
          .should("be.visible")
          .click();

        select.should("contain", "Right");
        question.checkResponseContainerPosition("right");
      });
      it(" > should be able to select numerical stem numeration", () => {
        const select = question.getStemNumerationSelect().scrollIntoView();

        select.should("be.visible").click();

        question
          .getNumericalOption()
          .should("be.visible")
          .click();

        select.should("contain", "Numerical");
      });
      it(" > should be able to select Uppercase Alphabet stem numeration", () => {
        const select = question.getStemNumerationSelect().scrollIntoView();

        select.should("be.visible").click();

        question
          .getUppercaseAlphabetOption()
          .should("be.visible")
          .click();

        select.should("contain", "Uppercase Alphabet");
      });
      it(" > should be able to select Lowercase Alphabet stem numeration", () => {
        const select = question.getStemNumerationSelect().scrollIntoView();

        select.should("be.visible").click();

        question
          .getLowercaseAlphabetOption()
          .should("be.visible")
          .click();

        select.should("contain", "Lowercase Alphabet");
      });
      it(" > should be able to select small font size", () => {
        const select = question.getFontSizeSelect().scrollIntoView();
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
        const select = question.getFontSizeSelect().scrollIntoView();
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
        const select = question.getFontSizeSelect().scrollIntoView();
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
        const select = question.getFontSizeSelect().scrollIntoView();
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
        const select = question.getFontSizeSelect().scrollIntoView();
        const { name, font } = Helpers.fontSize("xxlarge");

        select.should("be.visible").click();

        question
          .getHugeFontSizeOption()
          .should("be.visible")
          .click();

        select.should("contain", name);
        question.checkFontSize(font);
      });
    });
  });

  context(" > Scoring block test", () => {
    before("delete old question and create dummy que to edit", () => {
      editItem.createNewItem();
      // add new question
      editItem.chooseQuestion(queData.group, queData.queType);

      question
        .getGroupResponsesCheckbox()
        .find("input")
        .check({ force: true })
        .should("be.checked");

      question.getAddNewChoiceByIndex(0).click({ force: true });
      question
        .getChoiceEditorByGroup(0, 3)
        .type(`{selectall}dummy`)
        .should("be.visible");
    });

    afterEach(() => {
      preview = question.header.preview();

      preview.getClear().click();

      question.header.edit();
    });

    /*   it(" > Test score with max score", () => {
      question
        .getMaxScore()
        .clear()
        .type(1);

      preview = question.header.preview();

      preview.checkScore("0/10");
    }); */

    it(" > Test score with alternate and min score if attempted", () => {
      // question.getMaxScore().clear();

      // question.getEnableAutoScoring().click();

      /*  question
        .getMinScore()
        .clear()
        .type(2); */

      question
        .getPontsInput()
        .clear()
        .type("9{del}");

      question.addAlternate();

      question
        .getAddedAlternate()
        .parent()
        .click();

      question
        .getPontsInput()
        .clear()
        .type("12{del}");

      question.getDragDropItemByIndex(0).customDragDrop(`#drag-drop-board-${1}`);
      question.dragDummyChoice();
      question.getDragDropItemByIndex(0).customDragDrop(`#drag-drop-board-${0}`);
      question.dragDummyChoice();
      question.getDragDropItemByIndex(0).customDragDrop(`#drag-drop-board-${2}`);
      question.dragDummyChoice();

      preview = question.header.preview();

      question.getDragDropItemByIndex(0).customDragDrop(`#drag-drop-board-${1}`);
      question.dragDummyChoice();

      question.getDragDropItemByIndex(0).customDragDrop(`#drag-drop-board-${0}`);
      question.dragDummyChoice();

      question.getDragDropItemByIndex(0).customDragDrop(`#drag-drop-board-${2}`);
      question.dragDummyChoice();

      preview.checkScore("12/12");

      preview.clickOnClear();

      question.getDragDropItemByIndex(0).customDragDrop(`#drag-drop-board-${0}`);
      question.dragDummyChoice();

      question.getDragDropItemByIndex(0).customDragDrop(`#drag-drop-board-${1}`);
      question.dragDummyChoice();

      question.getDragDropItemByIndex(0).customDragDrop(`#drag-drop-board-${2}`);
      question.dragDummyChoice();

      preview.checkScore("0/12");

      preview.getClear().click();

      question.getDragDropItemByIndex(0).customDragDrop(`#drag-drop-board-${1}`);
      question.dragDummyChoice();

      preview.checkScore("0/12");
    });

    it(" > Test score with partial match and panalty", () => {
      question
        .getAddedAlternate()
        .then($el => {
          cy.wrap($el).click();
        })
        .should("not.exist");
      question
        .getPontsInput()
        .clear()
        .type("{selectall}9");

      question.getDragDropItemByIndex(0).customDragDrop(`#drag-drop-board-${0}`);
      question.dragDummyChoice();
      question.getDragDropItemByIndex(0).customDragDrop(`#drag-drop-board-${1}`);
      question.dragDummyChoice();
      question.getDragDropItemByIndex(0).customDragDrop(`#drag-drop-board-${2}`);
      question.dragDummyChoice();

      editItem.showAdvancedOptions();

      question.selectScoringType("Partial match");

      question
        .getPanalty()
        .clear()
        .type(`{selectall}3`);

      preview = question.header.preview();

      question.getDragDropItemByIndex(0).customDragDrop(`#drag-drop-board-${0}`);
      question.dragDummyChoice();
      question.getDragDropItemByIndex(0).customDragDrop(`#drag-drop-board-${2}`);
      question.dragDummyChoice();
      question.getDragDropItemByIndex(0).customDragDrop(`#drag-drop-board-${1}`);
      question.dragDummyChoice();

      preview.checkScore("1/9");
    });
  });
});
