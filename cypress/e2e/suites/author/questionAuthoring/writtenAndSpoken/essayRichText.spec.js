import EditItemPage from "../../../../framework/author/itemList/itemDetail/editPage";
import EssayRichTextPage from "../../../../framework/author/itemList/questionType/writtenAndSpoken/essayRichTextPage";
import FileHelper from "../../../../framework/util/fileHelper";
import validateSolutionBlockTests from "../../../../framework/author/itemList/questionType/common/validateSolutionBlockTests";
import { questionType, queColor } from "../../../../framework/constants/questionTypes";
import Helpers from "../../../../framework/util/Helpers";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Author "Essay with rich text" type question`, () => {
  const queData = {
    // group: "Written & Spoken",
    group: "Writing",
    queType: questionType.ESSAY_RICH,
    queText: "Describe yourself in one sentence?",
    extlink: "www.testdomain.com",
    testText: "testtext",
    formula: "s=ar^2",
    placeHolder: "PlaceHolder Text",
    fontSize: ["normal", "large", "xlarge", "xxlarge"]
  };

  // ToolBar Options
  const toolBarOptionsWithTags = {
    bold: "strong",
    italic: "em",
    underline: "u",
    strikeThrough: "s",
    h1: "h1",
    h2: "h2",
    subscript: "sub",
    superscript: "sup"
  };
  const alignOptions = {
    alignCenter: "center",
    alignLeft: "left",
    alignRight: "right",
    alignJustify: "justify"
  };
  const blockQuote = { quote: "blockquote" };
  const indentation = { indent: "20px", outdent: "20px" };
  const list = { formatOL: "ol", formatUL: "ul" };
  const OtherOptions = [
    "math",
    "specialCharacters",
    "insertImage",
    "insertLink",
    "table",
    "paragraphFormat",
    "clearFormatting",
    "undo",
    "redo"
  ];

  const OrderListOptions = {
    "lower-alpha": "lower-alpha",
    "lower-greek": "lower-greek",
    "lower-roman": "lower-roman",
    "upper-alpha": "upper-alpha",
    "upper-roman": "upper-roman"
  };
  const unorderedListOptions = {
    circle: "circle",
    disc: "disc",
    square: "square"
  };
  const blockQuoteOptions = ["increase", "decrease"];
  const actions = ["bold", "italic", "underline"];

  const allOptions = [
    ...Cypress._.keys(toolBarOptionsWithTags),
    ...Cypress._.keys(alignOptions),
    ...Cypress._.keys(blockQuote),
    ...Cypress._.keys(indentation),
    ...Cypress._.keys(list),
    ...OtherOptions
  ];

  const question = new EssayRichTextPage();
  const editItem = new EditItemPage();
  const words = [1, 2, 3, 4, 5];
  let i;

  before(() => {
    cy.login();
  });

  context(" > User creates question.", () => {
    before("visit items page and select question type", () => {
      editItem.createNewItem();
      // create new que and select type
      editItem.chooseQuestion(queData.group, queData.queType);
    });

    context(" > [essay_rich_s1] => User creates question and update points.", () => {
      it(" > user create question with default option, update points and save", () => {
        question
          .getQuestionEditor()
          .type(queData.queText)
          .should("have.text", queData.queText);
        // save que
        question.clickOnAdvancedOptions();
        question.getScoreInput().type(`{selectAll}${3}`);
        question.header.save();
      });
    });

    context(" > [essay_rich_s2] => Preview - verify Word Limit visibility", () => {
      it("> Verify visibility off", () => {
        question.header.edit();
        question.clickOnAdvancedOptions();
        question.selectWordlimitOption("Off");
        question
          .getWordLimitInput()
          .clear()
          .type(3);
        question.header.preview();
        question.getWordCount().should("not.have.text", `0 / 3 Word limit`);
      });

      it("> Verify visiblity on limit", () => {
        question.header.edit();
        question.clickOnAdvancedOptions();
        question.selectWordlimitOption("On limit");
        question
          .getWordLimitInput()
          .clear()
          .type(3);
        question.header.preview();
        for (i in words) {
          question
            .getTextEditor()
            .type(queData.testText)
            .type(" ");
          if (i < 3) {
            question.getWordCount().should("have.text", `${words[i]} Words`);
          } else {
            question.getWordCount().should("have.text", `${words[i]} / 3 Word limit`);
            question.getWordCount().should("have.css", "color", queColor.LIGHT_RED2);
          }
        }
      });

      it("> Verify always visible option", () => {
        question.header.edit();
        question.clickOnAdvancedOptions();
        question.selectWordlimitOption("Always visible");
        question
          .getWordLimitInput()
          .clear()
          .type(3);
        question.header.preview();
        for (i in words) {
          question
            .getTextEditor()
            .type(queData.testText)
            .type(" ");
          question.getWordCount().should("have.text", `${words[i]} / 3 Word limit`);
        }
      });
    });

    context(" > [essay_rich_s3] => Validate word count", () => {
      it(" > preview - verify show word counts option", () => {
        // uncheck word counts
        question.header.edit();
        question.clickOnAdvancedOptions();
        question.getShowWordCount().click({ force: true });
        question.getShowWordCount().should("not.be.checked");
        question.header.preview();
        question.getWordCount().should("not.exist");

        // select word counts
        question.header.edit();
        question.clickOnAdvancedOptions();
        question.getShowWordCount().click({ force: true });
        question.getShowWordCount().should("be.checked");
        question.header.preview();
        question.getWordCount().should("exist");
      });
    });

    context(" > [essay_rich_s4] => Verify browser spell check", () => {
      it(" > Verify check and uncheck spellcheck option", () => {
        const spellcheck = ["true", "false"];
        spellcheck.forEach(value => {
          question.header.edit();
          question.clickOnAdvancedOptions();
          question.getBrowserSpellCheckOption().click({ force: true });
          if (value == "true") {
            question.getBrowserSpellCheckOption().should("be.checked");
          } else {
            question.getBrowserSpellCheckOption().should("not.be.checked");
          }
          question.header.preview();
          question.getPreviewBoxContainer().should("have.attr", "spellcheck", value);
        });
      });
    });

    context(" > [essay_p_s5] => Display block tests", () => {
      it(" > Verify Special character", () => {
        question.header.edit();
        question.clickOnAdvancedOptions();
        question.getSpecialCharactersOption().click({ force: true });
        question.getSpecialCharactersOption().should("be.checked");
        question.getCharactersToDisplay().type("&");
        question.header.preview();
        question.selectSpecialCharacterInPreview("&");
      });

      it(" > Min height and Max Height", () => {
        question.header.edit();
        question.getMinHeightOption().type(`{selectall}500`);
        question.getMaxHeightOption().type(`{selectall}500`);
        question.verifyMinAndMaxHeightInPreview(500, 500);
      });

      it(" > Verify PlaceHolder", () => {
        question.header.edit();
        question.clickOnAdvancedOptions();
        question.getPlaceholderOption().type(queData.placeHolder);
        question.header.preview();
        question.getPlaceHolderInPreview().should("have.text", queData.placeHolder);
      });

      it(" > verify font size", () => {
        queData.fontSize.forEach(value => {
          question.header.edit();
          const { name, font } = Helpers.fontSize(value);
          question.selectFont(value);
          question.getFontSizeSelect().should("contain", name);
          question.checkFontSize(font);
        });
      });
    });

    context(" > [essay_rich_s6] => Preview -Verify Default toolbar options", () => {
      it(" > Preview- Verify visibility of default  toolbars including separator", () => {
        const defaultOptions = ["bold", "italic", "underline", "formatOL", "formatUL", "math", "specialCharacters"];
        question.header.preview();
        defaultOptions.forEach(value => {
          question.getToolBarOptionInPreview(value).should("exist");
        });
        // Verify separator visibility
        question.verifySeparatorVisibilityAfter(defaultOptions[2]);
      });

      it(" > Preview - Verify more text option visibility by selecting more than 10 options", () => {
        const additionalOptionsToBeSelected = ["strikeThrough", "h1", "h2", "insertImage", "insertLink"];
        question.header.edit();
        question.clickOnAdvancedOptions();
        additionalOptionsToBeSelected.forEach(value => {
          console.log(value);
          question.selectToolBarOptionInEditMode(value);
        });
        question.header.preview();
        question.getToolBarOptionInPreview("moreText").should("be.visible");
      });
    });

    context(" > [essay_rich_s7] => Verify Toolbar Options", () => {
      beforeEach("Unselect All Options", () => {
        question.header.edit();
        question.clickOnAdvancedOptions();
        allOptions.forEach(value => {
          question.unselectAllToolBarOptions(value);
        });
      });

      Cypress._.keys(toolBarOptionsWithTags).forEach(key => {
        it(`Verify ${key} option`, () => {
          question.selectToolBarOptionInEditMode(key);
          question.header.preview();
          question.getToolBarOptionInPreview(key).click();
          question.getTextEditor().type(queData.testText);
          question
            .getTextEditor()
            .contains(toolBarOptionsWithTags[key], queData.testText)
            .should("have.length", 1);
        });
      });

      Cypress._.keys(alignOptions).forEach(key => {
        it(`Verify ${key} option`, () => {
          question.selectToolBarOptionInEditMode(key);
          question.header.preview();
          question.getToolBarOptionInPreview(key).click();
          question.getTextEditor().type(queData.testText);
          question.getTextInPreview().should("have.css", "text-align", alignOptions[key]);
        });
      });

      it("Verify blockquote option", () => {
        question.selectToolBarOptionInEditMode("quote");
        question.header.preview();
        question.getTextEditor().type(`{selectAll}${queData.testText}`);
        // Verify increase and decrease options
        blockQuoteOptions.forEach(options => {
          question
            .getToolBarOptionInPreview("quote")
            .eq(0)
            .click();
          question.selectOptions(options);

          if (options == "increase") {
            question
              .getTextEditor()
              .contains(blockQuote["quote"], queData.testText)
              .should("have.length", 1);
          } else {
            question.getTextEditor().should("not.contain", blockQuote["quote"], queData.testText);
          }
        });
      });

      it("Verify indentation Option", () => {
        Cypress._.keys(indentation).forEach(key => {
          question.selectToolBarOptionInEditMode(key);
        });
        question.header.preview();
        question.getTextEditor().type(queData.testText);
        Cypress._.keys(indentation).forEach(key => {
          question.getToolBarOptionInPreview(key).click();
          if (key == "indent") {
            question.getTextInPreview().should("have.css", "margin-left", indentation[key]);
          } else {
            question.getTextInPreview().should("not.have.css", "margin-left", indentation[key]);
          }
        });
      });

      it("verify OrderedList Option", () => {
        question.selectToolBarOptionInEditMode("formatOL");
        question.header.preview();
        question.getTextEditor().type(`{selectAll}${queData.testText}`);
        Cypress._.keys(OrderListOptions).forEach(options => {
          question
            .getToolBarOptionInPreview("formatOLOptions")
            .click()
            .then(() => {
              question.selectOptions(options);
              question
                .getTextEditor()
                .find("ol")
                .should("have.css", "list-style-type", OrderListOptions[options]);
            });
        });
        // Verify Default
        question
          .getToolBarOptionInPreview("formatOLOptions")
          .click()
          .then(() => {
            question.selectOptions("default");
          });
        Cypress._.keys(OrderListOptions).forEach(options => {
          question
            .getTextEditor()
            .find("ol")
            .should("not.have.css", "list-style-type", OrderListOptions[options]);
        });
      });

      it("verify unorderedList Option", () => {
        question.selectToolBarOptionInEditMode("formatUL");
        question.header.preview();
        question.getTextEditor().type(`{selectAll}${queData.testText}`);
        Cypress._.keys(unorderedListOptions).forEach(options => {
          question
            .getToolBarOptionInPreview("formatULOptions")
            .click()
            .then(() => {
              question.selectOptions(options);
              question
                .getTextEditor()
                .find("ul")
                .should("have.css", "list-style-type", unorderedListOptions[options]);
            });
        });
        // Verify Default
        question
          .getToolBarOptionInPreview("formatULOptions")
          .click()
          .then(() => {
            question.selectOptions("default");
          });
        Cypress._.keys(OrderListOptions).forEach(options => {
          question
            .getTextEditor()
            .find("ul")
            .should("not.have.css", "list-style-type", unorderedListOptions[options]);
        });
      });

      it("verify Math option", () => {
        question.selectToolBarOptionInEditMode("math");
        question.header.preview();
        question
          .getToolBarOptionInPreview("math")
          .click()
          .then(() => {
            question.verifyMathInput("2+2");
          });
      });

      it("Verify Special Characters Option", () => {
        question.selectToolBarOptionInEditMode("specialCharacters");
        question.header.preview();
        question.getToolBarOptionInPreview("specialCharacters").click();
        question.selectOptions("¡");
        question.getPreviewBoxContainer().should("have.text", "¡");
      });

      it("Verify Image Option", () => {
        question.selectToolBarOptionInEditMode("insertImage");
        question.header.preview();
        question.getToolBarOptionInPreview("insertImage").click();
        cy.uploadFile("testImages/sample.jpg", "input[type=file]").then(() => {
          question.getTextEditor().should("have.css", "background-image");
        });
      });

      it("Verify insertLink Option", () => {
        question.selectToolBarOptionInEditMode("insertLink");
        question.header.preview();
        question
          .getToolBarOptionInPreview("insertLink")
          .click()
          .then(() => {
            question.insertLink("url", "text");
            cy.wait(500);
            question
              .getTextEditor()
              .find("a")
              .should("have.attr", "href", "http://url");
          });
      });

      it("Verify paragraph formating Option", () => {
        const paragraphOptions = { H1: "h1", H2: "h2", H3: "h3", H4: "h4" };
        question.selectToolBarOptionInEditMode("paragraphFormat");
        question.header.preview();
        question.getTextEditor().type(`${queData.testText}`);
        Cypress._.keys(paragraphOptions).forEach(Key => {
          question
            .getToolBarOptionInPreview("paragraphFormat")
            .eq(0)
            .click()
            .then(() => {
              question.selectOptions(Key);
              question
                .getTextEditor()
                .contains(paragraphOptions[Key], queData.testText)
                .should("have.length", 1);
            });
        });
      });

      it("verify table options", () => {
        question.selectToolBarOptionInEditMode("table");
        question.header.preview();
        question
          .getToolBarOptionInPreview("table")
          .click()
          .then(() => {
            question.addTableWithCells("2", "2");
            question
              .getTextEditor()
              .find("table")
              .should("have.length", 1);
          });
      });
    });

    context(" > [essay_rich_s8] =>Verify undo,redo and clear format options", () => {
      before("Select required toolbars and do the required actions", () => {
        question.header.edit();
        question.clickOnAdvancedOptions();
        allOptions.forEach(value => {
          question.unselectAllToolBarOptions(value);
        });

        // Actions
        const clearOptionsToolBarsRequired = ["bold", "italic", "underline", "clearFormatting", "undo", "redo"];
        clearOptionsToolBarsRequired.forEach(value => {
          question.selectToolBarOptionInEditMode(value);
        });
        question.header.preview();
        question.getTextEditor().type(`{selectAll}${queData.testText}{selectAll}`);
        actions.forEach(keys => {
          question.getToolBarOptionInPreview(keys).click();
        });
        actions.forEach(keys => {
          question
            .getTextEditor()
            .contains(toolBarOptionsWithTags[keys], queData.testText)
            .should("have.length", 1);
        });
        question.header.preview();
      });

      it("Verify undo Option", () => {
        question.getToolBarOptionInPreview("undo").click();
        question.getTextEditor().should("not.contain", toolBarOptionsWithTags["underline"], queData.testText);
      });

      it("Verify redo Option", () => {
        question.getToolBarOptionInPreview("redo").click();
        question
          .getTextEditor()
          .contains(toolBarOptionsWithTags["underline"], queData.testText)
          .should("have.length", 1);
      });

      it("Verify clearformatting Option", () => {
        question.getToolBarOptionInPreview("clearFormatting").click();
        actions.forEach(keys => {
          question.getTextEditor().should("not.contain", toolBarOptionsWithTags[keys], queData.testText);
        });
      });
    });

    validateSolutionBlockTests(queData.group, queData.queType);
  });
});
