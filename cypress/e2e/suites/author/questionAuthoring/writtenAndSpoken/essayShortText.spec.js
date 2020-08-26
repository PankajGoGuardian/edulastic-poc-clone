import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import EssayShortTextPage from "../../../../framework/author/itemList/questionType/writtenAndSpoken/essayShortTextPage";
import FileHelper from "../../../../framework/util/fileHelper";
import validateSolutionBlockTests from "../../../../framework/author/itemList/questionType/common/validateSolutionBlockTests";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import { questionType } from "../../../../framework/constants/questionTypes";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Short text" type question`, () => {
  const queData = {
    group: "Writing",
    queType: questionType.ESSAY_SHORT,
    queText: "What is the capital of India?",
    extlink: "www.testdomain.com",
    testtext: "testtext",
    correct: "New Delhi",
    formula: "s=ar^2",
    rgb1: "rgb(132, 205, 54)",
    rgb2: "rgb(252, 224, 232)"
  };

  // const ALLOW_METHOD = { exact: "Exact Match", partial: "Any text containing" };

  const question = new EssayShortTextPage();
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

    it(" > [essay_short_s1] => user create question with default option and save", () => {
      // temporialy visiting preview page in order to question editor box in edit page
      question.header.preview();
      question.header.edit();
      question
        .getQuestionEditor()
        .type(queData.queText)
        .should("have.text", queData.queText);

      question.getCorrectValue().type(queData.correct);

      // save que
      question.header.save();
    });

    it(" > [essay_short_s2] => preview - validate ans with exact match option", () => {
      const preview = editItem.header.preview();
      // verify right ans
      question.getAnswerBox().type(queData.correct);

      preview.checkScore("1/1");

      preview.getClear().click();

      preview.getShowAnswer().click();

      preview.getClear().click();

      // question.ansHighLightAsRight(queData.rgb1);

      // verify wrong ans
      question.getAnswerBox().type(queData.testtext);

      preview.checkScore("0/1");

      // question.ansHighLightAsWrong(queData.rgb2);

      preview.getClear().click();
    });
    validateSolutionBlockTests(queData.group, queData.queType);
  });
});
