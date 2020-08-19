// / <reference types="Cypress"/>
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import EssayPlainTextPage from "../../../../framework/author/itemList/questionType/writtenAndSpoken/essayPlainTextPage";
import FileHelper from "../../../../framework/util/fileHelper";
import validateSolutionBlockTests from "../../../../framework/author/itemList/questionType/common/validateSolutionBlockTests";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import { questionType } from "../../../../framework/constants/questionTypes";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Essay with plain text" type question`, () => {
  const queData = {
    group: "Writing",
    queType: questionType.ESSAY_PLAIN,
    queText: "Describe yourself in one sentence?",
    extlink: "www.testdomain.com",
    testtext: "testtext",
    copycut: "testcopycutpaste",
    formula: "s=ar^2"
  };

  const question = new EssayPlainTextPage();
  const editItem = new EditItemPage();

  before(() => {
    cy.login();
  });

  context(" > User creates question", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();
      // create new que and select type
      editItem.chooseQuestion(queData.group, queData.queType);
    });

    it(" > [essay_p_s1]] => user create question with default option and save", () => {
      // temporialy visiting preview page in order to question editor box in edit page
      question
        .getQuestionEditor()
        .clear()
        .type(queData.queText)
        .should("have.text", queData.queText);

      // save que
      question.header.save();
    });

    it(" > [essay_p_s2] => preview - verify default cut/copy/paste options", () => {
      question.header.preview();
      // verify copy paste option
      question
        .getTextEditor()
        .clear()
        .type(queData.testtext);

      question.getTextEditor().then($ele => {
        $ele.select();
      });

      question.clcikOnCopy();

      question.getTextEditor().type(queData.copycut);

      question.clickOnpaste();

      question.getTextEditor().should("have.text", `${queData.testtext}${queData.copycut}${queData.testtext}`);

      // verify cut paste option
      question
        .getTextEditor()
        .clear()
        .type(queData.testtext);

      question.getTextEditor().then($ele => {
        $ele.select();
      });

      question.clickOnCut();

      question.getTextEditor().type(queData.copycut);

      question.clickOnpaste();

      question.getTextEditor().should("have.text", `${queData.copycut}${queData.testtext}`);
    });

    it(" > [essay_p_s3] => preview - validate word limit on typing ans text", () => {
      question.getTextEditor().clear();

      // typing 5 words
      const words = [1, 2, 3, 4, 5];
      let i;
      for (i in words) {
        question
          .getTextEditor()
          .type(queData.testtext)
          .type(" ");

        question.getWordCount().should("have.text", `${words[i]} Words`);
      }
    });
    it(" > [essay_p_s4] => preview - verify cut copy paste option settings", () => {
      question.header.edit();
      question.getCopyCheckBox().click({ force: true });

      question.header.preview();

      question.getCopy().should("not.exist");
      question.getCut().should("be.visible");
      question.getPaste().should("be.visible");
    });
    validateSolutionBlockTests(queData.group, queData.queType);
  });
});
