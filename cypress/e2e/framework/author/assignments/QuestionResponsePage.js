import { questionTypeKey as queTypes, attemptTypes, queColor, questionType } from "../../constants/questionTypes";

export default class QuestionResponsePage {
  getDropDown = () => cy.get(".ant-select-selection");

  getDropDownMenu = () => cy.get(".ant-select-dropdown-menu");

  getScoreInput = card => card.find('[data-cy="scoreInput"]');

  verifyScore = (card, correct, points) => {
    this.getScoreInput(card)
      .as("scoreinputbox")
      .should("have.value", correct ? points.toString() : "0");

    // verify max score
    cy.get("@scoreinputbox")
      .next()
      .should("have.text", points.toString());
  };

  updateScoreForStudent = (studentName, score) => {
    cy.server();
    cy.route("PUT", "**/feedbackAndScore").as("feedback");
    this.getQuestionContainerByStudent(studentName).as("updatecard");
    cy.wait(500); // front end renders slow and gets old value appended in the box, hence waiting
    this.getScoreInput(cy.get("@updatecard"))
      .as("scoreinputbox")
      .type("{selectall}{del}", { force: score })
      .type(score, { force: true });

    this.clickOnUpdateButton(cy.get("@updatecard")).then(() => {
      cy.wait("@feedback").then(xhr => {
        expect(xhr.status).to.eq(200);
        expect(xhr.responseBody.result).to.eq("feedback and score are saved successfully");
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
    this.getDropDown().click();
    this.getDropDownMenu()
      .contains(studentName)
      .click();

    if (studentName !== "Student01") cy.wait("@test-activity");
    this.getQuestionContainer(0).should("contain", studentName);
  };

  verifyOptionDisabled = option => {
    this.getDropDown().click();
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
      .click();
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

  // CHOICE MATRIX

  verifyAnseredMatrix = (card, answer, steams) => {
    card
      .find('[data-cy="matrixTable"]')
      .children()
      .find("tr.ant-table-row")
      .then(ele => {
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
    card
      .find('[data-cy="matrixTable"]')
      .children()
      .find("tr.ant-table-row")
      .then(ele => {
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

    const { right, wrong } = attemptData;

    switch (queTypeKey.split(".")[0]) {
      case queTypes.MULTIPLE_CHOICE_STANDARD:
      case queTypes.MULTIPLE_CHOICE_MULTIPLE:
      case queTypes.TRUE_FALSE:
        switch (attemptType) {
          case attemptTypes.RIGHT:
            if (Cypress._.isArray(right))
              right.forEach(choice =>
                this.getLabels(cy.get("@quecard"))
                  .contains(choice)
                  .closest("label")
                  .find("input")
                  .should("be.checked")
              );
            else {
              this.getLabels(cy.get("@quecard"))
                .contains(right)
                .closest("label")
                .find("input")
                .should("be.checked");
            }

            this.verifyScoreRight(cy.get("@quecard"), points);
            break;

          case attemptTypes.WRONG:
            if (Cypress._.isArray(wrong)) {
              wrong.forEach(choice =>
                this.getLabels(cy.get("@quecard"))
                  .contains(choice)
                  .closest("label")
                  .should("have.class", attemptTypes.WRONG)
                  .find("input")
                  .should("be.checked")
              );
            } else {
              this.getLabels(cy.get("@quecard"))
                .contains(wrong)
                .closest("label")
                .should("have.class", attemptTypes.WRONG)
                .find("input")
                .should("be.checked");
            }
            this.verifyScoreWrong(cy.get("@quecard"), points);
            break;

          case attemptTypes.SKIP:
            break;

          default:
            break;
        }

        if (Cypress._.isArray(right)) {
          right.forEach(choice =>
            this.getLabels(cy.get("@quecard"))
              .contains(choice)
              .closest("label")
              .should("have.class", attemptTypes.RIGHT)
          );
        } else {
          this.getLabels(cy.get("@quecard"))
            .contains(right)
            .closest("label")
            .should("have.class", attemptTypes.RIGHT);
        }

        break;

      case queTypes.MULTIPLE_CHOICE_BLOCK:
        switch (attemptType) {
          case attemptTypes.RIGHT:
            if (Cypress._.isArray(right)) {
              right.forEach(choice =>
                this.getLabels(cy.get("@quecard"))
                  .contains(choice)
                  .closest("label")
                  .then($ele => {
                    expect($ele.css("background-color")).to.eq(queColor.BLUE);
                  })
              );
            } else {
              this.getLabels(cy.get("@quecard"))
                .contains(right)
                .closest("label")
                .then($ele => {
                  expect($ele.css("background-color")).to.eq(queColor.BLUE);
                });
            }
            this.verifyScoreRight(cy.get("@quecard"), points);
            break;

          case attemptTypes.WRONG:
            if (Cypress._.isArray(wrong)) {
              wrong.forEach(choice => {
                this.getLabels(cy.get("@quecard"))
                  .contains(choice)
                  .closest("label")
                  .then($ele => {
                    cy.wrap($ele).should("have.class", attemptTypes.WRONG);
                    expect(cy.wrap($ele).css("background-color")).to.eq(queColor.BLUE);
                  });
              });
            } else {
              this.getLabels(cy.get("@quecard"))
                .contains(wrong)
                .closest("label")
                .then($ele => {
                  cy.wrap($ele).should("have.class", attemptTypes.WRONG);
                  expect(cy.wrap($ele).css("background-color")).to.eq(queColor.BLUE);
                });
            }

            this.verifyScoreWrong(cy.get("@quecard"), points);
            break;

          case attemptTypes.SKIP:
            break;

          default:
            break;
        }
        if (Cypress._.isArray(right)) {
          right.forEach(choice => {
            this.getLabels(cy.get("@quecard"))
              .contains(choice)
              .closest("label")
              .should("have.class", attemptTypes.RIGHT);
          });
        } else
          this.getLabels(cy.get("@quecard"))
            .contains(right)
            .closest("label")
            .should("have.class", attemptTypes.RIGHT);
        break;

      case queTypes.CHOICE_MATRIX_STANDARD:
      case questionType.CHOICE_MATRIX_INLINE:
      case questionType.CHOICE_MATRIX_LABEL: {
        const { steams } = attemptData;
        this.verifyCorrectAnseredMatrix(cy.get("@quecard"), right, steams);
        switch (attemptType) {
          case attemptTypes.RIGHT:
            this.verifyAnseredMatrix(cy.get("@quecard"), right, steams);
            this.verifyScoreRight(cy.get("@quecard"), points);
            break;

          case attemptTypes.WRONG:
            this.verifyAnseredMatrix(cy.get("@quecard"), wrong, steams);
            this.verifyScoreWrong(cy.get("@quecard"), points);
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
