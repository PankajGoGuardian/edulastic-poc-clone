import AuthorAssignmentPage from '../../../../framework/author/assignments/AuthorAssignmentPage'
import ExpressGraderPage from '../../../../framework/author/assignments/expressGraderPage'
import LiveClassboardPage from '../../../../framework/author/assignments/LiveClassboardPage'
import TeacherSideBar from '../../../../framework/author/SideBarPage'
import TestLibrary from '../../../../framework/author/tests/testLibraryPage'
import {
  studentSide,
  teacherSide,
} from '../../../../framework/constants/assignmentStatus'
import { attemptTypes } from '../../../../framework/constants/questionTypes'
import SidebarPage from '../../../../framework/student/sidebarPage'
import StudentTestPage from '../../../../framework/student/studentTestPage'
import CypressHelper from '../../../../framework/util/cypressHelpers'
import FileHelper from '../../../../framework/util/fileHelper'

const { _ } = Cypress

const students = {
  1: {
    email: 'eg.student01@automation.com',
    stuName: '1st, Student01',
  },
  2: {
    email: 'eg.student02@automation.com',
    stuName: '2nd, Student02',
  },
  3: {
    email: 'eg.student03@automation.com',
    stuName: '3rd, Student03',
  },
  4: {
    email: 'eg.student04@automation.com',
    stuName: '4th, Student04',
  },
  5: {
    email: 'eg.student05@automation.com',
    stuName: '5th, Student05',
  },
  6: {
    email: 'eg.student06@automation.com',
    stuName: '6th, Student06',
  },
}

