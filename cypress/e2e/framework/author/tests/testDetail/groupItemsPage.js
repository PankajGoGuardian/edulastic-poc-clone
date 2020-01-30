import CypressHelper from "../../../util/cypressHelpers";
import TestLibrary from "../testLibraryPage";
import TestAddItemTab from "./testAddItemTab";

export default class GroupItemsPage {
  constructor() {
    this.testLibraryPage = new TestLibrary();
    this.addItems = new TestAddItemTab();
  }

  clickOnAddGroup = () => cy.get('[data-cy="add-group"]').click();

  clickOnDone = () => cy.get('[data-cy="done"]').click();

  // auto select

  getAutoSelectItemForGroup = group => cy.get(`[data-cy="autoselect-Group ${group}"]`);

  checkAutoSelectForGroup = (group, overiding = false) => {
    this.getAutoSelectItemForGroup(group).check({ force: true });
    if (overiding) cy.get('[data-cy="overRide"]').click();
  };

  uncheckAutoSelectForGroup = group => this.getAutoSelectItemForGroup(group).uncheck();

  // question delievery
  checkDeliverAllItemForGroup = group => cy.get(`[data-cy="check-deliver-all-Group ${group}"]`).check();

  checkDeliverCountForGroup = group => cy.get(`[data-cy="check-deliver-bycount-Group ${group}"]`).check();

  setItemCountForDeliveryByGroup = (group, count) =>
    cy.get(`[data-cy="input-deliver-bycount-Group ${group}"]`).type(`{selectall}${count}`);

  // filters
  setFilterForGroup = (group, { collection, standard, dok, tags, difficulty, count }) => {
    if (collection) CypressHelper.selectDropDownByAttribute("collection", collection);
    if (standard) CypressHelper.selectDropDownByAttribute("standard", standard);
    if (dok) CypressHelper.selectDropDownByAttribute("dok", dok);
    if (tags) CypressHelper.selectDropDownByAttribute("tags", tags);
    if (difficulty) CypressHelper.selectDropDownByAttribute("difficulty", difficulty);
    if (count) cy.get(`data-cy="count-${group}"`);
  };

  getItemContainerForGroup = group => cy.get(`[data-cy="item-container-Group ${group}"]`);

  verifyPresentItemInContainer = (group, item) =>
    this.getItemContainerForGroup(group).should("contain", CypressHelper.getShortId(item));

  verifyNoItemInContainer = (group, item) =>
    this.getItemContainerForGroup(group).should("not.contain", CypressHelper.getShortId(item));

  getCountOfItemsInGroup = group => this.getItemContainerForGroup(group).find("span");

  verifyNoOfGroups = count => cy.get("[data-cy^=item-container]").should("have.length", count);

  clickSelectItemsForGroupByNo = group => {
    cy.server();
    cy.route("POST", "**/search/**").as("search");
    this.getItemContainerForGroup(group)
      .next()
      .click();
    return cy.wait("@search");
  };

  clickOnEditByGroup = group =>
    cy
      .get('[title="Edit"]')
      .eq(group - 1)
      .click();

  clickOnSaveByGroup = (group, dynamicGroup = false) => {
    cy.route("POST", "**/testitem/auto-select/search").as("waitForItems");
    cy.get(`[data-cy="save-Group ${group}"]`).click();
    if (dynamicGroup) cy.wait("@waitForItems");
    cy.wait(500);
  };

  clickOnCollectionByGroup = group => cy.get(`[data-cy="collection-Group ${group}"]`).click();

  selectCollectionByGroupAndCollection = (group, collection) => {
    this.clickOnCollectionByGroup(group);
    cy.get(".ant-select-dropdown-menu-item")
      .contains(collection)
      .click();
  };

  clickBrowseOnStandardsByGroup = group => cy.get(`[data-cy="standard-Group ${group}"]`).click();

  // ======Below methods are for standard selection in pop-up of autoselect item group

  checkstandardsByName = standards => cy.get(`[data-cy="${standards}"]`).check({ force: true });

  selectSubject = subject => CypressHelper.selectDropDownByAttribute("subject-Select", subject);

  selectStandardSet = standardSet => CypressHelper.selectDropDownByAttribute("standardSet-Select", standardSet);

  selectGrade = grade => {
    this.clearAllGrades();
    grade.forEach(element => {
      CypressHelper.selectDropDownByAttribute("grade-Select", element);
    });
  };

  clearAllGrades = () =>
    cy
      .get('[data-cy="grade-Select"]')
      .find('[data-icon="close"]')
      .click({ multiple: true });

  selectStandardsBySubGradeStandardSet = (subject, Grade, standardSet, standards) => {
    if (subject) this.selectSubject(subject);
    if (standardSet) this.selectStandardSet(standardSet);
    if (Grade) this.selectGrade(Grade);
    standards.forEach(standard => this.checkstandardsByName(standard));
  };

  clickOnApply = () => cy.get('[data-cy="apply-Stand-Set"]').click();

  // =========Till Here=======================

  assertNoItemsFoundWarning = () =>
    cy.get(".ant-message").should("contain", "No test items found for current combination of filters");

  addItemsToGroup = (itemIds, newTest = true, group = false) => {
    let testID;
    cy.server();
    cy.route("POST", "**api/test").as("createTest");
    this.testLibraryPage.testSummary.header.clickOnAddItems();
    itemIds.forEach((item, index) => {
      this.addItems.searchFilters.clearAll();
      this.addItems.searchFilters.getAuthoredByMe();
      if (!group) this.addItems.addItemById(item);
      else this.addItems.addItemByIdByGroup(group, item);
      if (index === 0 && newTest === true) {
        cy.wait("@createTest").then(xhr => {
          this.testLibraryPage.saveTestId(xhr);
          testID = xhr.response.body.result._id;
        });
        cy.wait(500);
      }
    });
    return cy.wait(1000).then(() => testID);
  };
}
