import FileHelper from "../../../../../framework/util/fileHelper";
import TestLibrary from "../../../../../framework/author/tests/testLibraryPage";
import Regrade from "../../../../../framework/author/tests/regrade/regrade";
import { regradeOptions, studentSide } from "../../../../../framework/constants/assignmentStatus";
import { attemptTypes, deliverType } from "../../../../../framework/constants/questionTypes";
import StudentTestPage from "../../../../../framework/student/studentTestPage";
import AssignmentsPage from "../../../../../framework/student/assignmentsPage";
import AuthorAssignmentPage from "../../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../../framework/author/assignments/LiveClassboardPage";
import ExpressGraderPage from "../../../../../framework/author/assignments/expressGraderPage";
import CypressHelper from "../../../../../framework/util/cypressHelpers";
import GroupItemsPage from "../../../../../framework/author/tests/testDetail/groupItemsPage";

describe(`>${FileHelper.getSpecName(Cypress.spec.name)}> regrade settings- 'shuffle questions'`, () => {
  const testlibaryPage = new TestLibrary();
  const regrade = new Regrade();
  const studentTestPage = new StudentTestPage();
  const assignmentsPage = new AssignmentsPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const lcb = new LiveClassboardPage();
  const expressGraderPage = new ExpressGraderPage();
  const groupItemsPage = new GroupItemsPage();

  const { _ } = Cypress;
  const classes = ["Class-1", "Class-2"];
  const teacher = "teacher.regrade.shuffle.que@snapwiz.com";
  const attempt = { Q1: attemptTypes.RIGHT, Q2: attemptTypes.WRONG, Q3: attemptTypes.RIGHT, Q4: attemptTypes.SKIP };
  const queData = {
    attemptData: { right: "right", wrong: "wrong" },
    queKey: "MCQ_TF.2",
    choices: ["right", "wrong"],
    queString: " - This is MCQ_TF.2"
  };
  const students = {
    class1: {
      1: { email: "s1.c1.regrade.shuffle.que@snapwiz.com", status: studentSide.SUBMITTED, name: "Stu1Class1" },
      2: { email: "s2.c1.regrade.shuffle.que@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu2Class1" },
      3: { email: "s3.c1.regrade.shuffle.que@snapwiz.com", status: studentSide.NOT_STARTED, name: "Stu3Class1" }
    },

    class2: {
      1: { email: "s1.c2.regrade.shuffle.que@snapwiz.com", status: studentSide.SUBMITTED, name: "Stu1Class2" },
      2: { email: "s2.c2.regrade.shuffle.que@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu2Class2" },
      3: { email: "s3.c2.regrade.shuffle.que@snapwiz.com", status: studentSide.NOT_STARTED, name: "Stu3Class2" }
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
    Q1: { ...queData },
    Q2: { ...queData },
    Q3: { ...queData },
    Q4: { ...queData }
  };
  const test = "5f188ee6146a8b000749c19e";

  let test1;
  let test2;
  let assignid1;
  let assignid2;
  let versionedTest1;
  let versionedTest2;
  let itemSeqInTest = [
    "5f17db60e2bc1b000718fa40",
    "5f17db8c24151c000717b58f",
    "5f17dbc162a6c500088a5eed",
    "5f188efb146a8b000749c1a0"
  ];
  let groups = { 1: { deliverType: deliverType.ALL, deliveryCount: 4, items: itemSeqInTest } };

  before("> create test 2 tests", () => {
    cy.login("teacher", teacher);
    /* testlibaryPage
      .createTest("EDIT_ASSIGNED_TEST")
      .then(id => {
        test1 = id;
        itemSeqInTest = testlibaryPage.items;
        groups[1].items = testlibaryPage.items;
      }) */
  });

  context(`> select '${regradeOptions.settings.excludeOveridden}'`, () => {
    /* 
    before{
       assign class1 with no shuffle(defualt test setting)
       assign class2 with shuffle (overidden)

       attempt and keep one student for each status required

       edit test to have shuffle questions and regrade with exclude overidden
    }

    test{
        class1 only NOT STARTED student should get shuffled question
        class2 all studentd should get shuffled questions

        lcb and eg: should have items in order as same as original test
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
        });

        testlibaryPage.assignPage.visitAssignPageById(test1);
        testlibaryPage.assignPage.selectClass(classes[1]);
        testlibaryPage.assignPage.showOverRideSetting();
        testlibaryPage.assignPage.selectShuffleQuestions();
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignid2 = assignObj[test1];
        });

        [...attemptsdata1, ...attemptsdata2]
          .filter(({ status }) => status !== studentSide.NOT_STARTED)
          .forEach(studentdata => {
            const { email, status, attempt, overidden } = studentdata;
            cy.login("student", email);

            studentTestPage.assignmentPage.clickOnAssigmentByTestId(test1).then(deliveredItemGroups => {
              const deliveredSeq = groupItemsPage.getItemDeliverySeq(
                deliveredItemGroups,
                groups,
                /* shuffle for overidden */
                overidden ? true : false
              );

              deliveredSeq.forEach((id, ind) => {
                /* getting exact item delivered at current question index */
                const currentQuesIndex = itemSeqInTest.indexOf(id);
                studentTestPage.attemptQuestion(
                  queData.queKey.split(".")[0],
                  _.values(attempt)[currentQuesIndex],
                  queData.attemptData
                );

                /* handling next() after last question + student status */
                if (ind !== itemSeqInTest.length - 1)
                  studentTestPage.clickOnNext(
                    false,
                    _.values(attempt)[currentQuesIndex] === attemptTypes.SKIP ? true : false
                  );
                else if (status === studentSide.SUBMITTED)
                  /* submit */
                  studentTestPage
                    .clickOnNext(false, _.values(attempt)[currentQuesIndex] === attemptTypes.SKIP ? true : false)
                    .then(() => studentTestPage.submitTest());
                else studentTestPage.clickOnExitTest(); /* exit */
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
        testlibaryPage.testSettings.setShuffleQuestions();
        testlibaryPage.header.clickRegradePublish();

        /* select to eclude overidden test */
        regrade.checkRadioByValue(regradeOptions.settings.excludeOveridden);
        regrade.applyRegrade();
      });

      context(`> verify student side`, () => {
        [...attemptsdata1, ...attemptsdata2]
          .filter(({ status }) => status === studentSide.IN_PROGRESS)
          .forEach((studentdata, index) => {
            const { email, overidden } = studentdata;
            it(`> for student ${studentdata.status} with '${overidden ? "" : "not "}overidden' assignment`, () => {
              cy.login("student", email);

              assignmentsPage.clickOnAssigmentByTestId(versionedTest1).then(deliveredItemGroups => {
                const deliveredSeq = groupItemsPage.getItemDeliverySeq(
                  deliveredItemGroups,
                  groups,
                  overidden ? true : false
                );

                /* overidden class2 student will have shuffled */
                /* not overidden class1 student will not have shuffled */
                studentTestPage.getQuestionByIndex(0, true);
                deliveredSeq.forEach((id, ind) => {
                  const currentQuesIndex = itemSeqInTest.indexOf(id);
                  studentTestPage.getQuestionText().should("contain", `Q${currentQuesIndex + 1}${queData.queString}`);
                  studentTestPage.clickOnNext(
                    false,
                    _.values(attempt)[currentQuesIndex] === attemptTypes.SKIP ? true : false
                  );
                });
                studentTestPage.submitTest();
              });
            });
          });
        [...attemptsdata1, ...attemptsdata2]
          .filter(({ status }) => status === studentSide.NOT_STARTED)
          .forEach((studentdata, index) => {
            const { email, overidden } = studentdata;
            it(`> for student ${studentdata.status} with '${overidden ? "" : "not"}overidden' assignment`, () => {
              cy.login("student", email);

              assignmentsPage.clickOnAssigmentByTestId(versionedTest1).then(deliveredItemGroups => {
                const deliveredSeq = groupItemsPage.getItemDeliverySeq(deliveredItemGroups, groups, true);

                /* Both class students will have shuffled */
                deliveredSeq.forEach((id, ind) => {
                  const currentQuesIndex = itemSeqInTest.indexOf(id);
                  studentTestPage.getQuestionText().should("contain", `Q${currentQuesIndex + 1}${queData.queString}`);
                  studentTestPage.attemptQuestion(
                    queData.queKey.split(".")[0],
                    _.values(attempt)[currentQuesIndex],
                    queData.attemptData
                  );

                  studentTestPage.clickOnNext(
                    false,
                    _.values(attempt)[currentQuesIndex] === attemptTypes.SKIP ? true : false
                  );
                });
                studentTestPage.submitTest();
              });
            });
          });
      });
      [attemptsdata1, attemptsdata2].forEach((studentdata, ind) => {
        context(`> verify teacher side for '${studentdata[0].overidden ? "" : "not "}overidden' assignment`, () => {
          before("> login and click on lcb by assignment id", () => {
            cy.login("teacher", teacher);
            testlibaryPage.sidebar.clickOnAssignment();
            authorAssignmentPage.clickOnLCBbyTestId(versionedTest1, ind === 0 ? assignid1 : assignid2);
          });

          it("> verify card view", () => {
            studentdata.forEach((stu, ind) => {
              lcb.getStudentScoreByIndex(ind).should("contain.text", `4 / 8`);
              lcb.verifyQuestionCards(ind, _.values(stu.attempt));
            });
          });

          it("> verify student centric", () => {
            lcb.clickOnStudentsTab();
            studentdata.forEach((stu, ind) => {
              lcb.questionResponsePage.selectStudent(stu.name);
              itemSeqInTest.forEach((id, ind) => {
                lcb.questionResponsePage.getQuestionContainer(ind).should("contain", `Q${ind + 1}${queData.queString}`);
              });
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
          /* redirecting overidden assignment should have shuffled questions for both class students */
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
            cy.login("student", studentdata[0].email);
            assignmentsPage
              .clickOnAssigmentByTestId(versionedTest1, { isFirstAttempt: false })
              .then(deliveredItemGroups => {
                const deliveredSeq = groupItemsPage.getItemDeliverySeq(deliveredItemGroups, groups, true);
                deliveredSeq.forEach((id, ind) => {
                  const currentQuesIndex = itemSeqInTest.indexOf(id);
                  studentTestPage.getQuestionText().should("contain", `Q${currentQuesIndex + 1}${queData.queString}`);
                  studentTestPage.clickOnNext(false, true);
                });
                studentTestPage.submitTest();
              });
          });
        });
      });
    });
  });

  context(`> select '${regradeOptions.settings.chooseAll}'`, () => {
    /* 
    before{
        edit test to have shuffled que on in test level
       assign class1 with shuffle( test setting)
       assign class2 with no shuffle (overidden)

       attempt and keep one student for each status required

       edit test to dont have shuffle questions and regrade with all assignments included
    }

    test{
        class1 only NOT STARTED student should not get shuffled question
        class2 all studentd should not get shuffled questions

        lcb and eg: should have items in order as same as original test
    }
    */
    before("> assign without/with overiding", () => {
      cy.login("teacher", teacher);
      cy.deleteAllAssignments("", teacher);
      testlibaryPage.searchAndClickTestCardById(test);
      testlibaryPage.clickOnDuplicate();
      testlibaryPage.testSummary.setName("name");
      testlibaryPage.header.clickOnSaveButton(true);
      testlibaryPage.header.clickOnSettings();
      testlibaryPage.testSettings.setShuffleQuestions();
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
        testlibaryPage.assignPage.deselectShuffleQuestions();
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignid2 = assignObj[test2];
        });

        /* attempt and keep student according to required status */
        [...attemptsdata1, ...attemptsdata2]
          .filter(({ status }) => status !== studentSide.NOT_STARTED)
          .forEach(studentdata => {
            const { email, status, attempt, overidden } = studentdata;
            cy.login("student", email);

            studentTestPage.assignmentPage.clickOnAssigmentByTestId(test2).then(deliveredItemGroups => {
              const deliveredSeq = groupItemsPage.getItemDeliverySeq(
                deliveredItemGroups,
                groups,
                overidden ? false : true
              );

              deliveredSeq.forEach((id, ind) => {
                const currentQuesIndex = itemSeqInTest.indexOf(id);
                studentTestPage.attemptQuestion(
                  queData.queKey.split(".")[0],
                  _.values(attempt)[currentQuesIndex],
                  queData.attemptData
                );

                if (ind !== itemSeqInTest.length - 1)
                  studentTestPage.clickOnNext(
                    false,
                    _.values(attempt)[currentQuesIndex] === attemptTypes.SKIP ? true : false
                  );
                else if (status === studentSide.SUBMITTED)
                  /* submit */
                  studentTestPage
                    .clickOnNext(false, _.values(attempt)[currentQuesIndex] === attemptTypes.SKIP ? true : false)
                    .then(() => studentTestPage.submitTest());
                else studentTestPage.clickOnExitTest(); /* exit */
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
        testlibaryPage.testSettings.unSetShuffleQuestions();
        testlibaryPage.header.clickRegradePublish();

        /* select to include overidden test */
        regrade.checkRadioByValue(regradeOptions.settings.chooseAll);
        regrade.applyRegrade();
      });

      context(`> verify student side`, () => {
        [...attemptsdata1, ...attemptsdata2]
          .filter(({ status }) => status === studentSide.IN_PROGRESS)
          .forEach((studentdata, index) => {
            it(`> for student ${studentdata.status} with '${
              studentdata.overidden ? " " : "not "
            }overidden' assignment`, () => {
              const { email, overidden } = studentdata;
              cy.login("student", email);

              assignmentsPage.clickOnAssigmentByTestId(versionedTest2).then(deliveredItemGroups => {
                const deliveredSeq = groupItemsPage.getItemDeliverySeq(
                  deliveredItemGroups,
                  groups,
                  overidden ? false : true
                );

                studentTestPage.getQuestionByIndex(0, true);
                deliveredSeq.forEach((id, ind) => {
                  const currentQuesIndex = itemSeqInTest.indexOf(id);
                  studentTestPage.getQuestionText().should("contain", `Q${currentQuesIndex + 1}${queData.queString}`);
                  studentTestPage.clickOnNext(
                    false,
                    _.values(attempt)[currentQuesIndex] === attemptTypes.SKIP ? true : false
                  );
                });
                studentTestPage.submitTest();
              });
            });
          });
        [...attemptsdata1, ...attemptsdata2]
          .filter(({ status }) => status === studentSide.NOT_STARTED)
          .forEach((studentdata, classIndex) => {
            it(`> for student ${studentdata.status} with '${
              studentdata.overidden ? " " : "not "
            }overidden' assignment`, () => {
              const { email } = studentdata;
              cy.login("student", email);

              assignmentsPage.clickOnAssigmentByTestId(versionedTest2).then(deliveredItemGroups => {
                const deliveredSeq = groupItemsPage.getItemDeliverySeq(deliveredItemGroups, groups);

                deliveredSeq.forEach((id, ind) => {
                  const currentQuesIndex = itemSeqInTest.indexOf(id);
                  studentTestPage.getQuestionText().should("contain", `Q${currentQuesIndex + 1}${queData.queString}`);
                  studentTestPage.attemptQuestion(
                    queData.queKey.split(".")[0],
                    _.values(attempt)[ind],
                    queData.attemptData
                  );

                  studentTestPage.clickOnNext(false, ind === itemSeqInTest.length - 1 ? true : false);
                });
                studentTestPage.submitTest();
              });
            });
          });
      });
      [attemptsdata1, attemptsdata2].forEach((studentdata, classIndex) => {
        context(`> verify teacher side for '${studentdata[0].overidden ? "" : "not "}overidden' assignment`, () => {
          before("> login and click on lcb by assignment id", () => {
            cy.login("teacher", teacher);
            testlibaryPage.sidebar.clickOnAssignment();
            authorAssignmentPage.clickOnLCBbyTestId(versionedTest2, classIndex === 0 ? assignid1 : assignid2);
          });

          it("> verify card view", () => {
            studentdata.forEach((stu, studentIndex) => {
              lcb.getStudentScoreByIndex(studentIndex).should("contain.text", `4 / 8`);
              lcb.verifyQuestionCards(studentIndex, _.values(stu.attempt));
            });
          });

          it("> verify student centric", () => {
            lcb.clickOnStudentsTab();
            studentdata.forEach((stu, studentIndex) => {
              lcb.questionResponsePage.selectStudent(stu.name);
              itemSeqInTest.forEach((id, ind) => {
                lcb.questionResponsePage.getQuestionContainer(ind).should("contain", `Q${ind + 1}${queData.queString}`);
              });
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
            cy.login("student", studentdata[0].email);
            assignmentsPage
              .clickOnAssigmentByTestId(versionedTest2, { isFirstAttempt: false })
              .then(deliveredItemGroups => {
                const deliveredSeq = groupItemsPage.getItemDeliverySeq(deliveredItemGroups, groups);
                deliveredSeq.forEach((id, ind) => {
                  const currentQuesIndex = itemSeqInTest.indexOf(id);
                  studentTestPage.getQuestionText().should("contain", `Q${currentQuesIndex + 1} - This is MCQ_TF.2`);
                  studentTestPage.clickOnNext(false, true);
                });
                studentTestPage.submitTest();
              });
          });
        });
      });
    });
  });
});
