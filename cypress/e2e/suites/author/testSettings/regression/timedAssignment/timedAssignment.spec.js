import FileHelper from "../../../../../framework/util/fileHelper";
import TestLibrary from "../../../../../framework/author/tests/testLibraryPage";
import AssignmentsPage from "../../../../../framework/student/assignmentsPage";
import CypressHelper from "../../../../../framework/util/cypressHelpers";
import StudentTestPage from "../../../../../framework/student/studentTestPage";
import { queColor } from "../../../../../framework/constants/questionTypes";

describe(`${FileHelper.getSpecName(Cypress.spec.name)}>> timed assignment`, () => {
  const testlibraryPage = new TestLibrary();
  const studentAssignmentsPage = new AssignmentsPage();
  const studentTestPage = new StudentTestPage();

  const user = {
    teacher: "teacaher.timed.test@snapwiz.com",
    student1: "student1.timed.test@snapwiz.com",
    student2: "student2.timed.test@snapwiz.com",
    pass: "snapwiz"
  };

  const testtocreateCustom = "default";
  const customtestTime = "3";
  const defaultTests = ["default", "EDIT_ASSIGNED_TEST_REGRADE"];
  const defaultTestItems = [1, 3];

  let startTime;
  let customtestid;
  let defaultTestids = [];

  context(">create and assign test with default time settings", () => {
    context(">from test level", () => {
      before(">create test", () => {
        cy.deleteAllAssignments("", user.teacher);
        cy.login("teacher", user.teacher, user.pass);
        defaultTests.forEach(test => {
          testlibraryPage.createTest(test, false).then(id => {
            defaultTestids.push(id);
          });
        });
      });
      defaultTests.forEach((test, index) => {
        it(">set time limit as on-'default'", () => {
          testlibraryPage.seachTestAndGotoReviewById(defaultTestids[index]);
          testlibraryPage.header.clickOnSettings();
          testlibraryPage.testSettings.makeAssignmentTimed();
          testlibraryPage.testSettings.verifyTimeAssignedForTest(defaultTestItems[index]);
          testlibraryPage.testSettings.getAllowExit().should("not.be.checked");
          testlibraryPage.testSettings.verifyInfoAboutTestTime();
          testlibraryPage.header.clickOnPublishButton();
        });
        it(">assign the test", () => {
          testlibraryPage.clickOnAssign();
          testlibraryPage.assignPage.selectClass("Class");
          testlibraryPage.assignPage.clickOnAssign();
        });
      });
      it(">verify at student side", () => {
        cy.login("student", user.student1, user.pass);
        defaultTests.forEach((test, index) => {
          studentAssignmentsPage.verifyTimeAvalableForTestById(defaultTestids[index], defaultTestItems[index]);
        });
      });
    });
    context(">from assignment level", () => {
      before(">create test", () => {
        cy.deleteAllAssignments("", user.teacher);
        cy.login("teacher", user.teacher, user.pass);
        defaultTestids = [];
        defaultTests.forEach(test => {
          testlibraryPage.createTest(test, false).then(id => {
            defaultTestids.push(id);
          });
        });
      });
      defaultTests.forEach((test, index) => {
        it(">set time limit as on-'default'", () => {
          testlibraryPage.visitTestById(defaultTestids[index]);
          testlibraryPage.header.clickOnAssign();
          testlibraryPage.assignPage.showOverRideSetting();
          testlibraryPage.assignPage.makeAssignmentTimed();
          testlibraryPage.assignPage.verifyTimeAssignedForTest(defaultTestItems[index]);
          testlibraryPage.assignPage.getAllowExit().should("not.be.checked");
        });
        it(">assign the test", () => {
          testlibraryPage.assignPage.verifyInfoAboutTestTime();
          testlibraryPage.assignPage.selectClass("Class");
          testlibraryPage.assignPage.clickOnAssign();
        });
      });
      it(">verify at student side", () => {
        cy.login("student", user.student1, user.pass);
        defaultTests.forEach((test, index) => {
          studentAssignmentsPage.verifyTimeAvalableForTestById(defaultTestids[index], defaultTestItems[index]);
        });
      });
    });
  });

  context(">create and assign test with custom time settings", () => {
    context(">from test level", () => {
      before(">create test", () => {
        cy.deleteAllAssignments("", user.teacher);
        cy.login("teacher", user.teacher, user.pass);
        testlibraryPage.createTest(testtocreateCustom, false).then(id => {
          customtestid = id;
          testlibraryPage.header.clickOnSettings();
        });
      });
      it(">set time limit as on-'default'", () => {
        testlibraryPage.testSettings.setAssignmentTime(customtestTime);
        testlibraryPage.testSettings.verifyTimeAssignedForTest(customtestTime);
        testlibraryPage.testSettings.getAllowExit().should("not.be.checked");
        testlibraryPage.testSettings.verifyInfoAboutTestTime();
        testlibraryPage.header.clickOnPublishButton();
      });
      it(">assign the test", () => {
        testlibraryPage.clickOnAssign();
        testlibraryPage.assignPage.selectClass("Class");
        testlibraryPage.assignPage.clickOnAssign();
      });
      it(">verify at student side", () => {
        cy.login("student", user.student1, user.pass);
        studentAssignmentsPage.verifyTimeAvalableForTestById(customtestid, customtestTime);
      });
    });
    context(">from assignment level", () => {
      before(">create test", () => {
        cy.deleteAllAssignments("", user.teacher);
        cy.login("teacher", user.teacher, user.pass);
        testlibraryPage.createTest(testtocreateCustom).then(id => {
          customtestid = id;
        });
      });
      it(">set time limit as on-'custom'", () => {
        testlibraryPage.clickOnAssign();
        testlibraryPage.assignPage.showOverRideSetting();
        testlibraryPage.assignPage.setAssignmentTime(customtestTime);
        testlibraryPage.assignPage.verifyTimeAssignedForTest(customtestTime);
      });
      it(">assign the test", () => {
        testlibraryPage.assignPage.verifyInfoAboutTestTime();
        testlibraryPage.assignPage.selectClass("Class");
        testlibraryPage.assignPage.clickOnAssign();
      });
      it(">verify at student side-'custom time out'", () => {
        cy.login("student", user.student1, user.pass);
        studentAssignmentsPage.verifyTimeAvalableForTestById(customtestid, customtestTime);
        studentAssignmentsPage.clickOnAssigmentByTestId(customtestid, { time: 3 });

        studentTestPage.waitWhileAttempt("00:00:10");
        studentTestPage.getCountdownText().then(time => {
          startTime = CypressHelper.hoursToSeconds(time);
          expect(startTime).to.be.greaterThan(1);
          studentTestPage.getCountDown().should("have.css", "color", queColor.WHITE);

          /* wait for one minute, so that time limit becomes less than 2 mns */
          studentTestPage.waitWhileAttempt(`00:00:${startTime - 120}`);
          studentTestPage.verifyRemainingTime("00:02:00");
          studentTestPage.getCountDown().should("have.css", "color", queColor.RED);
        });

        /* wait for two mns, so that time gets exhausted */
        studentTestPage.waitWhileAttempt(`00:01:00`);
        studentTestPage.verifyRemainingTime("00:01:00");
        studentTestPage.getCountDown().should("have.css", "color", queColor.RED);

        studentTestPage.waitWhileAttempt(`00:00:59`);
        studentTestPage.verifyRemainingTime("00:00:01");
        studentTestPage.getCountDown().should("have.css", "color", queColor.RED);

        studentTestPage.clickOkOnTimeOutPopUp();
      });
    });
  });
});
