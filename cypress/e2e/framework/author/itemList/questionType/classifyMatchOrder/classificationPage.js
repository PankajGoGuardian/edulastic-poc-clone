/* eslint-disable class-methods-use-this */
import EditToolBar from '../common/editToolBar'
import Header from '../../itemDetail/header'
import Helpers from '../../../../util/Helpers'
import CypressHelper from '../../../../util/cypressHelpers'

class ClassificationPage {
  constructor() {
    this.editToolBar = new EditToolBar()
    this.header = new Header()

    this.scoringTypeOption = {
      'Exact match': 'exactMatch',
      'Partial match': 'partialMatch',
    }
  }

  // question content
  getQuestionEditor = () => cy.get('[data-placeholder="Enter question"')

  getDropDownColumn = () => cy.get('[data-cy="classification-column-dropdown"]')

  getDropDownListColumn = (index) =>
    cy.get(`[data-cy="coloumn-dropdown-list-${index}"]`)

  getDropDownRow = () => cy.get('[data-cy="classification-row-dropdown"]')

  getDropDownListRow = (index) =>
    cy.get(`[data-cy="row-dropdown-list-${index}"]`)

  getColumnTitleInptuList = () =>
    cy.get('[data-cy="column-container"]').find('.fr-element')

  getColumnAddButton = () =>
    cy
      .get('[data-cy="column-container"]')
      .contains('span', 'Add new column')
      .parent()
      .should('be.visible')

  getColumnDeleteByIndex = (index) =>
    cy.get(`[data-cy="deletecolumns${index}"]`)

  getRowTitleInptuList = () =>
    cy.get('[data-cy="row-container"]').find('[contenteditable="true"]')

  getRowTitleInputByIndex = (index) =>
    cy
      .get('[data-cy="row-container"]')
      .find('[contenteditable="true"]')
      .eq(index)

  getRowAddButton = () =>
    cy
      .get('[data-cy="classification-row-dropdown"]')
      .parent()
      .should('be.visible')

  getRowDeleteByIndex = (index) => cy.get(`[data-cy="deleterows${index}"]`)

  getChoiceDeleteByIndex = (index) => cy.get(`[data-cy="deletegroup${index}"]`)

  deleteAllchoices = () => {
    cy.get('#classification-possible-responses')
      .parent()
      .parent()
      .find('[data-cy^="deletegroup"]')
      .then((choices) => {
        for (let i = choices.length - 1; i >= 0; i--) {
          this.getChoiceDeleteByIndex(i).click()
        }
      })
  }

  getGroupResponsesCheckbox = () =>
    cy
      .contains('span', 'Group possible responses')
      .closest('label')
      .should('be.visible')

  getGroupContainerByIndex = (index) =>
    cy.get(`[data-cy="group-container-${index}"]`)

  getTitleInputByIndex = (index) => {
    const group = this.getGroupContainerByIndex(index)
    return group.find('input').should('be.visible')
  }

  getAddNewChoiceByIndex = (index) => {
    const group = this.getGroupContainerByIndex(index)
    return group.contains('span', 'Add new choice').closest('button')
  }

  getAddNewChoiceButton = () => {
    return cy
      .get('[data-cy="addButton"]')
      .contains('span', 'Add new choice')
      .closest('button')
  }

  getChoiceListByGroup = (index) => {
    const group = this.getGroupContainerByIndex(index)
    return group.find('[data-cy="group-choices"]').children().first().children()
  }

  deleteChoiceByGroup = (gIndex, index) => {
    cy.get(`[data-cy="deletegroup${gIndex}${index}"]`).click()
    return this
  }

  getChoiceEditorByGroup = (gIndex, index) => {
    const group = this.getGroupContainerByIndex(gIndex)
    return group
      .find('[data-cy="quillSortableItem"]')
      .eq(index)
      .find('[contenteditable="true"]')
  }

  getChoiceEditor = (index) =>
    cy
      .get(`#froalaToolbarContainer-quill-sortable-itemgroup${index}`)
      .parent()
      .find('[contenteditable="true"]')

  getDragDropBox = () => cy.contains('h3', 'Drag & Drop the answer').next()

  getAddNewGroupButton = () =>
    cy.contains('span', 'ADD NEW GROUP').closest('button').should('be.visible')

  getPontsInput = () => cy.get('[data-cy="points"]')

  getDragDropItemByIndex = (index) =>
    cy.get(`[data-cy="drag-drop-item-${index}"]`)

