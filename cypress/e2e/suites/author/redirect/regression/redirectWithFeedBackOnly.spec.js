import FileHelper from '../../../../framework/util/fileHelper'
import StudentTestPage from '../../../../framework/student/studentTestPage'
import LiveClassboardPage from '../../../../framework/author/assignments/LiveClassboardPage'
import AuthorAssignmentPage from '../../../../framework/author/assignments/AuthorAssignmentPage'
import {
  studentSide,
  redirectType,
  questionDeliveryType,
  teacherSide,
} from '../../../../framework/constants/assignmentStatus'
import TestLibrary from '../../../../framework/author/tests/testLibraryPage'
import TeacherSideBar from '../../../../framework/author/SideBarPage'

const { _ } = Cypress
const { LCB_3 } = require('../../../../../fixtures/testAuthoring')
const questionData = require('../../../../../fixtures/questionAuthoring')

const test = new StudentTestPage()
const lcb = new LiveClassboardPage()
const authorAssignmentPage = new AuthorAssignmentPage()
const testLibrary = new TestLibrary()
const teacherSidebar = new TeacherSideBar()
const studentTestPage = new StudentTestPage()
const students = {
  1: {
    email: 'student.feedbackpnly@snapwiz.com',
    stuName: 'student',
  },
}

const allWrong = { Q1: 'wrong', Q2: 'wrong', Q3: 'wrong' }
const allRight = { Q1: 'right', Q2: 'right', Q3: 'right' }

const noattempt = lcb.getNullifiedAttempts(allWrong)

const teacherFeedback = 'You need to work hard'
const queList = _.keys(allRight)

const redirectTestData = {
  className: 'Class',
  teacher: 'teacher.feedbackonly@snapwiz.com',
  student: students[1].email,
  password: 'snapwiz',
  assignmentName: 'New Assessment LCB',
  attemptsData: [
    {
      attempt: { ...allRight },
      status: studentSide.GRADED,
      ...students[1],
    },
  ],
  redirect1: {
    attempt: { ...allWrong },
    status: studentSide.GRADED,
    ...students[1],
  },
}

