/// <reference types="Cypress"/>

import uuidv4 from "uuid/v4";

const BASE_URL = Cypress.config("API_URL");
const folderPath = "cypress/fixtures";

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
          cy.writeFile(`${folderPath}/studentsAttempt.json`, studentsAttemptJson);
        });
      });
    });
  });
});
