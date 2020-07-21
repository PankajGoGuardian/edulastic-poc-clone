import FileHelper from "../../../../../framework/util/fileHelper";
import TestLibrary from "../../../../../framework/author/tests/testLibraryPage";
import Regrade from "../../../../../framework/author/tests/regrade/regrade";
import { regradeOptions, studentSide } from "../../../../../framework/constants/assignmentStatus";
import { attemptTypes } from "../../../../../framework/constants/questionTypes";
import StudentTestPage from "../../../../../framework/student/studentTestPage";
import AssignmentsPage from "../../../../../framework/student/assignmentsPage";
import ReportsPage from "../../../../../framework/student/reportsPage";
import AuthorAssignmentPage from "../../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../../framework/author/assignments/LiveClassboardPage";
import ExpressGraderPage from "../../../../../framework/author/assignments/expressGraderPage";

describe(`>${FileHelper.getSpecName(Cypress.spec.name)}> regrade settings- 'max attempts'`, () => {
  const testlibaryPage = new TestLibrary();
  const regrade = new Regrade();
  const studentTestPage = new StudentTestPage();
  const assignmentsPage = new AssignmentsPage();
  const reportsPage = new ReportsPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const lcb = new LiveClassboardPage();
  const expressGraderPage = new ExpressGraderPage();
  const classes = ["Class-1", "Class-2"];
  const teacher = "teacher.regrade.maxattempts@snapwiz.com";

  const students = {
    class1: {
      1: { email: "s1.c1.regrade.maxattempt@snapwiz.com", status: studentSide.SUBMITTED, name: "Stu1Class1" },
      2: { email: "s2.c1.regrade.maxattempt@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu2Class1" }
    },
    class2: {
      1: { email: "s1.c2.regrade.maxattempt@snapwiz.com", status: studentSide.SUBMITTED, name: "Stu1Class2" },
      2: { email: "s2.c2.regrade.maxattempt@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu2Class2" }
    }
  };
  const attemptsdata1 = [
    { attempt: { Q1: attemptTypes.RIGHT }, ...students.class1[1] },
    { attempt: { Q1: attemptTypes.RIGHT }, ...students.class1[2] }
  ];

  const attemptsdata2 = [
    { attempt: { Q1: attemptTypes.RIGHT }, ...students.class2[1] },
    { attempt: { Q1: attemptTypes.RIGHT }, ...students.class2[2] }
  ];

  const quetypeMap = {
    Q1: {
      attemptData: { right: "True", wrong: "False" },
      queKey: "MCQ_TF.default"
    }
  };
  const attemptAfterRegrade = { Q1: attemptTypes.WRONG };
  const test = "5f0dae1897ac060008638370";
  let test1;
  let test2;
  const initialMaxattempt = 2;
  const regardedMaxAttempt = 3;
  let assignid1;
  let assignid2;
  let versionedTest1;
  let versionedTest2;

  before("> create test 2 tests", () => {
    cy.login("teacher", teacher);
    testlibaryPage.searchAndClickTestCardById(test);
    testlibaryPage.clickOnDuplicate();
    testlibaryPage.header.clickOnPublishButton().then(id => {
      test1 = id;
    });

    testlibaryPage.searchAndClickTestCardById(test);
    testlibaryPage.clickOnDuplicate();
    testlibaryPage.header.clickOnPublishButton().then(id => {
      test2 = id;
    });
  });

  context(`> select '${regradeOptions.settings.excludeOveridden}'`, () => {
    /* Context: 1
class1- not overidden
class2- overidden
before:{
  test will have defualt max attempt-1
  assign without overiding for class-1 and overide to 2 for class-2 
  attempt from both classes and keep one student in-progress and one in submitted with signle attempt.

  regrade the max attempts to 3
  select to exclude overidden assignments
}
tests:{
  attempt by all students in both classes
  for class-1 
    submitted student : attempt count should be 2/3
    in prgress student: attempt count should be 1/3
  for class-2
    submitted student : attempt count should be 2/2
    in prgress student: attempt count should be 1/2   
}

*/
    before("> assign without/with overiding", () => {
      cy.deleteAllAssignments("", teacher);
      cy.login("teacher", teacher);
      /* assign without overiding */
      testlibaryPage.assignPage.visitAssignPageById(test1);
      testlibaryPage.assignPage.selectClass(classes[0]);
      testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
        assignid1 = assignObj[test1];
      });

      /* assign with overiding "MAX_ATTEMPTS" to 2 */
      testlibaryPage.assignPage.visitAssignPageById(test1);
      testlibaryPage.assignPage.selectClass(classes[1]);
      testlibaryPage.assignPage.showOverRideSetting();
      testlibaryPage.assignPage.setMaxAttempt(initialMaxattempt);
      testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
        assignid2 = assignObj[test1];
      });

      /* attempt and keep student according to required status */
      [...attemptsdata1, ...attemptsdata2].forEach(attemptsdata => {
        const { email, status, attempt } = attemptsdata;
        studentTestPage.attemptAssignment(email, status, attempt, quetypeMap);
      });
    });
    context("> edit settings and regrade", () => {
      before("> login as teacher", () => {
        /* edit and change "MAX_ATTEMPTS" to 3 and regrade */
        cy.login("teacher", teacher);
        testlibaryPage.visitTestById(test1);
        testlibaryPage.publishedToDraftAssigned();
        testlibaryPage.getVersionedTestID().then(id => {
          versionedTest1 = id;
        });

        testlibaryPage.header.clickOnSettings();
        testlibaryPage.testSettings.setMaxAttempt(regardedMaxAttempt);
        testlibaryPage.header.clickRegradePublish();
        /* select to eclude overidden test */
        regrade.checkRadioByValue(regradeOptions.settings.excludeOveridden);
        regrade.applyRegrade();
      });

      context(`> verify student side`, () => {
        [attemptsdata1, attemptsdata2].forEach((attemptData, index) => {
          attemptData.forEach(attemptsdata => {
            it(`> for student ${attemptsdata.status} with '${index === 0 ? "not " : ""}overidden' assignment`, () => {
              const { email, status } = attemptsdata;
              studentTestPage.attemptAssignment(email, studentSide.SUBMITTED, attemptAfterRegrade, quetypeMap);
              /* verify attempt count(overidden test: 2, not overridden:3 ) according to assignment status and selected regrade option */
              reportsPage.validateStats(
                attemptsdata.status === studentSide.SUBMITTED ? 2 : 1,
                `${attemptsdata.status === studentSide.SUBMITTED ? "2" : "1"}/${index === 0 ? 3 : 2}`,
                undefined,
                "0"
              );
              if (status === studentSide.SUBMITTED && index === 1) {
                assignmentsPage.sidebar.clickOnAssignment();
                cy.contains("You don't have any currently assigned or completed assignments.");
              }
            });
          });
        });
      });

      context("> verify teacher side for not overidden assignment", () => {
        /* verify latest response in lcb */
        before("> login and click on lcb by assignment id", () => {
          cy.login("teacher", teacher);
          testlibaryPage.sidebar.clickOnAssignment();
          authorAssignmentPage.clickOnLCBbyTestId(versionedTest1, assignid1);
        });
        it("> verify card view", () => {
          attemptsdata1.forEach((stu, ind) => {
            lcb.getStudentScoreByIndex(ind).should("contain.text", `0 / 2`);
            lcb.verifyQuestionCards(ind, [attemptTypes.WRONG]);
          });
        });
        it("> verify student centric", () => {
          lcb.clickOnStudentsTab();
          attemptsdata1.forEach((stu, ind) => {
            lcb.questionResponsePage.selectStudent(stu.name);
            if (stu.status === studentSide.SUBMITTED) lcb.questionResponsePage.selectAttempt(2);
            lcb.questionResponsePage.verifyQuestionResponseCard(
              2,
              quetypeMap.Q1.queKey,
              attemptTypes.WRONG,
              quetypeMap.Q1.attemptData,
              true,
              0
            );
          });
        });
        it("> verify question centric", () => {
          lcb.clickonQuestionsTab();
          attemptsdata1.forEach((stu, ind) => {
            lcb.questionResponsePage.verifyQuestionResponseCard(
              2,
              quetypeMap.Q1.queKey,
              attemptTypes.WRONG,
              quetypeMap.Q1.attemptData,
              false,
              stu.name
            );
          });
        });
        it("> verify exress grader", () => {
          lcb.header.clickOnExpressGraderTab();

          expressGraderPage.setToggleToScore();
          attemptsdata1.forEach((stu, ind) => {
            expressGraderPage.getGridRowByStudent(stu.name);
            expressGraderPage.verifyScoreForStudent(
              "Q1",
              2,
              attemptTypes.WRONG,
              quetypeMap.Q1.attemptData,
              quetypeMap.Q1.queKey
            );
          });

          expressGraderPage.setToggleToResponse();
          attemptsdata1.forEach((stu, ind) => {
            expressGraderPage.getGridRowByStudent(stu.name);
            expressGraderPage.verifyResponseEntryByIndexOfSelectedRow("B", "Q1");
          });
        });
      });

      context("> redirect 'overidden' assignment", () => {
        /* redirecting overidden assignment should increase submitted student count by '1' i.e. 3 */
        before("> click on lcb", () => {
          testlibaryPage.sidebar.clickOnAssignment();
          authorAssignmentPage.clickOnLCBbyTestId(versionedTest1, assignid2);
        });
        it("> redirect student", () => {
          lcb.selectCheckBoxByStudentName(attemptsdata2[0].name);
          lcb.clickOnRedirect();
          lcb.clickOnRedirectSubmit();
        });
        it("> verify student", () => {
          cy.login("student", attemptsdata2[0].email);
          assignmentsPage.clickOnAssigmentByTestId(versionedTest1, { isFirstAttempt: false });
          studentTestPage.attemptQuestion("MCQ_TF", attemptTypes.WRONG, quetypeMap.Q1.attemptData);
          studentTestPage.clickOnNext();
          studentTestPage.submitTest();
          reportsPage.validateStats(1, `1/3`, undefined, "0");
          assignmentsPage.sidebar.clickOnAssignment();
          cy.contains("You don't have any currently assigned or completed assignments.");
        });
      });
    });
  });

  context(`> select '${regradeOptions.settings.chooseAll}'`, () => {
    /* Context: 2
class1- not overidden
class2- overidden
before:{
  test will have defualt max attempt-1
  assign without overiding for class-1 and overide to 2 for class-2 
  attempt from both classes and keep one student in-progress and one in submitted with signle attempt.

  regrade the max attempts to 3
  select to include overidden assignments
}
tests:{
  attempt by all students in both classes
  for class-1 
    submitted student : attempt count should be 2/3
    in prgress student: attempt count should be 1/3
  for class-2
    submitted student : attempt count should be 2/3
    in prgress student: attempt count should be 1/3   
}

*/
    before("> assign without overiding", () => {
      cy.deleteAllAssignments("", teacher);
      cy.login("teacher", teacher);

      /* assign without overiding */
      testlibaryPage.assignPage.visitAssignPageById(test2);
      testlibaryPage.assignPage.selectClass(classes[0]);
      testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
        assignid1 = assignObj[test2];
      });

      /* assign with overiding "MAX_ATTEMPTS" to 2 */
      testlibaryPage.assignPage.visitAssignPageById(test2);
      testlibaryPage.assignPage.selectClass(classes[1]);
      testlibaryPage.assignPage.showOverRideSetting();
      testlibaryPage.assignPage.setMaxAttempt(initialMaxattempt);
      testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
        assignid2 = assignObj[test2];
      });

      /* attempt and keep student according to required status */
      [...attemptsdata1, ...attemptsdata2].forEach(attemptsdata => {
        const { email, status, attempt } = attemptsdata;
        studentTestPage.attemptAssignment(email, status, attempt, quetypeMap);
      });
    });
    context("> edit settings and regrade", () => {
      before("> login as teacher", () => {
        /* edit and change "MAX_ATTEMPTS" to 3 and regrade */
        cy.login("teacher", teacher);
        testlibaryPage.visitTestById(test2);
        testlibaryPage.publishedToDraftAssigned();
        testlibaryPage.getVersionedTestID().then(id => {
          versionedTest2 = id;
        });

        testlibaryPage.header.clickOnSettings();
        testlibaryPage.testSettings.setMaxAttempt(regardedMaxAttempt);
        testlibaryPage.header.clickRegradePublish();
        /* select to include overidden test */
        regrade.checkRadioByValue(regradeOptions.settings.excludeOveridden);
        regrade.applyRegrade();
      });

      context(`> verify student side`, () => {
        [attemptsdata1, attemptsdata2].forEach((attemptData, index) => {
          attemptData.forEach(attemptsdata => {
            it(`> for student ${attemptsdata.status} with '${index === 0 ? "not " : ""}overidden' assignment`, () => {
              const { email, status } = attemptsdata;
              cy.login("student", email);
              studentTestPage.attemptAssignment(email, studentSide.SUBMITTED, attemptAfterRegrade, quetypeMap);
              /* verify attempt count (overidden test: 3, not overridden:3 ) according to assignment status and selected regrade option */
              reportsPage.validateStats(
                status === studentSide.SUBMITTED ? 2 : 1,
                `${status === studentSide.SUBMITTED ? "2" : "1"}/${regardedMaxAttempt}`,
                undefined,
                "0"
              );
            });
          });
        });
      });

      [attemptsdata1, attemptsdata2].forEach((attemptData, ind) => {
        /* verify latest response in lcb for both students */
        context(`> verify teacher side for '${ind === 0 ? "" : "not "}overiden' test`, () => {
          before("> login click on lcb by assignment id", () => {
            cy.login("teacher", teacher);
            testlibaryPage.sidebar.clickOnAssignment();
            authorAssignmentPage.clickOnLCBbyTestId(versionedTest2, ind === 0 ? assignid1 : assignid2);
          });
          it("> verify card view", () => {
            attemptData.forEach((stu, ind) => {
              lcb.getStudentScoreByIndex(ind).should("contain.text", `0 / 2`);
              lcb.verifyQuestionCards(ind, [attemptTypes.WRONG]);
            });
          });
          it("> verify student centric", () => {
            lcb.clickOnStudentsTab();
            attemptData.forEach((stu, ind) => {
              lcb.questionResponsePage.selectStudent(stu.name);
              if (stu.status === studentSide.SUBMITTED) lcb.questionResponsePage.selectAttempt(2);
              lcb.questionResponsePage.verifyQuestionResponseCard(
                2,
                quetypeMap.Q1.queKey,
                attemptTypes.WRONG,
                quetypeMap.Q1.attemptData,
                true,
                0
              );
            });
          });
          it("> verify question centric", () => {
            lcb.clickonQuestionsTab();
            attemptData.forEach((stu, ind) => {
              lcb.questionResponsePage.verifyQuestionResponseCard(
                2,
                quetypeMap.Q1.queKey,
                attemptTypes.WRONG,
                quetypeMap.Q1.attemptData,
                false,
                stu.name
              );
            });
          });
          it("> verify exress grader", () => {
            lcb.header.clickOnExpressGraderTab();

            expressGraderPage.setToggleToScore();
            attemptData.forEach((stu, ind) => {
              expressGraderPage.getGridRowByStudent(stu.name);
              expressGraderPage.verifyScoreForStudent(
                "Q1",
                2,
                attemptTypes.WRONG,
                quetypeMap.Q1.attemptData,
                quetypeMap.Q1.queKey
              );
            });

            expressGraderPage.setToggleToResponse();
            attemptData.forEach((stu, ind) => {
              expressGraderPage.getGridRowByStudent(stu.name);
              expressGraderPage.verifyResponseEntryByIndexOfSelectedRow("B", "Q1");
            });
          });
        });
      });
    });
  });
});
