import FileHelper from "../../../../../framework/util/fileHelper";
import TestLibrary from "../../../../../framework/author/tests/testLibraryPage";
import Regrade from "../../../../../framework/author/tests/regrade/regrade";
import { regradeOptions, studentSide } from "../../../../../framework/constants/assignmentStatus";
import { CALCULATOR } from "../../../../../framework/constants/questionTypes";
import StudentTestPage from "../../../../../framework/student/studentTestPage";
import AssignmentsPage from "../../../../../framework/student/assignmentsPage";
import AuthorAssignmentPage from "../../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../../framework/author/assignments/LiveClassboardPage";

describe(`>${FileHelper.getSpecName(Cypress.spec.name)}> regrade settings- 'calculator'`, () => {
  const testlibaryPage = new TestLibrary();
  const regrade = new Regrade();
  const studentTestPage = new StudentTestPage();
  const assignmentsPage = new AssignmentsPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const lcb = new LiveClassboardPage();

  const classes = ["Class-1", "Class-2"];
  const teacher = "teacher.regrade.calculator@snapwiz.com";
  const students = {
    class1: {
      1: { email: "s1.c1.regrade.calculator@snapwiz.com", status: studentSide.SUBMITTED, name: "Stu1Class1" },
      2: { email: "s2.c1.regrade.calculator@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu2Class1" },
      3: { email: "s3.c1.regrade.calculator@snapwiz.com", status: studentSide.NOT_STARTED, name: "Stu3Class1" }
    },

    class2: {
      1: { email: "s1.c2.regrade.calculator@snapwiz.com", status: studentSide.SUBMITTED, name: "Stu1Class2" },
      2: { email: "s2.c2.regrade.calculator@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu2Class2" },
      3: { email: "s3.c2.regrade.calculator@snapwiz.com", status: studentSide.NOT_STARTED, name: "Stu3Class2" }
    }
  };
  const attemptsdata1 = [
    { ...students.class1[1], overidden: false },
    { ...students.class1[2], overidden: false },
    { ...students.class1[3], overidden: false }
  ];

  const attemptsdata2 = [
    { ...students.class2[1], overidden: true },
    { ...students.class2[2], overidden: true },
    { ...students.class2[3], overidden: true }
  ];

  let test;
  let test1;
  let test2;
  let assignid1;
  let assignid2;
  let versionedTest1;
  let versionedTest2;

  before("> create test 2 tests", () => {
    cy.login("teacher", teacher);
    // testlibaryPage.createTest().then(id => {
    test = "5f3a4414ad0cf300083359fe";
    // });
  });

  context(`> select '${regradeOptions.settings.excludeOveridden}'`, () => {
    /* 
    before{
       assign class1 with no calculator(defualt test setting)
       assign class2 with calculator (overidden)

       attempt and keep one student for each status required

       edit test to have calculator and regrade with exclude overidden
    }

    test{
        class1 both and IN_PROGRESS and NOT STARTED student should get calculatord choices
        class2 all studentd should get calculator
    }
    */
    before("> assign without/with overiding", () => {
      cy.deleteAllAssignments("", teacher);
      testlibaryPage.searchAndClickTestCardById(test);
      testlibaryPage.clickOnDuplicate();
      testlibaryPage.header.clickOnPublishButton().then(id => {
        test1 = id;

        testlibaryPage.clickOnAssign();
        testlibaryPage.assignPage.selectClass(classes[0]);
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignid1 = assignObj[test1];

          testlibaryPage.assignPage.visitAssignPageById(test1);
          testlibaryPage.assignPage.selectClass(classes[1]);
          testlibaryPage.assignPage.showOverRideSetting();
          testlibaryPage.assignPage.clickOnCalculatorByType(CALCULATOR.BASIC);
          testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
            assignid2 = assignObj[test1];

            [...attemptsdata1, ...attemptsdata2]
              .filter(({ status }) => status === studentSide.SUBMITTED)
              .forEach(({ name, overidden }) => {
                testlibaryPage.sidebar.clickOnDashboard();
                testlibaryPage.sidebar.clickOnAssignment();
                authorAssignmentPage.clickOnLCBbyTestId(test1, overidden ? assignid2 : assignid1);
                lcb.selectCheckBoxByStudentName(name);
                lcb.clickOnMarkAsSubmit();
              });

            [...attemptsdata1, ...attemptsdata2]
              .filter(({ status }) => status === studentSide.IN_PROGRESS)
              .forEach(({ email }) => {
                cy.login("student", email);
                assignmentsPage.clickOnAssignmentButton();
                studentTestPage.clickOnExitTest();
              });
          });
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
        testlibaryPage.testSettings.clickOnCalculatorByType(CALCULATOR.BASIC);
        testlibaryPage.header.clickRegradePublish();

        /* select to eclude overidden test */
        regrade.checkRadioByValue(regradeOptions.settings.excludeOveridden);
        regrade.applyRegrade();
      });

      context(`> verify regraded calculator at student side`, () => {
        [...attemptsdata1, ...attemptsdata2]
          .filter(({ status }) => status === studentSide.IN_PROGRESS || status === studentSide.NOT_STARTED)
          .forEach(({ email, overidden, status }, index) => {
            const titleAdjust = overidden ? "" : "not ";
            it(`> for student ${status} with '${titleAdjust}overidden' assignment, expexted-'basic'`, () => {
              cy.login("student", email);
              assignmentsPage.clickOnAssigmentByTestId(versionedTest1);
              studentTestPage.clickOnCalcuator();
              studentTestPage.assertCalcType(CALCULATOR.BASIC);
              studentTestPage.clickOnExitTest();
            });
          });
      });

      [attemptsdata1, attemptsdata2].forEach((studentdata, index) => {
        context(`> redirect '${index === 0 ? "not " : ""}overidden' assignment`, () => {
          /* redirecting overidden assignment should have calculator for both class students */
          before("> click on lcb", () => {
            cy.login("teacher", teacher);
            testlibaryPage.sidebar.clickOnAssignment();
            authorAssignmentPage.clickOnLCBbyTestId(versionedTest1, studentdata[0].overidden ? assignid2 : assignid1);
          });

          it("> redirect student", () => {
            lcb.selectCheckBoxByStudentName(studentdata[0].name);
            lcb.clickOnRedirect();
            lcb.clickOnRedirectSubmit();
          });

          it("> verify reirected student, expected to have 'basic'", () => {
            cy.login("student", studentdata[0].email);
            assignmentsPage.clickOnAssigmentByTestId(versionedTest1, { isFirstAttempt: false });
            studentTestPage.clickOnCalcuator();
            studentTestPage.assertCalcType(CALCULATOR.BASIC);
            studentTestPage.clickOnExitTest();
          });
        });
      });
    });
  });

  context(`> select '${regradeOptions.settings.chooseAll}'`, () => {
    /* 
    before{
       assign class1 with calculator(test setting)
       assign class2 with no calculator (overidden)

       attempt and keep one student for each status required

       edit test to not have calculator and regrade with choose all
    test{
        class1 all students should not get calculator
        class2 all students should not get calculator
    }
    */
    before("> assign without/with overiding", () => {
      cy.deleteAllAssignments("", teacher);
      cy.login("teacher", teacher);
      testlibaryPage.searchAndClickTestCardById(test);
      testlibaryPage.clickOnDuplicate();
      testlibaryPage.testSummary.setName("name");
      testlibaryPage.header.clickOnSaveButton(true);
      testlibaryPage.header.clickOnSettings();
      testlibaryPage.testSettings.clickOnCalculatorByType(CALCULATOR.BASIC);
      testlibaryPage.header.clickOnPublishButton().then(id => {
        test2 = id;
        testlibaryPage.clickOnAssign();
        testlibaryPage.assignPage.selectClass(classes[0]);
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignid1 = assignObj[test2];

          testlibaryPage.assignPage.visitAssignPageById(test2);
          testlibaryPage.assignPage.selectClass(classes[1]);
          testlibaryPage.assignPage.showOverRideSetting();
          testlibaryPage.assignPage.clickOnCalculatorByType(CALCULATOR.NONE);
          testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
            assignid2 = assignObj[test2];

            [...attemptsdata1, ...attemptsdata2]
              .filter(({ status }) => status === studentSide.SUBMITTED)
              .forEach(({ name, overidden }) => {
                testlibaryPage.sidebar.clickOnDashboard();
                testlibaryPage.sidebar.clickOnAssignment();
                authorAssignmentPage.clickOnLCBbyTestId(test2, overidden ? assignid2 : assignid1);
                lcb.selectCheckBoxByStudentName(name);
                lcb.clickOnMarkAsSubmit();
              });

            [...attemptsdata1, ...attemptsdata2]
              .filter(({ status }) => status === studentSide.IN_PROGRESS)
              .forEach(({ email }) => {
                cy.login("student", email);
                assignmentsPage.clickOnAssignmentButton();
                studentTestPage.clickOnExitTest();
              });
          });
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
        testlibaryPage.testSettings.clickOnCalculatorByType(CALCULATOR.NONE);
        testlibaryPage.header.clickRegradePublish();

        /* select to choose test */
        regrade.checkRadioByValue(regradeOptions.settings.chooseAll);
        regrade.applyRegrade();
      });

      context(`> verify regraded calculator at student side`, () => {
        [...attemptsdata1, ...attemptsdata2]
          .filter(({ status }) => status !== studentSide.SUBMITTED)
          .forEach(({ email, overidden, status }, index) => {
            const titleAdjust = overidden ? "" : "not ";
            it(`> for student ${status} with '${titleAdjust}overidden' assignment, expexted-'no calculator'`, () => {
              cy.login("student", email);
              assignmentsPage.clickOnAssigmentByTestId(versionedTest2);
              studentTestPage.assertCalcType(CALCULATOR.NONE);
              studentTestPage.clickOnExitTest();
            });
          });
      });

      [attemptsdata1, attemptsdata2].forEach((studentdata, index) => {
        context(`> redirect '${index === 0 ? "not " : ""}overidden' assignment`, () => {
          /* redirecting overidden assignment should not have calculator for both class students */
          before("> click on lcb", () => {
            cy.login("teacher", teacher);
            testlibaryPage.sidebar.clickOnAssignment();
            authorAssignmentPage.clickOnLCBbyTestId(versionedTest2, studentdata[0].overidden ? assignid2 : assignid1);
          });

          it("> redirect student", () => {
            lcb.selectCheckBoxByStudentName(studentdata[0].name);
            lcb.clickOnRedirect();
            lcb.clickOnRedirectSubmit();
          });

          it("> verify redirect student,expected-'no calculator'", () => {
            cy.login("student", studentdata[0].email);
            assignmentsPage.clickOnAssigmentByTestId(versionedTest2, { isFirstAttempt: false });
            studentTestPage.assertCalcType(CALCULATOR.NONE);
            studentTestPage.clickOnExitTest();
          });
        });
      });
    });
  });
});
