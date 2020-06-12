// / <reference types="Cypress" />
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import MCQBlockLayoutPage from "../../../../framework/author/itemList/questionType/mcq/mcqBlockLayoutPage";
import FileHelper from "../../../../framework/util/fileHelper";
import {
  SCORING_TYPE,
  STEM,
  STYLE_TYPE,
  FONT_SIZE,
  ORIENTATION
} from "../../../../framework/constants/questionAuthoring";
import validateSolutionBlockTests from "../../../../framework/author/itemList/questionType/common/validateSolutionBlockTests";

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)} >> Author "Multiple choice - block layout" type question`, () => {
  const queData = {
    group: "Multiple Choice",
    queType: "Multiple Choice - Block Layout",
    queText: "Indian state known as garden spice is:",
    choices: ["choice a", "choice b", "choice c", "choice d", "choice e"],
    correct: ["choice a", "choice b"],
    alterate: ["choice c", "choice d"],
    extlink: "www.testdomain.com",
    formattext: "formattedtext",
    formula: "s=ar^2"
  };
  const question = new MCQBlockLayoutPage();
  const editItem = new EditItemPage();
  const text = "testtext";

  before(() => {
    cy.login();
  });

  context(" > User creates question.", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();
      // select que type
      editItem.chooseQuestion(queData.group, queData.queType);
    });

    it(" > [Tc_301]:test => Enter question text", () => {
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

    it(" > [Tc_302]:test => Multiple choices options", () => {
      // edit 1st choice
      question
        .getChoiceByIndex(0)
        .clear()
        .type(text)
        .should("contain", text);

      // delete first
      question.deleteChoiceByIndex(0);
      question.getChoiceByIndex(0).should("not.contain", text);

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

    it(" > [Tc_303]:test => Set Correct Answer(s)", () => {
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

    it(" > [Tc_304]:test => Advanced Options", () => {
      question.clickOnAdvancedOptions();

      // scoring
      // question.getMaxScore().verifyNumInput(1);

      /*  question
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

    it(" > [Tc_305]:test => Display", () => {
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
    });

    it(" > [Tc_306]:test => Save question", () => {
      editItem.header.save();
      cy.url().should("contain", "item-detail");
    });

    it(" > [Tc_307]:test => Preview Item", () => {
      const preview = editItem.header.preview();

      preview.checkScore("0/1");

      preview.getClear().click();

      preview.getShowAnswer().click();

      preview.getClear().click();

      preview.header.edit();
    });
  });

  context(" > User edit the question.", () => {
    before("delete old question and create dummy que to edit", () => {
      question.createQuestion();
      question.header.save();
      // edit
      question.header.edit();
    });

    it(" > [Tc_308]:test => Enter question text", () => {
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

    it(" > [Tc_309]:test => Multiple choices options", () => {
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

    it(" > [Tc_310]:test => Set Correct Answer(s)", () => {
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

      question.getAllAnsChoicesLabel().each($el => {
        cy.wrap($el).click();

        cy.wrap($el)
          .find("input")
          .should("be.checked");
      });

      question
        .getAllAnsChoicesLabel()
        .find("input:checked")
        .should("have.length", queData.choices.length);
    });

    it(" > [Tc_311]:test => Advanced Options", () => {
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

    it(" > [Tc_312]:test => Display", () => {
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

    it(" > [Tc_313]:test => Save question", () => {
      editItem.header.save(true);
      cy.url().should("contain", "item-detail");
    });

    it(" > [Tc_314]:test => Preview Item", () => {
      const preview = editItem.header.preview();

      preview.checkScore("0/1");

      preview.getClear().click();

      preview.getShowAnswer().click({ force: true });

      preview.getClear().click();

      preview.header.edit();
    });
  });

  context(" > [sanity]:test => Create question using different options and validate", () => {
    before("visit items list page and select question type", () => {
      editItem.createNewItem();
      // select que type
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

      // save
      question.header.save();
    });

    it(" > [mcq_block_test1]:test => Create question with 2 correct ans and validate with exact & partial match", () => {
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
          question.checkHighlight({ wrong: true });
          question.checkHighlightData({
            color: "right",
            length: 2,
            choices: [queData.correct[0], queData.alterate[0]]
          });
        });

      preview
        .getClear()
        .click()
        .then(() => {
          question.checkHighlight({ both: true });
        });

      // give correct ans and validate
      question.selectAnswerChoice(queData.correct[0]);

      question.selectAnswerChoice(queData.alterate[0]);

      preview.checkScore("1/1");

      question.checkHighlight({ wrong: true });

      question.checkHighlightData({ color: "right", length: 2, choices: [queData.correct[0], queData.alterate[0]] });

      preview
        .getClear()
        .click()
        .then(() => {
          question.checkHighlight({ both: true });
        });

      // give partial wrong ans and check

      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.correct[1]);

      preview.checkScore("0/1");

      question.checkHighlightData({ color: "wrong", length: 1, choices: [queData.correct[1]] });

      question.checkHighlightData({ color: "right", length: 1, choices: [queData.correct[0]] });

      preview
        .getClear()
        .click()
        .then(() => {
          question.checkHighlight({ both: true });
        });

      // give no ans and check
      preview.checkScore("0/1");

      question.checkHighlight({ both: true });
      // partial match
      preview.header.edit();

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
          question.checkHighlight({ wrong: true });

          question.checkHighlightData({
            color: "right",
            length: 2,
            choices: [queData.correct[0], queData.alterate[0]]
          });
        });

      preview
        .getClear()
        .click()
        .then(() => {
          question.checkHighlight({ both: true });
        });

      // give correct ans and validate
      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.alterate[0]);

      preview.checkScore("1/1");
      question.checkHighlight({ wrong: true });
      question.checkHighlightData({ color: "right", length: 2, choices: [queData.correct[0], queData.alterate[0]] });

      preview
        .getClear()
        .click()
        .then(() => {
          question.checkHighlight({ both: true });
        });

      // give partial wrong ans and check

      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.correct[1]);

      preview.checkScore("0.5/1");

      question.checkHighlightData({ color: "wrong", length: 1, choices: [queData.correct[1]] });

      question.checkHighlightData({ color: "right", length: 1, choices: [queData.correct[0]] });

      preview
        .getClear()
        .click()
        .then(() => {
          question.checkHighlight({ both: true });
        });

      // give no ans and check
      preview.checkScore("0/1");

      question.checkHighlight({ both: true });
    });
  });
  context("Score block testing", () => {
    before("visit items list page and select question type", () => {
      editItem.createNewItem();
      // select que type
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

      question.selectChoice(queData.choices[0]);

      // save
      question.header.save();
    });

    it("default test with exact score", () => {
      const preview = editItem.header.preview();

      preview
        .getShowAnswer()
        .click()
        .then(() => {
          question.checkHighlightData({ color: "right", length: 1, choices: [queData.correct[0]] });
        });
      preview
        .getClear()
        .click()
        .then(() => {
          question.checkHighlight({ both: true });
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
          question.checkHighlight({ both: true });
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
          question.checkHighlight({ both: true });
        });

      // give no ans and check
      preview.checkScore("0/1");
    });

    it("Select multiple correct answer with exact score", () => {
      question.header.edit();

      // select multiple correct answer

      question.checkChoiceSelected(queData.correct[0]);

      question.selectChoice(queData.correct[1]);

      // set score as 2
      question.getPoints().type("{selectall}2");

      // check answer in preview
      const preview = editItem.header.preview();

      preview
        .getShowAnswer()
        .click()
        .then(() => {
          question.checkHighlightData({ color: "right", length: 2, choices: [queData.correct[0], queData.correct[1]] });
        });

      preview
        .getClear()
        .click()
        .then(() => {
          question.checkHighlight({ both: true });
        });

      // give correct ans and validate
      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.correct[1]);

      preview.checkScore("2/2");

      question.checkHighlightData({ color: "right", length: 2, choices: [queData.correct[0], queData.correct[1]] });
      preview
        .getClear()
        .click()
        .then(() => {
          question.checkHighlight({ both: true });
        });

      // give wrong answer and validate

      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.choices[3]);

      preview.checkScore("0/2");

      question.checkHighlightData({ color: "wrong", length: 1, choices: [queData.choices[3]] });
      question.checkHighlightData({ color: "right", length: 1, choices: [queData.correct[0]] });
    });

    it("Select partial correct answer", () => {
      // change the scoring tye to partial
      question.header.edit();

      question.selectScoringType(SCORING_TYPE.PARTIAL);

      // verify with partial correct answer

      question.checkChoiceSelected(queData.correct[0]);
      question.checkChoiceSelected(queData.correct[1]);

      const preview = editItem.header.preview();
      question.selectAnswerChoice(queData.choices[3]);
      question.selectAnswerChoice(queData.correct[0]);

      preview.checkScore("1/2");

      question.checkHighlightData({ color: "wrong", length: 1, choices: [queData.choices[3]] });
      question.checkHighlightData({ color: "right", length: 1, choices: [queData.correct[0]] });
      preview
        .getClear()
        .click()
        .then(() => {
          question.checkHighlight({ both: true });
        });
      // give all correct answer and validate

      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.correct[1]);
      question.selectAnswerChoice(queData.alterate[0]);

      preview.checkScore("2/2");

      question.checkHighlightData({ color: "wrong", length: 1, choices: [queData.alterate[0]] });

      question.checkHighlightData({ color: "right", length: 2, choices: [queData.correct[0], queData.correct[1]] });
    });

    it("Verify alternate answer", () => {
      question.header.edit();

      question.checkChoiceSelected(queData.correct[0]);

      question.checkChoiceSelected(queData.correct[1]);

      question.checkChoiceNotSelected(queData.alterate[0]);

      // add a alternate answer - score by default 1
      question.addAlternate();

      question.selectChoice(queData.alterate[0]);

      question.selectChoice(queData.alterate[1]);
      // set scoring type exact
      question.selectScoringType(SCORING_TYPE.EXACT);
      const preview = question.header.preview();
      preview
        .getShowAnswer()
        .click()
        .then(() => {
          question.checkHighlightData({
            color: "right",
            length: 4,
            choices: [queData.correct[0], queData.correct[1], queData.alterate[0], queData.alterate[1]]
          });
        });

      question.selectAnswerChoice(queData.alterate[0]);
      question.selectAnswerChoice(queData.alterate[1]);
      preview.checkScore("1/2");

      question.checkHighlightData({ color: "right", length: 2, choices: [queData.alterate[0], queData.alterate[1]] });

      // set alternate answer point as 2
      question.header.edit();
      question.getPoints().type("{selectall}1");
      question.selectAlternatetab();
      question.getPoints().type("{selectall}2");

      // set scoring type to partial
      question.selectScoringType(SCORING_TYPE.PARTIAL);

      // check partial score for alternate answer
      question.header.preview();
      question.selectAnswerChoice(queData.alterate[0]);
      question.selectAnswerChoice(queData.choices[4]);
      preview.checkScore("1/2");

      question.checkHighlightData({ color: "right", length: 1, choices: [queData.alterate[0]] });
      question.checkHighlightData({ color: "wrong", length: 1, choices: [queData.choices[4]] });
    });

    it("verify for penalty", () => {
      const preview = question.header.preview();

      question.header.edit();

      question.checkChoiceSelected(queData.correct[0]);

      question.checkChoiceSelected(queData.correct[1]);
      // change the score to 2
      question.getPoints().type("{selectall}2");
      question.selectScoringType(SCORING_TYPE.PARTIAL);
      question.getPanalty().type("{selectall}1");

      // case 1
      question.header.preview();
      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.alterate[0]);
      preview.checkScore("0.5/2");

      preview
        .getClear()
        .click()
        .then(() => {
          question.checkHighlight({ both: true });
        });
      // case 2
      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.correct[1]);
      question.selectAnswerChoice(queData.alterate[0]);
      preview.checkScore("1.5/2");

      preview
        .getClear()
        .click()
        .then(() => {
          question.checkHighlight({ both: true });
        });
      // case 3
      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.alterate[0]);
      question.selectAnswerChoice(queData.alterate[1]);
      preview.checkScore("1.5/2");

      preview
        .getClear()
        .click()
        .then(() => {
          question.checkHighlight({ both: true });
        });

      // case 4
      question.header.edit();

      // change score
      question.getPoints().type("{selectall}2.6");

      question.header.preview();

      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.correct[1]);
      question.selectAnswerChoice(queData.alterate[0]);
      question.selectAnswerChoice(queData.alterate[1]);
      preview.checkScore("1.6/2.6");
    });
  });
  context("Validate solution block", () => {
    validateSolutionBlockTests(queData.group, queData.queType);
  });
});
