import CypressHelper from "../../../util/cypressHelpers";
import TestLibrary from "../testLibraryPage";
import TestAddItemTab from "./testAddItemTab";
import { deliverType } from "../../../constants/questionTypes";

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
      .click({ force: true });

  clickOnSaveByGroup = (group, dynamicGroup = false) => {
    cy.server();
    cy.route("POST", "**/testitem/auto-select/search").as("waitForItems");
    cy.get(`[data-cy="save-Group ${group}"]`).click();
    if (dynamicGroup)
      cy.wait("@waitForItems").then(xhr => {
        expect(xhr.status).to.eq(200);
      });
    cy.wait(2000); // waiting for search to retrieve items
  };

  getGroupContainerByGroup = group => cy.get(".ant-collapse-item").eq(group - 1);

  clickOnCollectionByGroup = group => cy.get(`[data-cy="collection-Group ${group}"]`).click();

  selectCollectionByGroupAndCollection = (group, collection) => {
    this.clickOnCollectionByGroup(group);
    this.getGroupContainerByGroup(group)
      .find(".ant-select-dropdown-menu-item")
      .contains(collection)
      .click({ force: true });
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

  createDynamicTest = (group, filterForAutoselect, overRide = false) => {
    const { standard, collection, deliveryCount, dok, tags, difficulty } = filterForAutoselect;
    const { subject, grade, standardSet, standardsToSelect } = standard;
    this.clickOnEditByGroup(group);
    if (overRide) this.checkAutoSelectForGroup(group, true);
    else this.checkAutoSelectForGroup(group);
    this.clickBrowseOnStandardsByGroup(group);
    this.selectStandardsBySubGradeStandardSet(subject, grade, standardSet, standardsToSelect);
    this.clickOnApply();
    this.selectCollectionByGroupAndCollection(group, collection);
    if (dok) this.setDOK(dok);
    if (difficulty) this.setDifficulty(difficulty);
    if (tags) this.setTag(tags);
    this.setItemCountForDeliveryByGroup(group, deliveryCount);
    this.clickOnSaveByGroup(group, true);
  };
  // =========Till Here=======================

  assertNoItemsFoundWarning = () =>
    cy.get(".ant-message").should("contain", "No test items found for current combination of filters");

  addItemsToGroup = (itemIds, newTest = true, group = false) => {
    let testID;
    cy.server();
    cy.route("POST", "**api/test").as("createTest");
    this.testLibraryPage.testSummary.header.clickOnAddItems();
    this.addItems.searchFilters.clearAll();
    this.addItems.searchFilters.getAuthoredByMe();
    itemIds.forEach((item, index) => {
      if (!group) this.addItems.addItemById(item);
      else this.addItems.addItemByIdByGroup(group, item);
      if (index === 0 && newTest === true) {
        cy.wait("@createTest").then(xhr => {
          this.testLibraryPage.saveTestId(xhr);
          testID = xhr.response.body.result._id;
        });
        cy.wait(500);
      }
      cy.wait(100);
    });
    return cy.wait(2000).then(() => testID);
    // GET 200 /api/test/default-thumbnail?subject=Other this is triggering for indefinate numbers
    // so the wait is
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
          assert.fail(`Unexpected delivery type of group-${ind + 1}-${type}`); //
          break;
      }
    });
    return deliveredArray;
  };

  setTag = tag => {
    CypressHelper.selectDropDownByAttribute("selectTags", tag);
    cy.focused().blur(); // de-focus dropdown select
  };

  setDOK = dok => {
    // CypressHelper.selectDropDownByAttribute("selectDOK", DOK);
    // cy.focused().blur();
    cy.get('[data-cy="selectDOK"]').click();
    cy.get(".ant-select-dropdown-menu-item")
      .contains(dok)
      .click({ force: true });
  };

  setDifficulty = difficulty => {
    CypressHelper.selectDropDownByAttribute("selectDifficulty", difficulty);
    cy.focused().blur();
  };
}
