/// <reference types="Cypress" />
import ItemListPage from "../../../../framework/author/itemList/itemListPage.js";
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage.js";
import MCQTrueFalsePage from "../../../../framework/author/itemList/questionType/mcq/mcqTrueFalsePage.js";
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

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "True or false" type question`, () => {
  const queData = {
    group: "Multiple Choice",
    queType: questionType.MCQ_TF,
    queText: "Which is following option is true :",
    choices: ["TrueOption", "FalseOption"],
    correct: ["TrueOption"],
    alterate: ["trueOption"],
    extlink: "www.testdomain.com",
    formattext: "formattedtext",
    formula: "s=ar^2"
  };
  const question = new MCQTrueFalsePage();
  const editItem = new EditItemPage();
  const itemList = new ItemListPage();
  const text = "testtext";
  const formates = question.formates;

  before(() => {
    cy.login();
  });

  context(" > User creates question.", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();
      // add new question
      editItem.chooseQuestion(queData.group, queData.queType);
    });

    it(" > [Tc_284]:test => Enter question text", () => {
      // edit text
      question
        .getQuestionEditor()
        .clear()
        .type(queData.queText)
        .should("contain", queData.queText);

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

    it(" > [Tc_285]:test => Multiple choices options", () => {
      // check default choice options
      question
        .getAllChoices()
        .should("have.length", 2)
        .and("contain", "True")
        .and("contain", "False");

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

    it(" > [Tc_286]:test => Set Correct Answer(s)", () => {
      // update points
      question.getPoints().verifyNumInput(0.5);

      // select correct ans
      question.getAllAnsChoicesLabel().each($el => {
        cy.wrap($el).click();

        cy.wrap($el)
          .find("input")
          .should("be.checked");
      });

      // alternate
      question.addAlternate();

      question.getAllAnsChoicesLabel().each($el => {
        cy.wrap($el).click();

        cy.wrap($el)
          .find("input")
          .should("be.checked");
      });
    });

    it(" > [Tc_287]:test => Advanced Options", () => {
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

    it(" > [Tc_288]:test => Display", () => {
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

    it(" > [Tc_289]:test => Save question", () => {
      editItem.header.save();
      // cy.contains(queData.formattext).should("be.visible");
      cy.url().should("contain", "item-detail");
    });

    it(" > [Tc_290]:test => Preview Item", () => {
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
      queType: "True or false",
      queText: "editedWhich is following option is true :",
      choices: ["editedTrue", "editedFalse"],
      correct: ["editedTrue"],
      alterate: ["editedtrue"],
      extlink: "editedwww.testdomain.com",
      formattext: "editedformattedtext",
      formula: "editeds=ar^2"
    };

    before("delete old question and create dummy que to edit", () => {
      question.createQuestion();
      question.header.save();
      // edit
      question.header.edit();
    });

    it(" > [Tc_291]:test => Enter question text", () => {
      // edit text
      question
        .getQuestionEditor()
        .clear()
        .type(queData.queText)
        .should("contain", queData.queText);

      /* // add formatting
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

    it(" > [Tc_292]:test => Multiple choices options", () => {
      // check default choice options
      question
        .getAllChoices()
        .should("have.length", 2)
        .and("contain", "right")
        .and("contain", "wrong");

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

    it(" > [Tc_293]:test => Set Correct Answer(s)", () => {
      // update points
      question.getPoints().verifyNumInput(0.5);

      // select correct ans
      question.getAllAnsChoicesLabel().each($el => {
        cy.wrap($el).click();

        cy.wrap($el)
          .find("input")
          .should("be.checked");
      });

      // alternate
      question.addAlternate();

      question.getAllAnsChoicesLabel().each($el => {
        cy.wrap($el).click();
        cy.wrap($el)
          .find("input")
          .should("be.checked");
      });
    });

    it(" > [Tc_294]:test => Advanced Options", () => {
      // question.clickOnAdvancedOptions();

      // scoring
      // question.getMaxScore().verifyNumInput(1);

      /*
      question
        // .getEnableAutoScoring()
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

    it(" > [Tc_295]:test => Display", () => {
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

    it(" > [Tc_296]:test => Save question", () => {
      editItem.header.save(true);
      cy.url().should("contain", "item-detail");
    });

    it(" > [Tc_297]:test => Preview Item", () => {
      const preview = editItem.header.preview();

      preview
        .getCheckAnswer()
        .click()
        .then(() => {
          preview.verifyScore("");
        });

      preview.getClear().click();

      preview.getShowAnswer().click({ force: true });

      preview.getClear().click();

      preview.header.edit();
    });

    /*  it(" > [Tc_298]:test => Delete question from item", () => {
      editItem
        .getDelButton()
        .should("have.length", 1)
        .click()
        .should("have.length", 0);
    }); */
  });

  context(" > [sanity]:test => Create question using different options and validate solution block", () => {
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
      const choices = queData.choices;
      choices.forEach((ch, index) => {
        question
          .addNewChoice()
          .getChoiceByIndex(index)
          .clear()
          .type(ch)
          .should("contain", ch);
      });

      question.selectChoice(queData.correct[0]);

      // save
      question.header.save();
    });

    it(" > [mcq_tf_test1]:test => Validate basic question with default setting", () => {
      // preview
      const preview = editItem.header.preview();

      // show ans
      preview
        .getShowAnswer()
        .click()
        .then(() => {
          question.checkHighlight({ wrong: true });

          question.checkHighlightData({ color: "right", length: 1, choices: [queData.correct[0]] });
        });

      preview
        .getClear()
        .click()
        .then(() => {
          question.checkHighlight({ color: "both" });
        });

      // give correct ans and validate

      question.selectAnswerChoice(queData.correct[0]);

      preview.checkScore("1/1");

      question.checkHighlight({ wrong: true });

      question.checkHighlightData({ color: "right", length: 1, choices: [queData.correct[0]] });

      preview
        .getClear()
        .click()
        .then(() => {
          question.checkHighlight({ color: "both" });
        });

      // give wrong ans and check
      question.selectAnswerChoice(queData.choices[1]);

      preview.checkScore("0/1");

      question.checkHighlightData({ color: "wrong", length: 1, choices: [queData.choices[1]] });

      question.checkHighlight({ right: true });

      preview
        .getClear()
        .click()
        .then(() => {
          question.checkHighlight({ color: "both" });
        });

      // give no ans and check
      preview.checkScore("0/1");

      question.checkHighlight({ color: "both" });
    });
  });
  context("Score block testing", () => {
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
      const choices = queData.choices;
      choices.forEach((ch, index) => {
        question
          .addNewChoice()
          .getChoiceByIndex(index)
          .clear()
          .type(ch)
          .should("contain", ch);
      });
      question.selectChoice(queData.correct[0]);

      // save
      question.header.save();
    });
    it("change points and check answer", () => {
      //set score to 2
      question.header.edit();

      question.getPoints().type("{selectall}2");

      // give correct answer and check
      const preview = editItem.header.preview();

      question.selectAnswerChoice(queData.correct[0]);

      preview.checkScore("2/2");

      question.checkHighlight({ wrong: true });

      question.checkHighlightData({ color: "right", length: 1, choices: [queData.correct[0]] });

      preview
        .getClear()
        .click()
        .then(() => {
          question.checkHighlight({ color: "both" });
        });

      // give wrong ans and check
      question.selectAnswerChoice(queData.choices[1]);

      preview.checkScore("0/2");

      question.checkHighlightData({ color: "wrong", length: 1, choices: [queData.choices[1]] });

      question.checkHighlight({ right: true });
    });

    it("change correct answer and check score", () => {
      question.header.edit();
      question.selectChoice(queData.choices[1]);
      question.checkChoiceNotSelected(queData.choices[0]);

      // give correct answer and check
      const preview = editItem.header.preview();

      question.selectAnswerChoice(queData.choices[1]);

      preview.checkScore("2/2");

      question.checkHighlight({ wrong: true });

      question.checkHighlightData({ color: "right", length: 1, choices: [queData.choices[1]] });

      preview
        .getClear()
        .click()
        .then(() => {
          question.checkHighlight({ color: "both" });
        });

      // give wrong ans and check
      question.selectAnswerChoice(queData.choices[0]);

      preview.checkScore("0/2");

      question.checkHighlightData({ color: "wrong", length: 1, choices: [queData.choices[0]] });

      question.checkHighlight({ right: true });
    });
  });
  context("Hint and solution block testing", () => {
    validateSolutionBlockTests(queData.group, queData.queType);
  });
});
