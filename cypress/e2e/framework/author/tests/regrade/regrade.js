/* eslint-disable lines-between-class-members */
export default class Regrade {
  // *** ELEMENTS START ***
  getCancelRegrade = () => cy.get('[data-cy="cancelRegrade"]')

  getRadioByValue = (value) => cy.get(`[data-cy="${value}"]`)
  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  regradeSelection = (regrade, EditFromAssgntsPage = false) => {
    cy.server()
    cy.route('PUT', '**/api/test/*').as('published')
    cy.route('GET', '**/assignments').as('assignments')
    cy.contains('There are some ongoing assignments linked to the').as(
      'regradeSelect'
    )
    if (!regrade) {
      cy.get('@regradeSelect')
        .next()
        .find('button')
        .eq(0)
        .click({ force: true })
      if (EditFromAssgntsPage)
        cy.wait('@published').then((xhr) => {
          assert(xhr.status === 200, 'regrading test')
          const testId = xhr.response.body.result._id
          cy.saveTestDetailToDelete(testId)
        })
      else cy.wait('@published')
      cy.wait('@published')
    } else {
      cy.get('@regradeSelect')
        .next()
        .find('button')
        .eq(1)
        .click({ force: true })
      if (EditFromAssgntsPage)
        cy.wait('@published').then((xhr) => {
          assert(xhr.status === 200, 'regrading test')
          const testId = xhr.response.body.result._id
          cy.saveTestDetailToDelete(testId)
        })
      cy.wait('@assignments')
    }
  }

  applyRegrade = () => {
    cy.server()
    cy.route('POST', '**/assignments/regrade').as('regrade')
    cy.get("[data-cy='applyRegrade']").click({ force: true })
    cy.wait('@regrade').then((xhr) => expect(xhr.status).to.eq(200))
    cy.contains('Success!', { timeout: 120000 })
  }

  canclelRegrade = () => {
    this.getCancelRegrade().click()
    cy.contains('Share With Others')
  }

  checkRadioByValue = (value) => this.getRadioByValue(value).click()

  // *** ACTIONS END ***

  // *** APPHELPERS START ***
  // *** APPHELPERS END ***
}
