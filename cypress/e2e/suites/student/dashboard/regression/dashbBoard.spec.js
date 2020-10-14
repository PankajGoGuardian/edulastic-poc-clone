import AssignmentsPage from '../../../../framework/student/assignmentsPage'
import FileHelper from '../../../../framework/util/fileHelper'
//teacherAuto@snapwiz.com
describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)} >> Test Assignment Page`, () => {
  const assignmentPage = new AssignmentsPage()
  const student = { email: 'newstud@automation.com', password: 'automation' }
  before(() => {
    cy.clearToken()
    cy.login('student', student.email, student.password)
  })

  context(' >Active assignments in all classes', () => {
    before('All class', () => {
      assignmentPage.getclass('All classes')
    })

    it(' >TC01 All Assignments', () => {
      assignmentPage.getAllAssignments().click({ force: true })
      assignmentPage.verifyAssignmentCount('ALL')
    })

    it(' >TC02 Verify assignments in Not Started', () => {
      assignmentPage.getNotStarted().click({ force: true })
      assignmentPage.verifyAssignmentCount('NOT_STARTED')
    })

    it(' >TC03 Verify assignments In Progress', () => {
      assignmentPage.getInProgress().click({ force: true })
      assignmentPage.verifyAssignmentCount('IN_PROGRESS')
    })
  })

  context(' > Active assignments in New_Automation_class', () => {
    before('New_Automation_class', () => {
      assignmentPage.getclass('New_Automation_class')
    })

    it(' >TC01 Verify ALL assignments', () => {
      assignmentPage.getAllAssignments().click({ force: true })
      assignmentPage.verifyAssignmentCount('ALL')
    })

    it(' >TC02 Verify assignments in Not Started', () => {
      assignmentPage.getNotStarted().click({ force: true })
      assignmentPage.verifyAssignmentCount('NOT_STARTED')
    })

    it(' >TC03 Verify assignments In Progress', () => {
      assignmentPage.getInProgress().click({ force: true })
      assignmentPage.verifyAssignmentCount('IN_PROGRESS')
    })
  })
  context(' > Active assignments in New_automation_Class2', () => {
    before('New_automation_Class2', () => {
      assignmentPage.getclass('New_automation_Class2')
    })

    it(' >TC01 Verify ALL assignments', () => {
      assignmentPage.getAllAssignments().click({ force: true })
      assignmentPage.verifyAssignmentCount('ALL')
    })

    it(' >TC02 Verify assignments in Not Started', () => {
      assignmentPage.getNotStarted().click({ force: true })
      assignmentPage.verifyAssignmentCount('NOT_STARTED')
    })

    it(' >TC03 Verify assignments In Progress', () => {
      assignmentPage.getInProgress().click({ force: true })
      assignmentPage.verifyAssignmentCount('IN_PROGRESS')
    })
  })
})
