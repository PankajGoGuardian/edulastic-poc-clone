import LCBHeader from "./lcbHeader";
import { studentSide as asgnStatus, studentSide } from "../../constants/assignmentStatus";
import QuestionResponsePage from "./QuestionResponsePage";
import { attemptTypes } from "../../constants/questionTypes";

class LiveClassboardPage {
  constructor() {
    this.header = new LCBHeader();
    this.questionResponsePage = new QuestionResponsePage();
  }

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
      .click({ force: true });
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

  getStudentCardByStudentName = studentName => {
    const selector = `[data-cy="student-card-${studentName}"]`;
    return cy.get(selector);
  };

  getAllStudentStatus = () => cy.get('[data-cy="studentStatus"]');

  getStudentStatusByIndex = index => this.getAllStudentStatus().eq(index);

  getStudentScoreByIndex = index => cy.get('[data-cy="studentScore"]').eq(index);

  getViewResponseByIndex = index => cy.get('[data-cy="viewResponse"]').eq(index);

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
      if (status !== studentSide.NOT_STARTED) {
        cy.server();
        cy.route("GET", "**/test-activity/**").as("test-activity");
        this.getViewResponseByIndex(index)
          .should("be.exist")
          .click()
          .then(() => {
            cy.wait("@test-activity");
            cy.get(".ant-select-selection-selected-value").should("have.text", studentName);
          });
        this.clickOnCardViewTab();
      } else this.getViewResponseByIndex(index).should("not.be.exist");
    });
  }

  verifyRedirectIcon = student => {
    this.getStudentCardByStudentName(student)
      .find('[data-cy="redirected"]')
      .should("be.exist");
  };

  selectCheckBoxByStudentName = student => {
    this.getStudentCardByStudentName(student)
      .find('input[type="checkbox"]')
      .click({ force: true });
  };

  clickOnRedirect = () => cy.get('[data-cy="rediectButton"]').click();

  getRedirecPopUp = () => cy.get(".ant-modal-content");

  clickOnRedirectSubmit = () => {
    cy.server();
    cy.route("POST", "**/redirect").as("redirect");
    this.getRedirecPopUp()
      .contains("span", "submit")
      .click({ force: true });
    cy.wait("@redirect");
  };

  verifyStudentsOnRedirectPopUp = student =>
    this.getRedirecPopUp()
      .find(".ant-select-selection__choice")
      .contains(student)
      .should("be.exist");

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

  getScoreAndPerformance = (attempt, queTypeMap, queNum, queCentric = false) => {
    let totalScore = 0;
    let maxScore = 0;
    let score;
    let perf;
    let perfValue;
    let stats;

    Object.keys(attempt).forEach(item => {
      const attempType = attempt[item];
      const { points, attemptData, queKey } = queCentric ? queTypeMap[queNum] : queTypeMap[item];
      // if (attempType === attemptTypes.RIGHT) totalScore += points;
      totalScore += this.questionResponsePage.getScoreByAttempt(attemptData, points, queKey.split(".")[0], attempType);
      maxScore += points;
    });

    score = `${totalScore} / ${maxScore}`;
    perfValue = Cypress._.round((parseFloat(totalScore) / parseFloat(maxScore)) * 100, 1);
    perf = `${perfValue}%`;
    stats = { score, perf, perfValue };
    return stats;
  };

  getFeedBackScore = (feedbackMap, queTypeMap) => {
    const score = {};
    Object.keys(feedbackMap).forEach(queNum => {
      const attempType = feedbackMap[queNum];
      const { points, attemptData, queKey } = queTypeMap[queNum];
      // score[queNum] = attempType === attemptTypes.RIGHT ? points : "0";
      score[queNum] = this.questionResponsePage.getScoreByAttempt(
        attemptData,
        points,
        queKey.split(".")[0],
        attempType
      );
    });

    return score;
  };

  verifyAvgScore(statsMap) {
    let scoreObtain = 0;
    let totalMaxScore = 0;
    Object.keys(statsMap).forEach(studentName => {
      const { score, status } = statsMap[studentName];
      const [scored, max] = score.split("/");
      // if (status === asgnStatus.SUBMITTED || status === asgnStatus.GRADED) {
      if (status !== asgnStatus.NOT_STARTED) {
        // submittedCount += 1;
        scoreObtain += parseFloat(scored);
        totalMaxScore += parseFloat(max);
      }
    });

    const avgPerformance = `${Cypress._.round((scoreObtain / totalMaxScore) * 100, 2)}%`;
    this.getAvgScore().should("have.text", avgPerformance);
  }

  verifyStudentCentricCard(studentName, studentAttempts, questionTypeMap, cardEntry = true) {
    if (cardEntry) {
      this.questionResponsePage.selectStudent(studentName);
      Object.keys(studentAttempts).forEach((queNum, qIndex) => {
        const attemptType = studentAttempts[queNum];
        const { queKey, attemptData, points } = questionTypeMap[queNum];
        this.questionResponsePage.verifyQuestionResponseCard(points, queKey, attemptType, attemptData, true, qIndex);
      });
    } else {
      this.questionResponsePage.verifyOptionDisabled(studentName);
    }
  }

  verifyQuestionCentricCard = (queNum, studentAttempts, questionTypeMap) => {
    this.questionResponsePage.selectQuestion(queNum);
    Object.keys(studentAttempts).forEach(studentName => {
      const attemptType = studentAttempts[studentName];
      if (attemptType !== null) {
        const { queKey, attemptData, points } = questionTypeMap[queNum];
        this.questionResponsePage.verifyQuestionResponseCard(
          points,
          queKey,
          attemptType,
          attemptData,
          false,
          studentName
        );
      } else {
        this.questionResponsePage.verifyNoQuestionResponseCard(studentName);
      }
    });
  };

  updateScore = (studentName, score) => {
    Object.keys(score).forEach(queNum => {
      this.questionResponsePage.selectQuestion(queNum);
      this.questionResponsePage.updateScoreForStudent(studentName, score[queNum]);
    });
  };

  getRedirectedQuestionCentricData = (redirectedData, queCentric, attempted = true) => {
    const reDirectedQueCentric = Object.assign({}, queCentric);
    const reDirectedQueCentricBeforeAttempt = Object.assign({}, queCentric);
    redirectedData.forEach(({ attempt, stuName }) => {
      Object.keys(attempt).forEach(queNum => {
        if (attempted) {
          reDirectedQueCentric[queNum][stuName] = attempt[queNum];
        } else {
          reDirectedQueCentricBeforeAttempt[queNum][stuName] = null;
        }
      });
    });
    return attempted ? reDirectedQueCentric : reDirectedQueCentricBeforeAttempt;
  };

  getQuestionCentricData = (attemptsData, queCentric, onlySubmitted = false) => {
    attemptsData
      .filter(({ status }) => (onlySubmitted ? status === studentSide.SUBMITTED : status !== studentSide.NOT_STARTED))
      .forEach(({ attempt, stuName }) => {
        Object.keys(attempt).forEach(queNum => {
          if (!queCentric[queNum]) queCentric[queNum] = {};
          queCentric[queNum][stuName] = attempt[queNum];
        });
      });
    return queCentric;
  };

  getNullifiedAttempts = attempts => {
    const noAttempts = {};
    for (let key in attempts) {
      if (attempts.hasOwnProperty(key)) {
        noAttempts[key] = attemptTypes.SKIP;
      }
    }
    return noAttempts;
  };
}
export default LiveClassboardPage;
