import FileHelper from "../../../../../framework/util/fileHelper";
import TestLibrary from "../../../../../framework/author/tests/testLibraryPage";
import Regrade from "../../../../../framework/author/tests/regrade/regrade";
import { regradeOptions, studentSide, EVAL_METHODS } from "../../../../../framework/constants/assignmentStatus";
import { attemptTypes } from "../../../../../framework/constants/questionTypes";
import StudentTestPage from "../../../../../framework/student/studentTestPage";
import AssignmentsPage from "../../../../../framework/student/assignmentsPage";
import AuthorAssignmentPage from "../../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../../framework/author/assignments/LiveClassboardPage";
import ExpressGraderPage from "../../../../../framework/author/assignments/expressGraderPage";
import ReportsPage from "../../../../../framework/student/reportsPage";

describe(`>${FileHelper.getSpecName(Cypress.spec.name)}> regrade settings- 'evaluation methods'`, () => {
  const testlibaryPage = new TestLibrary();
  const regrade = new Regrade();
  const studentTestPage = new StudentTestPage();
  const assignmentsPage = new AssignmentsPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const lcb = new LiveClassboardPage();
  const expressGraderPage = new ExpressGraderPage();
  const reports = new ReportsPage();

  const classes = ["Class-1", "Class-2"];
  const teacher = "teacher.regrade.evalmethod@snapwiz.com";
  const attempt = { Q1: attemptTypes.PARTIAL_CORRECT };
  const queData = {
    attemptData: { partialCorrect: ["right-1", "wrong-2"] },
    queKey: "MCQ_MULTI",
    choices: ["right-1", "wrong-1", "wrong-2", "right-2"],
    points: 2
  };
  const students = {
    class1: {
      1: { email: "s1.c1.regrade.evalmethod@snapwiz.com", status: studentSide.SUBMITTED, name: "Stu1Class1" },
      2: { email: "s2.c1.regrade.evalmethod@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu2Class1" },
      3: { email: "s3.c1.regrade.evalmethod@snapwiz.com", status: studentSide.NOT_STARTED, name: "Stu3Class1" }
    },

    class2: {
      1: { email: "s1.c2.regrade.evalmethod@snapwiz.com", status: studentSide.SUBMITTED, name: "Stu1Class2" },
      2: { email: "s2.c2.regrade.evalmethod@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu2Class2" },
      3: { email: "s3.c2.regrade.evalmethod@snapwiz.com", status: studentSide.NOT_STARTED, name: "Stu3Class2" }
    }
  };
  const attemptsdata1 = [
    { attempt: { ...attempt }, ...students.class1[1], overidden: false },
    { attempt: { ...attempt }, ...students.class1[2], overidden: false },
    { attempt: { ...attempt }, ...students.class1[3], overidden: false }
  ];

  const attemptsdata2 = [
    { attempt: { ...attempt }, ...students.class2[1], overidden: true },
    { attempt: { ...attempt }, ...students.class2[2], overidden: true },
    { attempt: { ...attempt }, ...students.class2[3], overidden: true }
  ];

  const questionTypeMap = {
    Q1: { ...queData }
  };
  let testId1;
  let testId2;
  let testId3;
  let assignmentId1;
  let assignmentId2;
  let versionedTest1;
  let versionedTest2;

  before("> create test 2 tests", () => {
    cy.login("teacher", teacher);
    // testlibaryPage.createTest("REGRADE_EDITED_ITEM").then(id => {
    testId1 = "5f315c34fbae1500086ff06b";
    // });
  });

  context(`> select '${regradeOptions.settings.excludeOveridden}'`, () => {
    /* 

    IMPORTANT: "PARTIAL CORRECT" IS THE ATTEMPT TYPE

    before{
       assign class1 with item level eval setting(defualt test setting)
       assign class2 with partial without penalty (overidden)

       attempt and keep one student for each status required
       edit test to have all or nothing evaluation and regrade with exclude overidden
    }
    
    test{
       class1 all students should have all or nothing (here score should be 0/2)
       class2 all students should have partial without penalty(here score should be 1/2) 
    }

    */
    before("> assign without/with overiding", () => {
      cy.deleteAllAssignments("", teacher);
      testlibaryPage.searchAndClickTestCardById(testId1);
      testlibaryPage.clickOnDuplicate();
      testlibaryPage.testSummary.setName("test assesment");
      testlibaryPage.header.clickOnSaveButton(true);
      testlibaryPage.header.clickOnSettings();
      testlibaryPage.testSettings.clickOnEvalByType(EVAL_METHODS.ITEM_LEVEL);
      testlibaryPage.header.clickOnPublishButton().then(id => {
        testId2 = id;

        testlibaryPage.clickOnAssign();
        testlibaryPage.assignPage.selectClass(classes[0]);
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignmentId1 = assignObj[testId2];
        });

        testlibaryPage.assignPage.visitAssignPageById(testId2);
        testlibaryPage.assignPage.selectClass(classes[1]);
        testlibaryPage.assignPage.showOverRideSetting();
        testlibaryPage.assignPage.clickOnEvalByType(EVAL_METHODS.PARTIAL);
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignmentId2 = assignObj[testId2];
        });

        [...attemptsdata1, ...attemptsdata2].forEach(({ email, status, attempt }) => {
          studentTestPage.attemptAssignment(email, status, attempt, questionTypeMap);
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
        testlibaryPage.testSettings.clickOnEvalByType(EVAL_METHODS.ALL_OR_NOTHING);
        testlibaryPage.header.clickRegradePublish();

        /* select to exclude overidden test */
        regrade.checkRadioByValue(regradeOptions.settings.excludeOveridden);
        regrade.applyRegrade();
      });

      context(`> verify regraded eval method at student side`, () => {
        [...attemptsdata1, ...attemptsdata2].forEach(({ email, overidden, status }, index) => {
          const [score, percent, titleAdjust, evalMethod] = overidden
            ? ["1", "50", "", EVAL_METHODS.PARTIAL]
            : ["0", "0", "not ", EVAL_METHODS.ALL_OR_NOTHING];
          it(`> for student ${status} with '${titleAdjust}overidden' assignment, expected-'${evalMethod.toLowerCase()}'`, () => {
            cy.login("student", email);
            if (status !== studentSide.SUBMITTED) {
              assignmentsPage.clickOnAssigmentByTestId(versionedTest1);
              if (status === studentSide.NOT_STARTED)
                studentTestPage.attemptQuestion(questionTypeMap.Q1.queKey, attempt.Q1, questionTypeMap.Q1.attemptData);
              studentTestPage.clickOnNext();
              studentTestPage.submitTest();
            } else assignmentsPage.sidebar.clickOnGrades();
            reports.validateStats(1, "1/1", `${score}/2`, percent);
            reports.clickOnReviewButtonButton();
            reports.getAchievedScore().should("have.text", score);
          });
        });
      });
      [attemptsdata1, attemptsdata2].forEach((studentdata, ind) => {
        context(`> verify teacher side for ${ind === 0 ? "not " : " "}overidden assignment`, () => {
          before("> login and click on lcb by assignment id", () => {
            if (ind === 0) cy.login("teacher", teacher);
            testlibaryPage.sidebar.clickOnAssignment();
            authorAssignmentPage.clickOnLCBbyTestId(versionedTest1, ind === 0 ? assignmentId1 : assignmentId2);
          });

          it("> verify card view", () => {
            studentdata.forEach(({ overidden }, ind) => {
              const [score, attempt] = overidden ? ["1", attemptTypes.PARTIAL_CORRECT] : ["0", attemptTypes.WRONG];

              lcb.verifyScoreByStudentIndex(ind, score, 2);
              lcb.verifyQuestionCards(ind, [attempt]);
            });
          });

          it("> verify student centric", () => {
            lcb.clickOnStudentsTab();
            studentdata.forEach(({ name, overidden }, ind) => {
              const score = overidden ? "1" : "0";
              lcb.questionResponsePage.selectStudent(name);
              lcb.questionResponsePage.verifyTotalScoreAndImprovement(score, 2);
              lcb.questionResponsePage.getQuestionContainer(0).as("card");
              lcb.questionResponsePage.verifyScoreAndPointsByCard(cy.get("@card"), score, 2);
            });
          });

          it("> verify question centric", () => {
            lcb.clickonQuestionsTab();
            studentdata.forEach(({ name, overidden }, ind) => {
              const score = overidden ? "1" : "0";
              lcb.questionResponsePage.getQuestionContainerByStudent(name).as("card");
              lcb.questionResponsePage.verifyScoreAndPointsByCard(cy.get("@card"), score, 2);
            });
          });

          it("> verify exress grader", () => {
            lcb.header.clickOnExpressGraderTab();
            expressGraderPage.setToggleToScore();
            studentdata.forEach(({ name, overidden }) => {
              const [score, attempType] = overidden ? ["1", attemptTypes.PARTIAL_CORRECT] : ["0", attemptTypes.WRONG];
              expressGraderPage.getGridRowByStudent(name);
              expressGraderPage.getScoreforQueNum("Q1").should("have.text", score);
              expressGraderPage.verifyCellColorForQuestion("Q1", attempType);
            });
          });
        });
      });
    });
  });

  context(`> select '${regradeOptions.settings.chooseAll}'`, () => {
    /* 

    IMPORTANT: "PARTIAL CORRECT" IS THE ATTEMPT TYPE

    before{
       assign class1 with partial with penalty(defualt test setting)
       assign class2 with item level (overidden)

       attempt and keep one student for each status required
       edit test to have all or nothing evaluation and regrade with choose all
    }
    
    test{
       class1 and class2 all students should have all or nothing (here score should be 0/2)
    }
    
    */
    before("> assign without/with overiding", () => {
      cy.deleteAllAssignments("", teacher);
      cy.login("teacher", teacher);
      testlibaryPage.searchAndClickTestCardById(testId1);
      testlibaryPage.clickOnDuplicate();
      testlibaryPage.testSummary.setName("name");
      testlibaryPage.header.clickOnSaveButton(true);
      testlibaryPage.header.clickOnSettings();
      testlibaryPage.testSettings.clickOnEvalByType(EVAL_METHODS.PARTIAL_WITH_PENALTY);
      testlibaryPage.header.clickOnPublishButton().then(id => {
        testId3 = id;
        testlibaryPage.clickOnAssign();
        testlibaryPage.assignPage.selectClass(classes[0]);
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignmentId1 = assignObj[testId3];
        });

        testlibaryPage.assignPage.visitAssignPageById(testId3);
        testlibaryPage.assignPage.selectClass(classes[1]);
        testlibaryPage.assignPage.showOverRideSetting();
        testlibaryPage.assignPage.clickOnEvalByType(EVAL_METHODS.ITEM_LEVEL);
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignmentId2 = assignObj[testId3];
        });

        [...attemptsdata1, ...attemptsdata2]
          .filter(({ status }) => status !== studentSide.NOT_STARTED)
          .forEach(studentdata => {
            const { email, status, attempt } = studentdata;
            studentTestPage.attemptAssignment(email, status, attempt, questionTypeMap);
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
        testlibaryPage.testSettings.clickOnEvalByType(EVAL_METHODS.ALL_OR_NOTHING);
        testlibaryPage.header.clickRegradePublish();

        /* select to include overidden test */
        regrade.checkRadioByValue(regradeOptions.settings.chooseAll);
        regrade.applyRegrade();
      });

      context(`> verify regraded eval method at student side`, () => {
        [...attemptsdata1, ...attemptsdata2].forEach(({ email, overidden, status }, index) => {
          const titleAdjust = overidden ? "" : "not ";
          it(`> for student ${status} with '${titleAdjust}overidden' assignment, expected-'all_or_nothing'`, () => {
            cy.login("student", email);
            if (status !== studentSide.SUBMITTED) {
              assignmentsPage.clickOnAssigmentByTestId(versionedTest2);
              if (status === studentSide.NOT_STARTED)
                studentTestPage.attemptQuestion(questionTypeMap.Q1.queKey, attempt.Q1, questionTypeMap.Q1.attemptData);
              studentTestPage.clickOnNext();
              studentTestPage.submitTest();
            } else assignmentsPage.sidebar.clickOnGrades();
            reports.validateStats(1, "1/1", "0/2", "0");
            reports.clickOnReviewButtonButton();
            reports.getAchievedScore().should("have.text", "0");
          });
        });
      });
      [attemptsdata1, attemptsdata2].forEach((studentdata, ind) => {
        context(`> verify teacher side for ${ind === 0 ? "not " : " "}overidden assignment`, () => {
          before("> login and click on lcb by assignment id", () => {
            if (ind === 0) cy.login("teacher", teacher);
            testlibaryPage.sidebar.clickOnAssignment();
            authorAssignmentPage.clickOnLCBbyTestId(versionedTest2, ind === 0 ? assignmentId1 : assignmentId2);
          });

          it("> verify card view", () => {
            studentdata.forEach(({ overidden }, ind) => {
              lcb.verifyScoreByStudentIndex(ind, 0, 2);
              lcb.verifyQuestionCards(ind, [attemptTypes.WRONG]);
            });
          });

          it("> verify student centric", () => {
            lcb.clickOnStudentsTab();
            studentdata.forEach(({ name }) => {
              lcb.questionResponsePage.selectStudent(name);
              lcb.questionResponsePage.verifyTotalScoreAndImprovement(0, 2);
              lcb.questionResponsePage.getQuestionContainer(0).as("card");
              lcb.questionResponsePage.verifyScoreAndPointsByCard(cy.get("@card"), 0, 2);
            });
          });

          it("> verify question centric", () => {
            lcb.clickonQuestionsTab();
            studentdata.forEach(({ name }) => {
              lcb.questionResponsePage.getQuestionContainerByStudent(name).as("card");
              lcb.questionResponsePage.verifyScoreAndPointsByCard(cy.get("@card"), 0, 2);
            });
          });

          it("> verify exress grader", () => {
            lcb.header.clickOnExpressGraderTab();
            expressGraderPage.setToggleToScore();
            studentdata.forEach(({ name }) => {
              expressGraderPage.getGridRowByStudent(name);
              expressGraderPage.getScoreforQueNum("Q1").should("have.text", "0");
              expressGraderPage.verifyCellColorForQuestion("Q1", attemptTypes.WRONG);
            });
          });
        });
      });
    });
  });
});
