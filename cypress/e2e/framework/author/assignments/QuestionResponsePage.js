import { questionTypeKey as queTypes, attemptTypes, queColor } from "../../constants/questionTypes";

export default class QuestionResponsePage {
  getDropDown = () => cy.get(".ant-select-selection");

  getDropDownMenu = () => cy.get(".ant-select-dropdown-menu");

  getScoreInput = card => card.find('[data-cy="scoreInput"]');

  getFeedbackArea = card => card.contains("Leave a feedback!").next();

  getScoreByAttempt = (attemptData, points, questionType, attemptType) => {
    let score = 0;
    const { right, partialCorrect } = attemptData;
    switch (questionType) {
      case queTypes.MULTIPLE_CHOICE_STANDARD:
      case queTypes.TRUE_FALSE:
      case queTypes.MULTIPLE_CHOICE_BLOCK:
      case queTypes.MULTIPLE_CHOICE_MULTIPLE:
        if (attemptType === attemptTypes.RIGHT) score = points;
        else if (attemptType === attemptTypes.PARTIAL_CORRECT) {
          let correctChoices = 0;
          partialCorrect.forEach(ch => {
            if (right.indexOf(ch) >= 0) correctChoices++;
          });
          score = Cypress._.round((correctChoices / right.length) * points, 2);
        }
        break;

      case queTypes.CHOICE_MATRIX_STANDARD:
      case queTypes.CHOICE_MATRIX_LABEL:
      case queTypes.CHOICE_MATRIX_INLINE:
        if (attemptType === attemptTypes.RIGHT) score = points;
        else if (attemptType === attemptTypes.PARTIAL_CORRECT) {
          let correctChoices = 0;
          Object.keys(partialCorrect).forEach(ch => {
            if (partialCorrect[ch] === right[ch]) correctChoices++;
          });
          score = Cypress._.round((correctChoices / Object.keys(right).length) * points, 2);
        }
        break;

      default:
        break;
    }

    return score;
  };

  verifyScore = (card, points, attemptData, attemptType, questionType) => {
    /* this.getScoreInput(card)
      .as("scoreinputbox")
      .should("have.value", correct ? points.toString() : "0");
 */
    const score = this.getScoreByAttempt(attemptData, points, questionType, attemptType);

    this.getScoreInput(card)
      .as("scoreinputbox")
      .should("have.value", score.toString());

    // verify max score
    cy.get("@scoreinputbox")
      .next()
      .should("have.text", points.toString());
  };

  updateScoreForStudent = (studentName, score) => {
    cy.server();
    cy.route("PUT", "**/feedback").as("feedback");
    cy.route("PUT", "**/response-entry-and-score").as("scoreEntry");
    this.getQuestionContainerByStudent(studentName).as("updatecard");
    cy.wait(500); // front end renders slow and gets old value appended in the box, hence waiting
    this.getScoreInput(cy.get("@updatecard"))
      .as("scoreinputbox")
      .type("{selectall}{del}", { force: score })
      .type(score, { force: true });

    this.getFeedbackArea(cy.get("@updatecard"))
      .click()
      .then(() => {
        cy.wait("@scoreEntry").then(xhr => {
          expect(xhr.status).to.eq(200);
          // expect(xhr.responseBody.result).to.eq("feedback and score are saved successfully");
        });
      });

    cy.get("@scoreinputbox").should("have.value", score.toString());
  };

  clickOnUpdateButton = card => card.find('[data-cy="updateButton"]').click({ force: true });

  verifyScoreRight = (card, points) => {
    this.verifyScore(card, true, points);
  };

  verifyScoreWrong = (card, points) => {
    this.verifyScore(card, false, points);
  };

  selectStudent = studentName => {
    cy.server();
    cy.route("GET", "**/test-activity/**").as("test-activity");
    this.getDropDown()
      .eq(0)
      .click();
    this.getDropDownMenu()
      .contains(studentName)
      .click();

    if (!studentName.includes("Student01")) cy.wait("@test-activity");
    this.getQuestionContainer(0).should("contain", studentName);
  };

  verifyOptionDisabled = option => {
    this.getDropDown()
      .eq(0)
      .click();
    this.getDropDownMenu()
      .contains(option)
      .should("have.class", "ant-select-dropdown-menu-item-disabled");
  };

  selectQuestion = queNum => {
    // const questionSelect = `Question ${queNum.slice(1)}`;
    cy.server();
    cy.route("GET", "**/question/**").as("question");
    this.getDropDown().click();
    this.getDropDownMenu()
      .contains(queNum)
      .click({ force: true });
    if (queNum !== "Q1") cy.wait("@question");
  };

  getQuestionContainer = cardIndex => cy.get('[data-cy="question-container"]').eq(cardIndex);

  getQuestionContainerByStudent = studentName =>
    cy
      .get('[data-cy="studentName"]')
      .contains(studentName)
      .closest('[data-cy="question-container"]');

  // MCQ
  getLabels = qcard => qcard.find("label");

  verifyLabelChecked = (quecard, choice) =>
    this.getLabels(quecard)
      .contains(choice)
      .closest("label")
      .find("input")
      .should("be.checked");

  verifyLabelClass = (quecard, choice, classs) =>
    this.getLabels(quecard)
      .contains(choice)
      .closest("label")
      .should("have.class", classs);

  verifyLabelBackgroundColor = (quecard, choice, color) =>
    this.getLabels(quecard)
      .contains(choice)
      .closest("label")
      .should("have.css", "background-color", color);

  // CHOICE MATRIX

  getMatrixTableRows = card =>
    card
      .find('[data-cy="matrixTable"]')
      .children()
      .find("tr.ant-table-row");

