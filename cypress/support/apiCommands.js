/// <reference types="Cypress"/>

import uuidv4 from "uuid/v4";
import { getAccessToken } from "../../packages/api/src/utils/Storage";

const ENV = Cypress.env("ENVIRONMENT") || "local";
const BASE_URL = Cypress.config("API_URL");

const { _ } = Cypress;
const fixtureFolderPath = "cypress/fixtures";
const deleteTestDataFile = `${fixtureFolderPath}/toDelete/testData-${ENV}.json`;
const daCredential = { username: "da.automation@snapwiz.com", password: "automation" };
const NO_ITEMS_TO_DELETE = 50;

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
  return cy
    .request({
      url: `${BASE_URL}/testitem/${item._id}`,
      method: "DELETE",
      headers: {
        Authorization: item.authToken
      },
      failOnStatusCode: false
    })
    .then(xhr => {
      const { status } = xhr;
      if (status === 200) {
        expect(status).to.eq(200);
        console.log("Item deleted with _id :", item._id);
      } else {
        console.log("failed to delete item for :", JSON.stringify(item));
      }
      return xhr;
    });
});

Cypress.Commands.add("deleteTest", test => {
  return cy
    .request({
      url: `${BASE_URL}/test/${test._id}`,
      method: "DELETE",
      headers: {
        Authorization: test.authToken
      },
      failOnStatusCode: false
    })
    .then(xhr => {
      const { status } = xhr;
      // if (status !== 403) {
      if (status === 200) {
        expect(status).to.eq(200);
        console.log("test deleted with _id :", test._id);
      } else {
        console.log("failed to delete test for :", JSON.stringify(test));
      }
      return xhr;
      // } else console.log("API forbidden for test ", JSON.stringify(test));
    });
});

Cypress.Commands.add("deletePlayList", playListObj => {
  cy.request({
    url: `${BASE_URL}/playlists/${playListObj._id}`,
    method: "DELETE",
    headers: {
      Authorization: playListObj.authToken
    },
    failOnStatusCode: false
  }).then(({ status }) => {
    expect(status).to.eq(200);
    console.log("PlayList deleted with _id :", playListObj._id);
  });
});

Cypress.Commands.add("deletePlayListRecommendation", (email, password = "snapwiz") => {
  cy.setToken(email, password).then(() => {
    cy.request({
      url: `${BASE_URL}/recommendations`,
      method: "DELETE",
      headers: {
        Authorization: getAccessToken()
      }
    }).then(({ status }) => {
      expect(status).to.eq(200);
    });
  });
});

Cypress.Commands.add("saveItemDetailToDelete", itemId => {
  if (itemId) {
    cy.readFile(`${deleteTestDataFile}`).then(json => {
      if (!json.testItems) json.testItems = [];
      const item = {
        _id: itemId,
        authToken: getAccessToken()
      };
      json.testItems.push(item);
      cy.writeFile(`${deleteTestDataFile}`, json);
    });
  }
});

Cypress.Commands.add("saveTestDetailToDelete", testId => {
  if (testId) {
    return cy.readFile(`${deleteTestDataFile}`).then(json => {
      if (!json.tests) json.tests = [];
      const test = {
        _id: testId,
        authToken: getAccessToken()
      };
      json.tests.push(test);
      return cy.writeFile(`${deleteTestDataFile}`, json);
    });
  }
});
Cypress.Commands.add("saveplayListDetailToDelete", playlistId => {
  if (playlistId) {
    return cy.readFile(`${deleteTestDataFile}`).then(json => {
      if (!json.playlist) json.playlist = [];
      const playlistObj = {
        _id: playlistId,
        authToken: getAccessToken()
      };
      json.playlist.push(playlistObj);
      return cy.writeFile(`${deleteTestDataFile}`, json);
    });
  }
});

