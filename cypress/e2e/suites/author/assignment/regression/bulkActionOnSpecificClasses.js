import TestAssignPage from "../../../../framework/author/tests/testDetail/testAssignPage";
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import AssignmentBulkActionsPage, {filter,icons} from "../../../../framework/author/assignments/AssignmentBulkActionsPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import SidebarPage from "../../../../framework/student/sidebarPage";
import FileHelper from "../../../../framework/util/fileHelper";
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import { grades } from "../../../../framework/constants/assignmentStatus";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage"
import ReportsPage from "../../../../framework/student/reportsPage";
// import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
// import TeacherManageClassPage from "../../../../framework/author/manageClassPage";
// import AssignmentsPage from "../../../../framework/student/assignmentsPage";
// import StudentTestPage from "../../../../framework/student/studentTestPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} :- Verify Bulk Assignment Actions In School Admin`, () => {
  const sideBarPage = new TeacherSideBar();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const lcbPage = new LiveClassboardPage();
  const testAssignPage = new TestAssignPage();
  const bulkActionPage =new AssignmentBulkActionsPage();
  const studAssignmentPage = new AssignmentsPage();
  const studeSideBar = new SidebarPage()
  const reportsPage = new ReportsPage()
  // const testLibraryPage = new TestLibrary();
  // const manageClass = new TeacherManageClassPage();
  // const startDate = new Date();
  // const endDate = new Date(new Date().setDate(startDate.getDate() + 30));
  let notOpenClasses;
  let inProgressClasses;
  let inGradinClasses;
  let doneClasses;
  let pausedClasses;


  const classData = {
    className: ["Auto_class_"],
    grade: grades.GRADE_10,
    subject: "Mathematics",
    standardSet: "Math - Common Core",
    testID: "5f3675476f69560008838126"
  };

  const studData = {
    username: "_auto_stud_",
    name: "autoStud",
    password: "snapwiz"
  };

  const Teacher = {
    email: "bulkassignment@automation.com",
    pass: "automation",
    adminEmail : "bulkadmin@snapwiz.com",
    adminPass : "automation"
  };

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
  }); */

  context(" > Bulk action on assignments", () => {

    before("Login into teacher", () => {
      cy.deleteAllAssignments(undefined, Teacher.email, Teacher.pass);
      cy.login("teacher", Teacher.email, Teacher.pass);
  
      notOpenClasses=[]
      for(let i=1;i<=30;i++){
        notOpenClasses.push(classData.className + i.toString())
      }
      assignTestWithoutOpening(notOpenClasses)
      cy.login("", Teacher.adminEmail, Teacher.adminPass);
    });


    it("> Open 'not started' assignments :", () => {
      sideBarPage.clickOnAssignment(false)
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      notOpenClasses.forEach((className, index)=>{
        if(index<10) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>9 && index<15) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickOpenActionButton("15 out of 15 classes Opened successfully.")

      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN,'15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS,'15')

      cy.login("teacher", Teacher.email, Teacher.pass);
      sideBarPage.clickOnAssignment(false)
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(1,15),'IN PROGRESS')
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(1,15),'IN PROGRESS')
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(16,30),'NOT OPEN')
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(16,30),'NOT OPEN')

      cy.login("student", getRandomStudent(1,15), studData.password);
      studAssignmentPage.verifyAssignmentIsOpen(classData.testID)

      cy.login("student", getRandomStudent(16,30), studData.password);
      studAssignmentPage.verifyAssignmentIslocked()
    });

    it("> Pause 'in progress' assignments :", () => {
      cy.login("", Teacher.adminEmail, Teacher.adminPass);
      sideBarPage.clickOnAssignment(false)
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      notOpenClasses.forEach((className, index)=>{
        if(index<10) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>9 && index<15) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickPauseActionButton("15 out of 15 classes Paused successfully.")

      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN,'15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS,'15')

      cy.login("teacher", Teacher.email, Teacher.pass);
      sideBarPage.clickOnAssignment(false)
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(1,15),'IN PROGRESS (PAUSED)')
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(1,15),'IN PROGRESS (PAUSED)')
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(16,30),'NOT OPEN')
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(16,30),'NOT OPEN')

      cy.login("student", getRandomStudent(1,15), studData.password);
      studAssignmentPage.verifyAssignmentIsPaused(classData.testID)

      cy.login("student", getRandomStudent(16,30), studData.password);
      studAssignmentPage.verifyAssignmentIslocked()
    });

    it("> Open Paused assignments :", () => {
      cy.login("", Teacher.adminEmail, Teacher.adminPass);
      sideBarPage.clickOnAssignment(false)
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      notOpenClasses.forEach((className, index)=>{
        if(index<10) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>9 && index<15) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickOpenActionButton("15 out of 15 classes Opened successfully.")

      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN,'15')
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS,'15')
    });

    it("> Pause 'in grading' assignments:", () => {
      notOpenClasses.forEach((className, index)=>{
        if(index<10) {
          sideBarPage.clickOnAssignment()
          authorAssignmentPage.filterByTestType('All')
          bulkActionPage.clickTestByID(classData.testID)
          bulkActionPage.clickIconByClassName(icons.LCB,className)
          lcbPage.checkSelectAllCheckboxOfStudent()
          lcbPage.clickOnMarkAsSubmit()
        } else if(index>9 && index<15) {
          sideBarPage.clickOnAssignment()
          authorAssignmentPage.filterByTestType('All')
          bulkActionPage.clickTestByID(classData.testID)
          bulkActionPage.clickNextPage()
          bulkActionPage.clickIconByClassName(icons.LCB,className)
          lcbPage.checkSelectAllCheckboxOfStudent()
          lcbPage.clickOnMarkAsSubmit()
        }
      })

      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      notOpenClasses.forEach((className, index)=>{
        if(index<10) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>9 && index<15) bulkActionPage.selectClassByClassName(className)
      })
      
      bulkActionPage.clickPauseActionButton("0 out of 15 classes Paused successfully.")
      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN,"15")
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_GRADING,'15')
    });

    it("> Open 'in-grading' assignments :", () => {
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      notOpenClasses.forEach((className, index)=>{
        if(index<10) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>9 && index<15) bulkActionPage.selectClassByClassName(className)
      })
      
      bulkActionPage.clickOpenActionButton("0 out of 15 classes Opened successfully.")
      /* inGradinClasses.forEach((className)=>{
        bulkActionPage.verifyAssignmentStatusOfClass(className,'DONE')
      }) */
      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN,"15")
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_GRADING,'15')
    })

    it("> Close 'in-grading' assignments :", () => {
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      notOpenClasses.forEach((className, index)=>{
        if(index<10) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>9 && index<15) bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickCloseActionButton("15 out of 15 classes Closed successfully.")
      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN,"15")
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE,'15')
    });

    it("> Mark as done for already Done assignments :", () => {
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      notOpenClasses.forEach((className, index)=>{
        if(index<10) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>9 && index<15) bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickDoneActionButton("0 out of 15 classes successfully updated.")
      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN,"15")
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE,'15')
    });

    it("> Open  already closed assignments :", () => {
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      notOpenClasses.forEach((className, index)=>{
        if(index<10) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>9 && index<15) bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickOpenActionButton("0 out of 15 classes Opened successfully.")
      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN,"15")
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE,'15')
    });

    it("> Pause already closed assignments :", () => {
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      notOpenClasses.forEach((className, index)=>{
        if(index<10) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>9 && index<15) bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickPauseActionButton("0 out of 15 classes Paused successfully.")
      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN,"15")
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE,'15')
    });

    it("> Close 'not started' assignments :", () => {
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>14 && index<20) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>19 && index<30) bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickCloseActionButton("0 out of 15 classes Closed successfully.")
      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN,"15")
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE,'15')
    });

    it("> Mark as done for 'not started' assignments :", () => {
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>14 && index<20) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>19 && index<30) bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickDoneActionButton("0 out of 15 classes successfully updated.")
      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN,"15")
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE,'15')
    });

    it("> Close 'Paused' assignments :", () => {
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>14 && index<20) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>19 && index<30) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickOpenActionButton("15 out of 15 classes Opened successfully.")

      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>14 && index<20) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>19 && index<30) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickPauseActionButton("15 out of 15 classes Paused successfully.")

      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>14 && index<20) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>19 && index<30) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickCloseActionButton("15 out of 15 classes Closed successfully.")

      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE,"30")
    });
    
  }); 

  context(" > Mark as done action for assignments", () => {

    before("Login into teacher", () => {
      cy.deleteAllAssignments(undefined, Teacher.email, Teacher.pass);
      cy.login("teacher", Teacher.email, Teacher.pass);
  
      inProgressClasses=[]
      for(let i=1;i<=30;i++){
        inProgressClasses.push(classData.className + i.toString())
      }
      assignOpenTest(inProgressClasses)
      cy.login("", Teacher.adminEmail, Teacher.adminPass);
    });

    it("> Close 'In progress' assignments :", () => {
      sideBarPage.clickOnAssignment(false)
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      inProgressClasses.forEach((className, index)=>{
        if(index<10) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      inProgressClasses.forEach((className, index)=>{
        if(index>9 && index<15) bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickCloseActionButton("15 out of 15 classes Closed successfully.")
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS,"15")
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE,'15')

    });

    it("> Mark as done for 'Paused' assignments :", () => {
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      bulkActionPage.clickNextPage()
      inProgressClasses.forEach((className, index)=>{
        if(index>14 && index<20) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      inProgressClasses.forEach((className, index)=>{
        if(index>19 && index<30) bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickPauseActionButton("15 out of 15 classes Paused successfully.")
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS,"15")
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE,'15')

      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      bulkActionPage.clickNextPage()
      inProgressClasses.forEach((className, index)=>{
        if(index>14 && index<20) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      inProgressClasses.forEach((className, index)=>{
        if(index>19 && index<30) bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickDoneActionButton("0 out of 15 classes successfully updated.")
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS,"15")
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE,'15')
    });

    it("> Mark as done for 'In progress' assignments :", () => {
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      bulkActionPage.clickNextPage()
      inProgressClasses.forEach((className, index)=>{
        if(index>14 && index<20) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      inProgressClasses.forEach((className, index)=>{
        if(index>19 && index<30) bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickOpenActionButton("15 out of 15 classes Opened successfully.")

      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      bulkActionPage.clickNextPage()
      inProgressClasses.forEach((className, index)=>{
        if(index>14 && index<20) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      inProgressClasses.forEach((className, index)=>{
        if(index>19 && index<30) bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickDoneActionButton("0 out of 15 classes successfully updated.")
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS,"15")
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE,'15')
    });

    it("> Mark as done for 'in grading' assignments:", () => {
      inProgressClasses.forEach((className, index)=>{
        if(index>14 && index<20) {
          sideBarPage.clickOnAssignment()
          authorAssignmentPage.filterByTestType('All')
          bulkActionPage.clickTestByID(classData.testID)
          bulkActionPage.clickNextPage()
          bulkActionPage.clickIconByClassName(icons.LCB,className)
          lcbPage.checkSelectAllCheckboxOfStudent()
          lcbPage.clickOnMarkAsSubmit()
        } else if(index>19 && index<30) {
          sideBarPage.clickOnAssignment()
          authorAssignmentPage.filterByTestType('All')
          bulkActionPage.clickTestByID(classData.testID)
          bulkActionPage.clickNextPage()
          bulkActionPage.clickNextPage()
          bulkActionPage.clickIconByClassName(icons.LCB,className)
          lcbPage.checkSelectAllCheckboxOfStudent()
          lcbPage.clickOnMarkAsSubmit()
        }
      })

      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      bulkActionPage.clickNextPage()
      inProgressClasses.forEach((className, index)=>{
        if(index>14 && index<20) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      inProgressClasses.forEach((className, index)=>{
        if(index>19 && index<30) bulkActionPage.selectClassByClassName(className)
      })
      
      bulkActionPage.clickDoneActionButton("15 out of 15 classes successfully updated.")
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE,"30")

      cy.login("teacher", Teacher.email, Teacher.pass);
      sideBarPage.clickOnAssignment(false)
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(15,30),'DONE')
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(15,30),'DONE')
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(15,30),'DONE')
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(15,30),'DONE')

      cy.login("student", getRandomStudent(15,30), studData.password);
      studeSideBar.clickOnGrades()
      reportsPage.getTestCardByTesyId(classData.testID)

      cy.login("student", getRandomStudent(15,30), studData.password);
      studeSideBar.clickOnGrades()
      reportsPage.getTestCardByTesyId(classData.testID)
    });
  })

  context(" > Bulk unassign of assignments", () => {

    before("Login into teacher", () => {
      cy.deleteAllAssignments(undefined, Teacher.email, Teacher.pass);
      cy.login("teacher", Teacher.email, Teacher.pass);
  
      notOpenClasses=[]
      for(let i=1;i<=30;i++){
        notOpenClasses.push(classData.className + i.toString())
      }
      assignTestWithoutOpening(notOpenClasses) 
      cy.login("", Teacher.adminEmail, Teacher.adminPass);
    });

    it("> Unassign 'not open' assignments :", () => {

      sideBarPage.clickOnAssignment(false)
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      notOpenClasses.forEach((className, index)=>{
        if(index<10) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>9 && index<15) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickUnassignActionButton("15 out of 15 classes Unassigned successfully.")
      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN,"15")
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS,"0")
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_GRADING,"0")
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE,"0")

      cy.login("student", getRandomStudent(0,15), studData.password);
      studAssignmentPage.verifyAbsenceOfTest(classData.testID)

      cy.login("student", getRandomStudent(0,15), studData.password);
      studAssignmentPage.verifyAbsenceOfTest(classData.testID)

    });

    it("> Unassign 'in progress' assignments :", () => {
      cy.login("", Teacher.adminEmail, Teacher.adminPass);
      sideBarPage.clickOnAssignment(false)
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      notOpenClasses.forEach((className, index)=>{
        if(index>14 && index<25) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>24) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickOpenActionButton("15 out of 15 classes Opened successfully.")

      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      notOpenClasses.forEach((className, index)=>{
        if(index>14 && index<25) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>24) bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickUnassignActionButton("15 out of 15 classes Unassigned successfully.")
      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN,"0")
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS,"0")
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_GRADING,"0")
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE,"0")
    })

    it("> Unassign 'paused' assignments :", () => {

      cy.login("teacher", Teacher.email, Teacher.pass);
  
      inProgressClasses=[]
      for(let i=1;i<=30;i++){
        inProgressClasses.push(classData.className + i.toString())
      }
      assignOpenTest(inProgressClasses) 

      cy.login("", Teacher.adminEmail, Teacher.adminPass);
      sideBarPage.clickOnAssignment(false)
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      notOpenClasses.forEach((className, index)=>{
        if(index<10) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>9 && index<15) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickPauseActionButton("15 out of 15 classes Paused successfully.")

      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      notOpenClasses.forEach((className, index)=>{
        if(index<10) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>9 && index<15) bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickUnassignActionButton("15 out of 15 classes Unassigned successfully.")
      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN,"0")
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS,"15")
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_GRADING,"0")
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE,"0")
    })

    it("> Unassign 'in grading' assignments :", () => {
      inProgressClasses.forEach((className, index)=>{
        if(index>14 && index<25) {
          sideBarPage.clickOnAssignment()
          authorAssignmentPage.filterByTestType('All')
          bulkActionPage.clickTestByID(classData.testID)
          bulkActionPage.clickIconByClassName(icons.LCB,className)
          lcbPage.checkSelectAllCheckboxOfStudent()
          lcbPage.clickOnMarkAsSubmit()
        } else if(index>24) {
          sideBarPage.clickOnAssignment()
          authorAssignmentPage.filterByTestType('All')
          bulkActionPage.clickTestByID(classData.testID)
          bulkActionPage.clickNextPage()
          bulkActionPage.clickIconByClassName(icons.LCB,className)
          lcbPage.checkSelectAllCheckboxOfStudent()
          lcbPage.clickOnMarkAsSubmit()
        }
      })
      
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      notOpenClasses.forEach((className, index)=>{
        if(index>14 && index<25) bulkActionPage.selectClassByClassName(className)
      })
      bulkActionPage.clickNextPage()
      notOpenClasses.forEach((className, index)=>{
        if(index>24) bulkActionPage.selectClassByClassName(className)
      })

      bulkActionPage.clickUnassignActionButton("15 out of 15 classes Unassigned successfully.")
      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN,"0")
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS,"0")
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_GRADING,"0")
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE,"0")
    })
  })

  function assignTestWithoutOpening(classes) {
    testAssignPage.visitAssignPageById(classData.testID);
    testAssignPage.selectMultipleCLasses(classes);
    const start = new Date();
    start.setDate(start.getDate() + 1);
    testAssignPage.setStartDate(start);
    testAssignPage.clickOnAssign();
  }

  function assignOpenTest(classes){
    testAssignPage.visitAssignPageById(classData.testID)
    testAssignPage.selectMultipleCLasses(classes)
    testAssignPage.clickOnAssign(); 
  }

  function assignTestAndGrade(classes){
    testAssignPage.visitAssignPageById(classData.testID)
    testAssignPage.selectMultipleCLasses(classes)
    testAssignPage.clickOnAssign();
    classes.forEach(className =>{
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.clickOnLCBbyClassAndTestId(classData.testID,className)
      lcbPage.checkSelectAllCheckboxOfStudent()
      lcbPage.clickOnMarkAsSubmit()
    })
  }

  function getRandomStudent(min, max) {
    return getRandomClass(min, max) + studData.username + getNumberInRange(1, 5);
  }

  function getRandomClass(min, max) {
    return classData.className + getNumberInRange(min, max);
  }

  function getNumberInRange(min,max){
    return (Math.floor(Math.random() * (max - min) + min)).toString();
  }

  function assignTestAndMarkAsDone(classes){
    testAssignPage.visitAssignPageById(classData.testID)
    testAssignPage.selectMultipleCLasses(classes)
    testAssignPage.clickOnAssign();
    classes.forEach(className =>{
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.clickOnLCBbyClassAndTestId(classData.testID,className)
      lcbPage.checkSelectAllCheckboxOfStudent()
      lcbPage.clickOnMarkAsSubmit()
      cy.wait(500)
      lcbPage.header.clickOnClose()
    })
  }

});