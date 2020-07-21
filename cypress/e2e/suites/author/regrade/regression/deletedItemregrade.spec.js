import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import ExpressGraderPage from "../../../../framework/author/assignments/expressGraderPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import Regrade from "../../../../framework/author/tests/regrade/regrade";
import TestAssignPage from "../../../../framework/author/tests/testDetail/testAssignPage";
import TestReviewTab from "../../../../framework/author/tests/testDetail/testReviewTab";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import SidebarPage from "../../../../framework/student/sidebarPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import ReportsPage from "../../../../framework/student/reportsPage";
import FileHelper from "../../../../framework/util/fileHelper";
import CypressHelper from "../../../../framework/util/cypressHelpers";
import { releaseGradeTypes } from "../../../../framework/constants/assignmentStatus";

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
  }
};

describe(`${FileHelper.getSpecName(Cypress.spec.name)}With Applying Regrading-Test Editing`, () => {
  const testLibraryPage = new TestLibrary();
  const assignmentsPage = new AssignmentsPage();
  const studentTestPage = new StudentTestPage();
  const testReviewTab = new TestReviewTab();
  const testAssignPage = new TestAssignPage();
  const sidebarPage = new SidebarPage();
  const regrade = new Regrade();
  const lcb = new LiveClassboardPage();
  const teacherSidebar = new TeacherSideBar();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const expressGrader = new ExpressGraderPage();
  const reportsPage = new ReportsPage();
  const Teacher = {
    email: "teacher.for.regrade@snapwiz.com",
    pass: "snapwiz"
  };
  const { Student1, Student2 } = students;

  let OriginalTestId, newTestId;
  let assignedTest, qType, num, itemsInTest;
  let questText = [];
  let points = [];
  let questionType = [];
  let attempt = [];

  before("Get Data Of test and its itemns", () => {
    cy.getAllTestsAndDelete(Teacher.username);
    cy.getAllItemsAndDelete(Teacher.username);
    cy.deleteAllAssignments(Student1.email, Teacher.email);
    cy.fixture("testAuthoring").then(testData => {
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
    testLibraryPage.createTest("EDIT_ASSIGNED_TEST_REGRADE", false).then(id => {
      testLibraryPage.header.clickOnSettings();
      testLibraryPage.testSettings.setRealeasePolicy(releaseGradeTypes.WITH_ANSWERS);
      testLibraryPage.header.clickOnPublishButton();
      OriginalTestId = id;
      assignedTest = id;
    });
  });
  before("Assign the test", () => {
    testLibraryPage.clickOnAssign();
    testAssignPage.selectClass("Class");
    testAssignPage.selectTestType("Class Assessment");
    // testAssignPage.clickOnEntireClass();
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
      const [, , item3] = testLibraryPage.items;
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
        testReviewTab.testheader.clickRegradePublish();
        // Apply Regrade And Verify At Student1 Side
        regrade.applyRegrade();
      });
    });

    context("> verify student side-'removed item'", () => {
      it(">verifying at student side- 'IN PROGRESS'", () => {
        cy.login("student", Student1.email, Student1.pass);
        assignmentsPage.verifyAssignedTestID(newTestId, assignedTest);
        assignmentsPage.clickOnAssigmentByTestId(newTestId);
        studentTestPage.verifyNoOfQuestions(itemsInTest.length);
        studentTestPage.getQuestionByIndex(0, true);
        studentTestPage.attemptQuestionsByQueType(questionType, attempt);
        studentTestPage.submitTest();
        reportsPage.validateStats(1, "1/1", "4/4", 100);
        assignmentsPage.reviewSubmittedTestById(newTestId);
        reportsPage.verifyNoOfQuesInReview(itemsInTest.length);
      });

      it(">verifying at student side- 'SUBMITTED'", () => {
        cy.login("student", Student2.email, Student2.pass);
        assignmentsPage.sidebar.clickOnGrades();
        reportsPage.validateStats(1, "1/1", "4/4", 100);
        assignmentsPage.reviewSubmittedTestById(newTestId);
        reportsPage.verifyNoOfQuesInReview(itemsInTest.length);
      });
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
          lcb.getStudentScoreByIndex(i).should("contain.text", "4 / 4");
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
        lcb.questionResponsePage.getTotalScore().should("have.text", "4");
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
        expressGrader.getGridRowByStudent(Student1.name);
        expressGrader.verifyScoreAndPerformance("4/4", "100");

        // student2
        expressGrader.getGridRowByStudent(Student2.name);
        expressGrader.verifyScoreAndPerformance("4/4", "100");

        // verify que count
        expressGrader.verifyNumberOfQuestions(itemsInTest.length);
      });
    });
  });
});
