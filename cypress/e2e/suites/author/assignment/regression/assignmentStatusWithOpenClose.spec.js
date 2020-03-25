import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import { teacherSide } from "../../../../framework/constants/assignmentStatus";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import FileHelper from "../../../../framework/util/fileHelper";

const teacherSidebar = new TeacherSideBar();
const studentAssignment = new AssignmentsPage();
const authorAssignmentPage = new AuthorAssignmentPage();
const lcb = new LiveClassboardPage();
const testLibrary = new TestLibrary();
const students = {
  "1": {
    email: "student.1.assignmentsstatus@snapwiz.com",
    stuName: "assignmentsstatus, student.1"
  },
  "2": {
    email: "student.2.assignmentsstatus@snapwiz.com",
    stuName: "assignmentsstatus, student.2"
  }
};

const testingData = {
  className: "Automation Class - assignmentsstatus teacher.1",
  teacher: "teacher.1.assignmentsstatus@snapwiz.com",
  student: students[1].email,
  password: "snapwiz",
  assignmentName: "New Assessment LCB"
};

let testId;

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Assignment Status with open close`, () => {
  const { student, teacher, className, password } = testingData;

  before(" > create new assessment and assign", () => {
    cy.login("teacher", teacher, password);
    // creating test
    testLibrary.createTest("LCB_2").then(id => {
      testId = id;
    });
  });

  describe("grade release - automatic", () => {
    before("login as teacher", () => {
      cy.deleteAllAssignments(student, teacher, password);
      cy.login("teacher", teacher, password);
      cy.visit(`/author/assignments/${testId}`);
      cy.wait("@assignment");
      cy.wait(2000);
      // assign to specific students
      testLibrary.assignPage.selectClass(className);
      testLibrary.assignPage.clickOnSpecificStudent();
      testLibrary.assignPage.selectStudent(students[1].stuName);
      testLibrary.assignPage.clickOnAssign();
      cy.contains("Success!");
      teacherSidebar.clickOnAssignment();
    });

    it(`> verify the assignment status is ${teacherSide.IN_PROGRESS}`, () => {
      // teacherSidebar.clickOnAssignment();
      authorAssignmentPage.verifyStatus(teacherSide.IN_PROGRESS);
      authorAssignmentPage.verifySubmitted("0 of 1");
      authorAssignmentPage.verifyGraded("0");
    });

    it(`> submit all students and status should be ${teacherSide.IN_GRADING} `, () => {
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      // marking student as submit
      lcb.selectCheckBoxByStudentName(students[1].stuName);
      lcb.clickOnMarkAsSubmit();
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.verifyStatus(teacherSide.IN_GRADING);
      authorAssignmentPage.verifySubmitted("1 of 1");
      authorAssignmentPage.verifyGraded("1");
    });

    it(` > add new student to the class before due date , status should be ${teacherSide.IN_PROGRESS}`, () => {
      teacherSidebar.clickOnDashboard();
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.addOneStudent(students[2].email);

      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.verifyStatus(teacherSide.IN_PROGRESS);
      authorAssignmentPage.verifySubmitted("1 of 2");
      authorAssignmentPage.verifyGraded("1");
    });

    it(` > pause the assignment, status should be ${teacherSide.IN_PROGRESS} (${teacherSide.PAUSED})`, () => {
      teacherSidebar.clickOnDashboard();
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.header.clickOnOpenPause(true);

      // verify assignent is paused
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.verifyStatus(`${teacherSide.IN_PROGRESS} (${teacherSide.PAUSED})`);
      authorAssignmentPage.verifySubmitted("1 of 2");
      authorAssignmentPage.verifyGraded("1");

      // verify student side that student is not able to take assignment
      cy.login("student", students[2].email, password);
      studentAssignment.verifyAssignmentIslocked();
      studentAssignment.getStatus().should("contain.text", teacherSide.PAUSED);
    });

    it(` > open the assignment, status should be ${teacherSide.IN_PROGRESS}`, () => {
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.header.clickOnOpenPause();
      // verify assignent is paused
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.verifyStatus(`${teacherSide.IN_PROGRESS}`);
      authorAssignmentPage.verifySubmitted("1 of 2");
      authorAssignmentPage.verifyGraded("1");
    });

    it(` > close the assignment, status should be ${teacherSide.DONE}`, () => {
      teacherSidebar.clickOnDashboard();
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.header.clickOnClose();
      // verify assignent is paused
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.verifyStatus(`${teacherSide.DONE}`);
      authorAssignmentPage.verifySubmitted("1 of 2");
      authorAssignmentPage.verifyGraded("1");
    });

    it(` > redirect from DONE, status should be ${teacherSide.IN_PROGRESS}`, () => {
      teacherSidebar.clickOnDashboard();
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.selectCheckBoxByStudentName(students[1].stuName);
      lcb.clickOnRedirect();
      lcb.clickOnRedirectSubmit();
      // verify assignent is paused
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.verifyStatus(`${teacherSide.IN_PROGRESS}`);
      authorAssignmentPage.verifySubmitted("0 of 2");
      authorAssignmentPage.verifyGraded("0");
    });

    it(` > unassign`, () => {
      teacherSidebar.clickOnDashboard();
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.header.clickOnUnassign();
      // verify assignent is paused
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.getStatus().should("have.length", 0);
    });

    it(` > scheduled for future date, should be ${teacherSide.NOT_OPEN} `, () => {
      cy.deleteAllAssignments(student, teacher, password);
      cy.login("teacher", teacher, password);
      cy.visit(`/author/assignments/${testId}`);
      cy.wait("@assignment");
      cy.wait(2000).then(() => {
        // assign to specific students
        testLibrary.assignPage.selectClass(className);
        testLibrary.assignPage.clickOnSpecificStudent();
        testLibrary.assignPage.selectStudent(students[1].stuName);

        let start = new Date();
        start.setMinutes(start.getMinutes() + 10);
        testLibrary.assignPage.setStartDate(start);
        testLibrary.assignPage.clickOnAssign();
        cy.contains("Success!");
        teacherSidebar.clickOnAssignment();
        authorAssignmentPage.verifyStatus(`${teacherSide.NOT_OPEN}`);

        // open manually
        authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
        lcb.header.clickOnOpen();
        teacherSidebar.clickOnAssignment();
        authorAssignmentPage.verifyStatus(`${teacherSide.IN_PROGRESS}`);
      });
    });
    // EV-11241-> This will be done manually as it takes longer time
    /*   it(` > due date over, should be ${teacherSide.DONE} `, () => {
      cy.deleteAllAssignments(student, teacher, password);
      cy.login("teacher", teacher, password);
      cy.visit(`/author/assignments/${testId}`);
      cy.wait("@assignment");
      cy.wait(2000);
      // assign to specific students
      testLibrary.assignPage.selectClass(className);
      testLibrary.assignPage.clickOnSpecificStudent();
      testLibrary.assignPage.selectStudent(students[1].stuName);

      cy.wait(1).then(() => {
        let endDate = new Date();
        endDate.setSeconds(endDate.getSeconds() + 20);
        testLibrary.assignPage.setEndDate(endDate);
      });

      testLibrary.assignPage.clickOnAssign();
      cy.contains("Success!");
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.verifyStatus(`${teacherSide.IN_PROGRESS}`);

      // verify live assginment status
      cy.wait(60000); // waiting for assignment status to update
      teacherSidebar.clickOnDashboard();
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.verifyStatus(`${teacherSide.DONE}`);
    }); */
  });

  describe("grade release - manually", () => {
    before("login as teacher", () => {
      cy.deleteAllAssignments(student, teacher, password);
      cy.login("teacher", teacher, password);
      cy.visit(`/author/assignments/${testId}`);
      cy.wait("@assignment");
      cy.wait(2000);
      // assign to specific students
      testLibrary.assignPage.selectClass(className);
      testLibrary.assignPage.clickOnSpecificStudent();
      testLibrary.assignPage.selectStudent(students[1].stuName);
      testLibrary.assignPage.showOverRideSetting();
      testLibrary.assignPage.setMarkAsDoneToManual();
      testLibrary.assignPage.clickOnAssign();
      cy.contains("Success!");
      teacherSidebar.clickOnAssignment();
    });

    it(`> verify the assignment status is ${teacherSide.IN_PROGRESS}`, () => {
      authorAssignmentPage.verifyStatus(teacherSide.IN_PROGRESS);
      authorAssignmentPage.verifySubmitted("0 of 1");
      authorAssignmentPage.verifyGraded("0");
    });

    it(` > close the assignment, status should be ${teacherSide.IN_GRADING}`, () => {
      teacherSidebar.clickOnDashboard();
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.header.clickOnClose();
      // verify assignent is paused
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.verifyStatus(`${teacherSide.IN_GRADING}`);
      authorAssignmentPage.verifySubmitted("0 of 1");
      authorAssignmentPage.verifyGraded("0");
    });

    it(` > mark as done, status shoudl be ${teacherSide.DONE}`, () => {
      teacherSidebar.clickOnDashboard();
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.header.clickOnMarkAsDone();
      // verify assignent is paused
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.verifyStatus(`${teacherSide.DONE}`);
    });
  });
});
