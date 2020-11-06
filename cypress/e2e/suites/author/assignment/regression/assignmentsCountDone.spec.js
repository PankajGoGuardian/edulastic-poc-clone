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
)}> add new students to 'done' assignment`, () => {
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
  const Teacher = 'tea.done@snapwiz.com'
  const testId = '5f929ea7b4e21a0008f8c789'
  const existingClassCode = 'V2NUJB1P'

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
    '5f9187e496bfc40007e97773',
    '5f918787ce765c0008b90cd6',
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
    /*  testLibraryPage.createTest().then((id) => {
      testId = id
    }) */
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

  context('> when new student is added from manage class', () => {
    /* 
    1. create a new class with one student and assign a test
    2. keep the test in grading,(other two will be there hard coded with existing class)
    3. add a new student from manage class, also add to a existing class
    4. login as new student , verify no assignmnets for him
    5. verify lcb for existing as well as new assignmnet
    6. add that new student to assignment and 
    7. verify submitted count/assignment status(should be in progress now)
    8. attempt the test by new student
    9. verify grades page
    10. verify lcb/eg/grades book for new student
     */
    before('> assign test', () => {
      cy.deleteAllAssignments('', Teacher, 'snapwiz', existingAssignedTests)
      testLibraryPage.assignPage.visitAssignPageById(testId)
      testAssignPage.selectClass(className)
      testAssignPage.clickOnAssign()

      testLibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.clickOnLCBbyTestId(testId)
      lcb.checkSelectAllCheckboxOfStudent()
      lcb.clickOnMarkAsSubmit()
      testLibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.clickOnLCBbyTestId(testId)
      lcb.header.clickOnClose(true, false)
    })

    before('> add new student in manage class', () => {
      const { name, pass, username } = students.stu2
      testLibraryPage.sidebar.clickOnManageClass()
      teachermangeClass.clickOnClassRowByName(className)
      teachermangeClass.clickOnAddStudent()
      teachermangeClass.fillStudentDetails(username, name, pass)
      teachermangeClass.clickOnAddUserButton()
    })

    it('> login as new student and verify no assignments', () => {
      cy.login('student', students.stu2.username)
      cy.contains(
        `You don't have any currently assigned or completed assignments.`
      )
      assignmentsPage.sidebar.clickOnGrades(false)
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
        teacherSide.DONE
      )
      authorAssignmentPage.verifyAssignmentRowByTestId(...assignment1)
      authorAssignmentPage.verifyAssignmentRowByTestId(...assignment2)
    })

    it('> verify submitted counts in lcb page ', () => {
      authorAssignmentPage.clickOnLCBbyTestId(testId)
      lcb.verifySubmittedCount(totalStudents, totalStudents)
      lcb.header.verifyAssignmentStatus(teacherSide.DONE)
      lcb.getAllStudentStatus().should('have.length', totalStudents)
    })

    it('> add the new student to assignment', () => {
      totalStudents++
      lcb.addOneStudent(students.stu2.username)
      lcb.header.clickOnExpressGraderTab()

      lcb.header.clickOnLCBTab()
      lcb.getAllStudentStatus().should('have.length', totalStudents)
      lcb.verifySubmittedCount(totalStudents - 1, totalStudents)
      lcb.header.verifyAssignmentStatus(teacherSide.IN_PROGRESS)
    })

    it('> attempt by new student', () => {
      cy.login('student', students.stu2.username)
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
      cy.deleteAllAssignments('', Teacher, 'snapwiz', existingAssignedTests)
      testLibraryPage.assignPage.visitAssignPageById(testId)
      testAssignPage.selectClass(className)
      testAssignPage.clickOnAssign()

      testLibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.clickOnLCBbyTestId(testId)
      lcb.checkSelectAllCheckboxOfStudent()
      lcb.clickOnMarkAsSubmit()
      testLibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.clickOnLCBbyTestId(testId)
      lcb.header.clickOnClose(true, false)
    })

    before('> sign up as new student class', () => {
      const { name, pass, username } = students.stu3
      cy.clearToken()
      cy.visit('/login')
      signupPage.clickOnSignupLink()
      signupPage.clickOnStudent()
      signupPage.fillStudentSignupForm(newClassCode, name, username, pass)
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
        teacherSide.DONE
      )
      authorAssignmentPage.verifyAssignmentRowByTestId(...assignment1)
      authorAssignmentPage.verifyAssignmentRowByTestId(...assignment2)
    })

    it('> verify submitted counts in lcb page ', () => {
      authorAssignmentPage.clickOnLCBbyTestId(testId)
      lcb.verifySubmittedCount(totalStudents, totalStudents)
      lcb.header.verifyAssignmentStatus(teacherSide.DONE)
      lcb.getAllStudentStatus().should('have.length', totalStudents)
    })

    it('> add the new student to assignment', () => {
      totalStudents++
      lcb.addOneStudent(students.stu3.username)
      lcb.header.clickOnExpressGraderTab()

      lcb.header.clickOnLCBTab()
      lcb.getAllStudentStatus().should('have.length', totalStudents)
      lcb.verifySubmittedCount(totalStudents - 1, totalStudents)
      lcb.header.verifyAssignmentStatus(teacherSide.IN_PROGRESS)
    })

    it('> add student to one existing class', () => {
      const { username } = students.stu3
      testLibraryPage.sidebar.clickOnManageClass()
      teachermangeClass.clickOnClassRowByName(existingClass)
      teachermangeClass.clickOnAddStudents()
      teachermangeClass.clickOnAddMultipleTab()
      teachermangeClass.searchStudentAndAdd(username)
    })

    it('> attempt by new student', () => {
      cy.login('student', students.stu3.username)
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

  context('> when student removed from manage class', () => {
    before('> assign test', () => {
      cy.deleteAllAssignments('', Teacher, 'snapwiz', existingAssignedTests)
      cy.login('teacher', Teacher)
      testLibraryPage.assignPage.visitAssignPageById(testId)
      testAssignPage.selectClass(className)
      testAssignPage.clickOnAssign()

      testLibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.clickOnLCBbyTestId(testId)
      lcb.checkSelectAllCheckboxOfStudent()
      lcb.clickOnMarkAsSubmit()
      lcb.clickonQuestionsTab()
      lcb.questionResponsePage.updateScoreAndFeedbackForStudent(
        students.stu1.name,
        1
      )
      lcb.header.clickOnClose(true, false)
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
        totalStudents,
        totalStudents,
        false,
        teacherSide.DONE
      )
    })

    it('> verify lcb card view for removed student', () => {
      authorAssignmentPage.clickOnLCBbyTestId(testId)
      lcb.verifySubmittedCount(totalStudents, totalStudents)
      lcb.verifyStudentStatusIsByIndex(0, studentSide.GRADED)
      lcb.verifyStudentCardCount(totalStudents)
    })

    it('> verify express grader view for removed student', () => {
      lcb.header.clickOnExpressGraderTab()
      expressGrader.getGridRowByStudent(students.stu1.name).should('be.visible')
      expressGrader.verifyScoreAndPerformance('1/1', 100)
    })

    it('> verify grade book for removed student', () => {
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
  })
  context('> removing absent / graded students', () => {
    before('> assign test', () => {
      cy.deleteAllAssignments('', Teacher, 'snapwiz', existingAssignedTests)
      cy.login('teacher', Teacher)
      testLibraryPage.assignPage.visitAssignPageById(testId)
      testLibraryPage.assignPage.selectClass(className)
      testAssignPage.selectStudent([students.stu2.name, students.stu3.name])
      testAssignPage.clickOnAssign()

      testLibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.clickOnLCBbyTestId(testId)
      lcb.selectCheckBoxByStudentName(students.stu2.name)
      lcb.clickOnMarkAsSubmit()
      lcb.checkSelectAllCheckboxOfStudent()
      lcb.uncheckSelectAllCheckboxOfStudent()

      lcb.selectCheckBoxByStudentName(students.stu3.name)
      lcb.clickOnMarkAsAbsent()

      lcb.header.clickOnClose(true, false)
      testLibraryPage.sidebar.clickOnAssignment()
      authorAssignmentPage.clickOnLCBbyTestId(testId)
    })
    it('> try removing graded student, should not allow', () => {
      lcb.checkSelectAllCheckboxOfStudent()
      lcb.uncheckSelectAllCheckboxOfStudent()
      lcb.selectCheckBoxByStudentName(students.stu2.name)
      lcb.clickOnRemove(false)
      lcb.verifyStudentCardCount(2)
    })

    it('> try removing graded+absent student, should not allow', () => {
      lcb.checkSelectAllCheckboxOfStudent()
      lcb.uncheckSelectAllCheckboxOfStudent()
      lcb.selectCheckBoxByStudentName(students.stu2.name)
      lcb.selectCheckBoxByStudentName(students.stu3.name)
      lcb.clickOnRemove(false)
      lcb.verifyStudentCardCount(2)
    })
    it('> try removing absent student, should allow', () => {
      lcb.checkSelectAllCheckboxOfStudent()
      lcb.uncheckSelectAllCheckboxOfStudent()
      lcb.selectCheckBoxByStudentName(students.stu3.name)
      lcb.clickOnRemove()
      lcb.verifyStudentCardCount(1)
    })
    context('> add and remove the new student to assignment', () => {
      before('> add removed student back to class', () => {
        testLibraryPage.sidebar.clickOnManageClass()
        teachermangeClass.clickOnClassRowByName(className)
        teachermangeClass.clickOnAddStudents()
        teachermangeClass.clickOnAddMultipleTab()
        teachermangeClass.searchStudentAndAdd(students.stu1.username)
      })
      before('> add and remove student to assignmnets', () => {
        testLibraryPage.sidebar.clickOnAssignment()
        authorAssignmentPage.clickOnLCBbyTestId(testId)

        lcb.addOneStudent(students.stu1.username)
        lcb.header.clickOnExpressGraderTab()
        lcb.header.clickOnLCBTab()

        lcb.verifyStudentCardCount(totalStudents)
        lcb.checkSelectAllCheckboxOfStudent()
        lcb.uncheckSelectAllCheckboxOfStudent()

        lcb.selectCheckBoxByStudentName(students.stu1.name)
        lcb.clickOnRemove()
        lcb.verifySubmittedCount(1, 1)

        lcb.header.clickOnExpressGraderTab()
        lcb.header.clickOnLCBTab()
        lcb.header.verifyAssignmentStatus(teacherSide.IN_GRADING)
      })

      it('> verify lcb card view', () => {
        lcb.disableShowActiveStudents()
        lcb.verifyStudentCardCount(3)
        lcb.verifyStudentStatusIsByIndex(0, studentSide.UNASSIGNED)
      })

      it('> verify assignments page', () => {
        testLibraryPage.sidebar.clickOnAssignment()
        authorAssignmentPage.verifyAssignmentRowByTestId(
          testId,
          className,
          1,
          1,
          false,
          teacherSide.IN_GRADING
        )
      })

      it('> verify grade book for removed student, should not present', () => {
        testLibraryPage.sidebar.clickOnGradeBook()
        cy.contains('a', students.stu2.name, { timeout: 120000 }).should(
          'exist'
        )
        cy.contains('a', students.stu1.name, { timeout: 120000 }).should(
          'not.exist'
        )
      })

      it('> verify student assignmnets/grades page', () => {
        cy.login('student', students.stu1.username)
        assignmentsPage.verifyNoAssignments()
        assignmentsPage.sidebar.clickOnGrades(false)
      })
    })
  })
})
