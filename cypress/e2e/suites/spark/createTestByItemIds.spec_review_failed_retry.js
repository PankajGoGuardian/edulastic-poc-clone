import ItemListPage from "../../framework/author/itemList/itemListPage";
import TestLibrary from "../../framework/author/tests/testLibraryPage";
import FileHelper from "../../framework/util/fileHelper";

const { tests } = require("../../../fixtures/spark/spark_test_processed_complete_review_1.json");

const testCreationLogs = "cypress/fixtures/spark/spark_test_processed_review_failed_retry.json";

const testLibrary = new TestLibrary();
const itemListPage = new ItemListPage();
const userId = "5e3273dc5f78c300083420c1";
const subject = "Mathematics";
const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTMyNzNkYzVmNzhjMzAwMDgzNDIwYzEiLCJyb2xlIjoidGVhY2hlciIsImRpc3RyaWN0SWQiOiI1ZTMyNzRhYzBmYjYyMjAwMDhmZTI2ZGQiLCJpYXQiOjE1OTE5MzM4MzksImV4cCI6MTU5MzE0MzQzOX0.IjisU2OGuLyKJKZXaZ9oqH-DajJ7cqFP0qPnAZNs2mM";

/* const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTMyNzNkYzVmNzhjMzAwMDgzNDIwYzEiLCJyb2xlIjoidGVhY2hlciIsImRpc3RyaWN0SWQiOiI1ZTMyNzRhYzBmYjYyMjAwMDhmZTI2ZGQiLCJpYXQiOjE1OTE4NzA5MTIsImV4cCI6MTU5NDQ2MjkxMn0.pRr8gIXH0pBSljZXRuxqQd6ZOFK2vom0FuzKz3ty-TE";
 */
describe(`${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  before(() => {
    // cy.writeFile(testCreationLogs, {});
  });

  beforeEach("set routes", () => {
    cy.server();
    cy.route("POST", "**api/test").as("createTest");
    cy.route("POST", "**/search/tests").as("searchTest");
  });

  tests.forEach((testDetail, i) => {
    if (testDetail.reviewStatus === "failed") {
      Object.keys(testDetail).map(k => (testDetail[k] = ("" + testDetail[k]).trim()));
      const {
        // authToken,
        // userId,
        testName,
        description,
        grades,
        // subject,
        collections,
        tags,
        itemIds,
        testType,
        Sl_No
      } = testDetail;
      console.log("testDetail", JSON.stringify(testDetail));
      console.log("grades", grades);
      const allGrades = grades.split(",").map(g => g.trim());
      const allTags = tags.split(",").map(t => t.trim());
      const allItems = itemIds
        .trim()
        .split(/\s+/)
        .map(i => i.trim());
      let testId = undefined;
      let status = "failed";
      let itemToSearch = undefined;
      it(`create test- ${Sl_No}-${testName}--${allItems.length}`, () => {
        // setting auth token
        // cy.clearToken(); // clear storage/tokens
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
          // const gradeToSelect = g === "K" ? "Kindergarten" : `Grade ${g}`;
          testLibrary.testSummary.selectGrade(g);
        });
        testLibrary.testSummary.selectSubject(subject);
        testLibrary.testSummary.selectCollection(collections, true);

        testLibrary.testSummary.addTags(allTags);
        cy.wait(500);

        // add items
        testLibrary.header.clickOnAddItems();
        testLibrary.searchFilters.clearAll();

        allItems.forEach((itemId, i) => {
          testLibrary.searchFilters.clearAll().then(() => {
            console.log("current item id - ", itemId);
            itemToSearch = itemId;
            expect(itemId, "verify valid item object id").to.have.length(24);
          });
          // testLibrary.searchFilters.getAuthoredByMe();
          testLibrary.searchFilters.getSearchTextBox().clear({ force: true });
          testLibrary.searchFilters.typeInSearchBox(itemId.substr(itemId.length - 6));
          cy.wait(1000);
          // prod
          cy.get(`[data-cy="${itemId}"]`).click({ force: true });
          cy.wait(2000);

          /*  cy.get('[class*="AddRemoveBtn"]')
            .first()
            .click({ force: true }); */
          if (i == 0) {
            cy.wait("@createTest").then(xhr => {
              testId = xhr.response.body.result._id;
            });
          }
        });
        // testLibrary.header.clickOnSaveButton(true);
        /* 
        if (testType === "Practice") {
          testLibrary.header.clickOnSettings();
          testLibrary.testSettings.setTestType(testType);
        }
 */
        testLibrary.header.clickOnSaveButton(true);
        cy.wait(2000);
        testLibrary.header.clickOnPublishButton();

        /*  .then(id => {
          testId = id;
        }); */
        cy.wait("@search");
        cy.wait(100).then(() => (status = "success"));
      });

      it(`save testId - ${Sl_No}-${testName}--${allItems.length}`, () => {
        cy.readFile(`${testCreationLogs}`).then(json => {
          if (!json.tests) json.tests = [];
          cy.wait(1).then(() => {
            const test = { retryStatus: status, retryTestId: testId, ...testDetail };
            if (status === "failed") test["failedItem"] = itemToSearch;
            json.tests.push(test);
            cy.writeFile(`${testCreationLogs}`, json);
          });
        });
      });
    }
  });
});