Cypress.Commands.add("deleteTestData", () => {
  cy.task("readFileContent", deleteTestDataFile).then(fileContent => {
    let testData;
    let cleanupStateSuccess;
    const failedToDeleteTests = [];
    const failedToDeleteItems = [];

    if (fileContent !== null) {
      testData = JSON.parse(fileContent);
      console.log("testDataJson in deleteTestData", testData);

      cy.setToken(daCredential.username, daCredential.password).then(() => {
        // archive users
        if (testData.users) {
          Object.keys(testData.users).forEach(userType => {
            const deleteBody = {};
            deleteBody.role = userType;
            deleteBody.userIds = testData.users[userType];
            cy.deleteUsers({ authToken: getAccessToken(), deleteBody });
          });
          delete testData.users;
        }

        // archive classs
        if (testData.classs) {
          testData.classs.forEach(clazz => {
            cy.deleteClazz({ authToken: getAccessToken(), deleteBody: clazz });
          });
          delete testData.classs;
        }
        // remove enrollments

        if (testData.enrollments) {
          testData.enrollments.forEach(enrollment => {
            cy.deleteEnrollments({ authToken: getAccessToken(), deleteBody: enrollment });
          });
          delete testData.enrollments;
        }
      });

      // delete playlist
      if (testData.playlist && testData.playlist.length > 0) {
        testData.playlist.forEach(playlistObj => {
          cy.deletePlayList(playlistObj);
        });
        delete testData.playlist;
      }

      // delete tests
      if (testData.tests && testData.tests.length > 0) {
        testData.tests.forEach(test => {
          cy.deleteTest(test).then(({ status, body }) => {
            if (status !== 200) {
              test.status = status;
              test.errorResponse = body.message || body || "error";
              failedToDeleteTests.push(test);
            }
          });
        });
        cy.wait(1).then(() => {
          if (failedToDeleteTests.length) testData.tests = failedToDeleteTests;
          else delete testData.tests;
        });
      }

      // delete testItems
      if (testData.testItems && testData.testItems.length > 0) {
        testData.testItems.forEach(item => {
          cy.deleteItem(item).then(({ status, body }) => {
            if (status !== 200) {
              item.status = status;
              item.errorResponse = body.messages || body || "error";
              failedToDeleteItems.push(item);
            }
          });
        });
        cy.wait(1).then(() => {
          if (failedToDeleteItems.length) testData.testItems = failedToDeleteItems;
          else delete testData.testItems;
        });
      }

      cy.wait(1).then(() => {
        cleanupStateSuccess = failedToDeleteTests.length || failedToDeleteItems.length ? false : true;
      });
    } else testData = {};

    // TODO : add other collections API
    cy.writeFile(deleteTestDataFile, testData).then(() => {
      expect(cleanupStateSuccess, `data clean-up stage failed - ${JSON.stringify(testData, null, 2)}`).to.be.true;
    });
  });
});

Cypress.Commands.add("createTestDataFile", () => {
  cy.task("readFileContent", deleteTestDataFile).then(fileContent => {
    let testData = fileContent !== null ? JSON.parse(fileContent) : {};
    cy.writeFile(deleteTestDataFile, testData);
  });
});

Cypress.Commands.add("deleteEnrollments", enrollment => {
  cy.request({
    url: `${BASE_URL}/enrollment/student`,
    method: "DELETE",
    headers: {
      Authorization: enrollment.authToken,
      "Content-Type": "application/json"
    },
    body: enrollment.deleteBody
  }).then(({ status }) => {
    // if (status !== 403) {
    expect(status).to.eq(200);
    console.log("enrollment deleted with _id :", enrollment.deleteBody.userIds);
    // } else console.log("API forbidden , for enrollment ", JSON.stringify(enrollment));
  });
});

Cypress.Commands.add("saveUserDetailToDelete", userJson => {
  if (userJson) {
    cy.readFile(`${deleteTestDataFile}`).then(json => {
      if (!json.users) json.users = {};
      if (!json.users[userJson.role]) json.users[userJson.role] = [];
      if (!_.isArray(userJson._id)) json.users[userJson.role].push(userJson._id);
      else json.users[userJson.role] = _.union(json.users[userJson.role], userJson._id);
      cy.writeFile(`${deleteTestDataFile}`, json);
    });
  }
});

Cypress.Commands.add("deleteUsers", users => {
  cy.request({
    url: `${BASE_URL}/user`,
    method: "DELETE",
    headers: {
      Authorization: users.authToken,
      "Content-Type": "application/json"
    },
    body: users.deleteBody
  }).then(({ status }) => {
    // if (status !== 403) {
    expect(status).to.eq(200);
    console.log("users deleted with _id :", users.deleteBody.userIds);
    // } else console.log("API forbidden , for users ", JSON.stringify(users));
  });
});