  getDragDropBoardByIndex = (index) =>
    cy.get(`#drop-container-${index}`).find('[data-dnd="edu-dragitem"]')

  addAlternate = () => {
    cy.get('[data-cy="alternate"]').should('be.visible').click()
    return this
  }

  getShowDragHandel = () => cy.get(`[data-cy="showDragHandle"]`)

  getDuplicatedResponses = () => cy.get(`[data-cy="duplicateResponses"]`)

  getShuffleOptions = () => cy.get(`[data-cy="shuffleOptions"]`)

  selectScoringType(option) {
    const selectOp = `[data-cy="${this.scoringTypeOption[option]}"]`
    cy.get('[data-cy="scoringType"]').click({ force: true })

    cy.get(selectOp).should('be.visible').click()

    cy.get('[data-cy="scoringType"]')
      .find('.ant-select-selection-selected-value')
      .should('contain', option)

    return this
  }

  getPanalty = () => cy.get('[data-cy="penalty"]').should('be.visible')

  getEnableAutoScoring = () => cy.get('[data-cy="autoscoreChk"]')

  getMinScore = () => cy.get('[data-cy=minscore]').should('be.visible')

  getMaxScore = () => cy.get('[data-cy="points"]').should('be.visible')

  clickOnAdvancedOptions = () => {
    // cy.contains('span', 'Advanced Options').should('be.visible').click()
    return this
  }

  getAddedAlternate = () => cy.get('[data-cy="del-alter"]')

  getLayout() {
    return Helpers.getElement('layout').should('be.visble')
  }

  getFontSizeSelect() {
    return Helpers.getElement('fontSizeSelect')
  }

  getSmallFontSizeOption() {
    return Helpers.getElement('small')
  }

  getNormalFontSizeOption() {
    return Helpers.getElement('normal')
  }

  getLargeFontSizeOption() {
    return Helpers.getElement('large')
  }

  getExtraLargeFontSizeOption() {
    return Helpers.getElement('xlarge')
  }

  getHugeFontSizeOption() {
    return Helpers.getElement('xxlarge')
  }

  getClassificationPreview() {
    return Helpers.getElement('classificationPreview')
  }

  getClassificationPreviewWrapper() {
    return this.getClassificationPreview().find(
      '[data-cy="classificationPreviewWrapper"]'
    )
  }

  getResponseContainerPositionSelect() {
    return Helpers.getElement('responseContainerPositionSelect')
  }

  getTopResContainerOption() {
    return Helpers.getElement('top')
  }

  getBottomResContainerOption() {
    return Helpers.getElement('bottom')
  }

  getLeftResContainerOption() {
    return Helpers.getElement('left')
  }

  getRightResContainerOption() {
    return Helpers.getElement('right')
  }

  getStemNumerationSelect() {
    return Helpers.getElement('stemNumerationSelect')
  }

  getNumericalOption() {
    return Helpers.getElement('numerical')
  }

  getUppercaseAlphabetOption() {
    return Helpers.getElement('uppercase')
  }

  getLowercaseAlphabetOption() {
    return Helpers.getElement('lowercase')
  }

  getRowTitlesWidthInput() {
    return Helpers.getElement('rowTitleWidth').next().should('be.visible')
  }

  getRowHeaderInput() {
    return cy
      .get('[data-cy="rowHeaderInput"]')
      .parent()
      .find('[contenteditable="true"]')
    // .find(".ql-editor");
  }

  getMaximumResponsesPerCellInput() {
    return Helpers.getElement('maximumResponsesPerCellInput').next()
  }

  getRowMinHeightInput() {
    return Helpers.getElement('minHeightOption').next()
  }

  getQuestionText = () => cy.get('[contenteditable="true"]').first()

  checkGetEnableAutoScoring = () => {
    this.getEnableAutoScoring()
      .parent()
      .then((ele) => {
        if (!ele.hasClass('ant-checkbox-checked'))
          this.getEnableAutoScoring().click({ force: true })
      })
  }

  checkFontSize(fontSize) {
    this.header.preview()

    this.getClassificationPreview()
      .should('have.css', 'font-size')
      .and('eq', fontSize)

    this.header.edit()
  }

  checkRowTitlesWidth(width) {
    this.header.preview()

    this.getClassificationPreview()
      .find('[data-cy="rowTitle"]')
      .find('[data-cy="styled-wrapped-component"]')
      .should('have.css', 'width')
      .and('eq', width)

    this.header.edit()
  }

