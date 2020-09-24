import FileHelper from "../../../../framework/util/fileHelper";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import { studentSide, teacherSide } from "../../../../framework/constants/assignmentStatus";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TeacherSideBar from "../../../../framework/author/SideBarPage";

const { _ } = Cypress;
const { LCB_3 } = require("../../../../../fixtures/testAuthoring");
const questionData = require("../../../../../fixtures/questionAuthoring");

const test = new StudentTestPage();
const lcb = new LiveClassboardPage();
const authorAssignmentPage = new AuthorAssignmentPage();
const testLibrary = new TestLibrary();
const teacherSidebar = new TeacherSideBar();
const students = {
  "1": {
    email: "student1.absent.red@snapwiz.com",
    stuName: "student1"
  },
  "2": {
    email: "student2.absent.red@snapwiz.com",
    stuName: "student2"
  },
  "3": {
    email: "student3.absent.red@snapwiz.com",
    stuName: "student3"
  }
};

const allWrong = { Q1: "wrong", Q2: "wrong", Q3: "wrong" };
const allRight = { Q1: "right", Q2: "right", Q3: "right" };
const allSkipped = { Q1: "skip", Q2: "skip", Q3: "skip" };

const noattempt = lcb.getNullifiedAttempts(allWrong);

const redirectTestData = {
  className: "Class",
  teacher: "teacher.absent@snapwiz.com",
  student: students[1].email,
  password: "snapwiz",
  assignmentName: "New Assessment LCB",
  attemptsData: [
    {
      attempt: { Q1: "right", Q2: "skip", Q3: "wrong" },
      status: studentSide.GRADED,
      ...students[1]
    },
    {
      attempt: { Q1: "wrong", Q2: "skip", Q3: "skip" },
      status: studentSide.IN_PROGRESS,
      ...students[2]
    },
    {
      attempt: { Q1: "noattempt", Q2: "noattempt", Q3: "noattempt" },
      status: studentSide.NOT_STARTED,
      ...students[3]
    }
  ],

  redirect5: {
    attempt: { ...allRight },
    status: studentSide.GRADED,
    ...students[3]
  }
};

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Redirect`, () => {
  const { attemptsData, student, teacher, className, password } = redirectTestData;
  const { itemKeys } = LCB_3;
  const statsMap = {};
  const questionTypeMap = lcb.getQuestionTypeMap(itemKeys, questionData, {});
  attemptsData.forEach(attempts => {
    const { attempt, email, stuName, status } = attempts;
    statsMap[stuName] = lcb.getScoreAndPerformance(attempt, questionTypeMap);
    statsMap[stuName].attempt = attempt;
    statsMap[stuName].status = status;
    statsMap[stuName].email = email;
  });
  let testId = "5f6205830d037c0007be0301";

  before(" > create new assessment and assign", () => {
    cy.deleteAllAssignments(student, teacher, password);
    cy.login("teacher", teacher, password);
    // testLibrary.createTest("LCB_3").then(id => {
    // testId = id;
    testLibrary.assignPage.visitAssignPageById(testId);
    testLibrary.assignPage.selectClass(className);
    testLibrary.assignPage.clickOnAssign();
    // });
  });

  before(" > attempt by all students", () => {
    attemptsData.forEach(attempts => {
      const { attempt, email, status } = attempts;
      test.attemptAssignment(email, status, attempt, questionTypeMap, password);
    });
  });

  describe(`> redirect absent student`, () => {
    const { stuName, email } = redirectTestData.redirect5;
    const attempt1 = { ...lcb.getScoreAndPerformance(noattempt, questionTypeMap), attempt: noattempt };

    before("login as teacher mark student absent", () => {
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.selectCheckBoxByStudentName(stuName);
      lcb.clickOnMarkAsAbsent();
    });

    it(" > redirect the student and verify card view", () => {
      lcb.uncheckSelectAllCheckboxOfStudent();
      lcb.clickOnRedirect();
      lcb.redirectPopup.clickOnAbsentStudents();
      // select redirect policy
      lcb.clickOnRedirectSubmit();
      lcb.verifyStudentCard(stuName, teacherSide.REDIRECTED, attempt1.score, attempt1.perf, attempt1.attempt, email);
      lcb.verifyRedirectIcon(stuName);
    });

    [0, 1].forEach(i => {
      it(`> hover and verify card attempt-${i ? "not started(redirected)" : "absent"}`, () => {
        const attempt = !i
          ? { perf: studentSide.NOT_STARTED, score: `- / ${statsMap[stuName].maxScore}` }
          : { perf: "0%", score: `- / ${statsMap[stuName].maxScore}` };
        lcb.clickOnCardViewTab();
        lcb.showMulipleAttemptsByStuName(stuName);
        lcb.verifyStudentScoreOnAttemptContainer(stuName, i, attempt.score);
        lcb.verifyStudentPerfOnAttemptContainer(stuName, i, attempt.perf);
        lcb.verifyAttemptNumberOnAttemptContainer(stuName, !i ? 2 : 1, i);
      });
    });

    it(` > verify student centric view,should be shown`, () => {
      lcb.clickOnStudentsTab();
      lcb.verifyStudentCentricCard(stuName, attempt1.attempt, questionTypeMap, true);
      // verify scores of current attemp and no improvement
      lcb.questionResponsePage.verifyTotalScoreAndImprovement(attempt1.totalScore, attempt1.maxScore, false);
    });

    it(` > verify question centric view,should be shown`, () => {
      lcb.clickonQuestionsTab();
      _.keys(attempt1.attempt).forEach(queNum => {
        lcb.questionResponsePage.selectQuestion(queNum);
        const { queKey, attemptData, points } = questionTypeMap[queNum];
        lcb.questionResponsePage.verifyQuestionResponseCard(
          points,
          queKey,
          attempt1.attempt[queNum],
          attemptData,
          false,
          stuName
        );
      });
    });
  });

  describe(`> redirect entire class - status checks only`, () => {
    const { score, perf } = lcb.getScoreAndPerformance(allSkipped, questionTypeMap);

    it(" > assign new assignment, mark all submit", () => {
      cy.deleteAllAssignments(student, teacher, password);
      cy.login("teacher", teacher, password);
      cy.visit(`/author/assignments/${testId}`);
      cy.wait("@assignment");
      testLibrary.assignPage.selectClass(className);
      testLibrary.assignPage.clickOnAssign();
      cy.contains("Success!");
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      cy.contains(className);
      lcb.checkSelectAllCheckboxOfStudent();
      lcb.clickOnMarkAsSubmit();
      lcb.header.verifyAssignmentStatus(teacherSide.IN_GRADING);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.verifyStatus(teacherSide.IN_GRADING);
    });

    it(" > redirect class and verify student cards", () => {
      teacherSidebar.clickOnDashboard();
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.uncheckSelectAllCheckboxOfStudent();
      lcb.clickOnRedirect();
      lcb.redirectPopup.clickOnEntireClass();
      // select redirect policy
      lcb.clickOnRedirectSubmit();
      attemptsData.forEach(user => {
        lcb.verifyStudentCard(user.stuName, teacherSide.REDIRECTED, score, perf, allSkipped, user.email);
        lcb.verifyRedirectIcon(user.stuName);
      });
      lcb.header.verifyAssignmentStatus(teacherSide.IN_PROGRESS);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.verifyStatus(teacherSide.IN_PROGRESS);
    });

    it(" > assign new assignment, mark all submit, mark as Done - Redirect Entrie class", () => {
      cy.deleteAllAssignments(student, teacher, password);
      cy.login("teacher", teacher, password);
      cy.visit(`/author/assignments/${testId}`);
      cy.wait("@assignment");
      testLibrary.assignPage.selectClass(className);
      testLibrary.assignPage.clickOnAssign();
      cy.contains("Success!");
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      cy.contains(className);
      lcb.checkSelectAllCheckboxOfStudent();
      lcb.clickOnMarkAsSubmit();
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.header.clickOnExpressGraderTab();
      lcb.header.clickOnLCBTab();
      cy.contains(className);
      lcb.header.clickOnMarkAsDone();
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.verifyStatus(teacherSide.DONE);
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.header.verifyAssignmentStatus(teacherSide.DONE);
      lcb.checkSelectAllCheckboxOfStudent();
      lcb.clickOnRedirect();
      lcb.redirectPopup.clickOnEntireClass();
      // select redirect policy
      lcb.clickOnRedirectSubmit();
      attemptsData.forEach(user => {
        lcb.verifyStudentCard(user.stuName, teacherSide.REDIRECTED, score, perf, allSkipped, user.email);
        lcb.verifyRedirectIcon(user.stuName);
      });
      lcb.header.verifyAssignmentStatus(teacherSide.IN_PROGRESS);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.verifyStatus(teacherSide.IN_PROGRESS);
    });
  });

  // TODO : add close date related redirect scenarios
  // TODO : add scenarios with non gradable question - question create module need to implemented for this
});
