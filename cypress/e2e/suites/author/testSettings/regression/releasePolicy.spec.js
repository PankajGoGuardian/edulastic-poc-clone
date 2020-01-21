import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import FileHelper from "../../../../framework/util/fileHelper";
import TestSettings from "../../../../framework/author/tests/testDetail/testSetting";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import ReportsPage from "../../../../framework/student/reportsPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import { releaseGradeTypes } from "../../../../framework/constants/assignmentStatus";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TestAssignPage from "../../../../framework/author/tests/testDetail/testAssignPage";

const lcb = new LiveClassboardPage();
const testLibrary = new TestLibrary();
const settings = new TestSettings();
const studentAssignment = new AssignmentsPage();
const report = new ReportsPage();
const test = new StudentTestPage();
const testAssign = new TestAssignPage();

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Assignment Flows`, () => {
  describe(`use existing test`, () => {
    const testdata = {
      className: "Class",
      teacher: "300@abc.com",
      student: "300@xyz.com",
      password: "snapwiz",
      assignmentName: `Smoke Test 1`,
      attemptsData: [
        {
          email: "300@xyz.com",
          stuName: "300",
          attempt: { Q1: "right", Q2: "right" },
          status: "Submitted"
        },
        {
          email: "301@xyz.com",
          stuName: "301",
          attempt: { Q1: "right", Q2: "wrong" },
          status: "Submitted"
        },
        {
          email: "302@xyz.com",
          stuName: "302",
          attempt: { Q1: "right", Q2: "wrong" },
          status: "Submitted"
        },
        {
          email: "303@xyz.com",
          stuName: "303",
          attempt: { Q1: "right", Q2: "wrong" },
          status: "Submitted"
        }
      ]
    };

    let questionData;
    let testId;
    let testData;
    const questionTypeMap = {};
    const statsMap = {};
    const { attemptsData, student, teacher, password, className } = testdata;

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

    context(`> assigned as - CLASS_ASSESSMENT`, () => {
      before("delete old assignment and assigned new", () => {
        cy.deleteAllAssignments(student, teacher, password);
        cy.login("teacher", teacher, password);
        testLibrary.createTest("SMOKE_1").then(id => {
          testId = id;
          testLibrary.clickOnAssign();
          testLibrary.assignPage.selectClass(className);
          testLibrary.assignPage.clickOnAssign();
        });
      });

      // attempt and verify student side with 4 release grade options
      context("> scoring policy - 'Do not release scores or responses'", () => {
        const { email, status, attempt, stuName } = attemptsData[0];

        it(`> teacher update release grade policy - ${releaseGradeTypes.DONT_RELEASE}`, () => {
          cy.login("teacher", teacher, password);
          cy.deleteAllAssignments("300@xyz.com", "300@abc.com");
          testLibrary.sidebar.clickOnTestLibrary();
          testLibrary.searchFilters.clearAll();
          testLibrary.clickOnTestCardById(testId);
          testLibrary.clickOnDetailsOfCard();
          testLibrary.publishedToDraft();
          testLibrary.header.clickOnSettings();
          settings.setRealeasePolicy(releaseGradeTypes.DONT_RELEASE);
          settings.header.clickOnPublishButton();
          cy.contains("Share With Others");
          testLibrary.clickOnAssign();
          testAssign.selectClass("Class");
          testAssign.clickOnAssign();
        });

        it(`> attempt by ${stuName}`, () => {
          test.attemptAssignment(email, status, attempt, questionTypeMap, password, "CLASS_ASSESSMENT");
        });

        it("> verify stats on report page", () => {
          report.validateAssignment(testdata.assignmentName, "GRADED");
          report.validateStats("1", "1/1");
        });
      });

      context("> scoring policy - 'Release scores only'", () => {
        const { email, status, attempt, stuName } = attemptsData[1];
        // TODO: remove below once find permanent solution for Leave Site pop up
        before(() => {
          test.clickOnExitTest();
        });

        it(`> teacher update release grade policy - ${releaseGradeTypes.SCORE_ONLY}`, () => {
          cy.login("teacher", teacher, password);
          cy.deleteAllAssignments("300@xyz.com", "300@abc.com");
          testLibrary.sidebar.clickOnTestLibrary();
          testLibrary.searchFilters.clearAll();
          testLibrary.clickOnTestCardById(testId);
          testLibrary.clickOnDetailsOfCard();
          testLibrary.publishedToDraftAssigned();
          testLibrary.getVersionedTestID().then(id => {
            testId = id;
            testLibrary.header.clickOnSettings();
            settings.setRealeasePolicy(releaseGradeTypes.SCORE_ONLY);
            settings.header.clickOnPublishButton();
            cy.contains("Share With Others");
            testLibrary.clickOnAssign();
            testAssign.selectClass("Class");
            testAssign.clickOnAssign();
          });
        });

        it(`> attempt by ${stuName}`, () => {
          test.attemptAssignment(email, status, attempt, questionTypeMap, password, "CLASS_ASSESSMENT");
        });

        it("> verify stats on report page", () => {
          const { perfValue } = statsMap[stuName];
          report.validateAssignment(testdata.assignmentName, "GRADED");
          report.validateStats("1", "1/1", undefined, perfValue);
        });
      });

      context("> scoring policy - 'Release scores and student responses'", () => {
        const { email, status, attempt, stuName } = attemptsData[2];
        // TODO: remove below once find permanent solution for Leave Site pop up
        before(() => {
          test.clickOnExitTest();
        });

        it(`> teacher update release grade policy - ${releaseGradeTypes.WITH_RESPONSE}`, () => {
          cy.login("teacher", teacher, password);
          cy.deleteAllAssignments("300@xyz.com", "300@abc.com");
          testLibrary.sidebar.clickOnTestLibrary();
          testLibrary.searchFilters.clearAll();
          testLibrary.clickOnTestCardById(testId);
          testLibrary.clickOnDetailsOfCard();
          testLibrary.publishedToDraftAssigned();
          testLibrary.getVersionedTestID().then(id => {
            testId = id;
            testLibrary.header.clickOnSettings();
            settings.setRealeasePolicy(releaseGradeTypes.WITH_RESPONSE);
            settings.header.clickOnPublishButton();
            cy.contains("Share With Others");
            testLibrary.clickOnAssign();
            testAssign.selectClass("Class");
            testAssign.clickOnAssign();
          });
        });

        it(`> attempt by ${stuName}`, () => {
          test.attemptAssignment(email, status, attempt, questionTypeMap, password, "CLASS_ASSESSMENT");
        });

        it("> verify stats on report page", () => {
          const { perfValue } = statsMap[stuName];
          report.validateAssignment(testdata.assignmentName, "GRADED", "REVIEW");
          report.validateStats("1", "1/1", undefined, perfValue);
        });

        it("> review assignment", () => {
          report.clickOnReviewButtonButton();
          report.verifyAllQuetionCard(stuName, attempt, questionTypeMap, releaseGradeTypes.WITH_RESPONSE);
        });
      });

      context("> scoring policy - 'Release scores,student responses and correct answers'", () => {
        const { email, status, attempt, stuName } = attemptsData[3];
        // TODO: remove below once find permanent solution for Leave Site pop up
        before(() => {
          test.clickOnExitTest();
        });

        it(`> teacher update release grade policy - ${releaseGradeTypes.WITH_ANSWERS}`, () => {
          cy.login("teacher", teacher, password);
          cy.deleteAllAssignments("300@xyz.com", "300@abc.com");
          testLibrary.sidebar.clickOnTestLibrary();
          testLibrary.searchFilters.clearAll();
          testLibrary.clickOnTestCardById(testId);
          testLibrary.clickOnDetailsOfCard();
          testLibrary.publishedToDraftAssigned();
          testLibrary.getVersionedTestID().then(id => {
            testId = id;
            testLibrary.header.clickOnSettings();
            settings.setRealeasePolicy(releaseGradeTypes.WITH_ANSWERS);
            settings.header.clickOnPublishButton();
            cy.contains("Share With Others");
            testLibrary.clickOnAssign();
            testAssign.selectClass("Class");
            testAssign.clickOnAssign();
          });
        });

        it(`> attempt by ${stuName}`, () => {
          test.attemptAssignment(email, status, attempt, questionTypeMap, password, "CLASS_ASSESSMENT");
        });

        it("> verify stats on report page", () => {
          const { score, perfValue } = statsMap[stuName];
          report.validateAssignment(testdata.assignmentName, "GRADED", "REVIEW");
          report.validateStats("1", "1/1", score, perfValue);
        });

        it("> review assignment", () => {
          report.clickOnReviewButtonButton();
          report.verifyAllQuetionCard(stuName, attempt, questionTypeMap, releaseGradeTypes.WITH_ANSWERS);
        });
      });
    });
  });
});
