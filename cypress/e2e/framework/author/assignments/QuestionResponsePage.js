import { questionTypeKey as queTypes, attemptTypes } from "../../constants/questionTypes";

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
    cy.wait("@test-activity");
    this.getQuestionContainer(0).should("contain", studentName);
  };

  verifyOptionDisabled = option => {
    this.getDropDown().click();
    this.getDropDownMenu()
      .contains(option)
      .should("have.class", "ant-select-dropdown-menu-item-disabled");
  };

  selectQuestion = queNum => {
    const questionSelect = `Question ${queNum.slice(1)}`;
    cy.server();
    cy.route("GET", "**/question/**").as("question");
    this.getDropDown().click();
    this.getDropDownMenu()
      .contains(questionSelect)
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

  verifyNoQuestionResponseCard = studentName => {
    cy.get('[data-cy="studentName"]')
      .contains(studentName)
      .should("not.exist");
  };

  verifyQuestionResponseCard = (points, queTypeKey, attemptType, attemptData, studentCentric = true, findKey) => {
    const queCard = studentCentric
      ? this.getQuestionContainer(findKey).as("quecard")
      : this.getQuestionContainerByStudent(findKey).as("quecard");

    switch (queTypeKey.split(".")[0]) {
      case queTypes.MULTIPLE_CHOICE_STANDARD:
        switch (attemptType) {
          case attemptTypes.RIGHT:
            this.getLabels(queCard)
              .contains(attemptData[attemptTypes.RIGHT])
              .closest("label")
              .find("input")
              .should("be.checked");
            this.verifyScoreRight(cy.get("@quecard"), points);
            break;

          case attemptTypes.WRONG:
            this.getLabels(queCard)
              .contains(attemptData[attemptTypes.WRONG])
              .closest("label")
              .should("have.class", attemptTypes.WRONG)
              .find("input")
              .should("be.checked");
            this.verifyScoreWrong(cy.get("@quecard"), points);
            break;

          case attemptTypes.SKIP:
            break;

          default:
            break;
        }
        this.getLabels(cy.get("@quecard"))
          .contains(attemptData[attemptTypes.RIGHT])
          .closest("label")
          .should("have.class", attemptTypes.RIGHT);
        break;

      default:
        break;
    }
  };
}
