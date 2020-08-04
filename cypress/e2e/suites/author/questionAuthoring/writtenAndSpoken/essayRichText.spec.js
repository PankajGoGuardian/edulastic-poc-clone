import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import EssayRichTextPage from "../../../../framework/author/itemList/questionType/writtenAndSpoken/essayRichTextPage";
import FileHelper from "../../../../framework/util/fileHelper";
import validateSolutionBlockTests from "../../../../framework/author/itemList/questionType/common/validateSolutionBlockTests";
import { questionType } from "../../../../framework/constants/questionTypes";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Essay with rich text" type question`, () => {
  const queData = {
    // group: "Written & Spoken",
    group: "Writing",
    queType: questionType.ESSAY_RICH,
    queText: "Describe yourself in one sentence?",
    extlink: "www.testdomain.com",
    testtext: "testtext",
    formula: "s=ar^2"
  };

  const question = new EssayRichTextPage();
  const editItem = new EditItemPage();

  before(() => {
    cy.login();
  });

  context(" > User creates question.", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();
      // create new que and select type
      editItem.chooseQuestion(queData.group, queData.queType);
    });

    it(" > [essay_rich_s1] => user create question with default option and save", () => {
      question
        .getQuestionEditor()
        .type(queData.queText)
        .should("have.text", queData.queText);

      // save que
      question.header.save();
    });

    it(" > [essay_rich_s2] => preview - verify default formatting options", () => {
      question.header.preview();
      // type text in ans
      question.getTextEditor().type(queData.testtext);

      // verify all default formatting option
      // question.selectedFormattingOptions.forEach(formate => {
      //   const text = queData.testtext;
      //   const { sel, tag } = formate;

      //   question
      //     .getTextEditor()
      //     .find("p")
      //     .makeSelection();

      //   question
      //     .getToobar()
      //     .find(sel)
      //     .click({ multiple: true, force: true });

      //   question
      //     .getTextEditor()
      //     .contains(tag, text)
      //     .should("have.length", 1);

      //   question
      //     .getTextEditor()
      //     .find("p")
      //     .makeSelection();

      //   question
      //     .getToobar()
      //     .find(sel)
      //     .click();

      //   question
      //     .getTextEditor()
      //     .find(tag)
      //     .should("not.be.exist");
      // });
    });

    it(" > [essay_rich_s3] => preview - validate word limit on typing ans text", () => {
      // typing 5 words
      const words = [1, 2, 3, 4, 5];
      let i;
      for (i in words) {
        question
          .getTextEditor()
          .type(queData.testtext)
          .type(" ");
      }

      // validate

      question.getWordCount().should("have.text", "5 Words");
    });
    validateSolutionBlockTests(queData.group, queData.queType);
  });
});
