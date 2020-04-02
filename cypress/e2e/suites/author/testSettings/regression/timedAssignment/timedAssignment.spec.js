import FileHelper from "../../../../../framework/util/fileHelper";
import TestLibrary from "../../../../../framework/author/tests/testLibraryPage";
import AssignmentsPage from "../../../../../framework/student/assignmentsPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)}>> timed assignment`, () => {
  const testlibraryPage = new TestLibrary();
  const studentAssignmentsPage = new AssignmentsPage();

  const user = {
    teacher: "teacaher.timed.test@snapwiz.com",
    student1: "student1.timed.test@snapwiz.com",
    student2: "student2.timed.test@snapwiz.com",
    pass: "snapwiz"
  };
  let customtestid;
  const testtocreateCustom = "default";
  const customtestTime = "30";

  let defaultTestids = [];
  const defaultTests = ["default", "EDIT_ASSIGNED_TEST_REGRADE"];
  const defaultTestItems = [1, 3];

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
        testlibraryPage.createTest(testtocreateCustom, false).then(id => {
          customtestid = id;
        });
      });
      it(">set time limit as on-'default'", () => {
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
      it(">verify at student side", () => {
        cy.login("student", user.student1, user.pass);
        studentAssignmentsPage.verifyTimeAvalableForTestById(customtestid, customtestTime);
      });
    });
  });
});
