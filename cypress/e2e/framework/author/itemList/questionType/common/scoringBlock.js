class ScoringBlock {
  constructor() {
    this.scoringTypeOption = {
      'Exact match': 'exactMatch',
      'Partial match': 'partialMatch',
    }
  }

  selectScoringType(option) {
    const selectOp = `[data-cy="${this.scoringTypeOption[option]}"]`
    cy.get('[data-cy="scoringType"]')
      .scrollIntoView()
      .should('be.visible')
      .click()

    cy.get(selectOp).should('be.visible').click()

    cy.get('[data-cy="scoringType"]')
      .find('.ant-select-selection-selected-value')
      .should('contain', option)

    return this
  }

  getPanalty = () => cy.get('[data-cy="penalty"]')

  getEnableAutoScoring = () =>
    cy.contains('Enable auto scoring').children().eq(0).should('be.visible')

  getMinScore = () => cy.get('[data-cy=minscore]').should('be.visible')

  getMaxScore = () => cy.get('[data-cy="maxscore"]').should('be.visible')

  getEnableScoringInstructions = () =>
    cy.get('[data-cy="isScoringInstructionsEnabled"]').should('be.visible')

  clickOngetEnableScoringInstructions = () => {
    this.getEnableScoringInstructions().click({ force: true })
  }

  checkEnableScoringInstructions = () => {
    this.getEnableScoringInstructions()
      .parent()
      .then((ele) => {
        if (!ele.hasClass('ant-checkbox ant-checkbox-checked'))
          this.clickOngetEnableScoringInstructions()
      })
  }

  unCheckEnableScoringInstructions = () => {
    this.getEnableScoringInstructions()
      .parent()
      .then((ele) => {
        if (ele.hasClass('ant-checkbox ant-checkbox-checked'))
          this.clickOngetEnableScoringInstructions()
      })
  }

  verifyAddInstructions = (value) => {
    this.checkEnableScoringInstructions()
    return cy
      .get('#froalaToolbarContainer-scoringInstructions')
      .parent()
      .find('[contenteditable="true"]')
      .type(value)
      .should('contain', value)
  }
}

export default ScoringBlock
