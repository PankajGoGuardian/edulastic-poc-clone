import TestAssignPage from '../../../framework/author/tests/testDetail/testAssignPage'
import AuthorAssignmentPage from '../../../framework/author/assignments/AuthorAssignmentPage'
import AssignmentBulkActionsPage, {
  filter,
  icons,
} from '../../../framework/author/assignments/AssignmentBulkActionsPage'
import AssignmentsPage from '../../../framework/student/assignmentsPage'
import SidebarPage from '../../../framework/student/sidebarPage'
import FileHelper from '../../../framework/util/fileHelper'
import TeacherSideBar from '../../../framework/author/SideBarPage'
import {
  grades,
  teacherSide,
} from '../../../framework/constants/assignmentStatus'
import {
  getRandomClass,
  getRandomStudent,
} from '../../../framework/constants/constantFunctions'
import LiveClassboardPage from '../../../framework/author/assignments/LiveClassboardPage'
import ReportsPage from '../../../framework/student/reportsPage'

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
  const studAssignmentPage = new AssignmentsPage()
  const studeSideBar = new SidebarPage()
  const reportsPage = new ReportsPage()

  // const testLibraryPage = new TestLibrary();
  // const manageClass = new TeacherManageClassPage();
  // const startDate = new Date();
  // const endDate = new Date(new Date().setDate(startDate.getDate() + 30));

  let notOpenClasses

  const classData = {
    className: ['Auto_class_'],
    grade: grades.GRADE_10,
    subject: 'Mathematics',
    standardSet: 'Math - Common Core',
    testID: '5f524262b628db00085f6c82',
  }

  const studData = {
    username: '_bulk_auto_',
    name: 'autoStud',
    password: 'snapwiz',
  }

  const Teacher = {
    email: 'bulkauto@automation.com',
    pass: 'automation',
    adminEmail: 'bulkAutoadmin@snapwiz.com',
    adminPass: 'automation',
  }

  /* before(" > Create test data", () => {
    cy.deleteAllAssignments(undefined, Teacher.email, Teacher.pass);
    cy.login("teacher", Teacher.email, Teacher.pass);
    // Create classes and create test - to be uncommented when test data needs to be created
     for (let i = 1; i <= 30; i++) {
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
  }) */

  context(' > Bulk action on assignments', () => {
    before('Login into teacher', () => {
      cy.deleteAllAssignments(undefined, Teacher.email, Teacher.pass)
      cy.login('teacher', Teacher.email, Teacher.pass)

      notOpenClasses = []
      for (let i = 1; i <= 30; i++) {
        notOpenClasses.push(classData.className + i.toString())
      }
      testAssignPage.assignTestWithoutOpening(notOpenClasses, classData.testID)
      cy.login('', Teacher.adminEmail, Teacher.adminPass)
    })

    it("> Open 'not started' assignments :", () => {
      sideBarPage.clickOnReport()
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      notOpenClasses.forEach((className, index) => {
        if (index < 10) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 9 && index < 15)
          bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickOpenActionButton('15', '15')

      bulkActionPage.clickPreviousPage()
      notOpenClasses.forEach((className, index) => {
        if (index < 10)
          bulkActionPage.verifyAssignmentStatusOfClass(
            className,
            teacherSide.IN_PROGRESS
          )
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 9 && index < 15)
          bulkActionPage.verifyAssignmentStatusOfClass(
            className,
            teacherSide.IN_PROGRESS
          )
      })

      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN, '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS, '15')

      cy.login('teacher', Teacher.email, Teacher.pass)
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.verifyAssignmentStatusOfClass(
        classData.testID,
        getRandomClass(classData.className, 1, 15),
        teacherSide.IN_PROGRESS
      )
      authorAssignmentPage.verifyAssignmentStatusOfClass(
        classData.testID,
        getRandomClass(classData.className, 1, 15),
        teacherSide.IN_PROGRESS
      )
      authorAssignmentPage.verifyAssignmentStatusOfClass(
        classData.testID,
        getRandomClass(classData.className, 16, 30),
        teacherSide.NOT_OPEN
      )
      authorAssignmentPage.verifyAssignmentStatusOfClass(
        classData.testID,
        getRandomClass(classData.className, 16, 30),
        teacherSide.NOT_OPEN
      )

      cy.login(
        'student',
        getRandomStudent(classData.className, studData.username, 1, 15),
        studData.password
      )
      studAssignmentPage.verifyAssignmentIsOpen(classData.testID)

      cy.login(
        'student',
        getRandomStudent(classData.className, studData.username, 16, 30),
        studData.password
      )
      // NOT OPEN assignment should not be listed now
      // studAssignmentPage.verifyAssignmentIslocked()
      studAssignmentPage.getAssignmentButton().should('not.be.visible')
    })

    it("> Pause 'in progress' assignments :", () => {
      cy.login('', Teacher.adminEmail, Teacher.adminPass)
      sideBarPage.clickOnReport()
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      notOpenClasses.forEach((className, index) => {
        if (index < 10) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 9 && index < 15)
          bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickPauseActionButton('15', '15')

      bulkActionPage.clickPreviousPage()
      notOpenClasses.forEach((className, index) => {
        if (index < 10)
          bulkActionPage.verifyAssignmentStatusOfClass(
            className,
            teacherSide.IN_PROGRESS_PAUSED
          )
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 9 && index < 15)
          bulkActionPage.verifyAssignmentStatusOfClass(
            className,
            teacherSide.IN_PROGRESS_PAUSED
          )
      })

      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN, '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS, '15')

      cy.login('teacher', Teacher.email, Teacher.pass)
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.verifyAssignmentStatusOfClass(
        classData.testID,
        getRandomClass(classData.className, 1, 15),
        teacherSide.IN_PROGRESS_PAUSED
      )
      authorAssignmentPage.verifyAssignmentStatusOfClass(
        classData.testID,
        getRandomClass(classData.className, 1, 15),
        teacherSide.IN_PROGRESS_PAUSED
      )
      authorAssignmentPage.verifyAssignmentStatusOfClass(
        classData.testID,
        getRandomClass(classData.className, 16, 30),
        teacherSide.NOT_OPEN
      )
      authorAssignmentPage.verifyAssignmentStatusOfClass(
        classData.testID,
        getRandomClass(classData.className, 16, 30),
        teacherSide.NOT_OPEN
      )

      cy.login(
        'student',
        getRandomStudent(classData.className, studData.username, 1, 15),
        studData.password
      )
      studAssignmentPage.verifyAssignmentIsPaused(classData.testID)

      cy.login(
        'student',
        getRandomStudent(classData.className, studData.username, 16, 30),
        studData.password
      )
      // NOT OPEN assignment should not be listed now
      // studAssignmentPage.verifyAssignmentIslocked()
      studAssignmentPage.getAssignmentButton().should('not.be.visible')
    })

    it('> Open Paused assignments :', () => {
      cy.login('', Teacher.adminEmail, Teacher.adminPass)
      sideBarPage.clickOnReport()
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      notOpenClasses.forEach((className, index) => {
        if (index < 10) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 9 && index < 15)
          bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickOpenActionButton('15', '15')

      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN, '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS, '15')

      bulkActionPage.clickPreviousPage()
      notOpenClasses.forEach((className, index) => {
        if (index < 10)
          bulkActionPage.verifyAssignmentStatusOfClass(
            className,
            teacherSide.IN_PROGRESS
          )
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 9 && index < 15)
          bulkActionPage.verifyAssignmentStatusOfClass(
            className,
            teacherSide.IN_PROGRESS
          )
      })
    })

    it("> Pause 'in grading' assignments:", () => {
      notOpenClasses.forEach((className, index) => {
        if (index < 10) {
          sideBarPage.clickOnAssignment()
          authorAssignmentPage.filterByTestType('All')
          bulkActionPage.clickTestByID(classData.testID)
          bulkActionPage.clickIconByClassName(icons.LCB, className)
          lcbPage.checkSelectAllCheckboxOfStudent()
          lcbPage.clickOnMarkAsSubmit()
        } else if (index > 9 && index < 15) {
          sideBarPage.clickOnAssignment()
          authorAssignmentPage.filterByTestType('All')
          bulkActionPage.clickTestByID(classData.testID)
          bulkActionPage.clickNextPage()
          bulkActionPage.clickIconByClassName(icons.LCB, className)
          lcbPage.checkSelectAllCheckboxOfStudent()
          lcbPage.clickOnMarkAsSubmit()
        }
      })

      sideBarPage.clickOnReport()
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      notOpenClasses.forEach((className, index) => {
        if (index < 10) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 9 && index < 15)
          bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickPauseActionButton('15', '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN, '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_GRADING, '15')

      bulkActionPage.clickPreviousPage()
      notOpenClasses.forEach((className, index) => {
        if (index < 10)
          bulkActionPage.verifyAssignmentStatusOfClass(
            className,
            teacherSide.IN_GRADING_PAUSED
          )
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 9 && index < 15)
          bulkActionPage.verifyAssignmentStatusOfClass(
            className,
            teacherSide.IN_GRADING_PAUSED
          )
      })

      cy.login('teacher', Teacher.email, Teacher.pass)
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.verifyAssignmentStatusOfClass(
        classData.testID,
        getRandomClass(classData.className, 1, 15),
        teacherSide.IN_GRADING_PAUSED
      )
      authorAssignmentPage.verifyAssignmentStatusOfClass(
        classData.testID,
        getRandomClass(classData.className, 1, 15),
        teacherSide.IN_GRADING_PAUSED
      )
      authorAssignmentPage.verifyAssignmentStatusOfClass(
        classData.testID,
        getRandomClass(classData.className, 16, 30),
        teacherSide.NOT_OPEN
      )
      authorAssignmentPage.verifyAssignmentStatusOfClass(
        classData.testID,
        getRandomClass(classData.className, 16, 30),
        teacherSide.NOT_OPEN
      )

      cy.login(
        'student',
        getRandomStudent(classData.className, studData.username, 1, 15),
        studData.password
      )
      studeSideBar.clickOnGrades()
      reportsPage.verifyReviewPaused()

      cy.login(
        'student',
        getRandomStudent(classData.className, studData.username, 1, 15),
        studData.password
      )
      studeSideBar.clickOnGrades()
      reportsPage.verifyReviewPaused()
    })

    it("> Open 'in-grading-paused' assignments :", () => {
      cy.login('', Teacher.adminEmail, Teacher.adminPass)
      sideBarPage.clickOnReport()
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      notOpenClasses.forEach((className, index) => {
        if (index < 10) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 9 && index < 15)
          bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickOpenActionButton('15', '15')
      /* inGradinClasses.forEach((className)=>{
        bulkActionPage.verifyAssignmentStatusOfClass(className,teacherSide.DONE)
      }) */
      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN, '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_GRADING, '15')

      bulkActionPage.clickPreviousPage()
      notOpenClasses.forEach((className, index) => {
        if (index < 10)
          bulkActionPage.verifyAssignmentStatusOfClass(
            className,
            teacherSide.IN_GRADING
          )
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 9 && index < 15)
          bulkActionPage.verifyAssignmentStatusOfClass(
            className,
            teacherSide.IN_GRADING
          )
      })
    })

    it("> Close 'in-grading' assignments :", () => {
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      notOpenClasses.forEach((className, index) => {
        if (index < 10) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 9 && index < 15)
          bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickCloseActionButton('15', '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN, '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE, '15')

      bulkActionPage.clickPreviousPage()
      notOpenClasses.forEach((className, index) => {
        if (index < 10)
          bulkActionPage.verifyAssignmentStatusOfClass(
            className,
            teacherSide.DONE
          )
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 9 && index < 15)
          bulkActionPage.verifyAssignmentStatusOfClass(
            className,
            teacherSide.DONE
          )
      })
    })

    it("> Close 'not started' assignments :", () => {
      sideBarPage.clickOnReport()
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 14 && index < 20)
          bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 19 && index < 30)
          bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickCloseActionButton('0', '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN, '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE, '15')

      bulkActionPage.clickPreviousPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 14 && index < 20)
          bulkActionPage.verifyAssignmentStatusOfClass(
            className,
            teacherSide.NOT_OPEN
          )
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 19 && index < 30)
          bulkActionPage.verifyAssignmentStatusOfClass(
            className,
            teacherSide.NOT_OPEN
          )
      })
    })

    it("> Mark as done for 'not started' assignments :", () => {
      sideBarPage.clickOnReport()
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 14 && index < 20)
          bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 19 && index < 30)
          bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickDoneActionButton('0', '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN, '15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE, '15')

      bulkActionPage.clickPreviousPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 14 && index < 20)
          bulkActionPage.verifyAssignmentStatusOfClass(
            className,
            teacherSide.NOT_OPEN
          )
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 19 && index < 30)
          bulkActionPage.verifyAssignmentStatusOfClass(
            className,
            teacherSide.NOT_OPEN
          )
      })
    })

    it("> Close 'Paused' assignments :", () => {
      sideBarPage.clickOnReport()
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 14 && index < 20)
          bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 19 && index < 30)
          bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickOpenActionButton('15', '15')

      sideBarPage.clickOnReport()
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 14 && index < 20)
          bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 19 && index < 30)
          bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickPauseActionButton('15', '15')

      sideBarPage.clickOnReport()
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 14 && index < 20)
          bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 19 && index < 30)
          bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickCloseActionButton('15', '15')

      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE, '30')

      bulkActionPage.clickPreviousPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 14 && index < 20)
          bulkActionPage.verifyAssignmentStatusOfClass(
            className,
            teacherSide.DONE
          )
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index) => {
        if (index > 19 && index < 30)
          bulkActionPage.verifyAssignmentStatusOfClass(
            className,
            teacherSide.DONE
          )
      })
    })
  })
})
