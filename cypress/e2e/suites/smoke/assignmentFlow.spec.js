import TestLibrary from "../../framework/author/tests/testLibraryPage";
import AssignmentsPage from "../../framework/student/assignmentsPage";
import StudentTestPage from "../../framework/student/studentTestPage";
import LiveClassboardPage from "../../framework/author/assignments/LiveClassboardPage";
import AuthorAssignmentPage from "../../framework/author/assignments/AuthorAssignmentPage";
import TeacherSideBar from "../../framework/author/SideBarPage";
import FileHelper from "../../framework/util/fileHelper";
import { studentSide, testTypes, releaseGradeTypes } from "../../framework/constants/assignmentStatus";
import ReportsPage from "../../framework/student/reportsPage";
import { testRunner } from "../../framework/common/smokeAssignmentFlowRunner";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Assignment Flows`, () => {
  const testLibrary = new TestLibrary();
  const testdata = {
    className: "Smoke Automation Class",
    teacher: "teacher1.smoke.automation@snapwiz.com",
    student: "student1.smoke.automation@snapwiz.com",
    password: "automation",
    assignmentName: "Smoke Test 1",
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
  const report = new ReportsPage();
  const studentAssignment = new AssignmentsPage();
  const test = new StudentTestPage();
  const lcb = new LiveClassboardPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const teacherSideBar = new TeacherSideBar();

  before(" > create new assessment and assign", () => {
    cy.fixture("questionAuthoring").then(queData => {
      questionData = queData;
    });

    cy.fixture("testAuthoring").then(({ SMOKE_1 }) => {
      testData = SMOKE_1;
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

  assessmentType.forEach(aType => {
    context(`> assigned as - ${aType}`, () => {
      before("delete old assignment and assigned new", () => {
        cy.deleteAllAssignments(student, teacher, password);
        cy.login("teacher", teacher, password);
        teacherSideBar.clickOnTestLibrary();
        testLibrary.searchFilters.clearAll();
        testLibrary.searchFilters.getAuthoredByMe();
        cy.contains(testData.name).click({ force: true });
        testLibrary.clickOnAssign();
        testLibrary.assignPage.selectClass(className);
        testLibrary.assignPage.selectTestType(testTypes[aType]);
        testLibrary.assignPage.clickOnAssign();
      });

      // attempt and verify student side with 4 release grade options
      testRunner(testdata.assignmentName, aType, statsMap, questionTypeMap, testdata);
    });
  });
});
