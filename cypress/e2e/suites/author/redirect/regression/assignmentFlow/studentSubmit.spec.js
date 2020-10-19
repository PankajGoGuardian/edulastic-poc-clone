/* eslint-disable max-len */
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
)}> student submits redirected attempt`, () => {
  const testlibraryPage = new TestLibrary()
  const studentTestPage = new StudentTestPage()
  const authorAssignmentPage = new AuthorAssignmentPage()
  const lcb = new LiveClassboardPage()
  const expressGraderPage = new ExpressGraderPage()
  const reportsPage = new ReportsPage()
  const { _ } = Cypress
  const teacher = 'stusubmit@redirect.com'
  const students = [
    {
      email: 'sstu5515',
      name: 'Stu, Submit1',
    },
    {
      email: 'sstu3101',
      name: 'Stu, Submit2',
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

  const testId = '5f89caa00994c9000820432c'
  const { itemKeys } = testData.REDIRECTED
  const perfOfAttempt1 = lcb.getScoreAndPerformance(attempt1, questionTypeMap)
  lcb.getQuestionTypeMap(itemKeys, questiondata, questionTypeMap)

  before('> create a test', () => {
    expect(
      itemKeys.length,
      `no of questions should be ${_.keys(attempt1).length} in the test`
    ).to.eq(_.keys(attempt1).length)
    cy.login('teacher', teacher)
    /* testlibraryPage.createTest('REDIRECTED', false).then((id) => {
      testlibraryPage.header.clickOnSettings()
      testlibraryPage.testSettings.setRealeasePolicy(
        releaseGradeTypes.WITH_RESPONSE
      )
      testId = id
    }) */
  })
  context(`> redirect with '${questionDeliveryType.All}'`, () => {
    /* 
    1. attempt1: all student attempts and submit test with attempt types mentioned in 'attempt1'
    2. teacher redirects test to all students, with all questions
    3. attempt2:
          stu1: attempts few questions and submits
          stu2: attempts all questions and submits
    4. for second attempt lcb and eg should show 
          responses+scores of 'unattended(will not include skipped expicitly) questions from attempt-2 
          should be replaced with those of attempt-1'         
    */
    before('> create and assign test', () => {
      cy.deleteAllAssignments('', teacher)
      testlibraryPage.assignPage.visitAssignPageById(testId)
      testlibraryPage.assignPage.selectClass('rediect student submit')
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
      lcb.clickOnRedirectSubmit()
    })

    before('> second attempt by students', () => {
      students.forEach((student, i) => {
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
        studentTestPage.clickOnNext()
        studentTestPage.submitTest()
      })
    })

    before('> login as teacher, and goto assignmnets', () => {
      cy.login('teacher', teacher)
      testlibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.clickOnLCBbyTestId(testId)
    })

    students.forEach(({ name }, i) => {
      it(`> card view for student attempted ${
        i ? 'partially' : 'completely'
      }, and submitted`, () => {
        const attempt2 = i ? partialAttempt_1 : completeAttempt_1
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
        i ? 'partially' : 'completely'
      }, and submitted`, () => {
        const attempt2 = i ? partialAttempt_1 : completeAttempt_1
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
          const attempt2 = i ? partialAttempt_1 : completeAttempt_1
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
        i ? 'partially' : 'completely'
      }, and submitted`, () => {
        const attempt2 = i ? partialAttempt_1 : completeAttempt_1
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
        i ? 'partially' : 'completely'
      }, attempted and submitted`, () => {
        const attempt2 = i ? partialAttempt_1 : completeAttempt_1
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
    /* 
    1. attempt1: all student attempts and submit test with attempt types mentioned in 'attempt1'
    2. teacher redirects test to all students, with skipped and wrong
    3. attempt2:
          stu1: attempts few questions and submits
          stu2: attempts all questions and submits
    4. for second attempt lcb and eg should show 
          responses+scores of 'unattended(will not include skipped expicitly) questions from attempt-2 
          should be replaced with those of attempt-1'         
    */
    before('> create and assign test', () => {
      cy.deleteAllAssignments('', teacher)
      cy.login('teacher', teacher)
      testlibraryPage.assignPage.visitAssignPageById(testId)
      testlibraryPage.assignPage.selectClass('rediect student submit')
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

    before('> second attempt by students', () => {
      students.forEach((student, i) => {
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
        studentTestPage.clickOnNext()
        studentTestPage.submitTest()
      })
    })

    before('> login as teacher, and goto assignmnets', () => {
      cy.login('teacher', teacher)
      testlibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.clickOnLCBbyTestId(testId)
    })

    students.forEach(({ name }, i) => {
      it(`> card view for student attempted ${
        i ? 'partially' : 'completely'
      }, and submitted`, () => {
        const attempt2 = i ? partialAttempt_2 : completeAttempt_2
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
        i ? 'partially' : 'completely'
      }, and submitted`, () => {
        const attempt2 = i ? partialAttempt_2 : completeAttempt_2
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
          const attempt2 = i ? partialAttempt_2 : completeAttempt_2
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
        i ? 'partially' : 'completely'
      }, and submitted`, () => {
        const attempt2 = i ? partialAttempt_2 : completeAttempt_2
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
        i ? 'partially' : 'completely'
      } attempted, and submitted`, () => {
        const attempt2 = i ? partialAttempt_2 : completeAttempt_2
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