  verifyAnseredMatrix = (card, answer, steams) => {
    this.getMatrixTableRows(card).then(ele => {
      Object.keys(answer).forEach(chKey => {
        cy.wrap(ele)
          .contains(chKey)
          .closest("tr")
          .then(row => {
            cy.wrap(row)
              .find("input")
              .eq(steams.indexOf(answer[chKey]))
              .should("be.checked");
          });
      });
    });
  };

  verifyCorrectAnseredMatrix = (card, correct, steams) => {
    this.getMatrixTableRows(card).then(ele => {
      Object.keys(correct).forEach(chKey => {
        cy.wrap(ele)
          .contains(chKey)
          .closest("tr")
          .then(row => {
            cy.wrap(row)
              .find("input")
              .eq(steams.indexOf(correct[chKey]))
              .closest("div")
              .should("have.css", "background-color", queColor.CLEAR_DAY);
          });
      });
    });
  };

  verifyNoQuestionResponseCard = studentName => {
    cy.get('[data-cy="studentName"]')
      .contains(studentName)
      .should("not.exist");
  };

  verifyQuestionResponseCard = (points, queTypeKey, attemptType, attemptData, studentCentric = true, findKey) => {
    const queCard = studentCentric
      ? this.getQuestionContainer(findKey).as("quecard")
      : this.getQuestionContainerByStudent(findKey).as("quecard");

    const { right, wrong, partialCorrect } = attemptData;
    const questionType = queTypeKey.split(".")[0];

    this.verifyScore(cy.get("@quecard"), points, attemptData, attemptType, questionType);

    switch (questionType) {
      case queTypes.MULTIPLE_CHOICE_STANDARD:
      case queTypes.MULTIPLE_CHOICE_MULTIPLE:
      case queTypes.TRUE_FALSE:
        switch (attemptType) {
          case attemptTypes.RIGHT:
            if (Cypress._.isArray(right)) right.forEach(choice => this.verifyLabelChecked(cy.get("@quecard"), choice));
            else {
              this.verifyLabelChecked(cy.get("@quecard"), right);
            }

            break;

          case attemptTypes.WRONG:
            if (Cypress._.isArray(wrong)) {
              wrong.forEach(choice => {
                this.verifyLabelChecked(cy.get("@quecard"), choice);
                this.verifyLabelClass(cy.get("@quecard"), choice, attemptTypes.WRONG);
              });
            } else {
              this.verifyLabelChecked(cy.get("@quecard"), wrong);
              this.verifyLabelClass(cy.get("@quecard"), wrong, attemptTypes.WRONG);
            }
            break;

          case attemptTypes.SKIP:
            break;

          case attemptTypes.PARTIAL_CORRECT:
            if (Cypress._.isArray(partialCorrect))
              partialCorrect.forEach(choice => this.verifyLabelChecked(cy.get("@quecard"), choice));
            else {
              this.verifyLabelChecked(cy.get("@quecard"), partialCorrect);
            }
            break;

          default:
            break;
        }

        if (Cypress._.isArray(right)) {
          right.forEach(choice => this.verifyLabelClass(cy.get("@quecard"), choice, attemptTypes.RIGHT));
        } else {
          this.verifyLabelClass(cy.get("@quecard"), right, attemptTypes.RIGHT);
        }

        break;

      case queTypes.MULTIPLE_CHOICE_BLOCK:
        switch (attemptType) {
          case attemptTypes.RIGHT:
            if (Cypress._.isArray(right)) {
              right.forEach(choice =>
                this.verifyLabelBackgroundColor(cy.get("@quecard"), choice, queColor.LIGHT_GREEN)
              );
            } else {
              this.verifyLabelBackgroundColor(cy.get("@quecard"), right, queColor.LIGHT_GREEN);
            }
            break;

          case attemptTypes.WRONG:
            if (Cypress._.isArray(wrong)) {
              wrong.forEach(choice => {
                this.verifyLabelBackgroundColor(cy.get("@quecard"), choice, queColor.LIGHT_RED);
                this.verifyLabelClass(cy.get("@quecard"), choice, attemptTypes.WRONG);
              });
            } else {
              this.verifyLabelBackgroundColor(cy.get("@quecard"), wrong, queColor.LIGHT_RED);
              this.verifyLabelClass(cy.get("@quecard"), wrong, attemptTypes.WRONG);
            }

            break;

          case attemptTypes.SKIP:
            break;

          default:
            break;
        }
        if (Cypress._.isArray(right)) {
          right.forEach(choice => {
            this.verifyLabelClass(cy.get("@quecard"), choice, attemptTypes.RIGHT);
          });
        } else this.verifyLabelClass(cy.get("@quecard"), right, attemptTypes.RIGHT);
        break;

      case queTypes.CHOICE_MATRIX_STANDARD:
      case queTypes.CHOICE_MATRIX_INLINE:
      case queTypes.CHOICE_MATRIX_LABEL: {
        const { steams } = attemptData;
        this.verifyCorrectAnseredMatrix(cy.get("@quecard"), right, steams);
        switch (attemptType) {
          case attemptTypes.RIGHT:
            this.verifyAnseredMatrix(cy.get("@quecard"), right, steams);
            break;

          case attemptTypes.WRONG:
            this.verifyAnseredMatrix(cy.get("@quecard"), wrong, steams);
            break;

          case attemptTypes.PARTIAL_CORRECT:
            this.verifyAnseredMatrix(cy.get("@quecard"), partialCorrect, steams);
            break;

          default:
            break;
        }
        break;
      }

      default:
        break;
    }
  };
}
