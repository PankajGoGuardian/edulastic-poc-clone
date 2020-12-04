/* eslint-disable no-loop-func */
import TeacherSideBar from '../SideBarPage'
import SearchFilters from '../searchFiltersPage'
import TestSummayTab from '../tests/testDetail/testSummaryTab'
import PlayListHeader from './playListHeader'
import PlayListReview from './playListReview'
import CypressHelper from '../../util/cypressHelpers'
import PlaylistCustom from './playListCustomizationPage'
import PlayListAssign from './playListAssignPage'

const { _ } = Cypress
export default class PlayListLibrary {
  constructor() {
    this.sidebar = new TeacherSideBar()
    this.searchFilter = new SearchFilters()
    this.playListSummary = new TestSummayTab()
    this.header = new PlayListHeader()
    this.reviewTab = new PlayListReview()
    this.playlistCustom = new PlaylistCustom()
    this.playListAssign = new PlayListAssign()
  }

  // *** ELEMENTS START ***

  getPlayListCardById = (testId) =>
    cy.get(`[data-cy="${testId}"]`).as('testcard')

  // TODO: move this to plalist setting once all settings are appearing on UI
  getCustomizationSwitch = () => cy.get('[data-cy="customization"]')

  getPlaylistDropSearch = () => cy.get('[data-cy="drop-playlist-search"]')

  getDropByClass = () => cy.get('[value="byClass"]')

  getDropByStudent = () => cy.get('[value="byStudent"]')

  getDoneDropPlaylist = () => cy.get('[data-cy="done-drop-playlist"]')

  getRemoveDropByName = (name) => cy.get(`[data-cy="remove-${name}"]`)

  getPLaylistLibraryTitle = () => cy.get('[title="Playlist"]')

  getEnterPlaylistDescription = () =>
    cy
      .get('[id="froalaToolbarContainer-playlist-description"]')
      .parent()
      .find('[contenteditable="true"]')

  getDescriptionOnPlaylistCardById = (id) =>
    this.getPlayListCardById(id).find('[data-cy="styled-wrapped-component"]')

  // *** ELEMENTS END ***
  // *** ACTIONS START ***

  checkDropByClass = () => this.getDropByClass().check({ force: true })

  checkDropByStudent = () => this.getDropByStudent().check({ force: true })

  clickRemoveDropByName = (name) =>
    this.getRemoveDropByName(name.trim()).click()

  clickDoneDropPlaylist = () => {
    cy.server()
    cy.route('POST', '**/user-playlist-activity/').as('doneDropPlaylist')
    this.getDoneDropPlaylist().click()
    cy.wait('@doneDropPlaylist')
  }

  clickOnNewPlayList = () => cy.get('[data-cy="createNew"]').click()

  clickOnPlayListCardById = (testId) => {
    cy.server()
    cy.route('GET', '**/playlists/*').as('playListLoad')
    this.getPlayListCardById(testId)
      .find('[data-cy="test-title"]')
      .should((ele) => expect(Cypress.dom.isAttached(ele)).to.be.true)
      .click()
    cy.wait('@playListLoad')
  }

  setCustomization = (enable = true) =>
    this.getCustomizationSwitch().then((button) => {
      if (enable) {
        if (!button.hasClass('.ant-switch-checked')) cy.wrap(button).click()
      } else if (button.hasClass('.ant-switch-checked')) cy.wrap(button).click()
    })

  clickOnCloneOnCardByPlaylistId = (id) => {
    cy.server()
    cy.route('POST', /duplicate/g).as('duplicate-playlist-in-library')
    this.getPlayListCardById(id)
      .find('.ant-card-head-title')
      .trigger('mouseover')
    cy.get('@testcard').find('button').contains('clone').click({ force: true })
    return cy.wait('@duplicate-playlist-in-library').then((xhr) => {
      cy.saveplayListDetailToDelete(xhr.response.body.result._id)
      return cy.wait(1).then(() => xhr.response.body.result._id)
    })
  }