const submittedStudents = redirectTestData.attemptsData
  .filter(({ status }) => status === studentSide.GRADED)
  .map((item) => ({ stuName: item.stuName, email: item.email }))

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Redirect`, () => {
  const {
    attemptsData,
    student,
    teacher,
    className,
    password,
  } = redirectTestData
  const { itemKeys } = LCB_3
  const statsMap = {}
  const questionTypeMap = lcb.getQuestionTypeMap(itemKeys, questionData, {})
  attemptsData.forEach((attempts) => {
    const { attempt, email, stuName, status } = attempts
    statsMap[stuName] = lcb.getScoreAndPerformance(attempt, questionTypeMap)
    statsMap[stuName].attempt = attempt
    statsMap[stuName].status = status
    statsMap[stuName].email = email
  })
  const testId = '5f620aa0e79efd00080a26b0'

  before(' > create new assessment and assign', () => {
    cy.deleteAllAssignments(student, teacher, password)
    cy.login('teacher', teacher, password)
    // testLibrary.createTest("LCB_3").then(id => {
    //  testId = id;
    testLibrary.assignPage.visitAssignPageById(testId)
    testLibrary.assignPage.selectClass(className)
    testLibrary.assignPage.clickOnAssign()
    // });
  })

  before(' > attempt by all students', () => {
    attemptsData.forEach((attempts) => {
      const { attempt, email, status } = attempts
      test.attemptAssignment(email, status, attempt, questionTypeMap, password)
    })
  })

  before(' > login as teacher and add feedback for all student', () => {
    cy.login('teacher', teacher, password)
    teacherSidebar.clickOnAssignment()
    authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
    cy.contains(className)
    lcb.clickonQuestionsTab()
    queList.forEach((queNum) => {
      lcb.questionResponsePage.selectQuestion(queNum)
      submittedStudents.forEach(({ stuName: stu }) =>
        lcb.questionResponsePage.updateScoreAndFeedbackForStudent(
          stu,
          undefined,
          teacherFeedback
        )
      )
    })
  })

  describe(`> redirect with default setting - ${redirectType.FEEDBACK_ONLY}-${questionDeliveryType.All}`, () => {
    const { stuName, email } = redirectTestData.redirect1

    const attempt1 = {
      attempt: allRight,
      ...lcb.getScoreAndPerformance(allRight, questionTypeMap),
    }
    const attempt2 = {
      attempt: allWrong,
      ...lcb.getScoreAndPerformance(allWrong, questionTypeMap),
    }
    const attempt3 = {
      attempt: allRight,
      ...lcb.getScoreAndPerformance(allRight, questionTypeMap),
    }

    before('login as teacher', () => {
      cy.login('teacher', teacher, password)
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
    })

    describe(`> redirect attempt1 for - ${stuName}`, () => {
      it(' > redirect the student and verify card view', () => {
        lcb.selectCheckBoxByStudentName(stuName)
        lcb.clickOnRedirect()
        lcb.verifyStudentsOnRedirectPopUp(email)
        lcb.clickOnRedirectSubmit()
        lcb.verifyStudentCard(
          stuName,
          teacherSide.REDIRECTED,
          attempt1.score,
          attempt1.perf,
          attempt1.attempt,
          email
        )
        lcb.verifyRedirectIcon(stuName)
      })
      ;[0, 1].forEach((i) => {
        it(`> hover and verify card attempt-${i ? 'not started' : 1}`, () => {
          const attempt = !i
            ? {
                perf: studentSide.NOT_STARTED,
                score: `- / ${statsMap[stuName].maxScore}`,
              }
            : attempt1
          lcb.clickOnCardViewTab()
          lcb.showMulipleAttemptsByStuName(stuName)
          lcb.verifyStudentScoreOnAttemptContainer(stuName, i, attempt.score)
          lcb.verifyStudentPerfOnAttemptContainer(stuName, i, attempt.perf)
          lcb.verifyAttemptNumberOnAttemptContainer(stuName, !i ? 2 : 1, i)
        })
      })

      it(` > verify student centric view,,should be shown with attempt1`, () => {
        lcb.clickOnStudentsTab()
        lcb.verifyStudentCentricCard(
          stuName,
          attempt1.attempt,
          questionTypeMap,
          true
        )
        // verify scores of current attemp and no improvement
        lcb.questionResponsePage.verifyTotalScoreAndImprovement(
          attempt1.totalScore,
          attempt1.maxScore,
          false
        )
      })

      it(` > verify question centric view,should be shown with attempt reset`, () => {
        lcb.clickonQuestionsTab()
        _.keys(attempt1.attempt).forEach((queNum) => {
          lcb.questionResponsePage.selectQuestion(queNum)
          const { queKey, attemptData, points } = questionTypeMap[queNum]
          lcb.questionResponsePage.verifyQuestionResponseCard(
            points,
            queKey,
            noattempt[queNum],
            attemptData,
            false,
            stuName
          )
        })
      })
    })

    describe(`> verify redirected attempt2 - ${stuName}`, () => {
      it(' > attempt by redirected students and verify feedback is shown', () => {
        cy.login('student', email, password)
        studentTestPage.assignmentPage.clickOnAssignmentButton()
        Object.keys(attempt2.attempt).forEach((queNum) => {
          const [queType] = questionTypeMap[queNum].queKey.split('.')
          const { attemptData } = questionTypeMap[queNum]
          studentTestPage.verifyFeedback(teacherFeedback)
          studentTestPage.attemptQuestion(
            queType,
            attempt2.attempt[queNum],
            attemptData
          )
          studentTestPage.clickOnNext()
        })
        studentTestPage.submitTest()
      })

      it(` > verify student card view after attempt2`, () => {
        studentTestPage.clickOnExitTest() // temp fix: issue-  if above test fails while attempting, navigation by direct url is blocked here
        cy.login('teacher', teacher, password)
        teacherSidebar.clickOnAssignment()
        authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
        lcb.verifyStudentCard(
          stuName,
          studentSide.GRADED,
          attempt2.score,
          attempt2.perf,
          attempt2.attempt,
          email
        )
      })

      /*  [0, 1].forEach(i => {
        it(`> hover and verify navigations to responses, attempt-${!i ? 2 : 1}`, () => {
          // if (!i) cy.visit("/author/classboard/5f5f3831697e2200078f51a5/5df2053e988ee800079ad983");
          const attempt = !i ? attempt2 : attempt1;
          lcb.showMulipleAttemptsByStuName(stuName);
          lcb.clickAttemptContainerByIndexByName(stuName, i);
          lcb.verifyStudentCentricCard(undefined, attempt.attempt, questionTypeMap, true);
          lcb.clickOnCardViewTab();
        });
      }); */
      ;[0, 1].forEach((i) => {
        it(`> hover and verify card attempt-${
          i ? '2 not started' : '1'
        }`, () => {
          const attempt = !i ? attempt2 : attempt1
          lcb.clickOnCardViewTab()
          lcb.showMulipleAttemptsByStuName(stuName)
          lcb.verifyStudentScoreOnAttemptContainer(stuName, i, attempt.score)
          lcb.verifyStudentPerfOnAttemptContainer(stuName, i, attempt.perf)
          lcb.verifyAttemptNumberOnAttemptContainer(stuName, !i ? 2 : 1, i)
        })
      })
      it(` > verify student centric view after attempt2`, () => {
        lcb.clickOnStudentsTab()

        // verify current attempt2
        lcb.verifyStudentCentricCard(
          stuName,
          attempt2.attempt,
          questionTypeMap,
          true
        )
        // verify scores and improvement of current attempt2
        lcb.questionResponsePage.verifyTotalScoreAndImprovement(
          attempt2.totalScore,
          attempt2.maxScore,
          attempt2.totalScore - attempt1.totalScore
        )

        // verify previous attempt1
        lcb.questionResponsePage.selectAttempt(1)
        lcb.verifyStudentCentricCard(
          stuName,
          attempt1.attempt,
          questionTypeMap,
          true
        )
        // verify scores and improvement of previous attempt1
        lcb.questionResponsePage.verifyTotalScoreAndImprovement(
          attempt1.totalScore,
          attempt1.maxScore,
          false
        )
      })

      it(` > verify question centric view after attempt2`, () => {
        lcb.clickonQuestionsTab()
        _.keys(attempt2.attempt).forEach((queNum) => {
          lcb.questionResponsePage.selectQuestion(queNum)
          const { queKey, attemptData, points } = questionTypeMap[queNum]
          lcb.questionResponsePage.verifyQuestionResponseCard(
            points,
            queKey,
            attempt2.attempt[queNum],
            attemptData,
            false,
            stuName
          )
        })
      })
    })

    describe(`> redirect the attempt2 for - ${stuName} -and verify after attempt3`, () => {
      before(` > redirect the student`, () => {
        cy.login('teacher', teacher, password)
        teacherSidebar.clickOnAssignment()
        authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
        cy.contains(className)
        lcb.selectCheckBoxByStudentName(stuName)
        lcb.clickOnRedirect()
        lcb.clickOnRedirectSubmit()
      })

      it(`> verify student card view,should be shown with attempt2`, () => {
        lcb.verifyStudentCard(
          stuName,
          teacherSide.REDIRECTED,
          attempt2.score,
          attempt2.perf,
          attempt2.attempt,
          email
        )
        lcb.verifyRedirectIcon(stuName)
      })

      it(`> verify student centric view, should be shown with attempt2`, () => {
        lcb.clickOnStudentsTab()
        lcb.verifyStudentCentricCard(
          stuName,
          attempt2.attempt,
          questionTypeMap,
          true
        )
        // verify scores of current attemp and improvement of attempt2 compare to attempt1
        lcb.questionResponsePage.verifyTotalScoreAndImprovement(
          attempt2.totalScore,
          attempt2.maxScore,
          attempt2.totalScore - attempt1.totalScore
        )
      })

      it(`> verify question centric view,student should be shown with attempt2`, () => {
        lcb.clickonQuestionsTab()
        _.keys(attempt2.attempt).forEach((queNum) => {
          lcb.questionResponsePage.selectQuestion(queNum)
          const { queKey, attemptData, points } = questionTypeMap[queNum]
          lcb.questionResponsePage.verifyQuestionResponseCard(
            points,
            queKey,
            attempt2.attempt,
            attemptData,
            false,
            stuName
          )
        })
      })

      it(`> attempt redirected test with attempt3`, () => {
        cy.login('student', email, password)
        studentTestPage.assignmentPage.clickOnAssignmentButton()
        Object.keys(attempt3.attempt).forEach((queNum) => {
          const [queType] = questionTypeMap[queNum].queKey.split('.')
          const { attemptData } = questionTypeMap[queNum]
          studentTestPage.attemptQuestion(
            queType,
            attempt3.attempt[queNum],
            attemptData
          )
          studentTestPage.clickOnNext()
        })
        studentTestPage.submitTest()
      })

      it(` > verify student card after attempt3`, () => {
        studentTestPage.clickOnExitTest() // temp fix: issue-  if above test fails while attempting, navigation by direct url is blocked here
        cy.login('teacher', teacher, password)
        teacherSidebar.clickOnAssignment()
        authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
        lcb.verifyStudentCard(
          stuName,
          studentSide.GRADED,
          attempt3.score,
          attempt3.perf,
          attempt3.attempt,
          email
        )
      })

      /*
       TODO : commented below due to cypress limitation: https://github.com/cypress-io/cypress/issues/10#issuecomment-118114716
      [0, 1, 2].forEach(i => {
        it(`> hover and verify navigations to responses, attempt-${i ? 2 : 1}`, () => {
          const attempt = !i ? attempt3 : i === 1 ? attempt2 : attempt1;
          lcb.showMulipleAttemptsByStuName(stuName);
          lcb.clickAttemptContainerByIndexByName(stuName, i);
          lcb.verifyStudentCentricCard(stuName, attempt.attempt, questionTypeMap, true);
          lcb.clickOnCardViewTab();
        });
      }); */
      ;[0, 1, 2].forEach((i) => {
        it(`> hover and verify card attempt-${
          !i ? 3 : i === 1 ? 2 : 1
        }`, () => {
          const attempt = !i ? attempt3 : i === 1 ? attempt2 : attempt1
          lcb.clickOnCardViewTab()
          lcb.showMulipleAttemptsByStuName(stuName)
          lcb.verifyStudentScoreOnAttemptContainer(stuName, i, attempt.score)
          lcb.verifyStudentPerfOnAttemptContainer(stuName, i, attempt.perf)
          lcb.verifyAttemptNumberOnAttemptContainer(
            stuName,
            !i ? 3 : i === 1 ? 2 : 1,
            i
          )
        })
      })

      it(` > verify student centric view after attempt3`, () => {
        // student centric should have  attempt 3
        lcb.clickOnStudentsTab()
        lcb.verifyStudentCentricCard(
          stuName,
          attempt3.attempt,
          questionTypeMap,
          true
        )
        // verify scores and improvement of attempt 3
        const { totalScore, maxScore } = lcb.getScoreAndPerformance(
          attempt3.attempt,
          questionTypeMap
        )
        lcb.questionResponsePage.verifyTotalScoreAndImprovement(
          attempt3.totalScore,
          attempt3.maxScore,
          attempt3.totalScore - attempt2.totalScore
        )

        // verify previous attempt 2
        lcb.questionResponsePage.selectAttempt(2)
        lcb.verifyStudentCentricCard(
          stuName,
          attempt2.attempt,
          questionTypeMap,
          true
        )
        // verify scores and improvement of attempt 2
        lcb.questionResponsePage.verifyTotalScoreAndImprovement(
          attempt2.totalScore,
          attempt2.maxScore,
          attempt2.totalScore - attempt1.totalScore
        )

        // verify previous attempt 1
        lcb.questionResponsePage.selectAttempt(1)
        lcb.verifyStudentCentricCard(
          stuName,
          attempt1.attempt,
          questionTypeMap,
          true
        )
        // verify scores and improvement of previous attempt 1
        lcb.questionResponsePage.verifyTotalScoreAndImprovement(
          totalScore,
          maxScore,
          false
        )
      })

      it(` > verify quetion centric view after attempt3`, () => {
        // quetion centric should have  attempt 3
        lcb.clickonQuestionsTab()
        _.keys(attempt3.attempt).forEach((queNum) => {
          lcb.questionResponsePage.selectQuestion(queNum)
          const { queKey, attemptData, points } = questionTypeMap[queNum]
          lcb.questionResponsePage.verifyQuestionResponseCard(
            points,
            queKey,
            attempt3.attempt[queNum],
            attemptData,
            false,
            stuName
          )
        })
      })
    })
  })
  // TODO : add close date related redirect scenarios
  // TODO : add scenarios with non gradable question - question create module need to implemented for this
})
