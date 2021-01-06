import TestAssignPage from '../../../../framework/author/tests/testDetail/testAssignPage'
import AuthorAssignmentPage from '../../../../framework/author/assignments/AuthorAssignmentPage'
import AssignmentBulkActionsPage, {
  filter,
  icons,
} from '../../../../framework/author/assignments/AssignmentBulkActionsPage'
import SidebarPage from '../../../../framework/student/sidebarPage'
import FileHelper from '../../../../framework/util/fileHelper'
import TeacherSideBar from '../../../../framework/author/SideBarPage'
import {
  grades,
  teacherSide,
} from '../../../../framework/constants/assignmentStatus'
import {
  getRandomClass,
  getRandomStudent,
} from '../../../../framework/constants/constantFunctions'
import LiveClassboardPage from '../../../../framework/author/assignments/LiveClassboardPage'
import ReportsPage from '../../../../framework/student/reportsPage'

// import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
// import TeacherManageClassPage from "../../../../framework/author/manageClassPage";

describe(`${FileHelper.getSpecName(
  Cypress.spec.name
)} :- Verify Bulk Assignment Actions In School Admin`, () => {
  const sideBarPage = new TeacherSideBar()
  const authorAssignmentPage = new AuthorAssignmentPage()
  const lcbPage = new LiveClassboardPage()
  const testAssignPage = new TestAssignPage()
  const bulkActionPage = new AssignmentBulkActionsPage()
  const studeSideBar = new SidebarPage()
  const reportsPage = new ReportsPage()

  // const testLibraryPage = new TestLibrary();
  // const manageClass = new TeacherManageClassPage();
  // const startDate = new Date();
  // const endDate = new Date(new Date().setDate(startDate.getDate() + 30));

  let inProgressClasses

  const classData = {
    className: ['Bulk_class_'],
    grade: grades.GRADE_10,
    subject: 'Mathematics',
    standardSet: 'Math - Common Core',
    testID: '5f9fa2f76d658400083393aa',
    assignmentName: 'Default Test Automation',
  }

  const studData = {
    username: '_bulk_stud_',
    name: 'bulkStud',
    password: 'snapwiz',
  }

  const Teacher = {
    email: 'bulkteach@snapwiz.com',
    pass: 'automation',
    adminEmail: 'bulksa@snapwiz.com',
    adminPass: 'automation',
  }

  /* before(" > Create test data", () => {
    cy.deleteAllAssignments(undefined, Teacher.email, Teacher.pass);
    cy.login("teacher", Teacher.email, Teacher.pass);
    // Create classes and create test - to be uncommented when test data needs to be created
     for (let i = 23; i <= 30; i++) {
      sideBarPage.clickOnManageClass();
      manageClass.clickOnCreateClass();
      let className = classData.className + i.toString();
       manageClass.fillClassDetails(
        className,
        startDate,
        endDate,
        classData.grade,
        classData.subject,
        classData.standardSet
      );
      manageClass.clickOnSaveClass();
    // Add 5 students
      for(let j=1;j<=5;j++){
        let username = className + studData.username + j.toString();
        let studName = studData.name + j.toString();
        manageClass.clickOnAddStudent();
        manageClass.fillStudentDetails(username, studName, studData.password);
        manageClass.clickOnAddUserButton();
      }
    }  
    // Create a test
    testLibraryPage.createTest().then(id => {
      classData.testID = id 
    });

  })  */

  context(' > Mark as done action for assignments', () => {
    before('Login into teacher', () => {
      cy.deleteAllAssignments(undefined, Teacher.email, Teacher.pass)
      cy.login('teacher', Teacher.email, Teacher.pass)

      inProgressClasses = []
      for (let i = 1; i <= 30; i++) {
        inProgressClasses.push(classData.className + i.toString())
      }
      testAssignPage.assignOpenTest(inProgressClasses, classData.testID)
      cy.login('schoolAdmin', Teacher.adminEmail, Teacher.adminPass)
    })

    it("> Close 'In progress' assignments :", () => {
      sideBarPage.clickOnReport()
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      inProgressClasses.slice(0, 15).forEach((className) => {
        bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickCloseActionButton('15', '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS, '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE, '15')

      inProgressClasses.slice(0, 15).forEach((className) => {
        bulkActionPage.verifyAssignmentStatusOfClass(
          className,
          teacherSide.DONE
        )
      })
    })

    it('> Mark as done for already Done assignments :', () => {
      inProgressClasses.slice(0, 15).forEach((className) => {
        bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickDoneActionButton('0', '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS, '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE, '15')

      inProgressClasses.slice(0, 15).forEach((className) => {
        bulkActionPage.verifyAssignmentStatusOfClass(
          className,
          teacherSide.DONE
        )
      })
    })

    it('> Open  already closed assignments :', () => {
      inProgressClasses.slice(0, 15).forEach((className) => {
        bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickOpenActionButton('0', '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS, '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE, '15')

      inProgressClasses.slice(0, 15).forEach((className) => {
        bulkActionPage.verifyAssignmentStatusOfClass(
          className,
          teacherSide.DONE
        )
      })
    })

    it('> Pause already closed assignments :', () => {
      inProgressClasses.slice(0, 15).forEach((className) => {
        bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickPauseActionButton('0', '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS, '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE, '15')

      inProgressClasses.slice(0, 15).forEach((className) => {
        bulkActionPage.verifyAssignmentStatusOfClass(
          className,
          teacherSide.DONE
        )
      })
    })

    it("> Mark as done for 'Paused' assignments :", () => {
      inProgressClasses.slice(15, 30).forEach((className) => {
        bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickPauseActionButton('15', '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS, '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE, '15')

      inProgressClasses.slice(15, 30).forEach((className) => {
        bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickDoneActionButton('0', '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS, '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE, '15')

      inProgressClasses.slice(15, 30).forEach((className) => {
        bulkActionPage.verifyAssignmentStatusOfClass(
          className,
          teacherSide.IN_PROGRESS_PAUSED
        )
      })
    })

    it("> Mark as done for 'In progress' assignments :", () => {
      inProgressClasses.slice(15, 30).forEach((className) => {
        bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickOpenActionButton('15', '15')

      inProgressClasses.slice(15, 30).forEach((className) => {
        bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickDoneActionButton('0', '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS, '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE, '15')

      inProgressClasses.slice(15, 30).forEach((className) => {
        bulkActionPage.verifyAssignmentStatusOfClass(
          className,
          teacherSide.IN_PROGRESS
        )
      })
    })

    it("> Mark as done for 'in grading' assignments:", () => {
      inProgressClasses.slice(15, 30).forEach((className) => {
        bulkActionPage.clickIconByClassName(icons.LCB, className)
        lcbPage.checkSelectAllCheckboxOfStudent()
        lcbPage.clickOnMarkAsSubmit()
        lcbPage.clickOnAssignmentLink(classData.assignmentName)
      })

      inProgressClasses.slice(15, 30).forEach((className) => {
        bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickDoneActionButton('15', '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE, '30')

      inProgressClasses.slice(15, 30).forEach((className) => {
        bulkActionPage.verifyAssignmentStatusOfClass(
          className,
          teacherSide.DONE
        )
      })

      cy.login('teacher', Teacher.email, Teacher.pass)
      sideBarPage.clickOnReport()
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.verifyAssignmentStatusOfClass(
        classData.testID,
        getRandomClass(classData.className, 15, 30),
        teacherSide.DONE
      )
      authorAssignmentPage.verifyAssignmentStatusOfClass(
        classData.testID,
        getRandomClass(classData.className, 15, 30),
        teacherSide.DONE
      )
      authorAssignmentPage.verifyAssignmentStatusOfClass(
        classData.testID,
        getRandomClass(classData.className, 15, 30),
        teacherSide.DONE
      )
      authorAssignmentPage.verifyAssignmentStatusOfClass(
        classData.testID,
        getRandomClass(classData.className, 15, 30),
        teacherSide.DONE
      )

      cy.login(
        'student',
        getRandomStudent(classData.className, studData.username, 15, 30),
        studData.password
      )
      studeSideBar.clickOnGrades()
      reportsPage.getTestCardByTesyId(classData.testID)

      cy.login(
        'student',
        getRandomStudent(classData.className, studData.username, 15, 30),
        studData.password
      )
      studeSideBar.clickOnGrades()
      reportsPage.getTestCardByTesyId(classData.testID)
    })

    it("> Mark as done for 'in grading paused' assignments:", () => {
      cy.deleteAllAssignments(undefined, Teacher.email, Teacher.pass)
      cy.login('teacher', Teacher.email, Teacher.pass)

      inProgressClasses = []
      for (let i = 1; i <= 15; i++) {
        inProgressClasses.push(classData.className + i.toString())
      }
      testAssignPage.assignOpenTest(inProgressClasses, classData.testID)

      cy.login('schoolAdmin', Teacher.adminEmail, Teacher.adminPass)
      sideBarPage.clickOnReport()
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      inProgressClasses.forEach((className) => {
        bulkActionPage.clickIconByClassName(icons.LCB, className)
        lcbPage.checkSelectAllCheckboxOfStudent()
        lcbPage.clickOnMarkAsSubmit()
        lcbPage.clickOnAssignmentLink(classData.assignmentName)
      })

      /* inProgressClasses.forEach((className, index) => {
        if (index < 15) bulkActionPage.selectClassByClassName(className)
      }) */
      bulkActionPage.selectAllClassesCheckBox()

      bulkActionPage.clickPauseActionButton('15', '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_GRADING, '15')

      /* inProgressClasses.forEach((className, index) => {
        if (index < 15) bulkActionPage.selectClassByClassName(className)
      }) */
      bulkActionPage.selectAllClassesCheckBox()

      bulkActionPage.clickDoneActionButton('15', '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE, '15')
    })
  })
})
