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
    email: 'student.skipped@snapwiz.com',
    stuName: 'student1',
  },
  2: {
    email: 'student2.skipped@snapwiz.com',
    stuName: 'student2',
  },
}

const allWrong = { Q1: 'wrong', Q2: 'wrong', Q3: 'wrong' }
const allRight = { Q1: 'right', Q2: 'right', Q3: 'right' }

const noattempt = lcb.getNullifiedAttempts(allWrong)

const teacherFeedback = 'You need to work hard'
const queList = _.keys(allRight)

const redirectTestData = {
  className: 'Class',
  teacher: 'teacher.skipped@snapwiz.com',
  student: students[1].email,
  password: 'snapwiz',
  assignmentName: 'New Assessment LCB',
  attemptsData: [
    {
      attempt: { Q1: 'right', Q2: 'skip', Q3: 'wrong' },
      status: studentSide.GRADED,
      ...students[1],
    },
    {
      attempt: { Q1: 'right', Q2: 'right', Q3: 'right' },
      status: studentSide.IN_PROGRESS,
      ...students[2],
    },
  ],

  redirect4: {
    attempt: { ...allRight },
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
  const testId = '5f6211934bc2bb00089e4f27'

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

  describe(`> redirect with setting - ${redirectType.FEEDBACK_ONLY}-${questionDeliveryType.SKIPPED_AND_WRONG}`, () => {
    const { stuName, email, attempt } = redirectTestData.redirect4
    const currentAttempt = { Q2: 'right', Q3: 'right' }
    const attempt1 = { ...statsMap[stuName] }
    const attempt2 = {
      ...lcb.getScoreAndPerformance(attempt, questionTypeMap),
      attempt,
    }

    before('login as teacher', () => {
      cy.login('teacher', teacher, password)
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
      cy.contains(className)
    })

    it(' > redirect the student and verify card view', () => {
      lcb.selectCheckBoxByStudentName(stuName)
      lcb.clickOnRedirect()
      lcb.verifyStudentsOnRedirectPopUp(email)

      // select redirect policy
      lcb.redirectPopup.selectQuestionDelivey(
        questionDeliveryType.SKIPPED_AND_WRONG
      )
      lcb.redirectPopup.selectRedirectPolicy(redirectType.FEEDBACK_ONLY)
      lcb.clickOnRedirectSubmit()
      lcb.verifyStudentCard(
        stuName,
        teacherSide.REDIRECTED,
        attempt1.score,
        attempt1.perf,
        attempt1.attempt,
        email,
        true
      )
      lcb.verifyRedirectIcon(stuName)
    })
    ;[0, 1].forEach((i) => {
      it(`> verify student card attempt view for attempt-${
        i ? 'not started' : 1
      }`, () => {
        const attempt = !i
          ? {
              perf: studentSide.NOT_STARTED,
              score: `- / ${statsMap[stuName].maxScore}`,
            }
          : attempt1
        lcb.clickOnCardViewTab()
        // lcb.showMulipleAttemptsByStuName(stuName) --> commenting since by-default multi attempt view should come now
        lcb.verifyStudentScoreOnAttemptContainer(stuName, i, attempt.score)
        lcb.verifyStudentPerfOnAttemptContainer(stuName, i, attempt.perf)
        lcb.verifyAttemptNumberOnAttemptContainer(stuName, !i ? 2 : 1, i)
      })
    })

    it(` > verify student centric view for - ${stuName}-should be disabled,before attempt2 start`, () => {
      lcb.clickOnStudentsTab()
      lcb.verifyStudentCentricCard(stuName, undefined, undefined, false)
    })

    it(` > verify question centric view, should not have student card, before attempt2 start`, () => {
      lcb.clickonQuestionsTab()
      Object.keys(allRight).forEach((queNum) => {
        lcb.questionResponsePage.selectQuestion(queNum)
        lcb.questionResponsePage.verifyNoQuestionResponseCard(stuName)
      })
    })

    // it(` > verify student centric view-${stuName},should be shown with attempt1`, () => {
    //   lcb.clickOnStudentsTab()
    //   lcb.verifyStudentCentricCard(
    //     stuName,
    //     attempt1.attempt,
    //     questionTypeMap,
    //     true
    //   )
    //   // verify scores of current attemp and no improvement
    //   lcb.questionResponsePage.verifyTotalScoreAndImprovement(
    //     attempt1.totalScore,
    //     attempt1.maxScore,
    //     false
    //   )
    // })

    // it(` > verify question centric view,should be shown with attempt reset`, () => {
    //   lcb.clickonQuestionsTab()
    //   _.keys(attempt1.attempt).forEach((queNum) => {
    //     lcb.questionResponsePage.selectQuestion(queNum)
    //     const { queKey, attemptData, points } = questionTypeMap[queNum]
    //     lcb.questionResponsePage.verifyQuestionResponseCard(
    //       points,
    //       queKey,
    //       noattempt[queNum],
    //       attemptData,
    //       false,
    //       stuName
    //     )
    //   })
    // })

    it(' > attempt by redirected students and verify skipped and wrong question', () => {
      cy.login('student', email, password)
      studentTestPage.assignmentPage.clickOnAssignmentButton()

      Object.keys(currentAttempt).forEach((queNum) => {
        const [queType] = questionTypeMap[queNum].queKey.split('.')
        const { attemptData } = questionTypeMap[queNum]
        cy.contains(queNum).should('be.visible')
        cy.contains(questionTypeMap[queNum].queKey).should('be.visible')
        // verify feedback
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

    it(` > verify card view after attempt2`, () => {
      cy.login('teacher', teacher, password)
      studentTestPage.clickOnExitTest()
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
      lcb.verifyStudentCard(
        stuName,
        studentSide.GRADED,
        attempt2.score,
        attempt2.perf,
        attempt2.attempt,
        email,
        true
      )
      lcb.verifyRedirectIcon(stuName)
    })

    /*
       TODO : commented below due to cypress limitation: https://github.com/cypress-io/cypress/issues/10#issuecomment-118114716
      [0, 1].forEach(i => {
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
      it(`> verify student card attempt view after attempt2,for attempt-${
        i ? 2 : 1
      }`, () => {
        const attempt = !i ? attempt2 : attempt1
        lcb.clickOnCardViewTab()
        // lcb.showMulipleAttemptsByStuName(stuName) --> commenting since by-default multi attempt view should come now
        lcb.verifyStudentScoreOnAttemptContainer(stuName, i, attempt.score)
        lcb.verifyStudentPerfOnAttemptContainer(stuName, i, attempt.perf)
        lcb.verifyAttemptNumberOnAttemptContainer(stuName, !i ? 2 : 1, i)
      })
    })

    it(` > verify student centric view after attempt2`, () => {
      studentTestPage.clickOnExitTest() // temp fix: issue-  if above test fails while attempting, navigation by direct url is blocked here
      cy.login('teacher', teacher, password)
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
      lcb.clickOnStudentsTab()

      // verify current attempt
      lcb.verifyStudentCentricCard(
        stuName,
        attempt2.attempt,
        questionTypeMap,
        true
      )
      // verify scores and improvement of current attempt
      lcb.questionResponsePage.verifyTotalScoreAndImprovement(
        attempt2.totalScore,
        attempt2.maxScore,
        attempt2.totalScore - attempt1.totalScore
      )

      // verify previous attempt
      lcb.questionResponsePage.selectAttempt(1)
      lcb.verifyStudentCentricCard(
        stuName,
        attempt1.attempt,
        questionTypeMap,
        true
      )
      // verify scores and improvement of previous attempt
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

  // TODO : add close date related redirect scenarios
  // TODO : add scenarios with non gradable question - question create module need to implemented for this
})
