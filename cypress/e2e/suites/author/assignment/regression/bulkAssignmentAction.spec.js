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
// import AssignmentsPage from "../../../../framework/student/assignmentsPage";
// import TeacherManageClassPage from "../../../../framework/author/manageClassPage";
// import StudentTestPage from "../../../../framework/student/studentTestPage";
// import TestLibrary from "../../../../framework/author/tests/testLibraryPage";

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
  // const startDate = new Date();
  // const manageClass = new TeacherManageClassPage();
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

  context(" > UI and filter tests", () => {

    before(" > Login into teacher", () => {
      cy.deleteAllAssignments(undefined, Teacher.email, Teacher.pass);
      cy.login("teacher", Teacher.email, Teacher.pass);

      // Assign test without opening
      notOpenClasses = []
      for(let i=1;i<=5;i++){
        notOpenClasses.push(classData.className + i.toString())
      }
      assignTestWithoutOpening(notOpenClasses)

      // Assign test and open - in progress
      inProgressClasses = []
      for(let i=6;i<=10;i++){
        inProgressClasses.push(classData.className + i.toString())
      }
      assignOpenTest(inProgressClasses)

      // Assign test and grade - in grading
      inGradinClasses = []
      for(let i=11;i<=15;i++){
        inGradinClasses.push(classData.className + i.toString())
      }
      assignTestAndGrade(inGradinClasses)

      // Assign test and close - Done
      doneClasses = []
      for(let i=16;i<=20;i++){
        doneClasses.push(classData.className + i.toString())
      }
      assignTestAndMarkAsDone(doneClasses)
    });

    it("> Assignment Page data", () => {
      cy.login("", Teacher.adminEmail, Teacher.adminPass);
      sideBarPage.clickOnAssignment(false)
      authorAssignmentPage.filterByTestType('All')
      // ***************** bug
      bulkActionPage.verifyAssignmentAttributesTestId(classData.testID,'Default Test Automation','20','150','5','5','5','5')
    });

    it("> Select all classes",() =>{
      bulkActionPage.clickTestByID(classData.testID)
      bulkActionPage.selectAllClassesCheckBox()
      bulkActionPage.verifyAllClassesSelected()
      bulkActionPage.verifyTotalClassesSelected('20')

      bulkActionPage.selectAllClassesCheckBox(false)
      bulkActionPage.verifyAllClassesSelected(false)
    })

    it("> Select specific classes",() =>{
      bulkActionPage.selectClassByClassName('Auto_class_1',true)
      bulkActionPage.selectClassByClassName('Auto_class_2',true)
      bulkActionPage.verifyTotalClassesSelected('2')
      bulkActionPage.clickNextPage()
      bulkActionPage.selectClassByRowNumber(0)
      bulkActionPage.selectClassByRowNumber(1)
      bulkActionPage.verifyTotalClassesSelected('4')
    })

    it("> Not open filter", () => {
      bulkActionPage.verifyNumberofClassesInFilter(filter.NOT_OPEN,notOpenClasses.length.toString())
      bulkActionPage.filterBy(filter.NOT_OPEN)
      bulkActionPage.verifyNumberofClassesFiltered('5')
      bulkActionPage.verifyFilteredClasses(notOpenClasses)
      bulkActionPage.verifyFilterAndStatusColor(filter.NOT_OPEN)

      bulkActionPage.filterBy(filter.ALL)
      bulkActionPage.verifyNumberofClassesFiltered('10')
    })

    it("> In Progress filter", () => {
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS,inProgressClasses.length.toString())
      bulkActionPage.filterBy(filter.IN_PROGRESS)
      bulkActionPage.verifyNumberofClassesFiltered('5')
      bulkActionPage.verifyFilteredClasses(inProgressClasses)
      bulkActionPage.verifyFilterAndStatusColor(filter.IN_PROGRESS)

      bulkActionPage.filterBy(filter.ALL)
      bulkActionPage.verifyNumberofClassesFiltered('10')
    })

    it("> In Grading filter", () => {
      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_GRADING,inGradinClasses.length.toString())
      bulkActionPage.filterBy(filter.IN_GRADING)
      bulkActionPage.verifyNumberofClassesFiltered('5')
      bulkActionPage.verifyFilteredClasses(inGradinClasses)
      bulkActionPage.verifyFilterAndStatusColor(filter.IN_GRADING)

      bulkActionPage.filterBy(filter.ALL)
      bulkActionPage.verifyNumberofClassesFiltered('10')
    })

    it("> Done filter", () => {
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE,doneClasses.length.toString())
      bulkActionPage.filterBy(filter.DONE)
      bulkActionPage.verifyNumberofClassesFiltered('5')
      bulkActionPage.verifyFilteredClasses(doneClasses)
      bulkActionPage.verifyFilterAndStatusColor(filter.DONE)

      bulkActionPage.filterBy(filter.ALL)
      bulkActionPage.verifyNumberofClassesFiltered('10')
    })

    it("> Navigate to LCB", () => {
      bulkActionPage.clickIconByClassName(icons.LCB,notOpenClasses[0])
      lcbPage.checkClassName(notOpenClasses[0])
    })

    it("> Navigate to Express grader", () => {
      sideBarPage.clickOnAssignment()
      bulkActionPage.clickTestByID(classData.testID)
      bulkActionPage.clickIconByClassName(icons.EXPRESS_GRADER,notOpenClasses[0])
      lcbPage.checkClassName(notOpenClasses[0])
    })

    it("> Navigate to Reports", () => {
      sideBarPage.clickOnAssignment()
      bulkActionPage.clickTestByID(classData.testID)
      bulkActionPage.clickIconByClassName(icons.REPORTS,notOpenClasses[0])
      lcbPage.checkClassName(notOpenClasses[0])
    })
  });

  context(" > Bulk action on all classes", () => {

    before("Login into teacher", () => {
      cy.deleteAllAssignments(undefined, Teacher.email, Teacher.pass);
      cy.login("teacher", Teacher.email, Teacher.pass);
  
      notOpenClasses=[]
      for(let i=1;i<=30;i++){
        notOpenClasses.push(classData.className + i.toString())
      }
      assignTestWithoutOpening(notOpenClasses)
    });

    it("> Open all assignments :", () => {
      cy.login("", Teacher.adminEmail, Teacher.adminPass);
      sideBarPage.clickOnAssignment(false)
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      bulkActionPage.selectAllClassesCheckBox()
      bulkActionPage.clickOpenActionButton("30 out of 30 classes Opened successfully.")

      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS,notOpenClasses.length.toString())

      cy.login("teacher", Teacher.email, Teacher.pass);
      sideBarPage.clickOnAssignment(false)
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(1,30),'IN PROGRESS')
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(1,30),'IN PROGRESS')
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(1,30),'IN PROGRESS')
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(1,30),'IN PROGRESS')

      cy.login("student", getRandomStudent(1,30), studData.password);
      studAssignmentPage.verifyAssignmentIsOpen(classData.testID)

      cy.login("student", getRandomStudent(1,30), studData.password);
      studAssignmentPage.verifyAssignmentIsOpen(classData.testID)
    });

    it("> Pause all assignments :", () => {
      cy.login("", Teacher.adminEmail, Teacher.adminPass);
      sideBarPage.clickOnAssignment(false)
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      bulkActionPage.selectAllClassesCheckBox()
      bulkActionPage.clickPauseActionButton("30 out of 30 classes Paused successfully.")

      bulkActionPage.verifyNumberofClassesInFilter(filter.IN_PROGRESS,notOpenClasses.length.toString())

      cy.login("teacher", Teacher.email, Teacher.pass);
      sideBarPage.clickOnAssignment(false)
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(1,30),'IN PROGRESS (PAUSED)')
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(1,30),'IN PROGRESS (PAUSED)')
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(1,30),'IN PROGRESS (PAUSED)')
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(1,30),'IN PROGRESS (PAUSED)')

      cy.login("student", getRandomStudent(1,30), studData.password);
      studAssignmentPage.verifyAssignmentIsPaused(classData.testID)

      cy.login("student", getRandomStudent(1,30), studData.password);
      studAssignmentPage.verifyAssignmentIsPaused(classData.testID)
    });

    it("> Close all assignments :", () => {
      cy.login("", Teacher.adminEmail, Teacher.adminPass);
      sideBarPage.clickOnAssignment(false)
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      // bulkActionPage.selectAllClassesCheckBox()
      // bulkActionPage.clickOpenActionButton("30 out of 30 classes Opened successfully.")

      bulkActionPage.selectAllClassesCheckBox()
      bulkActionPage.clickCloseActionButton("30 out of 30 classes Closed successfully.")
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE,notOpenClasses.length.toString())

      cy.login("teacher", Teacher.email, Teacher.pass);
      sideBarPage.clickOnAssignment(false)
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(1,30),'DONE')
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(1,30),'DONE')
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(1,30),'DONE')
      authorAssignmentPage.verifyAssignmentStatusOfClass(classData.testID,getRandomClass(1,30),'DONE')

      cy.login("student", getRandomStudent(1,30), studData.password);
      studeSideBar.clickOnGrades()
      reportsPage.getTestCardByTesyId(classData.testID)

      cy.login("student", getRandomStudent(1,30), studData.password);
      studeSideBar.clickOnGrades()
      reportsPage.getTestCardByTesyId(classData.testID)
    });

    it("> Unassign all assignments :", () => {
      cy.login("", Teacher.adminEmail, Teacher.adminPass);
      sideBarPage.clickOnAssignment(false)
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickTestByID(classData.testID)
      bulkActionPage.selectAllClassesCheckBox()
      bulkActionPage.clickUnassignActionButton("30 out of 30 classes Unassigned successfully.")
      bulkActionPage.verifyNumberofClassesInFilter(filter.DONE,"0")
      //
    });

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
    return testAssignPage.getRandomClass(min, max) + studData.username + testAssignPage.getNumberInRange(1, 5);
  }

  function getRandomClass(min, max) {
    return classData.className + testAssignPage.getNumberInRange(min, max);
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
