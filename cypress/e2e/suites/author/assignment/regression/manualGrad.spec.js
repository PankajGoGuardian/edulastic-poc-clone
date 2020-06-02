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
import { studentSide, teacherSide } from "../../../../framework/constants/assignmentStatus";

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
  const asgnstatus = {
    sub: "SUBMITTED",
    graded: "GRADED"
  };
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
  let OriginalTestId = "5ed51c69e3ccf00007c4ffa5";

  // before("> login and create new items and test", () => {
  //   cy.login("teacher", Teacher.email, Teacher.pass);
  //   testLibraryPage.createTest(TEST).then(id => {
  //     OriginalTestId = id;
  //   });
  // });

  context("> when student 'attempts' question", () => {
    // when student attempts any one manually graded item in a test, test pocesses manual evaluation features
    before("> assign test", () => {
      cy.deleteAllAssignments(Student1Class1.email, Teacher.email);
      testLibraryPage.assignPage.visitAssignPageById(OriginalTestId);
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
    it("> verify student side reports(before manual evaluation)", () => {
      // status should be 'submitted' not 'graded', marks should reflect as ``
      reportsPage.verifyStatusIs(asgnstatus.sub);
      reportsPage.getPercentByTestId(OriginalTestId).should("have.text", `0%`);
      assignmentsPage.reviewSubmittedTestById(OriginalTestId);
      itemKeys.forEach((item, i) => {
        reportsPage.selectQuestion(`Q${i + 1}`);
        reportsPage.getAchievedScore().should("contain.text", ``);
      });
    });
    it("> verify author side card view(before manual evaluation)", () => {
      cy.login("teacher", Teacher.email, Teacher.pass);
      testLibraryPage.sidebar.clickOnAssignment();

      // status is submitted in other cases it will be graded
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.verifyStudentStatusIsByIndex(0, studentSide.SUBMITTED.toLowerCase(), true);

      // marks should be '0' and que bars should reflect manually graded colors
      lcb.getStudentScoreByIndex(0).should("contain.text", "0 / 6");
      barGraph.verifyQueBarAndToolTipBasedOnAttemptData(attemptTypeData, Cypress._.keys(attemptTypeData.attempt));
    });
    it("> verify author side student view(before manual evaluation)", () => {
      // que bars should reflect manually graded colors
      lcb.clickOnStudentsTab();
      barGraph.verifyQueBarAndToolTipBasedOnAttemptData(attemptTypeData, Cypress._.keys(attemptTypeData.attempt));
    });
    it("> verify author side question view(before manual evaluation)", () => {
      // que bars should reflect manually graded colors
      lcb.clickonQuestionsTab();
      const queCentric = {};
      lcb.getQuestionCentricData(attemptTypeData, queCentric);
      Cypress._.keys(attemptTypeData[0].attempt).forEach(que => {
        lcb.questionResponsePage.selectQuestion(que);
        barGraph.verifyQueBarBasedOnQueAttemptData(queCentric[que]);
      });
    });
    it("> verify status and try closing", () => {
      // closing should not be allowed as still evaluation needs to be done
      lcb.header.verifyAssignmentStatus(teacherSide.IN_GRADING);
      lcb.header.clickOnClose(false);
      lcb.header.verifyAssignmentStatus(teacherSide.IN_GRADING);
    });
    it("> manual evaluation in question view", () => {
      // evaluate each question manually and verify ques bars parallelly according to assigned marks
      itemKeys.forEach((item, i) => {
        lcb.questionResponsePage.selectQuestion(`Q${i + 1}`);
        lcb.questionResponsePage.getQuestionContainerByStudent(Student1Class1.name).as("studentQuesCard");
        lcb.questionResponsePage.getScoreInput(cy.get("@studentQuesCard")).should("have.attr", "value", ``);
        lcb.questionResponsePage.updateScoreAndFeedbackForStudent(Student1Class1.name, score[i]);
        attemptTypeData[0].attempt[`Q${i + 1}`] = attemptTypes[i];
        barGraph.verifyQueBarBasedOnQueAttemptData({ Student1: attemptTypes[i] });
      });
    });

    it("> verify author side student view(after manual evaluation)", () => {
      // verify ques bars parallelly according to assigned marks and total marks
      lcb.clickOnStudentsTab();
      itemKeys.forEach((item, i) => {
        lcb.questionResponsePage.getQuestionContainer(i).as("studentQuesCard");
        lcb.questionResponsePage.getScoreInput(cy.get("@studentQuesCard")).should("have.attr", "value", `${score[i]}`);
      });
      qrp.verifyTotalScoreAndImprovement(3, 6);
      barGraph.verifyQueBarAndToolTipBasedOnAttemptData(attemptTypeData, Cypress._.keys(attemptTypeData.attempt));
    });
    it("> verify author side card view(after manual evaluation)", () => {
      // verify ques bars parallelly according to assigned marks and total marks
      lcb.clickOnCardViewTab();
      lcb.verifyStudentStatusIsByIndex(0, studentSide.GRADED);
      lcb.getStudentScoreByIndex(0).should("contain.text", "3 / 6");
      lcb.verifyQuestionCards(0, attemptTypes);
      lcb.getStudentPerformanceByIndex(0).should("contain", `50%`);
      barGraph.verifyQueBarAndToolTipBasedOnAttemptData(attemptTypeData, Cypress._.keys(attemptTypeData.attempt));
    });
    it("> verify status and try closing", () => {
      // closing should be possible as its evalluated now
      lcb.header.verifyAssignmentStatus(teacherSide.IN_GRADING);
      lcb.header.clickOnClose();
      lcb.header.verifyAssignmentStatus(teacherSide.DONE);
    });
    it("> verify author side express grader", () => {
      lcb.header.clickOnExpressGraderTab();
      itemKeys.forEach((item, i) => {
        grader.verifyScoreAndPerformanceForQueNum(`Q${i + 1}`, `${Cypress._.round(score[i] / 2, 2)}/1`, percent[i]);
      });
    });
    it("> verify student side reports(before manual evaluation)", () => {
      // status should be graded now
      cy.login("student", Student1Class1.email, Student1Class1.pass);
      assignmentsPage.sidebar.clickOnGrades();
      reportsPage.verifyStatusIs(asgnstatus.graded);
      reportsPage.getPercentByTestId(OriginalTestId).should("have.text", `50%`);
      assignmentsPage.reviewSubmittedTestById(OriginalTestId);
      itemKeys.forEach((item, i) => {
        reportsPage.selectQuestion(`Q${i + 1}`);
        reportsPage.getAchievedScore().should("contain.text", score[i]);
      });
    });
  });

  context("> when student 'skips' question", () => {
    // when student skips all manually graded item in a test, test pocesses normal evalution features
    before("> assign test", () => {
      cy.deleteAllAssignments(Student1Class1.email, Teacher.email);
      cy.login("teacher", Teacher.email, Teacher.pass);
      testLibraryPage.assignPage.visitAssignPageById(OriginalTestId);
      testLibraryPage.assignPage.selectClass("Class");
      testLibraryPage.assignPage.clickOnAssign();
    });
    before("> attempt test and skip all questions", () => {
      cy.login("student", Student1Class1.email, Student1Class1.pass);
      assignmentsPage.verifyPresenceOfTest(OriginalTestId);
      assignmentsPage.getAssignmentByTestId(OriginalTestId).should("have.length", 1);
      assignmentsPage.clickOnAssignmentButton();
      itemKeys.forEach((item, i) => {
        attemptTypeData[0].attempt[`Q${i + 1}`] = "skip";
        studentTestPage.attemptQuestion(item.split(".")[0], "skip", attemptData);
        studentTestPage.clickOnNext(false, true);
      });
      studentTestPage.submitTest();
    });
    it("> verify student side reports", () => {
      // status should be 'graded' as all ques are skipped
      reportsPage.verifyStatusIs(asgnstatus.graded);
      reportsPage.getPercentByTestId(OriginalTestId).should("have.text", `0%`);
      assignmentsPage.reviewSubmittedTestById(OriginalTestId);
      itemKeys.forEach((item, i) => {
        reportsPage.selectQuestion(`Q${i + 1}`);
        reportsPage.getAchievedScore().should("contain.text", `0`);
      });
    });
    it("> verify author side card view", () => {
      // status should be 'graded' and all que bars should reflect as 'skipped'
      cy.login("teacher", Teacher.email, Teacher.pass);
      testLibraryPage.sidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.getStudentScoreByIndex(0).should("contain.text", "0 / 6");
      barGraph.verifyQueBarAndToolTipBasedOnAttemptData(attemptTypeData, Cypress._.keys(attemptTypeData.attempt));

      lcb.clickOnStudentsTab();
      barGraph.verifyQueBarAndToolTipBasedOnAttemptData(attemptTypeData, Cypress._.keys(attemptTypeData.attempt));
    });
    it("> verify author side question view", () => {
      // all que bars should reflect as 'skipped'
      lcb.clickonQuestionsTab();
      const queCentric = {};
      lcb.getQuestionCentricData(attemptTypeData, queCentric);
      Cypress._.keys(attemptTypeData[0].attempt).forEach(que => {
        lcb.questionResponsePage.selectQuestion(que);
        barGraph.verifyQueBarBasedOnQueAttemptData(queCentric[que]);
        lcb.questionResponsePage.getQuestionContainerByStudent(Student1Class1.name).as("studentQuesCard");
        lcb.questionResponsePage.getScoreInput(cy.get("@studentQuesCard")).should("have.attr", "value", `0`);
      });
    });

    it("> verify author side student view", () => {
      // all que bars should reflect as 'skipped'
      lcb.clickOnStudentsTab();
      itemKeys.forEach((item, i) => {
        lcb.questionResponsePage.getQuestionContainer(i).as("studentQuesCard");
        lcb.questionResponsePage.getScoreInput(cy.get("@studentQuesCard")).should("have.attr", "value", `0`);
      });
      qrp.verifyTotalScoreAndImprovement(0, 6);
      barGraph.verifyQueBarAndToolTipBasedOnAttemptData(attemptTypeData, Cypress._.keys(attemptTypeData.attempt));
    });

    it("> verify status and try closing", () => {
      // closing is allowed as all ques are skipped ('evaluated')
      lcb.header.verifyAssignmentStatus(teacherSide.IN_GRADING);
      lcb.header.clickOnClose();
      lcb.header.verifyAssignmentStatus(teacherSide.DONE);
    });

    it("> verify author side express grader", () => {
      lcb.header.clickOnExpressGraderTab();
      itemKeys.forEach((item, i) => {
        grader.verifyScoreAndPerformanceForQueNum(`Q${i + 1}`, `0/1`, 0);
      });
    });
  });
});
