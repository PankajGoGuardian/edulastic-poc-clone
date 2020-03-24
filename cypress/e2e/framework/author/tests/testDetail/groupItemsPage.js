import CypressHelper from "../../../util/cypressHelpers";
import TestLibrary from "../testLibraryPage";
import TestAddItemTab from "./testAddItemTab";
import { deliverType } from "../../../constants/questionTypes";

export default class GroupItemsPage {
  constructor() {
    this.testLibraryPage = new TestLibrary();
    this.addItems = new TestAddItemTab();
  }

  // *** ELEMENTS START ***

  getAutoSelectItemForGroup = group => cy.get(`[data-cy="autoselect-Group ${group}"]`);

  getItemContainerForGroup = group => cy.get(`[data-cy="item-container-Group ${group}"]`);

  getCountOfItemsInGroup = group => this.getItemContainerForGroup(group).find("span");

  getGroupContainerByGroup = group => cy.get(".ant-collapse-item").eq(group - 1);

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnAddGroup = () => cy.get('[data-cy="add-group"]').click();

  clickOnDone = () => cy.get('[data-cy="done"]').click();

  checkAutoSelectForGroup = (group, overiding = false) => {
    this.getAutoSelectItemForGroup(group).check({ force: true });
    if (overiding) cy.get('[data-cy="overRide"]').click();
  };

  uncheckAutoSelectForGroup = group => this.getAutoSelectItemForGroup(group).uncheck();

  // question delievery
  checkDeliverAllItemForGroup = group => cy.get(`[data-cy="check-deliver-all-Group ${group}"]`).check({ force: true });

  checkDeliverCountForGroup = group =>
    cy.get(`[data-cy="check-deliver-bycount-Group ${group}"]`).check({ force: true });

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
      .click({ force: true });

  clickOnSaveByGroup = (group, dynamicGroup = false, deliveryCount = 1) => {
    cy.server();
    cy.route("POST", "**/testitem/auto-select/search").as("waitForItems");
    cy.get(`[data-cy="save-Group ${group}"]`).click();
    if (dynamicGroup)
      return cy.wait("@waitForItems").then(xhr => {
        expect(xhr.status).to.eq(200);
        expect(xhr.response.body.result.items.length).to.be.at.least(deliveryCount);
        return xhr.response.body.result.items;
      });
    // waiting for search to retrieve items
  };

  clickOnCollectionByGroup = group => cy.get(`[data-cy="collection-Group ${group}"]`).click();

