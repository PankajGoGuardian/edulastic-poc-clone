import { questionTypeKey as queTypes, attemptTypes } from "../../constants/questionTypes";

export default class QuestionResponsePage {
  getDropDown = () => cy.get(".ant-select-selection");

  selectStudent = studentName => {
    cy.server();
    cy.route("GET", "**/test-activity/**").as("test-activity");
    this.getDropDown().click();
    cy.get(".ant-select-dropdown-menu")
      .contains(studentName)
      .click();
    cy.wait("@test-activity");
    this.getQuestionContainer(0).should("contain", studentName);
  };

  selectQuestion = queNum => {
    const questionSelect = `Question ${queNum.slice(1)}`;
    cy.server();
    cy.route("GET", "**/question/**").as("question");
    this.getDropDown().click();
    cy.get(".ant-select-dropdown-menu")
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

  verifyQuestionResponseCard = (queTypeKey, attemptType, attemptData, studentCentric = true, findKey) => {
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
            break;

          case attemptTypes.WRONG:
            this.getLabels(queCard)

              .contains(attemptData[attemptTypes.WRONG])
              .closest("label")
              .should("have.class", attemptTypes.WRONG)
              .find("input")
              .should("be.checked");
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
