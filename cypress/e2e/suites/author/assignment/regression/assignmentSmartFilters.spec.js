import AuthorAssignmentPage from '../../../../framework/author/assignments/AuthorAssignmentPage'
import LiveClassboardPage from '../../../../framework/author/assignments/LiveClassboardPage'
import { FolderPage } from '../../../../framework/author/folderPage'
import TeacherSideBar from '../../../../framework/author/SideBarPage'
import TestLibrary from '../../../../framework/author/tests/testLibraryPage'
import {
  openPolicyTypes,
  teacherSide,
  testTypes,
} from '../../../../framework/constants/assignmentStatus'
import CypressHelper from '../../../../framework/util/cypressHelpers'
import FileHelper from '../../../../framework/util/fileHelper'

const teacherSidebar = new TeacherSideBar()
const authorAssignmentPage = new AuthorAssignmentPage()
const lcb = new LiveClassboardPage()
const testLibrary = new TestLibrary()
const folderPage = new FolderPage()
const { _ } = Cypress

const classes = {
  1: { className: 'My Test Class 1' },
  2: { className: 'My Test Class 2' },
  3: { className: 'My Test Class 3' },
  4: { className: 'Automation Class Teacher 2' },
}

const testName = 'Default Test Automation'
const teacher = 'teacher2.regression.automation@snapwiz.com'
const password = 'snapwiz'
const filters = {
  gradeFilter: {
    Kindergarten: { ...classes[1] },
    'Grade 1': { ...classes[2] },
  },
  subjectFilter: {
    Mathematics: { ...classes[1] },
    ELA: { ...classes[2] },
  },
  testTypeFilter: {
    'Class Assessments': { ...classes[1] },
    Practice: { ...classes[2] },
  },
  classFilter: {
    'My Test Class 1': 'My Test Class 1',
    'My Test Class 2': 'My Test Class 2',
  },
  statusFilter: {
    'NOT OPEN': { ...classes[1] },
    'IN GRADING': { ...classes[3] },
    DONE: { ...classes[4] },
    'IN PROGRESS': { ...classes[2] },
  },
}
const folders = { 1: 'Folder1', 2: 'Folder2', 3: 'Folder3' }