const dueDate = new Date()
dueDate.setDate(dueDate.getDate() + 7)

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)} >> verify teacher express grader page`, () => {
  const egTestData = {
    className: 'EG Class',
    teacher: 'eg.teacher01@automation.com',
    student: students[1].email,
    assignmentName: 'New Assessment LCB',
    testId: '5f4fb014987a310008c44d47',
    status: teacherSide.IN_PROGRESS,
    dueDate,
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
        ...students[6],
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

  const { attemptsData, student, teacher, testId, className } = egTestData

  let questionData
  let testData
  const questionTypeMap = {}
  const statsMap = {}
  const queCentric = {}
  const submittedQueCentric = {}

  const allStudentList = attemptsData.map((item) => item.stuName)

  const submittedInprogressStudentList = attemptsData
    .filter(({ status }) => status !== studentSide.NOT_STARTED)
    .map((item) => item.stuName)

  const submittedStudentList = attemptsData
    .filter(({ status }) => status === studentSide.SUBMITTED)
    .map((item) => item.stuName)

  const test = new StudentTestPage()
  const lcb = new LiveClassboardPage()
  const authorAssignmentPage = new AuthorAssignmentPage()
  const expressg = new ExpressGraderPage()
  const testLibrary = new TestLibrary()
  const teacherSidebar = new TeacherSideBar()
  const studentSidebar = new SidebarPage()
  const queList = Object.keys(
    lcb.getQuestionCentricData(attemptsData, queCentric)
  )

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

  before('login as teacher and go to lcb', () => {
    cy.login('teacher', teacher)
    teacherSidebar.clickOnAssignment()
    authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
  })

  describe(' > verify express grader', () => {
    before('navigate to express grader', () => {
      lcb.header.clickOnExpressGraderTab()
    })

    context('default view', () => {
      it('verify score view is enabled', () => {
        expressg.verifyToggleSetToScore()
      })
    })

    context(' > verify scores', () => {
      before('Change toggle button to score view', () => {
        expressg.setToggleToScore()
      })
      submittedStudentList.forEach((studentName) => {
        // ["Student01"].forEach(studentName => {
        it(` > verify scores and color for student :: ${studentName}`, () => {
          const { attempt, score, perfValue } = statsMap[studentName]
          expressg.verifyScoreGrid(
            studentName,
            attempt,
            score,
            perfValue,
            questionTypeMap
          )
          expressg.verifyScoreGridColor(studentName, attempt, questionTypeMap) // assert color
        })
      })
    })

    context(' > verify question level data', () => {
      queList.forEach((queNum) => {
        // ["Q1"].forEach(queNum => {
        it(` > verify for :: ${queNum}`, () => {
          const attempt = submittedQueCentric[queNum]
          expressg.verifyQuestionLevelGrid(queNum, attempt, questionTypeMap)
        })
      })
    })

    context(' > verify Responses', () => {
      before('Change toggle button to Response view', () => {
        expressg.setToggleToResponse()
      })

      submittedStudentList.forEach((studentName) => {
        // ["Student01"].forEach(studentName => {
        it(` > verify response and color for student :: ${studentName}`, () => {
          // expressg.verifyScoreToggleButtonEnabled(false);
          const { attempt } = statsMap[studentName]
          expressg.verifyResponseGrid(attempt, questionTypeMap, studentName)
          expressg.verifyScoreGridColor(studentName, attempt, questionTypeMap) // assert color
        })
      })
    })

    context(' > verify student responses pop ups', () => {
      before('Change toggle button to score view', () => {
        expressg.setToggleToScore()
      })

      beforeEach(() => {
        expressg.clickOnExit()
      })

      after(() => {
        expressg.clickOnExit()
      })

      // submittedStudentList.forEach(studentName => {
      // navigating through all the students eats up excess time,hence currently doing for 1 student
      ;[students[1].stuName].forEach((studentName) => {
        it(` > navigate all quetions using button for student :: ${studentName}`, () => {
          const { attempt } = statsMap[studentName]
          expressg.verifyResponsesInGridStudentLevel(
            studentName,
            attempt,
            questionTypeMap,
            false
          )
        })

        it(` > navigate all que using keyboard key for student :: ${studentName}`, () => {
          const { attempt } = statsMap[studentName]
          expressg.verifyResponsesInGridStudentLevel(
            studentName,
            attempt,
            questionTypeMap,
            true
          )
        })
      })

      // queList.forEach(queNum => {
      // navigating through all the questions eats up excess time,hence currently doing for 1 question
      ;['Q1'].forEach((queNum) => {
        it(` > navigate all students using button for que :: ${queNum} `, () => {
          const attempt = submittedQueCentric[queNum]
          expressg.verifyResponsesInGridQuestionLevel(
            queNum,
            attempt,
            questionTypeMap,
            false
          )
        })

        it(` > navigate all students using keyboard key for que :: ${queNum} `, () => {
          const attempt = submittedQueCentric[queNum]
          expressg.verifyResponsesInGridQuestionLevel(
            queNum,
            attempt,
            questionTypeMap,
            true
          )
        })
      })
    })
  })

  describe('> verify present-reset toggle', () => {
    before('> navigate to lcb', () => {
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
    })

    it('enable the present from card view', () => {
      lcb.header.clickOnLCBTab()
      lcb.clickOnPresent()
    })

    it('verify names are masked on card view', () => {
      lcb.getAllStudentName().then((studentNames) => {
        expect(_.intersection(allStudentList, studentNames)).to.deep.eq([])
      })
    })

    it('verify names are masked on student view', () => {
      lcb.clickOnStudentsTab()
      lcb.questionResponsePage.getDropDownListAsArray().then((lists) => {
        expect(_.intersection(allStudentList, lists)).to.deep.eq([])
      })
    })

    it('verify names are masked on question view', () => {
      lcb.clickonQuestionsTab()
      submittedInprogressStudentList.forEach((studentName) => {
        lcb.questionResponsePage.verifyNoQuestionResponseCard(studentName)
      })
    })

    it('verify names are masked on express grader', () => {
      lcb.header.clickOnExpressGraderTab()
      expressg.getAllStudentNamesAsArray().then((studentName) => {
        expect(_.intersection(submittedStudentList, studentName)).to.deep.eq([])
      })
    })

    it('disable the present from expresser grader', () => {
      lcb.header.clickOnExpressGraderTab()
      expressg.clickOnResetSwitch()
      expressg.getAllStudentNamesAsArray().then((studentName) => {
        CypressHelper.checkObjectEquality(submittedStudentList, studentName)
      })
    })

    it('verify names are not masked on card view', () => {
      lcb.header.clickOnLCBTab()
      lcb.getAllStudentName().then((studentNames) => {
        CypressHelper.checkObjectEquality(allStudentList, studentNames)
      })
    })

    it('verify names are not masked on student view', () => {
      lcb.clickOnStudentsTab()
      lcb.questionResponsePage.getDropDownListAsArray().then((lists) => {
        CypressHelper.checkObjectEquality(allStudentList, lists)
      })
    })

    it('verify names are not masked on question view', () => {
      lcb.clickonQuestionsTab()
      submittedInprogressStudentList.forEach((studentName) => {
        lcb.questionResponsePage.verifyQuestionResponseCardExist(studentName)
      })
    })
  })

  describe(' > update response and score from express grader', () => {
    before('> navigate to lcb', () => {
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0)
    })

    before(() => {
      lcb.header.clickOnExpressGraderTab()
      expressg.clickOnResetSwitch()
      expressg.setToggleToResponse()
    })

    context(' > verify updating responses and color', () => {
      const { stuName: updatingResponseStudent } = students[6]

      context(' > update responses', () => {
        queList.forEach((queNum, i) => {
          it(` > update response of ${updatingResponseStudent} for :: ${queNum}`, () => {
            expressg.routeAPIs()
            expressg.clickOnExit()
            expressg.getGridRowByStudent(updatingResponseStudent)
            expressg.getScoreforQueNum(queNum).click({ force: true }) // force due to Q10
            // expressg.getEditResponseToggle().click(); // be default should be enabled as express grid is set to response
            expressg.waitForStudentData()
            expressg.updateResponse(
              questionTypeMap[queNum].queKey.split('.')[0],
              attemptTypes.RIGHT,
              questionTypeMap[queNum].attemptData,
              i == queList.length - 1
            )
            expressg.clickOnExit()
            expressg.verifyCellColorForQuestion(queNum, attemptTypes.RIGHT)
          })
        })
      })

      context(
        ` > verify at student centric view for ${updatingResponseStudent}`,
        () => {
          before(() => {
            lcb.header.clickOnLCBTab()
            lcb.clickOnStudentsTab()
            lcb.questionResponsePage.selectStudent(updatingResponseStudent)
          })

          queList.forEach((queNum, qIndex) => {
            it(` > verify for ${queNum}`, () => {
              const { queKey, attemptData, points } = questionTypeMap[queNum]
              lcb.questionResponsePage.verifyQuestionResponseCard(
                points,
                queKey,
                attemptTypes.RIGHT,
                attemptData,
                true,
                qIndex
              )
            })
          })
        }
      )
    })

    context(' > verify updating score and color', () => {
      before(() => {
        lcb.header.clickOnExpressGraderTab()
        expressg.setToggleToScore()
      })

      beforeEach(() => {
        expressg.clickOnExit()
      })

      queList.forEach((queNum) => {
        it(` > update the score for :: ${queNum}`, () => {
          // below will update the score for 1 student all question and then revert back to original score
          const { attempt } = statsMap[submittedStudentList[2]]
          expressg.verifyUpdateScore(
            submittedStudentList[2],
            queNum,
            '0.5',
            attempt[queNum]
          )
        })
      })
    })
  })
})
