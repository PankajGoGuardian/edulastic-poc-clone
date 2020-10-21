import AuthorAssignmentPage from '../../../../../framework/author/assignments/AuthorAssignmentPage'
import ExpressGraderPage from '../../../../../framework/author/assignments/expressGraderPage'
import LiveClassboardPage from '../../../../../framework/author/assignments/LiveClassboardPage'
import TestLibrary from '../../../../../framework/author/tests/testLibraryPage'
import {
  questionDeliveryType,
  redirectType,
  studentSide,
} from '../../../../../framework/constants/assignmentStatus'
import { attemptTypes } from '../../../../../framework/constants/questionTypes'
import ReportsPage from '../../../../../framework/student/reportsPage'
import StudentTestPage from '../../../../../framework/student/studentTestPage'
import FileHelper from '../../../../../framework/util/fileHelper'

const questiondata = require('../../../../../../fixtures/questionAuthoring')

const testData = require('../../../../../../fixtures/testAuthoring')

describe(`> ${FileHelper.getSpecName(
  Cypress.spec.name
)}> teacher marks redirected attempt as absent`, () => {
  const testlibraryPage = new TestLibrary()
  const studentTestPage = new StudentTestPage()
  const authorAssignmentPage = new AuthorAssignmentPage()
  const lcb = new LiveClassboardPage()
  const expressGraderPage = new ExpressGraderPage()
  const reportsPage = new ReportsPage()
  const { _ } = Cypress
  const teacher = 'teachermarksabsent@redirect.com'
  const students = [
    {
      email: 'ateacher8151',
      name: 'Teacher, Absent-1',
    },
  ]

  const questionTypeMap = {}
  const attempt1 = {
    Q1: attemptTypes.WRONG,
    Q2: attemptTypes.WRONG,
    Q3: attemptTypes.SKIP,
    Q4: attemptTypes.SKIP,
    Q5: attemptTypes.RIGHT,
  }

  const testId = '5f8af389a79518000812de59'
  const { itemKeys } = testData.REDIRECTED
  lcb.getQuestionTypeMap(itemKeys, questiondata, questionTypeMap)
  const perfOfAttempt1 = lcb.getScoreAndPerformance(attempt1, questionTypeMap)

  before('> create a test', () => {
    expect(
      itemKeys.length,
      `no of questions should be ${_.keys(attempt1).length} in the test`
    ).to.eq(_.keys(attempt1).length)
    cy.login('teacher', teacher)
    /*  testlibraryPage.createTest('REDIRECTED', false).then((id) => {
      testlibraryPage.header.clickOnSettings()
      testlibraryPage.testSettings.setRealeasePolicy(
        releaseGradeTypes.WITH_ANSWERS
      )
      testlibraryPage.header.clickOnPublishButton()
      testId = id
    }) */
  })
  context(`> redirect with '${questionDeliveryType.All}'`, () => {
    before('> create and assign test', () => {
      cy.deleteAllAssignments('', teacher)
      testlibraryPage.assignPage.visitAssignPageById(testId)
      testlibraryPage.assignPage.selectClass('teacher mark as absent')
      testlibraryPage.assignPage.clickOnAssign()
    })

    before('> attempt by students', () => {
      students.forEach(({ email }) => {
        studentTestPage.attemptAssignment(
          email,
          studentSide.SUBMITTED,
          attempt1,
          questionTypeMap
        )
      })
    })

    before('> redirect the assignment', () => {
      cy.login('teacher', teacher)
      testlibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.clickOnLCBbyTestId(testId)

      students.forEach(({ name }) => lcb.selectCheckBoxByStudentName(name))
      lcb.clickOnRedirect()
      lcb.redirectPopup.selectRedirectPolicy(redirectType.FEEDBACK_ONLY)
      lcb.redirectPopup.selectQuestionDelivey(questionDeliveryType.All)
      lcb.clickOnRedirectSubmit()
    })

    before('> login as teacher, and goto assignmnets', () => {
      students.forEach(({ name }) => lcb.selectCheckBoxByStudentName(name))
      lcb.clickOnMarkAsAbsent()
      testlibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.clickOnLCBbyTestId(testId)
    })

    students.forEach(({ name }) => {
      it(`> card view for absent student in second attempt`, () => {
        const perfOfAttempt2 = perfOfAttempt1

        ;[perfOfAttempt2, perfOfAttempt1].forEach(
          ({ perf, score }, attemptNo) => {
            lcb.verifyStudentScoreOnAttemptContainer(name, attemptNo, score)
            lcb.verifyStudentPerfOnAttemptContainer(name, attemptNo, perf)
          }
        )
      })
    })

    students.forEach((student, i) => {
      it(`> student view for absent student in second attempt`, () => {
        const perfOfAttempt2 = perfOfAttempt1

        if (!i) lcb.clickOnStudentsTab()
        lcb.questionResponsePage.selectStudent(student.name)
        lcb.questionResponsePage.verifyTotalScoreAndImprovement(
          perfOfAttempt2.totalScore,
          perfOfAttempt2.maxScore,
          perfOfAttempt2.totalScore - perfOfAttempt1.totalScore
        )

        _.keys(questionTypeMap).forEach((q, queNo) => {
          const { queKey, points, attemptData } = questionTypeMap[q]
          lcb.questionResponsePage.verifyQuestionResponseCard(
            points,
            queKey,
            attempt1[q],
            attemptData,
            true,
            queNo
          )
        })
      })
    })

    it('> question view for absent student in second attempt', () => {
      lcb.clickonQuestionsTab()
      _.keys(questionTypeMap).forEach((q) => {
        lcb.questionResponsePage.selectQuestion(q)
        const { queKey, points, attemptData } = questionTypeMap[q]
        students.forEach(({ name }) => {
          lcb.questionResponsePage.verifyQuestionResponseCard(
            points,
            queKey,
            attempt1[q],
            attemptData,
            false,
            name
          )
        })
      })
    })

    students.forEach(({ name }, i) => {
      it(`> express grader view for absent student in second attempt`, () => {
        const perfOfAttempt2 = perfOfAttempt1

        if (!i) lcb.header.clickOnExpressGraderTab()
        expressGraderPage.setToggleToScore()
        expressGraderPage.verifyScoreGrid(
          name,
          attempt1,
          perfOfAttempt2.score,
          perfOfAttempt2.perfValue,
          questionTypeMap
        )
        expressGraderPage.verifyScoreGridColor(name, attempt1)

        expressGraderPage.setToggleToResponse()
        expressGraderPage.verifyResponseGrid(attempt1, questionTypeMap, name)
      })
    })
    students.forEach(({ email }) => {
      it(`> student grades page for absent student in second attempt`, () => {
        const perfOfAttempt2 = perfOfAttempt1

        cy.login('student', email)
        studentTestPage.assignmentPage.sidebar.clickOnGrades()
        reportsPage.verifyStatusIs(studentSide.GRADED)
        reportsPage.validateStats(
          2,
          `2/2`,
          perfOfAttempt2.score,
          perfOfAttempt2.perfValue
        )
      })
    })
  })
  context(`> redirect with '${questionDeliveryType.SKIPPED_AND_WRONG}'`, () => {
    before('> create and assign test', () => {
      cy.deleteAllAssignments('', teacher)
      cy.login('teacher', teacher)
      testlibraryPage.assignPage.visitAssignPageById(testId)
      testlibraryPage.assignPage.selectClass('teacher mark as absent')
      testlibraryPage.assignPage.clickOnAssign()
    })

    before('> attempt by students', () => {
      console.log(questionTypeMap)
      students.forEach(({ email }) => {
        studentTestPage.attemptAssignment(
          email,
          studentSide.SUBMITTED,
          attempt1,
          questionTypeMap
        )
      })
    })

    before('> redirect the assignment', () => {
      cy.login('teacher', teacher)
      testlibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.clickOnLCBbyTestId(testId)

      students.forEach(({ name }) => lcb.selectCheckBoxByStudentName(name))
      lcb.clickOnRedirect()
      lcb.redirectPopup.selectRedirectPolicy(redirectType.FEEDBACK_ONLY)
      lcb.redirectPopup.selectQuestionDelivey(
        questionDeliveryType.SKIPPED_AND_WRONG
      )
      lcb.clickOnRedirectSubmit()
    })
    before('> login as teacher, and goto assignmnets', () => {
      students.forEach(({ name }) => lcb.selectCheckBoxByStudentName(name))
      lcb.clickOnMarkAsAbsent()
      testlibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.clickOnLCBbyTestId(testId)
    })

    students.forEach(({ name }) => {
      it(`> card view for absent student in second attempt`, () => {
        const perfOfAttempt2 = perfOfAttempt1

        ;[perfOfAttempt2, perfOfAttempt1].forEach(
          ({ perf, score }, attemptNo) => {
            lcb.verifyStudentScoreOnAttemptContainer(name, attemptNo, score)
            lcb.verifyStudentPerfOnAttemptContainer(name, attemptNo, perf)
          }
        )
      })
    })

    students.forEach((student, i) => {
      it(`> student view for absent student in second attempt`, () => {
        const perfOfAttempt2 = perfOfAttempt1

        if (!i) lcb.clickOnStudentsTab()
        lcb.questionResponsePage.selectStudent(student.name)
        lcb.questionResponsePage.verifyTotalScoreAndImprovement(
          perfOfAttempt2.totalScore,
          perfOfAttempt2.maxScore,
          perfOfAttempt2.totalScore - perfOfAttempt1.totalScore
        )

        _.keys(questionTypeMap).forEach((q, queNo) => {
          const { queKey, points, attemptData } = questionTypeMap[q]
          lcb.questionResponsePage.verifyQuestionResponseCard(
            points,
            queKey,
            attempt1[q],
            attemptData,
            true,
            queNo
          )
        })
      })
    })

    it('> question view for absent student in second attempt', () => {
      lcb.clickonQuestionsTab()
      _.keys(questionTypeMap).forEach((q) => {
        lcb.questionResponsePage.selectQuestion(q)
        const { queKey, points, attemptData } = questionTypeMap[q]
        students.forEach(({ name }) => {
          lcb.questionResponsePage.verifyQuestionResponseCard(
            points,
            queKey,
            attempt1[q],
            attemptData,
            false,
            name
          )
        })
      })
    })

    students.forEach(({ name }, i) => {
      it(`> express grader view for absent student in second attempt`, () => {
        const perfOfAttempt2 = perfOfAttempt1

        if (!i) lcb.header.clickOnExpressGraderTab()
        expressGraderPage.setToggleToScore()
        expressGraderPage.verifyScoreGrid(
          name,
          attempt1,
          perfOfAttempt2.score,
          perfOfAttempt2.perfValue,
          questionTypeMap
        )
        expressGraderPage.verifyScoreGridColor(name, attempt1)

        expressGraderPage.setToggleToResponse()
        expressGraderPage.verifyResponseGrid(attempt1, questionTypeMap, name)
      })
    })
    students.forEach(({ email }) => {
      it(`> student grades page for absent student in second attempt`, () => {
        const perfOfAttempt2 = perfOfAttempt1

        cy.login('student', email)
        studentTestPage.assignmentPage.sidebar.clickOnGrades()
        reportsPage.verifyStatusIs(studentSide.GRADED)
        reportsPage.validateStats(
          2,
          `2/2`,
          perfOfAttempt2.score,
          perfOfAttempt2.perfValue
        )
      })
    })
  })
})