let testId
const assignmentIds = {}

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)} >> Smart Filters`, () => {
  before(' > create new assessment and assign', () => {
    cy.login('teacher', teacher, password)
    // creating test
    cy.deleteAllAssignments(undefined, teacher, password)
    testLibrary.createTest().then((id) => {
      testId = id
      //  assign as class assessment
      cy.contains('Share With Others')
      testLibrary.clickOnAssign()
      testLibrary.assignPage.selectClass(classes[1].className)
      testLibrary.assignPage.clickOnAssign()
      teacherSidebar.clickOnAssignment()
      // assign as practice
      cy.visit(`/author/assignments/${testId}`)
      cy.wait('@assignment')
      cy.wait(2000)
      testLibrary.assignPage.selectClass(classes[2].className)
      testLibrary.assignPage.selectTestType(testTypes.PRACTICE_ASSESSMENT)
      testLibrary.assignPage.clickOnAssign()
      teacherSidebar.clickOnAssignment()
    })
  })

  context(`expand-collapse filter`, () => {
    before('collapse', () => {
      cy.login('teacher', teacher, password)
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.smartFilter.collapseFilter()
    })

    it(`expand filter and verify`, () => {
      authorAssignmentPage.smartFilter.expandFilter()
    })

    it(`collapse filter and verify`, () => {
      authorAssignmentPage.smartFilter.collapseFilter()
    })
  })

  context(`assignment filters`, () => {
    before('expand filter', () => {
      authorAssignmentPage.smartFilter.expandFilter()
    })

    beforeEach('reset all filters', () => {
      authorAssignmentPage.smartFilter.routeAPI()
      authorAssignmentPage.smartFilter.resetAll()
    })

    context(`assignment filters -By Grade`, () => {
      const filterData = filters.gradeFilter
      _.keys(filterData).forEach((filterOption) => {
        it(`- with ${filterOption}`, () => {
          authorAssignmentPage.smartFilter.setGrades(filterOption)
          authorAssignmentPage
            .getClass()
            .should('contain.text', filterData[filterOption].className)
            .and('have.length', 1)
        })
      })
    })

    context(`assignment filters -By Subject`, () => {
      const filterData = filters.subjectFilter
      _.keys(filterData).forEach((filterOption) => {
        it(`- with ${filterOption}`, () => {
          authorAssignmentPage.smartFilter.setGrades(filterOption)
          authorAssignmentPage
            .getClass()
            .should('contain.text', filterData[filterOption].className)
            .and('have.length', 1)
        })
      })
    })

    context(`assignment filters -By Testtype`, () => {
      const filterData = filters.testTypeFilter
      _.keys(filterData).forEach((filterOption) => {
        it(`- with ${filterOption}`, () => {
          authorAssignmentPage.smartFilter.setGrades(filterOption)
          authorAssignmentPage
            .getClass()
            .should('contain.text', filterData[filterOption].className)
            .and('have.length', 1)
        })
      })
    })

    context(`assignment filters -By Class`, () => {
      const filterData = filters.classFilter
      _.keys(filterData).forEach((filterOption) => {
        it(`- with ${filterOption}`, () => {
          authorAssignmentPage.smartFilter.setGrades(filterOption)
          authorAssignmentPage
            .getClass()
            .should('contain.text', filterData[filterOption])
            .and('have.length', 1)
        })
      })
    })

    context(`assignment filters -By Year`, () => {
      const year = '2019-20'
      const allYear = 'All years'
      it(`- with ${year}`, () => {
        authorAssignmentPage.smartFilter.setYear(year)
        authorAssignmentPage
          .getClass()
          .should('contain.text', classes[1].className)
          .and('contain.text', classes[2].className)
          .and('have.length', 2)
      })

      it(`- with ${allYear}`, () => {
        authorAssignmentPage.smartFilter.setYear(allYear)
        authorAssignmentPage
          .getClass()
          .should('contain.text', classes[1].className)
          .and('contain.text', classes[2].className)
          .and('have.length', 2)
      })
    })

    context(`assignment filters -by Status`, () => {
      before(`assign `, () => {
        cy.deleteAllAssignments(undefined, teacher, password)
        _.keys(filters.statusFilter).forEach((status) => {
          testLibrary.assignPage.visitAssignPageById(testId)
          testLibrary.assignPage.selectClass(
            filters.statusFilter[`${status}`].className
          )
          if (status === teacherSide.NOT_OPEN) {
            testLibrary.assignPage.selectOpenPolicy(openPolicyTypes.MANUAL)
          }
          testLibrary.assignPage.clickOnAssign().then((assgnObj) => {
            assignmentIds[status] = assgnObj[testId]
          })
        })
        testLibrary.sidebar.clickOnAssignment()
        authorAssignmentPage.smartFilter.expandFilter()
      })
      beforeEach('reset all filters', () => {
        authorAssignmentPage.smartFilter.routeAPI()
        authorAssignmentPage.smartFilter.setStatus('Select Status')
      })
      _.keys(filters.statusFilter).forEach((status) => {
        it(`> status ${status}`, () => {
          if (status === teacherSide.IN_GRADING) {
            authorAssignmentPage.clickOnLCBbyTestId(
              testId,
              assignmentIds[status]
            )
            lcb.checkSelectAllCheckboxOfStudent()
            lcb.clickOnMarkAsSubmit()
            testLibrary.sidebar.clickOnAssignment()
          }
          if (status === teacherSide.DONE) {
            authorAssignmentPage.clickOnLCBbyTestId(
              testId,
              assignmentIds[status]
            )
            lcb.header.clickOnClose()
            testLibrary.sidebar.clickOnAssignment()
          }
          authorAssignmentPage.smartFilter.setStatus(status)
          authorAssignmentPage
            .getClass()
            .should('contain', filters.statusFilter[`${status}`].className)
            .should('have.length', 1)
        })
      })
    })
  })

  context(`assignment folders`, () => {
    before('reset all filters', () => {
      cy.login('teacher', teacher, password)
      teacherSidebar.clickOnDashboard()
      teacherSidebar.clickOnAssignment()
      authorAssignmentPage.smartFilter.expandFilter()
      folderPage.getAllAssignment().then(() => {
        folderPage.deleteAllFolders()
        folderPage.clickAddNewFolderButton()
        folderPage.setNewFolderName(folders[2])
        folderPage.clickCreateNewFolderBuuton(folders[2])
      })
    })

    it(`create new folder`, () => {
      folderPage.clickAddNewFolderButton()
      folderPage.setNewFolderName(folders[1])
      folderPage.clickCreateNewFolderBuuton(folders[1])
    })

    it(`rename empty folder`, () => {
      folderPage.clickOnMoreOptionsByFolderName(folders[1])
      folderPage.clickRenameFolder()
      folderPage.setNewFolderName(`${folders[1]}-rename`)
      folderPage.clickUpdateFolder(`${folders[1]}-rename`)
    })

    it(`delete empty folder`, () => {
      folderPage.clickOnMoreOptionsByFolderName(`${folders[1]}-rename`)
      folderPage.clickDeleteFolderInDropDown()
      folderPage.clickDeleteFolder(`${folders[1]}-rename`)
    })

    it(`rename to existing folder`, () => {
      folderPage.clickAddNewFolderButton()
      folderPage.setNewFolderName(folders[3])
      folderPage.clickCreateNewFolderBuuton(folders[3])

      folderPage.clickOnMoreOptionsByFolderName(folders[3])
      folderPage.clickRenameFolder()

      folderPage.setNewFolderName(folders[3])
      folderPage.clickUpdateFolder(`${folders[3]}`, false)
    })

    it(`move assignment to folder`, () => {
      // select folder 2 before move
      folderPage.clickOnFolderByName(folders[2])
      authorAssignmentPage.getClass().should('have.length', 0)

      folderPage.clickOnAllAssignment()
      authorAssignmentPage.selectCheckBoxByTestName(testName)

      folderPage.clickAddToFolderInDropDown()
      CypressHelper.removeAllAntMessages()

      folderPage.addToFolderByFolderName(folders[2])
      CypressHelper.verifyAntMesssage(
        `${testName} successfully moved to "${folders[2]}"`
      )

      // select all folder
      folderPage.clickOnAllAssignment()
      authorAssignmentPage
        .getClass()
        .should('contain.text', classes[1].className)
        .and('contain.text', classes[2].className)
        .and('have.length', 4)

      // select folder 2
      folderPage.clickOnFolderByName(folders[2])
      authorAssignmentPage
        .getClass()
        .should('contain.text', classes[1].className)
        .and('contain.text', classes[2].className)
        .and('have.length', 4)
    })

    it(`move assignment to already moved folder`, () => {
      folderPage.clickOnAllAssignment()
      authorAssignmentPage.selectCheckBoxByTestName(testName)

      folderPage.clickAddToFolderInDropDown()
      folderPage.selectFolderByNameInPopUp(folders[2])

      CypressHelper.removeAllAntMessages()
      folderPage.getAddButtonInPopUp().click({ force: true })
      CypressHelper.verifyAntMesssage(
        `${testName} already exist in ${folders[2]} folder`
      )
    })

    // Should be able to delete used folder as per - EV-15966
    it(`delete used folder`, () => {
      folderPage.clickCancelButtonInPopUp()
      folderPage.clickOnMoreOptionsByFolderName(folders[2])
      folderPage.clickDeleteFolderInDropDown()

      cy.contains(
        `${folders[2]} will get deleted but all tests will remain untouched. The tests can still be accessed from All Assignments.`
      ).should('be.visible')
      folderPage.clickDeleteFolder(folders[2])

      // assignments should be available in all assingment
      folderPage.clickOnAllAssignment()
      authorAssignmentPage
        .getClass()
        .should('contain.text', classes[1].className)
        .and('contain.text', classes[2].className)
        .and('have.length', 4)
    })
  })
})
