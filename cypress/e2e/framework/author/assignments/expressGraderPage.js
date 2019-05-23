import { attemptTypes } from "../../constants/questionTypes";
import LiveClassboardPage from "./LiveClassboardPage";

export default class ExpressGraderPage extends LiveClassboardPage {
  constructor() {
    super();
    this.rowAlias = "studentRow";
  }

  getGridRowByStudent = student => cy.contains("div", student).closest("tr");

  getScoreInputBox = () => cy.get('[data-cy="scoreInput"]');

  navigateByRightKey = () => this.getScoreInputBox().type("{rightarrow}");

  navigateByLeftKey = () => this.getScoreInputBox().type("{leftarrow}");

  navigateByUpKey = () => this.getScoreInputBox().type("{uparrow}");

  navigateByDownKey = () => this.getScoreInputBox().type("{downarrow}");

  clickOnPrevStudent = () => cy.contains("span", "PREV STUDENT").click();

  clickOnNextStudent = () => cy.contains("span", "NEXT STUDENT").click();

  clickOnPrevQuestion = () => cy.contains("span", "PREV QUESTION").click();

  clickOnNextQuestion = () => cy.contains("span", "NEXT QUESTION").click();

  verifyScoreAndPerformance = (score, perf) => {
    cy.get(`@${this.rowAlias}`)
      .find("td")
      .eq(1)
      .find("span")
      .should("have.text", perf)
      .parent()
      .should("contain", `(${score})`);
  };

  getScoreforQueNum = queNum => {
    const queIndex = Number(queNum.slice(1)) - 1;
    return cy
      .get(`@${this.rowAlias}`)
      .find(".sub-thead-th")
      .eq(queIndex)
      .find("span");
  };

  verifyScoreAndPerformanceForQueNum = (queNum, score, perf) => {
    const queIndex = Number(queNum.slice(1)) - 1;
    return cy
      .get(".ant-table-thead")
      .find(".sub-thead-th")
      .eq(queIndex)
      .find(".ant-table-column-title")
      .find("span")
      .should("have.text", perf)
      .parent()
      .should("contain", `(${score})`);
  };

  verifyScoreForStudent = (queNum, points, attemptType) => {
    const score = attemptType === attemptTypes.RIGHT ? points.toString() : "0";
    this.getScoreforQueNum(queNum).should("have.text", score);
  };

  verifyScoreGrid(studentName, studentAttempts, score, perf, questionTypeMap) {
    this.getGridRowByStudent(studentName).as(this.rowAlias);

    this.verifyScoreAndPerformance(score, perf);

    Object.keys(studentAttempts).forEach(queNum => {
      const attemptType = studentAttempts[queNum];
      const { points } = questionTypeMap[queNum];
      //   console.log(` grid score -${studentName} for que - ${queNum}`, `point - ${points}, attepmt - ${attemptType}`);
      this.verifyScoreForStudent(queNum, points, attemptType);
    });
  }

  verifyQuestionLevelGrid = (queNum, studentAttempts, questionTypeMap) => {
    const { score, perf } = this.getScoreAndPerformance(studentAttempts, questionTypeMap, queNum, true);
    const { points } = questionTypeMap[queNum];

    Object.keys(studentAttempts).forEach(studentName => {
      this.getGridRowByStudent(studentName).as(this.rowAlias);
      const attemptType = studentAttempts[studentName];
      console.log(` grid score -${studentName} for que - ${queNum}`, `point - ${points}, attepmt - ${attemptType}`);
      this.verifyScoreForStudent(queNum, points, attemptType);
    });

    this.verifyScoreAndPerformanceForQueNum(queNum, score, perf);
  };
}
