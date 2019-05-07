/// <reference types="Cypress"/>

import uuidv4 from "uuid/v4";
import { getAccessToken } from "../../packages/api/src/utils/Storage";

const BASE_URL = Cypress.config("API_URL");
const fixtureFolderPath = "cypress/fixtures";
const deleteTestDataFile = `${fixtureFolderPath}/toDelete/testData.json`;

Cypress.Commands.add("createTestData", () => {
  let studentsAttemptJson;

  const emptyItem = { rows: [{ tabs: [], dimension: "100%", widgets: [] }] };
  const access_token = window.localStorage.getItem("access_token");

  cy.fixture("studentsAttempt").then(json => {
    studentsAttemptJson = json;
  });

  cy.fixture("testdata").then(json => {
    Object.keys(json.testTypes).forEach(testKey => {
      let testId;
      const testItems = [];
      const testJsonForType = json.testTypes[testKey];

      /*
       *create new item with item data for each items
       *current implementation supports one question per item
       */
      testJsonForType.items.forEach(item => {
        let testItemId;
        const questionRawData = item;

        cy.request({
          url: `${BASE_URL}/testitem`,
          method: "POST",
          body: emptyItem,
          headers: {
            Authorization: access_token,
            "Content-Type": "application/json"
          }
        }).then(({ body, status }) => {
          expect(status).to.eq(200);
          testItemId = body.result._id;
          console.log("Item created with itemId = ", testItemId);
          testItems.push(testItemId);

          const newQueId = uuidv4();
          console.log("newQueId = ", newQueId);
          questionRawData.rows[0].widgets[0].reference = newQueId;
          questionRawData.data.questions[0].id = newQueId;

          // edit the testitem > PUT raw data
          cy.request({
            url: `${BASE_URL}/testitem/${testItemId}`,
            method: "PUT",
            body: questionRawData,
            headers: {
              Authorization: access_token,
              "Content-Type": "application/json"
            }
          }).then(({ status }) => {
            expect(status).to.eq(200);
          });
          // publish the item
          cy.request({
            url: `${BASE_URL}/testitem/${testItemId}/publish`,
            method: "PUT",
            headers: {
              Authorization: access_token,
              "Content-Type": "application/json"
            }
          }).then(({ status }) => {
            expect(status).to.eq(200);
          });
        });
      });

      // create test with using testItems
      const testRawData = testJsonForType.test;
      testRawData.testItems = testItems;
      cy.request({
        url: `${BASE_URL}/test`,
        method: "POST",
        body: testRawData,
        headers: {
          Authorization: access_token,
          "Content-Type": "application/json"
        }
      }).then(({ body, status }) => {
        expect(status).to.eq(200);
        testId = body.result._id;

        // publish the test
        cy.request({
          url: `${BASE_URL}/test/${testId}/publish`,
          method: "PUT",
          headers: {
            Authorization: access_token,
            "Content-Type": "application/json"
          }
        }).then(({ status }) => {
          expect(status).to.eq(200);
          console.log(`Test created for the type - ${testKey} , _id :`, testId);
          studentsAttemptJson.testTypes[testKey] = testId;
          cy.writeFile(`${fixtureFolderPath}/studentsAttempt.json`, studentsAttemptJson);
        });
      });
    });
  });
});

Cypress.Commands.add("deleteItem", item => {
  cy.request({
    url: `${BASE_URL}/testitem/${item._id}`,
    method: "DELETE",
    headers: {
      Authorization: item.authToken
    },
    failOnStatusCode: false
  }).then(({ status }) => {
    if (status !== 403) {
      expect(status).to.eq(200);
      console.log("Item deleted with _id :", item._id);
    } else console.log("API forbidden , for testItem ", JSON.stringify(item));
  });
});

Cypress.Commands.add("deleteTest", test => {
  cy.request({
    url: `${BASE_URL}/test/${test._id}`,
    method: "DELETE",
    headers: {
      Authorization: test.authToken
    },
    failOnStatusCode: false
  }).then(({ status }) => {
    if (status !== 403) {
      expect(status).to.eq(200);
      console.log("test deleted with _id :", test._id);
    } else console.log("API forbidden for test ", JSON.stringify(test));
  });
});

Cypress.Commands.add("saveItemDetailToDelete", itemId => {
  cy.readFile(`${deleteTestDataFile}`).then(json => {
    if (!json.testItems) json.testItems = [];
    const item = {
      _id: itemId,
      authToken: getAccessToken()
    };
    json.testItems.push(item);
    cy.writeFile(`${deleteTestDataFile}`, json);
  });
});

Cypress.Commands.add("saveTestDetailToDelete", testId => {
  cy.readFile(`${deleteTestDataFile}`).then(json => {
    if (!json.tests) json.tests = [];
    const test = {
      _id: testId,
      authToken: getAccessToken()
    };
    json.tests.push(test);
    cy.writeFile(`${deleteTestDataFile}`, json);
  });
});

Cypress.Commands.add("deleteTestData", () => {
  cy.task("readFileContent", deleteTestDataFile).then(fileContent => {
    let testData;
    if (fileContent !== null) {
      testData = JSON.parse(fileContent);
      console.log("testDataJson in deleteTestData", testData);

      // delete testItems
      if (testData.testItems && testData.testItems.length > 0) {
        testData.testItems.forEach(item => {
          cy.deleteItem(item);
        });
        delete testData.testItems;
      }

      // delete tests
      if (testData.tests && testData.tests.length > 0) {
        testData.tests.forEach(test => {
          cy.deleteTest(test);
        });
        delete testData.tests;
      }
      // TODO : add other collections API
    } else testData = {};
    cy.writeFile(deleteTestDataFile, testData).then(json => {
      expect(Object.keys(json).length).to.equal(0);
    });
  });
});
