import EditToolBar from "../common/editToolBar";
import Header from "../../itemDetail/header";
import EditItemPage from "../../itemDetail/editPage";
import { questionGroup, questionType } from "../../../../constants/questionTypes";

class EssayRichTextPage {
  constructor() {
    this.editToolBar = new EditToolBar();
    this.header = new Header();
  }

  getQuestionEditor = () => cy.get(".fr-element").eq(0);
  // Text formatting options

  // scoring block -> move to common utitly
  getScoreInput = () => cy.get('[data-cy="maxscore"]');

  getGradingRubricModal = () => cy.get('[data-cy="GradingRubricModal"]');

  getScoringInstructions = () => cy.get('[data-cy="scoringInstructions"]');

  getSetShowWordLimit = () => cy.get('[data-cy="setShowWordLimit"]');

  getShowWordCount = () => cy.get('[data-cy="showWordCount"]');

  getBrowserSpellCheckOption = () => cy.get('[data-cy="browserSpellCheckOption"]');

  // Display block
  getSpecialCharactersOption = () => cy.get('[data-cy="specialCharactersOption"]');

  getCharactersToDisplayOption = () => cy.get('[data-cy="charactersToDisplayOption"]');

  getMinHeightOption = () => cy.get('[data-cy="minHeightOption"]');

  getMaxHeightOption = () => cy.get('[data-cy="maxHeightOption"]');

  getPlaceholderOption = () => cy.get('[data-cy="placeholderOption"]');

  getFontSizeOption = () => cy.get('[data-cy="fontSizeOption"]');

  // on preview
  getTextEditor = () => cy.get('*[class^="EssayRichTextPreview"]').find('[contenteditable="true"]');

  getWordCount = () => cy.get('[data-cy="questionRichEssayAuthorPreviewWordCount"]');

  // ACTION STARTS
  createQuestion(queKey = "default", queIndex = 0, onlyItem = true) {
    const item = new EditItemPage();

    item.createNewItem(onlyItem);
    item.chooseQuestion(questionGroup.WRITING, questionType.ESSAY_RICH);
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

  // ACTION ENDS
}

export default EssayRichTextPage;