  selectCollectionByGroupAndCollection = (group, collection) => {
    this.clickOnCollectionByGroup(group);
    this.selectOptionByAttrByGroup(group, collection);
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

  setTag = (group, tag) => {
    cy.get('[data-cy="selectTags"]')
      .eq(group - 1)
      .click();
    cy.wait(300);

    this.selectOptionByAttrByGroup(group, tag);
  };

  setDOK = (group, dok) => {
    cy.get('[data-cy="selectDOK"]')
      .eq(group - 1)
      .click();
    cy.wait(300);
    this.selectOptionByAttrByGroup(group, dok);
  };

  setDifficulty = (group, difficulty) => {
    cy.get('[data-cy="selectDifficulty"]')
      .eq(group - 1)
      .click();
    cy.wait(300);
    this.selectOptionByAttrByGroup(group, difficulty);
  };

  selectOptionByAttrByGroup = (group, attr) => {
    cy.get(`[data-cy="Group ${group} ${attr}"]`).click();
  };

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifyPresentItemInContainer = (group, item) =>
    this.getItemContainerForGroup(group).should("contain", CypressHelper.getShortId(item));

  verifyNoItemInContainer = (group, item) =>
    this.getItemContainerForGroup(group).should("not.contain", CypressHelper.getShortId(item));

  verifyNoOfGroups = count => cy.get("[data-cy^=item-container]").should("have.length", count);

  createDynamicTest = (group = 1, filterForAutoselect, overRide = false) => {
    const { standard, collection, deliveryCount, dok, tags, difficulty } = filterForAutoselect;
    const { subject, grade, standardSet, standardsToSelect } = standard;
    this.clickOnEditByGroup(group);
    if (overRide) this.checkAutoSelectForGroup(group, true);
    else this.checkAutoSelectForGroup(group);
    this.clickBrowseOnStandardsByGroup(group);
    this.selectStandardsBySubGradeStandardSet(subject, grade, standardSet, standardsToSelect);
    this.clickOnApply();
    if (dok) this.setDOK(group, dok);
    if (difficulty) this.setDifficulty(group, difficulty);
    if (tags) this.setTag(group, tags);
    this.selectCollectionByGroupAndCollection(group, collection);
    this.setItemCountForDeliveryByGroup(group, deliveryCount);
    return cy.wait(1).then(() => this.clickOnSaveByGroup(group, true, deliveryCount));
  };

  assertNoItemsFoundWarning = () =>
    cy.get(".ant-message").should("contain", "No test items found for current combination of filters");

  addItemsToGroup = (itemIds, newTest = true, group = false) => {
    let testID;
    cy.server();
    cy.route("POST", "**api/test").as("createTest");
    cy.route("GET", /.*default-thumbnail?.*/).as("addItem");
    this.testLibraryPage.testSummary.header.clickOnAddItems();
    this.addItems.searchFilters.clearAll();
    this.addItems.searchFilters.getAuthoredByMe();
    itemIds.forEach((item, index) => {
      if (!group) this.addItems.addItemById(item);
      else this.addItems.addItemByIdByGroup(group, item);
      // cy.wait("@addItem");
      if (index === 0 && newTest === true) {
        cy.wait("@createTest").then(xhr => {
          this.testLibraryPage.saveTestId(xhr);
          testID = xhr.response.body.result._id;
        });
        cy.wait(500);
      }
    });
    return cy.wait(1).then(() => testID);
  };

  getItemDeliverySeq = (deliveredItemGroups, groups, shuffle = false) => {
    const deliveredGroup = {};
    let deliveredArray = [];
    let deliverTypeAtStudentSide = [];

    deliveredItemGroups.forEach((gArray, ind) => {
      deliverTypeAtStudentSide.push(gArray.deliveryType);
      // eslint-disable-next-line no-prototype-builtins
      if (!deliveredGroup.hasOwnProperty(ind + 1)) deliveredGroup[ind + 1] = [];
      expect(gArray.deliveryType).to.eq(groups[ind + 1].deliverType);
      gArray.items.forEach(itemObj => {
        deliveredGroup[ind + 1].push(itemObj._id);
        expect(itemObj._id, `Expected item-${itemObj._id} should be part of group-${ind + 1}`).to.be.oneOf(
          groups[ind + 1].items
        );
      });

      deliveredArray = [...deliveredArray, ...deliveredGroup[Cypress._.keys(deliveredGroup)[ind]]];
    });

    deliverTypeAtStudentSide.forEach((type, ind) => {
      switch (type) {
        case deliverType.ALL:
          if (shuffle === false) CypressHelper.checkObjectEquality(deliveredGroup[ind + 1], groups[ind + 1].items);
          else {
            if (!groups[ind + 1].items.length === 1)
              CypressHelper.checkObjectInEquality(deliveredGroup[ind + 1], groups[ind + 1].items);
            expect(deliveredGroup[ind + 1].length).to.eq(groups[ind + 1].deliveryCount);
          }
          break;
        case deliverType.LIMITED_RANDOM:
        case deliverType.ALL_RANDOM:
          if (!groups[ind + 1].items.length === 1)
            CypressHelper.checkObjectInEquality(deliveredGroup[ind + 1], groups[ind + 1].items);
          expect(deliveredGroup[ind + 1].length).to.eq(groups[ind + 1].deliveryCount);
          break;
        default:
          assert.fail(`Unexpected delivery type of group-${ind + 1}-${type}`);
          break;
      }
    });
    return deliveredArray;
  };

  // *** APPHELPERS END ***
}
