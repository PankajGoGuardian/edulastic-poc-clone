import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import FileHelper from "../../../../framework/util/fileHelper";
import { testTypes } from "../../../../framework/constants/assignmentStatus";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import { testRunner } from "../../../../framework/common/smokeAssignmentFlowRunner";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Assignment Flows`, () => {
  const testLibrary = new TestLibrary();
  const testdata = {
    className: "Smoke Automation Class",
    teacher: "teacher1.smoke.automation@snapwiz.com",
    student: "student1.smoke.automation@snapwiz.com",
    password: "automation",
    assignmentName: "Smoke Test 3",
    attemptsData: [
      {
        email: "student1.smoke.automation@snapwiz.com",
        stuName: "student1 smoke",
        attempt: { Q1: "right", Q2: "right", Q3: "right" },
        status: "Submitted"
      },
      {
        email: "student2.smoke.automation@snapwiz.com",
        stuName: "student2 smoke",
        attempt: { Q1: "right", Q2: "wrong", Q3: "right" },
        status: "Submitted"
      },
      {
        email: "student3.smoke.automation@snapwiz.com",
        stuName: "student3 smoke",
        attempt: { Q1: "wrong", Q2: "wrong", Q3: "right" },
        status: "Submitted"
      },
      {
        email: "student4.smoke.automation@snapwiz.com",
        stuName: "student4 smoke",
        attempt: { Q1: "right", Q2: "partialCorrect", Q3: "wrong" },
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
  const lcb = new LiveClassboardPage();
  const teacherSideBar = new TeacherSideBar();
  const itemListPage = new ItemListPage();

  before("> create questionTypeMap", () => {
    cy.fixture("questionAuthoring").then(queData => {
      questionData = queData;
    });

    cy.fixture("testAuthoring").then(({ SMOKE_3 }) => {
      testData = SMOKE_3;
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

  before("> calculate student scores", () => {
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
            const test = testData.SMOKE_3;
            const { itemKeys, grade } = test;
            // create new test
            testLibrary.sidebar.clickOnTestLibrary();
            testLibrary.clickOnAuthorTest();

            // test description
            testLibrary.testSummary.setName(test.name);
            test.grade.forEach(grd => {
              testLibrary.testSummary.selectGrade(grd);
            });
            test.subject.forEach(subject => {
              testLibrary.testSummary.selectSubject(subject);
            });

            // create new items
            testLibrary.header.clickOnAddItems();
            testLibrary.searchFilters.routeSearch();

            cy.route("POST", "**api/test").as("createTest");
            test.itemKeys.forEach(async (itemKey, index) => {
              itemListPage.createItem(itemKey, index, false);
              if (index === 0) cy.wait("@createTest").then(xhr => testLibrary.saveTestId(xhr));
              testLibrary.searchFilters.waitForSearchResponse();
            });
            /* 
            testLibrary.searchFilters.clearAll();
            testLibrary.testAddItem.authoredByMe().then(() => {
              testLibrary.searchFilters.setGrades(grade);
              itemKeys.forEach(itemKey => {
                testLibrary.testAddItem.verifyAddedItemByQuestionContent(itemKey);
              });
            }); */

            testLibrary.header.clickOnReview();
            cy.wait(2000);
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
          cy.contains(testData.name).click({ force: true });
          testLibrary.clickOnAssign();
          testLibrary.assignPage.selectClass(className);
          testLibrary.assignPage.selectTestType(testTypes[aType]);
          testLibrary.assignPage.clickOnAssign();
        }
      });

      // attempt and verify student side with 4 release grade options
      testRunner(testdata.assignmentName, aType, statsMap, questionTypeMap, testdata);
    });
  });
});