Cypress.Commands.add("deleteClazz", group => {
  cy.request({
    url: `${BASE_URL}/group`,
    method: "DELETE",
    headers: {
      Authorization: group.authToken,
      "Content-Type": "application/json"
    },
    body: group.deleteBody
  }).then(({ status }) => {
    // if (status !== 403) {
    expect(status).to.eq(200);
    console.log("groups deleted with _id :", group.deleteBody);
    // } else console.log("API forbidden , for groups ", JSON.stringify(group));
  });
});

Cypress.Commands.add("saveEnrollmentDetails", response => {
  if (response) {
    const enroll = {};
    enroll.classCode = response.result.code;
    enroll.studentIds = [response.result.userId];
    enroll.districtId = response.result.districtId;
    cy.readFile(`${deleteTestDataFile}`).then(json => {
      if (!json.enrollments) json.enrollments = [];
      json.enrollments.push(enroll);
      cy.writeFile(`${deleteTestDataFile}`, json);
    });
  }
});

Cypress.Commands.add("saveClassDetailToDelete", classJson => {
  if (classJson) {
    cy.readFile(`${deleteTestDataFile}`).then(json => {
      if (!json.classs) json.classs = [];
      json.classs.push(classJson);
      cy.writeFile(`${deleteTestDataFile}`, json);
    });
  }
});

Cypress.Commands.add("getAllTestsAndDelete", (publisher, password = "snapwiz", testsToExclude = []) => {
  cy.setToken(publisher, password).then(() => {
    cy.getAllOwnTests().then(testIds => {
      // console.log("all tests - authored by me : ", testIds);
      testIds.forEach(testObj => {
        if (!testsToExclude.includes(testObj._id)) cy.deleteTest(testObj);
      });
    });
  });
});

Cypress.Commands.add("getAllItemsAndDelete", (publisher, password = "snapwiz", itemsToExclude = []) => {
  cy.setToken(publisher, password).then(() => {
    cy.getAllOwnItems().then(itemIds => {
      // console.log("all items - authored by me : ", itemIds);
      itemIds.forEach(itemObj => {
        if (!itemsToExclude.includes(itemObj._id)) cy.deleteItem(itemObj);
      });
    });
  });
});

Cypress.Commands.add("getAllOwnTests", (access_token = getAccessToken()) => {
  let testIds = [];
  return cy
    .request({
      url: `${BASE_URL}/search/tests`,
      method: "POST",
      body: {
        search: {
          questionType: "",
          depthOfKnowledge: "",
          authorDifficulty: "",
          collections: [],
          curriculumId: "",
          status: "",
          standardIds: [],
          grades: [],
          subject: "",
          tags: [],
          searchString: [],
          filter: "AUTHORED_BY_ME",
          createdAt: ""
        },
        page: 1,
        limit: NO_ITEMS_TO_DELETE
      },
      headers: {
        authorization: access_token,
        "Content-Type": "application/json"
      }
    })
    .then(({ body }) => {
      const tests = body.result.hits.hits;
      tests.forEach(testObj => {
        let test = {};
        test._id = testObj._id;
        test.authToken = access_token;
        testIds.push(test);
      });
    })
    .then(() => testIds);
});

Cypress.Commands.add("getAllOwnItems", (access_token = getAccessToken()) => {
  let itemIds = [];
  return cy
    .request({
      url: `${BASE_URL}/search/items`,
      method: "POST",
      body: {
        search: {
          subject: [],
          curriculumId: "",
          standardIds: [],
          questionType: "",
          depthOfKnowledge: "",
          authorDifficulty: "",
          collections: [],
          status: "",
          grades: [],
          tags: [],
          authoredByIds: [],
          filter: "AUTHORED_BY_ME",
          createdAt: ""
        },
        sort: {
          sortBy: "popularity",
          sortDir: "desc"
        },
        page: 1,
        limit: NO_ITEMS_TO_DELETE
      },
      headers: {
        authorization: access_token,
        "Content-Type": "application/json"
      }
    })
    .then(({ body }) => {
      const tests = body.result.hits.hits;
      tests.forEach(testObj => {
        let item = {};
        item._id = testObj._id;
        item.authToken = access_token;
        itemIds.push(item);
      });
    })
    .then(() => itemIds);
});