  checkRowTitlesMinHeight(height) {
    this.header.preview()

    this.getClassificationPreview()
      .find('.classification-preview-wrapper-response')
      .find('[data-dnd="edu-droparea"]')
      .eq(0)
      .should('have.css', 'min-height')
      .and('eq', height)

    this.getClassificationPreview()
      .find('.classification-preview-wrapper-response')
      .find('[data-dnd="edu-droparea"]')
      .eq(1)
      .should('have.css', 'min-height')
      .and('eq', height)

    this.header.edit()
  }

  checkRowHeader(text) {
    this.header.preview()

    this.getClassificationPreview()
      .find('[data-cy="rowHeader"]')
      .should('contain', text)

    this.header.edit()
  }

  checkResponseContainerPosition(position) {
    this.header.preview()

    switch (position) {
      case 'top':
        this.getClassificationPreviewWrapper()
          .should('have.css', 'flex-direction')
          .and('eq', 'column-reverse')
        break
      case 'bottom':
        this.getClassificationPreviewWrapper()
          .should('have.css', 'flex-direction')
          .and('eq', 'column')
        break
      case 'left':
        this.getClassificationPreviewWrapper()
          .should('have.css', 'flex-direction')
          .and('eq', 'row-reverse')
        break
      case 'right':
        this.getClassificationPreviewWrapper()
          .should('have.css', 'flex-direction')
          .and('eq', 'row')
        break
      default:
        break
    }

    this.header.edit()
  }

  selectDropDownByAttributeAndBlock = (attribute, block, option) => {
    cy.get(`[data-cy=${attribute}]`).click({ force: true })
    // cy.wait(300) // allow list to expand

    cy.get(`[data-cy=${block}]`)
      .find('.ant-select-dropdown-menu-item')
      .then(($ele) => {
        cy.wrap(
          $ele
            // eslint-disable-next-line func-names
            .filter(function () {
              return Cypress.$(this).text() === option
            })
        ).click({ force: true })
      })
  }

  checkShowDragHandel = () => {
    this.getShowDragHandel()
      .parent()
      .then((ele) => {
        if (!ele.hasClass('ant-checkbox-checked')) {
          this.getShowDragHandel().click({ force: true })
        }
      })
  }

  unCheckShowDragHandel = () => {
    this.getShowDragHandel()
      .parent()
      .then((ele) => {
        if (ele.hasClass('ant-checkbox-checked')) {
          this.getShowDragHandel().click({ force: true })
        }
      })
  }

  checkDuplicatedResponses = () => {
    this.getDuplicatedResponses()
      .parent()
      .then((ele) => {
        if (!ele.hasClass('ant-checkbox-checked')) {
          this.getDuplicatedResponses().click({ force: true })
        }
      })
  }

  unCheckDuplicatedResponses = () => {
    this.getDuplicatedResponses()
      .parent()
      .then((ele) => {
        if (ele.hasClass('ant-checkbox-checked')) {
          this.getDuplicatedResponses().click({ force: true })
        }
      })
  }

  checkShuffleOptions = () => {
    this.getShuffleOptions()
      .parent()
      .then((ele) => {
        if (!ele.hasClass('ant-checkbox-checked')) {
          this.getShuffleOptions().click({ force: true })
        }
      })
  }

  unCheckShuffleOptions = () => {
    this.getShuffleOptions()
      .parent()
      .then((ele) => {
        if (ele.hasClass('ant-checkbox-checked')) {
          this.getShuffleOptions().click({ force: true })
        }
      })
  }

  verifyDragHandel = () => {
    this.checkShowDragHandel()
    cy.get('[class^="ChoiceContainer__Container"]')
      .find('[data-icon="arrows-alt"]')
      .should('have.length', 4)
    this.getDragDropItemByIndex(1)
      .find('[data-icon="arrows-alt"]')
      .should('be.visible')
  }

  verifyShuffleChoices = (choices, shuffled = true) => {
    const shuffledChoices = []
    cy.get('[class^="ChoiceContainer__Container"]')
      .find('[data-cy="styled-wrapped-component"]')
      .then(($ele) => {
        for (let i = 0; i < $ele.length; i++) {
          shuffledChoices.push($ele[i].textContent)
          console.log($ele[i].textContent)
        }
      })
    if (shuffled)
      CypressHelper.checkObjectInEquality(
        choices,
        shuffledChoices,
        'choices are shuffled'
      )
    else
      CypressHelper.checkObjectEquality(
        choices,
        shuffledChoices,
        'choices are not shuffled'
      )
  }
}

export default ClassificationPage
