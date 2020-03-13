import TeacherSideBar from "../SideBarPage";
import SearchFilters from "../searchFiltersPage";
import TestSummayTab from "../tests/testDetail/testSummaryTab";
import PlayListHeader from "./playListHeader";
import PlayListAddTest from "./playListAddTestTab";
import PlayListReview from "./playListReview";
import CypressHelper from "../../util/cypressHelpers";

export default class PlayListLibrary {
  constructor() {
    this.sidebar = new TeacherSideBar();
    this.searchFilter = new SearchFilters();
    this.playListSummary = new TestSummayTab();
    this.header = new PlayListHeader();
    this.addTestTab = new PlayListAddTest();
    this.reviewTab = new PlayListReview();
  }

  // *** ELEMENTS START ***

  getPlayListCardById = testId => cy.get(`[data-cy="${testId}"]`).as("testcard");

  //TODO: move this to plalist setting once all settings are appearing on UI
  getCustomizationSwitch = () => cy.get('[data-cy="customization"]');

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnNewPlayList = () => cy.get('[data-cy="createNew"]').click();

  clickOnPlayListCardById = testId => {
    cy.server();
    cy.route("GET", "**/playlists/*").as("playListLoad");
    this.getPlayListCardById(testId).click();
    cy.wait("@playListLoad");
  };

  setCustomization = (enable = true) =>
    this.getCustomizationSwitch().then(button => {
      if (enable) {
        if (!button.hasClass(".ant-switch-checked")) cy.wrap(button).click();
      } else {
        if (button.hasClass(".ant-switch-checked")) cy.wrap(button).click();
      }
    });

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifyCustomization = playlistid => {
    return this.header.clickOnCustomization().then(xhr => {
      expect(xhr.status).to.eq(200);
      expect(xhr.response.body.result._id).to.not.eq(playlistid);
      cy.saveplayListDetailToDelete(xhr.response.body.result._id);
      return cy.wait(1).then(() => xhr.response.body.result._id);
    });
  };

  verifyEditPermission = playlistid => {
    this.header.clickOnEdit().then(xhr => {
      expect(xhr.response.body.result._id).to.eq(playlistid);
      this.header.clickOnPublish();
    });
  };

  verifyViewOnlyPermission = () => {
    this.header.getEdit().should("not.exist");
  };

  checkforNonExistanceOfPlayList = playlistid =>
    cy.get("body").should("not.have.descendants", `[data-cy="${playlistid}"]`);

  seachAndClickPlayListById = id => {
    this.sidebar.clickOnPlayListLibrary();
    this.searchFilter.clearAll();
    this.searchFilter.typeInSearchBox(id);
    this.clickOnPlayListCardById(id);
  };

  getPlayListAndClickOnUseThisById = id => {
    this.seachAndClickPlayListById(id);
    this.header.clickOnUseThis();
  };

  searchByCollection = collection => {
    this.sidebar.clickOnPlayListLibrary();
    this.searchFilter.clearAll();
    this.searchFilter.setCollection(collection);
  };

  createPlayList = (playListData, NoOfModules = 1) => {
    this.sidebar.clickOnPlayListLibrary();
    this.clickOnNewPlayList();
    this.playListSummary.setName(playListData.name);
    this.playListSummary.selectGrade(playListData.grade, true);
    this.playListSummary.selectSubject(playListData.subject, true);

    this.header.clickOnAddTests();
    this.addTestTab.clickOnManageModule();

    for (let i = 0; i < NoOfModules; i++) {
      this.addTestTab.clickOnAddModule();
      this.addTestTab.setModuleName(i + 1, `module-${i + 1}`);
      this.addTestTab.clickOnSaveByModule(i + 1);
    }

    return this.addTestTab.clickOnDone(true);
  };

  searchAndClickOnDropDownByClass = text => {
    cy.server();
    cy.route("POST", "**/search/student").as("search-students");
    CypressHelper.selectDropDownByAttribute("selectClass", text);
    cy.wait("@search-students");
  };

  searchAndClickOnDropDownByStudent = (name, clas) => {
    CypressHelper.selectDropDownByAttribute("selectStudent", name);
  };
  // *** APPHELPERS END ***
}
