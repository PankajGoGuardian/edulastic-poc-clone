import TestLibrary from '../../../../framework/author/tests/testLibraryPage'
import TestAssignPage from '../../../../framework/author/tests/testDetail/testAssignPage'
import AssignmentsPage from '../../../../framework/student/assignmentsPage'
import AuthorAssignmentPage from '../../../../framework/author/assignments/AuthorAssignmentPage'
import FileHelper from '../../../../framework/util/fileHelper'
import StudentTestPage from '../../../../framework/student/studentTestPage'
import LiveClassboardPage from '../../../../framework/author/assignments/LiveClassboardPage'
import ExpressGraderPage from '../../../../framework/author/assignments/expressGraderPage'
import ReportsPage from '../../../../framework/student/reportsPage'
import { teacherSide } from '../../../../framework/constants/assignmentStatus'
import TeacherManageClassPage from '../../../../framework/author/manageClassPage'
import Helpers from '../../../../framework/util/Helpers'
import { attemptTypes } from '../../../../framework/constants/questionTypes'
import SignupPage from '../../../../framework/common/signupPage'
import ManagePage from '../../../../framework/student/managePage'

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)}> add new students to 'in grading' assignment`, () => {
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
  const Teacher = 'tea.ingrading@snapwiz.com'
  const testId = '5f909a4ceecd08000894a005'
  const existingClassCode = 'V2ILTME2'

  const students = {
    stu1: {
      name: `S1${Helpers.getRamdomString(5).toLowerCase()}`,
      email: `s1${Helpers.getRamdomEmail()}`,
      pass: 'snapwiz',
    },
    stu2: {
      name: `S2${Helpers.getRamdomString(5).toLowerCase()}`,
      email: `s2${Helpers.getRamdomEmail()}`,
      pass: 'snapwiz',
    },
    stu3: {
      name: `S3${Helpers.getRamdomString(5).toLowerCase()}`,
      email: `s3${Helpers.getRamdomEmail()}`,
      pass: 'snapwiz',
    },
  }
  const attemptData = {
    right: 'right',
  }
  const existingAssignments = [
    '5f9144fa060fca0008ac84d1',
    '5f91458e00edb70008d379c6',
  ]

  const assignment1 = [
    existingAssignments[0],
    existingClass,
    1,
    1,
    false,
    teacherSide.IN_GRADING,
  ]
  const assignment2 = [
    existingAssignments[1],
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
    /*  testLibraryPage.createTest().then((id) => {
      testId = id
    }) */
  })

  before('> create new class with one student', () => {
    const { name, pass, email } = students.stu1
    testLibraryPage.sidebar.clickOnManageClass()
    teachermangeClass.clickOnCreateClass()
    teachermangeClass.fillClassDetails(className)
    teachermangeClass.clickOnSaveClass()
    teachermangeClass.clickOnAddStudent()
    teachermangeClass.fillStudentDetails(email, name, pass)
    teachermangeClass.clickOnAddUserButton()

    testLibraryPage.sidebar.clickOnManageClass()
    teachermangeClass.getClassRowDetails(className).then(({ classCode }) => {
      newClassCode = classCode
      totalStudents++
    })
  })

  context('> when new student is added from manage class', () => {
    /* 
    1. create a new class with one student and assign a test
    2. keep the test in grading,(other two will be there hard coded with existing class)
    3. add a new student from manage class, also add to a existing class()
    4. login as new student , verify no assignmnets for him
    5. verify lcb for existing as well as new assignmnet
    6. add that new student to assignment, and 
    7. verify submitted count/assignment status(should be in progress now)
    8. attempt the test by new student
    9. verify grades page
    10. verify lcb/eg/grades book for new student
     */
    before('> assign test', () => {
      cy.deleteAllAssignments('', Teacher, 'snapwiz', existingAssignments)
      testLibraryPage.assignPage.visitAssignPageById(testId)
      testAssignPage.selectClass(className)
      testAssignPage.clickOnAssign()

      testLibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.clickOnLCBbyTestId(testId)
      lcb.checkSelectAllCheckboxOfStudent()
      lcb.clickOnMarkAsSubmit()
    })

    before('> add new student in manage class', () => {
      const { name, pass, email } = students.stu2
      testLibraryPage.sidebar.clickOnManageClass()
      teachermangeClass.clickOnClassRowByName(className)
      teachermangeClass.clickOnAddStudent()
      teachermangeClass.fillStudentDetails(email, name, pass)
      teachermangeClass.clickOnAddUserButton()
    })

    it('> add student to one existing class', () => {
      const { email } = students.stu2
      testLibraryPage.sidebar.clickOnManageClass()
      teachermangeClass.clickOnClassRowByName(existingClass)
      teachermangeClass.clickOnAddStudents()
      teachermangeClass.clickOnAddMultipleTab()
      teachermangeClass.searchStudentAndAdd(email)
    })

    it('> login as new student and verify no assignments', () => {
      cy.login('student', students.stu2.email)
      cy.contains(
        `You don't have any currently assigned or completed assignments.`
      )
      assignmentsPage.sidebar.clickOnGrades(false)
    })

    it('> verify submitted counts in assignments page', () => {
      cy.login('teacher', Teacher)
      testLibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.verifyAssignmentRowByTestId(
        testId,
        className,
        totalStudents,
        totalStudents,
        false,
        teacherSide.IN_GRADING
      )
      authorAssignmentPage.verifyAssignmentRowByTestId(...assignment1)
      authorAssignmentPage.verifyAssignmentRowByTestId(...assignment2)
    })

    it('> verify submitted counts in lcb page ', () => {
      authorAssignmentPage.clickOnLCBbyTestId(testId)
      lcb.verifySubmittedCount(totalStudents, totalStudents)
      lcb.header.verifyAssignmentStatus(teacherSide.IN_GRADING)
      lcb.getAllStudentStatus().should('have.length', totalStudents)
    })

    it('> add the new student to assignment', () => {
      totalStudents++
      lcb.addOneStudent(students.stu2.email)
      lcb.header.clickOnExpressGraderTab()

      lcb.header.clickOnLCBTab()
      lcb.getAllStudentStatus().should('have.length', totalStudents)
      lcb.verifySubmittedCount(totalStudents - 1, totalStudents)
      lcb.header.verifyAssignmentStatus(teacherSide.IN_PROGRESS)
    })

    it('> attempt by new student', () => {
      cy.login('student', students.stu2.email)
      assignmentsPage.getAssignmentButton().should('have.length', 1)
      assignmentsPage.sidebar.clickOnGrades(false)

      assignmentsPage.sidebar.clickOnAssignment()
      assignmentsPage.clickOnAssigmentByTestId(testId)
      studentTestPage.attemptQuestion('MCQ_TF', attemptTypes.RIGHT, attemptData)

      studentTestPage.clickOnNext()
      studentTestPage.submitTest()
      reportsPage.getReviewButton().should('have.length', 1)
    })

    it('> verify teacher assignmnets page', () => {
      cy.login('teacher', Teacher)
      testLibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.verifyAssignmentRowByTestId(
        testId,
        className,
        totalStudents,
        totalStudents,
        false,
        teacherSide.IN_GRADING
      )
      authorAssignmentPage.verifyAssignmentRowByTestId(...assignment1)
      authorAssignmentPage.verifyAssignmentRowByTestId(...assignment2)
    })

    it('> verify lcb card view for new student', () => {
      authorAssignmentPage.clickOnLCBbyTestId(testId)
      lcb.verifySubmittedCount(totalStudents, totalStudents)
      lcb.header.verifyAssignmentStatus(teacherSide.IN_GRADING)
      lcb.getAllStudentStatus().should('have.length', totalStudents)
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
      expressGrader.getGridRowByStudent(students.stu2.name).should('be.visible')
      expressGrader.verifyScoreAndPerformance('1/1', 100)
    })

    it('> verify grade book for new student', () => {
      testLibraryPage.sidebar.clickOnGradeBook()
      cy.contains('a', students.stu2.name, { timeout: 120000 })
        .should('exist')
        .click({ force: true })
      cy.contains('div', 'Default Test Automation').should('be.visible')
    })
  })

  context('> when new student is signed up to class', () => {
    /* 
    1. create a new class with one student and assign a test
    2. keep the test in grading,(other two will be there hard coded with existing class)
    3. sign up as new student for class in #1
    4. verify no assignmnets for him
    5. verify lcb for existing as well as new assignmnet
    6. add that new student to assignment, as well as to the existing class 
    7. verify submitted count/assignment status for the test in #2(should be in progress now)
    8. attempt the test by new student
    9. verify grades page
    10. verify lcb/eg/grades book for new student
     */
    before('> assign test', () => {
      cy.deleteAllAssignments('', Teacher, 'snapwiz', existingAssignments)
      testLibraryPage.assignPage.visitAssignPageById(testId)
      testAssignPage.selectClass(className)
      testAssignPage.clickOnAssign()

      testLibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.clickOnLCBbyTestId(testId)
      lcb.checkSelectAllCheckboxOfStudent()
      lcb.clickOnMarkAsSubmit()
    })

    before('> sign up as new student class', () => {
      const { name, pass, email } = students.stu3
      cy.clearToken()
      cy.visit('/login')
      signupPage.clickOnSignupLink()
      signupPage.clickOnStudent()
      signupPage.fillStudentSignupForm(newClassCode, name, email, pass)
    })

    it('> verify no assignments, for signed up student', () => {
      cy.contains(
        `You don't have any currently assigned or completed assignments.`,
        { timeout: 120000 }
      )
      assignmentsPage.sidebar.clickOnGrades(false)
    })

    it('> verify submitted counts in assignments page', () => {
      cy.login('teacher', Teacher)
      testLibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.verifyAssignmentRowByTestId(
        testId,
        className,
        totalStudents,
        totalStudents,
        false,
        teacherSide.IN_GRADING
      )
      authorAssignmentPage.verifyAssignmentRowByTestId(...assignment1)
      authorAssignmentPage.verifyAssignmentRowByTestId(...assignment2)
    })

    it('> verify submitted counts in lcb page ', () => {
      authorAssignmentPage.clickOnLCBbyTestId(testId)
      lcb.verifySubmittedCount(totalStudents, totalStudents)
      lcb.header.verifyAssignmentStatus(teacherSide.IN_GRADING)
      lcb.getAllStudentStatus().should('have.length', totalStudents)
    })

    it('> add the new student to assignment', () => {
      totalStudents++
      lcb.addOneStudent(students.stu3.email)
      lcb.header.clickOnExpressGraderTab()

      lcb.header.clickOnLCBTab()
      lcb.getAllStudentStatus().should('have.length', totalStudents)
      lcb.verifySubmittedCount(totalStudents - 1, totalStudents)
      lcb.header.verifyAssignmentStatus(teacherSide.IN_PROGRESS)
    })

    it('> attempt by new student', () => {
      cy.login('student', students.stu3.email)
      assignmentsPage.sidebar.clickOnGrades(false)
      assignmentsPage.sidebar.clickOnAssignment()
      assignmentsPage.clickOnAssigmentByTestId(testId)

      studentTestPage.attemptQuestion('MCQ_TF', attemptTypes.RIGHT, attemptData)
      studentTestPage.clickOnNext()
      studentTestPage.submitTest()
      reportsPage.getReviewButton().should('have.length', 1)
    })

    it('> join another class by new student and verify', () => {
      assignmentsPage.sidebar.clickOnMyClasses()
      studentManageClass.clickonJoinClass()
      studentManageClass.clickonEnterClassCode()
      studentManageClass.typeClassCode(existingClassCode)
      studentManageClass.clickonJoinButton('VALID')

      assignmentsPage.sidebar.clickOnAssignment()
      cy.contains(
        `You don't have any currently assigned or completed assignments.`,
        { timeout: 120000 }
      )
      assignmentsPage.sidebar.clickOnGrades()
      reportsPage.getReviewButton().should('have.length', 1)
    })

    it('> verify teacher assignmnets page', () => {
      cy.login('teacher', Teacher)
      testLibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.verifyAssignmentRowByTestId(
        testId,
        className,
        totalStudents,
        totalStudents,
        false,
        teacherSide.IN_GRADING
      )
      authorAssignmentPage.verifyAssignmentRowByTestId(...assignment1)
      authorAssignmentPage.verifyAssignmentRowByTestId(...assignment2)
    })

    it('> verify lcb card view for new student', () => {
      authorAssignmentPage.clickOnLCBbyTestId(testId)
      lcb.verifySubmittedCount(3, 3)
      lcb.header.verifyAssignmentStatus(teacherSide.IN_GRADING)
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
      expressGrader.getGridRowByStudent(students.stu3.name).should('be.visible')
      expressGrader.verifyScoreAndPerformance('1/1', 100)
    })

    it('> verify grade book for new student', () => {
      testLibraryPage.sidebar.clickOnGradeBook()
      cy.contains('a', students.stu3.name, { timeout: 120000 })
        .should('exist')
        .click({ force: true })
      cy.contains('div', 'Default Test Automation').should('be.visible')
    })
  })
})
