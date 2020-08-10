// eslint-disable-next-line spaced-comment
/// <reference types="Cypress"/>
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import TokenHighlightPage from "../../../../framework/author/itemList/questionType/highlight/tokenHighlightPage";
import PreviewItemPage from "../../../../framework/author/itemList/itemDetail/previewPage";
import FileHelper from "../../../../framework/util/fileHelper";
import Helpers from "../../../../framework/util/Helpers";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Token highlight" type question`, () => {
  const queData = {
    group: "Highlight",
    queType: "Sentence Response",
    queText: "Highlight the correct part?",
    template: [
      "This is first paragraph. And of two sentences.",
      "This is second paragraph. And of three sentences. Third sentense is here."
    ],
    correct: {
      para: [0],
      sentence: ["And of two sentences", "Third sentense is here"],
      word: ["first", "three", "Third"]
    },
    extlink: "www.testdomain.com",
    testtext: "testtext",
    formula: "s=ar^2"
  };

  const question = new TokenHighlightPage();
  const editItem = new EditItemPage();
  const preview = new PreviewItemPage();

  const RED_BG = "rgb(253, 224, 233)";
  const RED_BD = "rgba(255, 255, 255, 0)";
  const GREEN_BG = "rgb(226, 252, 243)";
  const GREEN_BD = "rgba(255, 255, 255, 0)";

  const ACTIVE = "rgb(26, 115, 232)";
  const ACTIVEWORD = "active-word";

  before(() => {
    cy.login();
  });

  context(" > User creates question", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();
      // create new que and select type
      editItem.chooseQuestion(queData.group, queData.queType);
    });

    it(" > [Tc_210] : Enter question text in Compose Question text box", () => {
      // enter question
      question
        .getQuestionEditor()
        .clear()
        .type(queData.queText)
        .should("have.text", queData.queText);
    });

    it(" > [Tc_211] : Edit template and token", () => {
      // template
      question
        .getTemplateEditor()
        .clear({ force: true })
        .type(queData.template[0])
        .type("{enter}")
        .type(queData.template[1]);

      question.getQuestionEditor().click();
      // token
      question.goToEditToken();
      const tokens = [{ sel: "Paragraph", count: 2 }, { sel: "Sentence", count: 5 }, { sel: "Word", count: 20 }];

      tokens.forEach(token => {
        const { sel, count } = token;
        cy.get('[data-cy="tabs"]')
          .eq(0)
          .parent()
          .next()
          .contains(sel)
          .click({ force: true })
          .should("have.css", "background-color", ACTIVE);

        question
          .getAllTokens()
          .should("have.length", count)
          .each(tok => {
            cy.wrap(tok)
              .click({ force: true })
              .should("not.have.class", ACTIVEWORD)
              .click({ force: true })
              .should("have.class", ACTIVEWORD);
          });
      });

      // fix token to para
      question.paragraph().click({ force: true });
    });

    it(" > [Tc_212] : set correct answer", () => {
      // point
      question.getPoint().verifyNumInput(0.5);

      // set correct ans
      question
        .getAllTokenAnswer()
        .first()
        .then($fr => {
          cy.wrap($fr).click({ force: true });
        })
        .wait(500)
        .should("have.class", ACTIVEWORD);
    });

    it(" > [Tc_213] : save question", () => {
      // save que - temporarily passing the question content here as question editor doesnot appear
      question.getQuestionEditor().type("This is token highlight question");
      question.header.save();
      cy.url().should("contain", "item-detail");
    });

    context(" > [Tc_214] :  preview and validate checkAns,ShowAns,Clear", () => {
      it(" > [Tc_1] : Paragraph Token, validate checkAns,ShowAns,Clear", () => {
        preview.header.preview();
        // show ans
        preview
          .getShowAnswer()
          .click()
          .then(() => {
            cy.get("body")
              .contains("Correct Answers")
              .siblings()
              .eq(0)
              .should("contain", queData.template[0]);
          });

        // clear
        preview
          .getClear()
          .click()
          .then(() => {
            question.getAllTokenOnPreview().each(ele => {
              cy.wrap(ele).should("not.have.class", ACTIVEWORD);
            });
          });

        // enter right ans and check
        question
          .getAllTokenOnPreview()
          .eq(0)
          .as("answered")
          .click({ force: true })
          .should("have.class", ACTIVEWORD);

        preview.checkScore("1/1");
        cy.get("@answered")
          .should("have.css", "background-color", GREEN_BG)
          .and("have.css", "border-color", GREEN_BD);

        preview.getClear().click();

        // enter wrong ans and check
        question
          .getAllTokenOnPreview()
          .eq(1)
          .as("answered")
          .click({ force: true })
          .should("have.class", ACTIVEWORD);

        preview.checkScore("0/1");
        cy.get("@answered")
          .should("have.css", "background-color", RED_BG)
          .and("have.css", "border-color", RED_BD);

        preview.getClear().click();
      });

      it(" > [Tc_2] : Sentence Token, validate checkAns", () => {
        preview.header.edit();
        // set token and ans
        question.goToEditToken();
        question.sentence().click();

        // set correct
        question.getAllTokenAnswer().then($ele => {
          queData.correct.sentence.forEach(text => {
            cy.wrap($ele)
              .contains(text)
              .click();
          });
        });

        preview.header.preview();
        // enter right ans and check
        question.getAllTokenOnPreview().then($ele => {
          queData.correct.sentence.forEach(text => {
            cy.wrap($ele)
              .contains(text)
              .click()
              .should("have.class", ACTIVEWORD);
          });
        });

        preview.checkScore("1/1");
        queData.correct.sentence.forEach(text => {
          question
            .getAllTokenOnPreview()
            .contains("span", text)
            .should("have.css", "background-color", GREEN_BG)
            .and("have.css", "border-color", GREEN_BD);
        });

        // clear
        preview.getClear().click();

        // enter wrong ans and check
        question
          .getAllTokenOnPreview()
          .eq(0)
          .as("answered")
          .click()
          .should("have.class", ACTIVEWORD);

        preview.checkScore("0/1");
        cy.get("@answered")
          .should("have.css", "background-color", RED_BG)
          .and("have.css", "border-color", RED_BD);

        preview.getClear().click();
      });

      it(" > [Tc_3] : Word Token,validate checkAns", () => {
        preview.header.edit();
        // set token and ans
        question.goToEditToken();
        question.word().click();

        // set correct
        question.getAllTokenAnswer().then($ele => {
          queData.correct.word.forEach(text => {
            cy.wrap($ele)
              .contains(text)
              .click();
          });
        });

        preview.header.preview();
        // enter right ans and check
        question.getAllTokenOnPreview().then($ele => {
          queData.correct.word.forEach(text => {
            cy.wrap($ele)
              .contains(text)
              .click()
              .should("have.class", ACTIVEWORD);
          });
        });

        preview.checkScore("1/1");
        queData.correct.word.forEach(text => {
          question
            .getAllTokenOnPreview()
            .contains("span", text)
            .should("have.css", "background-color", GREEN_BG)
            .and("have.css", "border-color", GREEN_BD);
        });

        // clear
        preview.getClear().click();

        // enter wrong ans and check
        question
          .getAllTokenOnPreview()
          .eq(0)
          .as("answered")
          .click()
          .should("have.class", ACTIVEWORD);

        preview.checkScore("0/1");
        cy.get("@answered")
          .should("have.css", "background-color", RED_BG)
          .and("have.css", "border-color", RED_BD);

        preview.getClear().click();
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
      // editItem.showAdvancedOptions(); // UI toggle has been removed
    });

    afterEach(() => {
      editItem.header.edit();
    });

    describe(" > Layout", () => {
      before(() => {
        editItem.showAdvancedOptions();
      });

      it(" > should be able to select small font size", () => {
        const select = question.getFontSizeSelect();
        const { name } = Helpers.fontSize("small");

        select
          .scrollIntoView()
          .should("be.visible")
          .click();

        question
          .getSmallFontSizeOption()
          .should("be.visible")
          .click();

        select.scrollIntoView().should("contain", name);
        question.checkFontSize("11px");
      });
      it(" > should be able to select normal font size", () => {
        const select = question.getFontSizeSelect();
        const { name } = Helpers.fontSize("normal");

        select
          .scrollIntoView()
          .should("be.visible")
          .click();

        question
          .getNormalFontSizeOption()
          .should("be.visible")
          .click();

        select.scrollIntoView().should("contain", name);
        question.checkFontSize("14px");
      });
      it(" > should be able to select large font size", () => {
        const select = question.getFontSizeSelect();
        const { name } = Helpers.fontSize("large");

        select
          .scrollIntoView()
          .should("be.visible")
          .click();

        question
          .getLargeFontSizeOption()
          .should("be.visible")
          .click();

        select.scrollIntoView().should("contain", name);
        question.checkFontSize("17px");
      });
      it(" > should be able to select extra large font size", () => {
        const select = question.getFontSizeSelect();
        const { name } = Helpers.fontSize("xlarge");

        select
          .scrollIntoView()
          .should("be.visible")
          .click();
        question
          .getExtraLargeFontSizeOption()
          .should("be.visible")
          .click();

        select.scrollIntoView().should("contain", name);
        question.checkFontSize("20px");
      });
      it(" > should be able to select huge font size", () => {
        const select = question.getFontSizeSelect();
        const { name } = Helpers.fontSize("xxlarge");

        select
          .scrollIntoView()
          .should("be.visible")
          .click();

        question
          .getHugeFontSizeOption()
          .should("be.visible")
          .click();

        select.scrollIntoView().should("contain", name);
        question.checkFontSize("24px");
      });
      it(" > should be able to change max selection", () => {
        const maxSelection = 2;

        question
          .getMaxSelection()
          // .should("be.visible")
          .type(`{selectall}${maxSelection}`)
          .should("have.value", `${maxSelection}`);

        question.header.preview();

        question
          .getPreviewWrapper()
          .find(".answer")
          .each($el => {
            cy.wrap($el)
              .should("be.visible")
              .click();
          });

        question
          .getPreviewWrapper()
          .find(".active-word")
          .should("be.visible")
          .should("have.length", maxSelection);

        question
          .getPreviewWrapper()
          .find(".active-word")
          .each($el => {
            cy.wrap($el)
              .should("be.visible")
              .click();
          });

        question
          .getPreviewWrapper()
          .find(".active-word")
          .should("not.be.visible");

        question.header.edit();
      });
    });
  });
});
