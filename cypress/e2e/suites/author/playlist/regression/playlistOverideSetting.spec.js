import PlayListLibrary from '../../../../framework/author/playlist/playListLibrary'
import FileHelper from '../../../../framework/util/fileHelper'
import TestLibrary from '../../../../framework/author/tests/testLibraryPage'
import StudentTestPage from '../../../../framework/student/studentTestPage'
import AssignmentsPage from '../../../../framework/student/assignmentsPage'
import {
  CALCULATOR,
  attemptTypes,
  questionTypeKey,
} from '../../../../framework/constants/questionTypes'
import AuthorAssignmentPage from '../../../../framework/author/assignments/AuthorAssignmentPage'
import LiveClassboardPage from '../../../../framework/author/assignments/LiveClassboardPage'
import ReportsPage from '../../../../framework/student/reportsPage'
import {
  releaseGradeTypesDropDown as release,
  releaseGradeTypes,
} from '../../../../framework/constants/assignmentStatus'

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)}>> playlist overide settings`, () => {
  const playlistlibraryPage = new PlayListLibrary()
  const testlibraryPage = new TestLibrary()
  const studentTestPage = new StudentTestPage()
  const assignmentsPage = new AssignmentsPage()
  const authorAssignmentPage = new AuthorAssignmentPage()
  const lcb = new LiveClassboardPage()
  const reportsPage = new ReportsPage()

  const checkAnsAttempts = 2
  const staticPass = ['123456', 'abcdefg']
  const testToCreate = ['search_1', 'search_2']
  const testIds = []
  const dynamicPassword = []
  const playListData = {
    metadata: {
      name: 'Play List',
      grade: 'Grade 10',
      subject: 'Social Studies',
    },
    moduledata: {},
  }
  const student = {
    email: 'student.playlistsetting@snapwiz.com',
    pass: 'snapwiz',
  }
  const attemptData = {
    right: 'True',
    wrong: 'False',
  }
  const teacher = {
    email: 'teacher.playlistsetting@snapwiz.com',
    pass: 'snapwiz',
  }
  const testid = '5f46123bc128900008911af3'
  before('create test', () => {
    cy.login('teacher', teacher.email, teacher.pass)
    ;[1, 2].forEach((test, i) => {
      testlibraryPage.searchAndClickTestCardById(testid)
      testlibraryPage.clickOnDuplicate()

      testlibraryPage.testSummary.setName(`test-${i + 1}`)
      testlibraryPage.header.clickOnSettings()

      if (i === 0)
        testlibraryPage.testSettings.clickOnCalculatorByType(CALCULATOR.BASIC)
      else testlibraryPage.testSettings.setCheckAnswer(3)

      testlibraryPage.testSettings.setRealeasePolicy(
        releaseGradeTypes.SCORE_ONLY
      )

      testlibraryPage.testSettings.clickOnPassword()
      testlibraryPage.testSettings.clickOnStaticPassword()

      if (i === 0)
        testlibraryPage.testSettings.enterStaticPassword(staticPass[0])
      else testlibraryPage.testSettings.enterStaticPassword(staticPass[1])

      testlibraryPage.header.clickOnPublishButton().then((id) => {
        testIds[i] = id
      })
    })
  })
  context('> overide setting and verify', () => {
    before('create play list', () => {
      cy.deleteAllAssignments('', teacher.email)
      playListData.moduledata.module1 = testIds
      cy.login('teacher', teacher.email, teacher.pass)
      playlistlibraryPage.createPlayListWithTests(playListData)
    })

    it('> click on assign whole module', () => {
      playlistlibraryPage.header.clickOnUseThis()
      playlistlibraryPage.reviewTab.clickOnAssignButtonByModule(1)
      playlistlibraryPage.playListAssign.selectClass('Class')
    })

    it('> over ride settings', () => {
      playlistlibraryPage.playListAssign.showOverRideSetting()

      playlistlibraryPage.playListAssign.clickOnCalculatorByType(
        CALCULATOR.NONE
      )
      playlistlibraryPage.playListAssign.setCheckAnsTries(checkAnsAttempts)

      playlistlibraryPage.playListAssign.clickDynamicPassword()
      playlistlibraryPage.playListAssign.setReleasePolicy(release.DONT_RELEASE)

      playlistlibraryPage.playListAssign.clickOnAssign()
    })

    it('> get dynamic password', () => {
      testlibraryPage.sidebar.clickOnAssignment()
      testIds.forEach((id, index) => {
        authorAssignmentPage.clickOnLCBbyTestId(id)
        lcb.header.clickOnOpen()
        lcb.copyPassword().then((pass) => {
          dynamicPassword.push(pass)
          lcb.closePassWord()
          cy.go('back')
        })
      })
    })

    testToCreate.forEach((name, index) => {
      context("> student side verification of 'overidden settings'", () => {
        before('login', () => {
          if (index === 0) cy.login('student', student.email, student.pass)
          else {
            studentTestPage.clickOnExitTest()
            assignmentsPage.sidebar.clickOnAssignment()
          }
        })

        it(`> password for test ${index + 1}`, () => {
          assignmentsPage.clickOnAssigmentByTestId(testIds[index], {
            pass: dynamicPassword[index],
          })
        })

        it(`> calculator for test ${index + 1}`, () => {
          studentTestPage.getExitButton()
          studentTestPage.assertCalcType(CALCULATOR.NONE)
        })

        it(`> check ans tries for test ${index + 1}`, () => {
          for (let i = 0; i <= checkAnsAttempts; i++) {
            studentTestPage.attemptQuestion(
              questionTypeKey.TRUE_FALSE,
              attemptTypes.WRONG,
              attemptData
            )
            if (i !== checkAnsAttempts) studentTestPage.clickOnCheckAns()
            else studentTestPage.clickOnCheckAns(true)
          }
        })

        it(`> release policy for test ${index + 1}`, () => {
          studentTestPage.clickOnNext()
          studentTestPage.submitTest()
          reportsPage.getStatus()
          assignmentsPage
            .getReviewButtonById(testIds[index])
            .should('not.exist')
          reportsPage.getScore().should('not.exist')
        })
      })
    })
  })
})
