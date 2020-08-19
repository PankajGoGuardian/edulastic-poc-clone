import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TestAssignPage from "../../../../framework/author/tests/testDetail/testAssignPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import FileHelper from "../../../../framework/util/fileHelper";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import { teacherSide } from "../../../../framework/constants/assignmentStatus";

describe(`${FileHelper.getSpecName(Cypress.spec.name)}> Re-Assigning Test`, () => {
  const testLibraryPage = new TestLibrary();
  const assignmentsPage = new AssignmentsPage();
  const testAssignPage = new TestAssignPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const studentTestPage = new StudentTestPage();
  const TEST = "TEST_SETTING_1";
  const Teacher = {
    email: "Teacher1.Reassign@snapwiz.com",
    pass: "snapwiz"
  };

  const Student1Class1 = {
    email: "student1.reassign@snapwiz.com",
    pass: "snapwiz"
  };
  const Student1Class2 = {
    email: "student3.reassign@snapwiz.com",
    pass: "snapwiz"
  };
  /* Below Student is Common For  Class1 And Class3 */
  const Student4Class1Class3 = {
    email: "student2.reassign@snapwiz.com",
    pass: "snapwiz"
  };

  const Student1Class3 = {
    email: "student4.reassign@snapwiz.com",
    pass: "snapwiz"
  };

  let OriginalTestId;
  let assignCountForClass1;
  const assignCountForClass2 = 1;
  const assignCountForClass3 = 1;
  const CLASS_1 = "Class1";
  const CLASS_2 = "Class2";
  const CLASS_3 = "Class3";

  before("Login and create new items and test", () => {
    cy.login("teacher", Teacher.email, Teacher.pass);
    testLibraryPage.createTest(TEST).then(id => {
      OriginalTestId = id;
    });
  });
  context("With Duplicate", () => {
    context("To The Same Class", () => {
      before("Assign The Test", () => {
        cy.deleteAllAssignments(Student1Class1.email, Teacher.email);

        assignCountForClass1 = 0;
        testLibraryPage.clickOnAssign();
        // testAssignPage.clickOnEntireClass();
        testAssignPage.selectClass(CLASS_1);
        testAssignPage.clickOnAssign().then(() => {
          assignCountForClass1++;
          cy.contains("Success!");
          testAssignPage.sidebar.clickOnAssignment();
          authorAssignmentPage.getStatus().should("have.length", assignCountForClass1);
        });
      });
      before("Verify Assigned", () => {
        cy.login("student", Student1Class1.email, Student1Class1.pass);
        assignmentsPage.verifyPresenceOfTest(OriginalTestId);
        assignmentsPage.getAssignmentByTestId(OriginalTestId).should("have.length", assignCountForClass1);
        assignmentsPage.clickOnAssignmentButton();
        studentTestPage.getNext();
        studentTestPage.clickOnExitTest();
      });
      before("Login", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
      });
      it("Assignments > Reassign", () => {
        testLibraryPage.sidebar.clickOnAssignment();
        authorAssignmentPage.clickOnAssign();
        testAssignPage.selectClass(CLASS_1);
        testAssignPage.clickOnAssign({ duplicate: true }).then(() => {
          cy.contains("Success!");
          assignCountForClass1++;
          testAssignPage.sidebar.clickOnAssignment();
          authorAssignmentPage.getStatus().should("have.length", assignCountForClass1);
        });
      });
      it("Verify Duplicate- Student Side", () => {
        cy.login("student", Student1Class1.email, Student1Class1.pass);
        assignmentsPage.verifyPresenceOfTest(OriginalTestId);
        assignmentsPage.getAssignmentByTestId(OriginalTestId).should("have.length", assignCountForClass1);
        assignmentsPage.verifyStatusOfAssignment([teacherSide.IN_PROGRESS, teacherSide.NOT_STARTED]);
      });
    });
    context("To One Student is Part Of 2 Classes-At The Separate Times", () => {
      before("Assign The Test", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        cy.deleteAllAssignments(Student1Class1.email, Teacher.email);

        testAssignPage.visitAssignPageById(OriginalTestId);
        assignCountForClass1 = 0;
        // testAssignPage.clickOnEntireClass();
        testAssignPage.selectClass(CLASS_1);
        testAssignPage.clickOnAssign().then(() => {
          assignCountForClass1++;
          cy.contains("Success!");
          testAssignPage.sidebar.clickOnAssignment();
          authorAssignmentPage.getStatus().should("have.length", assignCountForClass1);
        });
      });
      before("Verify Assigned", () => {
        cy.login("student", Student1Class1.email, Student1Class1.pass);
        assignmentsPage.verifyPresenceOfTest(OriginalTestId);
        assignmentsPage.getAssignmentByTestId(OriginalTestId).should("have.length", assignCountForClass1);
        assignmentsPage.clickOnAssignmentButton();
        studentTestPage.getNext();
        studentTestPage.clickOnExitTest();
      });
      before("Login", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
      });
      it("Assignments > Reassign", () => {
        testLibraryPage.sidebar.clickOnAssignment();
        authorAssignmentPage.clickOnAssign();
        testAssignPage.selectClass(CLASS_3);
        testAssignPage.clickOnAssign().then(() => {
          cy.contains("Success!");
          testAssignPage.sidebar.clickOnAssignment();
          authorAssignmentPage.getStatus().should("have.length", assignCountForClass1 + assignCountForClass3);
        });
      });
      it("Verify Duplicate- Student Side", () => {
        cy.login("student", Student1Class1.email, Student1Class1.pass);
        assignmentsPage.getAssignmentByTestId(OriginalTestId).should("have.length", assignCountForClass1);
        assignmentsPage.verifyStatusOfAssignment([teacherSide.IN_PROGRESS]);

        cy.login("student", Student4Class1Class3.email, Student4Class1Class3.pass);
        assignmentsPage
          .getAssignmentByTestId(OriginalTestId)
          .should("have.length", assignCountForClass1 + assignCountForClass3);
        assignmentsPage.verifyStatusOfAssignment([teacherSide.NOT_STARTED]);

        cy.login("student", Student1Class3.email, Student1Class3.pass);
        assignmentsPage.getAssignmentByTestId(OriginalTestId).should("have.length", assignCountForClass3);
        assignmentsPage.verifyStatusOfAssignment([teacherSide.NOT_STARTED]);
      });
    });
    context("To The Same Class Along With New Class", () => {
      before("Assign The Test", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        cy.deleteAllAssignments(Student1Class1.email, Teacher.email);

        assignCountForClass1 = 0;
        testAssignPage.visitAssignPageById(OriginalTestId);
        // testAssignPage.clickOnEntireClass();
        testAssignPage.selectClass(CLASS_1);
        testAssignPage.clickOnAssign().then(() => {
          assignCountForClass1++;
          cy.contains("Success!");
          testAssignPage.sidebar.clickOnAssignment();
          authorAssignmentPage.getStatus().should("have.length", assignCountForClass1);
        });
      });
      before("Verify Assigned", () => {
        cy.login("student", Student1Class1.email, Student1Class1.pass);
        assignmentsPage.verifyPresenceOfTest(OriginalTestId);
        assignmentsPage.getAssignmentByTestId(OriginalTestId).should("have.length", assignCountForClass1);
        assignmentsPage.clickOnAssignmentButton();
        studentTestPage.getNext();
        studentTestPage.clickOnExitTest();
      });
      before("Login", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
      });
      it("Assignments > Reassign", () => {
        testLibraryPage.sidebar.clickOnAssignment();
        authorAssignmentPage.clickOnAssign();
        testAssignPage.selectClass(CLASS_1);
        testAssignPage.selectClass(CLASS_2);
        testAssignPage.clickOnAssign({ duplicate: true }).then(() => {
          cy.contains("Success!");
          assignCountForClass1++;
          testAssignPage.sidebar.clickOnAssignment();
          authorAssignmentPage.getStatus().should("have.length", assignCountForClass1 + assignCountForClass3);
        });
      });
      it("Verify Duplicate- Student Side", () => {
        cy.login("student", Student1Class1.email, Student1Class1.pass);
        assignmentsPage.getAssignmentByTestId(OriginalTestId).should("have.length", assignCountForClass1);

        assignmentsPage.verifyStatusOfAssignment([teacherSide.NOT_STARTED, teacherSide.IN_PROGRESS]);

        cy.login("student", Student1Class2.email, Student1Class2.pass);
        assignmentsPage.getAssignmentByTestId(OriginalTestId).should("have.length", assignCountForClass2);
        assignmentsPage.verifyStatusOfAssignment([teacherSide.NOT_STARTED]);
      });
    });
  });

  context("Without Duplicate", () => {
    before("Login and UnAssign", () => {
      cy.login("teacher", Teacher.email, Teacher.pass);
      assignCountForClass1 = 0;
    });
    context("To The Same Class", () => {
      before("Login and Assign", () => {
        cy.deleteAllAssignments(Student1Class1.email, Teacher.email);
        testAssignPage.visitAssignPageById(OriginalTestId);
        // testAssignPage.clickOnEntireClass();
        testAssignPage.selectClass(CLASS_1);
        testAssignPage.clickOnAssign().then(() => {
          assignCountForClass1++;
          cy.contains("Success!");
          testAssignPage.sidebar.clickOnAssignment();
          authorAssignmentPage.getStatus().should("have.length", assignCountForClass1);
        });
      });

      before("Verify Assigned", () => {
        cy.login("student", Student1Class1.email, Student1Class1.pass);
        assignmentsPage.verifyPresenceOfTest(OriginalTestId);
        assignmentsPage.getAssignmentByTestId(OriginalTestId).should("have.length", assignCountForClass1);
        assignmentsPage.clickOnAssignmentButton();
        studentTestPage.getNext();
        studentTestPage.clickOnExitTest();
      });
      before("Login", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
      });
      it("Assignments > Reassign", () => {
        testLibraryPage.sidebar.clickOnAssignment();
        authorAssignmentPage.clickOnAssign();
        testAssignPage.selectClass(CLASS_1);
        testAssignPage.clickOnAssign({ duplicate: false, willNotAssign: true }).then(() => {
          cy.wait(3000);
          testAssignPage.sidebar.clickOnAssignment();
          authorAssignmentPage.getStatus().should("have.length", assignCountForClass1);
        });
      });
      it("Verify Duplicate- Student Side", () => {
        cy.login("student", Student1Class1.email, Student1Class1.pass);
        assignmentsPage.verifyPresenceOfTest(OriginalTestId);
        assignmentsPage.getAssignmentByTestId(OriginalTestId).should("have.length", assignCountForClass1);
        assignmentsPage.verifyStatusOfAssignment([teacherSide.IN_PROGRESS]);
      });
    });
    /* context("One Student is Part Of 2 Classes-At The Different Times", () => {
      before("Login and Assign", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        cy.deleteAllAssignments(Student1Class1.email, Teacher.email);

        testAssignPage.visitAssignPageById(OriginalTestId);
        assignCountForClass1 = 0;
        //  testAssignPage.clickOnEntireClass();
        testAssignPage.selectClass(CLASS_1);
        testAssignPage.clickOnAssign().then(() => {
          assignCountForClass1++;
          cy.contains("Success!");
          testAssignPage.sidebar.clickOnAssignment();
          authorAssignmentPage.getStatus().should("have.length", assignCountForClass1);
        });
      });
      before("Verify Assigned", () => {
        cy.login("student", Student1Class1.email, Student1Class1.pass);
        assignmentsPage.verifyPresenceOfTest(OriginalTestId);
        assignmentsPage.getAssignmentByTestId(OriginalTestId).should("have.length", assignCountForClass1);
        assignmentsPage.clickOnAssignmentButton();
        studentTestPage.getNext();
        studentTestPage.clickOnExitTest();
      });
      before("Login", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
      });
      it("Assignments > Reassign", () => {
        testLibraryPage.sidebar.clickOnAssignment();
        authorAssignmentPage.clickOnAssign();
        testAssignPage.selectClass(CLASS_3);
        testAssignPage.clickOnAssign().then(() => {
          cy.contains("Success!");
          testAssignPage.sidebar.clickOnAssignment();
          authorAssignmentPage.getStatus().should("have.length", assignCountForClass1 + assignCountForClass3);
        });
      });
      it("Verify Duplicate- Student Side", () => {
        cy.login("student", Student1Class1.email, Student1Class1.pass);
        assignmentsPage.getAssignmentByTestId(OriginalTestId).should("have.length", assignCountForClass1);
        assignmentsPage.verifyStatusOfAssignment([teacherSide.IN_PROGRESS]);
        cy.login("student", Student1Class3.email, Student1Class3.pass);
        assignmentsPage.getAssignmentByTestId(OriginalTestId).should("have.length", assignCountForClass3);
        assignmentsPage.verifyStatusOfAssignment([teacherSide.NOT_STARTED]);

        cy.login("student", Student4Class1Class3.email, Student4Class1Class3.pass);
        assignmentsPage
          .getAssignmentByTestId(OriginalTestId)
          .should("have.length", assignCountForClass1 + assignCountForClass3);
        assignmentsPage.verifyStatusOfAssignment([teacherSide.NOT_STARTED]);
      });
    }); */
    context("To The Same Class Along With New Class", () => {
      before("Login and Assign", () => {
        assignCountForClass1 = 0;
        cy.login("teacher", Teacher.email, Teacher.pass);
        cy.deleteAllAssignments(Student1Class1.email, Teacher.email);

        testAssignPage.visitAssignPageById(OriginalTestId);
        // testAssignPage.clickOnEntireClass();
        testAssignPage.selectClass(CLASS_1);
        testAssignPage.clickOnAssign().then(() => {
          assignCountForClass1++;
          cy.contains("Success!");
          testAssignPage.sidebar.clickOnAssignment();
          authorAssignmentPage.getStatus().should("have.length", assignCountForClass1);
        });
      });
      before("Verify Assigned", () => {
        cy.login("student", Student1Class1.email, Student1Class1.pass);
        assignmentsPage.verifyPresenceOfTest(OriginalTestId);
        assignmentsPage.getAssignmentByTestId(OriginalTestId).should("have.length", assignCountForClass1);
        assignmentsPage.clickOnAssignmentButton();
        studentTestPage.getNext();
        studentTestPage.clickOnExitTest();
      });
      before("Login", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
      });
      it("Assignments > Reassign", () => {
        testLibraryPage.sidebar.clickOnAssignment();
        authorAssignmentPage.clickOnAssign();
        testAssignPage.selectClass(CLASS_1);
        testAssignPage.selectClass(CLASS_2);
        testAssignPage.clickOnAssign({ duplicate: false }).then(() => {
          cy.contains("Success!");
          testAssignPage.sidebar.clickOnAssignment();
          authorAssignmentPage.getStatus().should("have.length", assignCountForClass1 + assignCountForClass2);
        });
      });
      it("Verify Duplicate-Student Side", () => {
        cy.login("student", Student1Class1.email, Student1Class1.pass);
        assignmentsPage.getAssignmentByTestId(OriginalTestId).should("have.length", assignCountForClass1);
        assignmentsPage.verifyStatusOfAssignment([teacherSide.IN_PROGRESS]);
        cy.login("student", Student1Class2.email, Student1Class2.pass);
        assignmentsPage.getAssignmentByTestId(OriginalTestId).should("have.length", assignCountForClass2);
        assignmentsPage.verifyStatusOfAssignment([teacherSide.NOT_STARTED]);
      });
    });
  });

  context("One Student is Part Of 2 Classes-At The Same Time ", () => {
    /* Earlier used classes separately where student is part of 2 classes, Here Assigning at the same time */
    before("Login and UnAssign", () => {
      cy.login("teacher", Teacher.email, Teacher.pass);
      assignCountForClass1 = 0;
      testLibraryPage.sidebar.clickOnAssignment();
      authorAssignmentPage.clickOnUnassign();
    });
    it("Assign- No Duplicate", () => {
      testAssignPage.visitAssignPageById(OriginalTestId);

      //  testAssignPage.clickOnEntireClass();
      testAssignPage.selectClass(CLASS_1);
      testAssignPage.selectClass(CLASS_3);
      testAssignPage.clickOnAssign({ duplicate: false, willNotAssign: true }).then(() => {
        testAssignPage.sidebar.clickOnAssignment();
        authorAssignmentPage.getStatus().should("have.length", assignCountForClass1);
      });
    });
    it("Verify Assigned", () => {
      cy.login("student", Student4Class1Class3.email, Student4Class1Class3.pass);
      assignmentsPage.verifyAbsenceOfTest(OriginalTestId);
    });
    it("Assign- Duplicate", () => {
      cy.login("teacher", Teacher.email, Teacher.pass);
      assignCountForClass1 = 0;
      testAssignPage.visitAssignPageById(OriginalTestId);

      //  testAssignPage.clickOnEntireClass();
      testAssignPage.selectClass(CLASS_1);
      testAssignPage.selectClass(CLASS_3);
      testAssignPage.clickOnAssign({ duplicate: true, willNotAssign: false }).then(() => {
        cy.contains("Success");
        assignCountForClass1++;
        testAssignPage.sidebar.clickOnAssignment();
        authorAssignmentPage.getStatus().should("have.length", assignCountForClass1 + assignCountForClass3);
      });
    });
    it("Verify Assigned", () => {
      cy.login("student", Student4Class1Class3.email, Student4Class1Class3.pass);
      assignmentsPage.verifyPresenceOfTest(OriginalTestId);
      assignmentsPage
        .getAssignmentByTestId(OriginalTestId)
        .should("have.length", assignCountForClass1 + assignCountForClass3);
    });
  });
});
