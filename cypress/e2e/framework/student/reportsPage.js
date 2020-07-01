import { questionTypeKey as queTypes, attemptTypes, queColor } from "../constants/questionTypes";
import { releaseGradeTypes } from "../constants/assignmentStatus";
import QuestionResponsePage from "../author/assignments/QuestionResponsePage";
import SidebarPage from "./sidebarPage";

class ReportsPage {
  constructor() {
    this.qrp = new QuestionResponsePage();
    this.sidebar = new SidebarPage();
  }

  // *** ELEMENTS START ***

  getReviewButton = () => cy.get('[data-cy="reviewButton"]');

  getStatus = () => cy.get('[data-cy="status"]');

  getAttemptCount = () => cy.get('[data-cy="attemptsCount"]');

  getScore = () => cy.get('[data-cy="score"]');

  getPercent = () => cy.get('[data-cy="percent"]');

  getAttempts = () => cy.get('[data-cy="attemptClick"]');

  getPercentage = () => cy.get('[data-cy="percentage"]');

  getDate = () => cy.get('[data-cy="date"]');

  getAchievedScore = () => cy.get('[data-cy="score"]');

  getMaxScore = () => cy.get('[data-cy="maxscore"]');

  getTestCardByTesyId = id => cy.get(`[data-cy="test-${id}"]`);

  getScoreOnCardById = id => this.getTestCardByTesyId(id).find('[data-cy="score"]');

  getPercentByTestId = id => this.getTestCardByTesyId(id).find('[data-cy="percent"]');

  getAttemptsByTestId = id => this.getTestCardByTesyId(id).find('[data-cy="attemptClick"]');

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnReviewButtonButton() {
    cy.server();
    cy.route("GET", "**/test-activity/**").as("testactivity");
    this.getReviewButton()
      .should("be.visible")
      .click({ force: true });
    cy.wait("@testactivity");
  }

  selectQuestion = queNum => {
    cy.get('[data-cy="questionNumber"]').click({ force: true });
    cy.get(".ant-select-dropdown-menu")
      .contains(`Question ${queNum.slice(1)}`)
      .click({ force: true });
  };

  clickOnQuestionNo = () => cy.get('[data-cy="questionNumber"]').click({ force: true });

  clickOnReviewButtonButtonByTestId = id => {
    this.getTestCardByTesyId(id)
      .find('[data-cy="reviewButton"]')
      .click({ force: true });
    cy.get('[data-cy="questionNumber"]');
  };

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifyPercentageOnTestCardByTestId = (id, percent) =>
    this.getTestCardByTesyId(id)
      .find('[data-cy="percent"]')
      .should("have.text", `${Math.round(percent)}%`);

  validateAssignment(name, status, reviewButton) {
    cy.contains("div", name).should("be.visible");
    this.verifyStatusIs(status);
    if (reviewButton) this.getReviewButton().should("have.text", reviewButton);
    else this.getReviewButton().should("not.be.visible");
  }

  verifyStatusIs = status => this.getStatus().should("have.text", status);

  validateStats(attemptNum, attempt, score, percent, totalAttempt) {
    if (attempt.split("/")[1] !== "1") this.getAttemptCount().should("have.text", attempt);
    if (score) {
      console.log("score here", score);
      this.getScore().should(
        "have.text",
        score
          .split("/")
          .map(i => i.trim())
          .join("/")
      );
    } else this.getScore().should("not.be.visible");
    if (percent) this.getPercent().should("have.text", `${Math.round(percent)}%`);
    else this.getPercent().should("not.be.visible");
    if (attempt.split("/")[1] !== "1")
      this.validateAttemptLinkStats(totalAttempt || attemptNum, attemptNum, score, percent);
  }

  validateAttemptLinkStats(totalAttempt, attemptNum, score, percent) {
    this.getAttempts()
      .should("be.visible")
      .click();
    if (percent) this.getPercentage().should("have.length", totalAttempt);
    if (score)
      this.getPercentage()
        .eq(totalAttempt - attemptNum)
        .parent()
        .parent()
        .find('[data-cy="score"]')
        .should(
          "have.text",
          score
            .split("/")
            .map(i => i.trim())
            .join("/")
        );
    if (percent)
      this.getPercentage()
        .eq(totalAttempt - attemptNum)
        .should("have.text", `${Math.round(percent)}%`);
    this.getAttempts()
      .should("be.visible")
      .click();
    this.getPercentage().should("have.length", 0);
    this.getDate();
  }

