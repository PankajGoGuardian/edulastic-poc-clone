import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import ExpressGraderPage from "../../../../framework/author/assignments/expressGraderPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import Regrade from "../../../../framework/author/tests/testDetail/regrade";
import TestAddItemTab from "../../../../framework/author/tests/testDetail/testAddItemTab";
import TestAssignPage from "../../../../framework/author/tests/testDetail/testAssignPage";
import TestReviewTab from "../../../../framework/author/tests/testDetail/testReviewTab";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import SidebarPage from "../../../../framework/student/sidebarPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import ReportsPage from "../../../../framework/student/reportsPage";
import FileHelper from "../../../../framework/util/fileHelper";
import CypressHelper from "../../../../framework/util/cypressHelpers";

const students = {
  Student1: {
    name: "Student1",
    email: "student1.for.regrade@snapwiz.com",
    pass: "snapwiz"
  },
  Student2: {
    name: "Student2",
    email: "student2.for.regrade@snapwiz.com",
    pass: "snapwiz"
  },
  Student3: {
    name: "Student3",
    email: "student3.for.regrade@snapwiz.com",
    pass: "snapwiz"
  }
};

describe(`${FileHelper.getSpecName(Cypress.spec.name)}With Applying Regrading-Test Editing`, () => {
  const testLibraryPage = new TestLibrary();
  const assignmentsPage = new AssignmentsPage();
  const studentTestPage = new StudentTestPage();
  const testReviewTab = new TestReviewTab();
  const testAddItemTab = new TestAddItemTab();
  const testAssignPage = new TestAssignPage();
  const sidebarPage = new SidebarPage();
  const regrade = new Regrade();
  const lcb = new LiveClassboardPage();
  const teacherSidebar = new TeacherSideBar();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const expressGrader = new ExpressGraderPage();
  const reportsPage = new ReportsPage();
  const updatedPoints = "6";
  const isAssigned = true;
  const Teacher = {
    email: "teacher.for.regrade@snapwiz.com",
    pass: "snapwiz"
  };
  const { Student1, Student2 } = students;

  let OriginalTestId, newTestId;
  let assignedTest, qType, num, quesData, testName, itemsInTest;
  let questText = [];
  let points = [];
  let questionType = [];
  let attempt = [];

  before("Get Data Of test and its itemns", () => {
    cy.deleteAllAssignments(Student1.email, Teacher.email);
    cy.fixture("testAuthoring").then(testData => {
      testName = testData.EDIT_ASSIGNED_TEST_REGRADE.name;
      itemsInTest = testData.EDIT_ASSIGNED_TEST_REGRADE.itemKeys;
    });
    cy.fixture("questionAuthoring").then(quesData => {
      itemsInTest.forEach(element => {
        [qType, num] = element.split(".");
        questText.push(quesData[qType][num].quetext);
        questionType.push(qType);
        points.push(quesData[qType][num].setAns.points);
        attempt.push(quesData[qType][num].attemptData);
      });
    });
  });
  before("login and create new items and test", () => {
    cy.login("teacher", Teacher.email, Teacher.pass);
    testLibraryPage.createTest("EDIT_ASSIGNED_TEST_REGRADE").then(id => {
      OriginalTestId = id;
      assignedTest = id;
    });
  });
  before("Assign the test", () => {
    testLibraryPage.clickOnAssign();
    testAssignPage.selectClass("Class");
    testAssignPage.selectTestType("Class Assessment");
    testAssignPage.clickOnEntireClass();
    testAssignPage.clickOnAssign();
  });
  before(">attempt the test by 2 students", () => {
    //Partial Attempt
    cy.login("student", Student1.email, Student1.pass);
    sidebarPage.clickOnAssignment();
    assignmentsPage.clickOnAssigmentByTestId(assignedTest);
    studentTestPage.clickOnExitTest();
    // Complete Attempt
    cy.login("student", Student2.email, Student2.pass);
    assignmentsPage.clickOnAssigmentByTestId(assignedTest);
    studentTestPage.getQuestionByIndex(0);
    studentTestPage.attemptQuestionsByQueType(questionType, attempt);
    studentTestPage.submitTest();
  });

  context(">remove one question from review tab and verify test", () => {
    it(">remove one question from review tab", () => {
      const [item1, item2, item3] = testLibraryPage.items;
      cy.login("teacher", Teacher.email, Teacher.pass);
      // Get and Convert To Draft
      testLibraryPage.seachTestAndGotoReviewById(OriginalTestId);
      testLibraryPage.publishedToDraftAssigned();
      testLibraryPage.getVersionedTestID().then(newTest => {
        newTestId = newTest;
        // Remove 1 item From Review Tab
        testReviewTab.testheader.clickOnReview();
        testReviewTab.clickOnCheckBoxByItemId(item3);
        testReviewTab.clickOnRemoveSelected();
        questionType.pop();
        attempt.pop();
        itemsInTest.pop();
        // Publish
        testReviewTab.testheader.clickOnPublishButton(isAssigned);
        regrade.regradeSelection(true);
        // Apply Regrade And Verify At Student1 Side
        regrade.applyRegrade();
        OriginalTestId = newTestId;
      });
    });

    it(">verifying at student side- removed question", () => {
      cy.login("student", Student1.email, Student1.pass);
      assignmentsPage.verifyAssignedTestID(newTestId, assignedTest);
      assignmentsPage.clickOnAssigmentByTestId(OriginalTestId);
      studentTestPage.verifyNoOfQuestions(itemsInTest.length);
      studentTestPage.clickOnExitTest();
      cy.login("student", Student2.email, Student2.pass);
      assignmentsPage.sidebar.clickOnGrades();
      assignmentsPage.reviewSubmittedTestById(OriginalTestId);
      reportsPage.verifyNoOfQuesInReview(itemsInTest.length);
    });

    context(">verify teacher side lcb", () => {
      before("login as teacher", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        teacherSidebar.clickOnAssignment();
        authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      });
      it(">verif lcb card view", () => {
        Object.keys(students).forEach((student, i) => {
          // verify total score of all students ;
          lcb.getStudentScoreByIndex(i).should("contain.text", "/ 4");
          // verify question cards shows 2 questions
          lcb
            .getQuestionsByIndex(i)
            .find("div")
            .should("have.length", itemsInTest.length);
        });
      });

      it(">verify student centric view", () => {
        lcb.clickOnStudentsTab();
        // verify total scoresc
        // student1
        lcb.questionResponsePage.selectStudent(Student1.name);
        lcb.questionResponsePage.getTotalScore().should("have.text", "0");
        lcb.questionResponsePage.getMaxScore().should("have.text", "4");

        //  student2
        lcb.questionResponsePage.selectStudent(Student2.name);
        lcb.questionResponsePage.getTotalScore().should("have.text", "4");
        lcb.questionResponsePage.getMaxScore().should("have.text", "4");
      });
      it(">verify Question centric view", () => {
        // verify count of questions
        lcb.clickonQuestionsTab();
        lcb.questionResponsePage.getDropDown().click({ force: true });
        CypressHelper.getDropDownList().then(questions => {
          expect(questions).to.have.lengthOf(itemsInTest.length);
        });
      });

      it(">verify express grader view", () => {
        lcb.header.clickOnExpressGraderTab();
        // verify total scores
        // student1
        expressGrader.getGridRowByStudent(Student2.name);
        expressGrader.verifyScoreAndPerformance("4/4", "100");

        // verify que count
        cy.get(".ant-table-thead > tr")
          .eq(0)
          .find(".ant-table-column-has-actions")
          .should("have.length", itemsInTest.length);
      });
    });
  });

  context(">update points of an item and verify test", () => {
    it(">update points of an item", () => {
      const [item1, item2] = testLibraryPage.items;
      cy.login("teacher", Teacher.email, Teacher.pass);
      // Get Test Card and Draft It
      testLibraryPage.seachTestAndGotoReviewById(OriginalTestId);
      testLibraryPage.publishedToDraftAssigned();
      testLibraryPage.getVersionedTestID().then(newTest => {
        newTestId = newTest;
        //Update Points
        testReviewTab.updatePointsByID(item1, updatedPoints);
        // Publish
        testAddItemTab.header.clickOnPublishButton(isAssigned, true);
        regrade.regradeSelection(true);
        regrade.applyRegrade();
        OriginalTestId = newTestId;
      });
    });
    it(">verifying at student side- update points", () => {
      cy.login("student", Student1.email, Student1.pass);
      assignmentsPage.verifyAssignedTestID(newTestId, assignedTest);
      assignmentsPage.clickOnAssigmentByTestId(OriginalTestId);
      studentTestPage.getQuestionByIndex(0);
      studentTestPage.attemptQuestionsByQueType(questionType, attempt);
      studentTestPage.submitTest();
      assignmentsPage.reviewSubmittedTestById(OriginalTestId);
      reportsPage.verifyMaxScoreOfQueByIndex(0, updatedPoints);
      cy.login("student", Student2.email, Student2.pass);
      assignmentsPage.sidebar.clickOnGrades();
      assignmentsPage.reviewSubmittedTestById(OriginalTestId);
      reportsPage.verifyMaxScoreOfQueByIndex(0, updatedPoints);
    });

    context(">verify teacher side LCB", () => {
      before("login as teacher", () => {
        cy.login("teacher", Teacher.email, Teacher.pass);
        teacherSidebar.clickOnAssignment();
        authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      });
      it(">verif lcb card view", () => {
        Object.keys(students).forEach((student, i) => {
          // verify total score of all students ;
          lcb.getStudentScoreByIndex(i).should("contain.text", "/ 8");
          // verify question cards shows 2 questions
          lcb
            .getQuestionsByIndex(i)
            .find("div")
            .should("have.length", itemsInTest.length);
        });
      });

      it(">verify student centric view", () => {
        lcb.clickOnStudentsTab();
        // verify total scores
        // student1
        lcb.questionResponsePage.selectStudent(Student1.name);
        lcb.questionResponsePage.getTotalScore().should("have.text", "8");
        lcb.questionResponsePage.getMaxScore().should("have.text", "8");

        //  student2
        lcb.questionResponsePage.selectStudent(Student2.name);
        lcb.questionResponsePage.getTotalScore().should("have.text", "8");
        lcb.questionResponsePage.getMaxScore().should("have.text", "8");
      });

      it(">verify Question centric view", () => {
        // verify updated points
        lcb.clickonQuestionsTab();

        lcb.questionResponsePage.selectQuestion(`Q1`);
        Object.keys(students).forEach((student, index) => {
          if (!(index === 2)) {
            lcb.questionResponsePage.getQuestionContainerByStudent(students[student].name).as("studentCont");
            lcb.questionResponsePage.getQuestionMaxScore(cy.get("@studentCont")).should("have.text", updatedPoints);
          }
        });
      });

      it(">verify express grader view", () => {
        lcb.header.clickOnExpressGraderTab();
        // verify total scores
        // student1
        expressGrader.getGridRowByStudent(Student1.name);
        expressGrader.verifyScoreAndPerformance("8/8", "100");

        // student2
        expressGrader.getGridRowByStudent(Student2.name);
        expressGrader.verifyScoreAndPerformance("8/8", "100");

        // verify que count
        cy.get(".ant-table-thead > tr")
          .eq(0)
          .find(".ant-table-column-has-actions")
          .should("have.length", itemsInTest.length);
      });
    });
  });
});
