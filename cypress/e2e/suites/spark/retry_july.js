import ItemListPage from "../../framework/author/itemList/itemListPage";
import TestLibrary from "../../framework/author/tests/testLibraryPage";
import FileHelper from "../../framework/util/fileHelper";

const { tests } = require("../../../fixtures/spark/grade_7_final_processed.json");
const testCreationLogs = "cypress/fixtures/spark/grade_7_final_processed_retry.json";
const API_URL = Cypress.config("API_URL");

const testLibrary = new TestLibrary();
const itemListPage = new ItemListPage();
const userId = "5e3273dc5f78c300083420c1";
const subject = "Mathematics";
const authToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTMyNzNkYzVmNzhjMzAwMDgzNDIwYzEiLCJyb2xlIjoidGVhY2hlciIsImRpc3RyaWN0SWQiOiI1ZTMyNzRhYzBmYjYyMjAwMDhmZTI2ZGQiLCJpYXQiOjE1OTU1MDExMTIsImV4cCI6MTU5NjcxMDcxMn0.FO0F6ofodol5upIDxgKccK1jVG51vNWdXPtMTte1VNA";

describe(`${FileHelper.getSpecName(Cypress.spec.name)}`, () => {
  before(() => {
    cy.writeFile(testCreationLogs, {});
  });

  beforeEach("set routes", () => {
    cy.server();
    cy.route("POST", "**api/test").as("createTest");
    cy.route("POST", "**/search/tests").as("searchTest");
  });
  tests.forEach((testDetail, i) => {
    if (testDetail.status === "failed") {
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
      let newStatus = "failed";
      let itemToSearch = undefined;
      it(`create test- ${Sl_No}-${testName}--${allItems.length}`, () => {
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
          const gradeToSelect = g === "K" ? "Kindergarten" : `Grade ${g}`;
          testLibrary.testSummary.selectGrade(gradeToSelect);
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
          testLibrary.searchFilters.getSearchTextBox().clear({ force: true });
          // testLibrary.searchFilters.typeInSearchBox(itemId.substr(itemId.length - 6));
          testLibrary.searchFilters.typeInSearchBox(itemId);
          cy.wait(500);
          testLibrary.testAddItem.addItemById(itemId);
          if (i == 0) {
            cy.wait("@createTest").then(xhr => {
              testId = xhr.response.body.result._id;
            });
          }
          cy.wait(2000);
        });
        // testLibrary.header.clickOnSaveButton(true);
        /* 
        if (testType === "Practice") {
          testLibrary.header.clickOnSettings();
          testLibrary.testSettings.setTestType(testType);
        }
 */
        // testLibrary.header.clickOnSaveButton(true);
        testLibrary.header.clickOnPublishButton();
        cy.wait("@search");
        cy.wait(100).then(() => {
          // verify itemId via API
          cy.request({
            method: "GET",
            url: `${API_URL}/test/${testId}?data=true&requestLatest=true&editAndRegrade=false`,
            headers: {
              Authorization: authToken,
              "Content-Type": "application/json"
            }
          }).then(({ body }) => {
            const response = body.result;
            const allItemsInTest = response.itemGroups[0].items.map(item => item._id);
            expect(allItemsInTest.length, "verify item count is same- ").to.eq(allItems.length);
            allItemsInTest.forEach(itemInTest =>
              expect(allItems, "verify item in test is from expected list").to.include(itemInTest)
            );
            // if both assertion passes make final status as "success";
            newStatus = "success";
          });
        });
      });

      it(`save testId - ${Sl_No}-${testName}--${allItems.length}`, () => {
        cy.readFile(`${testCreationLogs}`).then(json => {
          if (!json.tests) json.tests = [];
          cy.wait(1).then(() => {
            const test = { ...testDetail, newStatus, testId };
            if (newStatus === "failed") test["failedItem"] = itemToSearch;
            json.tests.push(test);
            cy.writeFile(`${testCreationLogs}`, json);
          });
        });
      });
    }
  });
});
