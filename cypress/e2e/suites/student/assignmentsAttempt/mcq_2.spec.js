import AssignmentsPage from "../../../framework/student/assignmentsPage";
import SidebarPage from "../../../framework/student/sidebarPage";
import FileHelper from "../../../framework/util/fileHelper";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Test Assignment Page`, () => {
  const sideBarPage = new SidebarPage();
  const assignmentPage = new AssignmentsPage();
  const assignmentName = "MCQ Auto Test 2";
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
        cy.assignAssignment(TestTypes.multipleChoice2);
        cy.reload();
        cy.wait("@assignment");
      });
    });

    context("1st attempt - test assessment player,attempt all questions and submit the test,validate", () => {
      it("Check Assignment Status", () => {
        assignmentPage.validateAssignment(assignmentName, asgnstatus.notstarted, buttonText.start);
        test = assignmentPage.clickOnAssignmentButton();
      });

      it("Attempt Q1 - Choice Matrix - Standard", () => {
        cy.contains("Q1").should("be.visible");
        // highlight test & wrong ans
        test.clickSecondRadioByTitle(DefinedAnswers.right);
        test.clickFirstRadioByTitle(DefinedAnswers.wrong);
        test.clickSecondRadioByTitle(DefinedAnswers.other);
        test.checkAnsValidateAsWrong();

        // right answer check
        test.clickFirstRadioByTitle(DefinedAnswers.right);
        test.clickSecondRadioByTitle(DefinedAnswers.wrong);
        test.clickFirstRadioByTitle(DefinedAnswers.other);
        test.checkAnsValidateAsRight();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[1], 1, 4);
        test.browserBack();
        test.shouldCheckedFirstRadio(DefinedAnswers.right);
        test.shouldCheckedSecondRadio(DefinedAnswers.wrong);
        test.shouldCheckedFirstRadio(DefinedAnswers.other);
        test.checkAnsValidateAsRight();

        // refresh & check preserved answer
        test.firstPageRefreshWithNavButton("Q1");
        test.shouldCheckedFirstRadio(DefinedAnswers.right);
        test.shouldCheckedSecondRadio(DefinedAnswers.wrong);
        test.shouldCheckedFirstRadio(DefinedAnswers.other);

        test.checkAnsValidateAsRight();
      });

      it("Attempt Q2 - Choice Matrix - Inline", () => {
        test.clickOnNext();
        cy.contains("Q2").should("be.visible");

        // highlight test & wrong ans
        test.clickSecondRadioByTitle(DefinedAnswers.right);
        test.clickFirstRadioByTitle(DefinedAnswers.wrong);
        test.clickSecondRadioByTitle(DefinedAnswers.other);
        test.checkAnsValidateAsWrong();

        // right answer check
        test.clickFirstRadioByTitle(DefinedAnswers.right);
        test.clickSecondRadioByTitle(DefinedAnswers.wrong);
        test.clickFirstRadioByTitle(DefinedAnswers.other);
        test.checkAnsValidateAsRight();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[0], 0, 4);
        test.browserBack();
        test.shouldCheckedFirstRadio(DefinedAnswers.right);
        test.shouldCheckedSecondRadio(DefinedAnswers.wrong);
        test.shouldCheckedFirstRadio(DefinedAnswers.other);
        test.checkAnsValidateAsRight();

        // refresh & check preserved answer
        test.pageRefreshWithNavButton("Q2");
        test.shouldCheckedFirstRadio(DefinedAnswers.right);
        test.shouldCheckedSecondRadio(DefinedAnswers.wrong);
        test.shouldCheckedFirstRadio(DefinedAnswers.other);
        test.checkAnsValidateAsRight();
      });

      it("Attempt Q3 - Choice Matrix - Labels", () => {
        test.clickOnNext();
        cy.contains("Q3").should("be.visible");

        // highlight test & wrong ans
        test.clickSecondRadioByTitle(DefinedAnswers.right);
        test.clickFirstRadioByTitle(DefinedAnswers.wrong);
        test.clickSecondRadioByTitle(DefinedAnswers.other);
        test.checkAnsValidateAsWrong();

        // right answer check
        test.clickFirstRadioByTitle(DefinedAnswers.right);
        test.clickSecondRadioByTitle(DefinedAnswers.wrong);
        test.clickFirstRadioByTitle(DefinedAnswers.other);
        test.checkAnsValidateAsRight();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[1], 1, 4);
        test.browserBack();
        test.shouldCheckedFirstRadio(DefinedAnswers.right);
        test.shouldCheckedSecondRadio(DefinedAnswers.wrong);
        test.shouldCheckedFirstRadio(DefinedAnswers.other);
        test.checkAnsValidateAsRight();

        // refresh & check preserved answer
        test.pageRefreshWithNavButton("Q3");
        test.shouldCheckedFirstRadio(DefinedAnswers.right);
        test.shouldCheckedSecondRadio(DefinedAnswers.wrong);
        test.shouldCheckedFirstRadio(DefinedAnswers.other);
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

      it("End first Attempt", () => {
        // review page
        test.clickOnNext();
        test.submitTest();
        sideBarPage.clickOnAssignment();

        // validate stats
        assignmentPage.validateAssignment(assignmentName, asgnstatus.inprogress, buttonText.retake);
        assignmentPage.validateStats(1, "1/2", "3/3", "100%"); // assignmentPage.validateStats(1, "1/2", "4/4", "100%");
      });
    });

    context("2nd attempt - attempt questions,submit the test,validate stats", () => {
      it("Attempt Q1 - Choice Matrix - Standard", () => {
        test = assignmentPage.clickOnAssignmentButton();
        cy.contains("Q1").should("be.visible");

        cy.contains("Q1").should("be.visible");
        // highlight test & wrong ans
        test.clickSecondRadioByTitle(DefinedAnswers.right);
        test.clickFirstRadioByTitle(DefinedAnswers.wrong);
        test.clickSecondRadioByTitle(DefinedAnswers.other);
        test.checkAnsValidateAsWrong();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[1], 1, 4);
        test.browserBack();
        test.shouldCheckedSecondRadio(DefinedAnswers.right);
        test.shouldCheckedFirstRadio(DefinedAnswers.wrong);
        test.shouldCheckedSecondRadio(DefinedAnswers.other);
        test.checkAnsValidateAsWrong();
      });

      it("Attempt Q2 - Choice Matrix - Inline", () => {
        test.clickOnNext();
        cy.contains("Q2").should("be.visible");

        // highlight test & wrong ans
        test.clickSecondRadioByTitle(DefinedAnswers.right);
        test.clickFirstRadioByTitle(DefinedAnswers.wrong);
        test.clickSecondRadioByTitle(DefinedAnswers.other);
        test.checkAnsValidateAsWrong();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[0], 0, 4);
        test.browserBack();
        test.shouldCheckedSecondRadio(DefinedAnswers.right);
        test.shouldCheckedFirstRadio(DefinedAnswers.wrong);
        test.shouldCheckedSecondRadio(DefinedAnswers.other);
        test.checkAnsValidateAsWrong();
      });

      it("Attempt Q3 - Choice Matrix - Labels", () => {
        test.clickOnNext();
        cy.contains("Q3").should("be.visible");

        // right answer check
        test.clickFirstRadioByTitle(DefinedAnswers.right);
        test.clickSecondRadioByTitle(DefinedAnswers.wrong);
        test.clickFirstRadioByTitle(DefinedAnswers.other);
        test.checkAnsValidateAsRight();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[1], 1, 4);
        test.browserBack();
        test.shouldCheckedFirstRadio(DefinedAnswers.right);
        test.shouldCheckedSecondRadio(DefinedAnswers.wrong);
        test.shouldCheckedFirstRadio(DefinedAnswers.other);
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

        reportsPage.validateStats(2, "2/2", "1/3", "33.33%");
        reportsPage.validateAttemptLinkStats(2, 1, "3/3", "100%");

        sideBarPage.clickOnAssignment();
        cy.contains(assignmentName).should("not.be.visible");
      });
    });
  });
});
