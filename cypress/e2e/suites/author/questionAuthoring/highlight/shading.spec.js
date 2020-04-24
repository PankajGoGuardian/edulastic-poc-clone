import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import ShadingPage from "../../../../framework/author/itemList/questionType/highlight/shadingPage";
import FileHelper from "../../../../framework/util/fileHelper";
import Helpers from "../../../../framework/util/Helpers";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import { queColor } from "../../../../framework/constants/questionTypes";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Shading" type question`, () => {
  describe(" > Shading", () => {
    const queData = {
      group: "Highlight",
      queType: "Shading",
      queText: "Shade the first and last box?",
      extlink: "www.testdomain.com",
      testtext: "testtext",
      formula: "s=ar^2"
    };

    const question = new ShadingPage();
    const editItem = new EditItemPage();
    const itemList = new ItemListPage();
    let preview;

    before(() => {
      cy.login();
    });

    const RED = queColor.RED_1;
    const GREEN = queColor.RIGHT;
    const CLEAR = queColor.GREEN_2;
    const BLUE = queColor.BLUE;

    context(" > Create basic question and validate.", () => {
      before("visit items page and select question type", () => {
        editItem.createNewItem();
        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
      });

      it(" > [shad_s1] : user create question with default option and save", () => {
        // enter question
        question
          .getQuestionEditor()
          .clear()
          .type(queData.queText)
          .should("have.text", queData.queText);
        // set correct ans
        question
          .getCorrectAnsRowByIndex(0)
          .find("li")
          .first()
          .click({ force: true })
          .should("not.have.css", "background-color", "transparent");

        question
          .getCorrectAnsRowByIndex(0)
          .find("li")
          .last()
          .click({ force: true })
          .should("not.have.css", "background-color", "transparent");

        // save que
        question.header.save();
      });

      it(" > [shad_s2] : preview and validate with right/wrong ans", () => {
        preview = editItem.header.preview();
        // enter right ans
        question
          .getCorrectAnsRowByIndexOnPreview(0)
          .find("li")
          .first()
          .as("first")
          .click({ force: true });
        question
          .getCorrectAnsRowByIndexOnPreview(0)
          .find("li")
          .last()
          .as("last")
          .click({ force: true });

        preview.checkScore("1/1");

        cy.get("@first").should("have.css", "background-color", GREEN);

        cy.get("@last").should("have.css", "background-color", GREEN);

        preview
          .getClear()
          .click()
          .then(() => {
            question
              .getCorrectAnsRowByIndexOnPreview(0)
              .find("li")
              .then($cells => {
                cy.wrap($cells).each(ele => {
                  expect(ele).to.have.css("background-color", CLEAR);
                });
              });
          });

        // enter partial correct ans
        question
          .getCorrectAnsRowByIndexOnPreview(0)
          .find("li")
          .eq(0)
          .as("wrong")
          .click();

        preview.checkScore("0/1");

        cy.get("@wrong").should("have.css", "background-color", GREEN);

        preview.getClear().click();

        // enter wrong ans1
        question
          .getCorrectAnsRowByIndexOnPreview(0)
          .find("li")
          .eq(1)
          .as("wrong1")
          .click();

        preview.checkScore("0/1");

        cy.get("@wrong1").should("have.css", "background-color", RED);

        preview.getClear().click();

        // show ans
        preview
          .getShowAnswer()
          .click()
          .then(() => {
            cy.get("body")
              .contains("Correct Answer")
              .parent()
              .find("li")
              .first()
              // cy.get("@first").
              .should("have.css", "background-color", GREEN);
            cy.get("body")
              .contains("Correct Answer")
              .parent()
              .find("li")
              .last()
              //cy.get("@last")
              .should("have.css", "background-color", GREEN);
          });
      });
    });

    context(" > Advanced Options", () => {
      before("visit items page and select question type", () => {
        editItem.createNewItem();

        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
      });

      beforeEach(() => {
        editItem.header.edit();
        editItem.showAdvancedOptions(); // UI toggle has been removed
      });

      afterEach(() => {
        editItem.header.edit();
      });

      describe(" > Layout", () => {
        describe(" > Hide cells", () => {
          it(" > should be able to hide an each cell", () => {
            question
              .getCellsRowByIndexInLayout(0)
              .find("li")
              .each($el => {
                cy.wrap($el)
                  .click()
                  .should("have.css", "background-color")
                  .and("eq", BLUE);
              });

            editItem.header.preview();
            question
              .getCorrectAnsRowByIndexOnPreview(0)
              .find("li")
              .each($el => {
                cy.wrap($el)
                  .should("have.attr", "visibility")
                  .and("eq", "hidden");
              });
          });
          it(" > should be able to unhide an each cell", () => {
            question
              .getCellsRowByIndexInLayout(0)
              .find("li")
              .each($el => {
                cy.wrap($el)
                  .click()
                  .should("have.css", "background-color")
                  .and("eq", CLEAR);
              });
            editItem.header.preview();
            question
              .getCorrectAnsRowByIndexOnPreview(0)
              .find("li")
              .each($el => {
                cy.wrap($el)
                  .should("have.attr", "visibility")
                  .and("eq", "visible");
              });
          });
        });
        it(" > should be able to select border type: Outer", () => {
          const select = question.getBorderTypeSelect();

          select.click({ force: true });

          question.getOuterOption().click({ force: true });

          // select.should("contain", "Outer");

          editItem.header.preview();
          question
            .getCellContainerInPreview()
            .should("have.css", "border")
            .and("eq", "2px solid rgb(6, 148, 72)");
        });
        it(" > should be able to select border type: Full", () => {
          // const select = question.getBorderTypeSelect();
          cy.get(`[data-cy="borderTypeSelect"]`).click({ force: true });

          question
            .getFullOption()

            .click({ force: true });

          cy.get(`[data-cy="borderTypeSelect"]`).should("contain", "Full");

          editItem.header.preview();
          question
            .getCorrectAnsRowByIndexOnPreview(0)
            .find("li")
            .each($el => {
              cy.wrap($el)
                .should("have.css", "border-width")
                .and("eq", "2px");
            });
        });
        it(" > should be able to select border type: None", () => {
          question
            .getBorderTypeSelect()

            .click({ force: true });

          question
            .getNoneOption()

            .click({ force: true });

          question.getBorderTypeSelect().should("contain", "None");

          editItem.header.preview();
          question
            .getCorrectAnsRowByIndexOnPreview(0)
            .find("li")
            .each($el => {
              cy.wrap($el)
                .should("have.css", "border-width")
                .and("eq", "0px");
            });
        });
        it(" > should be able to set 2 selection", () => {
          const maxSelectionValue = 2;

          question
            .getMaxSelection()
            .scrollIntoView()

            //.invoke("attr", "type", "text")

            .type(`selectall${maxSelectionValue}`)

            .should("have.value", `0${maxSelectionValue}`);

          editItem.header.preview();
          question
            .getCorrectAnsRowByIndexOnPreview(0)
            .find("li")
            .each(($el, index) => {
              cy.wrap($el)
                .should("be.visible")
                .click()
                .as("item");

              if (index < maxSelectionValue) {
                cy.get("@item")
                  .should("have.css", "background-color")
                  .and("eq", BLUE);
              } else {
                cy.get("@item")
                  .should("have.css", "background-color")
                  .and("eq", CLEAR);
              }
            });
        });
        it(" > should be able to set 0 selection", () => {
          const maxSelectionValue = 0;

          question
            .getMaxSelection()
            .scrollIntoView()
            .clear({ force: true })
            .type(`${maxSelectionValue}`)
            .should("have.value", `0${maxSelectionValue}`);

          editItem.header.preview();
          question
            .getCorrectAnsRowByIndexOnPreview(0)
            .find("li")
            .each($el => {
              cy.wrap($el)
                .should("be.visible")
                .click()
                .as("item");

              cy.get("@item")
                .should("have.css", "background-color")
                .and("eq", BLUE);
            });
        });
        // it(" > should be able to check and uncheck hover state option", () => {
        //   question
        //     .getHoverStateOption()
        //     .check({ force: true })
        //     .should("be.checked")
        //     .uncheck({ force: true })
        //     .should("not.to.be.checked");
        // });
        it(" > should be able to check Hover state checkbox", () => {
          question
            .getHoverStateOption()

            .check({ force: true })
            .should("be.checked");
        });
        it(" > should be able to uncheck Hover state checkbox", () => {
          question
            .getHoverStateOption()
            .uncheck({ force: true })
            .should("not.to.be.checked");
        });
        it(" > should be able to select small font size", () => {
          const select = question.getFontSizeSelect();
          const { name, font } = Helpers.fontSize("small");

          select.click({ force: true });

          question.getSmallFontSizeOption().click({ force: true });

          select.should("contain", name);
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

          question
            .getLargeFontSizeOption()

            .click({ force: true });

          select.should("contain", name);
          question.checkFontSize(font);
        });
        it(" > should be able to select extra large font size", () => {
          const select = question.getFontSizeSelect();
          const { name, font } = Helpers.fontSize("xlarge");

          select.click({ force: true });

          question
            .getExtraLargeFontSizeOption()

            .click({ force: true });

          select.should("contain", name);
          question.checkFontSize(font);
        });
        it(" > should be able to select huge font size", () => {
          const select = question.getFontSizeSelect();
          const { name, font } = Helpers.fontSize("xxlarge");

          select.click({ force: true });

          question
            .getHugeFontSizeOption()

            .click({ force: true });

          select.should("contain", name);
          question.checkFontSize(font);
        });
      });
    });

    context(" > Scoring block test", () => {
      before("visit items page and select question type", () => {
        editItem.createNewItem();

        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
      });

      afterEach(() => {
        preview = editItem.header.preview();
        preview
          .getClear()
          .click()
          .then(() => {
            question
              .getCorrectAnsRowByIndexOnPreview(0)
              .find("li")
              .then($cells => {
                cy.wrap($cells).each(ele => {
                  expect(ele).to.have.css("background-color", CLEAR);
                });
              });
          });

        editItem.header.edit();
        // editItem.showAdvancedOptions(); //
      });

      it(" > Test with alternate answer", () => {
        // enter question
        // question
        //   .getQuestionEditor()
        //   .clear()
        //   .type(queData.queText)
        //   .should("have.text", queData.queText);

        // set correct ans
        question
          .getCorrectAnsRowByIndex(0)
          .find("li")
          .first()
          .click()
          .should("not.have.css", "background-color", "transparent");

        question
          .getCorrectAnsRowByIndex(0)
          .find("li")
          .last()
          .click()
          .should("not.have.css", "background-color", "transparent");

        question
          .getPoints()
          .clear()
          .type("{selectall}4");

        question.addAlternate();
        question.switchOnAlternateAnswer();

        question
          .getPoints()
          .clear()
          .type("{selectall}6");

        question
          .getCorrectAnsRowByIndex(0)
          .find("li")
          .last()
          .click();

        question
          .getCorrectAnsRowByIndex(0)
          .find("li")
          .eq(1)
          .click();

        question
          .getCorrectAnsRowByIndex(0)
          .find("li")
          .eq(2)
          .click();

        preview = editItem.header.preview();
        // enter right ans
        question
          .getCorrectAnsRowByIndexOnPreview(0)
          .find("li")
          .first()
          .as("first")
          .click();
        question
          .getCorrectAnsRowByIndexOnPreview(0)
          .find("li")
          .last()
          .as("last")
          .click();

        preview.checkScore("4/6");

        cy.get("@first").should("have.css", "background-color", GREEN);

        cy.get("@last").should("have.css", "background-color", GREEN);

        preview
          .getClear()
          .click()
          .then(() => {
            question
              .getCorrectAnsRowByIndexOnPreview(0)
              .find("li")
              .then($cells => {
                cy.wrap($cells).each(ele => {
                  expect(ele).to.have.css("background-color", CLEAR);
                });
              });
          });

        question
          .getCorrectAnsRowByIndexOnPreview(0)
          .find("li")
          .last()
          .as("first")
          .click();

        question
          .getCorrectAnsRowByIndexOnPreview(0)
          .find("li")
          .eq(1)
          .as("second")
          .click();

        question
          .getCorrectAnsRowByIndexOnPreview(0)
          .find("li")
          .eq(2)
          .as("third")
          .click();

        preview.checkScore("6/6");

        cy.get("@first").should("have.css", "background-color", GREEN);

        cy.get("@second").should("have.css", "background-color", GREEN);

        cy.get("@third").should("have.css", "background-color", GREEN);

        preview
          .getClear()
          .click()
          .then(() => {
            question
              .getCorrectAnsRowByIndexOnPreview(0)
              .find("li")
              .then($cells => {
                cy.wrap($cells).each(ele => {
                  expect(ele).to.have.css("background-color", CLEAR);
                });
              });
          });

        question
          .getCorrectAnsRowByIndexOnPreview(0)
          .find("li")
          .last()
          .as("last")
          .click();
        question
          .getCorrectAnsRowByIndexOnPreview(0)
          .find("li")
          .first()
          .as("first")
          .click();

        question
          .getCorrectAnsRowByIndexOnPreview(0)
          .find("li")
          .eq(1)
          .as("second")
          .click();

        preview.checkScore("0/6");

        cy.get("@first").should("have.css", "background-color", GREEN);

        cy.get("@second").should("have.css", "background-color", RED);

        cy.get("@last").should("have.css", "background-color", GREEN);
      });

      it.skip(" > Test with max score", () => {
        question
          .getMaxScore()
          .clear()
          .type(1);

        preview = editItem.header.preview();
        // enter right ans
        question
          .getCorrectAnsRowByIndexOnPreview(queData.queText, 0)
          .find("li")
          .first()
          .as("first")
          .click();
        question
          .getCorrectAnsRowByIndexOnPreview(queData.queText, 0)
          .find("li")
          .last()
          .as("last")
          .click();

        preview
          .getCheckAnswer()
          .click()
          .then(() => {
            preview.getAntMsg().should("contain", "score: 0/10");

            cy.get("@first").should("have.css", "background-color", GREEN);

            cy.get("@last").should("have.css", "background-color", GREEN);
          });
      });

      it.skip(" > Test with min score if attempted", () => {
        question.getMaxScore().clear();

        question.getEnableAutoScoring().click();

        question.getMinScore().type(1);

        preview = editItem.header.preview();

        question
          .getCorrectAnsRowByIndexOnPreview(queData.queText, 0)
          .find("li")
          .last()
          .as("last")
          .click();
        question
          .getCorrectAnsRowByIndexOnPreview(queData.queText, 0)
          .find("li")
          .first()
          .as("first")
          .click();

        question
          .getCorrectAnsRowByIndexOnPreview(queData.queText, 0)
          .find("li")
          .eq(1)
          .as("second")
          .click();

        preview
          .getCheckAnswer()
          .click()
          .then(() => {
            preview.getAntMsg().should("contain", "score: 1/6");

            cy.get("@first").should("have.css", "background-color", GREEN);

            cy.get("@second").should("have.css", "background-color", GREEN);

            cy.get("@last").should("have.css", "background-color", GREEN);
          });
      });

      it(" > Test with penalty and partial match", () => {
        question.selectScoringType("Partial match");

        // question.getMinScore().clear();

        question.getPanalty().type(3);

        preview = editItem.header.preview();

        question
          .getCorrectAnsRowByIndexOnPreview(0)
          .find("li")
          .first()
          .as("first")
          .click();

        question
          .getCorrectAnsRowByIndexOnPreview(0)
          .find("li")
          .eq(1)
          .as("second")
          .click();

        question
          .getCorrectAnsRowByIndexOnPreview(0)
          .find("li")
          .eq(2)
          .as("fourth")
          .click();

        preview.checkScore("3/6");

        cy.get("@first").should("have.css", "background-color", RED);

        cy.get("@second").should("have.css", "background-color", GREEN);

        cy.get("@fourth").should("have.css", "background-color", GREEN);
      });
    });
  });
});
