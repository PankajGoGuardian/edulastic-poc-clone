import LCBHeader from "./lcbHeader";
import { questionTypeKey as queTypes, attemptTypes } from "../../constants/questionTypes";

export default class StudentCentricViewPage {
  constructor() {
    this.header = new LCBHeader();
  }

  getStudentDropDown = () => cy.get(".ant-select-selection");

  selectStudent = studentName => {
    cy.server();
    cy.route("GET", "**/test-activity/**").as("test-activity");
    this.getStudentDropDown().click();
    cy.get(".ant-select-dropdown-menu")
      .contains(studentName)
      .click();
    cy.wait("@test-activity");
    this.getQuestionContainer(0).should("contain", studentName);
  };

  getQuestionContainer = cardIndex => cy.get('[data-cy="question-container"]').eq(cardIndex);

  // MCQ
  getLabels = qcard => qcard.find("label");

  verifyQuestionResponseCard = (studentAttempts, questionTypeMap) => {
    Object.keys(studentAttempts).forEach((queNum, qIndex) => {
      const attemptType = studentAttempts[queNum];
      const { queKey, attemptData } = questionTypeMap[queNum];
      const queCard = this.getQuestionContainer(qIndex);
      switch (queKey.split(".")[0]) {
        case queTypes.MULTIPLE_CHOICE_STANDARD:
          switch (attemptType) {
            case attemptTypes.RIGHT:
              this.getLabels(queCard)
                .contains(attemptData[attemptTypes.RIGHT])
                .closest("label")
                .as("rightLabel")
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
          cy.get("@rightLabel").should("have.class", attemptTypes.RIGHT);
          break;

        default:
          break;
      }
    });
  };
}
