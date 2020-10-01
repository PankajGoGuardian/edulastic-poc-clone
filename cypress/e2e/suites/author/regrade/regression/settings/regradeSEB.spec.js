import FileHelper from "../../../../../framework/util/fileHelper";
import TestLibrary from "../../../../../framework/author/tests/testLibraryPage";
import Regrade from "../../../../../framework/author/tests/regrade/regrade";
import { regradeOptions, studentSide } from "../../../../../framework/constants/assignmentStatus";
import StudentTestPage from "../../../../../framework/student/studentTestPage";
import AssignmentsPage from "../../../../../framework/student/assignmentsPage";

describe(`>${FileHelper.getSpecName(Cypress.spec.name)}> regrade settings- safe exam browser`, () => {
  const testlibaryPage = new TestLibrary();
  const regrade = new Regrade();
  const studentTestPage = new StudentTestPage();
  const assignmentsPage = new AssignmentsPage();

  const classes = ["Class-1", "Class-2"];
  const teacher = "teacher.regrade.seb@snapwiz.com";
  const attemptsdata1 = { email: "s1.c1.regrade.seb@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu1Class1" };
  const attemptsdata2 = { email: "s1.c2.regrade.seb@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu1Class2" };
  const test = "5f11507c2ea21a000808ae3d";

  let test1;
  let test2;
  let versionedTest1;
  let versionedTest2;

  context(`> select '${regradeOptions.settings.excludeOveridden}'`, () => {
    /* 
      before:{
          class1- assign without SEB
          class2- override to have SEB
          attempt-
            class1: verify absence of SEB icon and keep student in progress
            class2: verify presence of SEB icon
          
          regrade test to have SEB
          select to exclude overriden tests
      }

      test:{
          class1 and class2 all students should have SEB icon
      }
      */
    before("> create test", () => {
      cy.deleteAllAssignments("", teacher);
      cy.login("teacher", teacher);
      testlibaryPage.searchAndClickTestCardById(test);
      testlibaryPage.clickOnDuplicate();
      testlibaryPage.header.clickOnPublishButton().then(id => {
        test1 = id;

        testlibaryPage.assignPage.visitAssignPageById(test1);
        testlibaryPage.assignPage.selectClass(classes[0]);
        testlibaryPage.assignPage.clickOnAssign();

        testlibaryPage.assignPage.visitAssignPageById(test1);
        testlibaryPage.assignPage.selectClass(classes[1]);
        testlibaryPage.assignPage.showOverRideSetting();
        testlibaryPage.assignPage.setSafeExamBrowser("123465");
        testlibaryPage.assignPage.clickOnAssign();

        [attemptsdata1, attemptsdata2].forEach((attemptsdata, index) => {
          const { email } = attemptsdata;
          cy.login("student", email);
          if (index === 0) {
            assignmentsPage.getStatus();
            cy.wait(500);
            assignmentsPage.getSEBiconByTestId(test1).should("not.exist");
            assignmentsPage.clickOnAssigmentByTestId(test1);
            studentTestPage.clickOnExitTest();
          } else {
            assignmentsPage.getStatus(test1);
            assignmentsPage.getSEBiconByTestId(test1).should(`be.visible`);
          }
        });
      });
    });
    context("> edit settings and regrade", () => {
      before("> login as teacher", () => {
        cy.login("teacher", teacher);
        testlibaryPage.visitTestById(test1);
        testlibaryPage.publishedToDraftAssigned();
        testlibaryPage.getVersionedTestID().then(id => {
          versionedTest1 = id;
        });

        testlibaryPage.header.clickOnSettings();
        testlibaryPage.testSettings.setSafeExamBrowser("12356");
        testlibaryPage.header.clickRegradePublish();
        regrade.checkRadioByValue(regradeOptions.settings.excludeOveridden);
        regrade.applyRegrade();
      });

      context(`> verify regraded SEB at student side`, () => {
        [attemptsdata1, attemptsdata2].forEach(({ status, email }, index) => {
          const titleAdjust = index === 0 ? "not " : "";
          it(`> for student ${status} with '${titleAdjust}overidden' assignment,expected-'SEB icon to present'`, () => {
            cy.login("student", email);
            assignmentsPage.getStatus();
            assignmentsPage.getSEBiconByTestId(versionedTest1).should(`be.visible`);
          });
        });
      });
    });
  });

  context(`> select '${regradeOptions.settings.chooseAll}'`, () => {
    /* 
      before:{
          set SEB at test level
          class1- override not to have SEB
          class2- assign with SEB
          attempt-
            class1: veify absence of SEB icon
            class2: verify presence of SEB icon
          
          regrade test to not to have SEB
          select to include overriden tests
      }

      test:{
          class1 and class2 all students should not have SEB icon
      }
      */
    before("> duplicate exsting test", () => {
      studentTestPage.clickOnExitTest();
      cy.deleteAllAssignments("", teacher);
      cy.login("teacher", teacher);
      testlibaryPage.searchAndClickTestCardById(test);
      testlibaryPage.clickOnDuplicate();
      testlibaryPage.testSummary.setName("name");
      testlibaryPage.header.clickOnSaveButton(true);
      testlibaryPage.header.clickOnSettings();
      testlibaryPage.testSettings.setSafeExamBrowser("12345");
      testlibaryPage.header.clickOnPublishButton().then(id => {
        test2 = id;

        testlibaryPage.assignPage.visitAssignPageById(test2);
        testlibaryPage.assignPage.selectClass(classes[1]);
        testlibaryPage.assignPage.clickOnAssign();

        testlibaryPage.assignPage.visitAssignPageById(test2);
        testlibaryPage.assignPage.selectClass(classes[0]);
        testlibaryPage.assignPage.showOverRideSetting();
        testlibaryPage.assignPage.unSetSafeExamBrowser();
        testlibaryPage.assignPage.clickOnAssign();

        [attemptsdata1, attemptsdata2].forEach((attemptsdata, index) => {
          const { email } = attemptsdata;
          cy.login("student", email);
          if (index === 0) {
            assignmentsPage.getStatus();
            cy.wait(500);
            assignmentsPage.getSEBiconByTestId(test2).should("not.exist");
            assignmentsPage.clickOnAssigmentByTestId(test2);
            studentTestPage.clickOnExitTest();
          } else {
            assignmentsPage.getStatus(test2);
            assignmentsPage.getSEBiconByTestId(test2).should(`be.visible`);
          }
        });
      });
    });
    context("> edit settings and regrade", () => {
      before("> login as teacher", () => {
        cy.login("teacher", teacher);
        testlibaryPage.visitTestById(test2);
        testlibaryPage.publishedToDraftAssigned();
        testlibaryPage.getVersionedTestID().then(id => {
          versionedTest2 = id;
        });

        testlibaryPage.header.clickOnSettings();
        testlibaryPage.testSettings.unSetSafeExamBrowser();
        testlibaryPage.header.clickRegradePublish();
        regrade.checkRadioByValue(regradeOptions.settings.excludeOveridden);
        regrade.applyRegrade();
      });

      context(`> verify regraded SEB at student side`, () => {
        [attemptsdata1, attemptsdata2].forEach(({ status, email }, index) => {
          const titleAdjust = index === 1 ? "not " : "";
          it(`> for student ${status} with '${titleAdjust}overidden' assignment,expected-'SEB icon to not present'`, () => {
            cy.login("student", email);
            assignmentsPage.getStatus();
            cy.wait(500);
            assignmentsPage.getSEBiconByTestId(versionedTest2).should(`not.exist`);
          });
        });
      });
    });
  });
});
