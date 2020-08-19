import FileHelper from "../../../../framework/util/fileHelper";
import Helpers from "../../../../framework/util/Helpers";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import TeacherManageClassPage from "../../../../framework/author/manageClassPage";
import { grades, studentSide } from "../../../../framework/constants/assignmentStatus";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import ManagePage from "../../../../framework/student/managePage";
import SidebarPage from "../../../../framework/student/sidebarPage";
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";

const questionData = require("../../../../../fixtures/questionAuthoring");

const sideBar = new TeacherSideBar();
const manageClass = new TeacherManageClassPage();
const studentTestPage = new StudentTestPage();
const studentManageClassPage = new ManagePage();
const studentSideBar = new SidebarPage();
const testLibrary = new TestLibrary();
const authorAssignmentPage = new AuthorAssignmentPage();
const lcb = new LiveClassboardPage();
const itemKeys = ["MCQ_TF.default"];
const questionTypeMap = lcb.getQuestionTypeMap(itemKeys, questionData, {});
const random = Helpers.getRamdomString().toLowerCase();
const classData = {
  className: `smoke create new class-${random}`,
  grade: grades.GRADE_10,
  subject: "Mathematics",
  standardSet: "Math - Common Core"
};

const allRight = { Q1: "right" };
const studentattempt = { attempt: allRight, ...lcb.getScoreAndPerformance(allRight, questionTypeMap) };

const usersData = {
  teacher: "unarchiveTeacher1@gmail.com",
  stuemail: Helpers.getRamdomEmail().toLowerCase(),
  stuname: "archiveStu01",
  password: "snapwiz",
  status: studentSide.GRADED
};
let testId;

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Unarchive Class`, () => {
  before("Create new assessment and assign", () => {
    cy.deleteAllAssignments(usersData.stuemail, usersData.teacher, usersData.password);
    cy.login("teacher", usersData.teacher, usersData.password);
  });
  before("Create class and add one student", () => {
    const { className, grade, subject, standardSet } = classData;
    const startDate = new Date();
    const endDate = new Date(new Date().setDate(startDate.getDate() + 30));
    sideBar.clickOnManageClass();
    manageClass.clickOnCreateClass();
    manageClass.fillClassDetails(className, startDate, endDate, grade, subject, standardSet);
    manageClass.clickOnSaveClass();
    manageClass.clickOnAddStudent();
    manageClass.fillStudentDetails(usersData.stuemail, usersData.stuname, usersData.password);
    manageClass.clickOnAddUserButton().then(() => {
      cy.wait(2000);
      sideBar.clickOnManageClass();
      manageClass.getClassRowDetails(classData.className).then(cls => {
        expect(cls.students).to.eq("1");
      });
    });
  });
  before("Create test and assign", () => {
    testLibrary.createTest().then(id => {
      testId = id;
      testLibrary.clickOnAssign();
      testLibrary.assignPage.selectClass(classData.className);
      testLibrary.assignPage.clickOnAssign();
    });
  });
  context("Archive a class and attempt as student", () => {
    it("Archive class", () => {
      sideBar.clickOnManageClass();
      manageClass.getClassDetailsByName(classData.className);
      manageClass.clickHeaderDropDown();
      manageClass.unarchiveButtonNotVisible();
      manageClass.archieveClass();
    });

    // Student part of archived class can attempt the assignment
    it("Attempt by student", () => {
      studentTestPage.attemptAssignment(
        usersData.stuemail,
        usersData.status,
        studentattempt.attempt,
        questionTypeMap,
        usersData.password,
        "CLASS_ASSESSMENT"
      );
    });

    // Archived class will be visbile in student manage class page in Archive Class tab
    it("Verify archived class in student manage class page", () => {
      studentSideBar.clickOnManageClass();
      studentManageClassPage.selectClassType("ARCHIVE");
      studentManageClassPage.verifyShowArchiveClass(1);
      studentManageClassPage.validateclassName(classData.className);
      studentManageClassPage.selectClassType("ACTIVE");
    });

    // Teacher will be able to see student attempt in LCB for archived classes
    it("Verify student card view after attempt", () => {
      cy.login("teacher", usersData.teacher, usersData.password);
      sideBar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.verifyStudentCard(
        usersData.stuname,
        usersData.status,
        studentattempt.score,
        studentattempt.perf,
        studentattempt.attempt,
        usersData.stuemail
      );
    });
  });
  context("Unarchive and assign the test", () => {
    before("Create new assessment and assign", () => {
      cy.deleteAllAssignments(usersData.stuemail, usersData.teacher, usersData.password);
      cy.login("teacher", usersData.teacher, usersData.password);
    });

    // Unacrhived class will not be displayed in test assign page - class selection drop down
    it("Visibility of test in assign page before unarchiving", () => {
      testLibrary.assignPage.visitAssignPageById(`${testId}`);
      testLibrary.assignPage.verifyNoClassesInDropDown(classData.className);
    });

    it("Unarchive class", () => {
      sideBar.clickOnAssignment();
      sideBar.clickOnManageClass();
      manageClass.clickOnClassStatusDropdown();
      manageClass.selectArchieveClass();
      manageClass.gotoLastPage();
      manageClass.unArchieveClassByName(classData.className);
    });

    it("Assign a test and attempt from student", () => {
      testLibrary.assignPage.visitAssignPageById(`${testId}`);
      testLibrary.assignPage.selectClass(classData.className);
      testLibrary.assignPage.clickOnAssign();
    });

    it("Attempt from student", () => {
      studentTestPage.attemptAssignment(
        usersData.stuemail,
        usersData.status,
        studentattempt.attempt,
        questionTypeMap,
        usersData.password,
        "CLASS_ASSESSMENT"
      );
    });

    it("Verify Active Classes after unarchiving", () => {
      studentSideBar.clickOnManageClass();
      studentManageClassPage.selectClassType("ACTIVE");
      studentManageClassPage.verifyShowActiveClass(1);
      studentManageClassPage.validateclassName(classData.className);
    });
  });

  // Teacher can not unarchive a class which is part of old school.
  // In order to unarchive he have to rejoin the class.

  context("Unarchive class from a old school which teacher is not part of", () => {
    const archivedClass = "class - bulk school 2";

    before("log in as teacher", () => {
      cy.login("teacher", usersData.teacher, usersData.password);
    });
    it("Unarchive a class from old school", () => {
      sideBar.clickOnManageClass();
      manageClass.selectArchieveClass();
      manageClass.selectActiveClass();
      manageClass.selectArchieveClass();
      manageClass.unArchieveClassByName(archivedClass, false);
    });
  });
});
