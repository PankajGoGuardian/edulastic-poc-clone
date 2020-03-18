/* eslint-disable no-shadow */
import TestLibrary from "../../../../../framework/author/tests/testLibraryPage";
import GroupItemsPage from "../../../../../framework/author/tests/testDetail/groupItemsPage";

const testData = require("../../../../../../fixtures/dynamic_demo/data/Grade-6");

describe(` >>item groups`, () => {
  const testLibraryPage = new TestLibrary();
  const groupItemsPage = new GroupItemsPage();

  let tets_id;
  let test_name = [];
  let obj = {};

  before("Login and create new items", () => {
    cy.login("publisher", "author2.sparkmath@edulastic.com", "welcome");
  });
  testData.forEach((data, index) => {
    if (index > 9) {
      context(`>autoselect-${index + 1}-${data.tags}`, () => {
        before("create test", () => {
          obj = {};
          tets_id = "not_created";
          testLibraryPage.createNewTestAndFillDetails({
            name: data.name,
            collections: "Spark Math - SparkMath for Playlist",
            grade: "Grade 10",
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
            // testLibraryPage.saveTestId(xhr);
            tets_id = xhr.response.body.result._id;
          });
          // testLibraryPage.review.testheader.clickOnPublishButton();
        });
        it(">save id and name", () => {
          cy.wait(1).then(() => {
            obj["tags"] = data.tags;
            obj["name"] = data.name;
            obj["id"] = tets_id;
            obj["standard"] = data.standard.standardsToSelect;
            test_name.push(obj);
          });
        });
      });
    }
  });

  context("Write", () => {
    it("write", () => {
      cy.wait(1).then(() => {
        cy.writeFile("cypress/fixtures/dynamic_demo/results/Grade-6", test_name, { flag: "a+" });
      });
    });
  });
});
