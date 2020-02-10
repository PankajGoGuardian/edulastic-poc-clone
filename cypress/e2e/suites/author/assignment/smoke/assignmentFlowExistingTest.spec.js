import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import FileHelper from "../../../../framework/util/fileHelper";
import { testTypes } from "../../../../framework/constants/assignmentStatus";
import { testRunner } from "../../../../framework/common/smokeAssignmentFlowRunner";

const lcb = new LiveClassboardPage();
const teacherSideBar = new TeacherSideBar();
const testLibrary = new TestLibrary();

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Assignment Flows`, () => {
  describe(`use existing test`, () => {
    const students = {
      "1": {
        email: "student.1.existingtest@snapwiz.com",
        stuName: "existingTest, student.1"
      },
      "2": {
        email: "student.2.existingtest@snapwiz.com",
        stuName: "existingTest, student.2"
      },
      "3": {
        email: "student.3.existingtest@snapwiz.com",
        stuName: "existingTest, student.3"
      },
      "4": {
        email: "student.4.existingtest@snapwiz.com",
        stuName: "existingTest, student.4"
      }
    };

    const testdata = {
      className: "Automation Class - existingTest teacher.1",
      teacher: "teacher.1.existingtest@snapwiz.com",
      student: students[1].email,
      password: "snapwiz",
      assignmentName: `Smoke Test 1`,
      attemptsData: [
        {
          ...students[1],
          attempt: { Q1: "right", Q2: "right" },
          status: "Submitted"
        },
        { ...students[2], attempt: { Q1: "right", Q2: "wrong" }, status: "Submitted" },
        {
          ...students[3],
          attempt: { Q1: "right", Q2: "wrong" },
          status: "Submitted"
        },
        {
          ...students[4],
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
          testLibrary.assignPage.showOverRideSetting();
          testLibrary.assignPage.setMaxAttempt(1);
          testLibrary.assignPage.clickOnAssign();
        });

        // attempt and verify student side with 4 release grade options
        testRunner(testdata.assignmentName, aType, statsMap, questionTypeMap, testdata);
      });
    });
  });
});
