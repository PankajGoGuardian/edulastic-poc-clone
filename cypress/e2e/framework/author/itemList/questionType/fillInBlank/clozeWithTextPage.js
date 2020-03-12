import EditToolBar from "../common/editToolBar";
import TemplateMarkupBar from "../common/templateMarkUpBar";
import Header from "../../itemDetail/header";
import EditItemPage from "../../itemDetail/editPage";
import { questionType, questionGroup } from "../../../../constants/questionTypes";

class ClozeWithTextPage {
  constructor() {
    this.editToolBar = new EditToolBar();
    this.header = new Header();
    this.TemplateMarkupBar = new TemplateMarkupBar();
  }

  // question content
  getQuestionEditor = () => cy.get(".fr-element").eq(0);

  addAlternate() {
    cy.get('[data-cy="alternative"]').click();

    return this;
  }

  getPoints = () => cy.get("#cloze-with-text-points");

  getAlternates = () => cy.get('[data-cy="tabs"]').contains("span", "Alternate");

  // correct ans response box
  getResponseBoxByIndex = index =>
    cy
      .get('[class^="ClozeTextInput"]')
      .eq(index)
      .find("input");

  // advance options
  clickOnAdvancedOptions = () =>
    cy.get('[class^="AdvancedOptionsLink"]').then(ele => {
      if (ele.siblings().length === 3) cy.wrap(ele).click();
    });

  // on preview
  getResponseOnPreview = index =>
    cy
      .get('[class^="AnswerBox"]')
      .eq(index)
      .should("be.visible");

  getShowAnsBoxOnPreview = () => cy.get(".correctanswer-box").should("be.visible");

  getSetAns = () => cy.get(".jsx-parser").find(".ant-input");

  createQuestion = (queKey = "default", queIndex = 0, onlyItem = true) => {
    const item = new EditItemPage();
    item.createNewItem(onlyItem);
    item.chooseQuestion(questionGroup.FILL_IN_BLANK, questionType.CLOZE_TEXT);
    cy.fixture("questionAuthoring").then(authoringData => {
      const { quetext, setAns } = authoringData.TEXT_CLOZE[queKey];
      if (quetext) {
        this.getQuestionEditor().clear({ force: true });
        quetext.forEach(element => {
          if (element === "INPUT") cy.get('[data-cmd="textinput"]').click({ force: true });
          else this.getQuestionEditor().type(element, { force: true });
        });
        this.getPoints()
          .type("{selectall}")
          .type(setAns.points);
        if (setAns) {
          setAns.correct.forEach((element, key) => {
            cy.wait(2000);
            this.getSetAns()
              .eq(key)
              .should("not.be.disabled")
              .type(element, { force: true });
            // this.getSetAns().eq(key).
          });
        }
      }
    });
  };
}
export default ClozeWithTextPage;