  verifyAllQuetionCard = (studentName, studentAttempts, questionTypeMap, releasePolicy) => {
    const correctAns = releasePolicy === releaseGradeTypes.WITH_ANSWERS;
    Object.keys(studentAttempts).forEach(queNum => {
      const attemptType = studentAttempts[queNum];
      this.selectQuestion(queNum);
      const { queKey, attemptData, points } = questionTypeMap[queNum];
      this.verifyQuestionResponseCard(points, queKey, attemptType, attemptData, correctAns);
    });
  };

  verifyScore = (points, attemptData, attemptType, questionType) => {
    const score = this.qrp.getScoreByAttempt(attemptData, points, questionType, attemptType);
    this.getAchievedScore().should("have.text", score.toString());
    this.getMaxScore().should("have.text", points.toString());
  };

  verifyMaxScoreOfQueByIndex = (index, maxscore) => {
    this.clickOnQuestionNo();
    cy.get(".ant-select-dropdown-menu-item")
      .eq(index)
      .click({ force: true });
    this.getMaxScore().should("contain", maxscore);
  };

  verifyAchievedScoreOfQueByIndex = (index, achievedScore) => {
    this.clickOnQuestionNo();
    cy.get(".ant-select-dropdown-menu-item")
      .eq(index)
      .click({ force: true });
    this.getAchievedScore().should("contain", achievedScore);
  };

  verifyNoOfQuesInReview = len => {
    this.clickOnQuestionNo();
    cy.get(".ant-select-dropdown-menu-item").should("have.length", len);
  };

  verifyFeedBackComment = feedback => {
    cy.get('[data-cy="feedback"]').should("contain", feedback);
  };

