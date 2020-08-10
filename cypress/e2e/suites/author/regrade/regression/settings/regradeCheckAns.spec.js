import FileHelper from "../../../../../framework/util/fileHelper";
import TestLibrary from "../../../../../framework/author/tests/testLibraryPage";
import Regrade from "../../../../../framework/author/tests/regrade/regrade";
import { regradeOptions, studentSide } from "../../../../../framework/constants/assignmentStatus";
import StudentTestPage from "../../../../../framework/student/studentTestPage";
import AssignmentsPage from "../../../../../framework/student/assignmentsPage";
import { attemptTypes } from "../../../../../framework/constants/questionTypes";

describe(`>${FileHelper.getSpecName(Cypress.spec.name)}> regrade settings- check answer tries`, () => {
  const testlibaryPage = new TestLibrary();
  const regrade = new Regrade();
  const studentTestPage = new StudentTestPage();
  const assignmentsPage = new AssignmentsPage();

  const classes = ["Class-1", "Class-2"];
  const teacher = "teacher.regrade.checkanstries@snapwiz.com";
  const queData = { attemptData: { right: "right" }, queKey: "MCQ_TF" };
  const students = {
    class1: {
      1: { email: "s1.c1.regrade.checkanstries@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu1Class1" },
      2: { email: "s2.c1.regrade.checkanstries@snapwiz.com", status: studentSide.NOT_STARTED, name: "Stu2Class1" }
    },

    class2: {
      1: { email: "s1.c2.regrade.checkanstries@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu1Class2" },
      2: { email: "s2.c2.regrade.checkanstries@snapwiz.com", status: studentSide.NOT_STARTED, name: "Stu2Class2" }
    }
  };
  const attemptsdata1 = [{ ...students.class1[1], overidden: false }, { ...students.class1[2], overidden: false }];
  const attemptsdata2 = [{ ...students.class2[1], overidden: true }, { ...students.class2[2], overidden: true }];
  const checkAns1 = 1;
  const checkAns2 = 2;

  let testId1;
  let testId2;
  let testId3;

  before("> create test 2 tests", () => {
    cy.login("teacher", teacher);
    // testlibaryPage.createTest().then(id => {
    testId1 = "5f30eec04e06c60008f7e146";
    //  });
  });

  context(`> select '${regradeOptions.settings.excludeOveridden}'`, () => {
    /* 
    before{
       assign class1 with no check ans tries(defualt test setting)
       assign class2 with checkAns1 no of check ans tries (overidden)

       attempt and keep one student for each status required

       edit test to have checkAns2 no of check ans tries and regrade with exclude overidden
    }

    test{
        class1 both and IN_PROGRESS and NOT STARTED student should get checkAns2 no of check ans tries
        class2 all studentd should have checkAns1 check ans tries
    }
    */
    before("> assign without/with overiding", () => {
      cy.deleteAllAssignments("", teacher);
      testlibaryPage.searchAndClickTestCardById(testId1);
      testlibaryPage.clickOnDuplicate();
      testlibaryPage.header.clickOnPublishButton().then(id => {
        testId2 = id;

        testlibaryPage.clickOnAssign();
        testlibaryPage.assignPage.selectClass(classes[0]);
        testlibaryPage.assignPage.clickOnAssign();

        testlibaryPage.assignPage.visitAssignPageById(testId2);
        testlibaryPage.assignPage.selectClass(classes[1]);
        testlibaryPage.assignPage.showOverRideSetting();
        testlibaryPage.assignPage.setCheckAnsTries(checkAns1);
        testlibaryPage.assignPage.clickOnAssign();

        [...attemptsdata1, ...attemptsdata2]
          .filter(({ status }) => status === studentSide.IN_PROGRESS)
          .forEach(({ email }) => {
            cy.login("student", email);
            assignmentsPage.clickOnAssignmentButton();
            studentTestPage.clickOnExitTest();
          });
      });
    });

    context("> edit settings and regrade", () => {
      before("> login as teacher", () => {
        cy.login("teacher", teacher);
        testlibaryPage.visitTestById(testId2);
        testlibaryPage.publishedToDraftAssigned();

        testlibaryPage.header.clickOnSettings();
        testlibaryPage.testSettings.setCheckAnswer(checkAns2);
        testlibaryPage.header.clickRegradePublish();

        /* select to eclude overidden test */
        regrade.checkRadioByValue(regradeOptions.settings.excludeOveridden);
        regrade.applyRegrade();
      });

      context(`> verify student side`, () => {
        [...attemptsdata1, ...attemptsdata2].forEach(({ email, overidden, status }, index) => {
          it(`> for student ${status} with '${overidden ? "" : "not "}overidden' assignment`, () => {
            const maxChecks = overidden ? checkAns1 : checkAns2;
            cy.login("student", email);
            assignmentsPage.clickOnAssignmentButton();
            for (let i = 0; i < maxChecks; i++) {
              studentTestPage.attemptQuestion(queData.queKey, attemptTypes.RIGHT, queData.attemptData);
              studentTestPage.checkAnsValidateAsRight();
            }
            studentTestPage.clickOnCheckAns(true);
            studentTestPage.clickOnExitTest();
          });
        });
      });
    });
  });

  context(`> select '${regradeOptions.settings.chooseAll}'`, () => {
    /* 
    before{
       assign class1 with no check ans tries(test setting)
       assign class2 with checkAns1 no of check ans tries (overidden)

       attempt and keep one student for each status required

       edit test to not have checkAns2 no of check ans tries and regrade with choose all
    test{
        class1 all students should get checkAns2 no of check ans tries
        class2 all students should get checkAns2 no of check ans tries
    }
    */
    before("> assign without/with overiding", () => {
      cy.deleteAllAssignments("", teacher);
      cy.login("teacher", teacher);
      testlibaryPage.searchAndClickTestCardById(testId1);
      testlibaryPage.clickOnDuplicate();
      testlibaryPage.header.clickOnPublishButton().then(id => {
        testId3 = id;
        testlibaryPage.clickOnAssign();
        testlibaryPage.assignPage.selectClass(classes[0]);
        testlibaryPage.assignPage.clickOnAssign();

        testlibaryPage.assignPage.visitAssignPageById(testId3);
        testlibaryPage.assignPage.selectClass(classes[1]);
        testlibaryPage.assignPage.showOverRideSetting();
        testlibaryPage.assignPage.setCheckAnsTries(checkAns1);
        testlibaryPage.assignPage.clickOnAssign();

        [...attemptsdata1, ...attemptsdata2]
          .filter(({ status }) => status === studentSide.IN_PROGRESS)
          .forEach(studentdata => {
            const { email } = studentdata;
            cy.login("student", email);
            assignmentsPage.clickOnAssignmentButton();
            studentTestPage.clickOnExitTest();
          });
      });
    });

    context("> edit settings and regrade", () => {
      before("> login as teacher", () => {
        cy.login("teacher", teacher);
        testlibaryPage.visitTestById(testId3);
        testlibaryPage.publishedToDraftAssigned();

        testlibaryPage.header.clickOnSettings();
        testlibaryPage.testSettings.setCheckAnswer(checkAns2);
        testlibaryPage.header.clickRegradePublish();

        /* select to choose overidden test */
        regrade.checkRadioByValue(regradeOptions.settings.chooseAll);
        regrade.applyRegrade();
      });

      context(`> verify student side`, () => {
        [...attemptsdata1, ...attemptsdata2].forEach((studentdata, index) => {
          const { email, overidden, status } = studentdata;
          it(`> for student ${status} with '${overidden ? "" : "not "}overidden' assignment`, () => {
            cy.login("student", email);
            assignmentsPage.clickOnAssignmentButton();
            for (let i = 0; i < checkAns2; i++) {
              studentTestPage.attemptQuestion(queData.queKey, attemptTypes.RIGHT, queData.attemptData);
              studentTestPage.checkAnsValidateAsRight();
            }
            studentTestPage.clickOnCheckAns(true);
            studentTestPage.clickOnExitTest();
          });
        });
      });
    });
  });
});
