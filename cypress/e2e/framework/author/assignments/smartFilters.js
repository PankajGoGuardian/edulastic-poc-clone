import CypressHelper from '../../util/cypressHelpers'

export default class SmartFilters {
  // *** ELEMENTS START ***

  getGrades = () => cy.get('[data-cy="grades"]')

  getTestType = () => cy.get('[data-cy="filter-testType"]')

  getFilter = () => cy.get('[data-cy="smart-filter"]')

  getAllAssignment = () => cy.contains('span', 'All Assignments')

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  expandFilter = () => {
    cy.server()
    cy.route('GET', '**/user-folder?folderType=ASSIGNMENT').as('getFolders')
    this.getFilter().then(($ele) => {
      if ($ele.attr('data-test') !== 'expanded') {
        cy.wrap($ele).click().should('have.attr', 'data-test', 'expanded')
        // cy.wait("@getFolders");
      }
    })
  }

  collapseFilter = () =>
    this.getFilter().then(($ele) => {
      if ($ele.attr('data-test') === 'expanded')
        cy.wrap($ele).click().should('have.attr', 'data-test', 'collapsed')
    })

  routeAPI = () => {
    cy.server()
    cy.route('GET', /assignments/g).as('assignment')
  }

  waitForAssignments = () => {
    cy.wait('@assignment')
  }

  setGrades = (grade) => {
    this.getGrades().click()
    cy.get('.ant-select-dropdown-menu-item').then(($ele) => {
      cy.wrap(
        $ele
          // eslint-disable-next-line func-names
          .filter(function () {
            return Cypress.$(this).text() === grade
          })
      ).click({ force: true })
    })
    this.waitForAssignments()
    cy.focused().blur()
  }

  setSubject = (subject) => {
    CypressHelper.selectDropDownByAttribute('subjects', subject)
    this.waitForAssignments()
  }

  setYear = (year) => {
    CypressHelper.selectDropDownByAttribute('schoolYear', year)
    this.routeAPI()
    this.waitForAssignments()
  }

  setTesttype = (testType) => {
    this.routeAPI()
    this.getTestType().click()
    cy.get('.ant-select-dropdown-menu-item').then(($ele) => {
      cy.wrap(
        $ele.filter(function () {
          return Cypress.$(this).text() === testType
        })
      )
        .click({ force: true })
        .then(() => {
          // cy.get(`tbody > tr >td`,{timeout:15000})
          this.waitForAssignments()
        })
    })
    cy.focused().blur()
  }

  setClass = (classs) => {
    CypressHelper.selectDropDownByAttribute('filter-class', classs)
    this.waitForAssignments()
  }

  setStatus = (status) => {
    CypressHelper.selectDropDownByAttribute('filter-status', status)
    this.waitForAssignments()
  }

  resetAll = () => {
    this.getGrades().find('input').type('{backspace}'.repeat(3))
    this.setSubject('All subjects')
    this.setYear('All years')
    this.setTesttype('All')
    this.setClass('All classes')
    this.setStatus('Select Status')
  }

  // folders

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  // *** APPHELPERS END ***
}
