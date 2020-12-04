import EditToolBar from '../common/editToolBar'
import Header from '../../itemDetail/header'
import EditItemPage from '../../itemDetail/editPage'
import Helpers from '../../../../util/Helpers'

class EssayPlainTextPage {
  constructor() {
    this.editItemPage = new EditItemPage()
    this.editToolBar = new EditToolBar()
    this.header = new Header()
  }

  // question Authoring

  getQuestionEditor = () => cy.get('.fr-element').eq(0)

  // advance options
  clickOnAdvancedOptions() {
    this.editItemPage.showAdvancedOptions()
    return this
  }

  // Action formatting options
  getCopyCheckBox = () => cy.get('[data-cy="questionEssayPlainEditCopy"]')

  getCutCheckBox = () => cy.get('[data-cy="questionEssayPlainEditCut"]')

  getPasteCheckBox = () => cy.get('[data-cy="questionEssayPlainEditPaste"]')

  // scoring block -> move to common utitly
  getScoreInput = () => cy.get('[data-cy="maxscore"]')

  getGradingRubricModal = () => cy.get('[data-cy="GradingRubricModal"]')

  getScoringInstructions = () => cy.get('[data-cy="scoringInstructions"]')

  getSetShowWordLimit = () => cy.get('[data-cy="setShowWordLimit"]')

  getPreviewBoxContainer = () => cy.get('[data-cy="previewBoxContainer"]')

  getShowWordCount = () => cy.get('[data-cy="showWordCount"]')

  getBrowserSpellCheckOption = () =>
    cy.get('[data-cy="browserSpellCheckOption"]')

  getWordlimitOptions = () => cy.get('[data-cy="wordLimitOptions"]')

  getWordLimitInput = () => cy.get('[data-cy="wordLimitInput"]')

  getFontSizeSelect() {
    return Helpers.getElement('fontSizeOption')
  }

  getFontSize(value) {
    return Helpers.getElement(value)
  }

  // Display block
  getSpecialCharactersOption = () =>
    cy.get('[data-cy="specialCharactersOption"]')

  getCharactersToDisplayOption = () =>
    cy.get('[data-cy="charactersToDisplay"]').next()

  getMinHeightOption = () => cy.get('[data-cy="minHeightOption"]').next()

  getMaxHeightOption = () => cy.get('[data-cy="maxHeightOption"]').next()

  getPlaceholderOption = () => cy.get('[data-cy="placeholder"]').next()

  getFontSizeOption = () => cy.get('[data-cy="fontSizeOption"]')

  // on preview
  getTextEditor = () => cy.get('.ant-input').should('be.visible')

  getCopy = () => cy.get('[data-cy="questionPlainEssayAuthorPreviewToolCopy"]')

  getCut = () => cy.get('[data-cy="questionPlainEssayAuthorPreviewToolCut"]')

  getPaste = () =>
    cy.get('[data-cy="questionPlainEssayAuthorPreviewToolPaste"]')

  getWordCount = () =>
    cy.get('[data-cy="questionPlainEssayAuthorPreviewWordCount"]')

  // ACTION STARTS

  clickOnCopy = () => this.getCopy().click()

  clickOnpaste = () => this.getPaste().click()

  clickOnCut = () => this.getCut().click()

  selectWordlimitOption = (value) => {
    this.getWordlimitOptions()
      .click()
      .then(() => {
        cy.get('.ant-select-dropdown-menu').contains(value).click()
      })
    this.getWordlimitOptions().should('contain.text', value)
  }

  selectSpecialCharacterInPreview = (value) => {
    cy.get('[data-cy="questionSpecialCharacter"]').click({ force: true })
    cy.get('[class^=CharacterMap]').children().eq(2).click()
    this.getTextEditor().should('have.text', value)
  }

  selectFont(value) {
    this.getFontSizeSelect().click()
    this.getFontSize(value).click()
  }

  checkFontSize(fontSize) {
    this.header.preview()
    this.getPreviewBoxContainer()
      .should('have.css', 'font-size')
      .and('eq', fontSize)
    this.header.edit()
  }

  // ACTION ENDS
}

export default EssayPlainTextPage
