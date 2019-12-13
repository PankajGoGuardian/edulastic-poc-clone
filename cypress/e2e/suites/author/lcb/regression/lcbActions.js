import FileHelper from "../../../../framework/util/fileHelper";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import { studentSide } from "../../../../framework/constants/assignmentStatus";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TeacherSideBar from "../../../../framework/author/SideBarPage";

const { LCB_2 } = require("../../../../../fixtures/testAuthoring");
const questionData = require("../../../../../fixtures/questionAuthoring");

const test = new StudentTestPage();
const lcb = new LiveClassboardPage();
const authorAssignmentPage = new AuthorAssignmentPage();
const testLibrary = new TestLibrary();
const teacherSidebar = new TeacherSideBar();
const students = {
  1: {
    email: "student1.regression.automation@snapwiz.com",
    stuName: "1, student1"
  },
  2: {
    email: "student2.regression.automation@snapwiz.com",
    stuName: "regression, student2"
  },
  3: {
    email: "student3.regression.automation@snapwiz.com",
    stuName: "regression, student3"
  },
  4: {
    email: "student4.regression.automation@snapwiz.com",
    stuName: "regression, student4"
  },
  5: {
    email: "student5.regression.automation@snapwiz.com",
    stuName: "regression, student5"
  },
  6: {
    email: "student6.regression.automation@snapwiz.com",
    stuName: "regression, student6"
  },
  7: {
    email: "student7.regression.automation@snapwiz.com",
    stuName: "regression, student7"
  }
};

