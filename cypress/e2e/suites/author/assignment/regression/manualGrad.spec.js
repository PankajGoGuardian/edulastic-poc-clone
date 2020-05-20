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
import BarGraph from "../../../../framework/author/assignments/barGraphs";

describe(`${FileHelper.getSpecName(Cypress.spec.name)}> manual grading`, () => {
  const testLibraryPage = new TestLibrary();
  const assignmentsPage = new AssignmentsPage();
  const testAssignPage = new TestAssignPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const studentTestPage = new StudentTestPage();
  const lcb = new LiveClassboardPage();
  const grader = new ExpressGraderPage();
  const reportsPage = new ReportsPage();
  const qrp = new QuestionResponsePage();
  const barGraph = new BarGraph();

  const TEST = "MANUAL_GRADE";
  const Teacher = {
    name: "Teacher1",
    email: "Teacher.ManualGrad@snapwiz.com",
    pass: "snapwiz"
  };
  const Student1Class1 = {
    name: "Student1",
    email: "Student1.ManualGrad@snapwiz.com",
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

  const attemptTypeData = [
    {
      stuName: Student1Class1.name,
      attempt: {
        Q1: "manualGrade",
        Q2: "manualGrade",
        Q3: "manualGrade"
      }
    }
  ];
  let OriginalTestId;

  before("> login and create new items and test", () => {
    cy.deleteAllAssignments(Student1Class1.email, Teacher.email);
    cy.login("teacher", Teacher.email, Teacher.pass);
    testLibraryPage.createTest(TEST).then(id => {
      OriginalTestId = id;
    });
  });
  before("> assign test", () => {
    testLibraryPage.clickOnAssign();
    testAssignPage.selectClass("Class");
    testAssignPage.selectTestType("Class Assessment");
    testAssignPage.clickOnEntireClass();
    testAssignPage.clickOnAssign().then(() => {
      testAssignPage.sidebar.clickOnAssignment();
      authorAssignmentPage.getStatus().should("have.length", 1);
    });
  });
  before("> attempt test", () => {
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
  after("> delete assignments", () => {
    cy.deleteAllAssignments(Student1Class1.email, Teacher.email);
  });
  context("> grading", () => {
    it("> verify reports- before manual evaluation", () => {
      reportsPage.getPercentByTestId(OriginalTestId).should("have.text", `0%`);
      assignmentsPage.reviewSubmittedTestById(OriginalTestId);
      itemKeys.forEach((item, i) => {
        reportsPage.selectQuestion(`Q${i + 1}`);
        reportsPage.getAchievedScore().should("contain.text", ``);
      });
    });
    it("> verify author side- question view(before assigning)", () => {
      cy.login("teacher", Teacher.email, Teacher.pass);
      testLibraryPage.sidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);

      lcb.getStudentScoreByIndex(0).should("contain.text", "0 / 6");
      barGraph.verifyQueBarAndToolTipBasedOnAttemptData(attemptTypeData, Cypress._.keys(attemptTypeData.attempt));

      lcb.clickOnStudentsTab();
      barGraph.verifyQueBarAndToolTipBasedOnAttemptData(attemptTypeData, Cypress._.keys(attemptTypeData.attempt));

      lcb.clickonQuestionsTab();
      barGraph.verifyQueBarAndToolTipBasedOnAttemptData(attemptTypeData, Cypress._.keys(attemptTypeData.attempt), true);
    });
    it("> assign marks manual evaluation-in question view", () => {
      itemKeys.forEach((item, i) => {
        lcb.questionResponsePage.selectQuestion(`Q${i + 1}`);
        lcb.questionResponsePage.getQuestionContainerByStudent(Student1Class1.name).as("studentQuesCard");
        lcb.questionResponsePage.getScoreInput(cy.get("@studentQuesCard")).should("have.attr", "value", ``);
        lcb.questionResponsePage.updateScoreAndFeedbackForStudent(Student1Class1.name, score[i]);
        attemptTypeData[0].attempt[`Q${i + 1}`] = attemptTypes[i];
      });
      barGraph.verifyQueBarAndToolTipBasedOnAttemptData(attemptTypeData, Cypress._.keys(attemptTypeData.attempt), true);
    });
    it("> verify author side- student view", () => {
      lcb.clickOnStudentsTab();
      itemKeys.forEach((item, i) => {
        lcb.questionResponsePage.getQuestionContainer(i).as("studentQuesCard");
        lcb.questionResponsePage.getScoreInput(cy.get("@studentQuesCard")).should("have.attr", "value", `${score[i]}`);
      });
      qrp.verifyTotalScoreAndImprovement(3, 6);
      barGraph.verifyQueBarAndToolTipBasedOnAttemptData(attemptTypeData, Cypress._.keys(attemptTypeData.attempt));
    });
    it("> verify author side- card view", () => {
      lcb.clickOnCardViewTab();
      lcb.getStudentScoreByIndex(0).should("contain.text", "3 / 6");
      lcb.verifyQuestionCards(0, attemptTypes);
      lcb.getStudentPerformanceByIndex(0).should("contain", `50%`);
      barGraph.verifyQueBarAndToolTipBasedOnAttemptData(attemptTypeData, Cypress._.keys(attemptTypeData.attempt));
    });
    it("> verify author side-express grader", () => {
      lcb.header.clickOnExpressGraderTab();
      itemKeys.forEach((item, i) => {
        grader.verifyScoreAndPerformanceForQueNum(`Q${i + 1}`, `${Cypress._.round(score[i] / 2, 2)}/1`, percent[i]);
      });
    });
    it("> verify reports- after manual evaluation", () => {
      cy.login("student", Student1Class1.email, Student1Class1.pass);
      assignmentsPage.sidebar.clickOnGrades();
      reportsPage.getPercentByTestId(OriginalTestId).should("have.text", `50%`);
      assignmentsPage.reviewSubmittedTestById(OriginalTestId);
      itemKeys.forEach((item, i) => {
        reportsPage.selectQuestion(`Q${i + 1}`);
        reportsPage.getAchievedScore().should("contain.text", score[i]);
      });
    });
  });
});
