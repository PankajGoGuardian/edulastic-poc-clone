import FileHelper from '../../../../framework/util/fileHelper'
import SignupPage from '../../../../framework/common/signupPage'
import LoginPage from '../../../../framework/student/loginPage'
import Helpers from '../../../../framework/util/Helpers'
import TeacherDashBoardPage from '../../../../framework/author/teacherDashboardPage'
import AuthorAssignmentPage from '../../../../framework/author/assignments/AuthorAssignmentPage'
import TeacherSideBar from '../../../../framework/author/SideBarPage'
import TestLibrary from '../../../../framework/author/tests/testLibraryPage'
import TeacherManageClassPage from '../../../../framework/author/manageClassPage'

const signupPage = new SignupPage()
const dashBoard = new TeacherDashBoardPage()
const loginPage = new LoginPage()
const sidebar = new TeacherSideBar()
const assignmentPage = new AuthorAssignmentPage()
const testLibraryPage = new TestLibrary()
const manageClass = new TeacherManageClassPage()

const signupData = {
  zip: '123456789',
  name: 'smoke signupteacher',
  email: 'smoke.signupteacher@snapwiz.com',
  password: 'snapwiz',
  school: 'Automation School - Smoke Suite',
  grade: 'Grade 5',
  subject: 'Mathematics',
  standardSet: 'Math - Common Core',
  newSchool: {
    schoolName: 'smoke sigup school',
    district: 'Automation District',
    address: 'Snapwiz IDC',
    zip: '555555',
    city: 'Bangalore',
    state: 'KA',
    country: 'India',
  },
  newDistrict: 'smoke signup district',
  district: 'Automation District',
}

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)} >> Teacher Signup`, () => {
  beforeEach(() => {
    cy.clearToken()
    cy.server()
    cy.route('POST', '**/schools').as('schoolSearch')
    cy.route('POST', '**/school/').as('schoolCreate')
    cy.route('POST', '**courses').as('courses')
    cy.route('POST', '**districts').as('district')
    cy.route('GET', '**curriculum').as('curriculam')
    cy.route('PUT', '**/user/**').as('user')
    cy.route('POST', '**/user/search').as('userSearch')
    cy.visit('/')
  })

  it('> signup using existing school from dashboard-CompleteSignupLink', () => {
    const {
      name,
      email,
      password,
      school,
      grade,
      standardSet,
      subject,
      district,
      zip,
    } = signupData
    const randomEmail = `${Helpers.getRamdomString()}.${email}`
    signupPage.clickOnSignupLink()
    signupPage.clickOnTeacher()
    signupPage.fillTeacherSignupForm(name, randomEmail, password)
    // signupPage.closeWelcomePopUp()
    cy.wait('@courses').then(() =>
      cy.url().should('contain', 'author/dashboard')
    )
    dashBoard.clickOnCompleteSignupProcess()
    // search by zip
    signupPage.searchAndSelectSchool(zip).then(() => {
      signupPage.removeSelected()
    })
    // search by name
    signupPage.searchAndSelectSchool(school)
    signupPage.verifyDistrict(district)
    signupPage.clickOnProceed()
    cy.wait('@user').then((xhr) => expect(xhr.status).to.eq(200))
    cy.wait('@curriculam')

    // set preference
    signupPage.setPreference(grade, subject, standardSet)
    signupPage.clickOnGetStarted()
    cy.url().should('contain', 'author/dashboard')

    // login again with new user and verify able to login
    cy.login('teacher', randomEmail, password)
    loginPage.assertTeacherLogin()
  })

  it('> signup using new school and existing district from Assignments-New assignment', () => {
    const {
      name,
      email,
      password,
      grade,
      standardSet,
      subject,
      newSchool,
    } = signupData
    const {
      schoolName,
      district,
      zip,
      city,
      country,
      address,
      state,
    } = newSchool
    const random = Helpers.getRamdomString()
    const randomEmail = `${random}.${email}`
    signupPage.clickOnSignupLink()
    signupPage.clickOnTeacher()
    signupPage.fillTeacherSignupForm(name, randomEmail, password)
    // signupPage.closeWelcomePopUp()
    cy.wait('@courses').then(() =>
      cy.url().should('contain', 'author/dashboard')
    )
    sidebar.clickOnAssignment()
    assignmentPage.clickOnNewAssignment()

    // request new school
    signupPage.clickOnRequestNewSchoolLink()
    signupPage.fillSchoolDetails(
      `${schoolName}-${random}`,
      district,
      address,
      zip,
      city,
      state,
      country
    )
    signupPage.clickOnReqNewSchool()
    cy.wait('@schoolCreate').then((xhr) => expect(xhr.status).to.eq(200))
    cy.wait('@curriculam')

    // set preference
    signupPage.setPreference(grade, subject, standardSet)
    signupPage.clickOnGetStarted()
    cy.contains('Choose From Library').should('be.visible')

    // login again with new user and verify able to login
    cy.login('teacher', randomEmail, password)
    loginPage.assertTeacherLogin()
  })

  it('> signup using new district and new school from testLibrary-Assign button', () => {
    const {
      name,
      email,
      password,
      grade,
      standardSet,
      subject,
      newSchool,
      newDistrict,
    } = signupData
    const { schoolName, zip, city, country, address, state } = newSchool
    const random = Helpers.getRamdomString()
    const randomEmail = `${random}.${email}`

    signupPage.clickOnSignupLink()
    signupPage.clickOnTeacher()
    signupPage.fillTeacherSignupForm(name, randomEmail, password)
    // signupPage.closeWelcomePopUp()
    cy.wait('@courses').then(() =>
      cy.url().should('contain', 'author/dashboard')
    )

    sidebar.clickOnTestLibrary()
    testLibraryPage.clickOnTileView()
    testLibraryPage.searchFilters.clearAll()
    testLibraryPage.getTestIdOfCardInCurrentPageByIndex(0).then((id) => {
      testLibraryPage.clickOnTestCardById(id)
      testLibraryPage.clickOnDetailsOfCard()
      testLibraryPage.header.getAssignButton().click()
    })

    // request new school and district
    signupPage.clickOnRequestNewSchoolLink()
    signupPage.fillSchoolDetails(
      `${schoolName}-${random}`,
      `${newDistrict}-${random}`,
      address,
      zip,
      city,
      state,
      country
    )

    signupPage.clickOnReqNewSchool()
    cy.wait('@schoolCreate').then((xhr) => expect(xhr.status).to.eq(200))
    cy.wait('@curriculam')

    // set preference
    signupPage.setPreference(grade, subject, standardSet)
    signupPage.clickOnGetStarted()
    cy.contains('OVERRIDE TEST SETTINGS').should('be.visible')

    // login again with new user and verify able to login
    cy.login('teacher', randomEmail, password)
    loginPage.assertTeacherLogin()
  })

  it('> signup using home school from manage class-create new class', () => {
    const { name, email, password, grade, standardSet, subject } = signupData
    const randomEmail = `${Helpers.getRamdomString()}.${email}`

    signupPage.clickOnSignupLink()
    signupPage.clickOnTeacher()
    signupPage.fillTeacherSignupForm(name, randomEmail, password)
    // signupPage.closeWelcomePopUp()
    cy.wait('@courses').then(() =>
      cy.url().should('contain', 'author/dashboard')
    )
    sidebar.clickOnManageClass()
    manageClass.clickOnCreateClass()
    // select home school
    signupPage.clickOnHomeSchool()
    cy.wait('@user').then((xhr) => expect(xhr.status).to.eq(200))
    cy.wait('@curriculam')

    // set preference
    signupPage.setPreference(grade, subject, standardSet)
    signupPage.clickOnGetStarted()
    cy.contains('Class Details').should('be.visible')

    // login again with new user and verify able to login
    cy.login('teacher', randomEmail, password)
    loginPage.assertTeacherLogin()
  })

  it('> login with existing user', () => {
    cy.login('teacher', 'ashishsnap@snawpiz.com', 'snapwiz')
    loginPage.assertTeacherLogin()
  })
})
