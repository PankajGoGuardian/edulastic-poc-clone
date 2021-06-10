import FileHelper from '../../../../framework/util/fileHelper'
import TeacherSideBar from '../../../../framework/author/SideBarPage'
import TeacherManageClassPage from '../../../../framework/author/manageClassPage'
import TeacherDashBoardPage, {
  DEFAULT_CONTENT_BUNDLES,
} from '../../../../framework/author/teacherDashboardPage'
import Helpers from '../../../../framework/util/Helpers'
import TestLibrary from '../../../../framework/author/tests/testLibraryPage'

const sideBar = new TeacherSideBar()
const manageClass = new TeacherManageClassPage()
const dashboard = new TeacherDashBoardPage()
const testLibrary = new TestLibrary()
const {
  with_subject: contentBundlesWithSubject,
  with_search_string: contentBundlesWithString,
  others: otherContentBundles,
} = DEFAULT_CONTENT_BUNDLES
const contentBundles = [
  ...Cypress._.values(contentBundlesWithSubject),
  ...Cypress._.values(contentBundlesWithString),
  ...Cypress._.values(otherContentBundles),
]
const random = Helpers.getRamdomString()
const teacher = {
  email: 'teacher.1.teacherdashboard@snapwiz.com',
  password: 'snapwiz',
}
const student = {
  email: 'student.1.teacherdashboard@snapwiz.com',
  password: 'snapwiz',
}
const classDetail = {
  name: 'Automation Class - teacherDashboard',
  grades: 'K',
  subject: 'Mathematics',
  students: 4,
  assignments: 1,
  assignmentTitle: 'Default Test Automation',
  asgnStatus: 'IN PROGRESS',
}
const create = {
  className: `smoke create new class-${random}`,
  grade: 'Grade 10',
  subject: 'Mathematics',
  standardSet: 'Math - Common Core',
}
describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Dashboard`, () => {
  before(() => {
    cy.clearToken()
    cy.deleteAllAssignments(student.email, teacher.email, teacher.password)
    cy.login('teacher', teacher.email, teacher.password)
  })
  it('> verify existing CLASS details', () => {
    dashboard.verifyClassDetail(
      classDetail.name,
      classDetail.grades,
      classDetail.subject,
      classDetail.students
    )
  })
  it('> verify google meet launcher is visible', () => {
    dashboard.clickOnLaunchGoogleMeet()
    dashboard.verifyLauncherPopupIsShown()
    dashboard
      .getClassListOnMeet()
      .then((classes) =>
        expect(classes, 'verify class list is shown').to.include(
          classDetail.name
        )
      )
  })
  it('> create new class and verify new class details on dashboard', () => {
    const { className, grade, subject, standardSet } = create
    const name = `smokeaddstudent ${random}`
    const username = Helpers.getRamdomEmail()
    sideBar.clickOnManageClass()
    manageClass.clickOnCreateClass()
    manageClass.fillClassDetails(
      className,
      undefined,
      undefined,
      grade,
      subject,
      standardSet
    )
    manageClass.clickOnSaveClass()
    sideBar.clickOnManageClass()
    manageClass.getClassDetailsByName(className)
    manageClass.clickOnAddStudent()
    manageClass.fillStudentDetails(username, name, teacher.password)
    manageClass.clickOnAddUserButton().then(() => {
      sideBar.clickOnDashboard()
      dashboard.verifyClassDetail(className, '10', subject, 1, 0)
    })
  })
  it('> verify recent assignment details on dashboard', () => {
    // remove old assignment if any
    cy.deleteAllAssignments(student.email, teacher.email, teacher.password)
    // create and assigne new assignment
    testLibrary.createTest().then(() => {
      testLibrary.clickOnAssign()
      testLibrary.assignPage.selectClass(classDetail.name)
      testLibrary.assignPage.clickOnAssign()
    })
    cy.login('teacher', teacher.email, teacher.password)
    dashboard.verifyClassDetail(
      classDetail.name,
      classDetail.grades,
      classDetail.subject,
      classDetail.students,
      classDetail.assignments,
      classDetail.assignmentTitle,
      classDetail.asgnStatus
    )
  })
  it('> verify dashboard after removing assignment', () => {
    // remove old assignment if any
    cy.deleteAllAssignments(student.email, teacher.email, teacher.password)
    cy.login('teacher', teacher.email, teacher.password)
    dashboard.verifyClassDetail(
      classDetail.name,
      classDetail.grades,
      classDetail.subject,
      classDetail.students
    )
  })
  it("> navigation to manage class by using 'Manage Class' button", () => {
    cy.login('teacher', teacher.email, teacher.password)
    dashboard.clickOnManageClass()
    cy.url().should(
      'contain',
      'author/manageClass',
      'verify after clicking on manage class url is updated'
    )
  })
  it('> verify default Featured Content Bundles', () => {
    cy.login('teacher', teacher.email, teacher.password)
    sideBar.clickOnDashboard()
    contentBundles.forEach((value) => {
      dashboard.getContentBundle(value.description).should('be.visible')
    })
  })
})
