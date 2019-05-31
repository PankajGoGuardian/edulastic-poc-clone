import promisify from "cypress-promise";
import ItemListPage from "../itemList/itemListPage";
import TeacherSideBar from "../SideBarPage";
import TestSummary from "./testDetail/testSummaryTab";
import TestAddItem from "./testDetail/testAddItemTab";
import SearchFilters from "../searchFiltersPage";
import TestHeader from "./testDetail/header";
import TestAssignPage from "./testDetail/testAssignPage";

export default class TestLibrary {
  constructor() {
    this.sidebar = new TeacherSideBar();
    this.items = [];
    this.searchFilters = new SearchFilters();
    this.header = new TestHeader();
    this.assignPage = new TestAssignPage();
  }

  clickOnNewAssignment = () => {
    cy.get("button")
      .contains("Author Test")
      .click();
  };

  createTest = (key = "default") => {
    const testSummary = new TestSummary();
    const testAddItem = new TestAddItem();
    const itemListPage = new ItemListPage();

    return cy.fixture("testAuthoring").then(testData => {
      const test = testData[key];
      test.itemKeys.forEach(async (itemKey, index) => {
        itemListPage.createItem(itemKey, index);
        const itemId = await promisify(cy.url().then(url => url.split("/").reverse()[1]));
        this.items.push(itemId);
      });

      // create new test
      this.sidebar.clickOnTestLibrary();
      this.clickOnNewAssignment();

      // test description
      if (test.name) testSummary.setName(test.name);
      if (test.grade) {
        test.grade.forEach(grade => {
          testSummary.selectGrade(grade);
        });
      }
      if (test.subject) {
        test.subject.forEach(subject => {
          testSummary.selectSubject(subject);
        });
      }

      // add items
      testSummary.header.clickOnAddItems();
      testAddItem.authoredByMe().then(() => {
        this.items.forEach(itemKey => {
          testAddItem.addItemById(itemKey);
        });
      });

      // save
      testSummary.header.clickOnSaveButton();
      // publish
      testSummary.header.clickOnPublishButton();

      return cy.url().then(url => url.split("/").reverse()[0]);
    });
  };

  getTestCardById = testId => cy.get(`[data-cy="${testId}"]`).as("testcard");

  getShortId = testId => testId.substr(testId.length - 5);

  clickOnEditTestById = testId => {
    cy.server();
    cy.route("GET", "**/content-sharing/**").as("testload");
    this.getTestCardById(testId);
    cy.get("@testcard")
      .find(".showHover")
      .invoke("show")
      .contains("button", "Edit")
      .click({ force: true })
      .then(() => {
        cy.wait("@testload");
        cy.wait("@testload");
      });
  };

  verifyVersionedURL = (oldTestId, newTestId) =>
    // URL changes after ~4 sec after API response, could not watch this event, hence wait
    cy.wait(5000).then(() =>
      cy.url().then(newUrl => {
        expect(newUrl).to.include(`tests/${newTestId}/versioned/old/${oldTestId}`);
      })
    );
}
