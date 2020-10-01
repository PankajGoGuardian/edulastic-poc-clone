import AuthorAssignmentPage from '../../../../framework/author/assignments/AuthorAssignmentPage'
import BarGraph from '../../../../framework/author/assignments/barGraphs'
import LiveClassboardPage from '../../../../framework/author/assignments/LiveClassboardPage'
import StandardBasedReportPage from '../../../../framework/author/assignments/standardBasedReportPage'
import TeacherSideBar from '../../../../framework/author/SideBarPage'
import TestLibrary from '../../../../framework/author/tests/testLibraryPage'
import {
  studentSide,
  teacherSide,
} from '../../../../framework/constants/assignmentStatus'
import SidebarPage from '../../../../framework/student/sidebarPage'
import StudentTestPage from '../../../../framework/student/studentTestPage'
import FileHelper from '../../../../framework/util/fileHelper'
import Helpers from '../../../../framework/util/Helpers'

const students = {
  1: {
    email: 'lcb.student01@automation.com',
    stuName: '1st, Student01',
  },
  2: {
    email: 'lcb.student02@automation.com',
    stuName: '2nd, Student02',
  },
  3: {
    email: 'lcb.student03@automation.com',
    stuName: '3rd, Student03',
  },
  4: {
    email: 'lcb.student04@automation.com',
    stuName: '4th, Student04',
  },
  5: {
    email: 'lcb.student05@automation.com',
    stuName: '5th, Student05',
  },
  6: {
    email: 'lcb.student06@automation.com',
    stuName: '6th, Student06',
  },
  7: {
    email: 'lcb.student07@automation.com',
    stuName: '7th, Student07',
  },
}

