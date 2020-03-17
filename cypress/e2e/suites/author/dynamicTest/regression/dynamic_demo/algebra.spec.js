/* eslint-disable no-shadow */
import TestLibrary from "../../../../../framework/author/tests/testLibraryPage";
import GroupItemsPage from "../../../../../framework/author/tests/testDetail/groupItemsPage";

const testData = require("../../../../../../fixtures/dynamic_demo/data/Algebra_1");

describe(` >>item groups`, () => {
  const testLibraryPage = new TestLibrary();
  const groupItemsPage = new GroupItemsPage();

  let tets_id;
  let test_name = [];
  let obj = {};

  before("Login and create new items", () => {
    cy.login("publisher", "author2.sparkmath@edulastic.com", "edulastic");
  });
  testData.forEach((data, index) => {
    context(`>autoselect-${index + 1}`, () => {
      before("create test", () => {
        obj = {};
        tets_id = "not_created";
        testLibraryPage.createNewTestAndFillDetails({
          name: data.name,
          collections: "Spark Math - Spark Math Bucket",
          grade: "Grade 10",
          subject: "Math"
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
          testLibraryPage.saveTestId(xhr);
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
  });

  context("Write", () => {
    it("write", () => {
      cy.wait(1).then(() => {
        cy.writeFile("cypress/fixtures/dynamic_demo/results/Algebra_1", test_name);
      });
    });
  });
});
