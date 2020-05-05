import FileHelper from "../../../../../framework/util/fileHelper";
import TestLibrary from "../../../../../framework/author/tests/testLibraryPage";
import AssignmentsPage from "../../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../../framework/student/studentTestPage";
import AuthorAssignmentPage from "../../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../../framework/author/assignments/LiveClassboardPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)}>> timed assignment-update settings`, () => {
  const testlibraryPage = new TestLibrary();
  const studentAssignmentsPage = new AssignmentsPage();
  const studentTestPage = new StudentTestPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const liveClassboardPage = new LiveClassboardPage();

  const user = {
    teacher: "teacher.update.timer@snapwiz.com",
    student1: "student1.updatetime@snapwiz.com",
    student2: "student2.updatetime@snapwiz.com",
    pass: "snapwiz"
  };
  const customtestTime = "3";
  const updatedtime = "10";

  let startTime;
  let customtestid;

  context(">assign and update time settings", () => {
    before(">create test", () => {
      cy.deleteAllAssignments("", user.teacher);
      cy.login("teacher", user.teacher, user.pass);
      testlibraryPage.createTest().then(id => {
        customtestid = id;
      });
    });

    it(">set time limit as on-'custom'", () => {
      testlibraryPage.clickOnAssign();
      testlibraryPage.assignPage.showOverRideSetting();
      /* time will be 3mns and allow exit is enabled */
      testlibraryPage.assignPage.setAssignmentTime(customtestTime);
      testlibraryPage.assignPage.verifyTimeAssignedForTest(customtestTime);
    });

    it(">assign the test", () => {
      testlibraryPage.assignPage.verifyInfoAboutTestTime();
      testlibraryPage.assignPage.selectClass("Class");
      testlibraryPage.assignPage.clickOnAssign();
    });

    it(">verify and attempt-'student 1'", () => {
      /* student1 will be in in progess and student2 will be in not started */
      cy.login("student", user.student1, user.pass);
      studentAssignmentsPage.verifyTimeAvalableForTestById(customtestid, customtestTime);
      studentAssignmentsPage.clickOnAssigmentByTestId(customtestid, { time: 3 });

      studentTestPage.waitWhileAttempt("00:00:10");
      studentTestPage.verifyAndGetRemainingTime("00:02:50", 10).then(startTime => {
        /* wait for one minute, so that time limit becomes exactly 2 mns(1 minute is used) and save and exit */
        studentTestPage.waitWhileAttempt(`00:00:${startTime - 120}`);
        studentTestPage.verifyAndGetRemainingTime("00:02:00", 3);
        studentTestPage.clickOnExitTest();
      });
    });

    it(">login as teacher and update settings", () => {
      cy.login("teacher", user.teacher, user.pass);
      testlibraryPage.sidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      liveClassboardPage.header.clickLCBSettings();

      liveClassboardPage.settings.showTestLevelSettings();
      liveClassboardPage.settings.allowToUpdateTimeSetting();

      /* increase time to 10 minutes and disable allow exit */
      liveClassboardPage.settings.setAssignmentTime(updatedtime);
      liveClassboardPage.settings.disableAllowExit();
      liveClassboardPage.settings.clickUpadeSettings();
    });

    it(">verify at studnet-1-'in progress'", () => {
      cy.login("student", user.student1, user.pass);
      studentAssignmentsPage.verifyTimeAvalableForTestById(customtestid, updatedtime);
      studentAssignmentsPage.clickOnAssigmentByTestId(customtestid);

      studentTestPage.waitWhileAttempt("00:00:10");
      studentTestPage.verifyAndGetRemainingTime("00:08:50", 10);
      /* since time is updated to 10 mns and student1 is already used 1 minute, he should get 9 minutes and remaining time */

      studentTestPage.getExitButton().should("not.exist");
      studentTestPage.clickOnNext(false, true);
      studentTestPage.submitTest();
    });

    it(">verify at student-2-'not started'", () => {
      studentTestPage.clickOnExitTest();
      cy.login("student", user.student2, user.pass);
      studentAssignmentsPage.verifyTimeAvalableForTestById(customtestid, updatedtime);
      studentAssignmentsPage.clickOnAssigmentByTestId(customtestid, { time: updatedtime, isExitAllowed: false });

      studentTestPage.waitWhileAttempt("00:00:10");
      studentTestPage.verifyAndGetRemainingTime("00:09:50", 10);
      /* since student2 is in not started status he should get whole 10 mns */
      studentTestPage.getExitButton().should("not.exist");
      studentTestPage.clickOnNext(false, true);
      studentTestPage.submitTest();
    });
    context(">redirect", () => {
      before(">ridirect the test", () => {
        studentTestPage.clickOnExitTest();
        cy.login("teacher", user.teacher, user.pass);
        testlibraryPage.sidebar.clickOnAssignment();
        authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
        liveClassboardPage.checkSelectAllCheckboxOfStudent();
        liveClassboardPage.clickOnRedirect();
        liveClassboardPage.clickOnRedirectSubmit();
      });

      it(">verify at studnet-1", () => {
        cy.login("student", user.student1, user.pass);
        studentAssignmentsPage.verifyTimeAvalableForTestById(customtestid, updatedtime);
        studentAssignmentsPage.clickOnAssigmentByTestId(customtestid, {
          time: updatedtime,
          isExitAllowed: false,
          isFirstAttempt: false
        });

        studentTestPage.waitWhileAttempt("00:00:10");
        studentTestPage.verifyAndGetRemainingTime("00:09:50", 10);

        studentTestPage.getExitButton().should("not.exist");
        studentTestPage.clickOnNext(false, true);
        studentTestPage.submitTest();
      });

      it(">verify at student-2", () => {
        studentTestPage.clickOnExitTest();
        cy.login("student", user.student2, user.pass);
        studentAssignmentsPage.verifyTimeAvalableForTestById(customtestid, updatedtime);
        studentAssignmentsPage.clickOnAssigmentByTestId(customtestid, {
          time: updatedtime,
          isExitAllowed: false,
          isFirstAttempt: false
        });

        studentTestPage.waitWhileAttempt("00:00:10");
        studentTestPage.verifyAndGetRemainingTime("00:09:50", 10);

        studentTestPage.getExitButton().should("not.exist");
        studentTestPage.clickOnNext(false, true);
        studentTestPage.submitTest();
      });
    });
  });
});
