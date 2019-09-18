/* eslint-disable cypress/no-unnecessary-waiting */
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
    this.testSummary = new TestSummary();
    this.testAddItem = new TestAddItem();
  }

  clickOnTileView = () => {
    cy.get('[data-cy="tileView"]').click();
  };

  clickOnListView = () => {
    cy.get('[data-cy="listView"]').click();
  };

  clickOnAuthorTest = () => {
    cy.get("button")
      .contains("Author Test")
      .click()
      .then(() => {
        cy.contains("button", "CREATE TEST").click();
      });
  };

  createTest = (key = "default") => {
    const testSummary = new TestSummary();
    const testAddItem = new TestAddItem();
    const itemListPage = new ItemListPage();

    return cy.fixture("testAuthoring").then(testData => {
      const test = testData[key];
      test.itemKeys.forEach(async (itemKey, index) => {
        const _id = await promisify(itemListPage.createItem(itemKey, index));
        // .then(_id => {
        // const itemId = await promisify(cy.url().then(url => url.split("/").reverse()[1]));
        this.items.push(_id);
        // });
      });

      // create new test
      this.sidebar.clickOnTestLibrary();
      this.clickOnAuthorTest();

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
      this.searchFilters.clearAll();
      cy.route("POST", "**api/test").as("createTest");
      testAddItem.authoredByMe().then(() => {
        this.items.forEach((itemKey, index) => {
          testAddItem.addItemById(itemKey);
          if (index === 0) cy.wait("@createTest");
          cy.wait(500);
        });
      });

      // store gets updated with some delay, if no wait then published test doesn't consist all selected questions
      cy.wait(1000);
      // review
      testSummary.header.clickOnReview();
      // save
      cy.wait(2000);
      testSummary.header.clickOnSaveButton(true);
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

  clickOnAssign = () => {
    cy.route("POST", "**/group/search").as("groups");
    cy.contains("ASSIGN").click({ force: true });
    cy.wait("@groups");
  };

  verifyVersionedURL = (oldTestId, newTestId) =>
    // URL changes after ~4 sec after API response, could not watch this event, hence wait
    cy.wait(5000).then(() =>
      cy.url().then(newUrl => {
        expect(newUrl).to.include(`tests/${newTestId}/versioned/old/${oldTestId}`);
      })
    );

  saveTestId = xhr => {
    assert(xhr.status === 200, "saving test");
    const testId = xhr.response.body.result._id;
    console.log("test created with _id : ", testId);
    cy.saveTestDetailToDelete(testId);
  };
}
