import AssignmentsPage from "../../../framework/student/assignmentsPage";
import SidebarPage from "../../../framework/student/sidebarPage";
import FileHelper from "../../../framework/util/fileHelper";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Test Assignment Page`, () => {
  const sideBarPage = new SidebarPage();
  const assignmentPage = new AssignmentsPage();
  const assignmentName = "Math Auto Test 1";
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

  const DefinedAnswers = {
    right: "1000",
    wrong: "500"
  };

  let test;
  let TestTypes;

  before(() => {
    cy.login("student");
  });
  context(" > Assignment attempt and stats", () => {
    before(() => {
      cy.fixture("studentsAttempt").then(data => {
        TestTypes = data.testTypes;
        cy.deleteAllAssignments();
        cy.assignAssignment(TestTypes.math1);
        cy.reload();
        cy.wait("@assignment");
      });
    });

    context(" > 1st attempt - test assessment player,attempt all questions and submit the test,validate", () => {
      it(" > Check Assignment Status", () => {
        assignmentPage.validateAssignment(assignmentName, asgnstatus.notstarted, buttonText.start);
        test = assignmentPage.clickOnAssignmentButton();
      });

      it(" > Attempt Q1 - Math Formula", () => {
        cy.contains("Q1").should("be.visible");
        // highlight test & wrong ans
        test.typeFormula(DefinedAnswers.wrong);
        test.typeFormulaWithKeyboard(DefinedAnswers.wrong);
        test.checkAnsValidateAsNoPoint(); // test.checkAnsValidateAsWrong();

        // right answer check
        test.typeFormula(DefinedAnswers.right);
        test.typeFormulaWithKeyboard(DefinedAnswers.right);
        test.checkAnsValidateAsNoPoint(); // test.checkAnsValidateAsRight();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[1], 1, 4);
        test.browserBack();
        test.checkSavedFormulaAnswer(DefinedAnswers.right);
        test.checkAnsValidateAsNoPoint(); // test.checkAnsValidateAsRight();

        // refresh & check preserved answer
        test.firstPageRefreshWithNavButton("Q1");
        test.checkSavedFormulaAnswer(DefinedAnswers.right);
        test.checkAnsValidateAsNoPoint(); // test.checkAnsValidateAsRight();
      });

      it(" > Attempt Q2 - Math With Fractions", () => {
        test.clickOnNext();
        cy.contains("Q2").should("be.visible");

        // highlight test & wrong ans
        test.typeFractionNumerator("1");
        test.typeFractionDenominator(DefinedAnswers.wrong);
        test.checkAnsValidateAsNoPoint(); // test.checkAnsValidateAsWrong();

        // right answer check

        test.typeFractionDenominator(DefinedAnswers.right);
        test.checkAnsValidateAsNoPoint(); // test.checkAnsValidateAsRight();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[0], 0, 4);
        test.browserBack();
        test.checkSavedFractionNumerator("1");
        test.checkSavedFractionDenominator(DefinedAnswers.right);
        test.checkAnsValidateAsNoPoint(); // test.checkAnsValidateAsRight();

        // refresh & check preserved answer
        test.pageRefreshWithNavButton("Q2");
        test.checkSavedFractionNumerator("1");
        test.checkSavedFractionDenominator(DefinedAnswers.right);
        test.checkAnsValidateAsNoPoint(); // test.checkAnsValidateAsRight();
      });

      it(" > Attempt Q3 - Math – Fill In The Blanks", () => {
        test.clickOnNext();
        cy.contains("Q3").should("be.visible");

        // highlight test & wrong ans
        test.typeFormula(DefinedAnswers.wrong);
        test.typeFormulaWithKeyboard(DefinedAnswers.wrong);
        test.checkAnsValidateAsNoPoint(); // test.checkAnsValidateAsWrong();

        // right answer check
        test.typeFormula(DefinedAnswers.right);
        test.typeFormulaWithKeyboard(DefinedAnswers.right);
        test.checkAnsValidateAsNoPoint(); // test.checkAnsValidateAsRight();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[1], 1, 4);
        test.browserBack();
        test.checkSavedFormulaAnswer(DefinedAnswers.right);
        test.checkAnsValidateAsNoPoint(); // test.checkAnsValidateAsRight();

        // refresh & check preserved answer
        test.pageRefreshWithNavButton("Q3");
        test.checkSavedFormulaAnswer(DefinedAnswers.right);
        test.checkAnsValidateAsNoPoint();

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

      it(" > Attempt Q4 - Math With Text", () => {
        test.clickOnNext();
        cy.contains("Q4").should("be.visible");

        // highlight test & wrong ans
        test.typeFormula(DefinedAnswers.wrong);
        test.typeFormulaWithKeyboard(DefinedAnswers.wrong);
        test.checkAnsValidateAsNoPoint(); // test.checkAnsValidateAsWrong();

        // right answer check
        test.typeFormula(DefinedAnswers.right);
        test.typeFormulaWithKeyboard(DefinedAnswers.right);
        test.checkAnsValidateAsNoPoint(); // test.checkAnsValidateAsRight();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[0], 0, 4);
        test.browserBack();
        test.checkSavedFormulaAnswer(DefinedAnswers.right);
        test.checkAnsValidateAsNoPoint(); // test.checkAnsValidateAsRight();

        // refresh & check preserved answer
        test.pageRefreshWithNavButton("Q4");
        test.checkSavedFormulaAnswer(DefinedAnswers.right);
        test.checkAnsValidateAsNoPoint(); // test.checkAnsValidateAsRight();
      });

      it(" > End first Attempt", () => {
        test.clickOnNext();
        // review page
        test.submitTest();
        sideBarPage.clickOnAssignment();

        // validate stats
        assignmentPage.validateAssignment(assignmentName, asgnstatus.inprogress, buttonText.retake);
        assignmentPage.validateStats(1, "1/2", "0/4", "0%"); // assignmentPage.validateStats(1, "1/2", "4/4", "100%");
      });
    });

    context(" > 2nd attempt - attempt questions,submit the test,validate stats", () => {
      it(" > Attempt Q1 - Math Formula", () => {
        test = assignmentPage.clickOnAssignmentButton();
        cy.contains("Q1").should("be.visible");

        // highlight test & right ans
        test.typeFormula(DefinedAnswers.right);
        test.typeFormulaWithKeyboard(DefinedAnswers.right);
        test.checkAnsValidateAsNoPoint(); // test.checkAnsValidateAsRight();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[1], 1, 4);
        test.browserBack();
        test.checkSavedFormulaAnswer(DefinedAnswers.right);
        test.checkAnsValidateAsNoPoint(); // test.checkAnsValidateAsRight();
      });

      it(" > Attempt Q2 - Math With Fractions", () => {
        test.clickOnNext();
        cy.contains("Q2").should("be.visible");

        // highlight test & wrong ans
        test.typeFractionNumerator("1");
        test.typeFractionDenominator(DefinedAnswers.wrong);
        test.checkAnsValidateAsNoPoint(); // test.checkAnsValidateAsWrong();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[0], 0, 4);
        test.browserBack();
        test.checkSavedFractionNumerator("1");
        test.checkSavedFractionDenominator(DefinedAnswers.wrong);
        test.checkAnsValidateAsNoPoint(); // test.checkAnsValidateAsWrong();
      });

      it(" > Attempt Q3 - Math – Fill In The Blanks", () => {
        test.clickOnNext();
        cy.contains("Q3").should("be.visible");

        // highlight test & wrong ans
        test.typeFormula(DefinedAnswers.wrong);
        test.typeFormulaWithKeyboard(DefinedAnswers.wrong);
        test.checkAnsValidateAsNoPoint(); // test.checkAnsValidateAsWrong();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[1], 1, 4);
        test.browserBack();
        test.checkSavedFormulaAnswer(DefinedAnswers.wrong);
        test.checkAnsValidateAsNoPoint(); // test.checkAnsValidateAsWrong();
      });

      it(" > Attempt Q4 - Math With Text", () => {
        test.clickOnNext();
        cy.contains("Q4").should("be.visible");

        // highlight test & wrong ans
        test.typeFormula(DefinedAnswers.wrong);
        test.typeFormulaWithKeyboard(DefinedAnswers.wrong);
        test.checkAnsValidateAsNoPoint(); // test.checkAnsValidateAsWrong();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[0], 0, 4);
        test.browserBack();
        test.checkSavedFormulaAnswer(DefinedAnswers.wrong);
        test.checkAnsValidateAsNoPoint(); // test.checkAnsValidateAsWrong();
      });

      it(" > Check report", () => {
        test.clickOnNext();

        // review page
        const reportsPage = test.submitTest();
        // validate stats

        // validate stats
        cy.contains("div", assignmentName).should("be.visible");
        assignmentPage.getStatus().should("have.text", asgnstatus.sub);
        assignmentPage.getReviewButton().should("have.text", buttonText.review);

        reportsPage.validateStats(2, "2/2", "0/4", "0%"); // reportsPage.validateStats(2, "2/2", "1/4", "25%");
        reportsPage.validateAttemptLinkStats(2, 1, "0/4", "0%"); // reportsPage.validateAttemptLinkStats(2, 1, "4/4", "100%");

        sideBarPage.clickOnAssignment();
        cy.contains(assignmentName).should("not.be.visible");
      });
    });
  });
});
