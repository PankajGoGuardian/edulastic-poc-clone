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
    const testdata = {
      className: "Smoke Automation Class",
      teacher: "teacher1.smoke.automation@snapwiz.com",
      student: "student1.smoke.automation@snapwiz.com",
      password: "automation",
      assignmentName: `Smoke Test 1`,
      attemptsData: [
        {
          email: "student1.smoke.automation@snapwiz.com",
          stuName: "smoke, student1",
          attempt: { Q1: "right", Q2: "right" },
          status: "Submitted"
        },
        {
          email: "student2.smoke.automation@snapwiz.com",
          stuName: "smoke, student2",
          attempt: { Q1: "right", Q2: "wrong" },
          status: "Submitted"
        },
        {
          email: "student3.smoke.automation@snapwiz.com",
          stuName: "smoke, student3",
          attempt: { Q1: "right", Q2: "wrong" },
          status: "Submitted"
        },
        {
          email: "student4.smoke.automation@snapwiz.com",
          stuName: "smoke, student4",
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
          testLibrary.assignPage.clickOnAssign();
        });

        // attempt and verify student side with 4 release grade options
        testRunner(testdata.assignmentName, aType, statsMap, questionTypeMap, testdata);
      });
    });
  });
});
