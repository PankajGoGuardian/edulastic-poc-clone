import FileHelper from '../../../../framework/util/fileHelper'
import SidebarPage from '../../../../framework/student/sidebarPage'
import ManagePage from '../../../../framework/student/managePage'
import TeacherSideBar from '../../../../framework/author/SideBarPage'
import TeacherManageClassPage from '../../../../framework/author/manageClassPage'
import Helpers from '../../../../framework/util/Helpers'
import { grades } from '../../../../framework/constants/assignmentStatus'

const sideBarPage = new SidebarPage()
const teacherSideBarPage = new TeacherSideBar()
const teacherManageClass = new TeacherManageClassPage()
const student = { email: 'student3@automation.com', password: 'automation' }
const teacher = { email: 'teacher2@automation.com', password: 'automation' }
const manageClass = new ManagePage()
const invalidClassCode = 'V3A9O1'
const alreadyExistingClassCode = 'Z9VTUK'
let className

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Manage Class`, () => {
  const classData = {
    className: `Auto_Class_`,
    grade: grades.GRADE_10,
    subject: 'Mathematics',
    standardSet: 'Math - Common Core',
  }

  before(() => {
    cy.clearToken()
    cy.login('student', student.email, student.password)
    sideBarPage.clickOnMyClasses()
  })

  context('> Join Class Behaviour and Active and archived classes', () => {
    it('>TC01 verify Active Classes', () => {
      manageClass.selectClassType('ACTIVE')
      manageClass.verifyShowActiveClass(4)
      manageClass.validateclassName('Automation_class')
      manageClass.validateclassName('automation_class2')
      manageClass.validateclassName('New_automation_Class')
    })

    it('>TC02 verify invalid class code', () => {
      manageClass.clickonJoinClass()
      manageClass.clickonEnterClassCode()
      manageClass.typeClassCode(invalidClassCode)
      manageClass.clickonJoinButton('INVALID')
      manageClass.validateAPImsg('Invalid Class Code')
    })

    it('>TC03 verify already existing class code', () => {
      manageClass.clickonJoinClass()
      manageClass.clickonEnterClassCode()
      manageClass.typeClassCode(alreadyExistingClassCode)
      manageClass.clickonJoinButton()
      manageClass.validateAPImsg('User already exists in class.')
    })

    it('>TC04 verify blank class code and cancel button', () => {
      manageClass.clickonJoinClass()
      manageClass.clickonEnterClassCode()
      manageClass.clickonJoinButton()
      manageClass.validateEnterClassCodeMsg()
      manageClass.clickonCancelButton()
      cy.contains('My Classes').should('be.visible')
    })

    it('>TC05 verify New valid class code', () => {
      cy.login('teacher', teacher.email, teacher.password)
      teacherSideBarPage.clickOnManageClass()
      teacherManageClass.clickOnCreateClass()
      className = classData.className + Helpers.getRamdomString()
      const startDate = new Date()
      const endDate = new Date(new Date().setDate(startDate.getDate() + 30))
      teacherManageClass.fillClassDetails(
        className,
        startDate,
        endDate,
        classData.grade,
        classData.subject,
        classData.standardSet
      )
      teacherManageClass.clickOnSaveClass()
      teacherSideBarPage.clickOnManageClass()
      teacherManageClass.getClassCode(className).then((classCode) => {
        cy.login('student', student.email, student.password)
        sideBarPage.clickOnMyClasses()
        manageClass.clickonJoinClass()
        manageClass.clickonEnterClassCode()
        manageClass.typeClassCode(classCode)
      })
      manageClass.clickonJoinButton('VALID')
      manageClass.validateAPImsg('You joined class successfully.')
      manageClass.validateclassName(className)
    })

    it('>TC6 verify Archived Classes', () => {
      cy.login('teacher', teacher.email, teacher.password)
      teacherSideBarPage.clickOnManageClass()
      teacherManageClass.clickOnClassRowByName(className)
      teacherManageClass.archieveClass()

      cy.login('student', student.email, student.password)
      sideBarPage.clickOnMyClasses()
      manageClass.selectClassType('ARCHIVE')
      manageClass.goToLastPage()
      manageClass.validateclassName(className)
    })
  })
})
