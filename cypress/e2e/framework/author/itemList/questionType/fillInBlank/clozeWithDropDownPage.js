import EditToolBar from "../common/editToolBar";
import TemplateMarkupBar from "../common/templateMarkUpBar";
import Header from "../../itemDetail/header";
import EditItemPage from "../../itemDetail/editPage";
import { questionType, questionGroup, questionTypeKey } from "../../../../constants/questionTypes";

class ClozeDropDownPage {
  constructor() {
    this.editItemPage = new EditItemPage();
    this.editToolBar = new EditToolBar();
    this.header = new Header();
    this.templateMarkupBar = new TemplateMarkupBar();
    this.scoringTypeOption = { "Exact match": "exactMatch", "Partial match": "partialMatch" };
  }

  // question content
  /*   getQuestionEditor = () =>  cy.xpath("//div[@class='fr-wrapper']//div[@class='fr-element fr-view']"); */
  getQuestionEditor = () => cy.get(".fr-element").eq(0);

  // template content
  getTemplateEditor = () => cy.get('[data-placeholder="[This is the template markup]"');

  // choices
  getChoiceByIndexAndResponseIndex = (responseIndex, choiceIndex) =>
    cy
      .get(`[data-cy="choice-response-${responseIndex}"]`)
      .find(`[data-cy="edit_prefix_${choiceIndex}"]`)
      .should("be.visible");

  // add choice to reponse index
  addNewChoiceByResponseIndex = responseIndex => {
    cy.get(`[data-cy="choice-response-${responseIndex}"]`)
      .contains("Add New Choice")
      .click();
  };

  getAllAnsChoicesLabel = () =>
    cy
      .get('[data-cy="points"]')
      .parent()
      .parent()
      .next()
      .find("label");

  getPoints = () => cy.get("#cloze-with-drop-down-points");

  // advance options
  clickOnAdvancedOptions() {
    this.editItemPage.showAdvancedOptions();
    return this;
  }

  selectScoringType(option) {
    const selectOp = `[data-cy="${this.scoringTypeOption[option]}"]`;
    cy.get('[data-cy="scoringType"]')
      .should("be.visible")
      .click();

    cy.get(selectOp)
      .should("be.visible")
      .click();

    cy.get('[data-cy="scoringType"]')
      .find(".ant-select-selection-selected-value")
      .should("contain", option);

    return this;
  }

  getPanalty = () => cy.get('[data-cy="penalty"]');

  getEnableAutoScoring = () => cy.contains("Enable auto scoring");

  getMinScore = () => cy.get("[data-cy=minscore]").should("be.visible");

  getMaxScore = () => cy.get('[data-cy="maxscore"]').should("be.visible");

  addAlternate() {
    cy.get('[data-cy="alternative"]').click({ force: true });
    return this;
  }

  getAlternates = () => cy.get('[data-cy="tabs"]').contains("span", "Alternate");

  // correct ans response box
  setChoiceForResponseIndex = (index, choice) => {
    cy.get("[data-cy='drop_down_select']")
      .eq(index)
      .click();

    cy.contains(choice)
      .should("be.visible")
      .click();

    cy.get("[data-cy='drop_down_select']")
      .eq(index)
      .find(".ant-select-selection-selected-value")
      .should("have.text", choice);
  };

  // on preview
  getResponseOnPreviewByIndex = index =>
    cy
      .get('[data-cy="answer-box"]')
      .eq(index - 1)
      .should("be.visible");

  getShowAnsBoxOnPreview = () => cy.get(".response-btn").should("be.visible");

  createQuestion = (queKey = "default", queIndex = 0, onlyItem = true) => {
    const item = new EditItemPage();
    item.createNewItem(onlyItem);
    item.chooseQuestion(questionGroup.FILL_IN_BLANK, questionType.CLOZE_DROP_DOWN);
    cy.fixture("questionAuthoring").then(authoringData => {
      const { quetext, setAns, choices } = authoringData[questionTypeKey.CLOZE_DROP_DOWN][queKey];
      const ans = setAns.correct;
      if (quetext) {
        this.getQuestionEditor()
          .clear({ force: true })
          .as("questionContent");
        cy.get("@questionContent").type(`Q${queIndex + 1} - `, { force: true });
        quetext.forEach(element => {
          if (element === "INPUT") cy.get('[data-cmd="textdropdown"]').click({ force: true });
          else cy.get("@questionContent").type(element, { force: true });
        });
      }

      if (choices) {
        Object.keys(choices).forEach((rep, repIndex) => {
          choices[rep].forEach((choice, chIndex) => {
            this.addNewChoiceByResponseIndex(repIndex);
            this.getChoiceByIndexAndResponseIndex(repIndex, chIndex)
              .type("{selectall}", { force: true })
              .type(choice, { force: true });
          });
        });
      }

      if (ans) {
        Object.keys(ans).forEach((answer, ansIndex) => {
          this.setChoiceForResponseIndex(ansIndex, ans[answer]);
        });
      }
      if (setAns.points) {
        this.getPoints()
          .type("{selectall}")
          .type(setAns.points);
      }
    });
  };
}

export default ClozeDropDownPage;
