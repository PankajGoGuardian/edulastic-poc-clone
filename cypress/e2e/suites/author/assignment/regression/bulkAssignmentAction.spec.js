import TestAssignPage from "../../../../framework/author/tests/testDetail/testAssignPage";
//import AssignmentsPage from "../../../../framework/student/assignmentsPage";
//import StudentTestPage from "../../../../framework/student/studentTestPage";
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import AssignmentBulkActionsPage, {filter,icons} from "../../../../framework/author/assignments/AssignmentBulkActionsPage";


import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import FileHelper from "../../../../framework/util/fileHelper";
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import { grades } from "../../../../framework/constants/assignmentStatus";
import TeacherManageClassPage from "../../../../framework/author/manageClassPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage"

describe(`${FileHelper.getSpecName(Cypress.spec.name)} :- Verify Bulk Assignment Actions In School Admin`, () => {
  const sideBarPage = new TeacherSideBar();
  //const manageClass = new TeacherManageClassPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const lcbPage = new LiveClassboardPage();
  const testAssignPage = new TestAssignPage();
  //const startDate = new Date();
  const bulkActionPage =new AssignmentBulkActionsPage();
  //const testLibraryPage = new TestLibrary();
  //const endDate = new Date(new Date().setDate(startDate.getDate() + 30));
  let notOpenClasses;
  let inProgressClasses;
  let inGradinClasses;
  let doneClasses;


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

  before(" > Login into teacher", () => {
    cy.deleteAllAssignments(undefined, Teacher.email, Teacher.pass);
    cy.login("teacher", Teacher.email, Teacher.pass);
    // Create classes and create test - to be uncommented when test data needs to be created
    /* for (let i = 1; i <= 30; i++) {
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
      classData.testID = id */
  }); 

  context(" > UI and filter tests", () => {
    it("> Assignment Page data", () => {
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

      cy.login("", Teacher.adminEmail, Teacher.adminPass);
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      // ***************** bug
      bulkActionPage.verifyAssignmentAttributesTestId(classData.testID,'Default Test Automation','20','20','12','0','0','4')
    });

    it("> Select all classes",() =>{
      cy.login("", Teacher.adminEmail, Teacher.adminPass);
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')

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
      doneClasses=['Auto_class_16','Auto_class_17','Auto_class_18','Auto_class_19','Auto_class_20']
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

  /* context(" > Validations in Bulk assignment actions page", () => {
    it("> ", () => {
      testAssignPage.visitAssignPageById(classData.testID)
      let classes = []
      for(let i=1;i<=30;i++){
        classes.push(classData.className + i.toString())
      }
      testAssignPage.selectMultipleCLasses(classes)
      const start = new Date();
      start.setDate(start.getDate() + 1);
      testAssignPage.setStartDate(start)
      testAssignPage.clickOnAssign()
      cy.login("", Teacher.adminEmail, Teacher.adminPass);
      sideBarPage.clickOnAssignment()
      authorAssignmentPage.filterByTestType('All')
      bulkActionPage.clickAssignmentByID(classData.testID)
      bulkActionPage.selectAllClassesCheckBox()
      cy.server(); */
       // cy.route("GET", "**/assignments/district/**").as("bulkProcess");
      /* bulkActionPage.clickOpenActionButton()
      cy.wait("@bulkProcess")
      bulkActionPage.verifyMessage("30 out of 30 classes Opened successfully.")
    }); 
  }); */

  function assignTestWithoutOpening(classes){
      testAssignPage.visitAssignPageById(classData.testID)
      testAssignPage.selectMultipleCLasses(classes)
      const start = new Date();
      start.setDate(start.getDate() + 1);
      testAssignPage.setStartDate(start)
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