  verifyQuestionResponseCard = (points, queTypeKey, attemptType, attemptData, correcAns) => {
    cy.get('[data-cy="question-container"]').as("quecard");
    const { right, wrong, partialCorrect } = attemptData;
    const attempt =
      attemptType === attemptTypes.RIGHT
        ? right
        : attemptType === attemptTypes.WRONG
        ? wrong
        : attemptType === attemptTypes.PARTIAL_CORRECT
        ? partialCorrect
        : undefined;

    const questionType = queTypeKey.split(".")[0];
    if (points) this.verifyScore(points, attemptData, attemptType, questionType);
    switch (questionType) {
      case queTypes.MULTIPLE_CHOICE_STANDARD:
      case queTypes.MULTIPLE_CHOICE_MULTIPLE:
      case queTypes.TRUE_FALSE:
        switch (attemptType) {
          case attemptTypes.RIGHT:
            if (Cypress._.isArray(right))
              right.forEach(choice => this.qrp.verifyLabelChecked(cy.get("@quecard"), choice));
            else {
              this.qrp.verifyLabelChecked(cy.get("@quecard"), right);
            }
            break;

          case attemptTypes.WRONG:
            if (Cypress._.isArray(wrong)) {
              wrong.forEach(choice => {
                this.qrp.verifyLabelChecked(cy.get("@quecard"), choice);
                if (correcAns) this.qrp.verifyLabelClass(cy.get("@quecard"), choice, attemptTypes.WRONG);
              });
            } else {
              this.qrp.verifyLabelChecked(cy.get("@quecard"), wrong);
              if (correcAns) this.qrp.verifyLabelClass(cy.get("@quecard"), wrong, attemptTypes.WRONG);
            }
            break;

          case attemptTypes.SKIP:
            break;

          case attemptTypes.PARTIAL_CORRECT:
            if (Cypress._.isArray(partialCorrect))
              partialCorrect.forEach(choice => this.qrp.verifyLabelChecked(cy.get("@quecard"), choice));
            else {
              this.qrp.verifyLabelChecked(cy.get("@quecard"), partialCorrect);
            }
            break;

          default:
            break;
        }

        if (correcAns) {
          if (Cypress._.isArray(right)) {
            right.forEach(choice => this.qrp.verifyLabelClass(cy.get("@quecard"), choice, attemptTypes.RIGHT));
          } else {
            this.qrp.verifyLabelClass(cy.get("@quecard"), right, attemptTypes.RIGHT);
          }
        }
        break;

      case queTypes.MULTIPLE_CHOICE_BLOCK:
        switch (attemptType) {
          case attemptTypes.RIGHT:
            if (Cypress._.isArray(right)) {
              right.forEach(choice =>
                this.qrp.verifyLabelBackgroundColor(cy.get("@quecard"), choice, queColor.LIGHT_GREEN)
              );
            } else {
              this.qrp.verifyLabelBackgroundColor(cy.get("@quecard"), right, queColor.LIGHT_GREEN);
            }
            break;

          case attemptTypes.WRONG:
            if (Cypress._.isArray(wrong)) {
              wrong.forEach(choice => {
                this.qrp.verifyLabelBackgroundColor(cy.get("@quecard"), choice, queColor.LIGHT_RED);
                if (correcAns) this.qrp.verifyLabelClass(cy.get("@quecard"), choice, attemptTypes.WRONG);
              });
            } else {
              this.qrp.verifyLabelBackgroundColor(cy.get("@quecard"), wrong, queColor.LIGHT_RED);
              if (correcAns) this.qrp.verifyLabelClass(cy.get("@quecard"), wrong, attemptTypes.WRONG);
            }

            break;

          case attemptTypes.SKIP:
            break;

          default:
            break;
        }
        if (correcAns) {
          if (Cypress._.isArray(right)) {
            right.forEach(choice => {
              this.qrp.verifyLabelClass(cy.get("@quecard"), choice, attemptTypes.RIGHT);
            });
          } else this.qrp.verifyLabelClass(cy.get("@quecard"), right, attemptTypes.RIGHT);
        }
        break;

      case queTypes.CHOICE_MATRIX_STANDARD:
      case queTypes.CHOICE_MATRIX_INLINE:
      case queTypes.CHOICE_MATRIX_LABEL: {
        const { steams } = attemptData;
        if (correcAns) this.qrp.verifyCorrectAnseredMatrix(cy.get("@quecard"), right, steams);
        switch (attemptType) {
          case attemptTypes.RIGHT:
            this.qrp.verifyAnseredMatrix(cy.get("@quecard"), right, steams, attemptType);
            break;

          case attemptTypes.WRONG:
            this.qrp.verifyAnseredMatrix(cy.get("@quecard"), wrong, steams, attemptType);
            break;

          case attemptTypes.PARTIAL_CORRECT:
            this.qrp.verifyAnseredMatrix(cy.get("@quecard"), partialCorrect, steams, attemptType);
            break;

          default:
            break;
        }
        break;
      }

      case queTypes.CLOZE_DROP_DOWN:
        if (correcAns) this.qrp.verifyCorrectAnswerClozeDropDown(cy.get("@quecard"), right);
        this.qrp.verifyAnswerClozeDropDown(cy.get("@quecard"), attempt, attemptType, right);
        break;

      case queTypes.CLOZE_TEXT:
        if (correcAns) this.qrp.verifyCorrectAnswerClozeText(cy.get("@quecard"), right);
        this.qrp.verifyAnswerClozeText(cy.get("@quecard"), attempt, attemptType, right);
        break;

      case queTypes.MATH_NUMERIC:
        if (correcAns) this.qrp.verifyCorrectAnsMathNumeric(cy.get("@quecard"), right);
        this.qrp.verifyResponseByAttemptMathNumeric(cy.get("@quecard"), attempt, attemptType);
        break;

      case queTypes.ESSAY_RICH:
        if (correcAns) this.qrp.verifyNoCorrectAnsEssayType(cy.get("@quecard"));
        this.qrp.verifyResponseEssayRich(cy.get("@quecard"), attempt);
        break;

      default:
        break;
    }
  };

  // *** APPHELPERS END ***
}
export default ReportsPage;
