/// <reference types="Cypress" />
import ItemListPage from "../../../../framework/author/itemList/itemListPage.js";
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage.js";
import MCQMultiplePage from "../../../../framework/author/itemList/questionType/mcq/mcqMultiplePage.js";
import FileHelper from "../../../../framework/util/fileHelper";
import {
  SCORING_TYPE,
  STEM,
  STYLE_TYPE,
  FONT_SIZE,
  ORIENTATION
} from "../../../../framework/constants/questionAuthoring";

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)} >> Author "Multiple choice - multiple response" type question`, () => {
  const queData = {
    group: "Multiple Choice",
    queType: "Multiple choice - multiple response",
    queText: "Indian state known as garden spice is:",
    choices: ["Karnataka", "West Bengal", "Kerala", "Delhi", "KL"],
    correct: ["Kerala"],
    alterate: ["KL"],
    extlink: "www.testdomain.com",
    formattext: "formattedtext",
    formula: "s=ar^2"
  };
  const question = new MCQMultiplePage();
  const editItem = new EditItemPage();
  const itemList = new ItemListPage();
  const text = "testtext";
  const formates = question.formates;

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

    it(" > [Tc_267]:test => Enter question text", () => {
      // edit text
      question
        .getQuestionEditor()
        .clear()
        .type(queData.queText)
        .should("contain", queData.queText);
      /* 
      // add ext link
      question.getQuestionEditor()
        .clear()
        .type(queData.formattext);

      question.getQuestionEditor().find('p')
        .makeSelection();

      question.editToolBar.link()
        .click();

      cy.focused().type(queData.extlink)
        .type('{enter}');

      question.getQuestionEditor()
        .contains(queData.formattext)
        .should('have.attr', 'href', queData.extlink);

      // add formula
      question.getQuestionEditor()
        .clear()
        .type(queData.formula);

      question.getQuestionEditor().find('p')
        .makeSelection();

      question.editToolBar.formula()
        .click();

      cy.focused()
        .type(queData.formula)
        .type('{enter}');

      question.getQuestionEditor()
        .find('.ql-formula')
        .should('have.attr', 'data-value', queData.formula);
 */
      /*  // add formatting
      question
        .getQuestionEditor()
        .clear()
        .type(queData.formattext);

      formates.forEach(formate => {
        const text = queData.formattext;
        const { sel, tag } = formate;

        question
          .getQuestionEditor()
          .find("p")
          .makeSelection();

        question.editToolBar
          .frToolbar()
          .find(sel)
          .click();

        question
          .getQuestionEditor()
          .contains(tag, text)
          .should("have.length", 1);

        question.editToolBar
          .frToolbar()
          .find(sel)
          .click();

        question
          .getQuestionEditor()
          .find(tag)
          .should("not.be.exist");
      }); */
    });

    it(" > [Tc_268]:test => Multiple choices options", () => {
      // edit 1st choice
      question
        .getChoiceByIndex(0)
        .clear()
        .type(text)
        .should("contain", text);

      // delete all choices
      question
        .getAllChoices()
        .each(($el, index, $list) => {
          const cusIndex = $list.length - (index + 1);
          question.deleteChoiceByIndex(cusIndex);
        })
        .should("have.length", 0);

      // add new
      const choices = queData.choices;
      choices.forEach((ch, index) => {
        question
          .addNewChoice()
          .getChoiceByIndex(index)
          .clear()
          .type(ch)
          .should("contain", ch);
      });
    });

    it(" > [Tc_269]:test => Set Correct Answer(s)", () => {
      // update points
      question.getPoints().verifyNumInput(0.5);

      // multiple response
      question
        .getMultipleResponse()
        .find("input")
        .should("be.checked");

      question.getAllAnsChoicesLabel().each($el => {
        cy.wrap($el).click();
      });

      question
        .getAllAnsChoicesLabel()
        .find("input:checked")
        .should("have.length.greaterThan", 1);

      // alternate
      question.addAlternate();

      question
        .getAllAnsChoicesLabel()
        .its("length")
        .then(length => {
          question.getAllAnsChoicesLabel().each($el => {
            cy.wrap($el).click();

            cy.wrap($el)
              .find("input")
              .should("be.checked");
          });

          question
            .getAllAnsChoicesLabel()
            .find("input:checked")
            .should("have.length", length);
        });
    });

    it(" > [Tc_270]:test => Advanced Options", () => {
      question.clickOnAdvancedOptions();

      // scoring
      // question.getMaxScore().verifyNumInput(1);

      /* question
        .getEnableAutoScoring()
        .click()
        .then($el => {
          cy.wrap($el).should("have.class", "ant-checkbox-checked");

          question
            .getCheckAnswerCheckbox()
            .click()
            .should("have.class", "ant-checkbox-checked")
            .click()
            .should("not.have.class", "ant-checkbox-checked");
 */
      question.selectScoringType(SCORING_TYPE.PARTIAL);

      question.getPanalty().verifyNumInput(1);

      // question.getCheckAnsAttempt().verifyNumInput(1);

      // question.getMinScore().verifyNumInput(1);

      question
        .getUnscore()
        .click()
        .then($el2 => {
          cy.wrap($el2).should("have.class", "ant-checkbox-checked");

          // question.getMinScore().should("have.attr", "disabled");
        });

      question
        .getUnscore()
        .click()
        .should("not.have.class", "ant-checkbox-checked");
      // });

      /* question
        .getEnableAutoScoring()
        .click()
        .should("not.have.class", "ant-checkbox-checked"); */
    });

    it(" > [Tc_271]:test => Display", () => {
      question.getNumofCol().verifyNumInput(1);

      // font select
      question.selectFontSize(FONT_SIZE.SMALL);

      // orientation select
      question.selectOrientation(ORIENTATION.HORIZONTAL);

      // style select
      question.selectChoicesStyle(STYLE_TYPE.BLOCK);

      // label type
      const labels = [
        {
          label: STEM.NUMERICAL,
          key: "1"
        },
        {
          label: STEM.UPPERCASE,
          key: "A"
        },
        {
          label: STEM.LOWERCASE,
          key: "a"
        }
      ];

      labels.forEach(option => {
        question.selectLabelType(option.label);
        question
          .getAllAnsChoicesLabel()
          .eq(0)
          .find("input")
          .next()
          .should("have.text", option.key);
      });

      question.selectChoicesStyle(STYLE_TYPE.STANDARD);
    });

    it(" > [Tc_272]:test => Save question", () => {
      editItem.header.save();
      // cy.contains(queData.formattext).should("be.visible");
      cy.url().should("contain", "item-detail");
    });

    it(" > [Tc_273]:test => Preview Item", () => {
      const preview = editItem.header.preview();

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.verifyScore("");
        });

      preview.getClear().click();

      preview.getShowAnswer().click();

      preview.getClear().click();

      preview.header.edit();
    });
  });

  context(" > User edit the question.", () => {
    const queData = {
      group: "Multiple Choice",
      queType: "Multiple choice - multiple response",
      queText: "editIndian state known as garden spice is:",
      choices: ["editKarnataka", "editWest Bengal", "editKerala", "editDelhi", "KL"],
      correct: ["editKerala"],
      alterate: ["editKL"],
      extlink: "editwww.testdomain.com",
      formattext: "editformattedtext",
      formula: "edits=ar^2"
    };

    before("delete old question and create dummy que to edit", () => {
      question.createQuestion();
      question.header.save();
      // edit
      question.header.edit();
    });

    it(" > [Tc_274]:test => Enter question text", () => {
      // edit text
      question
        .getQuestionEditor()
        .clear()
        .type(queData.queText)
        .should("contain", queData.queText);
      /*    
      // add ext link
      question.getQuestionEditor()
        .clear()
        .type(queData.formattext);

      question.getQuestionEditor().find('p')
        .makeSelection();

      question.editToolBar.link()
        .click();

      cy.focused().type(queData.extlink)
        .type('{enter}');

      question.getQuestionEditor()
        .contains(queData.formattext)
        .should('have.attr', 'href', queData.extlink);

      // add formula
      question.getQuestionEditor()
        .clear()
        .type(queData.formula);

      question.getQuestionEditor().find('p')
        .makeSelection();

      question.editToolBar.formula()
        .click();

      cy.focused()
        .type(queData.formula)
        .type('{enter}');

      question.getQuestionEditor()
        .find('.ql-formula')
        .should('have.attr', 'data-value', queData.formula);
    */
      /*  // add formatting
      question
        .getQuestionEditor()
        .clear()
        .type(queData.formattext);

      formates.forEach(formate => {
        const text = queData.formattext;
        const { sel, tag } = formate;

        question
          .getQuestionEditor()
          .find("p")
          .makeSelection();

        question.editToolBar
          .frToolbar()
          .find(sel)
          .click();

        question
          .getQuestionEditor()
          .contains(tag, text)
          .should("have.length", 1);

        question.editToolBar
          .frToolbar()
          .find(sel)
          .click();

        question
          .getQuestionEditor()
          .find(tag)
          .should("not.be.exist");
      }); */
    });

    it(" > [Tc_275]:test => Multiple choices options", () => {
      // edit 1st choice
      question
        .getChoiceByIndex(0)
        .clear()
        .type(queData.choices[0])
        .should("contain", queData.choices[0]);

      // delete all choices
      question
        .getAllChoices()
        .each(($el, index, $list) => {
          const cusIndex = $list.length - (index + 1);
          question.deleteChoiceByIndex(cusIndex);
        })
        .should("have.length", 0);

      // add new
      const { choices } = queData;
      choices.forEach((ch, index) => {
        question
          .addNewChoice()
          .getChoiceByIndex(index)
          .clear()
          .type(ch)
          .should("contain", ch);
      });
    });

    it(" > [Tc_276]:test => Set Correct Answer(s)", () => {
      // update points
      question.getPoints().verifyNumInput(0.5);

      // multiple response
      question
        .getMultipleResponse()
        .find("input")
        .should("be.checked");

      question.getAllAnsChoicesLabel().each($el => {
        cy.wrap($el).click();
      });

      question
        .getAllAnsChoicesLabel()
        .find("input:checked")
        .should("have.length.greaterThan", 1);

      // alternate
      question.addAlternate();

      question
        .getAllAnsChoicesLabel()
        .its("length")
        .then(length => {
          question.getAllAnsChoicesLabel().each($el => {
            cy.wrap($el).click();

            cy.wrap($el)
              .find("input")
              .should("be.checked");
          });

          question
            .getAllAnsChoicesLabel()
            .find("input:checked")
            .should("have.length", length);
        });
    });

    it(" > [Tc_277]:test => Advanced Options", () => {
      question.clickOnAdvancedOptions();

      // scoring
      // question.getMaxScore().verifyNumInput(1);

      /*   question
        .getEnableAutoScoring()
        .click()
        .then($el => {
          cy.wrap($el).should("have.class", "ant-checkbox-checked");

          question
            .getCheckAnswerCheckbox()
            .click()
            .should("have.class", "ant-checkbox-checked")
            .click()
            .should("not.have.class", "ant-checkbox-checked");
 */
      question.selectScoringType(SCORING_TYPE.PARTIAL);

      question.getPanalty().verifyNumInput(1);
      // question.getCheckAnsAttempt().verifyNumInput(1);
      // question.getMinScore().verifyNumInput(1);

      question
        .getUnscore()
        .click()
        .then($el2 => {
          cy.wrap($el2).should("have.class", "ant-checkbox-checked");

          // question.getMinScore().should("have.attr", "disabled");
        });

      question
        .getUnscore()
        .click()
        .should("not.have.class", "ant-checkbox-checked");
      // });

      /*  question
        .getEnableAutoScoring()
        .click()
        .should("not.have.class", "ant-checkbox-checked"); */
    });

    it(" > [Tc_278]:test => Display", () => {
      question.getNumofCol().verifyNumInput(1);

      // font select
      question.selectFontSize(FONT_SIZE.SMALL);

      // orientation select
      question.selectOrientation(ORIENTATION.HORIZONTAL);

      // style select
      question.selectChoicesStyle(STYLE_TYPE.BLOCK);

      // label type
      const labels = [
        {
          label: STEM.NUMERICAL,
          key: "1"
        },
        {
          label: STEM.UPPERCASE,
          key: "A"
        },
        {
          label: STEM.LOWERCASE,
          key: "a"
        }
      ];

      labels.forEach(option => {
        question.selectLabelType(option.label);
        question
          .getAllAnsChoicesLabel()
          .eq(0)
          .find("input")
          .next()
          .should("have.text", option.key);
      });

      question.selectChoicesStyle("Standard");
    });

    it(" > [Tc_279]:test => Save question", () => {
      editItem.header.save(true);
      cy.url().should("contain", "item-detail");
    });

    it(" > [Tc_280]:test => Preview Item", () => {
      const preview = editItem.header.preview();

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.verifyScore("");
        });

      preview.getClear().click();

      preview.getShowAnswer().click();

      preview.getClear().click();

      preview.header.edit();
    });

    /* it(" > [Tc_281]:test => Delete question from item", () => {
      editItem
        .getDelButton()
        .should("have.length", 1)
        .click()
        .should("have.length", 0);
    }); */
  });

  context(" > [sanity]:test => Create question using different options and validate", () => {
    before("visit items list page and select question type", () => {
      editItem.createNewItem();
      // add new question
      editItem.chooseQuestion(queData.group, queData.queType);

      question
        .getQuestionEditor()
        .clear()
        .type(queData.queText);

      question.getAllChoices().each(($el, index, $list) => {
        const cusIndex = $list.length - (index + 1);
        question.deleteChoiceByIndex(cusIndex);
      });

      // add choices
      const { choices } = queData;
      choices.forEach((ch, index) => {
        question
          .addNewChoice()
          .getChoiceByIndex(index)
          .clear()
          .type(ch)
          .should("contain", ch);
      });

      // set correct multiple ans

      question
        .getAllAnsChoicesLabel()
        .contains(queData.correct[0])
        .click()
        .closest("label")
        .find("input")
        .should("be.checked");

      question
        .getAllAnsChoicesLabel()
        .contains(queData.alterate[0])
        .click()
        .closest("label")
        .find("input")
        .should("be.checked");

      /* question
        .getAllAnsChoicesLabel()
        .eq(1)
        .click()
        .closest("label")
        .find("input")
        .should("not.be.checked"); */

      // save
      question.header.save();
    });

    it(" > [mcq_multi_test1]:test => Create question with 2 correct ans and validate with exact & partial match", () => {
      question.header.edit();
      // .getEditButton()
      // .click();

      // advanced
      // question.clickOnAdvancedOptions();

      // question.getEnableAutoScoring().click();

      // >> exact match
      question.selectScoringType(SCORING_TYPE.EXACT);

      // save
      // question.header.save();

      // preview and show ans
      const preview = question.header.preview();

      preview
        .getShowAnswer()
        .click()
        .then(() => {
          // cy.get("label.wrong").should("have.length", queData.choices.length - 2);

          cy.get("label.right")
            .should("have.length", 2)
            .and("contain", queData.correct[0])
            .and("contain", queData.alterate[0]);
        });

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get("label.right,label.wrong").should("have.length", 0);
        });

      // give correct ans and validate
      cy.contains(queData.correct[0]).click();

      cy.contains(queData.alterate[0]).click();

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.verifyScore("1/1");

          cy.get("label.wrong").should("have.length", 0);

          cy.get("label.right")
            .should("have.length", 2)
            .and("contain", queData.correct[0])
            .and("contain", queData.alterate[0]);
        });

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get("label.right,label.wrong").should("have.length", 0);
        });

      // give partial wrong ans and check
      cy.contains(queData.choices[0]).click();
      cy.contains(queData.correct[0]).click();

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.verifyScore("0/1");

          cy.get("label.wrong")
            .should("have.length", 1)
            .and("contain", queData.choices[0]);

          cy.get("label.right")
            .should("have.length", 1)
            .and("contain", queData.correct[0]);
        });

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get("label.right,label.wrong").should("have.length", 0);
        });

      // give no ans and check
      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.verifyScore("0/1");

          cy.get("label.right,label.wrong").should("have.length", 0);
        });

      // partial match
      preview.header.edit();
      // .getEditButton()
      // .click();

      // question.clickOnAdvancedOptions();

      question.selectScoringType(SCORING_TYPE.PARTIAL);

      // save
      // question.header.save();

      // show ans
      question.header.preview();

      preview
        .getShowAnswer()
        .click()
        .then(() => {
          cy.get("label.wrong").should("have.length", 0);

          cy.get("label.right")
            .should("have.length", 2)
            .and("contain", queData.correct[0])
            .and("contain", queData.alterate[0]);
        });

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get("label.right,label.wrong").should("have.length", 0);
        });

      // give correct ans and validate
      cy.contains(queData.correct[0]).click();

      cy.contains(queData.alterate[0]).click();

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.verifyScore("1/1");

          cy.get("label.wrong").should("have.length", 0);

          cy.get("label.right")
            .should("have.length", 2)
            .and("contain", queData.correct[0])
            .and("contain", queData.alterate[0]);
        });

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get("label.right,label.wrong").should("have.length", 0);
        });

      // give partial wrong ans and check
      cy.contains(queData.choices[0]).click();
      cy.contains(queData.correct[0]).click();

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.verifyScore("0.5/1");

          cy.get("label.wrong")
            .should("have.length", 1)
            .and("contain", queData.choices[0]);

          cy.get("label.right")
            .should("have.length", 1)
            .and("contain", queData.correct[0]);
        });

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get("label.right,label.wrong").should("have.length", 0);
        });

      // give no ans and check
      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.verifyScore("0/1");

          cy.get("label.right,label.wrong").should("have.length", 0);
        });
    });
  });
});
