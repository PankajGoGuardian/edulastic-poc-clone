import CypressHelper from '../../util/cypressHelpers'
import { queColor } from '../../constants/questionTypes'

export default class PlayListSearchContainer {
  /* GET ELEMNETS */
  getSearchContainer = () => cy.get('[data-cy="play-list-search-container"]')

  getKeywordsSearchBar = () => cy.get('[data-cy="container-search-bar"]')

  getTestInSearchResultsById = (id) =>
    this.getSearchContainer().find(`[data-cy="${id}"]`)

  getTestInSearchResultsById = (id) =>
    this.getSearchContainer().find(`[data-cy="${id}"]`)

  getFilterButton = () => cy.get('[data-cy="test-filter"]')

  getSubjectInFilter = () => cy.get('[data-cy="test-grade"]')

  getSharedWithMe = () => this.getSearchContainer().contains('Shared with me')

  getViewTestByTestId = (id) => cy.get(`[data-cy="${id}"]`).find('.preview-btn')

  getCloseCustomizationTab = () =>
    cy.get('[data-cy="curriculum-sequence-right-panel"]').find('svg').eq(0)

  getAddResourceDropDown = () => this.getFilterButton().next()

  getDropDownItemByOption = (option) =>
    cy
      .get('.ant-dropdown-menu-item')
      .filter((i, $ele) => Cypress.dom.isVisible($ele))
      .contains(option)

  clickOptionInDropDownByText = (option) =>
    this.getDropDownItemByOption(option).click({ force: true })

  getEnterTitleInAddResource = () => cy.get('[placeholder="Enter a title"]')

  getEnterDescriptionInAddResource = () =>
    cy.get('[placeholder="Enter a description"]')

  getEnterURLInAddResource = () => cy.get('[placeholder="Enter a URL"]')

  getAddResourceButtonInPopUp = () => cy.get('[data-cy="add-resource"]')

  getResourceTab = () => cy.get('[data-cy="resources"]')

  getTestTab = () => cy.get('[data-cy="tests"]')

  /* ACTIONS START */

  setGrade = (grade) => {
    CypressHelper.selectDropDownByAttribute('test-grade', grade)
  }

  setSubject = (subject) => {
    CypressHelper.selectDropDownByAttribute('test-subject', subject)
  }

  setStatus = (status) => {
    CypressHelper.selectDropDownByAttribute('test-status', status)
  }

  setCollection = (collection) => {
    CypressHelper.selectDropDownByAttribute('test-collection', collection)
  }

  clearDropDowns = () => {
    this.setStatus('All')
    this.getSubjectInFilter().then(($ele) => {
      if ($ele.find('.anticon-close').length > 0)
        cy.wrap($ele).find('.anticon-close').click({ multiple: true })
    })
  }

  clickOnAuthoredbyMeFolder = () =>
    this.getSearchContainer().contains('Authored by me').click()

  clickOnEntireLibrary = () =>
    this.getSearchContainer().contains('Entire Library').click()

  clickOnSharedWithMe = () =>
    this.getSearchContainer().contains('Shared with me').click()

  clickOnTestFilter = () => cy.get('[data-cy="test-filter"]').click()

  clickOnViewTestById = (id) => {
    cy.server()
    cy.route('GET', '**/test/*').as('viewTest')
    this.getViewTestByTestId(id).click({ force: true })
    return cy.wait('@viewTest').then((xhr) => xhr.response.body.result._id)
  }

  verifySearchResultVisible = (testId) => {
    this.getTestInSearchResultsById(testId).should('be.visible')
  }

  VerififySearchResultNotVisible = (testId) => {
    this.getTestInSearchResultsById(testId).should('not.be.visible')
  }

  closeCustomizationTab = () => {
    this.getCloseCustomizationTab().click({ force: true })
    cy.get('[placeholder="Search by keywords"]').should('not.exist')
  }

  clearTextSearchBar = () => {
    this.routeTestSearch()
    this.getKeywordsSearchBar().then(($ele) => {
      if ($ele.find('.anticon-close').length > 0) {
        cy.wrap($ele)
          .find('.anticon-close')
          .click({ force: true, multiple: true })
        this.waitForTestSearch()
      }
    })
  }

  typeInSearchBar = (text, clear = true) => {
    this.routeTestSearch()
    if (clear) this.clearTextSearchBar()
    this.getKeywordsSearchBar()
      .find('input')
      .type(`${text}{enter}`, { force: true })
    this.waitForTestSearch()
  }

  clickAddResourceButton = () =>
    this.getAddResourceDropDown().click({ force: true })

  clickAddWebSiteURLInDropDown = () =>
    this.getAddWebSiteUrl().click({ force: true })

  clickAddYouTubeVideoInDropDown = () =>
    this.getAddYouTubeVideo().click({ force: true })

  clickAddLTIResource = () => this.getAddLTIResource().click({ force: true })

  setInformationInAddResourcePopUp = ({ title, desc, url }) => {
    this.getEnterTitleInAddResource().type(title, { force: true })
    this.getEnterDescriptionInAddResource().type(desc, { force: true })
    this.getEnterURLInAddResource().type(url, { force: true })
  }

  clickAddResourceInPopUp = () => {
    cy.server()
    cy.route('POST', '**/resources').as('add-resource')
    this.getAddResourceButtonInPopUp().click({ force: true })
    return cy.wait('@add-resource').then((xhr) => {
      expect(
        xhr.status,
        `addinng resource ${xhr.status === 200 ? 'success' : 'failed'}`
      ).to.eq(200)
      return xhr.response.body.result._id
    })
  }

  clickOnTestTab = () => {
    this.getTestTab().then(($ele) => {
      if ($ele.css('color') === queColor.GREEN_2) {
        this.routeTestSearch()
        cy.wrap($ele).click({ force: true })
        this.waitForTestSearch()
      }
    })
  }

  clickOnResourceTab = () => {
    this.getResourceTab().then(($ele) => {
      if ($ele.css('color') === queColor.GREEN_2) {
        this.routeTestSearch()
        cy.wrap($ele).click({ force: true })
        this.waitForResource()
      }
    })
  }

  /* ACTIONS END */

  /* APP HELPERS */
  routeTestSearch = () => {
    cy.server()
    cy.route('POST', '**/search/tests').as('search-container-tests')
    cy.route('GET', '**/resources').as('search-container-resources')
  }

  verifyStandardsByTestInSearch = (id, standard) =>
    this.getTestInSearchResultsById(id)
      .find(`[title="${standard}"]`)
      .should('be.visible')

  setFilters = ({
    collection,
    authoredByme,
    SharedWithMe,
    entireLibrary,
    grade,
    subject,
    status,
  }) => {
    this.routeTestSearch()
    this.clearTextSearchBar()
    this.clickOnTestFilter()
    this.clearDropDowns()
    if (collection) this.setCollection(collection)
    if (authoredByme) this.clickOnAuthoredbyMeFolder()
    if (SharedWithMe) this.clickOnSharedWithMe()
    if (entireLibrary) this.clickOnEntireLibrary()
    if (grade) this.setGrade(grade)
    if (subject) this.setSubject(subject)
    if (status) this.setStatus(status)
    this.clickOnTestFilter()
    this.waitForTestSearch()
  }

  waitForTestSearch = () => cy.wait('@search-container-tests')

  waitForResource = () => cy.wait('@search-container-resources')
}
