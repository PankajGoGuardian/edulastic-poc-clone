/* eslint-disable no-shadow */
import TestLibrary from "../../../../../framework/author/tests/testLibraryPage";
import GroupItemsPage from "../../../../../framework/author/tests/testDetail/groupItemsPage";

const testData1 = require("../../../../../../fixtures/dynamic_demo/data/engageny");
// const testData2 = require("../../../../../../fixtures/dynamic_demo/data/Grade2");
// const testData3 = require("../../../../../../fixtures/dynamic_demo/data/Grade3");
// const testData4 = require("../../../../../../fixtures/dynamic_demo/data/Grade4");
// const testData5 = require("../../../../../../fixtures/dynamic_demo/data/Grade5");

describe(` >>item groups`, () => {
  const testLibraryPage = new TestLibrary();
  const groupItemsPage = new GroupItemsPage();

  let tets_id;
  let obj = {};
  let collection;
  const grup = 1;
  const results = {};

  before("Login and create new items", () => {
    cy.login("publisher", "author1.sparkmath@edulastic.com", "edulastic");
  });
  /* , testData3, testData4, testData5 */
  Cypress._.values(testData1).forEach((mod, ind) => {
    context(`>Module-${ind + 1}`, () => {
      before(">", () => {
        results[`module${ind + 1}`] = {};
      });
      Cypress._.values(mod).forEach(test => {
        context(`>autoselect`, () => {
          before("create test", () => {
            results[`module${ind + 1}`][`${test[0].name}`] = {};
            results[`module${ind + 1}`][`${test[0].name}`].standards = {};
            obj = {};
            collection = "failed for both";
            tets_id = "not_created";
            testLibraryPage.createNewTestAndFillDetails({
              name: test[0].name,
              collections: "Spark Math - SparkMath for Playlist",
              grade: test[0].grade,
              subject: "Math"
            });
          });
          it(`>create test`, () => {
            testLibraryPage.testSummary.header.clickOnAddItems();
            testLibraryPage.testAddItem.clickOnGroupItem();
            cy.server();
            cy.route("POST", "**api/test").as("createTest");
            test.forEach((data, grp) => {
              cy.wait(1).then(() => {
                results[`module${ind + 1}`][`${test[0].name}`].standards[
                  `${data.standard.standardsToSelect}`
                ] = collection;
              });

              if (grp !== 0) groupItemsPage.clickOnAddGroup();
              groupItemsPage.createDynamicTest(grp + 1, data).then(flag => {
                grp++;
                console.log(flag);
                if (flag) collection = data.collection;
                else collection = "Edulastic Certified";
                results[`module${ind + 1}`][`${test[0].name}`].standards[
                  `${data.standard.standardsToSelect}`
                ] = collection;
                collection = "failed for both";
              });
            });

            testLibraryPage.header.clickOnReview();
            cy.wait("@createTest").then(xhr => {
              tets_id = xhr.response.body.result._id;
            });
          });
          it(">save id and name", () => {
            cy.wait(1).then(() => {
              results[`module${ind + 1}`][`${test[0].name}`].id = tets_id;
              cy.writeFile(`cypress/fixtures/dynamic_demo/tempres/engageny.json`, results);
            });
          });
        });

        // context("Write", () => {
        //   it("write", () => {
        //     cy.wait(1).then(() => {
        //       cy.writeFile(`cypress/fixtures/dynamic_demo/results/Grade${ind + 6}.json`, test_name);
        //     });
        //   });
        // });
      });
    });
  });
});
