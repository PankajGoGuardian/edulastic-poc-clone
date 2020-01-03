import AssignmentsPage from "../student/assignmentsPage";
import ReportsPage from "../student/reportsPage";
import StudentTestPage from "../student/studentTestPage";
import AuthorAssignmentPage from "../author/assignments/AuthorAssignmentPage";
import TeacherSideBar from "../author/SideBarPage";
import { releaseGradeTypes, studentSide } from "../constants/assignmentStatus";
import LiveClassboardPage from "../author/assignments/LiveClassboardPage";
import BarGraph from "../author/assignments/barGraphs";
import SidebarPage from "../student/sidebarPage";

const { _ } = Cypress;
const studentAssignment = new AssignmentsPage();
const report = new ReportsPage();
const test = new StudentTestPage();
const authorAssignmentPage = new AuthorAssignmentPage();
const teacherSideBar = new TeacherSideBar();
const lcb = new LiveClassboardPage();
const bargraph = new BarGraph();
const sidebarPage = new SidebarPage();

export function testRunner(assignmentName, aType, statsMap, questionTypeMap, testAttemptData) {
  const { attemptsData, teacher, password } = testAttemptData;
  const allStudentList = attemptsData.map(item => item.stuName);
  const queList = _.keys(attemptsData[1].attempt);
  const submittedInprogressStudentList = attemptsData
    .filter(({ status }) => status !== studentSide.NOT_STARTED)
    .map(item => item.stuName);
  const queBarData = bargraph.getQueBarData(queList, attemptsData);

  context("> verify student dashboard", () => {
    it("> verify assignment entry on student dashboard", () => {
      const { email } = attemptsData[0];
      cy.login("student", email, password);
      studentAssignment.validateAssignment(
        assignmentName,
        "NOT STARTED",
        "START ASSIGNMENT",
        aType === "CLASS_ASSESSMENT" ? "A" : "P"
      );
    });

    it("> verify assignment filters", () => {
      // All Assignment
      studentAssignment.getAllAssignments().click();
      studentAssignment.getAssignmentButton().should("be.visible");

      // Not Started
      studentAssignment.getNotStarted().click();
      studentAssignment.getAssignmentButton().should("be.visible");

      // In Progress
      studentAssignment.getInProgress().click();
      studentAssignment.getAssignmentButton().should("not.be.visible");
    });
  });

  context("> scoring policy - 'Do not release scores or responses'", () => {
    const { email, status, attempt, stuName } = attemptsData[0];

    it(`> teacher update release grade policy - ${releaseGradeTypes.DONT_RELEASE}`, () => {
      cy.login("teacher", teacher, password);
      teacherSideBar.clickOnAssignment();
      authorAssignmentPage.setReleaseGradeOption(releaseGradeTypes.DONT_RELEASE);
    });

    it(`> attempt by ${stuName}`, () => {
      test.attemptAssignment(email, status, attempt, questionTypeMap, password, aType);
    });

    it("> verify stats on report page", () => {
      report.validateAssignment(assignmentName, "GRADED");
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
      teacherSideBar.clickOnAssignment();
      authorAssignmentPage.setReleaseGradeOption(releaseGradeTypes.SCORE_ONLY);
    });

    it(`> attempt by ${stuName}`, () => {
      test.attemptAssignment(email, status, attempt, questionTypeMap, password, aType);
    });

    it("> verify stats on report page", () => {
      const { perfValue } = statsMap[stuName];
      report.validateAssignment(assignmentName, "GRADED");
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
      teacherSideBar.clickOnAssignment();
      authorAssignmentPage.setReleaseGradeOption(releaseGradeTypes.WITH_RESPONSE);
    });

    it(`> attempt by ${stuName}`, () => {
      test.attemptAssignment(email, status, attempt, questionTypeMap, password, aType);
    });

    it("> verify stats on report page", () => {
      const { perfValue } = statsMap[stuName];
      report.validateAssignment(assignmentName, "GRADED", "REVIEW");
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
      teacherSideBar.clickOnAssignment();
      authorAssignmentPage.setReleaseGradeOption(releaseGradeTypes.WITH_ANSWERS);
    });

    it(`> attempt by ${stuName}`, () => {
      test.attemptAssignment(email, status, attempt, questionTypeMap, password, aType);
    });

    it("> verify stats on report page", () => {
      const { score, perfValue } = statsMap[stuName];
      report.validateAssignment(assignmentName, "GRADED", "REVIEW");
      report.validateStats("1", "1/1", score, perfValue);
    });

    it("> review assignment", () => {
      report.clickOnReviewButtonButton();
      report.verifyAllQuetionCard(stuName, attempt, questionTypeMap, releaseGradeTypes.WITH_ANSWERS);
    });
  });

  context("> verify teacher lcb", () => {
    before(() => {
      // TODO: remove below once find permanent solution for Leave Site pop up
      test.clickOnExitTest();
      cy.login("teacher", teacher, password);
      teacherSideBar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
    });

    context("> verify LCB card view", () => {
      it("> verify avg score", () => {
        lcb.verifyAvgScore(statsMap);
      });

      it("> verify submitted count", () => {
        lcb.verifySubmittedCount(
          attemptsData.filter(eachStudent => eachStudent.status === studentSide.SUBMITTED).length,
          attemptsData.length
        );
      });

      allStudentList.forEach(studentName => {
        it(`> verify student cards for :: ${studentName}`, () => {
          const { status: sts, score, perf, attempt: atmpt } = statsMap[studentName];
          lcb.verifyStudentCard(studentName, sts, score, perf, atmpt);
        });
      });

      context("> verify bar graphs", () => {
        it("> verify question bars", () => {
          bargraph.verifyXAxisTicks(queList);
        });

        it("> verify left axis scale value", () => {
          bargraph.veryLeftYAxisScale(submittedInprogressStudentList.length);
        });

        it(`> verify bar tool tip`, () => {
          queList.forEach((que, index) => {
            bargraph.verifyQueToolTip(que, index, queBarData[que]);
          });
        });
      });
    });

    context("> verify student centric view", () => {
      before("student tab click", () => {
        lcb.clickOnStudentsTab();
      });
      submittedInprogressStudentList.forEach(studentName => {
        it(`> verify student centric view for :: ${studentName}`, () => {
          const { attempt: atmpt } = statsMap[studentName];
          lcb.verifyStudentCentricCard(studentName, atmpt, questionTypeMap);
        });
      });
    });

    context("> update score,giving feedback and verify student side", () => {
      const { email, attempt, stuName } = attemptsData[3];
      const updatedAttempt = {};
      const feedback = "You are right..!";
      const overallFeedback = "Keep the good learning";
      // making all the attempt correct
      _.keys(attempt).forEach(que => {
        updatedAttempt[que] = "right";
      });

      before("question centric view", () => {
        lcb.clickonQuestionsTab();
      });

      it(`> updating the scores and giving feedback for :: ${stuName}`, () => {
        lcb.updateScore(stuName, lcb.getFeedBackScore(updatedAttempt, questionTypeMap), feedback);
      });

      it("> giving overall feedback", () => {
        lcb.clickOnStudentsTab();
        lcb.questionResponsePage.selectStudent(stuName);
        lcb.questionResponsePage.enterOverAllFeedback(overallFeedback);
        lcb.questionResponsePage
          .getOverallFeedback()
          .should("contain.text", overallFeedback, "verify the overall feedback is updated");

        // TODO: add student side assertion once functionality is implemented in app
      });

      it("> verify stats on report page", () => {
        const { score, perfValue } = lcb.getScoreAndPerformance(updatedAttempt, questionTypeMap);
        cy.login("student", email, password);
        sidebarPage.clickOnGrades();
        report.validateStats("1", "1/1", score, perfValue);
        report.clickOnReviewButtonButton();
        Object.keys(updatedAttempt).forEach(queNum => {
          const attemptType = updatedAttempt[queNum];
          report.selectQuestion(queNum);
          const { queKey, attemptData, points } = questionTypeMap[queNum];
          const questionType = queKey.split(".")[0];
          report.verifyScore(points, attemptData, attemptType, questionType);
          report.verifyFeedBackComment(feedback);
        });
      });
    });
  });
}
