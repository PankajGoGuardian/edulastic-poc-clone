import FileHelper from "../../../../../framework/util/fileHelper";
import TestLibrary from "../../../../../framework/author/tests/testLibraryPage";
import Regrade from "../../../../../framework/author/tests/regrade/regrade";
import { regradeOptions, studentSide } from "../../../../../framework/constants/assignmentStatus";
import StudentTestPage from "../../../../../framework/student/studentTestPage";
import AssignmentsPage from "../../../../../framework/student/assignmentsPage";
import AuthorAssignmentPage from "../../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../../framework/author/assignments/LiveClassboardPage";
import ReportsPage from "../../../../../framework/student/reportsPage";
import CypressHelper from "../../../../../framework/util/cypressHelpers";

describe(`>${FileHelper.getSpecName(Cypress.spec.name)}> regrade settings- 'Answer On Paper'`, () => {
  const testlibaryPage = new TestLibrary();
  const regrade = new Regrade();
  const studentTestPage = new StudentTestPage();
  const assignmentsPage = new AssignmentsPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const lcb = new LiveClassboardPage();
  const reportsPage = new ReportsPage();

  const classes = ["Class-1", "Class-2"];
  const teacher = "teacher.regrade.ansonpaper@snapwiz.com";
  const students = {
    class1: {
      1: { email: "s1.c1.regrade.ansonpaper@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu1Class1" },
      2: { email: "s2.c1.regrade.ansonpaper@snapwiz.com", status: studentSide.NOT_STARTED, name: "Stu2Class1" }
    },

    class2: {
      1: { email: "s1.c2.regrade.ansonpaper@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu1Class2" },
      2: { email: "s2.c2.regrade.ansonpaper@snapwiz.com", status: studentSide.NOT_STARTED, name: "Stu2Class2" }
    }
  };
  const attemptsdata1 = [{ ...students.class1[1], overidden: false }, { ...students.class1[2], overidden: false }];
  const attemptsdata2 = [{ ...students.class2[1], overidden: true }, { ...students.class2[2], overidden: true }];

  let testId1;
  let testId2;
  let testId3;
  let assignmentId1;
  let assignmentId2;
  let versionedTest1;
  let versionedTest2;
  let date;

  before("> create test 2 tests", () => {
    cy.login("teacher", teacher);
    // testlibaryPage.createTest().then(id => {
    testId1 = "5f3106d6c77d650008a633e3";
    // });
  });

  context(`> select '${regradeOptions.settings.excludeOveridden}'`, () => {
    /* 
    before{
       assign class1 with no ansonpaper(defualt test setting)
       assign class2 with ansonpaper (overidden)

       attempt and keep one student for each status required

       edit test to have ansonpaper and regrade with exclude overidden
    }

    test{
       class1 and class2 IN_PROGRESS should have graded and NOT_STARTED should have submitted
    }
    */
    before("> assign without/with overiding", () => {
      date = new Date();
      date.setDate(date.getDate() + 1);
      cy.deleteAllAssignments("", teacher);
      testlibaryPage.searchAndClickTestCardById(testId1);
      testlibaryPage.clickOnDuplicate();
      testlibaryPage.header.clickOnPublishButton().then(id => {
        testId2 = id;

        testlibaryPage.clickOnAssign();
        testlibaryPage.assignPage.selectClass(classes[0]);
        testlibaryPage.assignPage.setEndDate(date);
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignmentId1 = assignObj[testId2];

          testlibaryPage.assignPage.visitAssignPageById(testId2);
          testlibaryPage.assignPage.selectClass(classes[1]);
          testlibaryPage.assignPage.setEndDate(date);
          testlibaryPage.assignPage.showOverRideSetting();
          testlibaryPage.assignPage.selectAnswerOnPaper();
          testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
            assignmentId2 = assignObj[testId2];

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
      });
    });

    context("> edit settings and regrade", () => {
      before("> login as teacher", () => {
        cy.login("teacher", teacher);
        testlibaryPage.visitTestById(testId2);
        testlibaryPage.publishedToDraftAssigned();
        testlibaryPage.getVersionedTestID().then(id => {
          versionedTest1 = id;
        });

        testlibaryPage.header.clickOnSettings();
        testlibaryPage.testSettings.enableAnswerOnPaper();
        testlibaryPage.header.clickRegradePublish();

        /* select to exclude overidden test */
        regrade.checkRadioByValue(regradeOptions.settings.excludeOveridden);
        regrade.applyRegrade();
      });

      context(`> verify student side`, () => {
        beforeEach("set browser date > due date", () => {
          CypressHelper.setCustomBrowserDate({ dateToForward: 2 });
        });
        [...attemptsdata1, ...attemptsdata2].forEach(studentdata => {
          const { email, overidden, status } = studentdata;
          it(`> for student ${status} with '${overidden ? "" : "not "}overidden' assignment`, () => {
            const studentStatus = status === studentSide.IN_PROGRESS ? studentSide.GRADED : studentSide.SUBMITTED;
            cy.login("student", email);
            assignmentsPage.sidebar.clickOnGrades();
            reportsPage.verifyStatusIs(studentStatus);
          });
        });
      });

      [attemptsdata1, attemptsdata2].forEach((attemptData, ind) => {
        /* verify status of all students from both class */
        context(`> verify teacher side for '${ind === 0 ? "" : "not "}overiden' test`, () => {
          before("> login click on lcb by assignment id", () => {
            CypressHelper.setCustomBrowserDate({ dateToForward: 2 }).then(() => {
              if (ind === 0) cy.login("teacher", teacher);
              testlibaryPage.sidebar.clickOnAssignment();
              authorAssignmentPage.clickOnLCBbyTestId(versionedTest1, ind === 0 ? assignmentId1 : assignmentId2);
            });
          });
          beforeEach("set browser date > due date", () => {
            CypressHelper.setCustomBrowserDate({ dateToForward: 2 });
          });
          attemptData.forEach((student, ind) => {
            const { status, name } = student;
            const studentStatus = status === studentSide.IN_PROGRESS ? studentSide.GRADED : studentSide.SUBMITTED;
            it(`> verify staus in card view for ${status}(${name}), epxected- ${studentStatus}`, () => {
              lcb.verifyStudentStatusIsByIndex(ind, studentStatus, true);
            });
          });
        });
      });
    });
  });

  context(`> select '${regradeOptions.settings.chooseAll}'`, () => {
    /* 
    before{
       assign class1 with ansonpaper(defualt test setting)
       assign class2 with no ansonpaper (overidden)

       attempt and keep one student for each status required
       edit test to not have ansonpaper and regrade with choose all
    }

    test{
        class1 and class2 IN_PROGRESS should have graded and NOT_STARTED should have submitted
    }
    */
    before("> assign without/with overiding", () => {
      date = new Date();
      date.setDate(date.getDate() + 1);
      cy.login("teacher", teacher);
      cy.deleteAllAssignments("", teacher);
      testlibaryPage.searchAndClickTestCardById(testId1);
      testlibaryPage.clickOnDuplicate();
      testlibaryPage.testSummary.setName("name");
      testlibaryPage.header.clickOnSaveButton(true);
      testlibaryPage.header.clickOnSettings();
      testlibaryPage.testSettings.enableAnswerOnPaper();
      testlibaryPage.header.clickOnPublishButton().then(id => {
        testId3 = id;

        testlibaryPage.clickOnAssign();
        testlibaryPage.assignPage.selectClass(classes[0]);
        testlibaryPage.assignPage.setEndDate(date);
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignmentId1 = assignObj[testId3];

          testlibaryPage.assignPage.visitAssignPageById(testId3);
          testlibaryPage.assignPage.selectClass(classes[1]);
          testlibaryPage.assignPage.setEndDate(date);
          testlibaryPage.assignPage.showOverRideSetting();
          testlibaryPage.assignPage.deselectAnsweOnPaper();
          testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
            assignmentId2 = assignObj[testId3];

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
      });
    });

    context("> edit settings and regrade", () => {
      before("> login as teacher", () => {
        cy.login("teacher", teacher);
        testlibaryPage.visitTestById(testId3);
        testlibaryPage.publishedToDraftAssigned();
        testlibaryPage.getVersionedTestID().then(id => {
          versionedTest2 = id;
        });

        testlibaryPage.header.clickOnSettings();
        testlibaryPage.testSettings.disableAnswerOnPaper();
        testlibaryPage.header.clickRegradePublish();

        /* select to choose all test */
        regrade.checkRadioByValue(regradeOptions.settings.chooseAll);
        regrade.applyRegrade();
      });

      context(`> verify student side`, () => {
        beforeEach("set browser date > due date", () => {
          CypressHelper.setCustomBrowserDate({ dateToForward: 2 });
        });
        [...attemptsdata1, ...attemptsdata2].forEach(studentdata => {
          const { email, overidden, status } = studentdata;
          it(`> for student ${status} with '${overidden ? "" : "not "}overidden' assignment`, () => {
            const studentStatus = status === studentSide.IN_PROGRESS ? studentSide.GRADED : studentSide.ABSENT;
            cy.login("student", email);
            assignmentsPage.sidebar.clickOnGrades();
            reportsPage.verifyStatusIs(studentStatus);
          });
        });
      });

      [attemptsdata1, attemptsdata2].forEach((attemptData, ind) => {
        /* verify status of all students from both class */
        context(`> verify teacher side for '${ind === 0 ? "" : "not "}overiden' test`, () => {
          before("> login click on lcb by assignment id", () => {
            cy.login("teacher", teacher);
            testlibaryPage.sidebar.clickOnAssignment();
            authorAssignmentPage.clickOnLCBbyTestId(versionedTest2, ind === 0 ? assignmentId1 : assignmentId2);
          });
          beforeEach("set browser date > due date", () => {
            CypressHelper.setCustomBrowserDate({ dateToForward: 2 });
          });
          attemptData.forEach((student, ind) => {
            const { status, name } = student;
            const studentStatus = status === studentSide.IN_PROGRESS ? studentSide.GRADED : studentSide.ABSENT;
            it(`> verify staus in card view for ${status}(${name}), epxected- ${studentStatus}`, () => {
              lcb.verifyStudentStatusIsByIndex(ind, studentStatus, true);
            });
          });
        });
      });
    });
  });
});
