import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import FileHelper from "../../../../framework/util/fileHelper";
import { testTypes } from "../../../../framework/constants/assignmentStatus";
import { testRunner } from "../../../../framework/common/smokeAssignmentFlowRunner";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Assignment Flows`, () => {
  const testLibrary = new TestLibrary();
  const testdata = {
    className: "Smoke Automation Class",
    teacher: "teacher1.smoke.automation@snapwiz.com",
    student: "student1.smoke.automation@snapwiz.com",
    password: "automation",
    assignmentName: "Smoke Test 2",
    attemptsData: [
      {
        email: "student1.smoke.automation@snapwiz.com",
        stuName: "student1 smoke",
        attempt: { Q1: "right", Q2: "right" },
        status: "Submitted"
      },
      {
        email: "student2.smoke.automation@snapwiz.com",
        stuName: "student2 smoke",
        attempt: { Q1: "right", Q2: "wrong" },
        status: "Submitted"
      },
      {
        email: "student3.smoke.automation@snapwiz.com",
        stuName: "student3 smoke",
        attempt: { Q1: "right", Q2: "wrong" },
        status: "Submitted"
      },
      {
        email: "student4.smoke.automation@snapwiz.com",
        stuName: "student4 smoke",
        attempt: { Q1: "right", Q2: "wrong" },
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

  before("> create questionTypeMap", () => {
    cy.fixture("questionAuthoring").then(queData => {
      questionData = queData;
    });

    cy.fixture("testAuthoring").then(({ SMOKE_2 }) => {
      testData = SMOKE_2;
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
            const test = testData["SMOKE_2"];
            const { itemKeys } = test;
            // create new test
            testLibrary.sidebar.clickOnTestLibrary();
            testLibrary.clickOnAuthorTest();

            // test description
            if (test.name) testLibrary.testSummary.setName(test.name);
            if (test.grade) {
              test.grade.forEach(grade => {
                testLibrary.testSummary.selectGrade(grade);
              });
            }
            if (test.subject) {
              test.subject.forEach(subject => {
                testLibrary.testSummary.selectSubject(subject);
              });
            }
            // add items
            testLibrary.header.clickOnAddItems();
            testLibrary.searchFilters.clearAll();
            cy.route("POST", "**api/test").as("createTest");
            testLibrary.testAddItem.authoredByMe().then(() => {
              itemKeys.forEach((itemKey, index) => {
                testLibrary.testAddItem.addItemByQuestionContent(itemKey);
                if (index === 0) cy.wait("@createTest").then(xhr => testLibrary.saveTestId(xhr));
                cy.wait(500);
              });
            });

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
