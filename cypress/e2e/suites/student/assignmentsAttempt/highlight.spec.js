import AssignmentsPage from "../../../framework/student/assignmentsPage";
import SidebarPage from "../../../framework/student/sidebarPage";
import FileHelper from "../../../framework/util/fileHelper";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Test Assignment Page`, () => {
  const sideBarPage = new SidebarPage();
  const assignmentPage = new AssignmentsPage();
  const assignmentName = "Highlight Auto Test";
  const asgnstatus = {
    notstarted: "NOT STARTED",
    inprogress: "IN PROGRESS",
    sub: "NOT GRADED"
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
  const selectedShadeColor = "rgba(0, 176, 255, 0.8)";
  const selectedHotspotColor = "rgb(0, 123, 179)";

  before(() => {
    cy.login("student");
  });
  context("Assignment attempt and stats", () => {
    before(() => {
      cy.fixture("studentsAttempt").then(data => {
        TestTypes = data.testTypes;
        DefinedAnswers = data.definedAnswers;

        cy.deleteAllAssignments();
        cy.assignAssignment(TestTypes.highlight);
        cy.reload();
        cy.wait("@assignment");
      });
    });

    context("1st attempt - test assessment player,attempt all questions and submit the test,validate", () => {
      it("Check Assignment Status", () => {
        assignmentPage.validateAssignment(assignmentName, asgnstatus.notstarted, buttonText.start);
        test = assignmentPage.clickOnAssignmentButton();
      });

      it("Attempt Q1 - Highlight Image", () => {
        cy.contains("Q1").should("be.visible");
        // draw rect
        cy.get("canvas")
          .trigger("mousedown", 100, 100)
          .trigger("mousemove", 100, 300)
          .trigger("mousemove", 300, 300)
          .trigger("mousemove", 300, 100)
          .trigger("mousemove", 100, 100)
          .trigger("mouseup", 100, 100);

        // checking dropdown and browswer navigation
        test.clickQuestionDropdown(ques[1], 1, 4);
        test.browserBack();

        // refresh answer
        test.firstPageRefreshWithNavButton("Q1");
        cy.contains("Q1").should("be.visible");
      });

      it("Attempt Q2 - Shading", () => {
        test.clickOnNext();
        cy.contains("Q2").should("be.visible");

        // highlight test & wrong ans
        test.checkSelectedShadeItemByIndex(1);
        test.checkUnSelectedShadeItemByIndex(1);
        test.checkAnsValidateAsWrong();

        // right answer check
        test.checkSelectedShadeItemByIndex(0);
        test.checkSelectedShadeItemByIndex(5);
        test.checkAnsValidateAsRight();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[0], 0, 4);
        test.browserBack();
        test.getShadeItemByIndex(0).should("have.css", "background-color", selectedShadeColor);
        test.getShadeItemByIndex(5).should("have.css", "background-color", selectedShadeColor);
        test.checkAnsValidateAsRight();

        // refresh & check preserved answer
        test.pageRefreshWithNavButton("Q2");
        test.getShadeItemByIndex(0).should("have.css", "background-color", selectedShadeColor);
        test.getShadeItemByIndex(5).should("have.css", "background-color", selectedShadeColor);
        test.checkAnsValidateAsRight();
      });

      it("Attempt Q3 - Hotspot", () => {
        test.clickOnNext();
        cy.contains("Q3").should("be.visible");

        // highlight test & wrong ans
        test.checkSelectedPolygonByIndex(1);
        test.checkAnsValidateAsWrong();

        // right answer check
        test.checkSelectedPolygonByIndex(0);
        test.checkAnsValidateAsRight();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[1], 1, 4);
        test.browserBack();
        test.getHotspotPolygonByIndex(0).should("have.css", "stroke", selectedHotspotColor);
        test.checkAnsValidateAsRight();

        // refresh & check preserved answer
        test.pageRefreshWithNavButton("Q3");
        test.getHotspotPolygonByIndex(0).should("have.css", "stroke", selectedHotspotColor);
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

      it("Attempt Q4 - Token Highlight", () => {
        test.clickOnNext();
        cy.contains("Q4").should("be.visible");

        // highlight test & wrong ans
        test.checkSelectedToken(DefinedAnswers.wrong);
        test.checkUnselectedToken(DefinedAnswers.wrong);
        test.checkAnsValidateAsWrong();

        // right answer check
        test.checkSelectedToken(DefinedAnswers.right);
        test.checkAnsValidateAsRight();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[0], 0, 4);
        test.browserBack();
        test.getHighlightToken(DefinedAnswers.right).should("have.class", "active-word");
        test.checkAnsValidateAsRight();

        // refresh & check preserved answer
        test.pageRefreshWithNavButton("Q4");
        test.getHighlightToken(DefinedAnswers.right).should("have.class", "active-word");
        test.checkAnsValidateAsRight();
      });

      it("End first Attempt", () => {
        test.clickOnNext();
        // review page
        test.submitTest();
        sideBarPage.clickOnAssignment();

        // validate stats
        assignmentPage.validateAssignment(assignmentName, asgnstatus.inprogress, buttonText.retake);
        assignmentPage.validateStats(1, "1/2", "3/4", "100%");
      });
    });

    context("2nd attempt - attempt questions,submit the test,validate stats", () => {
      it("Attempt Q1 - Highlight Image", () => {
        test = assignmentPage.clickOnAssignmentButton();
        cy.contains("Q1").should("be.visible");
        // draw rect
        cy.get("canvas")
          .trigger("mousedown", 100, 100)
          .trigger("mousemove", 100, 300)
          .trigger("mousemove", 300, 300)
          .trigger("mousemove", 300, 100)
          .trigger("mousemove", 100, 100)
          .trigger("mouseup", 100, 100);

        // checking dropdown and browswer navigation
        test.clickQuestionDropdown(ques[1], 1, 4);
        test.browserBack();

        // refresh answer
        test.firstPageRefreshWithNavButton("Q1");
        cy.contains("Q1").should("be.visible");
      });

      it("Attempt Q2 - Shading", () => {
        test.clickOnNext();
        cy.contains("Q2").should("be.visible");

        // highlight & right answer check
        test.checkSelectedShadeItemByIndex(0);
        test.checkSelectedShadeItemByIndex(5);
        test.checkAnsValidateAsRight();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[0], 0, 4);
        test.browserBack();
        test.getShadeItemByIndex(0).should("have.css", "background-color", selectedShadeColor);
        test.getShadeItemByIndex(5).should("have.css", "background-color", selectedShadeColor);
        test.checkAnsValidateAsRight();
      });

      it("Attempt Q3 - Hotspot", () => {
        test.clickOnNext();
        cy.contains("Q3").should("be.visible");

        // highlight test & wrong ans
        test.checkSelectedPolygonByIndex(1);
        test.checkAnsValidateAsWrong();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[1], 1, 4);
        test.browserBack();
        test.getHotspotPolygonByIndex(1).should("have.css", "stroke", selectedHotspotColor);
        test.checkAnsValidateAsWrong();
      });

      it("Attempt Q4 - Token Highlight", () => {
        test.clickOnNext();
        cy.contains("Q4").should("be.visible");

        // highlight test & wrong ans
        test.checkSelectedToken(DefinedAnswers.wrong);
        test.checkUnselectedToken(DefinedAnswers.wrong);
        test.checkAnsValidateAsWrong();

        // checking preserve with dropdown and browswer navigation
        test.clickQuestionDropdown(ques[0], 0, 4);
        test.browserBack();
        test.getHighlightToken(DefinedAnswers.wrong).should("not.have.class", "active-word");
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

        reportsPage.validateStats(2, "2/2", "1/4", "33.33%");
        reportsPage.validateAttemptLinkStats(2, 1, "3/4", "100%");

        sideBarPage.clickOnAssignment();
        cy.contains(assignmentName).should("not.be.visible");
      });
    });
  });
});
