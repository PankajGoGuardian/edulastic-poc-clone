import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TestAssignPage from "../../../../framework/author/tests/testDetail/testAssignPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import FileHelper from "../../../../framework/util/fileHelper";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import ExpressGraderPage from "../../../../framework/author/assignments/expressGraderPage";
import ReportsPage from "../../../../framework/student/reportsPage";
import QuestionResponsePage from "../../../../framework/author/assignments/QuestionResponsePage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)}> Manual Grading`, () => {
  const testLibraryPage = new TestLibrary();
  const assignmentsPage = new AssignmentsPage();
  const testAssignPage = new TestAssignPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const studentTestPage = new StudentTestPage();
  const lcb = new LiveClassboardPage();
  const grader = new ExpressGraderPage();
  const reportsPage = new ReportsPage();
  const qrp = new QuestionResponsePage();

  const TEST = "MANUAL_GRADE";
  const Teacher = {
    name: "Teacher1",
    email: "Teacher.Manual@snapwiz.com",
    pass: "snapwiz"
  };
  const Student1Class1 = {
    name: "Student1",
    email: "Student1.Manual@snapwiz.com",
    pass: "snapwiz"
  };

  const itemKeys = ["ESSAY_RICH.default", "ESSAY_RICH.default", "ESSAY_RICH.default"];
  const score = [2, 0, 1];
  const percent = ["100", "0", "50"];
  const attemptData = {
    right: "right---Text",
    wrong: "wrong---Text",
    partialCorrect: "partial---Text"
  };
  const attemptTypes = ["right", "wrong", "partialCorrect"];

  let OriginalTestId;

  before("Login and create new items and test", () => {
    cy.deleteAllAssignments(Student1Class1.email, Teacher.email);
    cy.login("teacher", Teacher.email, Teacher.pass);
    testLibraryPage.createTest(TEST).then(id => {
      OriginalTestId = id;
    });
  });
  before("Assign Test", () => {
    testLibraryPage.clickOnAssign();
    testAssignPage.selectClass("Class");
    testAssignPage.selectTestType("Class Assessment");
    testAssignPage.clickOnEntireClass();
    testAssignPage.clickOnAssign().then(() => {
      testAssignPage.sidebar.clickOnAssignment();
      authorAssignmentPage.getStatus().should("have.length", 1);
    });
  });
  before("Attempt Test", () => {
    cy.login("student", Student1Class1.email, Student1Class1.pass);
    assignmentsPage.verifyPresenceOfTest(OriginalTestId);
    assignmentsPage.getAssignmentByTestId(OriginalTestId).should("have.length", 1);
    assignmentsPage.clickOnAssignmentButton();
    itemKeys.forEach((item, i) => {
      studentTestPage.attemptQuestion(item.split(".")[0], attemptTypes[i], attemptData);
      studentTestPage.clickOnNext();
    });
    studentTestPage.submitTest();
  });
  after("Delete Assignments", () => {
    cy.deleteAllAssignments(Student1Class1.email, Teacher.email);
  });
  context("Grading", () => {
    it("Verify Reports- Before Manual Evaluation", () => {
      assignmentsPage.reviewSubmittedTestById(OriginalTestId);
      itemKeys.forEach((item, i) => {
        reportsPage.selectQuestion(`Q${i + 1}`);
        reportsPage.getAchievedScore().should("contain.text", ``);
      });
    });
    it("Verify Author Side- Question View(Before Assigning)", () => {
      cy.login("teacher", Teacher.email, Teacher.pass);
      testLibraryPage.sidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.getStudentScoreByIndex(0).should("contain.text", "0 / 6");
      lcb.clickonQuestionsTab();
    });
    it("Assign Marks Manual Evaluation-In Question View", () => {
      itemKeys.forEach((item, i) => {
        lcb.questionResponsePage.selectQuestion(`Q${i + 1}`);
        lcb.questionResponsePage.getQuestionContainerByStudent(Student1Class1.name).as("studentQuesCard");
        lcb.questionResponsePage.getScoreInput(cy.get("@studentQuesCard")).should("have.attr", "value", ``);
        lcb.questionResponsePage.updateScoreAndFeedbackForStudent(Student1Class1.name, score[i]);
      });
    });
    it("Verify Author Side- Student view", () => {
      lcb.clickOnStudentsTab();
      itemKeys.forEach((item, i) => {
        lcb.questionResponsePage.getQuestionContainer(i).as("studentQuesCard");
        lcb.questionResponsePage.getScoreInput(cy.get("@studentQuesCard")).should("have.attr", "value", `${score[i]}`);
      });
      qrp.verifyTotalScoreAndImprovement(3, 6);
    });
    it("Verify Author Side- Card View", () => {
      lcb.clickOnCardViewTab();
      lcb.getStudentScoreByIndex(0).should("contain.text", "3 / 6");
      lcb.verifyQuestionCards(0, attemptTypes);
      lcb.getStudentPerformanceByIndex(0).should("contain", `50%`);
    });
    it("Verify Author Side-Express Grader", () => {
      lcb.header.clickOnExpressGraderTab();
      itemKeys.forEach((item, i) => {
        grader.verifyScoreAndPerformanceForQueNum(`Q${i + 1}`, `${Cypress._.round(score[i] / 2, 2)}/1`, percent[i]);
      });
    });
    it("Verify Reports- After Manual Evaluation", () => {
      cy.login("student", Student1Class1.email, Student1Class1.pass);
      assignmentsPage.sidebar.clickOnGrades();
      assignmentsPage.reviewSubmittedTestById(OriginalTestId);
      itemKeys.forEach((item, i) => {
        reportsPage.selectQuestion(`Q${i + 1}`);
        reportsPage.getAchievedScore().should("contain.text", score[i]);
      });
    });
  });
});
