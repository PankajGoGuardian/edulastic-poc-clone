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
    });
    return cy.wait(3000).then(() => testID);
    // GET 200 /api/test/default-thumbnail?subject=Other this is triggering for indefinate numbers
    // so the wait is
  };

  getItemDeliverySeq = (deliveredItemGroups, groups, deliveryType, deliveryCount) => {
    const deliveredGroup = {};
    let deliveredArray = [];
    let OriginalArray = [];

    deliveredItemGroups.forEach((gArray, ind) => {
      // eslint-disable-next-line no-prototype-builtins
      if (!deliveredGroup.hasOwnProperty(`group${ind + 1}`)) deliveredGroup[`group${ind + 1}`] = [];
      gArray.items.forEach(itemObj => {
        deliveredGroup[`group${ind + 1}`].push(itemObj._id);
        expect(
          itemObj._id,
          `Expected item-${itemObj._id} should be part of group-${ind + 1}-[${groups[ind]}]`
        ).to.be.oneOf(groups[`GROUP${ind + 1}`]);
      });

      deliveredArray = [...deliveredArray, ...deliveredGroup[Cypress._.keys(deliveredGroup)[ind]]];
      OriginalArray = [...OriginalArray, ...groups[Cypress._.keys(groups)[ind]]];
    });

    switch (deliveryType) {
      // Static + all
      case "ALL":
        CypressHelper.checkObjectEquality(deliveredArray, OriginalArray);
        break;
      // Static + all + shuffle
      case "ALL_SHUFFLE":
        CypressHelper.checkObjectInEquality(deliveredArray, OriginalArray);
        expect(deliveredArray.length).to.eq(deliveryCount);
        break;
      // Auto + count
      // Static + count
      case "ALL_RANDOM":
      case "LIMITED_RANDOM":
        CypressHelper.checkObjectInEquality(deliveredArray, OriginalArray.slice(deliveryCount + 1));
        expect(deliveredArray.length).to.eq(deliveryCount);
        break;
      default:
    }
    return deliveredArray;
  };
}
