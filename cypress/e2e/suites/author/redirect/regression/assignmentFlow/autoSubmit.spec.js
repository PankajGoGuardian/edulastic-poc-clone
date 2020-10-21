/* eslint-disable cypress/no-unnecessary-waiting */
import AuthorAssignmentPage from '../../../../../framework/author/assignments/AuthorAssignmentPage'
import ExpressGraderPage from '../../../../../framework/author/assignments/expressGraderPage'
import LiveClassboardPage from '../../../../../framework/author/assignments/LiveClassboardPage'
import TestLibrary from '../../../../../framework/author/tests/testLibraryPage'
import {
  questionDeliveryType,
  redirectType,
  studentSide,
  teacherSide,
} from '../../../../../framework/constants/assignmentStatus'
import { attemptTypes } from '../../../../../framework/constants/questionTypes'
import ReportsPage from '../../../../../framework/student/reportsPage'
import StudentTestPage from '../../../../../framework/student/studentTestPage'
import FileHelper from '../../../../../framework/util/fileHelper'

const questiondata = require('../../../../../../fixtures/questionAuthoring')

const testData = require('../../../../../../fixtures/testAuthoring')

describe(`> ${FileHelper.getSpecName(
  Cypress.spec.name
)}> auto submittion of assignment`, () => {
  const testlibraryPage = new TestLibrary()
  const studentTestPage = new StudentTestPage()
  const authorAssignmentPage = new AuthorAssignmentPage()
  const lcb = new LiveClassboardPage()
  const expressGraderPage = new ExpressGraderPage()
  const reportsPage = new ReportsPage()
  const { _ } = Cypress
  const teacher = 'teachercloses@redirect.com'
  const students = [
    {
      email: 'cteacher1164',
      name: 'Teacher, Close-1',
    },
    {
      email: 'cteacher8406',
      name: 'Teacher, Close-2',
    },
    {
      email: 'cteacher7808',
      name: 'Teacher, Close-3',
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

  const partialAttempt_1 = {
    Q1: attemptTypes.RIGHT,
    Q5: attemptTypes.WRONG,
  }

  const partialAttempt_2 = {
    Q1: attemptTypes.RIGHT,
    Q4: attemptTypes.RIGHT,
  }

  const completeAttempt_1 = {
    Q1: attemptTypes.WRONG,
    Q2: attemptTypes.RIGHT,
    Q3: attemptTypes.RIGHT,
    Q4: attemptTypes.RIGHT,
    Q5: attemptTypes.RIGHT,
  }

  const completeAttempt_2 = {
    Q1: attemptTypes.WRONG,
    Q2: attemptTypes.RIGHT,
    Q3: attemptTypes.RIGHT,
    Q4: attemptTypes.RIGHT,
  }

  const testId = '5f8ac2c609c7cd0008243f47'
  const { itemKeys } = testData.SMOKE_4
  lcb.getQuestionTypeMap(itemKeys, questiondata, questionTypeMap)
  const perfOfAttempt1 = lcb.getScoreAndPerformance(attempt1, questionTypeMap)
  let assignmentId

  before('> create a test', () => {
    expect(
      itemKeys.length,
      `no of questions should be ${_.keys(attempt1).length} in the test`
    ).to.eq(_.keys(attempt1).length)
    cy.login('teacher', teacher)
    /*  testlibraryPage.createTest('SMOKE_4', false).then((id) => {
      testlibraryPage.header.clickOnSettings()
      testlibraryPage.testSettings.setRealeasePolicy(
        releaseGradeTypes.WITH_RESPONSE
      )
      testlibraryPage.header.clickOnPublishButton()
      testId = id
    }) */
  })
  context(`> redirect with '${questionDeliveryType.All}'`, () => {
    before('> create and assign test', () => {
      cy.deleteAllAssignments('', teacher)
      testlibraryPage.assignPage.visitAssignPageById(testId)
      testlibraryPage.assignPage.selectClass('teacher closes redirect')
      testlibraryPage.assignPage.clickOnAssign().then((assignObj) => {
        assignmentId = assignObj[testId]
      })
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

    before('> second attempt by students', () => {
      students.slice(0, 2).forEach((student, i) => {
        const currentAttempt = i ? partialAttempt_1 : completeAttempt_1
        cy.login('student', student.email)
        studentTestPage.assignmentPage.clickOnAssignmentButton()
        _.entries(currentAttempt).forEach((ele) => {
          const { queKey, attemptData } = questionTypeMap[ele[0]]
          studentTestPage.getQuestionByIndex(+ele[0].slice(1) - 1)
          studentTestPage.attemptQuestion(
            queKey.split('.')[0],
            ele[1],
            attemptData
          )
        })
        studentTestPage.clickOnExitTest()
      })
    })

    before('> login as teacher, and goto assignmnets', () => {
      cy.login('teacher', teacher)
      testlibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.clickOnLCBbyTestId(testId)
      lcb.header.clickLCBSettings()
    })

    before('> update due date', () => {
      const date = new Date()
      lcb.settings.setEndDate(date.setSeconds(date.getSeconds() + 30))
      lcb.settings.clickUpadeSettings()
      cy.wait(35000)
    })

    before('> call auto submit', () => {
      cy.autoSubmitAssignment(teacher, 'snapwiz', assignmentId)
      cy.wait(60000)
      cy.login('teacher', teacher)
      cy.wait(60000)
      testlibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.getStatus().then((ele) => {
        if (ele.text() !== teacherSide.DONE) {
          cy.wait(60000)
          cy.login('teacher', teacher)
          cy.wait(60000)
          testlibraryPage.sidebar.clickOnAssignment()
          authorAssignmentPage.getStatus().then((ele_) => {
            if (ele_.text() !== teacherSide.DONE) {
              cy.wait(60000)
              cy.login('teacher', teacher)
              cy.wait(60000)
              testlibraryPage.sidebar.clickOnAssignment()
              authorAssignmentPage.verifyStatus(teacherSide.DONE)
            }
          })
        }
      })
      authorAssignmentPage.clickOnLCBbyTestId(testId)
    })

    students.forEach(({ name }, i) => {
      it(`> card view for student attempted ${
        i === 0 ? 'completely' : i === 1 ? 'partially' : 'nothing'
      }, and exited`, () => {
        const attempt2 =
          i === 0 ? completeAttempt_1 : i === 1 ? partialAttempt_1 : attempt1
        const effectiveAttempt = lcb.redirectPopup.getEffectiveAttempt(
          attempt1,
          attempt2
        )
        const perfOfAttempt2 = lcb.getScoreAndPerformance(
          effectiveAttempt,
          questionTypeMap
        )

        ;[perfOfAttempt2, perfOfAttempt1].forEach(
          ({ perf, score }, attemptNo) => {
            lcb.verifyStudentScoreOnAttemptContainer(name, attemptNo, score)
            lcb.verifyStudentPerfOnAttemptContainer(name, attemptNo, perf)
          }
        )
      })
    })

    students.forEach((student, i) => {
      it(`> student view for student attempted ${
        i === 0 ? 'completely' : i === 1 ? 'partially' : 'nothing'
      }, and exited`, () => {
        const attempt2 =
          i === 0 ? completeAttempt_1 : i === 1 ? partialAttempt_1 : attempt1
        const effectiveAttempt = lcb.redirectPopup.getEffectiveAttempt(
          attempt1,
          attempt2
        )
        const perfOfAttempt2 = lcb.getScoreAndPerformance(
          effectiveAttempt,
          questionTypeMap
        )

        console.log(effectiveAttempt)

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
            effectiveAttempt[q],
            attemptData,
            true,
            queNo
          )
        })
      })
    })

    it('> question view, for all students', () => {
      lcb.clickonQuestionsTab()
      _.keys(questionTypeMap).forEach((q) => {
        lcb.questionResponsePage.selectQuestion(q)
        const { queKey, points, attemptData } = questionTypeMap[q]
        students.forEach(({ name }, i) => {
          const attempt2 =
            i === 0 ? completeAttempt_1 : i === 1 ? partialAttempt_1 : attempt1
          const effectiveAttempt = lcb.redirectPopup.getEffectiveAttempt(
            attempt1,
            attempt2
          )
          lcb.questionResponsePage.verifyQuestionResponseCard(
            points,
            queKey,
            effectiveAttempt[q],
            attemptData,
            false,
            name
          )
        })
      })
    })

    students.forEach(({ name }, i) => {
      it(`> express grader view for student attempted ${
        i === 0 ? 'completely' : i === 1 ? 'partially' : 'nothing'
      }, and exited`, () => {
        const attempt2 =
          i === 0 ? completeAttempt_1 : i === 1 ? partialAttempt_1 : attempt1
        const effectiveAttempt = lcb.redirectPopup.getEffectiveAttempt(
          attempt1,
          attempt2
        )
        const perfOfAttempt2 = lcb.getScoreAndPerformance(
          effectiveAttempt,
          questionTypeMap
        )

        if (!i) lcb.header.clickOnExpressGraderTab()
        expressGraderPage.setToggleToScore()
        expressGraderPage.verifyScoreGrid(
          name,
          effectiveAttempt,
          perfOfAttempt2.score,
          perfOfAttempt2.perfValue,
          questionTypeMap
        )
        expressGraderPage.verifyScoreGridColor(name, effectiveAttempt)

        expressGraderPage.setToggleToResponse()
        expressGraderPage.verifyResponseGrid(
          effectiveAttempt,
          questionTypeMap,
          name
        )
      })
    })
    students.forEach(({ email }, i) => {
      it(`> student grades page for ${
        i === 0 ? 'completely' : i === 1 ? 'partially' : 'nothing'
      }, attempted and exited`, () => {
        const attempt2 =
          i === 0 ? completeAttempt_1 : i === 1 ? partialAttempt_1 : attempt1
        const effectiveAttempt = lcb.redirectPopup.getEffectiveAttempt(
          attempt1,
          attempt2
        )
        const perfOfAttempt2 = lcb.getScoreAndPerformance(
          effectiveAttempt,
          questionTypeMap
        )

        cy.login('student', email)
        studentTestPage.assignmentPage.sidebar.clickOnGrades()
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
      testlibraryPage.assignPage.selectClass('teacher closes redirect')
      testlibraryPage.assignPage.clickOnAssign().then((assignObj) => {
        assignmentId = assignObj[testId]
      })
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

    before('> second attempt by students', () => {
      students.slice(0, 2).forEach((student, i) => {
        cy.login('student', student.email)
        const currentAttempt = i ? partialAttempt_2 : completeAttempt_2

        studentTestPage.assignmentPage.clickOnAssignmentButton()
        _.entries(currentAttempt).forEach((ele, _i) => {
          const { queKey, attemptData } = questionTypeMap[ele[0]]
          const currentQueToAttempt =
            i && _i ? _.keys(completeAttempt_2).length - 1 : _i
          studentTestPage.getQuestionByIndex(currentQueToAttempt)
          studentTestPage.attemptQuestion(
            queKey.split('.')[0],
            ele[1],
            attemptData
          )
        })
        studentTestPage.clickOnExitTest()
      })
    })

    before('> login as teacher, and goto assignmnets', () => {
      cy.login('teacher', teacher)
      testlibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.clickOnLCBbyTestId(testId)
      lcb.header.clickLCBSettings()
    })

    before('> update due date', () => {
      const date = new Date()
      lcb.settings.setEndDate(date.setSeconds(date.getSeconds() + 30))
      lcb.settings.clickUpadeSettings()
      cy.wait(35000)
    })

    before('> call auto submit', () => {
      cy.autoSubmitAssignment(teacher, 'snapwiz', assignmentId)
      cy.wait(60000)
      cy.login('teacher', teacher)
      cy.wait(60000)
      testlibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.getStatus().then((ele) => {
        if (ele.text() !== teacherSide.DONE) {
          cy.wait(60000)
          cy.login('teacher', teacher)
          cy.wait(60000)
          testlibraryPage.sidebar.clickOnAssignment()
          authorAssignmentPage.getStatus().then((ele_) => {
            if (ele_.text() !== teacherSide.DONE) {
              cy.wait(60000)
              cy.login('teacher', teacher)
              cy.wait(60000)
              testlibraryPage.sidebar.clickOnAssignment()
              authorAssignmentPage.verifyStatus(teacherSide.DONE)
            }
          })
        }
      })
      authorAssignmentPage.clickOnLCBbyTestId(testId)
    })

    students.forEach(({ name }, i) => {
      it(`> card view for student attempted ${
        i === 0 ? 'completely' : i === 1 ? 'partially' : 'nothing'
      }, and exited`, () => {
        const attempt2 =
          i === 0 ? completeAttempt_2 : i === 1 ? partialAttempt_2 : attempt1
        const effectiveAttempt = lcb.redirectPopup.getEffectiveAttempt(
          attempt1,
          attempt2
        )
        const perfOfAttempt2 = lcb.getScoreAndPerformance(
          effectiveAttempt,
          questionTypeMap
        )

        ;[perfOfAttempt2, perfOfAttempt1].forEach(
          ({ perf, score }, attemptNo) => {
            lcb.verifyStudentScoreOnAttemptContainer(name, attemptNo, score)
            lcb.verifyStudentPerfOnAttemptContainer(name, attemptNo, perf)
          }
        )
      })
    })

    students.forEach((student, i) => {
      it(`> student view for student attempted ${
        i === 0 ? 'completely' : i === 1 ? 'partially' : 'nothing'
      }, and exited`, () => {
        const attempt2 =
          i === 0 ? completeAttempt_2 : i === 1 ? partialAttempt_2 : attempt1
        const effectiveAttempt = lcb.redirectPopup.getEffectiveAttempt(
          attempt1,
          attempt2
        )
        const perfOfAttempt2 = lcb.getScoreAndPerformance(
          effectiveAttempt,
          questionTypeMap
        )

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
            effectiveAttempt[q],
            attemptData,
            true,
            queNo
          )
        })
      })
    })

    it('> question view, for all students', () => {
      lcb.clickonQuestionsTab()
      _.keys(questionTypeMap).forEach((q) => {
        lcb.questionResponsePage.selectQuestion(q)
        const { queKey, points, attemptData } = questionTypeMap[q]
        students.forEach(({ name }, i) => {
          const attempt2 =
            i === 0 ? completeAttempt_2 : i === 1 ? partialAttempt_2 : attempt1
          const effectiveAttempt = lcb.redirectPopup.getEffectiveAttempt(
            attempt1,
            attempt2
          )
          lcb.questionResponsePage.verifyQuestionResponseCard(
            points,
            queKey,
            effectiveAttempt[q],
            attemptData,
            false,
            name
          )
        })
      })
    })

    students.forEach(({ name }, i) => {
      it(`> express grader view for student attempted ${
        i === 0 ? 'completely' : i === 1 ? 'partially' : 'nothing'
      }, and exited`, () => {
        const attempt2 =
          i === 0 ? completeAttempt_2 : i === 1 ? partialAttempt_2 : attempt1
        const effectiveAttempt = lcb.redirectPopup.getEffectiveAttempt(
          attempt1,
          attempt2
        )
        const perfOfAttempt2 = lcb.getScoreAndPerformance(
          effectiveAttempt,
          questionTypeMap
        )

        if (!i) lcb.header.clickOnExpressGraderTab()
        expressGraderPage.setToggleToScore()
        expressGraderPage.verifyScoreGrid(
          name,
          effectiveAttempt,
          perfOfAttempt2.score,
          perfOfAttempt2.perfValue,
          questionTypeMap
        )
        expressGraderPage.verifyScoreGridColor(name, effectiveAttempt)

        expressGraderPage.setToggleToResponse()
        expressGraderPage.verifyResponseGrid(
          effectiveAttempt,
          questionTypeMap,
          name
        )
      })
    })
    students.forEach(({ email }, i) => {
      it(`> student grades page for ${
        i === 0 ? 'completely' : i === 1 ? 'partially' : 'nothing'
      } attempted, and exited`, () => {
        const attempt2 =
          i === 0 ? completeAttempt_2 : i === 1 ? partialAttempt_2 : attempt1
        const effectiveAttempt = lcb.redirectPopup.getEffectiveAttempt(
          attempt1,
          attempt2
        )
        const perfOfAttempt2 = lcb.getScoreAndPerformance(
          effectiveAttempt,
          questionTypeMap
        )

        cy.login('student', email)
        studentTestPage.assignmentPage.sidebar.clickOnGrades()
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
