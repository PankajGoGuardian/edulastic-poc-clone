import FileHelper from "../../../framework/util/fileHelper";
import AssignmentsPage from "../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../framework/student/studentTestPage";
import LiveClassboardPage from "../../../framework/author/assignments/LiveClassboardPage";
import AuthorAssignmentPage from "../../../framework/author/assignments/AuthorAssignmentPage";
import { studentSide, teacherSide } from "../../../framework/constants/assignmentStatus";
import ExpressGraderPage from "../../../framework/author/assignments/expressGraderPage";
import StandardBasedReportPage from "../../../framework/author/assignments/standardBasedReportPage";
import TestLibrary from "../../../framework/author/tests/testLibraryPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Teacher Assignment LCB page`, () => {
  const lcbTestData = {
    className: "Test LCB 01",
    teacher: "auto.lcb.teacher01@yopmail.com",
    student: "auto.lcb.student01@yopmail.com",
    assignmentName: "New Assessment LCB",
    testId: "5cee418721be0e18675cd00c",
    feedbackScoreData: [
      {
        email: "auto.lcb.student02@yopmail.com",
        stuName: "Student02",
        attempt: { Q1: "right", Q2: "right" },
        status: "SUBMITTED"
      }
    ],
    redirectedData: [
      {
        email: "auto.lcb.student01@yopmail.com",
        stuName: "Student01",
        attempt: { Q1: "wrong", Q2: "wrong" },
        status: "SUBMITTED"
      }
    ],
    attemptsData: [
      {
        email: "auto.lcb.student01@yopmail.com",
        stuName: "Student01",
        attempt: { Q1: "right", Q2: "right" },
        status: "SUBMITTED"
      },
      {
        email: "auto.lcb.student02@yopmail.com",
        stuName: "Student02",
        attempt: { Q1: "right", Q2: "wrong" },
        status: "SUBMITTED"
      },
      {
        email: "auto.lcb.student03@yopmail.com",
        stuName: "Student03",
        attempt: { Q1: "wrong", Q2: "right" },
        status: "SUBMITTED"
      },
      {
        email: "auto.lcb.student04@yopmail.com",
        stuName: "Student04",
        attempt: { Q1: "wrong", Q2: "skip" },
        status: "SUBMITTED"
      },
      {
        email: "auto.lcb.student05@yopmail.com",
        stuName: "Student05",
        attempt: { Q1: "right", Q2: "skip" },
        status: "IN PROGRESS"
      },
      {
        email: "auto.lcb.student06@yopmail.com",
        stuName: "Student06",
        status: "NOT STARTED",
        attempt: { Q1: "skip", Q2: "skip" }
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
  const queList = Object.keys(lcb.getQuestionCentricData(attemptsData, queCentric));

  lcb.getQuestionCentricData(attemptsData, submittedQueCentric, true);

  before(" > create new assessment and assign", () => {
    cy.fixture("questionAuthoring").then(queData => {
      questionData = queData;
    });

    cy.fixture("testAuthoring").then(({ LCB_1 }) => {
      testData = LCB_1;
      const { itemKeys } = testData;
      itemKeys.forEach((queKey, index) => {
        const [queType, questionKey] = queKey.split(".");
        const { attemptData, standards } = questionData[queType][questionKey];
        const { points } = questionData[queType][questionKey].setAns;
        const queMap = { queKey, points, attemptData, standards };
        questionTypeMap[`Q${index + 1}`] = queMap;
      });
    });

    cy.deleteAllAssignments(student, teacher);
    cy.login("teacher", teacher);
    testLibrary.createTest("LCB_1").then(() => {
      testLibrary.header.clickOnAssign();
      testLibrary.assignPage.selectClass(className);
      testLibrary.assignPage.clickOnAssign();
    });
    // cy.assignAssignment(testId, undefined, undefined, "LCB1");
  });

  before(" > attempt by all students", () => {
    attemptsData.forEach(attempts => {
      const { attempt, email, stuName, status } = attempts;
      statsMap[stuName] = lcb.getScoreAndPerformance(attempt, questionTypeMap);
      statsMap[stuName].attempt = attempt;
      statsMap[stuName].status = status;

      if (status !== "NOT STARTED") {
        cy.login("student", email);
        assignmentPage.clickOnAssignmentButton();
        Object.keys(attempt).forEach(queNum => {
          const [queType, questionKey] = questionTypeMap[queNum].queKey.split(".");
          const { attemptData } = questionData[queType][questionKey];
          test.attemptQuestion(queType, attempt[queNum], attemptData);
          test.clickOnNext();
        });

        if (status !== "IN PROGRESS") {
          test.submitTest();
          cy.contains("Reports").should("be.visible");
        }
      }
    });
  });

  before("login as teacher and to lcb of assignment", () => {
    cy.login("teacher", teacher);
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
          const { attempt, score, perf } = statsMap[studentName];
          expressg.verifyScoreGrid(studentName, attempt, score, perf, questionTypeMap);
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
      submittedStudentList.forEach(studentName => {
        //  ["Student01"].forEach(studentName => {
        it(` > using button for student :: ${studentName}`, () => {
          const { attempt } = statsMap[studentName];
          expressg.verifyResponsesInGridStudentLevel(studentName, attempt, questionTypeMap, false);
        });

        it(` > using keyboard key for student :: ${studentName}`, () => {
          const { attempt } = statsMap[studentName];
          expressg.verifyResponsesInGridStudentLevel(studentName, attempt, questionTypeMap, true);
        });
      });

      queList.forEach(queNum => {
        // ["Q1"].forEach(queNum => {
        it(` > using button for que :: ${queNum} `, () => {
          const attempt = submittedQueCentric[queNum];
          expressg.verifyResponsesInGridQuestionLevel(queNum, attempt, questionTypeMap, false);
        });

        it(` > using keyboard key for que :: ${queNum} `, () => {
          const attempt = submittedQueCentric[queNum];
          expressg.verifyResponsesInGridQuestionLevel(queNum, attempt, questionTypeMap, true);
        });
      });
    });

    context(" > verify updating score", () => {
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
          if (status !== "NOT STARTED") {
            cy.login("student", email);
            assignmentPage.clickOnAssignmentButton();
            Object.keys(attempt).forEach(queNum => {
              const [queType, questionKey] = questionTypeMap[queNum].queKey.split(".");
              const { attemptData } = questionData[queType][questionKey];
              // console.log("attemptData ::", attemptData);
              // console.log("attemptData queType ::", queType);
              // console.log("attemptData attempt[queNum]::", attempt[queNum]);
              test.attemptQuestion(queType, attempt[queNum], attemptData);
              test.clickOnNext();
            });

            if (status !== "IN PROGRESS") {
              test.submitTest();
              cy.contains("Reports").should("be.visible");
            }
          }
        });
      });

      context(" > verify after attempt", () => {
        before("teacher login", () => {
          cy.login("teacher", teacher);
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
