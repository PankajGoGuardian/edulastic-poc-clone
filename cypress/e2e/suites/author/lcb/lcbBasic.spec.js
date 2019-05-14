import FileHelper from "../../../framework/util/fileHelper";
import AssignmentsPage from "../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../framework/student/studentTestPage";
import LiveClassboardPage from "../../../framework/author/LiveClassboardPage";
import AuthorAssignmentPage from "../../../framework/author/AuthorAssignmentPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Teacher Assignment page UI`, () => {
  const attemptsData = [
    {
      email: "auto.lcb.student01@yopmail.com",
      stuName: "Student01",
      attempt: { Q1: "right", Q2: "right" },
      status: "SUBMITTED"
    },
    {
      email: "auto.lcb.student02@yopmail.com",
      stuName: "Student02",
      attempt: { Q1: "right", Q2: "wrong" },
      status: "SUBMITTED"
    },
    {
      email: "auto.lcb.student03@yopmail.com",
      stuName: "Student03",
      attempt: { Q1: "wrong", Q2: "right" },
      status: "SUBMITTED"
    },
    {
      email: "auto.lcb.student04@yopmail.com",
      stuName: "Student04",
      attempt: { Q1: "wrong", Q2: "skip" },
      status: "SUBMITTED"
    },
    {
      email: "auto.lcb.student05@yopmail.com",
      stuName: "Student05",
      attempt: { Q1: "right", Q2: "skip" },
      status: "SUBMITTED"
    },
    {
      email: "auto.lcb.student06@yopmail.com",
      stuName: "Student06",
      status: "NOT STARTED",
      attempt: { Q1: "skip", Q2: "skip" }
    }
  ];

  let questionData;
  const questionTypeMap = {};
  let testData;
  let statsMap = {};

  // TODO : will move below data into test data files
  const testId = "5cd9385f163c8a4fea055823";
  const teacher = "auto.lcb.teacher01@yopmail.com";
  const student = "auto.lcb.student01@yopmail.com";

  const assignmentPage = new AssignmentsPage();
  const test = new StudentTestPage();
  const lcb = new LiveClassboardPage();
  const authorAssignmentPage = new AuthorAssignmentPage();

  before(" > create new assessment and assign", () => {
    cy.fixture("questionAuthoring").then(queData => {
      questionData = queData;
    });

    cy.fixture("testAuthoring").then(({ LCB_1 }) => {
      testData = LCB_1;
      const { itemKeys } = testData;
      itemKeys.forEach((queKey, index) => {
        const [queType, questionKey] = queKey.split(".");
        console.log("questionData :: ", questionData);
        const { points } = questionData[queType][questionKey].setAns;
        const queMap = { queKey: queKey, points: points };
        questionTypeMap[`Q${index + 1}`] = queMap;
      });
    });

    // TODO : add this block once add-item page is fixed while creating new assessment
    // For now assigning pre created test
    cy.deleteAllAssignments(student, teacher);
    cy.login("teacher", teacher);
    cy.assignAssignment(testId, undefined, undefined, "LCB1");
  });

  before(" > attempt by all students", () => {
    attemptsData.forEach(attempts => {
      console.log("attempts ::", attempts);
      const { attempt, email, stuName, status } = attempts;

      statsMap[stuName] = lcb.getScoreAndPerformance(attempt, questionTypeMap);
      statsMap[stuName].attempt = attempt;
      statsMap[stuName].status = status;

      if (status !== "NOT STARTED") {
        cy.login("student", email);
        assignmentPage.clickOnAssignmentButton();
        Object.keys(attempt).forEach(queNum => {
          const [queType, questionKey] = questionTypeMap[queNum].queKey.split(".");
          const { attemptData } = questionData[queType][questionKey];
          test.attemptQuestion(queType, attempt[queNum], attemptData);
          test.getNext().click();
        });
        test.submitTest();
        cy.contains("Reports").should("be.visible");
      }
    });
  });

  context(" > Verify LCB tab test cases", () => {
    before("login as teacher", () => {
      cy.login("teacher", teacher);
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
    });

    it(` verifying all student card`, () => {
      Object.keys(statsMap).forEach(studentName => {
        const { status, score, perf, attempt } = statsMap[studentName];
        lcb.verifyStudentCard(studentName, status, score, perf, attempt);
      });
    });
  });

  describe(" > Verify Summary tab test cases", () => {
    // TODO : add summary tests
  });
});
