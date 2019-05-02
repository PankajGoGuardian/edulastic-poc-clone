import MathEssayPage from "../../../../framework/author/itemList/questionType/math/mathEssayPage";
import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import FileHelper from "../../../../framework/util/fileHelper";
import EditToolBar from "../../../../framework/author/itemList/questionType/common/editToolBar";
import PreviewItemPage from "../../../../framework/author/itemList/itemDetail/previewPage";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Math Essay" type question`, () => {
  const queData = {
    mockString: "10-5+8-4",
    group: "Math",
    queType: "Math essay",
    extlink: "www.testdomain.com",
    testText: "testtext",
    formula: "s=ar^2",
    answer: {
      value: "1234",
      ariaLabel: "test"
    }
  };
  const question = new MathEssayPage();
  const editItem = new EditItemPage();
  const itemList = new ItemListPage();
  const { selectData } = question;
  const editToolBar = new EditToolBar();
  const preview = new PreviewItemPage();
  let previewItems;

  before(() => {
    cy.login();
  });

  context(" > User creates question", () => {
    before("visit items page and select question type", () => {
      itemList.clickOnCreate();
      // create new que and select type
      editItem.chooseQuestion(queData.group, queData.queType);
    });
    context(" > TC_476 => Enter question text in Compose Question text box", () => {
      it(" > Write text in textbox", () => {
        const { testText } = queData;

        question.checkIfTextExist(testText);
      });

      it(" > give external link", () => {
        const { testText } = queData;

        question.checkIfTextExist(testText).type("{selectall}");
        editToolBar.link().click();
        question.getSaveLink().click();
        question
          .getComposeQuestionTextBoxLink()
          .find("a")
          .should("have.attr", "href")
          .and("equal", testText)
          .then(href => {
            expect(href).to.equal(testText);
          });
      });

      it(" > insert formula", () => {
        const { testText } = queData;

        question.checkIfTextExist(testText).clear();
      });
      it(" > Upload image to server", () => {
        question.getComposeQuestionTextBox().focus();

        question.getUploadImageIcon().click();
        cy.uploadFile("testImages/sample.jpg", "input.ql-image[type=file]").then(() =>
          question
            .getEditorData()
            .find("img")
            .should("be.visible")
        );

        question.getComposeQuestionTextBox().clear();
      });
    });

    context(" > TC_477 => Enter the Text formatting options", () => {
      beforeEach("visit edit page and remove all formatting options", () => {
        question.moveToEdit(preview);
      });

      it(" > Testing If Bold selected", () => {
        const { testText } = queData;
        const { option, tag } = selectData.BOLD;

        question.setFormattingOptions(option);

        preview.header.preview();
        question.setTestInput();
        question.getTextFormattingEditorOptions(option).click();

        question.checkAnswerTextEditorValue(tag, testText);
      });
      it(" > Testing If Italic selected", () => {
        const { testText } = queData;
        const { option, tag } = selectData.ITALIC;

        question.setFormattingOptions(option);
        question.checkTextFormattingOption(preview, option, testText, tag);
      });
      it(" > Testing If Underline selected", () => {
        const { testText } = queData;
        const { option, tag } = selectData.UNDERLINE;

        question.setFormattingOptions(option);
        question.checkTextFormattingOption(preview, option, testText, tag);
      });
      it(" > Testing If bullet list selected", () => {
        const { testText } = queData;
        const { option, tag } = selectData.UNORDERED_LIST;
        const { option: EditorOption } = selectData.BULLET;

        question.setFormattingOptions(option);
        question.moveToPreview(preview);
        question.getAnswerTextEditorValue().clear({ force: true });
        question.getTextFormattingEditorOptions(EditorOption).click();
        question.getAnswerTextInput().type(testText, { force: true });
        question.getAnswerTextEditorBulletList().type(testText, { force: true });

        question.checkDataExist(tag, testText);
      });

      it(" > Testing If Superscript selected", () => {
        const { testText } = queData;
        const { option, tag } = selectData.ORDERED_LIST;
        const { option: EditorOption } = selectData.ORDERED;

        question.setFormattingOptions(option);
        question.moveToPreview(preview);
        question.getTextFormattingEditorOptions(EditorOption).click();
        question.getAnswerTextEditorOrderedList().type(testText, { force: true });

        question.checkDataExist(tag, testText);
      });

      it(" > Testing If number list selected ", () => {
        const { testText } = queData;
        const { option, tag } = selectData.SUBSCRIPT;
        const { option: EditorOption } = selectData.SUB;

        question.setFormattingOptions(option);
        question.moveToPreview(preview);

        question.getTextFormattingEditorOptions(EditorOption).click();
        question.checkAnswerTextEditorValue(tag, testText);
      });

      it(" > Testing If Subscript selected", () => {
        const { testText } = queData;
        const { option, tag } = selectData.SUPER_SCRIPT;
        const { option: EditorOption } = selectData.SUPER;

        question.setFormattingOptions(option);
        question.moveToPreview(preview);

        question.getTextFormattingEditorOptions(EditorOption).click();
        question.checkAnswerTextEditorValue(tag, testText);
      });

      it(" > Testing If Clear formatting is selected", () => {
        const { testText } = queData;
        const { option, tag } = selectData.REMOVE_FORMAT;
        const { option: EditorOption } = selectData.CLEAN;
        const { option: superOption } = selectData.SUPER;
        const { option: superScriptOption } = selectData.SUPER_SCRIPT;

        question.setFormattingOptions(option);
        question.getAddButton().click();
        question
          .getTextFormattingOptionsSelect()
          .last()
          .click({ force: true })
          .then(() => {
            question
              .getMethodSelectionDropdowList(superScriptOption)
              .last()
              .click();
          });

        question.moveToPreview(preview);
        question.getTextFormattingEditorOptions(superOption).click();
        question.checkAnswerTextEditorValue(tag, testText);

        question.getTextFormattingEditorOptions(EditorOption).click();

        question.getAnswerTextEditorValue().type("{selectall}", { force: true });
        question.getTextFormattingEditorOptions(EditorOption).click();
        question.getEditorInput().contains(tag, testText);
      });
    });

    context(" > TC_413 => Preview Items", () => {
      before("visit items page and select question type", () => {
        editItem.createNewItem();

        // create new que and select type
        editItem.chooseQuestion(queData.group, queData.queType);
      });
      it(" > Click on preview", () => {
        previewItems = editItem.header.preview();
        question.getAnswerMathInputField().click();
        cy.get(".keyboard").should("be.visible");
        question.getAddedAlternateAnswer().click({ force: true });
        question.getAnswerMathTextBtn().click();
        question.getAnswerTextEditor().click();
        question.getAnswerToolbarTextEditor().should("be.visible");
      });

      it(" > Click on Check answer", () => {
        previewItems
          .getCheckAnswer()
          .click()
          .then(() =>
            question
              .getBody()
              .children()
              .should("contain", "score: 0/0")
          );
      });

      it(" > Click on Show Answers", () => {
        previewItems
          .getShowAnswer()
          .click()
          .then(() => {
            question.getCorrectAnswerBox().should("not.be.visible");
          });
      });

      it(" > Click on Clear", () => {
        const { testText } = queData;
        question.getEditorInput().type(testText, { force: true });
        previewItems.getClear().click();
        question.getAnswerMathInputField().then($el => expect($el[0].innerText).to.equal(""));
      });
    });

    context(" > TC_415 => Save question", () => {
      it(" > Click on save button", () => {
        question.header.save();
        cy.url().should("contain", "item-detail");
      });
    });

    context(" > TC_484 => delete the question after creation", () => {
      it(" > Click on delete button", () => {
        editItem.getDelButton().click();
        question.getQuestionContainer().should("not.exist");
      });
    });
  });
});
