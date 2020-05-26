import ItemListPage from "../../framework/author/itemList/itemListPage";
import TestLibrary from "../../framework/author/tests/testLibraryPage";
import FileHelper from "../../framework/util/fileHelper";

const rawTests = require("../../../fixtures/spark/spark_test_details.json");

const testCreationLogs = "spark/spark_test_processed.json";

const testLibrary = new TestLibrary();
const itemListPage = new ItemListPage();
const userId = "5e3273dc5f78c300083420c1";

describe(`${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  before(() => {
    cy.writeFile(testCreationLogs, {});
  });

  beforeEach("set routes", () => {
    cy.server();
    cy.route("POST", "**api/test").as("createTest");
    cy.route("POST", "**/search/tests").as("searchTest");
  });
  rawTests.forEach(testDetail => {
    Object.keys(testDetail).map(k => (testDetail[k] = testDetail[k].trim()));
    const { authToken, userId, testName, description, grades, subject, collections, tags, itemsIds } = testDetail;
    const allGrades = grades.split(",").map(g => g.trim());
    const allTags = tags.split(",").map(t => t.trim());
    const allItems = itemsIds.split(",").map(i => i.trim());
    let testId = undefined;
    let status = "failed";
    let itemToSearch = undefined;
    it(`create test- ${testName}`, () => {
      // setting auth token
      const tokenKey = `user:${userId}:role:teacher`;
      window.localStorage.setItem("defaultTokenKey", tokenKey);
      window.localStorage.setItem(tokenKey, authToken);
      // create new test
      cy.visit("/author/tests");
      cy.wait("@searchTest");

      testLibrary.clickOnAuthorTest();
      // test details
      testLibrary.testSummary.setName(testName);
      testLibrary.testSummary.setDescription(description);
      allGrades.forEach(g => {
        testLibrary.testSummary.selectGrade(g);
      });
      testLibrary.testSummary.selectSubject(subject);
      testLibrary.testSummary.selectCollection(collections, true);

      testLibrary.testSummary.addTags(allTags);

      // add items
      testLibrary.header.clickOnAddItems();
      testLibrary.searchFilters.clearAll();

      allItems.forEach((itemId, i) => {
        console.log("current item id - ", itemId);
        itemToSearch = itemId;
        testLibrary.searchFilters.clearAll();
        testLibrary.searchFilters.getSearchTextBox().clear({ force: true });
        testLibrary.searchFilters.typeInSearchBox(itemId);
        cy.get('[class*="AddRemoveBtn"]')
          .first()
          .click({ force: true });
        if (i == 0) cy.wait("@createTest");
      });
      testLibrary.header.clickOnSaveButton(true).then(id => {
        testId = id;
      });
      cy.wait("@search");
      cy.wait(100).then(() => (status = "success"));
    });

    it(`save testId - ${testName}`, () => {
      cy.readFile(`${testCreationLogs}`).then(json => {
        if (!json.tests) json.tests = [];
        cy.wait(1).then(() => {
          const test = { status, testId, ...testDetail };
          if (status === "failed") test["failedItem"] = itemToSearch;
          json.tests.push(test);
          cy.writeFile(`${testCreationLogs}`, json);
        });
      });
    });
  });
});
