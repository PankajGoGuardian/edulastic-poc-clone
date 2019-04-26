import AssignmentsPage from "../../../framework/student/assignmentsPage";
import SidebarPage from "../../../framework/student/sidebarPage";
import FileHelper from "../../../framework/util/fileHelper";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Test Assignment Page`, () => {
  const sideBarPage = new SidebarPage();
  const assignmentPage = new AssignmentsPage();
  const assignmentName = "Classify, Match & Order Auto Test";
  const asgnstatus = {
    notstarted: "NOT STARTED",
    inprogress: "IN PROGRESS",
    sub: "GRADED"
  };
  const buttonText = { start: "START ASSIGNMENT", retake: "RETAKE", resume: "RESUME", review: "REVIEW" };

  const ques = [
    {
      "Question 1": "Q1"
    },
    {
      "Question 2": "Q2"
    },
    {
      "Question 3": "Q3"
    },
    {
      "Question 4": "Q4"
    }
  ];

  const selectedColor = "rgb(223, 223, 223)";
  const deselectedColor = "rgba(0, 0, 0, 0)";

  let test;
  let TestTypes;
  let DefinedAnswers;
  let DefinedIndex;

  before(() => {
    cy.login("student");
  });
  context("Assignment attempt and stats", () => {
    before(() => {
      cy.fixture("studentsAttempt").then(data => {
        TestTypes = data.testTypes;
        DefinedAnswers = data.definedAnswers;
        DefinedIndex = data.definedIndex;

        cy.deleteAllAssignments();
        cy.assignAssignment(TestTypes.classifyMatchOrder);
        cy.reload();
        cy.wait("@assignment");
      });
    });

    context("1st attempt - test assessment player,attempt all questions and submit the test,validate", () => {
      it("Check Assignment Status and Start Test", () => {
        assignmentPage.validateAssignment(assignmentName, asgnstatus.notstarted, buttonText.start);
        test = assignmentPage.clickOnAssignmentButton();
      });

      it("Attepmt Sort List Test", () => {
        // hightlight test
        test.checkHighLightByIndex(DefinedIndex.right, selectedColor, deselectedColor);
        test.checkHighLightByIndex(DefinedIndex.wrong, selectedColor, deselectedColor);

        // move right and validate wrong
        test.getSourceAnswerByIndex(DefinedIndex.right).click();
        test.clickRightMoveButton();
        test
          .getTargetAnswerByIndex(DefinedIndex.right)
          .contains("p", DefinedAnswers.wrong)
          .should("be.visible");

        test.getSourceAnswerByIndex(DefinedIndex.wrong).click();
        test.clickRightMoveButton();
        test
          .getTargetAnswerByIndex(DefinedIndex.wrong)
          .contains("p", DefinedAnswers.right)
          .should("be.visible");
        test.checkAnsValidateAsWrong();

        // move up/down and validate right

        test.getTargetAnswerByIndex(DefinedIndex.right).click();
        test.clickDownMoveButton();
        test.checkAnsValidateAsRight();

        test.getTargetAnswerByIndex(DefinedIndex.wrong).click();
        test.clickUpMoveButton();
        test.checkAnsValidateAsWrong();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[1], 1, 4);
        test.browserBack();
        test
          .getTargetAnswerByIndex(DefinedIndex.right)
          .contains("p", DefinedAnswers.wrong)
          .should("be.visible");
        test
          .getTargetAnswerByIndex(DefinedIndex.right)
          .contains("p", DefinedAnswers.wrong)
          .should("be.visible");
        test.checkAnsValidateAsWrong();

        // check answer with Drag and Drop feature
        test.dragAndDropSortListByOnTargetByIndex(DefinedAnswers.right, 1, 0);
        test.checkAnsValidateAsRight();

        // refresh & check preserved answer
        // test.firstPageRefreshWithNavButton("Q1");
        // test.getTargetAnswerByIndex(DefinedIndex.right)
        //   .contains('p', DefinedAnswers.right);
        // test.getTargetAnswerByIndex(DefinedIndex.wrong)
        //   .contains('p', DefinedAnswers.wrong);
        // test.checkAnsValidateAsRight();
      });

      it("Attepmt Classification Test", () => {
        test.clickOnNext();
        cy.contains("Q2").should("be.visible");

        // drag drop wrong answer
        // test.dragAndDropClassifcationFromSourceToTarget(DefinedAnswers.wrong, 1, 1)
        // test.dragAndDropClassifcationFromSourceToTarget(DefinedAnswers.right, 0, 0)
        // test.checkAnsValidateAsWrong();

        // drag drop right answer
        // test.dragAndDropClassifcationInsideTarget(DefinedAnswers.right, 1, 0)
        // test.checkAnsValidateAsRight();

        // found crashing on drag drop answer to target
      });

      it("Attepmt Match List Test", () => {
        test.clickOnNext();
        cy.contains("Q3").should("be.visible");

        // drag drop wrong answer
        test.dragAndDropMatchListFromSourceToTarget(DefinedAnswers.right, 2);
        test.dragAndDropMatchListFromSourceToTarget(DefinedAnswers.wrong, 1);
        test.dragAndDropMatchListFromSourceToTarget(DefinedAnswers.other, 0);
        test.checkAnsValidateAsWrong();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[1], 1, 4);
        test.browserBack();
        test
          .getMatchListTargetByIndex(0)
          .contains("p", DefinedAnswers.other)
          .should("be.visible");
        test
          .getMatchListTargetByIndex(1)
          .contains("p", DefinedAnswers.wrong)
          .should("be.visible");
        test
          .getMatchListTargetByIndex(2)
          .contains("p", DefinedAnswers.right)
          .should("be.visible");
        test.checkAnsValidateAsWrong();

        // try retake
        test.clickOnExitTest();
        test.clickOnCancel();
        test.clickOnExitTest();
        test.clickOnProceed();
        cy.url().should("include", "/home/assignments");
        assignmentPage.validateAssignment(assignmentName, asgnstatus.inprogress, buttonText.resume);
        // resume assignment
        assignmentPage.clickOnAssignmentButton();
        cy.contains("Q3").should("be.visible");

        // drag drop right answer
        test.dragAndDropClassifcationInsideTarget(DefinedAnswers.right, 2, 0);
        test.dragAndDropMatchListFromSourceToTarget(DefinedAnswers.other, 2);
        test.checkAnsValidateAsRight();

        // refresh & check preserved answer
        // test.pageRefreshWithNavButton("Q3");
        // test.getMatchListTargetByIndex(DefinedIndex.right)
        //   .contains('p', DefinedAnswers.right);
        // test.getMatchListTargetByIndex(DefinedIndex.wrong)
        //   .contains('p', DefinedAnswers.wrong);
        // test.getMatchListTargetByIndex(DefinedIndex.other)
        //   .contains('p', DefinedAnswers.other);
        // test.checkAnsValidateAsRight();
      });

      it("Attepmt OrderList Test", () => {
        test.clickOnNext();
        cy.contains("Q4").should("be.visible");

        // drag drop wrong answer
        test.dragAndDropSortList(DefinedAnswers.right, 0, 0);
        test.checkAnsValidateAsRight();

        test.clickOnNext();
        // review page
        test.submitTest();
        sideBarPage.clickOnAssignment();

        // validate stats
        assignmentPage.validateAssignment(assignmentName, asgnstatus.inprogress, buttonText.retake);
        assignmentPage.validateStats(1, "1/2", "3/3", "75%");
      });
    });

    context("2nd attempt - attempt questions,submit the test,validate stats", () => {
      it("Attepmt Sort List Test", () => {
        test = assignmentPage.clickOnAssignmentButton();
        cy.contains("Q1").should("be.visible");

        // move right and validate wrong
        test.getSourceAnswerByIndex(DefinedIndex.right).click();
        test.clickRightMoveButton();
        test
          .getTargetAnswerByIndex(DefinedIndex.right)
          .contains("p", DefinedAnswers.wrong)
          .should("be.visible");

        test.getSourceAnswerByIndex(DefinedIndex.wrong).click();
        test.clickRightMoveButton();
        test
          .getTargetAnswerByIndex(DefinedIndex.wrong)
          .contains("p", DefinedAnswers.right)
          .should("be.visible");
        test.checkAnsValidateAsWrong();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[1], 1, 4);
        test.browserBack();
        test
          .getTargetAnswerByIndex(DefinedIndex.right)
          .contains("p", DefinedAnswers.wrong)
          .should("be.visible");
        test
          .getTargetAnswerByIndex(DefinedIndex.right)
          .contains("p", DefinedAnswers.wrong)
          .should("be.visible");
        test.checkAnsValidateAsWrong();
      });

      it("Attepmt Classification Test", () => {
        test.clickOnNext();
        cy.contains("Q2").should("be.visible");

        // found crashing on drag drop answer to target
      });

      it("Attepmt Match List Test", () => {
        test.clickOnNext();
        cy.contains("Q3").should("be.visible");

        // drag drop wrong answer
        test.dragAndDropMatchListFromSourceToTarget(DefinedAnswers.right, 2);
        test.dragAndDropMatchListFromSourceToTarget(DefinedAnswers.wrong, 1);
        test.dragAndDropMatchListFromSourceToTarget(DefinedAnswers.other, 0);
        test.checkAnsValidateAsWrong();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[1], 1, 4);
        test.browserBack();
        test
          .getMatchListTargetByIndex(0)
          .contains("p", DefinedAnswers.other)
          .should("be.visible");
        test
          .getMatchListTargetByIndex(1)
          .contains("p", DefinedAnswers.wrong)
          .should("be.visible");
        test
          .getMatchListTargetByIndex(2)
          .contains("p", DefinedAnswers.right)
          .should("be.visible");
        test.checkAnsValidateAsWrong();
      });

      it("Attepmt OrderList Test", () => {
        test.clickOnNext();
        cy.contains("Q4").should("be.visible");

        // drag drop wrong answer
        test.dragAndDropSortList(DefinedAnswers.right, 0, 0);
        test.checkAnsValidateAsRight();
      });

      it("Check report", () => {
        test.clickOnNext();

        // review page
        const reportsPage = test.submitTest();
        // validate stats

        // validate stats
        cy.contains("div", assignmentName).should("be.visible");
        assignmentPage.getStatus().should("have.text", asgnstatus.sub);
        assignmentPage.getReviewButton().should("have.text", buttonText.review);

        reportsPage.validateStats(2, "2/2", "1/3", "25%");
        reportsPage.validateAttemptLinkStats(2, 1, "3/3", "75%");

        sideBarPage.clickOnAssignment();
        cy.contains(assignmentName).should("not.be.visible");
      });
    });
  });
});
