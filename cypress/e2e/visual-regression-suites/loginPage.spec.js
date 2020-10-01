import FileHelper from '../framework/util/fileHelper'

const SCREEN_SIZES = Cypress.config('SCREEN_SIZES')

describe(`${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  before(() => cy.clearToken())
  context(`Login page`, () => {
    const page = 'login'
    SCREEN_SIZES.forEach((size) => {
      it(`- when resolution is '${size}'`, () => {
        cy.setResolution(size)
        cy.visit(`/${page}`)
        cy.get('[data-cy="login"]').should('be.visible')
        cy.matchImageSnapshotWithSize()
      })
    })
  })
})
