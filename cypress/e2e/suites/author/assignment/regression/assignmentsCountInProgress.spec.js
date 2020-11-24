import TestLibrary from '../../../../framework/author/tests/testLibraryPage'
import TestAssignPage from '../../../../framework/author/tests/testDetail/testAssignPage'
import AssignmentsPage from '../../../../framework/student/assignmentsPage'
import AuthorAssignmentPage from '../../../../framework/author/assignments/AuthorAssignmentPage'
import FileHelper from '../../../../framework/util/fileHelper'
import StudentTestPage from '../../../../framework/student/studentTestPage'
import LiveClassboardPage from '../../../../framework/author/assignments/LiveClassboardPage'
import ExpressGraderPage from '../../../../framework/author/assignments/expressGraderPage'
import ReportsPage from '../../../../framework/student/reportsPage'
import {
  studentSide,
  teacherSide,
} from '../../../../framework/constants/assignmentStatus'
import TeacherManageClassPage from '../../../../framework/author/manageClassPage'
import Helpers from '../../../../framework/util/Helpers'
import { attemptTypes } from '../../../../framework/constants/questionTypes'
import SignupPage from '../../../../framework/common/signupPage'
import ManagePage from '../../../../framework/student/managePage'

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)}> add new students to 'in progress' assignment`, () => {
  const testLibraryPage = new TestLibrary()
  const assignmentsPage = new AssignmentsPage()
  const testAssignPage = new TestAssignPage()
  const authorAssignmentPage = new AuthorAssignmentPage()
  const studentTestPage = new StudentTestPage()
  const lcb = new LiveClassboardPage()
  const expressGrader = new ExpressGraderPage()
  const reportsPage = new ReportsPage()
  const teachermangeClass = new TeacherManageClassPage()
  const signupPage = new SignupPage()
  const studentManageClass = new ManagePage()

  const className = `Class-${Helpers.getRamdomString(6)}`
  const existingClass = 'existing class'
  const Teacher = 'tea.inprogress@snapwiz.com'
  let testId
  const existingClassCode = 'V2YPTOCB'

  const students = {
    stu1: {
      name: `S1${Helpers.getRamdomString(5).toLowerCase()}`,
      username: `s1${Helpers.getRamdomString(6).toLowerCase()}`,
      pass: 'snapwiz',
    },
    stu2: {
      name: `S2${Helpers.getRamdomString(5).toLowerCase()}`,
      username: `s2${Helpers.getRamdomString(6).toLowerCase()}`,
      pass: 'snapwiz',
    },
    stu3: {
      name: `S3${Helpers.getRamdomString(5).toLowerCase()}`,
      username: `s3${Helpers.getRamdomString(6).toLowerCase()}`,
      pass: 'snapwiz',
    },
  }
  const attemptData = {
    right: 'right',
  }
  const existingAssignedTests = [
    '5f93e41eab6ce80007a62cbb',
    '5f93e483d6df1f000833cf6b',
  ]

  const assignment1 = [
    existingAssignedTests[0],
    existingClass,
    1,
    1,
    false,
    teacherSide.IN_GRADING,
  ]
  const assignment2 = [
    existingAssignedTests[1],
    existingClass,
    0,
    1,
    false,
    teacherSide.DONE,
  ]

  let newClassCode
  let totalStudents = 0

  before('> login and create new items and test', () => {
    cy.login('teacher', Teacher)
    testLibraryPage.createTest().then((id) => {
      testId = id
    })
  })

  before('> create new class with one student', () => {
    const { name, pass, username } = students.stu1
    testLibraryPage.sidebar.clickOnManageClass()
    teachermangeClass.clickOnCreateClass()
    teachermangeClass.fillClassDetails(className)
    teachermangeClass.clickOnSaveClass()
    teachermangeClass.clickOnAddStudent()
    teachermangeClass.fillStudentDetails(username, name, pass)
    teachermangeClass.clickOnAddUserButton()

    testLibraryPage.sidebar.clickOnManageClass()
    teachermangeClass.getClassRowDetails(className).then(({ classCode }) => {
      newClassCode = classCode
      totalStudents++
    })
  })

  context(
    '> when new student is added from manage class,student should have entry in following',
    () => {
      /* 
    1. create a new class with one student and assign a test
    2. keep the test in progress,(other two will be there hard coded with existing class)
    3. add a new student from manage class,
    4. login as new student , verify assignment from #1
    5. attempt the test by new student and submit,verify grades page
    6. verify lcb for existing as well as new assignmnet, 
    (new student should not be part be part of existing assignmnets)
    7. verify submitted count/assignment status(should be in progress)
    8. verify lcb/eg/grades book for new student
   
     */
      before('> assign test', () => {
        cy.deleteAllAssignments('', Teacher, 'snapwiz', existingAssignedTests)
        testLibraryPage.assignPage.visitAssignPageById(testId)
        testAssignPage.selectClass(className)
        testAssignPage.clickOnAssign()

        testLibraryPage.sidebar.clickOnAssignment()
        authorAssignmentPage.clickOnLCBbyTestId(testId)
      })

      before('> add new student in manage class', () => {
        const { name, pass, username } = students.stu2
        testLibraryPage.sidebar.clickOnManageClass()
        teachermangeClass.clickOnClassRowByName(className)
        teachermangeClass.clickOnAddStudent()
        teachermangeClass.fillStudentDetails(username, name, pass)
        teachermangeClass.clickOnAddUserButton()
      })

      it('> login as new student and verify presence of assignment', () => {
        totalStudents++
        cy.login('student', students.stu2.username)
        assignmentsPage.getAssignmentButton().should('have.length', 1)
        assignmentsPage.sidebar.clickOnGrades(false)
      })

      it('> join another class by new student and verify', () => {
        /* student should not get assignmnets from this class, as all are in grading */
        assignmentsPage.sidebar.clickOnMyClasses()
        studentManageClass.clickonJoinClass()
        studentManageClass.clickonEnterClassCode()
        studentManageClass.typeClassCode(existingClassCode)
        studentManageClass.clickonJoinButton('VALID')

        assignmentsPage.sidebar.clickOnAssignment()
        assignmentsPage.getAssignmentButton().should('have.length', 1)
        assignmentsPage.sidebar.clickOnGrades(false)
      })

      it('> attempt by new student', () => {
        assignmentsPage.sidebar.clickOnAssignment()
        assignmentsPage.clickOnAssigmentByTestId(testId)
        studentTestPage.attemptQuestion(
          'MCQ_TF',
          attemptTypes.RIGHT,
          attemptData
        )

        studentTestPage.clickOnNext()
        studentTestPage.submitTest()
        reportsPage.getReviewButton().should('have.length', 1)
      })

      it('> verify submitted counts in assignments page', () => {
        cy.login('teacher', Teacher)
        testLibraryPage.sidebar.clickOnAssignment()
        authorAssignmentPage.verifyAssignmentRowByTestId(
          testId,
          className,
          1,
          totalStudents,
          false,
          teacherSide.IN_PROGRESS
        )
        authorAssignmentPage.verifyAssignmentRowByTestId(...assignment1)
        authorAssignmentPage.verifyAssignmentRowByTestId(...assignment2)
      })

      it('> verify submitted counts in lcb page ', () => {
        authorAssignmentPage.clickOnLCBbyTestId(testId)
        lcb.verifySubmittedCount(1, totalStudents)
        lcb.header.verifyAssignmentStatus(teacherSide.IN_PROGRESS)
        lcb.verifyStudentCardCount(totalStudents)
        lcb.verifyStudentStatusIsByIndex(1, studentSide.GRADED)
      })

      it('> verify student/question view for new student', () => {
        lcb.clickOnStudentsTab()
        lcb.questionResponsePage.selectStudent(students.stu2.name)
        lcb.questionResponsePage.verifyTotalScoreAndImprovement(1, 1)

        lcb.clickonQuestionsTab()
        lcb.questionResponsePage
          .getQuestionContainerByStudent(students.stu2.name)
          .should('be.visible')
      })

      it('> verify express grader view for new student', () => {
        lcb.header.clickOnExpressGraderTab()
        expressGrader
          .getGridRowByStudent(students.stu2.name)
          .should('be.visible')
        expressGrader.verifyScoreAndPerformance('1/1', 100)
      })

      it('> verify grade book for new student', () => {
        testLibraryPage.sidebar.clickOnGradeBook()
        cy.contains('a', students.stu2.name, { timeout: 120000 })
          .should('exist')
          .click({ force: true })
        cy.contains('div', 'Default Test Automation').should('be.visible')
      })
    }
  )

  context(
    '> when new student is signed up to class,student should have entry in following',
    () => {
      /* 
    1. create a new class with one student and assign a test
    2. keep the test in progress,(other two will be there hard coded with existing class)
    3. sign up as new student for class in #1
    4. verify assignments from #1 and submit, verify grades page
    5. verify assignmnets page for existing as well as new assignmnet
       (new student should not be part be part of existing assignmnets)
    6. verify submitted count/assignment status for the test in #2(should be in progress now)
    7. verify lcb/eg/grades book for new student
     */
      before('> assign test', () => {
        cy.deleteAllAssignments('', Teacher, 'snapwiz', existingAssignedTests)
        testLibraryPage.assignPage.visitAssignPageById(testId)
        testAssignPage.selectClass(className)
        testAssignPage.clickOnAssign()

        testLibraryPage.sidebar.clickOnAssignment()
        authorAssignmentPage.clickOnLCBbyTestId(testId)
      })

      before('> sign up as new student class', () => {
        const { name, pass, username } = students.stu3
        cy.clearToken()
        cy.visit('/login')
        signupPage.clickOnSignupLink()
        signupPage.clickOnStudent()
        signupPage.fillStudentSignupForm(newClassCode, name, username, pass)
      })

      it('> verify presence of assignment, for signed up student', () => {
        totalStudents++
        cy.login('student', students.stu3.username)
        assignmentsPage.getAssignmentButton().should('have.length', 1)
        assignmentsPage.sidebar.clickOnGrades(false)
      })

      it('> attempt by new student', () => {
        assignmentsPage.sidebar.clickOnAssignment()
        assignmentsPage.clickOnAssigmentByTestId(testId)
        studentTestPage.attemptQuestion(
          'MCQ_TF',
          attemptTypes.RIGHT,
          attemptData
        )

        studentTestPage.clickOnNext()
        studentTestPage.submitTest()
        reportsPage.getReviewButton().should('have.length', 1)
      })

      it('> add student to one existing class', () => {
        /* student should not get assignmnets from this class, as all are in grading */
        cy.login('teacher', Teacher)
        const { username } = students.stu3
        testLibraryPage.sidebar.clickOnManageClass()
        teachermangeClass.clickOnClassRowByName(existingClass)
        teachermangeClass.clickOnAddStudents()
        teachermangeClass.clickOnAddMultipleTab()
        teachermangeClass.searchStudentAndAdd(username)
      })

      it('> verify submitted counts in assignments page', () => {
        testLibraryPage.sidebar.clickOnAssignment()
        authorAssignmentPage.verifyAssignmentRowByTestId(
          testId,
          className,
          1,
          totalStudents,
          false,
          teacherSide.IN_PROGRESS
        )
        authorAssignmentPage.verifyAssignmentRowByTestId(...assignment1)
        authorAssignmentPage.verifyAssignmentRowByTestId(...assignment2)
      })

      it('> verify lcb card view for new student', () => {
        authorAssignmentPage.clickOnLCBbyTestId(testId)
        lcb.verifySubmittedCount(1, totalStudents)
        lcb.header.verifyAssignmentStatus(teacherSide.IN_PROGRESS)
        lcb.getAllStudentStatus().should('have.length', totalStudents)
      })

      it('> verify student/question view for new student', () => {
        lcb.clickOnStudentsTab()
        lcb.questionResponsePage.selectStudent(students.stu3.name)
        lcb.questionResponsePage.verifyTotalScoreAndImprovement(1, 1)

        lcb.clickonQuestionsTab()
        lcb.questionResponsePage
          .getQuestionContainerByStudent(students.stu3.name)
          .should('be.visible')
      })

      it('> verify express grader view for new student', () => {
        lcb.header.clickOnExpressGraderTab()
        expressGrader
          .getGridRowByStudent(students.stu3.name)
          .should('be.visible')
        expressGrader.verifyScoreAndPerformance('1/1', 100)
      })

      it('> verify grade book for new student', () => {
        testLibraryPage.sidebar.clickOnGradeBook()
        cy.contains('a', students.stu3.name, { timeout: 120000 })
          .should('exist')
          .click({ force: true })
        cy.contains('div', 'Default Test Automation').should('be.visible')
      })
    }
  )

  context(
    '> when student removed from manage class,student should have entry in following',
    () => {
      /* 
    1. create a new class with one student and assign a test
    2. keep the test in progress,(other two will be there hard coded with existing class)
    3. remove a student for class in #1
    4. verify assignments from #1 and submit, verify grades page
    5. verify submitted count/assignment status for the test in #2
    6. verify lcb/eg/grades book for removed student, he should have entry in all
     */
      before('> assign test', () => {
        cy.deleteAllAssignments('', Teacher, 'snapwiz', existingAssignedTests)
        cy.login('teacher', Teacher)
        testLibraryPage.assignPage.visitAssignPageById(testId)
        testAssignPage.selectClass(className)
        testAssignPage.clickOnAssign()

        testLibraryPage.sidebar.clickOnAssignment()
        authorAssignmentPage.clickOnLCBbyTestId(testId)
        lcb.selectCheckBoxByStudentName(students.stu1.name)
        lcb.clickOnMarkAsSubmit()
        lcb.clickonQuestionsTab()
        lcb.questionResponsePage.updateScoreAndFeedbackForStudent(
          students.stu1.name,
          1
        )
      })

      before('> remove one student from manage class', () => {
        testLibraryPage.sidebar.clickOnManageClass()
        teachermangeClass.clickOnClassRowByName(className)
        teachermangeClass.selectStudentsAndRemove(students.stu1.username)
      })

      it('> verify assignments page', () => {
        testLibraryPage.sidebar.clickOnAssignment()
        authorAssignmentPage.verifyAssignmentRowByTestId(
          testId,
          className,
          1,
          totalStudents,
          false,
          teacherSide.IN_PROGRESS
        )
      })

      it('> verify lcb card view for removed student', () => {
        authorAssignmentPage.clickOnLCBbyTestId(testId)
        lcb.verifySubmittedCount(1, totalStudents)
        lcb.verifyStudentStatusIsByIndex(0, studentSide.GRADED)
        lcb.verifyStudentCardCount(totalStudents)

        lcb.disableShowActiveStudents()
        lcb.verifyStudentCardCount(totalStudents)
      })

      it('> verify express grader view for removed student', () => {
        lcb.header.clickOnExpressGraderTab()
        expressGrader
          .getGridRowByStudent(students.stu1.name)
          .should('be.visible')
        expressGrader.verifyScoreAndPerformance('1/1', 100)
      })

      it('> verify grade book for removed student, student should have entry', () => {
        testLibraryPage.sidebar.clickOnGradeBook()
        cy.contains('a', students.stu1.name, { timeout: 120000 })
          .should('exist')
          .click({ force: true })
        cy.contains('div', 'Default Test Automation').should('be.visible')
      })

      it('> verify grades page removed student', () => {
        cy.login('student', students.stu1.username)
        assignmentsPage.verifyNoAssignments()
        assignmentsPage.sidebar.clickOnGrades()
        reportsPage.verifyStatusIs(studentSide.GRADED)
      })
    }
  )
})
