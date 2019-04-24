class LiveClassboardPage {
  checkClassName(className) {
    return cy.get("[data-cy=CurrentClassName]").contains(className);
  }

  checkSummaryTabIsPresent() {
    return cy
      .get("[data-cy=Summary]")
      .contains("Summary")
      .should("be.visible");
  }

  checkLiveClassBoardTabIsPresent() {
    return cy
      .get("[data-cy=LiveClassBoard]")
      .contains("LIVE CLASS BOARD")
      .should("be.visible");
  }

  checkExpressGraderTabIsPresent() {
    return cy
      .get("[data-cy=Expressgrader]")
      .contains("EXPRESS GRADER")
      .should("be.visible");
  }

  checkStandardBasedReportTabIsPresent() {
    return cy
      .get("[data-cy=StandardsBasedReport]")
      .contains("STANDARDS BASED REPORT")
      .should("be.visible");
  }

  checkMoreTabIsPresent() {
    return cy.get("[data-cy=moreButton]").click();
  }

  checkMarkAsDoneIsPresentUnderMoreTab() {
    return cy
      .get("[data-cy=moreButton]")
      .next()
      .find("li")
      .eq(0)
      .contains("Mark as Done")
      .should("be.visible");
  }

  checkReleaseScoreIsPresentUnderMoreTab() {
    return cy
      .get("[data-cy=moreButton]")
      .next()
      .find("li")
      .eq(1)
      .contains("Release Score")
      .should("be.visible");
  }

  clickOnCardViewTab() {
    return cy
      .get("[data-cy=studentnQuestionTab]")
      .contains("a", "CARD VIEW")
      .click();
  }

  clickOnStudentsTab() {
    return cy
      .get("[data-cy=studentnQuestionTab]")
      .contains("a", "STUDENTS")
      .click();
  }

  clickonQuestionsTab() {
    return cy
      .get("[data-cy=studentnQuestionTab]")
      .contains("a", "QUESTIONS")
      .click();
  }

  checkSelectAllCheckboxOfStudent() {
    return cy.get("[data-cy=SelectAllCheckbox]").check({ force: true });
  }

  uncheckSelectAllCheckboxOfStudent() {
    return cy.get("[data-cy=SelectAllCheckbox]").uncheck({ force: true });
  }

  checkStudentResponseIsDisplayed() {
    return cy
      .get(".ant-card-body")
      .eq(1)
      .should("contain", "Student Response")
      .should("be.visible");
  }
}
export default LiveClassboardPage;