const dueDate = new Date()
dueDate.setDate(dueDate.getDate() + 7)

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)} >> Teacher Assignment LCB page`, () => {
  const lcbTestData = {
    className: 'LCB Class',
    teacher: 'lcb.teacher01@automation.com',
    student: students[1].email,
    assignmentName: 'New Assessment LCB',
    testId: '5ef5fdc13c365700079ee918',
    status: teacherSide.IN_PROGRESS,
    dueDate,
    feedbackScoreData: [
      {
        ...students[2],
        attempt: {
          Q1: 'right',
          Q2: 'right',
          Q3: 'right',
          Q4: 'right',
          Q5: 'right',
          Q6: 'right',
          Q7: 'right',
          Q8: 'right',
          Q9: 'right',
          Q10: 'right',
        },
        status: studentSide.SUBMITTED,
      },
    ],
    /*   redirectedData: [
      {
        ...students[1],
        attempt: {
          Q1: "wrong",
          Q2: "wrong",
          Q3: "wrong",
          Q4: "wrong",
          Q5: "wrong",
          Q6: "wrong",
          Q7: "wrong",
          Q8: "wrong"
        },
        status: studentSide.SUBMITTED
      }
    ], */
    attemptsData: [
      {
        ...students[1],
        attempt: {
          Q1: 'right',
          Q2: 'right',
          Q3: 'right',
          Q4: 'right',
          Q5: 'right',
          Q6: 'right',
          Q7: 'right',
          Q8: 'right',
          Q9: 'right',
          Q10: 'right',
        },
        status: studentSide.SUBMITTED,
      },
      {
        ...students[2],
        attempt: {
          Q1: 'right',
          Q2: 'wrong',
          Q3: 'right',
          Q4: 'skip',
          Q5: 'wrong',
          Q6: 'skip',
          Q7: 'right',
          Q8: 'right',
          Q9: 'skip',
          Q10: 'skip',
        },
        status: studentSide.SUBMITTED,
      },
      {
        ...students[3],
        attempt: {
          Q1: 'wrong',
          Q2: 'partialCorrect',
          Q3: 'right',
          Q4: 'skip',
          Q5: 'partialCorrect',
          Q6: 'right',
          Q7: 'skip',
          Q8: 'right',
          Q9: 'partialCorrect',
          Q10: 'right',
        },
        status: studentSide.SUBMITTED,
      },
      {
        ...students[4],
        attempt: {
          Q1: 'wrong',
          Q2: 'wrong',
          Q3: 'wrong',
          Q4: 'wrong',
          Q5: 'wrong',
          Q6: 'wrong',
          Q7: 'wrong',
          Q8: 'wrong',
          Q9: 'wrong',
          Q10: 'wrong',
        },
        status: studentSide.SUBMITTED,
      },
      {
        ...students[5],
        attempt: {
          Q1: 'right',
          Q2: 'skip',
          Q3: 'wrong',
          Q4: 'skip',
          Q5: 'right',
          Q6: 'right',
          Q7: 'skip',
          Q8: 'skip',
          Q9: 'skip',
          Q10: 'skip',
        },
        status: studentSide.IN_PROGRESS,
      },
      {
        ...students[6],
        status: studentSide.NOT_STARTED,
        attempt: {
          Q1: 'noattempt',
          Q2: 'noattempt',
          Q3: 'noattempt',
          Q4: 'noattempt',
          Q5: 'noattempt',
          Q6: 'noattempt',
          Q7: 'noattempt',
          Q8: 'noattempt',
          Q9: 'noattempt',
          Q10: 'noattempt',
        },
      },
      {
        ...students[7],
        attempt: {
          Q1: 'skip',
          Q2: 'skip',
          Q3: 'skip',
          Q4: 'skip',
          Q5: 'skip',
          Q6: 'skip',
          Q7: 'skip',
          Q8: 'skip',
          Q9: 'skip',
          Q10: 'skip',
        },
        status: studentSide.SUBMITTED,
      },
    ],
  }

  const {
    attemptsData,
    student,
    teacher,
    testId,
    feedbackScoreData,
    className,
    status,
  } = lcbTestData

  let questionData
  let testData
  const questionTypeMap = {}
  const statsMap = {}
  const queCentric = {}
  const submittedQueCentric = {}
  // let reDirectedQueCentric;
  // let reDirectedQueCentricBeforeAttempt;

  const allStudentList = attemptsData.map((item) => item.stuName)

  const submittedInprogressStudentList = attemptsData
    .filter(({ status }) => status !== studentSide.NOT_STARTED)
    .map((item) => item.stuName)

  const submittedStudentList = attemptsData
    .filter(({ status }) => status === studentSide.SUBMITTED)
    .map((item) => item.stuName)

  // const redirectedStudentList = redirectedData.map(item => ({ studentName: item.stuName, email: item.email }));

  // const redirectStatsMap = {};
  // const assignmentPage = new AssignmentsPage();
  const test = new StudentTestPage()
  const lcb = new LiveClassboardPage()
  const authorAssignmentPage = new AuthorAssignmentPage()
  const sbrPage = new StandardBasedReportPage()
  const testLibrary = new TestLibrary()
  const teacherSidebar = new TeacherSideBar()
  const studentSidebar = new SidebarPage()
  const bargraph = new BarGraph()
  const queList = Object.keys(
    lcb.getQuestionCentricData(attemptsData, queCentric)
  )
  // const queBarData = bargraph.getQueBarData(queList, attemptsData);
  // const getQuestionCentricQueBarData = bargraph.getQueBarDataQuestionView(attemptsData, queList);

  lcb.getQuestionCentricData(attemptsData, submittedQueCentric, true)

  before(' > create new assessment and assign', () => {
    cy.fixture('questionAuthoring').then((queData) => {
      questionData = queData
    })

    cy.fixture('testAuthoring').then(({ LCB_1 }) => {
      testData = LCB_1
      const { itemKeys } = testData
      lcb.getQuestionTypeMap(itemKeys, questionData, questionTypeMap)
    })

    cy.deleteAllAssignments(student, teacher)
    cy.login('teacher', teacher)
    // TODO: to be enable test creation later
    // testLibrary.createTest("LCB_1").then(() => {
    // testLibrary.clickOnAssign();
    cy.visit(`/author/assignments/${testId}`)
    cy.wait(10000)
    testLibrary.assignPage.selectClass(className)
    testLibrary.assignPage.clickOnAssign()
    // });
  })

  before(' > attempt by all students', () => {
    attemptsData.forEach((attempts) => {
      cy.wait(1).then(() => {
        const { attempt, email, stuName, status } = attempts
        statsMap[stuName] = lcb.getScoreAndPerformance(attempt, questionTypeMap)
        statsMap[stuName].attempt = attempt
        statsMap[stuName].status = status
        statsMap[stuName].email = email
        test.attemptAssignment(email, status, attempt, questionTypeMap)
        studentSidebar.clickOnAssignment()
      })
    })
  })

  before('login as teacher and to lcb of assignment', () => {
    cy.login('teacher', teacher)
    teacherSidebar.clickOnAssignment()
    authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
  })

  describe(' > verify LCB card view', () => {
    it('> verify status and due date', () => {
      lcb.header.verifyAssignmentStatus(status)
      lcb.header.verifyAssignmentDueDate(dueDate)
    })

    it(' > verify avg score', () => {
      lcb.verifyAvgScore(statsMap)
    })

    it(' > verify submitted count', () => {
      lcb.verifySubmittedCount(
        attemptsData.filter(
          (eachStudent) => eachStudent.status === studentSide.SUBMITTED
        ).length,
        attemptsData.length
      )
    })

    allStudentList.forEach((studentName) => {
      it(` > verify student cards for :: ${studentName}`, () => {
        const { status, score, perf, attempt, email } = statsMap[studentName]
        lcb.verifyStudentCard(studentName, status, score, perf, attempt, email)
      })
    })

    describe('verify bar graphs', () => {
      it('verify question bars', () => {
        bargraph.verifyXAxisTicks(queList)
      })

      it('verify left axis scale value', () => {
        bargraph.veryLeftYAxisScale(submittedInprogressStudentList.length)
      })

      /*    queList.forEach((que, index) => {
        it(`verify bar tool tip for question ${que}`, () => {
          console.log("queBarData", queBarData);
          bargraph.verifyQueToolTip(index, queBarData[que]);
        });
      }); */

      /*  it("verify bar graph colors and tool tip", () => {
        bargraph.verifyQueBarAndToolTipBasedOnAttemptData(attemptsData, queList);
      }); */
    })
  })

  describe(' > verify student centric view', () => {
    before('student tab click', () => {
      lcb.clickOnStudentsTab()
    })
    submittedInprogressStudentList.forEach((studentName) => {
      it(` > verify student centric view for :: ${studentName}`, () => {
        const { attempt } = statsMap[studentName]
        lcb.verifyStudentCentricCard(studentName, attempt, questionTypeMap)
      })

      it(` > verify questions on bar x axis for student :: ${studentName}`, () => {
        bargraph.verifyXAxisTicks(queList)
      })

      /*  it(`> verify bar graph colors and tool tip for :: ${studentName}`, () => {
        bargraph.verifyQueBarAndToolTipBasedOnAttemptData(statsMap[studentName], queList);
      }); */
    })
  })

  describe(' > verify question centric view', () => {
    before('student tab click', () => {
      lcb.clickonQuestionsTab()
    })
    queList.forEach((queNumber) => {
      it(` > verify question response view for :: ${queNumber}`, () => {
        const attempt = queCentric[queNumber]
        lcb.verifyQuestionCentricCard(queNumber, attempt, questionTypeMap)
      })

      it(` > verify bar graph - x axis for que :: ${queNumber}`, () => {
        bargraph.verifyXAxisTicks(
          submittedInprogressStudentList.map((studentName) =>
            Helpers.getShortName(studentName)
          )
        )
      })
      //
      /*  it(`>  verify bar graph - colors and tool tip for que :: ${queNumber}`, () => {
        bargraph.verifyQueBarBasedOnQueAttemptData(queCentric[queNumber]);
      }); */
    })
  })

  describe(' > verify standard based report', () => {
    before(() => {
      lcb.clickOnCardViewTab()
      lcb.header.clickOnStandardBasedReportTab()
    })

    it(' > verify standard performance', () => {
      sbrPage.verifyStandardPerformance(attemptsData, questionTypeMap)
    })
  })

  // diabling redirect in lcb as redirect is being covered under redirectPolicy.spec.js
  /*   
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
        redirectedStudentList.forEach(({ studentName }) => {
          // redirect and verify
          lcb.selectCheckBoxByStudentName(studentName);
        });

        lcb.clickOnRedirect();

        redirectedStudentList.forEach(({ email }) => {
          lcb.verifyStudentsOnRedirectPopUp(email);
        });

        lcb.clickOnRedirectSubmit();
      });

      redirectedStudentList.forEach(({ studentName }) => {
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
        redirectedStudentList.forEach(({ studentName }) => {
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
          redirectedStudentList.forEach(({ studentName }) => {
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
          redirectedStudentList.forEach(({ studentName }) => {
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
  */

  describe(' > verify score update from question centric', () => {
    before('> navigate to lcb', () => {
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
    })

    before('question centric view', () => {
      lcb.header.clickOnLCBTab()
      lcb.clickOnReset()
      lcb.clickonQuestionsTab()
    })

    feedbackScoreData.forEach((feedback) => {
      const { stuName, attempt } = feedback
      it(` > update the score for :: ${stuName}`, () => {
        lcb.updateScore(stuName, lcb.getFeedBackScore(attempt, questionTypeMap))
      })
    })

    describe(' > verify student cards', () => {
      before(() => {
        lcb.clickOnCardViewTab()
      })
      feedbackScoreData.forEach((feedback) => {
        const { stuName, status, attempt, email } = feedback
        it(` > verify student card for :${stuName}`, () => {
          const { score, perf } = lcb.getScoreAndPerformance(
            attempt,
            questionTypeMap
          )
          lcb.verifyStudentCard(stuName, status, score, perf, attempt, email)
        })
      })
    })
  })
})
