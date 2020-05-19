/* eslint-disable cypress/no-unnecessary-waiting */
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import FileHelper from "../../../../framework/util/fileHelper";

const { SMOKE_2, SMOKE_3, SMOKE_4 } = require("../../../../../fixtures/testAuthoring");

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Test Create Flows`, () => {
  const testLibrary = new TestLibrary();
  const teacher = "teacher.1.testcreate@snapwiz.com";
  const password = "snapwiz";
  const itemListPage = new ItemListPage();
  const existingItems = ["5ec3a0854a5ec60007fbc7fa", "5ec3a0a94a5ec60007fbc7ff"];

  before(() => {
    cy.getAllTestsAndDelete(teacher, password);
    cy.getAllItemsAndDelete(teacher, password, existingItems);
    cy.login("teacher", teacher, password);
  });

  it("create new test with existing questions", () => {
    const testData = SMOKE_2;
    const itemsInTest = [...existingItems];
    // create new test
    testLibrary.sidebar.clickOnTestLibrary();
    testLibrary.clickOnAuthorTest();

    // test description
    if (testData.name) testLibrary.testSummary.setName(testData.name);
    if (testData.grade) {
      testData.grade.forEach(grade => {
        testLibrary.testSummary.selectGrade(grade);
      });
    }
    if (testData.subject) {
      testData.subject.forEach(subject => {
        testLibrary.testSummary.selectSubject(subject);
      });
    }
    // add items
    testLibrary.header.clickOnAddItems();
    testLibrary.searchFilters.clearAll();
    cy.route("POST", "**api/test").as("createTest");
    testLibrary.testAddItem.authoredByMe();

    itemsInTest.forEach((itemId, index) => {
      testLibrary.testAddItem.addItemById(itemId);
      if (index === 0) cy.wait("@createTest").then(xhr => testLibrary.saveTestId(xhr));
      cy.wait(500);
    });

    // verify items on review tab
    testLibrary.header.clickOnReview();

    itemsInTest.forEach(itemId => {
      testLibrary.review.verifyQustionById(itemId);
    });

    // save
    testLibrary.header.clickOnSaveButton(true);

    // publish
    testLibrary.header.clickOnPublishButton();
  });

  it("create new test with new question", () => {
    const testData = SMOKE_3;
    // create new test
    testLibrary.sidebar.clickOnTestLibrary();
    testLibrary.clickOnAuthorTest();

    // test description
    testLibrary.testSummary.setName(testData.name);
    testData.grade.forEach(grd => {
      testLibrary.testSummary.selectGrade(grd);
    });
    testData.subject.forEach(subject => {
      testLibrary.testSummary.selectSubject(subject);
    });

    // create new items
    testLibrary.header.clickOnAddItems();
    testLibrary.searchFilters.routeSearch();

    cy.route("POST", "**api/test").as("createTest");
    testData.itemKeys.forEach(async (itemKey, index) => {
      itemListPage.createItem(itemKey, index, false);
      if (index === 0) cy.wait("@createTest").then(xhr => testLibrary.saveTestId(xhr));
      // Redirect has been changed back to add-item tab in app
      /*  if (index !== testData.itemKeys.length - 1) {
        cy.contains("View as Student").should("be.visible");
        testLibrary.header.clickOnAddItems(); // clicking back to add item since app redirect to review tab
      } */
      testLibrary.searchFilters.waitForSearchResponse();
    });

    // verify newly created added items on review tab
    testLibrary.header.clickOnReview();
    cy.contains("View as Student");
    testData.itemKeys.forEach(itemKey => {
      testLibrary.review.verifyItemByContent(itemKey);
    });

    // save
    testLibrary.header.clickOnSaveButton(true);

    // publish
    testLibrary.header.clickOnPublishButton();
  });

  it("create new test with existing and new question", () => {
    const testData = SMOKE_4;
    // create new test
    testLibrary.sidebar.clickOnTestLibrary();
    testLibrary.clickOnAuthorTest();
    testLibrary.testSummary.setName(testData.name);
    testData.grade.forEach(grade => {
      testLibrary.testSummary.selectGrade(grade);
    });
    testData.subject.forEach(subject => {
      testLibrary.testSummary.selectSubject(subject);
    });

    // add items
    testLibrary.header.clickOnAddItems();
    testLibrary.searchFilters.routeSearch();
    cy.route("POST", "**api/test").as("createTest");
    testLibrary.searchFilters.clearAll();
    testLibrary.testAddItem.authoredByMe();
    // testLibrary.searchFilters.setGrades(testData.grade);
    testData.itemKeys.forEach((itemKey, index) => {
      // add items existing
      if (index < 2) {
        testLibrary.testAddItem.addItemByQuestionContent(itemKey);
        if (index === 0) cy.wait("@createTest").then(xhr => testLibrary.saveTestId(xhr));
        else {
          cy.wait(500);
          testLibrary.header.clickOnSaveButton(true);
        }
      } else {
        // create new items
        itemListPage.createItem(itemKey, index, false); // clicking back to add item since app redirect to review tab // cy.wait("@saveTest");
        // Redirect has been changed back to add-item tab in app
        /*  if (index !== testData.itemKeys.length - 1) {
          cy.contains("View as Student").should("be.visible");
          testLibrary.header.clickOnAddItems();
        } */
        testLibrary.searchFilters.waitForSearchResponse();
      }
      cy.wait(500);
    });

    // verify newly created added items on review tab
    testLibrary.header.clickOnReview();
    cy.contains("View as Student");
    testData.itemKeys.forEach(itemKey => {
      testLibrary.review.verifyItemByContent(itemKey);
    });

    // save
    testLibrary.header.clickOnSaveButton(true);

    // publish
    testLibrary.header.clickOnPublishButton();
  });
});
