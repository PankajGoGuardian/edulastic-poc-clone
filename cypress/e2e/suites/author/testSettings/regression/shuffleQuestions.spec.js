import TeacherSideBar from "../../../../framework/author/SideBarPage";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import { assignmentButtonsText } from "../../../../framework/constants/assignmentStatus";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import FileHelper from "../../../../framework/util/fileHelper";
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import CypressHelper from "../../../../framework/util/cypressHelpers";

const { TEST_SETTING } = require("../../../../../fixtures/testAuthoring");
const questionData = require("../../../../../fixtures/questionAuthoring");

const { _ } = Cypress;

const students = {
  "1": {
    email: "student.1.shufflequestions@snapwiz.com",
    stuName: "shuffleQuestions, student.1"
  },
  "2": {
    email: "student.2.shufflequestions@snapwiz.com",
    stuName: "shuffleQuestions, student.2"
  },
  "3": {
    email: "student.3.shufflequestions@snapwiz.com",
    stuName: "shuffleQuestions, student.3"
  }
};

function isSequenceMatch(itemSeq, attemptSeq) {
  let matched = true;
  for (const itemKey of itemSeq) {
    if (!attemptSeq[itemSeq.indexOf(itemKey)].includes(itemKey)) {
      matched = false;
      break;
    }
  }
  return matched;
}

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Test Settings`, () => {
  const assignmentPage = new AssignmentsPage();
  const studentTest = new StudentTestPage();
  const testLibrary = new TestLibrary();
  const teacherSidebar = new TeacherSideBar();
  const teacherAssignmentPage = new AuthorAssignmentPage();
  const lcb = new LiveClassboardPage();

  const { itemKeys, name: assignmentName } = TEST_SETTING;
  const asgnstatus = {
    notstarted: "NOT STARTED",
    inprogress: "IN PROGRESS",
    sub: "SUBMITTED",
    graded: "GRADED"
  };
  const { start, retake, review } = assignmentButtonsText;

  const className = "Automation Class - shuffleQuestions teacher.1";
  const teacher = "teacher.1.shufflequestions@snapwiz.com";
  const password = "snapwiz";
  let testId;

  before(" > create new test set shuffle question", () => {
    cy.deleteAllAssignments(undefined, teacher, password);
    // creating test
    cy.login("teacher", teacher, password);
    testLibrary.createTest("TEST_SETTING").then(id => {
      testId = id;
      cy.contains("Share With Others");

      // update the settings
      cy.visit(`author/tests/tab/settings/id/${testId}`);
      testLibrary.header.clickOnEditButton(true);

      // set shuffle question to ON
      testLibrary.testSettings.getShuffleQuestionButton().click();
      testLibrary.header.clickOnPublishButton();
      cy.contains("Share With Others");

      //  assign as class assessment
      testLibrary.clickOnAssign();

      testLibrary.assignPage.selectClass(className);
      testLibrary.assignPage.clickOnAssign();
      teacherSidebar.clickOnAssignment();
    });
  });

  context(` > shuffle questions on`, () => {
    let originalSequence = itemKeys;
    let student1Sequence = [];
    let student2Sequence = [];
    let student3Sequence = [];

    beforeEach(() => studentTest.clickOnExitTest());

    it(` > attempt with -  ${students[1].email}`, () => {
      cy.login("student", students[1].email, password);
      assignmentPage.validateAssignment(assignmentName, asgnstatus.notstarted, start);
      assignmentPage.clickOnAssignmentButton();

      Object.keys(itemKeys).forEach(que => {
        cy.wait(1000);
        studentTest.getQuestionText().then(queText => student1Sequence.push(queText.text()));
        studentTest.clickOnNext();
      });

      studentTest.submitTest().then(() => {
        // TODO: below assertion migth fail sometimes as probability is low for first student
        expect(!isSequenceMatch(originalSequence, student1Sequence), "verify question seq is not same").to.eq(true);
      });
    });

    it(` > attempt with -  ${students[2].email}`, () => {
      cy.login("student", students[2].email, password);
      assignmentPage.validateAssignment(assignmentName, asgnstatus.notstarted, start);
      assignmentPage.clickOnAssignmentButton();

      Object.keys(itemKeys).forEach(que => {
        cy.wait(1000);
        studentTest.getQuestionText().then(queText => student2Sequence.push(queText.text()));
        studentTest.clickOnNext();
      });

      studentTest.submitTest().then(() => {
        expect(
          !isSequenceMatch(originalSequence, student2Sequence) || !_.isEqual(student2Sequence, student1Sequence),
          "verify question seq is not same"
        ).to.eq(true);
      });
    });

    it(` > attempt with -  ${students[3].email}`, () => {
      cy.login("student", students[3].email, password);
      assignmentPage.validateAssignment(assignmentName, asgnstatus.notstarted, start);
      assignmentPage.clickOnAssignmentButton();

      Object.keys(itemKeys).forEach(que => {
        cy.wait(1000);
        studentTest.getQuestionText().then(queText => student3Sequence.push(queText.text()));
        studentTest.clickOnNext();
      });

      studentTest.submitTest().then(() => {
        expect(
          !isSequenceMatch(originalSequence, student3Sequence) ||
            (!_.isEqual(student3Sequence, student1Sequence) || !_.isEqual(student3Sequence, student2Sequence)),
          "verify question seq is not same"
        ).to.eq(true);
      });
    });

    it("> verify LCB student centric view - should have default sequence for all student", () => {
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      teacherAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.clickOnStudentsTab();
      _.keys(students).forEach(stu => {
        const { stuName } = students[stu];
        lcb.questionResponsePage.selectStudent(stuName);
        originalSequence.forEach((queText, q) => {
          lcb.questionResponsePage.getQuestionContainer(q).should("contain.text", queText);
        });
      });
    });

    it("> verify LCB questions centric view - should be enabled with all question", () => {
      lcb.getQuestionsTab().should("not.have.attr", "disabled", "disabled");
      lcb.clickonQuestionsTab();
      lcb.questionResponsePage.getDropDown().click({ force: true });
      CypressHelper.getDropDownList().then(questions => {
        expect(questions).to.have.lengthOf(originalSequence.length);
      });
    });
  });
});