  setPlaylistDescription = (desc) =>
    this.getEnterPlaylistDescription().type(desc, { force: true })

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifyCustomization = (playlistid) => {
    return this.header.clickOnCustomization().then((xhr) => {
      expect(xhr.status).to.eq(200)
      expect(xhr.response.body.result._id).to.not.eq(playlistid)
      cy.saveplayListDetailToDelete(xhr.response.body.result._id)
      return cy.wait(1).then(() => xhr.response.body.result._id)
    })
  }

  verifyEditPermission = (playlistid) => {
    this.header.clickOnEdit().then((xhr) => {
      expect(xhr.response.body.result._id).to.eq(playlistid)
      this.header.clickOnPublish()
    })
  }

  verifyViewOnlyPermission = () => {
    this.header.getEdit().should('not.exist')
  }

  checkforNonExistanceOfPlayList = (playlistid) =>
    cy.get('body').should('not.have.descendants', `[data-cy="${playlistid}"]`)

  searchPlaylistById = (id, draft = false) => {
    this.sidebar.clickOnPlayListLibrary()
    this.searchFilter.clearAll()
    if (draft) this.searchFilter.getAuthoredByMe()
    this.searchFilter.typeInSearchBox(id)
  }

  seachAndClickPlayListById = (id, draft = false) => {
    this.searchPlaylistById(id, draft)
    this.clickOnPlayListCardById(id)
  }

  getPlayListAndClickOnUseThisById = (id) => {
    this.seachAndClickPlayListById(id)
    this.header.clickOnUseThis()
  }

  searchByCollection = (collection) => {
    this.sidebar.clickOnPlayListLibrary()
    this.searchFilter.clearAll()
    this.searchFilter.setCollection(collection)
  }

  createPlayList = (playListData, NoOfModules = 1) => {
    const { name, grade, subject, tags, collection, description } = playListData
    let playlistid
    this.sidebar.clickOnPlayListLibrary()
    this.clickOnNewPlayList()
    this.playListSummary.setName(name)
    this.playListSummary.selectGrade(grade, true)
    this.playListSummary.selectSubject(subject, true)
    if (playListData.tags) this.playListSummary.addTags(tags, true)
    if (playListData.collection)
      this.playListSummary.selectCollection(collection, true)
    if (playListData.description) this.setPlaylistDescription(description)

    this.header.clickOnReview(true)
    this.reviewTab.clickOpenCustomizationTab()
    for (let i = 1; i <= NoOfModules; i++) {
      this.reviewTab.clickAddNewModule()
      this.reviewTab.setModuleDetails(
        `module-${i}`,
        `m${i}`,
        `module-group-${i}`
      )
      if (i === 1)
        this.reviewTab.addModule(true).then((id) => {
          playlistid = id
        })
      else this.reviewTab.addModule()
    }
    return cy.wait(1).then(() => playlistid)
  }

  createPlayListWithTests = (playListData) =>
    this.createPlayList(
      playListData.metadata,
      _.keys(playListData.moduledata).length
    ).then((id) => {
      /* const playListData = {
      metadata: {
        name: "Play List",
        grade: "Grade 10",
        subject: "Social Studies"
      },
      moduledata: {
        module1:[...testids],
        module2:[...testids]
      }
    }; */
      this.reviewTab.searchContainer.setFilters({
        subject: 'Mathematics',
        authoredByme: true,
      })
      _.values(playListData.moduledata).forEach((tests, mod) => {
        tests.forEach((test) => {
          this.reviewTab.dragTestFromSearchToModule(mod + 1, test)
        })
      })
      return this.header.clickOnPublish().then(() => id)
    })

  clickDropDownByClass = (text) => {
    this.checkDropByClass()
    CypressHelper.selectDropDownByAttribute('selectClass', text)
  }

  searchAndClickOnDropDownByClass = (text) => {
    cy.server()
    cy.route('POST', '**/search/student').as('search-students')
    this.clickDropDownByClass(text)
    cy.wait('@search-students')
  }

  searchAndClickOnDropDownByStudent = (name) => {
    this.checkDropByStudent()
    CypressHelper.selectDropDownByAttribute('selectStudent', name)
  }

  verifyDescriptionOnPlaylistById = (id, desc) =>
    this.getDescriptionOnPlaylistCardById(id).should('have.text', desc)
  // *** APPHELPERS END ***
}
