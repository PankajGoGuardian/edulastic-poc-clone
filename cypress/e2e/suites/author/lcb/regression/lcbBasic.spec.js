import FileHelper from "../../../../framework/util/fileHelper";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import { studentSide, teacherSide } from "../../../../framework/constants/assignmentStatus";
import ExpressGraderPage from "../../../../framework/author/assignments/expressGraderPage";
import StandardBasedReportPage from "../../../../framework/author/assignments/standardBasedReportPage";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import BarGraph from "../../../../framework/author/assignments/barGraphs";
import Helpers from "../../../../framework/util/Helpers";
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import { attemptTypes } from "../../../../framework/constants/questionTypes";

const students = {
  1: {
    email: "auto.lcb.student01@yopmail.com",
    stuName: "1st, Student01"
  },
  2: {
    email: "auto.lcb.student02@yopmail.com",
    stuName: "2nd, Student02"
  },
  3: {
    email: "auto.lcb.student03@yopmail.com",
    stuName: "3rd, Student03"
  },
  4: {
    email: "auto.lcb.student04@yopmail.com",
    stuName: "4th, Student04"
  },
  5: {
    email: "auto.lcb.student05@yopmail.com",
    stuName: "5th, Student05"
  },
  6: {
    email: "auto.lcb.student06@yopmail.com",
    stuName: "6th, Student06"
  },
  7: {
    email: "auto.lcb.student07@yopmail.com",
    stuName: "7th, Student07"
  }
};
describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Teacher Assignment LCB page`, () => {
  const lcbTestData = {
    className: "Test LCB 01",
    teacher: "auto.lcb.teacher01@yopmail.com",
    student: students[1].email,
    assignmentName: "New Assessment LCB",
    testId: "5cee418721be0e18675cd00c",
    feedbackScoreData: [
      {
        ...students[2],
        attempt: { Q1: "right", Q2: "right", Q3: "right", Q4: "right", Q5: "right", Q6: "right", Q7: "right" },
        status: studentSide.SUBMITTED
      }
    ],
    redirectedData: [
      {
        ...students[1],
        attempt: { Q1: "wrong", Q2: "wrong", Q3: "wrong", Q4: "wrong", Q5: "wrong", Q6: "wrong", Q7: "wrong" },
        status: studentSide.SUBMITTED
      }
    ],
    attemptsData: [
      {
        ...students[1],
        attempt: { Q1: "right", Q2: "right", Q3: "right", Q4: "right", Q5: "right", Q6: "right", Q7: "right" },
        status: studentSide.SUBMITTED
      },
      {
        ...students[2],
        attempt: { Q1: "right", Q2: "wrong", Q3: "right", Q4: "skip", Q5: "wrong", Q6: "skip", Q7: "right" },
        status: studentSide.SUBMITTED
      },
      {
        ...students[3],
        attempt: {
          Q1: "wrong",
          Q2: "partialCorrect",
          Q3: "right",
          Q4: "skip",
          Q5: "partialCorrect",
          Q6: "right",
          Q7: "skip"
        },
        status: studentSide.SUBMITTED
      },
      {
        ...students[4],
        attempt: { Q1: "wrong", Q2: "wrong", Q3: "wrong", Q4: "wrong", Q5: "wrong", Q6: "wrong", Q7: "wrong" },
        status: studentSide.SUBMITTED
      },
      {
        ...students[5],
        attempt: { Q1: "right", Q2: "skip", Q3: "wrong", Q4: "skip", Q5: "right", Q6: "right", Q7: "skip" },
        status: studentSide.IN_PROGRESS
      },
      {
        ...students[6],
        status: studentSide.NOT_STARTED,
        attempt: {
          Q1: "noattempt",
          Q2: "noattempt",
          Q3: "noattempt",
          Q4: "noattempt",
          Q5: "noattempt",
          Q6: "noattempt",
          Q7: "noattempt"
        }
      },
      {
        ...students[7],
        attempt: { Q1: "skip", Q2: "skip", Q3: "skip", Q4: "skip", Q5: "skip", Q6: "skip", Q7: "skip" },
        status: studentSide.SUBMITTED
      }
    ]
  };

  const { attemptsData, redirectedData, student, teacher, testId, feedbackScoreData, className } = lcbTestData;

  let questionData;
  let testData;
  const questionTypeMap = {};
  const statsMap = {};
  const queCentric = {};
  const submittedQueCentric = {};
  let reDirectedQueCentric;
  let reDirectedQueCentricBeforeAttempt;

  const allStudentList = attemptsData.map(item => item.stuName);

  const submittedInprogressStudentList = attemptsData
    .filter(({ status }) => status !== studentSide.NOT_STARTED)
    .map(item => item.stuName);

  const submittedStudentList = attemptsData
    .filter(({ status }) => status === studentSide.SUBMITTED)
    .map(item => item.stuName);

  const redirectedStudentList = redirectedData.map(item => item.stuName);

  const redirectStatsMap = {};
  const assignmentPage = new AssignmentsPage();
  const test = new StudentTestPage();
  const lcb = new LiveClassboardPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const expressg = new ExpressGraderPage();
  const sbrPage = new StandardBasedReportPage();
  const testLibrary = new TestLibrary();
  const teacherSidebar = new TeacherSideBar();
  const bargraph = new BarGraph();
  const queList = Object.keys(lcb.getQuestionCentricData(attemptsData, queCentric));
  const queBarData = bargraph.getQueBarData(queList, attemptsData);

  lcb.getQuestionCentricData(attemptsData, submittedQueCentric, true);

  before(" > create new assessment and assign", () => {
    cy.fixture("questionAuthoring").then(queData => {
      questionData = queData;
    });

    cy.fixture("testAuthoring").then(({ LCB_1 }) => {
      testData = LCB_1;
      const { itemKeys } = testData;
      lcb.getQuestionTypeMap(itemKeys, questionData, questionTypeMap);
    });

    cy.deleteAllAssignments(student, teacher);
    cy.login("teacher", teacher);
    testLibrary.createTest("LCB_1").then(() => {
      testLibrary.clickOnAssign();
      // cy.visit("/author/assignments/5defe0afb1e30a000876945b");
      // cy.wait(10000);
      testLibrary.assignPage.selectClass(className);
      testLibrary.assignPage.clickOnAssign();
    });
  });

  before(" > attempt by all students", () => {
    attemptsData.forEach(attempts => {
      const { attempt, email, stuName, status } = attempts;
      statsMap[stuName] = lcb.getScoreAndPerformance(attempt, questionTypeMap);
      statsMap[stuName].attempt = attempt;
      statsMap[stuName].status = status;
      test.attemptAssignment(email, status, attempt, questionTypeMap);
    });
  });

  before("login as teacher and to lcb of assignment", () => {
    cy.login("teacher", teacher);
    teacherSidebar.clickOnAssignment();
    authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
  });

  describe(" > verify LCB card view", () => {
    it(" > verify avg score", () => {
      lcb.verifyAvgScore(statsMap);
    });

    it(" > verify submitted count", () => {
      lcb.verifySubmittedCount(
        attemptsData.filter(eachStudent => eachStudent.status === studentSide.SUBMITTED).length,
        attemptsData.length
      );
    });

    allStudentList.forEach(studentName => {
      it(` > verify student cards for :: ${studentName}`, () => {
        const { status, score, perf, attempt } = statsMap[studentName];
        lcb.verifyStudentCard(studentName, status, score, perf, attempt);
      });
    });

    describe("verify bar graphs", () => {
      it("verify question bars", () => {
        bargraph.verifyXAxisTicks(queList);
      });

      it("verify left axis scale value", () => {
        bargraph.veryLeftYAxisScale(submittedInprogressStudentList.length);
      });

      queList.forEach((que, index) => {
        it(`verify bar tool tip for question ${que}`, () => {
          console.log("queBarData", queBarData);
          bargraph.verifyQueToolTip(que, index, queBarData[que]);
        });
      });
    });
  });

  describe(" > verify student centric view", () => {
    before("student tab click", () => {
      lcb.clickOnStudentsTab();
    });
    submittedInprogressStudentList.forEach(studentName => {
      it(` > verify student centric view for :: ${studentName}`, () => {
        const { attempt } = statsMap[studentName];
        lcb.verifyStudentCentricCard(studentName, attempt, questionTypeMap);
      });

      it(` > verify questions on bar x axis for student :: ${studentName}`, () => {
        bargraph.verifyXAxisTicks(queList);
      });
    });
  });

  describe(" > verify question centric view", () => {
    before("student tab click", () => {
      lcb.clickonQuestionsTab();
    });
    queList.forEach(queNumber => {
      it(` > verify question centric view for :: ${queNumber}`, () => {
        const attempt = queCentric[queNumber];
        lcb.verifyQuestionCentricCard(queNumber, attempt, questionTypeMap);
      });

      it(` > verify students on bar x axis for que :: ${queNumber}`, () => {
        bargraph.verifyXAxisTicks(submittedInprogressStudentList.map(studentName => Helpers.getShortName(studentName)));
      });
    });
  });

  describe(" > verify standard based report", () => {
    before(() => {
      lcb.clickOnCardViewTab();
      lcb.header.clickOnStandardBasedReportTab();
    });

    it(" > verify standard performance", () => {
      sbrPage.verifyStandardPerformance(attemptsData, questionTypeMap);
    });
  });

  describe(" > verify express grader", () => {
    before(() => {
      lcb.header.clickOnExpressGraderTab();
    });
    context(" > verify scores", () => {
      submittedStudentList.forEach(studentName => {
        // ["Student01"].forEach(studentName => {
        it(` > verify for student :: ${studentName}`, () => {
          const { attempt, score, perfValue } = statsMap[studentName];
          expressg.verifyScoreGrid(studentName, attempt, score, perfValue, questionTypeMap);
        });
      });
    });

    context(" > verify question level data", () => {
      queList.forEach(queNum => {
        // ["Q1"].forEach(queNum => {
        it(` > verify for :: ${queNum}`, () => {
          const attempt = submittedQueCentric[queNum];
          expressg.verifyQuestionLevelGrid(queNum, attempt, questionTypeMap);
        });
      });
    });

    context(" > verify student responses pop ups", () => {
      beforeEach(() => {
        expressg.clickOnExit();
      });

      after(() => {
        expressg.clickOnExit();
      });

      // submittedStudentList.forEach(studentName => {
      // navigating through all the students eats up excess time,hence currently doing for 1 student
      [students[1].stuName].forEach(studentName => {
        it(` > navigate all quetions using button for student :: ${studentName}`, () => {
          const { attempt } = statsMap[studentName];
          expressg.verifyResponsesInGridStudentLevel(studentName, attempt, questionTypeMap, false);
        });

        it(` > navigate all que using keyboard key for student :: ${studentName}`, () => {
          const { attempt } = statsMap[studentName];
          expressg.verifyResponsesInGridStudentLevel(studentName, attempt, questionTypeMap, true);
        });
      });

      // queList.forEach(queNum => {
      // navigating through all the questions eats up excess time,hence currently doing for 1 question
      ["Q1"].forEach(queNum => {
        it(` > navigate all students using button for que :: ${queNum} `, () => {
          const attempt = submittedQueCentric[queNum];
          expressg.verifyResponsesInGridQuestionLevel(queNum, attempt, questionTypeMap, false);
        });

        it(` > navigate all students using keyboard key for que :: ${queNum} `, () => {
          const attempt = submittedQueCentric[queNum];
          expressg.verifyResponsesInGridQuestionLevel(queNum, attempt, questionTypeMap, true);
        });
      });
    });

    context(" > verify updating responses", () => {
      const { stuName: updatingResponseStudent } = students[7];

      queList.forEach(queNum => {
        it(` > update response of ${updatingResponseStudent} for :: ${queNum}`, () => {
          expressg.routeAPIs();
          expressg.clickOnExit();
          expressg.getGridRowByStudent(updatingResponseStudent);
          expressg.getScoreforQueNum(queNum).click();
          expressg.getEditResponseToggle().click();
          expressg.waitForStudentData();
          expressg.updateResponse(
            questionTypeMap[queNum].queKey.split(".")[0],
            attemptTypes.RIGHT,
            questionTypeMap[queNum].attemptData
          );
          expressg.clickOnExit();
        });
      });

      context(` > verify at student centric view for ${updatingResponseStudent}`, () => {
        before(() => {
          lcb.header.clickOnLCBTab();
          lcb.clickOnStudentsTab();
          lcb.questionResponsePage.selectStudent(updatingResponseStudent);
        });

        queList.forEach((queNum, qIndex) => {
          it(` > verify for ${queNum}`, () => {
            const { queKey, attemptData, points } = questionTypeMap[queNum];
            lcb.questionResponsePage.verifyQuestionResponseCard(
              points,
              queKey,
              attemptTypes.RIGHT,
              attemptData,
              true,
              qIndex
            );
          });
        });
      });
    });

    context(" > verify updating score", () => {
      before(() => {
        lcb.header.clickOnExpressGraderTab();
      });

      queList.forEach(queNum => {
        it(` > update the score for :: ${queNum}`, () => {
          // below will update the score for 1 student all question and then revert back to original score
          expressg.verifyUpdateScore(submittedStudentList[0], queNum, "0.5");
        });
      });
    });
  });

  describe(" > verify redirect", () => {
    before("calculate redirected stats", () => {
      redirectedData.forEach(attempts => {
        const { attempt, stuName, status } = attempts;
        redirectStatsMap[stuName] = lcb.getScoreAndPerformance(attempt, questionTypeMap);
        redirectStatsMap[stuName].attempt = attempt;
        redirectStatsMap[stuName].status = status;
      });
      lcb.header.clickOnLCBTab();
      lcb.clickOnCardViewTab();
    });

    context(" > redirect the students and verify", () => {
      it(" > redirect the students", () => {
        redirectedStudentList.forEach(studentName => {
          // redirect and verify
          lcb.selectCheckBoxByStudentName(studentName);
        });

        lcb.clickOnRedirect();

        redirectedStudentList.forEach(stu => {
          lcb.verifyStudentsOnRedirectPopUp(stu);
        });

        lcb.clickOnRedirectSubmit();
      });

      redirectedStudentList.forEach(studentName => {
        it(` > verify redirected student cards for :: ${studentName}`, () => {
          const { attempt } = redirectStatsMap[studentName];
          const noAttempt = lcb.getNullifiedAttempts(attempt);
          const { score, perf } = lcb.getScoreAndPerformance(noAttempt, questionTypeMap);
          lcb.verifyStudentCard(studentName, teacherSide.REDIRECTED, score, perf, noAttempt);
          lcb.verifyRedirectIcon(studentName);
        });
      });

      describe(" > verify student centric view - should be disabled", () => {
        before("student tab click", () => {
          lcb.clickOnStudentsTab();
        });
        redirectedStudentList.forEach(studentName => {
          it(` > verify student centric view for :: ${studentName}`, () => {
            lcb.verifyStudentCentricCard(studentName, undefined, undefined, false);
          });
        });
      });

      describe(" > verify question centric view - should not have student card", () => {
        before("student tab click", () => {
          lcb.clickonQuestionsTab();
          reDirectedQueCentricBeforeAttempt = lcb.getRedirectedQuestionCentricData(redirectedData, queCentric, false);
        });
        queList.forEach(queNumber => {
          it(` > verify question centric view for :: ${queNumber}`, () => {
            const attempt = reDirectedQueCentricBeforeAttempt[queNumber];
            lcb.verifyQuestionCentricCard(queNumber, attempt, questionTypeMap);
          });
        });
      });
    });

    context(" > attempt by redirected students and verify", () => {
      before(" > attempt by redirected students", () => {
        redirectedData.forEach(attempts => {
          const { attempt, email, status } = attempts;
          test.attemptAssignment(email, status, attempt, questionTypeMap);
        });
      });

      context(" > verify after attempt", () => {
        before("teacher login", () => {
          cy.login("teacher", teacher);
          teacherSidebar.clickOnAssignment();
          authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
        });

        describe(" > verify redirected student card", () => {
          redirectedStudentList.forEach(studentName => {
            it(` > verify student card for ${studentName}`, () => {
              const { status, score, perf, attempt } = redirectStatsMap[studentName];
              lcb.verifyStudentCard(studentName, status, score, perf, attempt);
            });
          });
        });

        describe(" > verify redirected student centric view", () => {
          before("student tab click", () => {
            lcb.clickOnStudentsTab();
          });
          redirectedStudentList.forEach(studentName => {
            it(` > verify student centric view for :: ${studentName}`, () => {
              const { attempt } = redirectStatsMap[studentName];
              lcb.verifyStudentCentricCard(studentName, attempt, questionTypeMap);
            });
          });
        });

        describe(" > verify question centric view", () => {
          before("student tab click", () => {
            lcb.clickonQuestionsTab();
            reDirectedQueCentric = lcb.getRedirectedQuestionCentricData(redirectedData, queCentric, true);
          });

          queList.forEach(queNumber => {
            it(` > verify question centric view for :: ${queNumber}`, () => {
              const attempt = reDirectedQueCentric[queNumber];
              lcb.verifyQuestionCentricCard(queNumber, attempt, questionTypeMap);
            });
          });
        });
      });
    });
  });

  describe(" > verify score update", () => {
    before("question centric view", () => {
      lcb.clickonQuestionsTab();
    });

    feedbackScoreData.forEach(feedback => {
      const { stuName, attempt } = feedback;
      it(` > update the score for :: ${stuName}`, () => {
        lcb.updateScore(stuName, lcb.getFeedBackScore(attempt, questionTypeMap));
      });
    });

    describe(" > verify student cards", () => {
      before(() => {
        lcb.clickOnCardViewTab();
      });
      feedbackScoreData.forEach(feedback => {
        const { stuName, status, attempt } = feedback;
        it(` > verify student card for :${stuName}`, () => {
          const { score, perf } = lcb.getScoreAndPerformance(attempt, questionTypeMap);
          lcb.verifyStudentCard(stuName, status, score, perf, attempt);
        });
      });
    });
  });
});
