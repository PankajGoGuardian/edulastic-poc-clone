import AssignmentsPage from "../student/assignmentsPage";
import ReportsPage from "../student/reportsPage";
import StudentTestPage from "../student/studentTestPage";
import AuthorAssignmentPage from "../author/assignments/AuthorAssignmentPage";
import TeacherSideBar from "../author/SideBarPage";
import { releaseGradeTypes } from "../constants/assignmentStatus";

const studentAssignment = new AssignmentsPage();
const report = new ReportsPage();
const test = new StudentTestPage();
const authorAssignmentPage = new AuthorAssignmentPage();
const teacherSideBar = new TeacherSideBar();

export function testRunner(assignmentName, aType, statsMap, questionTypeMap, testAttemptData) {
  const { attemptsData, teacher, password } = testAttemptData;
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
      studentAssignment.clickOnAllAssignments();
      studentAssignment.getAssignmentButton().should("be.visible");

      studentAssignment.clickOnNotStarted();
      studentAssignment.getAssignmentButton().should("be.visible");

      studentAssignment.clickOnInProgress();
      studentAssignment.getAssignmentButton().should("not.be.visible");

      /*  // inprogress
          studentAssignment.clickOnAllAssignments();
          studentAssignment.getAssignmentButton().click({ force: true });
          test.clickOnExitTest();
          test.clickOnProceed();
  
          studentAssignment.validateAssignment(assignmentName, "IN PROGRESS", "RESUME", "A");
  
          studentAssignment.clickOnAllAssignments();
          studentAssignment.getAssignmentButton().should("be.visible");
  
          studentAssignment.clickOnNotStarted();
          studentAssignment.getAssignmentButton().should("not.be.visible");
  
          studentAssignment.clickOnInProgress();
          studentAssignment.getAssignmentButton().should("be.visible"); */
    });
  });

  context("> scoring policy - 'Do not release scores or responses'", () => {
    const { email, status, attempt, stuName } = attemptsData[0];

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
      report.verifyQuetionCard(stuName, attempt, questionTypeMap, releaseGradeTypes.WITH_RESPONSE);
    });
  });

  context("> scoring policy - 'Release scores,student responses and correct answers'", () => {
    const { email, status, attempt, stuName } = attemptsData[3];

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
      report.verifyQuetionCard(stuName, attempt, questionTypeMap, releaseGradeTypes.WITH_ANSWERS);
    });
  });
}
