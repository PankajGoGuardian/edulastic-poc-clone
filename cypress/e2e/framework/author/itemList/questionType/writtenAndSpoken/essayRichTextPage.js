import EditToolBar from "../common/editToolBar";
import Header from "../../itemDetail/header";

class EssayRichTextPage {
  constructor() {
    this.editToolBar = new EditToolBar();

    this.header = new Header();

    this.selectedFormattingOptions = [
      {
        sel: '[data-cmd="bold"]',
        tag: "strong"
      },
      {
        sel: '[data-cmd="italic"]',
        tag: "em"
      },
      {
        sel: '[data-cmd="underline"]',
        tag: "u"
      }
      //{
      //  'sel': '[data-cmd="formatOL"]',
      //   'tag': 'ol > li'
      // },
      // {
      //    'sel': '[data-cmd="formatUL"]',
      //    'tag': 'ul > li'
      //}
    ];
  }

  // question content
  getQuestionEditor() {
    return cy.contains("Enter your question");
  }

  // word limit
  selectWordLimit(option) {
    cy.contains("span", "Word limit")
      .next()
      .should("be.visible")
      .click();

    cy.contains(option)
      .should("be.visible")
      .click();

    cy.contains("span", "Word limit")
      .next()
      .find(".ant-select-selection-selected-value")
      .should("contain", option);

    return this;
  }

  // on preview
  getMainEditor() {
    return cy.get(".fr-element");
  }

  getTextEditor() {
    return (
      cy
        .get(".fr-element")
        // .find('.ql-editor')
        .should("be.visible")
    );
  }

  getWordCount() {
    return (
      cy
        .contains("Words")
        //.next()
        //.children()
        //.eq(1)
        .should("be.visible")
    );
  }

  getToobar() {
    return cy.get(".fr-toolbar");
  }
}

export default EssayRichTextPage;
