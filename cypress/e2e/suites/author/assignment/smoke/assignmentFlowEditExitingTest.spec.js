import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import FileHelper from "../../../../framework/util/fileHelper";
import { testTypes } from "../../../../framework/constants/assignmentStatus";
import { testRunner } from "../../../../framework/common/smokeAssignmentFlowRunner";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";

const lcb = new LiveClassboardPage();
const teacherSideBar = new TeacherSideBar();
const testLibrary = new TestLibrary();
const itemListPage = new ItemListPage();

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Assignment Flows`, () => {
  describe(`customise existing test - duplicate`, () => {
    const testdata = {
      className: "Smoke Automation Class",
      teacher: "teacher1.smoke.automation@snapwiz.com",
      student: "student1.smoke.automation@snapwiz.com",
      password: "automation",
      assignmentName: "Smoke Test 5",
      attemptsData: [
        {
          email: "student1.smoke.automation@snapwiz.com",
          stuName: "smoke, student1",
          attempt: { Q1: "right", Q2: "right", Q3: "right" },
          status: "Submitted"
        },
        {
          email: "student2.smoke.automation@snapwiz.com",
          stuName: "smoke, student2",
          attempt: { Q1: "right", Q2: "wrong", Q3: "partialCorrect" },
          status: "Submitted"
        },
        {
          email: "student3.smoke.automation@snapwiz.com",
          stuName: "smoke, student3",
          attempt: { Q1: "right", Q2: "wrong", Q3: "right" },
          status: "Submitted"
        },
        {
          email: "student4.smoke.automation@snapwiz.com",
          stuName: "smoke, student4",
          attempt: { Q1: "right", Q2: "wrong", Q3: "wrong" },
          status: "Submitted"
        }
      ]
    };

    let questionData;
    let testData;
    const questionTypeMap = {};
    const statsMap = {};
    const { attemptsData, student, teacher, password, className } = testdata;
    const assessmentType = ["CLASS_ASSESSMENT", "PRACTICE_ASSESSMENT"];

    before(" > create new assessment and assign", () => {
      cy.fixture("questionAuthoring").then(queData => {
        questionData = queData;
      });

      cy.fixture("testAuthoring").then(({ SMOKE_5 }) => {
        testData = SMOKE_5;
        const { itemKeys } = testData;
        itemKeys.forEach((queKey, index) => {
          const [queType, questionKey] = queKey.split(".");
          const { attemptData, standards } = questionData[queType][questionKey];
          const { points } = questionData[queType][questionKey].setAns;
          const queMap = { queKey, points, attemptData, standards };
          questionTypeMap[`Q${index + 1}`] = queMap;
        });
      });
    });

    before("calculate student scores", () => {
      attemptsData.forEach(attempts => {
        const { attempt, stuName, status } = attempts;
        statsMap[stuName] = lcb.getScoreAndPerformance(attempt, questionTypeMap);
        statsMap[stuName].attempt = attempt;
        statsMap[stuName].status = status;
      });
    });

    assessmentType.forEach((aType, aIndex) => {
      context(`> assigned as - ${aType}`, () => {
        before("delete old assignment and assigned new", () => {
          cy.deleteAllAssignments(student, teacher, password);
          cy.login("teacher", teacher, password);
          if (aIndex === 0) {
            cy.fixture("testAuthoring").then(testData => {
              const test = testData.SMOKE_5;
              const existingTest = testData.SMOKE_1;
              const { itemKeys, grade } = test;
              teacherSideBar.clickOnTestLibrary();
              testLibrary.searchFilters.clearAll();
              testLibrary.searchFilters.getAuthoredByMe();
              cy.contains(existingTest.name).click({ force: true });
              testLibrary.clickOnDuplicate();
              // set test name
              testLibrary.header.clickOnDescription();
              testLibrary.testSummary.setName(testdata.assignmentName);
              // add items
              testLibrary.header.clickOnAddItems();
              test.itemKeys.forEach((itemKey, index) => {
                // create new items
                if (index === 2) {
                  itemListPage.createItem(itemKey, index, false);
                  // testLibrary.searchFilters.waitForSearchResponse();
                  cy.wait(1000);
                }
              });

              cy.wait(1000);
              cy.contains("View as Student");
              itemKeys.forEach(itemKey => {
                testLibrary.review.verifyItemByContent(itemKey);
              });

              testLibrary.header.clickOnSaveButton(true);
              testLibrary.header.clickOnPublishButton();
              testLibrary.clickOnAssign();
              testLibrary.assignPage.selectClass(className);
              testLibrary.assignPage.selectTestType(testTypes[aType]);
              testLibrary.assignPage.clickOnAssign();
            });
          } else {
            teacherSideBar.clickOnTestLibrary();
            testLibrary.searchFilters.clearAll();
            testLibrary.searchFilters.getAuthoredByMe();
            cy.contains(testdata.assignmentName).click({ force: true });
            testLibrary.clickOnAssign();
            testLibrary.assignPage.selectClass(className);
            testLibrary.assignPage.selectTestType(testTypes[aType]);
            testLibrary.assignPage.showOverRideSetting();
            testLibrary.assignPage.setMaxAttempt(1);
            testLibrary.assignPage.clickOnAssign();
          }
        });

        // attempt and verify student side with 4 release grade options
        testRunner(testdata.assignmentName, aType, statsMap, questionTypeMap, testdata);
      });
    });
  });
});
