import ItemListPage from "../../../../framework/author/itemList/itemListPage.js";
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage.js";
import MCQStandardPage from "../../../../framework/author/itemList/questionType/mcq/mcqStandardPage.js";
import FileHelper from "../../../../framework/util/fileHelper";
import {
  SCORING_TYPE,
  STEM,
  STYLE_TYPE,
  FONT_SIZE,
  ORIENTATION
} from "../../../../framework/constants/questionAuthoring";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Multiple choice - standard" type question`, () => {
  const queData = {
    group: "Multiple Choice",
    queType: "Multiple choice - standard",
    queText: "Indian state known as garden spice is:",
    choices: ["Karnataka", "West Bengal", "Kerala", "Delhi", "KL"],
    correct: ["Kerala"],
    alterate: ["KL", "Delhi"],
    extlink: "www.testdomain.com",
    formattext: "formattedtext",
    formula: "s=ar^2"
  };
  const question = new MCQStandardPage();
  const editItem = new EditItemPage();
  const itemList = new ItemListPage();
  const text = "testtext";
  let testItemId;

  const { formates } = question;

  before(() => {
    cy.login();
  });

  context(" > User creates question.", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();
      // select que type
      editItem.chooseQuestion(queData.group, queData.queType);
    });

    it(" > [Tc_250]:test => Enter question text", () => {
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
          .find(`#${sel}`)
          .click();

        question
          .getQuestionEditor()
          .contains(tag, text)
          .should("have.length", 1);

        question.editToolBar
          .frToolbar()
          .find(`#${sel}`)
          .click();

        question
          .getQuestionEditor()
          .find(tag)
          .should("not.be.exist");
      }); */
    });

    it(" > [Tc_251]:test => Multiple choices options", () => {
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

    it(" > [Tc_252]:test => Set Correct Answer(s)", () => {
      // update points
      question.getPoints().verifyNumInput(0.5);

      // select correct ans
      question.getAllAnsChoicesLabel().each($el => {
        cy.wrap($el).click();

        cy.wrap($el)
          .find("input")
          .should("be.checked");
      });

      // multiple response
      question.getMultipleResponse().click();

      question.getAllAnsChoicesLabel().each($el => {
        cy.wrap($el).click();
      });

      question
        .getAllAnsChoicesLabel()
        .find("input:checked")
        .should("have.length.greaterThan", 1);

      question.getMultipleResponse().click();

      // alternate
      question.addAlternate();

      question.getAllAnsChoicesLabel().each($el => {
        cy.wrap($el).click();

        cy.wrap($el)
          .find("input")
          .should("be.checked");
      });
    });

    it(" > [Tc_253]:test => Advanced Options", () => {
      question.clickOnAdvancedOptions();

      /*
 question
   .getEnableAutoScoring()
   // .click({ force: true })
   .then($el => {
     cy.wrap($el).should("have.class", "ant-checkbox-checked");

      question
       .getCheckAnswerCheckbox()
       .click()
       .should("have.class", "ant-checkbox-checked")
       .click()
       .should("not.have.class", "ant-checkbox-checked");
*/
      question.selectScoringType(SCORING_TYPE.EXACT);
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

    it(" > [Tc_254]:test => Display", () => {
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

    it(" > [Tc_255]:test => Save question", () => {
      editItem.header.save();
      // cy.contains(queData.formattext).should("be.visible");
      cy.url().should("contain", "item-detail");
    });

    it(" > [Tc_256]:test => Preview Item", () => {
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
      queType: "Multiple choice - standard",
      queText: "Indian state known as garden spice is:",
      choices: ["Karnataka", "West Bengal", "Kerala", "Delhi", "KL"],
      correct: ["Kerala"],
      alterate: ["KL"],
      extlink: "www.testdomain.com",
      formattext: "editformattedtext",
      formula: "s=ar^2"
    };

    before("delete old question and create dummy que to edit", () => {
      question.createQuestion();
      question.header.save();
      // edit
      question.header.edit();
      // editItem.getEditButton().click();
    });

    it(" > [Tc_257]:test => Enter question text", () => {
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

    it(" > [Tc_258]:test => Multiple choices options", () => {
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

    it(" > [Tc_259]:test => Set Correct Answer(s)", () => {
      // update points
      question.getPoints().verifyNumInput(0.5);

      // select correct ans
      question.getAllAnsChoicesLabel().each($el => {
        cy.wrap($el).click();

        cy.wrap($el)
          .find("input")
          .should("be.checked");
      });

      // multiple response
      question.getMultipleResponse().click();

      question.getAllAnsChoicesLabel().each($el => {
        cy.wrap($el).click();
      });

      question
        .getAllAnsChoicesLabel()
        .find("input:checked")
        .should("have.length.greaterThan", 1);

      question.getMultipleResponse().click();

      // alternate
      question.addAlternate();

      question.getAllAnsChoicesLabel().each($el => {
        cy.wrap($el).click();

        cy.wrap($el)
          .find("input")
          .should("be.checked");
      });

      //
    });

    it(" > [Tc_260]:test => Advanced Options", () => {
      // question.clickOnAdvancedOptions();

      // scoring
      // question.getMaxScore().verifyNumInput(1);

      /* question
        .getEnableAutoScoring()
        .click({ force: true })
        .then($el => {
          cy.wrap($el).should("have.class", "ant-checkbox-checked");
 */
      /* question
            .getCheckAnswerCheckbox()
            .click()
            .should("have.class", "ant-checkbox-checked")
            .click()
            .should("not.have.class", "ant-checkbox-checked");
 */
      question.selectScoringType(SCORING_TYPE.EXACT);
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

    it(" > [Tc_261]:test => Display", () => {
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

    it(" > [Tc_262]:test => Save question", () => {
      editItem.header.save(true);
      cy.url().should("contain", "item-detail");
    });

    it(" > [Tc_263]:test => Preview Item", () => {
      const preview = editItem.header.preview();

      preview.checkScore("0/1");

      preview.getClear().click();

      preview.getShowAnswer().click();

      preview.getClear().click();

      preview.header.edit();
    });

    /* it(" > [Tc_264]:test => Delete question from item", () => {
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

      question
        .getAllAnsChoicesLabel()
        .contains(queData.correct[0])
        .click()
        .closest("label")
        .find("input")
        .should("be.checked");

      // save
      question.header.save();
    });

    it(" > [mcq_std_test]:test => Validate basic question with default setting", () => {
      // preview
      const preview = editItem.header.preview();

      // show ans
      preview
        .getShowAnswer()
        .click()
        .then(() => {
          // cy.get("label.wrong").should("have.length", queData.choices.length - 1);

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

      // give correct ans and validate
      question.selectAnswerChoice(queData.correct[0]);

      preview.checkScore("1/1");

      cy.get("label.wrong").should("have.length", 0);

      cy.get("label.right")
        .should("have.length", 1)
        .and("contain", queData.correct[0]);

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

    it(" > [mcq_std_test]:test => Enable multiple responses exact and validate", () => {
      question.header.edit();
      // .getEditButton()
      // .click();

      // select multiple correct ans
      question.getMultipleResponse().click();

      question
        .getAllAnsChoicesLabel()
        .contains(queData.alterate[0])
        .click()
        .closest("label")
        .find("input")
        .should("be.checked");

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

      // give exact wrong ans and check
      question.selectAnswerChoice(queData.choices[0]);
      question.selectAnswerChoice(queData.correct[0]);

      preview.checkScore("0/1");

      cy.get("label.wrong")
        .should("have.length", 1)
        .and("contain", queData.choices[0]);

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
    });

    it(" > [mcq_std_test]:test => Enable partial match with multiple responses and validate", () => {
      const preview = question.header.preview();

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
      question.selectAnswerChoice(queData.choices[0]);
      question.selectAnswerChoice(queData.correct[0]);

      preview.checkScore("0.5/1");

      cy.get("label.wrong")
        .should("have.length", 1)
        .and("contain", queData.choices[0]);

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
    });
  });

  context(" > Scoring Block testing", () => {
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

      question
        .getAllAnsChoicesLabel()
        .contains(queData.correct[0])
        .click()
        .closest("label")
        .find("input")
        .should("be.checked");

      // save
      question.header.save();
    });

    it(" > [mcq_std_scoring]:test => Test score with exact match", () => {
      question.header.edit();
      // .getEditButton()
      // .click();

      question
        .addAlternate()
        .getAllAnsChoicesLabel()
        .contains(queData.alterate[0])
        .click()
        .closest("label")
        .find("input")
        .should("be.checked");

      // advanced
      // question.clickOnAdvancedOptions();

      // enable Auto Scoring option
      // question.getEnableAutoScoring().click();

      // exact match
      question.selectScoringType(SCORING_TYPE.EXACT);

      // save
      // question.header.save();

      // preview and check ans
      const preview = question.header.preview();

      // give correct ans and validate
      question.selectAnswerChoice(queData.correct[0]);
      question.selectAnswerChoice(queData.alterate[0]);
      preview.checkScore("1/1");

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get("label.right,label.wrong").should("have.length", 0);
        });

      // give incorrect ans and validate
      question.selectAnswerChoice(queData.choices[1]);
      preview.checkScore("0/1");

      cy.get("label.wrong").should("have.length", 1);

      cy.get("label.right").should("have.length", 0);

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get("label.right,label.wrong").should("have.length", 0);
        });
    });
    it(" > [mcq_std_scoring]:test => Testing partial match and multiple responses with penalty", () => {
      const preview = question.header.preview();

      preview.header.edit();
      // .getEditButton()
      // .click();

      // advanced
      // question.clickOnAdvancedOptions();

      question.getMultipleResponse().click();

      question.getPoints().type("{selectall}8");

      question.selectScoringType(SCORING_TYPE.PARTIAL);

      question
        .getAllAnsChoicesLabel()
        .contains(queData.choices[0])
        .click()
        .closest("label")
        .find("input")
        .should("be.checked");

      question
        .getAllAnsChoicesLabel()
        .contains(queData.correct[0])
        .click()
        .closest("label")
        .find("input")
        .should("not.checked");

      question
        .getAllAnsChoicesLabel()
        .contains(queData.alterate[0])
        .click()
        .closest("label")
        .find("input")
        .should("be.checked");

      /* question
        .getAlternates()
        .next()
        .click();
 */
      // question.getMinScore().clear();

      question.getPanalty().type(4);

      // save
      // question.header.save();

      question.header.preview();

      question.selectAnswerChoice(queData.choices[1]);
      question.selectAnswerChoice(queData.choices[0]);

      preview.checkScore("2/8");

      cy.get("label.wrong").should("have.length", 1);

      cy.get("label.right").should("have.length", 1);

      preview
        .getClear()
        .click()
        .then(() => {
          cy.get("label.right,label.wrong").should("have.length", 0);
        });
    });
    it(" > [mcq_std_scoring]:test => Testing of partial match with rounding", () => {
      const preview = question.header.preview();

      question.header.edit();
      question.getPoints().type("{selectall}2.6");
      question.selectScoringType(SCORING_TYPE.PARTIAL);
      question.selectRoundingType("Round down");
      question.header.preview();
      question.selectAnswerChoice(queData.choices[0]);
      preview.checkScore("1/2.6");
    });
    it(" > [mcq_std_scoring]:test => Testing of partial match without rounding", () => {
      const preview = question.header.preview();

      question.header.edit();
      question.getPoints().type("{selectall}2.6");
      question.selectScoringType(SCORING_TYPE.PARTIAL);
      question.selectRoundingType("None");
      question.header.preview();
      question.selectAnswerChoice(queData.choices[0]);
      preview.checkScore("1.3/2.6");
    });
    it(" > [mcq_std_scoring]:test => Testing of partial match with rounding and penality", () => {
      const preview = question.header.preview();
      const view = editItem.header.preview();

      question.header.edit();
      question.getPoints().type("{selectall}3.6");
      question.getPanalty().type("{selectall}1");
      question.selectScoringType(SCORING_TYPE.PARTIAL);
      question.selectRoundingType("Round down");
      question.header.preview();
      question.selectAnswerChoice(queData.choices[0]);
      question.selectAnswerChoice(queData.choices[1]);
      preview.checkScore("1/3.6");
    });
    it(" > [mcq_std_scoring]:test => Testing of partial match without rounding and penality", () => {
      const preview = question.header.preview();
      question.header.edit();
      question.getPoints().type("{selectall}3.6");
      question.getPanalty().type("{selectall}1");
      question.selectScoringType(SCORING_TYPE.PARTIAL);
      question.selectRoundingType("None");
      question.header.preview();
      question.selectAnswerChoice(queData.choices[0]);
      question.selectAnswerChoice(queData.choices[1]);
      preview.checkScore("1.3/3.6");
    });
    it(" > [mcq_std_scoring]:test => default alternate answer check with exact scoring type", () => {
      const preview = question.header.preview();
      question.header.edit();

      //disable multi response
      question.getMultipleResponse().click();

      question
        .getAllAnsChoicesLabel()
        .contains(queData.choices[0])
        .closest("label")
        .find("input")
        .should("be.checked");

      question
        .getAllAnsChoicesLabel()
        .contains(queData.alterate[0])
        .closest("label")
        .find("input")
        .should("not.checked");
      //set correct answer point as "2"
      question.getPoints().type("{selectall}2");
      //add a alternate answer - score by default 1
      question.selectAlternatetab();
      question
        .getAllAnsChoicesLabel()
        .contains(queData.alterate[0])
        .closest("label")
        .find("input")
        .should("be.checked");
      question.selectScoringType(SCORING_TYPE.EXACT);
      question.header.preview();
      question.selectAnswerChoice(queData.choices[0]);
      preview.checkScore("2/2");
      preview.getClear().click();
      question.selectAnswerChoice(queData.alterate[0]);
      preview.checkScore("1/2");
      cy.get("label.right")
        .should("have.length", 1)
        .and("contain", queData.alterate[0]);
    });
    it(" > [mcq_std_scoring]:test => default alternate answer check with partial scoring type", () => {
      const preview = question.header.preview();
      question.header.edit();

      //enable multi response
      question.getMultipleResponse().click();

      //add a alternate answer - score by default 1
      question.selectAlternatetab();
      question
        .getAllAnsChoicesLabel()
        .contains(queData.alterate[0])
        .closest("label")
        .find("input")
        .should("be.checked");

      question.selectAlternatetab();
      question
        .getAllAnsChoicesLabel()
        .contains(queData.alterate[1])
        .click()
        .closest("label")
        .find("input")
        .should("be.checked");

      question.selectScoringType(SCORING_TYPE.PARTIAL);
      question.header.preview();
      question.selectAnswerChoice(queData.alterate[0]);
      preview.checkScore("0.5/2");
      cy.get("label.right")
        .should("have.length", 1)
        .and("contain", queData.alterate[0]);
      preview.getClear().click();
      question.selectAnswerChoice(queData.alterate[0]);
      question.selectAnswerChoice(queData.alterate[1]);
      preview.checkScore("1/2");
      cy.get("label.right")
        .should("have.length", 2)
        .and("contain", queData.alterate[0])
        .and("contain", queData.alterate[1]);
    });
    it(" > [mcq_std_scoring]:test => check priority of correct answer during evaluation", () => {
      //in case both alternate and correct asnwer is chosen evaluation will be done with respect to correct answer
      const preview = question.header.preview();
      question.header.edit();

      question
        .getAllAnsChoicesLabel()
        .contains(queData.choices[0])
        .closest("label")
        .find("input")
        .should("be.checked");
      question
        .getAllAnsChoicesLabel()
        .contains(queData.choices[1])
        .click()
        .closest("label")
        .find("input")
        .should("be.checked");

      //add a alternate answer - score by default 1
      question.selectAlternatetab();
      question
        .getAllAnsChoicesLabel()
        .contains(queData.alterate[0])
        .closest("label")
        .find("input")
        .should("be.checked");

      question
        .getAllAnsChoicesLabel()
        .contains(queData.alterate[1])
        .closest("label")
        .find("input")
        .should("be.checked");
      question.selectScoringType(SCORING_TYPE.PARTIAL);
      question.getPanalty().type("{selectall}0");
      question.header.preview();
      question.selectAnswerChoice(queData.choices[0]);
      question.selectAnswerChoice(queData.alterate[0]);
      preview.checkScore("1/2");
      cy.get("label.wrong")
        .should("have.length", 1)
        .and("contain", queData.alterate[0]);
      cy.get("label.right")
        .should("have.length", 1)
        .and("contain", queData.choices[0]);
    });
  });
});
