import TeacherSideBar from "../../../../framework/author/SideBarPage";
import SearchFilters from "../../../../framework/author/searchFiltersPage";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TestSummayTab from "../../../../framework/author/tests/testDetail/testSummaryTab";
import TestHeader from "../../../../framework/author/tests/testDetail/header";
const userData = require("../../../../../fixtures/users");
const quesData = require("../../../../../fixtures/questionAuthoring");
const testData = require("../../../../../fixtures/testAuthoring");

const { dist1, dist2 } = userData["Sharing"];
const { search_1, search_2, search_3 } = testData;

describe("Searching Tests Using Tags,Tittle and Standards", () => {
  const techersidebar = new TeacherSideBar();
  const searchFilters = new SearchFilters();
  const testLibrary = new TestLibrary();
  const testHeader = new TestHeader();
  const testSummaryTab = new TestSummayTab();
  let Author;
  const EMAIL = "email";
  const PASS = "pass";
  const SCHOOL1 = "school1";
  const TEACHER1 = "Teacher1";
  let itemsInTest, standardsOfTest;
  const testToCreate = ["search_1", "search_2", "search_3"];
  let DIST1_SCHOOL1;
  DIST1_SCHOOL1 = dist1[SCHOOL1];
  Author = DIST1_SCHOOL1[TEACHER1];
  const tags = [];
  const testNames = [];
  const tagsToTest = {};
  const tests = [search_1, search_2, search_3];
  const standardToTest = {};
  let test_ids = [];

  context("Searching in Draft State", () => {
    before("Login As Author and Create Tests in Draft-State", () => {
      cy.login("teacher", Author[EMAIL], Author[PASS]);
      tests.forEach((test, i) => {
        testLibrary.createTest(testToCreate[i], false).then(id => {
          test_ids[i] = id;
          itemsInTest = test["itemKeys"];
          itemsInTest.forEach(item => {
            const [queType, queKey] = item.split(".");
            if (quesData[queType][queKey].standards) {
              standardsOfTest = quesData[queType][queKey].standards[0].standard;
              standardsOfTest.forEach(standardOfTest => {
                if (!standardToTest.hasOwnProperty(standardOfTest)) {
                  standardToTest[standardOfTest] = [];
                }
                standardToTest[standardOfTest].push(id);
              });
            }
          });
          testHeader.clickOnDescription();
          tags.push(test.tags);
          testNames.push(test.name);
          testSummaryTab.addTags(tags[i]);
          tags[i].forEach(tag => {
            if (!tagsToTest.hasOwnProperty(tag)) {
              tagsToTest[tag] = [];
            }
            tagsToTest[tag].push(id);
          });
          testHeader.clickOnReview();
          testHeader.clickOnSaveButton(true);
        });
      });
    });
    context("Searching In Authored By Me", () => {
      //Searched Draft Tests should Be visible in Authored By Me
      it("Search By standards in Draft-State", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        Object.keys(standardToTest).forEach(ele => {
          searchFilters.getSearchTextBox().clear({ force: true });
          searchFilters.typeInSearchBox(ele);
          standardToTest[ele].forEach(id => {
            testLibrary.getTestCardById(id).should("be.visible");
          });
        });
      });
      it("Search By tags in Draft-State", () => {
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        Object.keys(tagsToTest).forEach(ele => {
          searchFilters.getSearchTextBox().clear({ force: true });
          searchFilters.typeInSearchBox(ele);
          tagsToTest[ele].forEach(id => {
            testLibrary.getTestCardById(id).should("be.visible");
          });
        });
      });
      it("Search By name in Draft-State", () => {
        test_ids.forEach((id, i) => {
          searchFilters.clearAll();
          searchFilters.getAuthoredByMe();
          searchFilters.getSearchTextBox().clear({ force: true });
          searchFilters.typeInSearchBox(testNames[i]);
          testLibrary.getTestCardById(id).should("be.visible");
        });
      });
    });
    context("Searching In Entire Library", () => {
      //Searched Draft Tests should Not Be visible in Entire Library
      it("Search By standards in Draft-State", () => {
        searchFilters.clearAll();
        Object.keys(standardToTest).forEach(ele => {
          searchFilters.getSearchTextBox().clear({ force: true });
          searchFilters.typeInSearchBox(ele);
          standardToTest[ele].forEach(id => {
            testLibrary.checkforNonExistanceOfTest(id);
          });
        });
      });
      it("Search By tags in Draft-State", () => {
        // techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        Object.keys(tagsToTest).forEach(ele => {
          searchFilters.getSearchTextBox().clear({ force: true });
          searchFilters.typeInSearchBox(ele);
          tagsToTest[ele].forEach(id => {
            testLibrary.checkforNonExistanceOfTest(id);
          });
        });
      });
      it("Search By name in Draft-State", () => {
        test_ids.forEach((id, i) => {
          searchFilters.clearAll();
          searchFilters.getSearchTextBox().clear({ force: true });
          searchFilters.typeInSearchBox(testNames[i]);
          testLibrary.checkforNonExistanceOfTest(id);
        });
        techersidebar.clickOnPlayList();
      });
    });
  });
  context("Searching In Published State", () => {
    context("Searching In Entire Library", () => {
      //Searched Published Tests should be visible in Entire Library
      before("Publish all the tests", () => {
        searchFilters.clearAll();
        test_ids.forEach(id => {
          techersidebar.clickOnTestLibrary();
          searchFilters.clearAll();
          searchFilters.getAuthoredByMe();
          testLibrary.clickOnTestCardById(id);
          testLibrary.clickOnDetailsOfCard();
          testLibrary.header.clickOnPublishButton();
        });
      });

      it("Search By Standards-Published", () => {
        techersidebar.clickOnTestLibrary();
        searchFilters.clearAll();
        Object.keys(standardToTest).forEach(ele => {
          searchFilters.getSearchTextBox().clear({ force: true });
          searchFilters.typeInSearchBox(ele);
          standardToTest[ele].forEach(id => {
            testLibrary.getTestCardById(id).should("be.visible");
          });
        });
      });
      it("Search By tags-Published", () => {
        searchFilters.clearAll();
        Object.keys(tagsToTest).forEach(ele => {
          searchFilters.getSearchTextBox().clear({ force: true });
          searchFilters.typeInSearchBox(ele);
          tagsToTest[ele].forEach(id => {
            testLibrary.getTestCardById(id).should("be.visible");
          });
        });
      });
      it("Search By name-Published", () => {
        test_ids.forEach((id, i) => {
          searchFilters.clearAll();
          searchFilters.getAuthoredByMe();
          searchFilters.getSearchTextBox().clear({ force: true });
          searchFilters.typeInSearchBox(testNames[i]);
          testLibrary.getTestCardById(id).should("be.visible");
        });
      });
    });
    context("Searching In Authored By Me", () => {
      //Searched Draft Tests should Be visible in Authored By Me
      it("Search By standards in Published-State", () => {
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        Object.keys(standardToTest).forEach(ele => {
          searchFilters.getSearchTextBox().clear({ force: true });
          searchFilters.typeInSearchBox(ele);
          standardToTest[ele].forEach(id => {
            testLibrary.getTestCardById(id).should("be.visible");
          });
        });
      });
      it("Search By tags in Published-State", () => {
        searchFilters.clearAll();
        searchFilters.getAuthoredByMe();
        Object.keys(tagsToTest).forEach(ele => {
          searchFilters.getSearchTextBox().clear({ force: true });
          searchFilters.typeInSearchBox(ele);
          tagsToTest[ele].forEach(id => {
            testLibrary.getTestCardById(id).should("be.visible");
          });
        });
      });
      it("Search By name in Published-State", () => {
        test_ids.forEach((id, i) => {
          searchFilters.clearAll();
          searchFilters.getAuthoredByMe();
          searchFilters.getSearchTextBox().clear({ force: true });
          searchFilters.typeInSearchBox(testNames[i]);
          testLibrary.getTestCardById(id).should("be.visible");
        });
      });
    });
    // TODO: Searching with Keywords
  });
});
