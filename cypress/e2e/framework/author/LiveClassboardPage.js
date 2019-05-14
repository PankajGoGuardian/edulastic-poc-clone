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

  getAvgScore = () => cy.get(".ant-progress-text");

  verifySubmittedCount = (submitted, total) =>
    cy.get('[data-cy="submittedSummary"]').should("have.text", `${submitted} out of ${total} Submitted`);

  getCardIndex = studentName =>
    cy
      .get('[data-cy="studentName"]')
      .contains(studentName)
      .then(ele => Cypress.$('[data-cy="studentName"]').index(ele));

  getAllStudentStatus = () => cy.get('[data-cy="studentStatus"]');

  getStudentStatusByIndex = index => this.getAllStudentStatus().eq(index);

  getStudentScoreByIndex = index => cy.get('[data-cy="studentScore"]').eq(index);

  getStudentPerformanceByIndex = index => cy.get('[data-cy="studentPerformance"]').eq(index);

  verifyStudentCard(studentName, status, score, performance, queAttempt) {
    const queCards = Object.keys(queAttempt).map(queNum => queAttempt[queNum]);
    this.getCardIndex(studentName).then(index => {
      // TODO : remove log once flow is commplted
      console.log(
        "stduent stats :: ",
        `${studentName}, ${status}, ${score}, ${performance}, ${JSON.stringify(queAttempt)} , ${queCards}`
      );
      this.getStudentStatusByIndex(index).should("have.text", status);
      this.getStudentScoreByIndex(index).should("have.text", score);
      this.getStudentPerformanceByIndex(index).should("have.text", performance);
      this.verifyQuestionCards(index, queCards);
    });
  }

  verifyQuestion = queCount =>
    cy.get('[data-cy="questions"]').each((ele, index, $all) => {
      cy.wrap(ele)
        .find("div")
        .should("have.length", queCount);
    });

  verifyQuestionCards = (index, queCards) => {
    const attemptType = {
      RIGHT: "right",
      WRONG: "wrong",
      SKIP: "skip"
    };

    const queColor = {
      RIGHT: "rgb(94, 181, 0)",
      WRONG: "rgb(243, 95, 95)",
      SKIP: "rgb(229, 229, 229)"
    };

    cy.get('[data-cy="questions"]')
      .eq(index)
      .then(ele => {
        queCards.forEach((que, qindex) => {
          switch (que) {
            case attemptType.RIGHT:
              expect(
                ele
                  .find("div")
                  .eq(qindex)
                  .css("background-color")
              ).to.eq(queColor.RIGHT);
              break;

            case attemptType.WRONG:
              expect(
                ele
                  .find("div")
                  .eq(qindex)
                  .css("background-color")
              ).to.eq(queColor.WRONG);
              break;

            case attemptType.SKIP:
              expect(
                ele
                  .find("div")
                  .eq(qindex)
                  .css("background-color")
              ).to.eq(queColor.SKIP);
              break;

            default:
              break;
          }
        });
      });
  };

  getScoreAndPerformance = (attempt, queTypeMap) => {
    let totalScore = 0;
    let maxScore = 0;
    let score;
    let perf;
    let stats;

    Object.keys(attempt).forEach(queNum => {
      const attempType = attempt[queNum];
      const { points } = queTypeMap[queNum];

      if (attempType === "right") totalScore += points;
      maxScore += points;
    });

    score = `${totalScore} / ${maxScore}`;
    perf = `${Math.round((parseFloat(totalScore) / parseFloat(maxScore)) * 100, 2)}%`;
    stats = { score, perf };
    return stats;
  };
}
export default LiveClassboardPage;
