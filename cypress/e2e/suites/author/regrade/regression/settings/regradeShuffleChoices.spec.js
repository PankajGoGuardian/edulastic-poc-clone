import FileHelper from "../../../../../framework/util/fileHelper";
import TestLibrary from "../../../../../framework/author/tests/testLibraryPage";
import Regrade from "../../../../../framework/author/tests/regrade/regrade";
import { regradeOptions, studentSide } from "../../../../../framework/constants/assignmentStatus";
import { attemptTypes } from "../../../../../framework/constants/questionTypes";
import StudentTestPage from "../../../../../framework/student/studentTestPage";
import AssignmentsPage from "../../../../../framework/student/assignmentsPage";
import AuthorAssignmentPage from "../../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../../framework/author/assignments/LiveClassboardPage";
import ExpressGraderPage from "../../../../../framework/author/assignments/expressGraderPage";
import CypressHelper from "../../../../../framework/util/cypressHelpers";

describe(`>${FileHelper.getSpecName(Cypress.spec.name)}> regrade settings- 'shuffle questions'`, () => {
  const testlibaryPage = new TestLibrary();
  const regrade = new Regrade();
  const studentTestPage = new StudentTestPage();
  const assignmentsPage = new AssignmentsPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const lcb = new LiveClassboardPage();
  const expressGraderPage = new ExpressGraderPage();

  const { _ } = Cypress;
  const classes = ["Class-1", "Class-2"];
  const teacher = "teacher.regrade.shuffle.choices@snapwiz.com";
  const attempt = { Q1: attemptTypes.RIGHT };
  const queData = {
    attemptData: { right: ["right-1", "right-2"] },
    queKey: "MCQ_MULTI.5",
    choices: ["right-1", "wrong-1", "wrong-2", "right-2"],
    points: 2
  };
  const students = {
    class1: {
      1: { email: "s1.c1.regrade.shuffle.choices@snapwiz.com", status: studentSide.SUBMITTED, name: "Stu1Class1" },
      2: { email: "s2.c1.regrade.shuffle.choices@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu2Class1" },
      3: { email: "s3.c1.regrade.shuffle.choices@snapwiz.com", status: studentSide.NOT_STARTED, name: "Stu3Class1" }
    },

    class2: {
      1: { email: "s1.c2.regrade.shuffle.choices@snapwiz.com", status: studentSide.SUBMITTED, name: "Stu1Class2" },
      2: { email: "s2.c2.regrade.shuffle.choices@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu2Class2" },
      3: { email: "s3.c2.regrade.shuffle.choices@snapwiz.com", status: studentSide.NOT_STARTED, name: "Stu3Class2" }
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
  let test;
  let test1;
  let test2;
  let assignid1;
  let assignid2;
  let versionedTest1;
  let versionedTest2;
  let originalSequence = ["right-1", "wrong-1", "wrong-2", "right-2"];

  before("> create test 2 tests", () => {
    cy.login("teacher", teacher);
    testlibaryPage.createTest("REGRADE_EDITED_ITEM").then(id => {
      test = id;
    });
  });

  context(`> select '${regradeOptions.settings.excludeOveridden}'`, () => {
    /* 
    before{
       assign class1 with no shuffle(defualt test setting)
       assign class2 with shuffle (overidden)

       attempt and keep one student for each status required

       edit test to have shuffle choice and regrade with exclude overidden
    }

    test{
        class1 only NOT STARTED student should get shuffled choices
        class2 all studentd should get shuffled choices

        lcb and eg: should have choices in order as same as original test
    }
    */
    before("> assign without/with overiding", () => {
      cy.deleteAllAssignments("", teacher);
      testlibaryPage.searchAndClickTestCardById(test);
      testlibaryPage.clickOnDuplicate();
      testlibaryPage.testSummary.setName("test assesment");
      testlibaryPage.header.clickOnSaveButton(true);
      testlibaryPage.header.clickOnSettings();
      testlibaryPage.testSettings.unSetShuffleChoices();
      testlibaryPage.header.clickOnPublishButton().then(id => {
        test1 = id;

        testlibaryPage.clickOnAssign();
        testlibaryPage.assignPage.selectClass(classes[0]);
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignid1 = assignObj[test1];
        });

        testlibaryPage.assignPage.visitAssignPageById(test1);
        testlibaryPage.assignPage.selectClass(classes[1]);
        testlibaryPage.assignPage.showOverRideSetting();
        testlibaryPage.assignPage.selectShuffleChoices();
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignid2 = assignObj[test1];
        });

        [...attemptsdata1, ...attemptsdata2]
          .filter(({ status }) => status !== studentSide.NOT_STARTED)
          .forEach(studentdata => {
            const { email, status, attempt, overidden } = studentdata;
            studentTestPage.attemptAssignment(email, status, attempt, questionTypeMap);
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
        testlibaryPage.testSettings.setShuffleChoices();
        testlibaryPage.header.clickRegradePublish();

        /* select to eclude overidden test */
        regrade.checkRadioByValue(regradeOptions.settings.excludeOveridden);
        regrade.applyRegrade();
      });

      context(`> verify student side`, () => {
        [...attemptsdata1, ...attemptsdata2]
          .filter(({ status }) => status === studentSide.IN_PROGRESS || status === studentSide.NOT_STARTED)
          .forEach((studentdata, index) => {
            const { email, overidden, status } = studentdata;
            it(`> for student ${status} with '${overidden ? "" : "not "}overidden' assignment`, () => {
              const attemptChoiceOrder = [];
              cy.login("student", email);
              assignmentsPage.clickOnAssigmentByTestId(versionedTest1);
              studentTestPage.getAllChoices().should("contain", originalSequence[2]);
              studentTestPage
                .getAllChoices()
                .each($ele => attemptChoiceOrder.push($ele.text().trim()))
                .then(() => {
                  overidden || status === studentSide.NOT_STARTED
                    ? CypressHelper.checkObjectInEquality(attemptChoiceOrder, originalSequence)
                    : CypressHelper.checkObjectEquality(attemptChoiceOrder, originalSequence);
                });
              if (status === studentSide.NOT_STARTED)
                studentTestPage.attemptQuestion(queData.queKey.split(".")[0], attemptTypes.RIGHT, queData.attemptData);
              else
                studentTestPage.verifyQuestionResponseRetained(
                  queData.queKey.split(".")[0],
                  attemptTypes.RIGHT,
                  queData.attemptData
                );
              studentTestPage.clickOnNext();
              studentTestPage.submitTest();
            });
          });
      });
      [attemptsdata1, attemptsdata2].forEach((studentdata, ind) => {
        context("> verify teacher side for not overidden assignment", () => {
          before("> login and click on lcb by assignment id", () => {
            cy.login("teacher", teacher);
            testlibaryPage.sidebar.clickOnAssignment();
            authorAssignmentPage.clickOnLCBbyTestId(versionedTest1, ind === 0 ? assignid1 : assignid2);
          });

          it("> verify card view", () => {
            studentdata.forEach((stu, ind) => {
              lcb.getStudentScoreByIndex(ind).should("contain.text", `2 / 2`);
              lcb.verifyQuestionCards(ind, _.values(stu.attempt));
            });
          });

          it("> verify student centric", () => {
            lcb.clickOnStudentsTab();
            studentdata.forEach((stu, ind) => {
              lcb.questionResponsePage.selectStudent(stu.name);
              lcb.questionResponsePage
                .getLabels(lcb.questionResponsePage.getQuestionContainer(0))
                .each(($ele, i) => cy.wrap($ele).should("contain.text", originalSequence[i]));
              lcb.questionResponsePage.verifyQuestionResponseCard(
                queData.points,
                queData.queKey,
                attemptTypes.RIGHT,
                queData.attemptData,
                true,
                0
              );
            });
          });

          it("> verify question centric", () => {
            lcb.clickonQuestionsTab();
            studentdata.forEach((stu, ind) => {
              lcb.questionResponsePage
                .getLabels(lcb.questionResponsePage.getQuestionContainerByStudent(stu.name))
                .each(($ele, i) => cy.wrap($ele).should("contain.text", originalSequence[i]));
              lcb.questionResponsePage.verifyQuestionResponseCard(
                queData.points,
                queData.queKey,
                attemptTypes.RIGHT,
                queData.attemptData,
                false,
                stu.name
              );
            });
          });

          it("> verify exress grader", () => {
            const { attemptData, queKey } = queData;
            lcb.header.clickOnExpressGraderTab();

            studentdata.forEach((stu, ind) => {
              expressGraderPage.setToggleToScore();
              expressGraderPage.getGridRowByStudent(stu.name);
              _.keys(attempt).forEach((que, ind) => {
                expressGraderPage.verifyScoreForStudent(que, 2, _.values(attempt)[ind], attemptData, queKey);
              });

              expressGraderPage.setToggleToResponse();
              expressGraderPage.verifyResponseGrid(attempt, questionTypeMap, stu.name);
            });
          });
        });
      });

      [attemptsdata1, attemptsdata2].forEach((studentdata, index) => {
        context(`> redirect '${index === 0 ? "not " : ""}overidden' assignment`, () => {
          /* redirecting overidden assignment should have shuffled choices for both class students */
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

          it("> verify student", () => {
            const attemptChoiceOrder = [];
            cy.login("student", studentdata[0].email);
            assignmentsPage.clickOnAssigmentByTestId(versionedTest1, { isFirstAttempt: false });
            studentTestPage.getAllChoices().should("contain", originalSequence[2]);
            studentTestPage
              .getAllChoices()
              .each($ele => attemptChoiceOrder.push($ele.text().trim()))
              .then(() => CypressHelper.checkObjectInEquality(attemptChoiceOrder, originalSequence));
          });
        });
      });
    });
  });

  context(`> select '${regradeOptions.settings.chooseAll}'`, () => {
    /* 
    before{
       assign class1 with no shuffle(defualt test setting)
       assign class2 with shuffle (overidden)

       attempt and keep one student for each status required

       edit test to have shuffle questions and regrade with choose all
    test{
        class1 only NOT STARTED student should get shuffled choices
        class2 all studentd should get shuffled choices

        lcb and eg: should have choices in order as same as original test
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
      testlibaryPage.testSettings.setShuffleChoices();
      testlibaryPage.header.clickOnPublishButton().then(id => {
        test2 = id;
        testlibaryPage.clickOnAssign();
        testlibaryPage.assignPage.selectClass(classes[0]);
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignid1 = assignObj[test2];
        });

        testlibaryPage.assignPage.visitAssignPageById(test2);
        testlibaryPage.assignPage.selectClass(classes[1]);
        testlibaryPage.assignPage.showOverRideSetting();
        testlibaryPage.assignPage.deselectShuffleChoices();
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignid2 = assignObj[test2];
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
        testlibaryPage.visitTestById(test2);
        testlibaryPage.publishedToDraftAssigned();
        testlibaryPage.getVersionedTestID().then(id => {
          versionedTest2 = id;
        });

        testlibaryPage.header.clickOnSettings();
        testlibaryPage.testSettings.unSetShuffleChoices();
        testlibaryPage.header.clickRegradePublish();

        /* select to eclude overidden test */
        regrade.checkRadioByValue(regradeOptions.settings.chooseAll);
        regrade.applyRegrade();
      });

      context(`> verify student side`, () => {
        [...attemptsdata1, ...attemptsdata2]
          .filter(({ status }) => status !== studentSide.SUBMITTED)
          .forEach((studentdata, index) => {
            const { email, overidden, status } = studentdata;
            it(`> for student ${status} with '${overidden ? "" : "not "}overidden' assignment`, () => {
              const attemptChoiceOrder = [];
              cy.login("student", email);

              assignmentsPage.clickOnAssigmentByTestId(versionedTest2);
              studentTestPage.getAllChoices().should("contain", originalSequence[2]);
              studentTestPage
                .getAllChoices()
                .each($ele => attemptChoiceOrder.push($ele.text().trim()))
                .then(() => {
                  !overidden && status === studentSide.IN_PROGRESS
                    ? CypressHelper.checkObjectInEquality(attemptChoiceOrder, originalSequence)
                    : CypressHelper.checkObjectEquality(attemptChoiceOrder, originalSequence);
                });

              if (status === studentSide.NOT_STARTED)
                studentTestPage.attemptQuestion(queData.queKey.split(".")[0], attemptTypes.RIGHT, queData.attemptData);
              else
                studentTestPage.verifyQuestionResponseRetained(
                  queData.queKey.split(".")[0],
                  attemptTypes.RIGHT,
                  queData.attemptData
                );
              studentTestPage.clickOnNext();
              studentTestPage.submitTest();
            });
          });
      });
      [attemptsdata1, attemptsdata2].forEach((studentdata, ind) => {
        context("> verify teacher side for not overidden assignment", () => {
          before("> login and click on lcb by assignment id", () => {
            cy.login("teacher", teacher);
            testlibaryPage.sidebar.clickOnAssignment();
            authorAssignmentPage.clickOnLCBbyTestId(versionedTest2, ind === 0 ? assignid1 : assignid2);
          });

          it("> verify card view", () => {
            studentdata.forEach((stu, ind) => {
              lcb.getStudentScoreByIndex(ind).should("contain.text", `2 / 2`);
              lcb.verifyQuestionCards(ind, _.values(stu.attempt));
            });
          });

          it("> verify student centric", () => {
            lcb.clickOnStudentsTab();
            studentdata.forEach((stu, ind) => {
              lcb.questionResponsePage.selectStudent(stu.name);
              lcb.questionResponsePage
                .getLabels(lcb.questionResponsePage.getQuestionContainer(0))
                .each(($ele, i) => cy.wrap($ele).should("contain.text", originalSequence[i]));
              lcb.questionResponsePage.verifyQuestionResponseCard(
                queData.points,
                queData.queKey,
                attemptTypes.RIGHT,
                queData.attemptData,
                true,
                0
              );
            });
          });

          it("> verify question centric", () => {
            lcb.clickonQuestionsTab();
            studentdata.forEach((stu, ind) => {
              lcb.questionResponsePage
                .getLabels(lcb.questionResponsePage.getQuestionContainerByStudent(stu.name))
                .each(($ele, i) => cy.wrap($ele).should("contain.text", originalSequence[i]));
              lcb.questionResponsePage.verifyQuestionResponseCard(
                queData.points,
                queData.queKey,
                attemptTypes.RIGHT,
                queData.attemptData,
                false,
                stu.name
              );
            });
          });

          it("> verify exress grader", () => {
            const { attemptData, queKey } = queData;
            lcb.header.clickOnExpressGraderTab();

            studentdata.forEach((stu, ind) => {
              expressGraderPage.setToggleToScore();
              expressGraderPage.getGridRowByStudent(stu.name);
              _.keys(attempt).forEach((que, ind) => {
                expressGraderPage.verifyScoreForStudent(que, 2, _.values(attempt)[ind], attemptData, queKey);
              });

              expressGraderPage.setToggleToResponse();
              expressGraderPage.verifyResponseGrid(attempt, questionTypeMap, stu.name);
            });
          });
        });
      });

      [attemptsdata1, attemptsdata2].forEach((studentdata, index) => {
        context(`> redirect '${index === 0 ? "not " : ""}overidden' assignment`, () => {
          /* redirecting overidden assignment should not have shuffled choices for both class students */
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

          it("> verify student", () => {
            const attemptChoiceOrder = [];
            cy.login("student", studentdata[0].email);
            assignmentsPage.clickOnAssigmentByTestId(versionedTest2, { isFirstAttempt: false });
            studentTestPage.getAllChoices().should("contain", originalSequence[2]);
            studentTestPage
              .getAllChoices()
              .each($ele => attemptChoiceOrder.push($ele.text().trim()))
              .then(() => CypressHelper.checkObjectEquality(attemptChoiceOrder, originalSequence));
          });
        });
      });
    });
  });
});
