import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import { studentSide } from "../../../../framework/constants/assignmentStatus";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";

const questionData = require("../../../../../fixtures/questionAuthoring");

const testLibrary = new TestLibrary();
const lcb = new LiveClassboardPage();
const itemKeys = ["MCQ_TF.default"];
const questionTypeMap = lcb.getQuestionTypeMap(itemKeys, questionData, {});
const studentTestPage = new StudentTestPage();

const students = [
  {
    email: "specific_automation_1",
    name: "student_1, specific"
  },
  {
    email: "specific_automation_2",
    name: "student_2, specific"
  },
  {
    email: "specific_automation_3",
    name: "student_3, specific"
  }
];
const specificStudents = [students[0].name, students[1].name];

const attemptData = [
  {
    stuName: students[0].name,
    attempt: {
      Q1: "True"
    },
    status: "Submitted"
  },
  {
    stuName: students[1].name,
    attempt: {
      Q1: "False"
    },
    status: studentSide.SUBMITTED
  },
  {
    stuName: students[2].name,
    attempt: {
      Q1: "True"
    },
    status: studentSide.SUBMITTED
  }
];
const className = "specfic class";
const testId = "5f48e397afd15c00084a09da";
const teacher = "specifcstudents@automation.com";
const password = "snapwiz";

context("Select all students and assign", () => {
  before("log in as teacher", () => {
    cy.deleteAllAssignments(students[1].email, teacher, password);
    cy.login("teacher", teacher, password);
  });

  before("Create test and assign", () => {
    testLibrary.assignPage.visitAssignPageById(`${testId}`);
    /* testLibrary.createTest().then(id => {
            testId = id;
            testLibrary.clickOnAssign();
            testLibrary.assignPage.selectClass(className);
            testLibrary.assignPage.clickOnAssign();
        }); */
  });

  it("Select all check box", () => {
    testLibrary.assignPage.selectClass(className);
    testLibrary.assignPage.selectStudent("", true);
    testLibrary.assignPage.clickOnAssign();
  });
  it("Attempt from all students", () => {
    students.forEach((st, index) => {
      const { attempt } = attemptData[index];
      studentTestPage.attemptAssignment(
        students[index].email,
        studentSide.SUBMITTED,
        attempt,
        questionTypeMap,
        password,
        "CLASS_ASSESSMENT"
      );
    });
  });
});
context("Select all studnets - one by one", () => {
  before("log in as teacher", () => {
    cy.deleteAllAssignments(students[1].email, teacher, password);
    cy.login("teacher", teacher, password);
    testLibrary.assignPage.visitAssignPageById(`${testId}`);
  });

  it("Select students one by one", () => {
    const allstudent = [students[0].name, students[1].name, students[2].name];
    testLibrary.assignPage.selectClass(className);
    testLibrary.assignPage.selectStudent(allstudent);
    testLibrary.assignPage.clickOnAssign();
  });

  it("Attempt from assigned students", () => {
    students.forEach((st, index) => {
      const { attempt } = attemptData[index];
      studentTestPage.attemptAssignment(
        students[index].email,
        studentSide.SUBMITTED,
        attempt,
        questionTypeMap,
        password,
        "CLASS_ASSESSMENT"
      );
    });
  });
});

context("Select specific students and assign the test", () => {
  before("log in as teacher", () => {
    cy.deleteAllAssignments(students[1].email, teacher, password);
    cy.login("teacher", teacher, password);
    testLibrary.assignPage.visitAssignPageById(`${testId}`);
  });

  it("Assign to specific students", () => {
    testLibrary.assignPage.selectClass(className);
    testLibrary.assignPage.selectStudent(specificStudents);
    testLibrary.assignPage.clickOnAssign();
  });

  it("Attempt from assigned students", () => {
    specificStudents.forEach((st, index) => {
      const { attempt } = attemptData[index];
      studentTestPage.attemptAssignment(
        students[index].email,
        studentSide.SUBMITTED,
        attempt,
        questionTypeMap,
        password,
        "CLASS_ASSESSMENT"
      );
    });
  });
});

context("Unselect all studnets and asisgn", () => {
  before("log in as teacher", () => {
    cy.deleteAllAssignments(students[1].email, teacher, password);
    cy.login("teacher", teacher, password);
    testLibrary.assignPage.visitAssignPageById(`${testId}`);
  });

  it("Unselect all students and assign", () => {
    testLibrary.assignPage.selectClass(className);
    testLibrary.assignPage.selectStudent("", true);
    testLibrary.assignPage.clickonUnselectAllButton();
    testLibrary.assignPage.clickOnAssign();
  });

  // In case of inselect it assigns the test to the all the students of teh selected class
  it("Attempt from students fo the class", () => {
    students.forEach((st, index) => {
      const { attempt } = attemptData[index];
      studentTestPage.attemptAssignment(
        students[index].email,
        studentSide.SUBMITTED,
        attempt,
        questionTypeMap,
        password,
        "CLASS_ASSESSMENT"
      );
    });
  });
});
