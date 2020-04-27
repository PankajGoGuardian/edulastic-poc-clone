import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import EssayShortTextPage from "../../../../framework/author/itemList/questionType/writtenAndSpoken/essayShortTextPage";
import FileHelper from "../../../../framework/util/fileHelper";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Short text" type question`, () => {
  const queData = {
    group: "Writing",
    queType: "Short text",
    queText: "What is the capital of India?",
    extlink: "www.testdomain.com",
    testtext: "testtext",
    correct: "New Delhi",
    formula: "s=ar^2",
    rgb1: "rgb(132, 205, 54)",
    rgb2: "rgb(252, 224, 232)"
  };

  const ALLOW_METHOD = { exact: "Exact Match", partial: "Any text containing" };

  const question = new EssayShortTextPage();
  const editItem = new EditItemPage();
  const itemList = new ItemListPage();
  let preview;

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
        .clear()
        .type(queData.queText)
        .should("have.text", queData.queText);

      question.getCorrectValue().type(queData.correct);

      // save que
      question.header.save();
    });

    it(" > [essay_short_s2] => preview - validate ans with exact match option", () => {
      preview = editItem.header.preview();

      // verify right ans
      question.getTextEditor().type(queData.correct);

      preview.checkOnCheckAnswer();

      preview.getScore().should("contain", "Score 1/1");

      question.ansHighLightAsRight(queData.rgb1);

      preview.clickOnClear();

      // verify wrong ans
      question
        .getTextEditor()
        .clear()
        .type(queData.testtext);

      preview.checkOnCheckAnswer();

      preview.getScore().should("contain", "Score 0/1");

      question.ansHighLightAsWrong(queData.rgb2);

      preview.clickOnClear();
    });
    //  TODO
    it(" > [essay_short_s3] => preview - validate ans with partial match option", () => {
      // change setting to partial matchs
      question.header.edit();
      //editItem.getEditButton().click();
      question.selectAllowType(ALLOW_METHOD.partial);
      // question.header.save();

      preview = editItem.header.preview();
      // verify right ans
      question.getTextEditor().type(`${queData.correct} ${queData.testtext}`);

      preview.checkOnCheckAnswer();

      preview.getScore().should("contain", "Score 1/1");

      question.ansHighLightAsRight();

      preview.clickOnClear();
      // verify wrong ans
      question
        .getTextEditor()
        .clear()
        .type(queData.testtext);

      preview.checkOnCheckAnswer();

      preview.getScore().should("contain", "Score 0/1");

      question.ansHighLightAsWrong();
    });
  });
});
