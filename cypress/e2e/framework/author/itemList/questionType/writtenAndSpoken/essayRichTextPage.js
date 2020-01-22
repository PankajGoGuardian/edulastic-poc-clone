import EditToolBar from "../common/editToolBar";
import Header from "../../itemDetail/header";
import EditItemPage from "../../itemDetail/editPage";
import { questionGroup, questionType } from "../../../../constants/questionTypes";

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
  getQuestionEditor = () => cy.get(".fr-element").eq(0);

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

  openAdvancedOption = () => {
    cy.get("body")
      .contains(" ADVANCED OPTIONS")
      .then(ele => {
        if (ele.parent().siblings().length === 3) {
          cy.wrap(ele).click();
        }
      });
  };

  setPoints = points => {
    this.openAdvancedOption();
    cy.get("body")
      .find("li")
      .contains("Dynamic Parameters")
      .click({ force: true });
    cy.get('[data-cy="maxscore"]')
      .should("be.visible")
      .type(`{selectall}${points}`, { force: true });
  };

  createQuestion(queKey = "default", queIndex = 0, onlyItem = true) {
    const item = new EditItemPage();

    item.createNewItem(onlyItem);
    item.chooseQuestion(questionGroup.READ, questionType.ESSAY_RICH);
    cy.fixture("questionAuthoring").then(authoringData => {
      const { quetext, setAns } = authoringData.ESSAY_RICH[queKey];

      if (quetext) {
        const text = `Q${queIndex + 1} - ${quetext}`;
        this.getQuestionEditor().type(text);
      }
      if (setAns.points) {
        this.setPoints(setAns.points);
      }
    });
  }
}

export default EssayRichTextPage;
