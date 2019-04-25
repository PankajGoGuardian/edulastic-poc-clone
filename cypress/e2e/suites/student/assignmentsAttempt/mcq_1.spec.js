import AssignmentsPage from "../../../framework/student/assignmentsPage";
import SidebarPage from "../../../framework/student/sidebarPage";
import FileHelper from "../../../framework/util/fileHelper";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Test Assignment Page`, () => {
  const sideBarPage = new SidebarPage();
  const assignmentPage = new AssignmentsPage();
  const assignmentName = "MCQ Auto Test 1";
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

  let test;
  let TestTypes;
  let DefinedAnswers;

  before(() => {
    cy.login("student");
  });
  context("Assignment attempt and stats", () => {
    before(() => {
      cy.fixture("studentsAttempt").then(data => {
        TestTypes = data.testTypes;
        DefinedAnswers = data.definedAnswers;

        cy.deleteAllAssignments();
        cy.assignAssignment(TestTypes.multipleChoice1);
        cy.reload();
        cy.wait("@assignment");
      });
    });

    context("1st attempt - test assessment player,attempt all questions and submit the test,validate", () => {
      it("Check Assignment Status", () => {
        assignmentPage.validateAssignment(assignmentName, asgnstatus.notstarted, buttonText.start);
        test = assignmentPage.clickOnAssignmentButton();
      });

      it("Attempt Q1 - Multiple Choice - Standard", () => {
        cy.contains("Q1").should("be.visible");
        // highlight test & wrong ans
        test.checkHighLightByAnswer(DefinedAnswers.right);
        test.checkHighLightByAnswer(DefinedAnswers.wrong);
        test.checkAnsValidateAsWrong();

        // right answer check
        test.checkHighLightByAnswer(DefinedAnswers.right);
        test.checkAnsValidateAsRight();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[1], 1, 4);
        test.browserBack();
        cy.contains(DefinedAnswers.right)
          .closest("label")
          .find("input")
          .should("be.checked");
        cy.contains(DefinedAnswers.wrong)
          .closest("label")
          .find("input")
          .should("not.checked");
        test.checkAnsValidateAsRight();

        // refresh & check preserved answer
        test.firstPageRefreshWithNavButton("Q1");
        cy.contains(DefinedAnswers.right)
          .closest("label")
          .find("input")
          .should("be.checked");
        cy.contains(DefinedAnswers.wrong)
          .closest("label")
          .find("input")
          .should("not.checked");
        test.checkAnsValidateAsRight();
      });

      it("Attempt Q2 - Multiple Choice - Multiple Response", () => {
        test.clickOnNext();
        cy.contains("Q2").should("be.visible");

        // highlight test & wrong ans
        test.checkHighLightByAnswer(DefinedAnswers.right);
        test.checkHighLightByAnswer(DefinedAnswers.wrong);
        test.checkHighLightByAnswer(DefinedAnswers.other);
        test.checkAnsValidateAsWrong();

        // right answer check

        test.checkHighLightUncheckedByAnswer(DefinedAnswers.wrong);
        test.checkAnsValidateAsWrong(); // test.checkAnsValidateAsRight();
        //* Multiple reseponse has an issue, it doesn't validate the right answer, always wrong for any answers */

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[0], 0, 4);
        test.browserBack();
        cy.contains(DefinedAnswers.right)
          .closest("label")
          .find("input")
          .should("be.checked");
        cy.contains(DefinedAnswers.wrong)
          .closest("label")
          .find("input")
          .should("not.checked");
        cy.contains(DefinedAnswers.other)
          .closest("label")
          .find("input")
          .should("be.checked");
        test.checkAnsValidateAsWrong(); // test.checkAnsValidateAsRight();

        // refresh & check preserved answer
        test.pageRefreshWithNavButton("Q2");
        cy.contains(DefinedAnswers.right)
          .closest("label")
          .find("input")
          .should("be.checked");
        cy.contains(DefinedAnswers.wrong)
          .closest("label")
          .find("input")
          .should("not.checked");
        cy.contains(DefinedAnswers.other)
          .closest("label")
          .find("input")
          .should("be.checked");
        test.checkAnsValidateAsWrong(); // test.checkAnsValidateAsRight();
      });

      it("Attempt Q3 - True Or False", () => {
        test.clickOnNext();
        cy.contains("Q3").should("be.visible");

        // highlight test & wrong ans
        test.checkHighLightByAnswer(DefinedAnswers.right);
        test.checkHighLightByAnswer(DefinedAnswers.wrong);
        test.checkAnsValidateAsWrong();

        // right answer check
        test.checkHighLightByAnswer(DefinedAnswers.right);
        test.checkAnsValidateAsRight();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[1], 1, 4);
        test.browserBack();
        cy.contains(DefinedAnswers.right)
          .closest("label")
          .find("input")
          .should("be.checked");
        cy.contains(DefinedAnswers.wrong)
          .closest("label")
          .find("input")
          .should("not.checked");
        test.checkAnsValidateAsRight();

        // refresh & check preserved answer
        test.pageRefreshWithNavButton("Q3");
        cy.contains(DefinedAnswers.right)
          .closest("label")
          .find("input")
          .should("be.checked");
        cy.contains(DefinedAnswers.wrong)
          .closest("label")
          .find("input")
          .should("not.checked");
        test.checkAnsValidateAsRight();

        // try retake
        test.clickOnExitTest();
        test.clickOnCancel();
        test.clickOnExitTest();
        test.clickOnProceed();
        cy.url().should("include", "/home/assignments");
        assignmentPage.validateAssignment(assignmentName, asgnstatus.inprogress, buttonText.resume);
        // resume assignment
        assignmentPage.clickOnAssignmentButton();
        test.clickOnNext();
        cy.contains("Q3").should("be.visible");
      });

      it("Attempt Q4 - Multiple Choice - Block Layout", () => {
        test.clickOnNext();
        cy.contains("Q4").should("be.visible");

        // highlight test & wrong ans
        test.checkHighLightByAnswer(DefinedAnswers.right);
        test.checkHighLightByAnswer(DefinedAnswers.wrong);
        test.checkHighLightByAnswer(DefinedAnswers.other);
        test.checkAnsValidateAsWrong();

        // right answer check

        test.checkHighLightUncheckedByAnswer(DefinedAnswers.wrong);
        test.checkAnsValidateAsWrong(); // test.checkAnsValidateAsRight();
        //* Block Layout has an issue, it doesn't validate the right answer, always wrong for any answers */

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[0], 0, 4);
        test.browserBack();
        cy.contains(DefinedAnswers.right)
          .closest("label")
          .find("input")
          .should("be.checked");
        cy.contains(DefinedAnswers.wrong)
          .closest("label")
          .find("input")
          .should("not.checked");
        cy.contains(DefinedAnswers.other)
          .closest("label")
          .find("input")
          .should("be.checked");
        test.checkAnsValidateAsWrong(); // test.checkAnsValidateAsRight();

        // refresh & check preserved answer
        test.pageRefreshWithNavButton("Q4");
        cy.contains(DefinedAnswers.right)
          .closest("label")
          .find("input")
          .should("be.checked");
        cy.contains(DefinedAnswers.wrong)
          .closest("label")
          .find("input")
          .should("not.checked");
        cy.contains(DefinedAnswers.other)
          .closest("label")
          .find("input")
          .should("be.checked");
        test.checkAnsValidateAsWrong(); // test.checkAnsValidateAsRight();
      });

      it("End first Attempt", () => {
        test.clickOnNext();
        // review page
        test.submitTest();
        sideBarPage.clickOnAssignment();

        // validate stats
        assignmentPage.validateAssignment(assignmentName, asgnstatus.inprogress, buttonText.retake);
        assignmentPage.validateStats(1, "1/2", "2/4", "50%"); // assignmentPage.validateStats(1, "1/2", "4/4", "100%");
      });
    });

    context("2nd attempt - attempt questions,submit the test,validate stats", () => {
      it("Attempt Q1 - Multiple Choice - Standard", () => {
        test = assignmentPage.clickOnAssignmentButton();
        cy.contains("Q1").should("be.visible");

        // highlight test & right ans
        test.checkHighLightByAnswer(DefinedAnswers.wrong);
        test.checkHighLightByAnswer(DefinedAnswers.right);
        test.checkAnsValidateAsRight();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[1], 1, 4);
        test.browserBack();
        cy.contains(DefinedAnswers.right)
          .closest("label")
          .find("input")
          .should("be.checked");
        cy.contains(DefinedAnswers.wrong)
          .closest("label")
          .find("input")
          .should("not.checked");
        test.checkAnsValidateAsRight();
      });

      it("Attempt Q2 - Multiple Choice - Multiple Response", () => {
        test.clickOnNext();
        cy.contains("Q2").should("be.visible");

        // highlight test & wrong ans
        test.checkHighLightByAnswer(DefinedAnswers.right);
        test.checkHighLightByAnswer(DefinedAnswers.wrong);
        test.checkHighLightByAnswer(DefinedAnswers.other);
        test.checkAnsValidateAsWrong();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[0], 0, 4);
        test.browserBack();
        cy.contains(DefinedAnswers.right)
          .closest("label")
          .find("input")
          .should("be.checked");
        cy.contains(DefinedAnswers.wrong)
          .closest("label")
          .find("input")
          .should("be.checked");
        cy.contains(DefinedAnswers.other)
          .closest("label")
          .find("input")
          .should("be.checked");
        test.checkAnsValidateAsWrong();
      });

      it("Attempt Q3 - True Or False", () => {
        test.clickOnNext();
        cy.contains("Q3").should("be.visible");

        // highlight test & wrong ans
        test.checkHighLightByAnswer(DefinedAnswers.right);
        test.checkHighLightByAnswer(DefinedAnswers.wrong);
        test.checkAnsValidateAsWrong();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[1], 1, 4);
        test.browserBack();
        cy.contains(DefinedAnswers.right)
          .closest("label")
          .find("input")
          .should("not.checked");
        cy.contains(DefinedAnswers.wrong)
          .closest("label")
          .find("input")
          .should("be.checked");
        test.checkAnsValidateAsWrong();
      });

      it("Attempt Q4 - Multiple Choice - Block Layout", () => {
        test.clickOnNext();
        cy.contains("Q4").should("be.visible");

        // highlight test & wrong ans
        test.checkHighLightByAnswer(DefinedAnswers.right);
        test.checkHighLightByAnswer(DefinedAnswers.wrong);
        test.checkHighLightByAnswer(DefinedAnswers.other);
        test.checkAnsValidateAsWrong();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[0], 0, 4);
        test.browserBack();
        cy.contains(DefinedAnswers.right)
          .closest("label")
          .find("input")
          .should("be.checked");
        cy.contains(DefinedAnswers.wrong)
          .closest("label")
          .find("input")
          .should("be.checked");
        cy.contains(DefinedAnswers.other)
          .closest("label")
          .find("input")
          .should("be.checked");
        test.checkAnsValidateAsWrong();
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

        reportsPage.validateStats(2, "2/2", "1/4", "25%");
        reportsPage.validateAttemptLinkStats(2, 1, "2/4", "50%");

        sideBarPage.clickOnAssignment();
        cy.contains(assignmentName).should("not.be.visible");
      });
    });
  });
});
