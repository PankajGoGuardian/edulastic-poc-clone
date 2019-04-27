import AssignmentsPage from "../../../framework/student/assignmentsPage";
import SidebarPage from "../../../framework/student/sidebarPage";
import FileHelper from "../../../framework/util/fileHelper";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Test Assignment Page`, () => {
  const sideBarPage = new SidebarPage();
  const assignmentPage = new AssignmentsPage();
  const assignmentName = "Fill in the Blank Auto Test";
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
  let DefinedIndex;

  before(() => {
    cy.login("student");
  });
  context(" > Assignment attempt and stats", () => {
    before(() => {
      cy.fixture("studentsAttempt").then(data => {
        TestTypes = data.testTypes;
        DefinedAnswers = data.definedAnswers;
        DefinedIndex = data.definedIndex;

        cy.deleteAllAssignments();
        cy.assignAssignment(TestTypes.fillInBlanks);
        cy.reload();
        cy.wait("@assignment");
      });
    });

    context(" > 1st attempt - test assessment player,attempt all questions and submit the test,validate", () => {
      it(" > Check Assignment Status", () => {
        assignmentPage.validateAssignment(assignmentName, asgnstatus.notstarted, buttonText.start);
        test = assignmentPage.clickOnAssignmentButton();
      });

      it(" > Check every question", () => {
        // attempt 1st que
        // wrong ans
        test.dragAndDropByIndex(DefinedAnswers.wrong, DefinedIndex.right);
        test.dragAndDropByIndex(DefinedAnswers.right, DefinedIndex.wrong);
        test.checkAnsValidateAsWrong();
        // right ans
        test.dragAndDropInsideQuestion(DefinedAnswers.right, DefinedIndex.right);
        test.checkAnsValidateAsRight();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[1], 1, 5);
        test.browserBack();
        // check preserved Status
        test.getQuestionBoxByIndex(DefinedIndex.right).contains("div", DefinedAnswers.right);
        test.getQuestionBoxByIndex(DefinedIndex.wrong).contains("div", DefinedAnswers.wrong);
        test.checkAnsValidateAsRight();

        // refresh & check preserved answer
        test.firstPageRefreshWithNavButton("Q1");
        // check preserved Status
        test.getQuestionBoxByIndex(DefinedIndex.right).contains("div", DefinedAnswers.right);
        test.getQuestionBoxByIndex(DefinedIndex.wrong).contains("div", DefinedAnswers.wrong);
        test.checkAnsValidateAsRight();

        // next que
        // attempt 2nd que
        // wrong ans
        test.clickOnNext();
        cy.contains("Q2").should("be.visible");

        test.clickDropDownByIndex(DefinedAnswers.wrong, DefinedIndex.right);
        test.clickDropDownByIndex(DefinedAnswers.right, DefinedIndex.wrong);
        test.checkAnsValidateAsWrong();

        // right ans
        test.clickDropDownByIndex(DefinedAnswers.right, DefinedIndex.right);
        test.clickDropDownByIndex(DefinedAnswers.wrong, DefinedIndex.wrong);
        test.checkAnsValidateAsRight();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[0], 0, 5);
        test.browserBack();
        test.checkAnsValidateAsRight();

        // refresh & check preserved answer
        test.pageRefreshWithNavButton("Q2");
        // check preserved Status
        test.getRenderedDropDownLabels().each(($el, index) => {
          if (index === 1) {
            cy.wrap($el).contains("div", DefinedAnswers.right);
          } else if (index === 2) {
            cy.wrap($el).contains("div", DefinedAnswers.wrong);
          }
        });

        test.checkAnsValidateAsRight();

        // next que
        // attempt 3rd que
        // wrong ans
        test.clickOnNext();
        cy.contains("Q3").should("be.visible");

        test.imageDragAndDropByIndex(DefinedAnswers.right, DefinedIndex.other);
        test.imageDragAndDropByIndex(DefinedAnswers.wrong, DefinedIndex.wrong);
        test.imageDragAndDropByIndex(DefinedAnswers.other, DefinedIndex.right);
        test.checkAnsValidateAsWrong();
        // right ans
        test.imageDragAndDropInsideQuestion(DefinedAnswers.right, DefinedIndex.right);
        test.imageDragAndDropByIndex(DefinedAnswers.other, DefinedIndex.other);
        test.checkAnsValidateAsRight();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[3], 3, 5);
        test.browserBack();
        // check preserved status
        test.getLabelImageQuestionByIndex(DefinedIndex.right).contains("div", DefinedAnswers.right);
        test.getLabelImageQuestionByIndex(DefinedIndex.wrong).contains("div", DefinedAnswers.wrong);
        test.getLabelImageQuestionByIndex(DefinedIndex.other).contains("div", DefinedAnswers.other);

        test.checkAnsValidateAsRight();

        // refresh & check preserved answer
        test.pageRefreshWithNavButton("Q3");
        // check preserved status
        test.getLabelImageQuestionByIndex(DefinedIndex.right).contains("div", DefinedAnswers.right);
        test.getLabelImageQuestionByIndex(DefinedIndex.wrong).contains("div", DefinedAnswers.wrong);
        test.getLabelImageQuestionByIndex(DefinedIndex.other).contains("div", DefinedAnswers.other);
        test.checkAnsValidateAsRight();

        // next que
        // wrong
        // attempt 4th que
        test.clickOnNext();
        cy.contains("Q4").should("be.visible");
        test.clickImageDropDownByIndex(DefinedAnswers.wrong, DefinedIndex.right);

        test.checkAnsValidateAsWrong();

        // exit assignment
        test.clickOnExitTest();
        test.clickOnCancel();
        test.clickOnExitTest();
        test.clickOnProceed();
        cy.url().should("include", "/home/assignments");
        assignmentPage.validateAssignment(assignmentName, asgnstatus.inprogress, buttonText.resume);
        // resume assignment
        assignmentPage.clickOnAssignmentButton();
        cy.contains("Q3").should("be.visible");

        // next que
        // attempt 4th que
        // right
        test.clickOnNext();
        cy.contains("Q4").should("be.visible");
        test.clickImageDropDownByIndex(DefinedAnswers.right, DefinedIndex.right);
        test.clickImageDropDownByIndex(DefinedAnswers.wrong, DefinedIndex.wrong);
        test.clickImageDropDownByIndex(DefinedAnswers.other, DefinedIndex.other);

        test.checkAnsValidateAsRight();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[2], 2, 5);
        test.browserBack();
        // check preserved Status
        test.getRenderedDropDownLabels().each(($el, index) => {
          if (index === 1) {
            cy.wrap($el).contains("div", DefinedAnswers.right);
          } else if (index === 2) {
            cy.wrap($el).contains("div", DefinedAnswers.wrong);
          } else if (index === 3) {
            cy.wrap($el).contains("div", DefinedAnswers.other);
          }
        });
        test.checkAnsValidateAsRight();

        // attempt 5th que
        // wrong
        // test.clickOnNext();
        // cy.contains("Q5").should("be.visible");
        // test.typeTextToAnswerBoard(DefinedAnswers.wrong, DefinedIndex.right);
        // test.typeTextToAnswerBoard(DefinedAnswers.right, DefinedIndex.wrong);

        // test.checkAnsValidateAsWrong();

        // // right
        // test.typeTextToAnswerBoard(DefinedAnswers.right, DefinedIndex.right);
        // test.typeTextToAnswerBoard(DefinedAnswers.wrong, DefinedIndex.wrong);

        // test.checkAnsValidateAsRight();

        // // checking preserve with dropdown and browswer navigation
        // test.clickQuestionDropdown(ques[3], 3, 5);
        // test.browserBack();
        // // check preserved Status
        // test.getInputsLabelText().each(($el, index) => {
        //   if (index === 0) {
        //     cy.wrap($el).should("have.value", DefinedAnswers.right);
        //   } else if (index === 1) {
        //     cy.wrap($el).should("have.value", DefinedAnswers.wrong);
        //   }
        // });
        // test.checkAnsValidateAsRight();

        // // refresh & check preserved answer
        // test.pageRefreshWithNavButton("Q5");
        // // check preserved Status
        // test.getInputsLabelText().each(($el, index) => {
        //   if (index === 0) {
        //     cy.wrap($el).should("have.value", DefinedAnswers.right);
        //   } else if (index === 1) {
        //     cy.wrap($el).should("have.value", DefinedAnswers.wrong);
        //   }
        // });
        // test.checkAnsValidateAsRight();

        // Q6 - Todo - Cloze Image With Text, site crashing entering cloze text detail page

        test.clickOnNext();
        // review page
        test.submitTest();
        sideBarPage.clickOnAssignment();

        // validate stats
        assignmentPage.validateAssignment(assignmentName, asgnstatus.inprogress, buttonText.retake);
        assignmentPage.validateStats(1, "1/2", "4/4", "100%");
      });
    });

    context(" > 2nd attempt - attempt questions,submit the test,validate stats", () => {
      it(" > Check every question", () => {
        test = assignmentPage.clickOnAssignmentButton();
        cy.contains("Q1").should("be.visible");

        // attempt 1st que
        // wrong ans
        test.dragAndDropByIndex(DefinedAnswers.wrong, DefinedIndex.right);
        test.dragAndDropByIndex(DefinedAnswers.right, DefinedIndex.wrong);
        test.checkAnsValidateAsWrong();

        // refresh & check preserved answer
        test.firstPageRefreshWithNavButton("Q1");
        test.checkAnsValidateAsWrong();

        // next que
        // attempt 2nd que
        // right ans
        test.clickQuestionDropdown(ques[1], 1, 5);
        cy.contains("Q2").should("be.visible");

        // right ans
        test.clickDropDownByIndex(DefinedAnswers.right, DefinedIndex.right);
        test.clickDropDownByIndex(DefinedAnswers.wrong, DefinedIndex.wrong);
        test.checkAnsValidateAsRight();

        // refresh & check preserved answer
        test.pageRefreshWithNavButton("Q2");
        test.checkAnsValidateAsRight();

        test.clickQuestionDropdown(ques[2], 2, 5);
        cy.contains("Q3").should("be.visible");

        // attempt 3rd que
        // right ans
        test.imageDragAndDropByIndex(DefinedAnswers.right, DefinedIndex.right);
        test.imageDragAndDropByIndex(DefinedAnswers.wrong, DefinedIndex.wrong);
        test.imageDragAndDropByIndex(DefinedAnswers.other, DefinedIndex.other);
        test.checkAnsValidateAsRight();

        // refresh & check preserved answer
        test.pageRefreshWithNavButton("Q3");
        test.checkAnsValidateAsRight();

        // next que
        // attempt 4th que
        // right
        test.clickQuestionDropdown(ques[3], 3, 5);
        cy.contains("Q4").should("be.visible");
        test.clickImageDropDownByIndex(DefinedAnswers.right, DefinedIndex.right);
        test.clickImageDropDownByIndex(DefinedAnswers.wrong, DefinedIndex.wrong);
        test.clickImageDropDownByIndex(DefinedAnswers.other, DefinedIndex.other);

        test.checkAnsValidateAsRight();

        // refresh & check preserved answer
        test.pageRefreshWithNavButton("Q4");
        test.checkAnsValidateAsRight();

        // attempt 5th que
        // wrong
        // test.clickQuestionDropdown(ques[4], 4, 5);
        // cy.contains("Q5").should("be.visible");
        // test.typeTextToAnswerBoard(DefinedAnswers.wrong, DefinedIndex.right);
        // test.typeTextToAnswerBoard(DefinedAnswers.right, DefinedIndex.wrong);

        // test.checkAnsValidateAsWrong();

        // // refresh & check preserved answer
        // test.pageRefreshWithNavButton("Q5");
        // test.checkAnsValidateAsWrong();

        // Q6 - Todo - Cloze Image With Text, site crashing entering cloze text detail page

        test.clickOnNext();

        // review page
        const reportsPage = test.submitTest();
        // validate stats
        reportsPage.validateAssignment(assignmentName, asgnstatus.sub, buttonText.review);
        reportsPage.validateStats(2, "2/2", "3/4", "75%");
        reportsPage.validateAttemptLinkStats(2, 1, "4/4", "100%");

        sideBarPage.clickOnAssignment();
        cy.contains(assignmentName).should("not.be.visible");
      });
    });
  });
});
