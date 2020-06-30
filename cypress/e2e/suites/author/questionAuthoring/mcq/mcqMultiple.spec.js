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
import validateSolutionBlockTests from "../../../../framework/author/itemList/questionType/common/validateSolutionBlockTests.js";
import { questionType } from "../../../../framework/constants/questionTypes.js";

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)} >> Author "Multiple choice - multiple response" type question`, () => {
  const queData = {
    group: "Multiple Choice",
    queType: questionType.MCQ_MULTI,
    queText: "Indian state known as garden spice is:",
    choices: ["choice a", "choice b", "choice c", "choice d", "choice e"],
    correct: ["choice a", "choice b"],
    alterate: ["choice c", "choice d"],
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
          .find(".labelOnly")
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

      preview.checkScore("0/1");

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
          .find(".labelOnly")
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

      preview.checkScore("0/1");

      preview.getClear().click();

      preview.getShowAnswer().click({ force: true });

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

      question.selectChoice(queData.correct[0]);

      question.selectChoice(queData.alterate[0]);
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
      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.alterate[0]);

      preview.checkScore("1/1");

      cy.get("label.wrong").should("have.length", 0);

      cy.get("label.right")
        .should("have.length", 2)
        .and("contain", queData.correct[0])
        .and("contain", queData.alterate[0]);

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get("label.right,label.wrong").should("have.length", 0);
        });

      // give partial wrong ans and check
      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.correct[1]);

      preview.checkScore("0/1");

      cy.get("label.wrong")
        .should("have.length", 1)
        .and("contain", queData.choices[1]);

      cy.get("label.right")
        .should("have.length", 1)
        .and("contain", queData.correct[0]);

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get("label.right,label.wrong").should("have.length", 0);
        });

      // give no ans and check
      preview.checkScore("0/1");

      cy.get("label.right,label.wrong").should("have.length", 0);

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
      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.alterate[0]);

      preview.checkScore("1/1");
      cy.get("label.wrong").should("have.length", 0);

      cy.get("label.right")
        .should("have.length", 2)
        .and("contain", queData.correct[0])
        .and("contain", queData.alterate[0]);

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get("label.right,label.wrong").should("have.length", 0);
        });

      // give partial wrong ans and check
      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.correct[1]);

      preview.checkScore("0.5/1");

      cy.get("label.right")
        .should("have.length", 1)
        .and("contain", queData.correct[0]);

      cy.get("label.wrong")
        .should("have.length", 1)
        .and("contain", queData.correct[1]);

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get("label.right,label.wrong").should("have.length", 0);
        });

      // give no ans and check
      preview.checkScore("0/1");

      cy.get("label.right,label.wrong").should("have.length", 0);
    });
  });

  context("score block testing", () => {
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

      question.selectChoice(queData.correct[1]);

      // save
      question.header.save();
    });

    it("default test with exact score", () => {
      const preview = editItem.header.preview();

      preview
        .getShowAnswer()
        .click()
        .then(() => {
          cy.get("label.right")
            .should("have.length", 1)
            .and("contain", queData.correct[1]);
        });
      preview
        .getClear()
        .click()
        .then(() => {
          cy.get("label.right,label.wrong").should("have.length", 0);
        });

      // give correct ans and validate
      question.selectAnswerChoice(queData.correct[1]);
      preview.checkScore("1/1");
      cy.get("label.wrong").should("have.length", 0);
      cy.get("label.right")
        .should("have.length", 1)
        .and("contain", queData.correct[1]);
      preview
        .getClear()
        .click()
        .then(() => {
          cy.get("label.right,label.wrong").should("have.length", 0);
        });

      // give wrong ans and check
      question.selectAnswerChoice(queData.choices[0]);
      preview.checkScore("0/1");
      cy.get("label.wrong")
        .should("have.length", 1)
        .and("contain", queData.choices[0]);
      cy.get("label.right").should("have.length", 0);
      preview
        .getClear()
        .click()
        .then(() => {
          cy.get("label.right,label.wrong").should("have.length", 0);
        });

      // give no ans and check
      preview.checkScore("0/1");
    });

    it("Select multiple correct answer with exact score", () => {
      question.header.edit();
      //set score as 3
      question.getPoints().type("{selectall}3");

      //select multiple correct answer

      question.selectChoice(queData.correct[0]);

      question.selectChoice(queData.alterate[0]);

      //set score as 3
      question.getPoints().type("{selectall}3");

      //check answer in preview
      const preview = editItem.header.preview();
      //select multiple correct answer
      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.alterate[0]);

      preview
        .getShowAnswer()
        .click()
        .then(() => {
          cy.get("label.right")
            .should("have.length", 3)
            .and("contain", queData.correct[0])
            .and("contain", queData.correct[1])
            .and("contain", queData.alterate[0]);
        });

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get("label.right,label.wrong").should("have.length", 0);
        });

      // give correct ans and validate
      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.correct[1]);
      question.selectAnswerChoice(queData.alterate[0]);

      preview.checkScore("3/3");

      cy.get("label.wrong").should("have.length", 0);

      cy.get("label.right")
        .should("have.length", 3)
        .and("contain", queData.correct[0])
        .and("contain", queData.correct[1])
        .and("contain", queData.alterate[0]);

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get("label.right,label.wrong").should("have.length", 0);
        });

      //give wrong answer and validate

      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.correct[1]);
      question.selectAnswerChoice(queData.choices[3]);

      preview.checkScore("0/3");

      cy.get("label.wrong").should("have.length", 1);

      cy.get("label.right")
        .should("have.length", 2)
        .and("contain", queData.correct[0])
        .and("contain", queData.correct[1]);
    });

    it("Select partial correct answer", () => {
      //change the scoring tye to partial
      question.header.edit();

      question.selectScoringType(SCORING_TYPE.PARTIAL);

      //verify with partial correct answer
      const preview = editItem.header.preview();

      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.choices[3]);
      preview.checkScore("1/3");
      cy.get("label.wrong")
        .should("have.length", 1)
        .and("contain", queData.choices[3]);
      cy.get("label.right")
        .should("have.length", 1)
        .and("contain", queData.correct[0]);

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get("label.right,label.wrong").should("have.length", 0);
        });
      //give all correct answer and validate

      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.correct[1]);
      question.selectAnswerChoice(queData.alterate[0]);
      question.selectAnswerChoice(queData.choices[4]);

      preview.checkScore("3/3");
      cy.get("label.wrong")
        .should("have.length", 1)
        .and("contain", queData.choices[4]);
      cy.get("label.right")
        .should("have.length", 3)
        .and("contain", queData.correct[0])
        .and("contain", queData.correct[1])
        .and("contain", queData.alterate[0]);
    });

    it("Verify alternate answer", () => {
      question.header.edit();

      question.checkChoiceSelected(queData.correct[0]);

      question.checkChoiceSelected(queData.correct[1]);

      question.deselectChoice(queData.alterate[0]);

      //add a alternate answer - score by default 1
      question.addAlternate();

      question.selectChoice(queData.alterate[0]);

      question.selectChoice(queData.alterate[1]);
      //set scoring type exact
      question.selectScoringType(SCORING_TYPE.EXACT);
      const preview = question.header.preview();
      preview
        .getShowAnswer()
        .click()
        .then(() => {
          cy.get("label.right")
            .should("have.length", 4)
            .and("contain", queData.correct[0])
            .and("contain", queData.correct[1])
            .and("contain", queData.alterate[0])
            .and("contain", queData.alterate[1]);
        });

      question.selectAnswerChoice(queData.alterate[0]);
      question.selectAnswerChoice(queData.alterate[1]);
      preview.checkScore("1/3");

      cy.get("label.right")
        .should("have.length", 2)
        .and("contain", queData.alterate[0])
        .and("contain", queData.alterate[1]);

      //set alternate answer point as 2
      question.header.edit();
      question.getPoints().type("{selectall}1");
      question.selectAlternatetab();
      question.getPoints().type("{selectall}2");

      //set scoring type to partial
      question.selectScoringType(SCORING_TYPE.PARTIAL);

      //check partial score for alternate answer
      question.header.preview();
      question.selectAnswerChoice(queData.alterate[0]);
      question.selectAnswerChoice(queData.choices[4]);
      preview.checkScore("1/2");
      cy.get("label.right")
        .should("have.length", 1)
        .and("contain", queData.alterate[0]);
      cy.get("label.wrong")
        .should("have.length", 1)
        .and("contain", queData.choices[4]);
    });

    it("verify for penalty", () => {
      const preview = question.header.preview();

      question.header.edit();

      question.checkChoiceSelected(queData.correct[0]);

      question.checkChoiceSelected(queData.correct[1]);
      //change the score to 2
      question.getPoints().type("{selectall}2");
      question.selectScoringType(SCORING_TYPE.PARTIAL);
      question.getPanalty().type("{selectall}1");
      question.header.preview();
      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.alterate[0]);
      preview.checkScore("0.5/2");
    });

    it("Verify score with rounding and penalty", () => {
      const preview = question.header.preview();

      question.header.edit();
      question.checkChoiceSelected(queData.correct[0]);

      question.checkChoiceSelected(queData.correct[1]);
      question.getPoints().type("{selectall}3.6");

      //for no rounding
      question.selectRoundingType("Round down");
      question.header.preview();
      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.alterate[0]);
      preview.checkScore("1/3.6");
    });

    it("Verify score without rounding and penality", () => {
      const preview = question.header.preview();

      question.header.edit();
      question.checkChoiceSelected(queData.correct[0]);
      question.checkChoiceSelected(queData.correct[1]);
      question.getPoints().type("{selectall}3.6");

      //with score rounding
      question.selectRoundingType("None");
      question.header.preview();
      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.alterate[0]);
      preview.checkScore("1.3/3.6");
    });

    it("Verify score with rounding and penalty", () => {
      const preview = question.header.preview();

      question.header.edit();

      question.checkChoiceSelected(queData.correct[0]);

      question.checkChoiceSelected(queData.correct[1]);

      question.getPoints().type("{selectall}3.6");

      //for no rounding
      question.selectRoundingType("Round down");
      question.header.preview();
      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.alterate[0]);
      preview.checkScore("1/3.6");
    });

    it("Verify score without rounding and penality", () => {
      const preview = question.header.preview();

      question.header.edit();

      question.checkChoiceSelected(queData.correct[0]);

      question.checkChoiceSelected(queData.correct[1]);
      question.getPoints().type("{selectall}3.6");

      //with score rounding
      question.selectRoundingType("None");
      question.header.preview();
      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.alterate[0]);
      preview.checkScore("1.3/3.6");
    });

    validateSolutionBlockTests(queData.group, queData.queType);
  });
});
