import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import ShadingPage from "../../../../framework/author/itemList/questionType/highlight/shadingPage";
import FileHelper from "../../../../framework/util/fileHelper";
import Helpers from "../../../../framework/util/Helpers";
import validateSolutionBlockTests from "../../../../framework/author/itemList/questionType/common/validateSolutionBlockTests";

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
    let preview;

    before(() => {
      cy.login();
    });

    const RED = "rgb(253, 224, 232)";
    const GREEN = "rgb(226, 252, 243)";
    const CLEAR = "rgb(216, 219, 222)";
    const BLUE = "rgba(216, 219, 222, 0.5)";

    context(" > Create basic question and validate.", () => {
      before("visit items page and select question type", () => {
        editItem.createNewItem();
        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
      });

      it(" > [shad_s1] : user create question with default option and save", () => {
        // enter question
        question.enterQuestionText(queData.queText)
          
        // set correct ans - first and last
        question.setCorrectAnswerByIndex(0)
        question.setCorrectAnswerByIndex(5)

        // save que
        question.header.save();
      });

      it(" > [shad_s2] : preview and validate with right/wrong ans", () => {
        preview = editItem.header.preview();
        // enter right ans
        question.clickCellInPreview(0)
        question.clickCellInPreview(5)
        preview.checkScore("1/1");
        question.verifyCellColorInPreview(0,GREEN)
        question.verifyCellColorInPreview(5,GREEN)
        question.clickClearInPreview()

        // enter partial correct ans
        question.clickCellInPreview(0)
        preview.checkScore("0/1");
        question.verifyCellColorInPreview(0,GREEN)
        question.clickClearInPreview()

        // enter wrong ans1
        question.clickCellInPreview(1)
        preview.checkScore("0/1");
        question.verifyCellColorInPreview(1,RED)
        question.clickClearInPreview()

        // show ans
        question.checkShowAnswers([0,5])
      });
    });

    context(" > Canvas options", () => {
      before("visit items page and select question type", () => {
        editItem.createNewItem();
        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
      });

      it(" > Increase and decrease row count", () => {
        // enter question
        question.enterQuestionText(queData.queText)

        question.enterRowCount(3)
        question.verifyRowCount(3)

        question.enterRowCount(1)
        question.verifyRowCount(1)
      });

      it(" > Increase and decrease column count", () => {

        question.enterColCount(3)
        question.verifyColCount(3)

        question.enterColCount(6)
        question.verifyColCount(6)
      });

      it(" > Increase and decrease cell height", () => {

        question.enterCellHeight(4)
        question.verifyCellHeight("120px")

        question.enterCellHeight(2)
        question.verifyCellHeight("60px")

      });

      it(" > Increase and decrease cell width", () => {

        question.enterCellWidth(4)
        question.verifyCellWidth("120px")

        question.enterCellWidth(2)
        question.verifyCellWidth("60px")

      });

      it(" > Lock shaded cell", () => {

        // Check true
        question.clickQuestionShadeCell(0)
        question.clickLockCellCheckbox()
        question.verifyCellLockedInAnswer(0,true)
        question.verifyCellLockedInPreview(0,true)

        // Check false
        editItem.header.edit();
        question.clickLockCellCheckbox()
        question.verifyCellLockedInAnswer(0,false)
        question.verifyCellLockedInPreview(0,false)
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
            
            question.clickCellsToHide([0,1,2,3,4,5], true)
            question.verifyCellsHiddenInAnswer([0,1,2,3,4,5], true)
            editItem.header.preview();
            question.verifyCellsHiddenInPreview([0,1,2,3,4,5], true)
          });
          it(" > should be able to unhide an each cell", () => {
            question.clickCellsToHide([0,1,2,3,4,5], false)
            question.verifyCellsHiddenInAnswer([0,1,2,3,4,5], false)
            editItem.header.preview();
            question.verifyCellsHiddenInPreview([0,1,2,3,4,5], false)
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
            .and("eq", "2px solid rgb(47, 65, 81)");
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
                .and("eq", "1px");
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

            // .invoke("attr", "type", "text")

            .type(`${maxSelectionValue}`)

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

    context("Hint and solution block testing", () => {
      validateSolutionBlockTests(queData.group, queData.queType);
    });

    context(" > Score by count method", () => {

      before("visit items page and select question type", () => {
        editItem.createNewItem();

        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
      });

      afterEach(() => {
        preview = editItem.header.preview();
        question.clickClearInPreview()
        editItem.header.edit();
        // editItem.showAdvancedOptions(); //
      });

      it(" > Test scoring by count with exact match", () => {
        question.selectMethod("byCount")
        question.enterCount(3)
        question.enterPoints("4")
        question.selectScoringType("Exact match");

        preview = editItem.header.preview();
        // With two cells
        question.clickCellInPreview(0)
        question.clickCellInPreview(5)

        preview.checkScore("0/4");

        question.verifyCellColorInPreview(0,GREEN)
        question.verifyCellColorInPreview(5,GREEN)

        question.clickClearInPreview()

        // With three cells
        question.clickCellInPreview(5)
        question.clickCellInPreview(1)
        question.clickCellInPreview(2)

        preview.checkScore("4/4");

        question.verifyCellColorInPreview(5,GREEN)
        question.verifyCellColorInPreview(1,GREEN)
        question.verifyCellColorInPreview(2,GREEN)

        question.clickClearInPreview()

        // With four cells
        question.clickCellInPreview(5)
        question.clickCellInPreview(1)
        question.clickCellInPreview(2)
        question.clickCellInPreview(0)

        preview.checkScore("0/4");

        question.verifyCellColorInPreview(5,GREEN)
        question.verifyCellColorInPreview(1,GREEN)
        question.verifyCellColorInPreview(2,GREEN)
        question.verifyCellColorInPreview(0,RED)
      })

      it(" > Test scoring by count with partial match", () => {

        question.selectScoringType("Partial match");

        preview = editItem.header.preview();

        // With two cells and partial
        question.clickCellInPreview(0)
        question.clickCellInPreview(5)

        preview.checkScore("2.67/4");

        question.verifyCellColorInPreview(0,GREEN)
        question.verifyCellColorInPreview(5,GREEN)

        question.clickClearInPreview()

        // With three cells and partial
        question.clickCellInPreview(5)
        question.clickCellInPreview(1)
        question.clickCellInPreview(2)

        preview.checkScore("4/4");

        question.verifyCellColorInPreview(5,GREEN)
        question.verifyCellColorInPreview(1,GREEN)
        question.verifyCellColorInPreview(2,GREEN)

        question.clickClearInPreview()

        // With four cells and partial
        question.clickCellInPreview(5)
        question.clickCellInPreview(1)
        question.clickCellInPreview(2)
        question.clickCellInPreview(0)

        preview.checkScore("4/4");

        question.verifyCellColorInPreview(5,GREEN)
        question.verifyCellColorInPreview(1,GREEN)
        question.verifyCellColorInPreview(2,GREEN)
        question.verifyCellColorInPreview(0,RED)
      })

      it(" > Test with penalty and partial match", () => {
        question.selectScoringType("Partial match");

        // question.getMinScore().clear();

        question.getPanalty().type(2);

        preview = editItem.header.preview();

        // With two cells with partial and penalty
        question.clickCellInPreview(5)
        question.clickCellInPreview(0)

        preview.checkScore("2.67/4");

        question.verifyCellColorInPreview(5,GREEN)
        question.verifyCellColorInPreview(0,GREEN)

        question.clickClearInPreview()

        // With three cells with partial and penalty
        question.clickCellInPreview(5)
        question.clickCellInPreview(1)
        question.clickCellInPreview(2)

        preview.checkScore("4/4");

        question.verifyCellColorInPreview(5,GREEN)
        question.verifyCellColorInPreview(1,GREEN)
        question.verifyCellColorInPreview(2,GREEN)

        question.clickClearInPreview()

        // With four cells with partial and penalty
        question.clickCellInPreview(5)
        question.clickCellInPreview(1)
        question.clickCellInPreview(2)
        question.clickCellInPreview(0)

        preview.checkScore("3.33/4");

        question.verifyCellColorInPreview(5,GREEN)
        question.verifyCellColorInPreview(1,GREEN)
        question.verifyCellColorInPreview(2,GREEN)
        question.verifyCellColorInPreview(0,RED)

        editItem.header.edit();
        question.selectRoundingOption("Round down")
        preview = editItem.header.preview();

        // With two cells with partial and penalty and round
        question.clickCellInPreview(5)
        question.clickCellInPreview(0)

        preview.checkScore("2/4");

        question.verifyCellColorInPreview(5,GREEN)
        question.verifyCellColorInPreview(0,GREEN)

        question.clickClearInPreview()

        // With four cells with partial and penalty and round
        question.clickCellInPreview(5)
        question.clickCellInPreview(1)
        question.clickCellInPreview(2)
        question.clickCellInPreview(0)

        preview.checkScore("3/4");

        question.verifyCellColorInPreview(5,GREEN)
        question.verifyCellColorInPreview(1,GREEN)
        question.verifyCellColorInPreview(2,GREEN)
        question.verifyCellColorInPreview(0,RED)

      })

      it(" > Test scoring by count with alternate answer", () => {

        question.addAlternate();
        question.switchOnAlternateAnswer();
        question.selectMethod("byLocation")

        question.enterPoints("3")

        question.setCorrectAnswerByIndex(5)
        question.setCorrectAnswerByIndex(0)

        preview = editItem.header.preview();
        // enter right ans
        question.clickCellInPreview(5)
        question.clickCellInPreview(0)

        preview.checkScore("3/4");

        question.verifyCellColorInPreview(5,GREEN)
        question.verifyCellColorInPreview(0,GREEN)
      })
    });

    context.only(" > Score by location method", () => {

      before("visit items page and select question type", () => {
        editItem.createNewItem();

        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
      });

      afterEach(() => {
        preview = editItem.header.preview();
        question.clickClearInPreview()

        editItem.header.edit();
        // editItem.showAdvancedOptions(); //
      });

      it(" > Test scoring with alternate answer", () => {
        // set correct ans
        question.setCorrectAnswerByIndex(0)
        question.setCorrectAnswerByIndex(5)

        question.enterPoints("4")

        question.addAlternate();
        question.switchOnAlternateAnswer();

        question.enterPoints("4")

        question.setCorrectAnswerByIndex(5)
        question.setCorrectAnswerByIndex(1)
        question.setCorrectAnswerByIndex(2)

        preview = editItem.header.preview();
        // enter right ans
        question.clickCellInPreview(5)
        question.clickCellInPreview(0)

        preview.checkScore("4/4");
        question.verifyCellColorInPreview(5,GREEN)
        question.verifyCellColorInPreview(0,GREEN)

        question.clickClearInPreview()

        question.clickCellInPreview(5)
        question.clickCellInPreview(1)
        question.clickCellInPreview(2)

        preview.checkScore("4/4");

        question.verifyCellColorInPreview(5,GREEN)
        question.verifyCellColorInPreview(1,GREEN)
        question.verifyCellColorInPreview(2,GREEN)

        question.clickClearInPreview()

        question.clickCellInPreview(5)
        question.clickCellInPreview(0)
        question.clickCellInPreview(1)

        preview.checkScore("0/4");

        question.verifyCellColorInPreview(5,GREEN)
        question.verifyCellColorInPreview(0,GREEN)
        question.verifyCellColorInPreview(1,RED)

      });

      it(" > Test scoring by count with partial match and penalty", () => {
        question.selectScoringType("Partial match")
        preview = editItem.header.preview();

        question.clickCellInPreview(0)
        question.clickCellInPreview(1)
        question.clickCellInPreview(2)

        preview.checkScore("2.67/4");

        question.verifyCellColorInPreview(1,GREEN)
        question.verifyCellColorInPreview(0,RED)
        question.verifyCellColorInPreview(2,GREEN)

        editItem.header.edit();
        question.selectRoundingOption("None")

        question.enterPenalty(2);

        preview = editItem.header.preview();

        question.clickCellInPreview(0)
        question.clickCellInPreview(1)
        question.clickCellInPreview(2)

        preview.checkScore("2/4");

        question.verifyCellColorInPreview(1,GREEN)
        question.verifyCellColorInPreview(0,RED)
        question.verifyCellColorInPreview(2,GREEN)
      });

      it(" > Test rounding with penalty and partial match and round down", () => {

        question.selectRoundingOption("Round down");
        question.enterPenalty(0);
        preview = editItem.header.preview();

        question.clickCellInPreview(0)
        question.clickCellInPreview(1)
        question.clickCellInPreview(2)

        preview.checkScore("2/4");

        question.verifyCellColorInPreview(1,GREEN)
        question.verifyCellColorInPreview(0,RED)
        question.verifyCellColorInPreview(2,GREEN)

        editItem.header.edit();
        question.enterPenalty(2);

        preview = editItem.header.preview();

        question.clickCellInPreview(0)
        question.clickCellInPreview(1)
        question.clickCellInPreview(2)
        question.clickCellInPreview(3)

        preview.checkScore("1/4");

        question.verifyCellColorInPreview(1,GREEN)
        question.verifyCellColorInPreview(0,RED)
        question.verifyCellColorInPreview(2,GREEN)
        question.verifyCellColorInPreview(3,RED)

      })

    });
  });
});
