/* eslint-disable no-shadow */
import TestLibrary from "../../../../../framework/author/tests/testLibraryPage";
import GroupItemsPage from "../../../../../framework/author/tests/testDetail/groupItemsPage";

const testData1 = require("../../../../../../fixtures/dynamic_demo/data/Grade1");
const testData2 = require("../../../../../../fixtures/dynamic_demo/data/Grade2");
const testData3 = require("../../../../../../fixtures/dynamic_demo/data/Grade3");
const testData4 = require("../../../../../../fixtures/dynamic_demo/data/Grade4");
const testData5 = require("../../../../../../fixtures/dynamic_demo/data/Grade5");

describe(` >>item groups`, () => {
  const testLibraryPage = new TestLibrary();
  const groupItemsPage = new GroupItemsPage();

  let tets_id;
  let obj = {};

  before("Login and create new items", () => {
    cy.login("publisher", "author2.sparkmath@edulastic.com", "welcome");
  });
  /* , testData2, testData3, testData4, testData5 */
  [testData1].forEach((testData, ind) => {
    describe(`grade-${ind + 1}`, () => {
      const test_name = [];
      testData.forEach((data, index) => {
        context(`>autoselect-${index + 1}-${data.tags}`, () => {
          before("create test", () => {
            obj = {};
            tets_id = "not_created";
            testLibraryPage.createNewTestAndFillDetails({
              name: data.name,
              collections: "Spark Math - SparkMath for Playlist",
              grade: data.grade,
              subject: "Math",
              tags: data.tags
            });
          });
          it(`>create test`, () => {
            testLibraryPage.testSummary.header.clickOnAddItems();
            testLibraryPage.testAddItem.clickOnGroupItem();
            cy.server();
            cy.route("POST", "**api/test").as("createTest");
            groupItemsPage.createDynamicTest(1, data);
            testLibraryPage.header.clickOnReview();
            cy.wait("@createTest").then(xhr => {
              tets_id = xhr.response.body.result._id;
            });
          });
          it(">save id and name", () => {
            cy.wait(1).then(() => {
              obj.tags = data.tags;
              obj.name = data.name;
              obj.id = tets_id;
              obj.standard = data.standard.standardsToSelect;
              test_name.push(obj);
            });
          });
        });
      });

      context("Write", () => {
        it("write", () => {
          cy.wait(1).then(() => {
            cy.writeFile(`cypress/fixtures/dynamic_demo/results/Grade${ind + 1}.json`, test_name);
          });
        });
      });
    });
  });
});