const lcbTestData = {
  className: "Regression Automation Class",
  teacher: "teacher1.regression.automation@snapwiz.com",
  student: students[1].email,
  password: "automation",
  assignmentName: "New Assessment LCB",
  attemptsData: [
    {
      attempt: { Q1: "right" },
      status: studentSide.GRADED,
      ...students[1]
    },
    {
      attempt: { Q1: "wrong" },
      status: studentSide.IN_PROGRESS,
      ...students[2]
    },
    {
      attempt: {
        Q1: "noattempt"
      },
      status: studentSide.NOT_STARTED,
      ...students[3]
    },
    {
      attempt: {
        Q1: "noattempt"
      },
      status: studentSide.NOT_STARTED,
      ...students[4]
    },
    {
      attempt: {
        Q1: "right"
      },
      status: studentSide.IN_PROGRESS,
      ...students[5]
    },
    {
      attempt: {
        Q1: "noattempt"
      },
      status: studentSide.NOT_STARTED,
      ...students[6]
    }
  ],
  submitStudent: {
    1: students[3],
    2: students[2]
  },
  absentStudent: {
    1: students[4],
    2: students[2]
  },
  removeStudent: {
    1: students[1],
    2: students[5],
    3: students[6]
  },
  addStudent: students[7]
};

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> LCB Actions`, () => {
  const {
    attemptsData,
    student,
    teacher,
    className,
    password,
    submitStudent,
    absentStudent,
    removeStudent,
    addStudent
  } = lcbTestData;
  let stuCount = attemptsData.length;
  const statsMap = {};
  const { itemKeys } = LCB_2;
  const studentAssignList = attemptsData.map(stu => stu.stuName);
  let questionTypeMap = {};

  before(" > create new assessment and assign", () => {
    questionTypeMap = lcb.getQuestionTypeMap(itemKeys, questionData, questionTypeMap);
    cy.deleteAllAssignments(student, teacher, password);
    cy.login("teacher", teacher, password);
    testLibrary.createTest("LCB_2").then(() => {
      testLibrary.clickOnAssign();
      // assign to specific students
      testLibrary.assignPage.selectClass(className);
      testLibrary.assignPage.clickOnSpecificStudent();
      testLibrary.assignPage.selectStudent(studentAssignList);
      testLibrary.assignPage.clickOnAssign();
    });
  });

  before(" > attempt by all students", () => {
    attemptsData.forEach(attempts => {
      const { attempt, email, stuName, status } = attempts;
      statsMap[stuName] = lcb.getScoreAndPerformance(attempt, questionTypeMap);
      statsMap[stuName].attempt = attempt;
      statsMap[stuName].status = status;
      test.attemptAssignment(email, status, attempt, questionTypeMap, password);
    });
  });

  describe("mark as absent", () => {
    beforeEach("login as teacher", () => {
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
    });

    it(" > marking 'Not Started' student to absent and verify", () => {
      // marking student as absent
      lcb.selectCheckBoxByStudentName(absentStudent[1].stuName);
      lcb.clickOnMarkAsAbsent();

      //  verify submitted count
      lcb.verifyAbsentCount(1);

      // verify student card
      lcb.verifyStudentCard(absentStudent[1].stuName, studentSide.ABSENT, "0 / 2", "0%", {
        Q1: "noattempt"
      });
      // verify student side assignment entry
      cy.login("student", submitStudent[1].email, password);
      test.assignmentPage.getAssignmentButton().should("not.be.visible");
    });

    it(" > marking 'In progress' student to absent and verify", () => {
      // marking student as absent
      lcb.selectCheckBoxByStudentName(absentStudent[2].stuName);
      lcb.clickOnMarkAsAbsent(false);
    });
  });

  describe("mark as submit", () => {
    beforeEach("login as teacher", () => {
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
    });

    it(" > marking 'Not Started' student as submitted and verify", () => {
      // verify submitted count before submit
      lcb.verifySubmittedCount(
        attemptsData.filter(eachStudent => eachStudent.status === studentSide.GRADED).length,
        stuCount
      );
      // submit the student
      lcb.selectCheckBoxByStudentName(submitStudent[1].stuName);
      lcb.clickOnMarkAsSubmit();

      // verify submitted count after submit
      lcb.verifySubmittedCount(
        attemptsData.filter(eachStudent => eachStudent.status === studentSide.GRADED).length + 1,
        stuCount
      );
      // verify student card after submit
      lcb.verifyStudentCard(submitStudent[1].stuName, studentSide.GRADED, "0 / 2", "0%", {
        Q1: "skip"
      });

      // verify student side assignment entry
      cy.login("student", submitStudent[1].email, password);
      test.assignmentPage.getAssignmentButton().should("not.be.visible");
    });

    it(" > marking 'In Progress' student as submitted and verify", () => {
      // submit the student
      lcb.selectCheckBoxByStudentName(submitStudent[2].stuName);
      lcb.clickOnMarkAsSubmit();

      // verify submitted count after submit
      lcb.verifySubmittedCount(
        attemptsData.filter(eachStudent => eachStudent.status === studentSide.GRADED).length + 2,
        stuCount
      );
      // verify student card after submit
      lcb.verifyStudentCard(submitStudent[2].stuName, studentSide.GRADED, "0 / 2", "0%", {
        Q1: "wrong"
      });

      // verify student side assignment entry
      cy.login("student", submitStudent[2].email, password);
      test.assignmentPage.getAssignmentButton().should("not.be.visible");
    });
  });

  describe("remove student", () => {
    before("login as teacher", () => {
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
    });

    it(" > removing 'Graded' student verify", () => {
      // select graded student
      lcb.selectCheckBoxByStudentName(removeStudent[1].stuName);
      // click on Remove and assert
      lcb.clickOnRemove(false);
    });

    it(" > removing 'Graded'+'In progress' student verify", () => {
      // select graded student
      lcb.selectCheckBoxByStudentName(removeStudent[1].stuName);
      // select inprogress student
      lcb.selectCheckBoxByStudentName(removeStudent[2].stuName);
      // click on Remove and assert
      lcb.clickOnRemove(false);
    });

    it(" > removing 'In progress' student verify", () => {
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      // select inprogress student
      lcb.selectCheckBoxByStudentName(removeStudent[2].stuName);
      // click on Remove and assert
      lcb.clickOnRemove();
      // assert student card should not be present
      lcb
        .getStudentCardByStudentName(removeStudent[2].stuName)
        .should("not.be.visible", "after removing student student card should not be present");
      // assert total student count
      lcb
        .getSubmitSummary()
        .should(
          "contain.text",
          `${--stuCount} Submitted`,
          "after remove 'In progress' student total student count should change"
        );

      // verify student side assignment entry
      cy.login("student", removeStudent[2].email, password);
      test.assignmentPage.getAssignmentButton().should("not.be.visible");
    });

    it(" > removing 'Not Started' student verify", () => {
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      // select inprogress student
      lcb.selectCheckBoxByStudentName(removeStudent[3].stuName);
      // click on Remove and assert
      lcb.clickOnRemove();
      // assert student card should not be present
      lcb
        .getStudentCardByStudentName(removeStudent[3].stuName)
        .should("not.be.visible", "after removing student student card should not be present");
      // assert total student count
      lcb
        .getSubmitSummary()
        .should(
          "contain.text",
          `${--stuCount} Submitted`,
          "after remove 'Not Started' student total student count should change"
        );

      // verify student side assignment entry
      cy.login("student", removeStudent[2].email, password);
      test.assignmentPage.getAssignmentButton().should("not.be.visible");
    });
  });

  describe("add student", () => {
    beforeEach("login as teacher", () => {
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
    });

    it(" > existing student should be disabled", () => {
      lcb.addOneStudent(students[1].email, false);
    });

    it(" > add new student and verify", () => {
      lcb.addOneStudent(addStudent.email);
      // assert student card should be present
      lcb
        .getStudentCardByStudentName(addStudent.stuName)
        .should("be.visible", "after adding student student card should be present");
      // assert total student count
      lcb
        .getSubmitSummary()
        .should("contain.text", `${++stuCount} Submitted`, "after adding student total student count should change");
      // verify student side assignment entry
      cy.login("student", addStudent.email, password);
      test.assignmentPage.getAssignmentButton().should("be.visible");
    });
  });
});
