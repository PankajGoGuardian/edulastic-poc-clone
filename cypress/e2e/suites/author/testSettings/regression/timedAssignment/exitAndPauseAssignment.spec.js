import FileHelper from "../../../../../framework/util/fileHelper";
import TestLibrary from "../../../../../framework/author/tests/testLibraryPage";
import AssignmentsPage from "../../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../../framework/student/studentTestPage";
import AuthorAssignmentPage from "../../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../../framework/author/assignments/LiveClassboardPage";
import { queColor } from "../../../../../framework/constants/questionTypes";
import CypressHelper from "../../../../../framework/util/cypressHelpers";

describe(`${FileHelper.getSpecName(Cypress.spec.name)}>> timed assignment -exit and puase test`, () => {
  const testlibraryPage = new TestLibrary();
  const studentAssignmentsPage = new AssignmentsPage();
  const studentTestPage = new StudentTestPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const liveClassboardPage = new LiveClassboardPage();

  const user = {
    teacher: "teacher1.timed.test@snapwiz.com",
    student1: "student1.timetest@snapwiz.com",
    pass: "snapwiz"
  };
  const customtestTime = "3";

  let startTime;
  let customtestid;

  context(">exit -test", () => {
    context(">when exit is disabled", () => {
      before(">create test", () => {
        cy.deleteAllAssignments("", user.teacher);
        cy.login("teacher", user.teacher, user.pass);
        testlibraryPage.createTest().then(id => {
          customtestid = id;
        });
        testlibraryPage.assignPage.visitAssignPageById(customtestid);
      });

      it(">set time limit and disable allow exit", () => {
        testlibraryPage.clickOnAssign();
        testlibraryPage.assignPage.showOverRideSetting();
        testlibraryPage.assignPage.setAssignmentTime();
        testlibraryPage.assignPage.disableAllowExit();
      });

      it(">assign the test", () => {
        testlibraryPage.assignPage.selectClass("Class");
        testlibraryPage.assignPage.clickOnAssign();
      });

      it(">verify at student side-'no exist'", () => {
        cy.login("student", user.student1, user.pass);
        studentAssignmentsPage.verifyTimeAvalableForTestById(customtestid, 1);
        studentAssignmentsPage.clickOnAssigmentByTestId(customtestid, { time: 1, exitAllowed: false });

        studentTestPage.waitWhileAttempt("00:00:10");
        studentTestPage.getCountdownText().then(time => {
          startTime = CypressHelper.hoursToSeconds(time);
          expect(
            startTime > 40 && startTime < 60,
            `expected UI time is between 40 and 60 in seconds and got ${startTime} seconds`
          ).to.be.true;

          studentTestPage.getExitButton().should("not.exist");
          studentTestPage.waitWhileAttempt(`00:00:${startTime}`);
          studentTestPage.clickOkOnTimeOutPopUp();
        });
      });
    });

    context(">when exit is enabled", () => {
      before(">create test", () => {
        studentTestPage.clickOnExitTest();
        cy.deleteAllAssignments("", user.teacher);
        cy.login("teacher", user.teacher, user.pass);
        testlibraryPage.assignPage.visitAssignPageById(customtestid);
      });

      it(">set time limit with allow pause", () => {
        testlibraryPage.assignPage.showOverRideSetting();
        testlibraryPage.assignPage.setAssignmentTime(customtestTime);
        testlibraryPage.assignPage.enableAllowExit();
      });

      it(">assign the test", () => {
        testlibraryPage.assignPage.selectClass("Class");
        testlibraryPage.assignPage.clickOnAssign();
      });

      context(">verify at student side-'allow exit'", () => {
        before(">login", () => {
          cy.login("student", user.student1, user.pass);
          studentAssignmentsPage.verifyTimeAvalableForTestById(customtestid, customtestTime);
          studentAssignmentsPage.clickOnAssigmentByTestId(customtestid, { time: 3 });
        });

        it(">attempt-1 -'exit'", () => {
          studentTestPage.waitWhileAttempt("00:00:10");
          studentTestPage.getCountdownText().then(time => {
            startTime = CypressHelper.hoursToSeconds(time);
            expect(
              startTime > 160 && startTime < 180,
              `expected UI time is between 160 and 120 seconds and got ${startTime} seconds`
            ).to.be.true;

            studentTestPage.waitWhileAttempt(`00:00:${startTime - 120}`);
            studentTestPage.verifyRemainingTime("00:02:00");
            studentTestPage.clickOnExitTest();
          });
        });

        it(">attempt-2 -'re-attempt and exit'", () => {
          studentTestPage.waitWhileAttempt("00:00:15");
          studentAssignmentsPage.clickOnAssigmentByTestId(customtestid);
          studentTestPage.waitWhileAttempt("00:00:10");

          studentTestPage.getCountdownText().then(time => {
            startTime = CypressHelper.hoursToSeconds(time);
            expect(
              startTime > 100 && startTime < 120,
              `expected UI time is between 100 and 120 seconds and got ${startTime} seconds`
            ).to.be.true;

            studentTestPage.getCountDown().should("have.css", "color", queColor.RED);
            studentTestPage.waitWhileAttempt(`00:00:${startTime - 60}`);
            studentTestPage.verifyRemainingTime("00:01:00");
            studentTestPage.clickOnExitTest();
          });
        });

        it(">attempt-3- 'login again and re-attempt'", () => {
          cy.login("student", user.student1, user.pass);
          studentTestPage.waitWhileAttempt("00:00:10");
          studentAssignmentsPage.clickOnAssigmentByTestId(customtestid);
          studentTestPage.waitWhileAttempt("00:00:10");

          studentTestPage.getCountdownText().then(time => {
            startTime = CypressHelper.hoursToSeconds(time);
            expect(
              startTime > 45 && startTime < 60,
              `expected UI time is between 45 and 60 in seconds and got ${startTime} seconds`
            ).to.be.true;

            studentTestPage.getCountDown().should("have.css", "color", queColor.RED);
            studentTestPage.waitWhileAttempt(`00:00:${startTime}`);
            studentTestPage.clickOkOnTimeOutPopUp();
          });
        });
      });
    });
  });

  context(">teacher pause assignment", () => {
    before(">create test", () => {
      studentTestPage.clickOnExitTest();
      cy.deleteAllAssignments("", user.teacher);
      cy.login("teacher", user.teacher, user.pass);
      testlibraryPage.assignPage.visitAssignPageById(customtestid);
    });

    before(">set time limit with allow exit", () => {
      testlibraryPage.assignPage.showOverRideSetting();
      testlibraryPage.assignPage.setAssignmentTime(customtestTime);
      testlibraryPage.assignPage.enableAllowExit();
    });

    before(">assign the test", () => {
      testlibraryPage.assignPage.selectClass("Class");
      testlibraryPage.assignPage.clickOnAssign();
    });

    context(">verify student side and pause test", () => {
      it(">student attempt-1-'assignment is open'", () => {
        cy.login("student", user.student1, user.pass);
        studentAssignmentsPage.clickOnAssigmentByTestId(customtestid, { time: customtestTime });
        studentTestPage.waitWhileAttempt("00:00:10");

        studentTestPage.getCountdownText().then(time => {
          startTime = CypressHelper.hoursToSeconds(time);
          expect(
            startTime > 160 && startTime < 180,
            `expected UI time is between 140 and 180 in seconds and got ${startTime} seconds`
          ).to.be.true;

          studentTestPage.waitWhileAttempt(`00:00:${startTime - 120}`);
          studentTestPage.verifyRemainingTime("00:02:00");
          studentTestPage.clickOnExitTest();
        });
      });

      it(">login as teacher and pause assignment", () => {
        studentTestPage.clickOnExitTest();
        cy.login("teacher", user.teacher, user.pass);
        testlibraryPage.sidebar.clickOnAssignment();
        authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
        liveClassboardPage.header.clickOnOpenPause(true);
      });

      it(">verify student side-'assignment is paused'", () => {
        cy.login("student", user.student1, user.pass);
        studentAssignmentsPage.verifyTimeAvalableForTestById(customtestid, customtestTime);
        studentAssignmentsPage.verifyAssignmentIslocked();
      });
    });

    context(">open test verify student side", () => {
      it(">login as teacher and open assignment", () => {
        studentTestPage.clickOnExitTest();
        cy.login("teacher", user.teacher, user.pass);
        testlibraryPage.sidebar.clickOnAssignment();
        authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
        liveClassboardPage.header.clickOnOpenPause();
      });

      it(">verify student side-'assignment is paused'", () => {
        cy.login("student", user.student1, user.pass);
        studentAssignmentsPage.clickOnAssigmentByTestId(customtestid);
        studentTestPage.waitWhileAttempt("00:00:10");

        studentTestPage.getCountdownText().then(time => {
          startTime = CypressHelper.hoursToSeconds(time);
          expect(
            startTime > 100 && startTime < 120,
            `expected UI time is between 100 and 120 in seconds and got ${startTime} seconds`
          ).to.be.true;

          studentTestPage.getCountDown().should("have.css", "color", queColor.RED);
          studentTestPage.waitWhileAttempt(`00:${startTime / 60}:${startTime - 60}`);
          studentTestPage.clickOkOnTimeOutPopUp();
        });
      });
    });
  });
});
