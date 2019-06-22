import { attemptTypes } from "../../constants/questionTypes";
import LiveClassboardPage from "./LiveClassboardPage";

export default class ExpressGraderPage extends LiveClassboardPage {
  constructor() {
    super();
    this.rowAlias = "studentRow";
  }

  getGridRowByStudent = student =>
    cy
      .contains("div", student)
      .closest("tr")
      .as(this.rowAlias);

  getScoreInputBox = () => cy.get('[data-cy="scoreInput"]');

  waitForStudentData = () => {
    cy.wait("@student").then(xhr => expect(xhr.status).to.eq(200));
  };

  routeAPIs = () => {
    cy.server();
    cy.route("GET", "**/student/**").as("student");
  };

  navigateByRightKey = () => {
    this.getScoreInputBox().type("{rightarrow}");
    this.waitForStudentData();
  };

  navigateByLeftKey = () => {
    this.getScoreInputBox().type("{leftarrow}");
    this.waitForStudentData();
  };

  navigateByUpKey = () => {
    this.getScoreInputBox().type("{uparrow}");
    this.waitForStudentData();
  };

  navigateByDownKey = () => {
    this.getScoreInputBox().type("{downarrow}");
    this.waitForStudentData();
  };

  clickOnPrevStudent = () => {
    cy.contains("span", "PREV STUDENT").click();
    this.waitForStudentData();
  };

  clickOnNextStudent = () => {
    cy.contains("span", "NEXT STUDENT").click();
    this.waitForStudentData();
  };

  clickOnPrevQuestion = () => {
    cy.contains("span", "PREV QUESTION").click();
    this.waitForStudentData();
  };

  clickOnNextQuestion = () => {
    cy.contains("span", "NEXT QUESTION").click();
    this.waitForStudentData();
  };

  getEditResponseToggle = () => cy.get("button.ant-switch");

  clickOnExit = (updated = false) => {
    cy.get("#react-app").then(() => {
      if (Cypress.$('[data-cy="exitbutton"]').length === 1) {
        if (updated) {
          cy.server();
          cy.route("GET", "**/test-activity").as("test-activity");
          cy.get('[data-cy="exitbutton"]').click({ force: true });
          cy.wait("@test-activity");
        } else cy.get('[data-cy="exitbutton"]').click({ force: true });
      }
    });
  };

  verifyScoreAndPerformance = (score, perf) => {
    cy.get(`@${this.rowAlias}`)
      .find("td")
      .eq(1)
      .find("span")
      .should("have.text", `${Cypress._.round(perf)}%`)
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
      .should("have.text", `${Cypress._.round(perf, 1)}%`)
      .parent()
      .should("contain", score);
  };

  verifyScoreForStudent = (queNum, points, attemptType, attemptData, queKey) => {
    // const score = attemptType === attemptTypes.RIGHT ? points.toString() : "0";
    const score = this.questionResponsePage.getScoreByAttempt(attemptData, points, queKey.split(".")[0], attemptType);
    this.getScoreforQueNum(queNum).should("have.text", score.toString());
  };

  verifyScoreGrid(studentName, studentAttempts, score, perfValue, questionTypeMap) {
    this.getGridRowByStudent(studentName);

    this.verifyScoreAndPerformance(score, perfValue);

    Object.keys(studentAttempts).forEach(queNum => {
      const attemptType = studentAttempts[queNum];
      const { points, attemptData, queKey } = questionTypeMap[queNum];
      //   console.log(` grid score -${studentName} for que - ${queNum}`, `point - ${points}, attepmt - ${attemptType}`);
      this.verifyScoreForStudent(queNum, points, attemptType, attemptData, queKey);
    });
  }

  verifyQuestionLevelGrid = (queNum, studentAttempts, questionTypeMap) => {
    const { score, perfValue, quePerformanceScore } = this.getScoreAndPerformance(
      studentAttempts,
      questionTypeMap,
      queNum,
      true
    );
    const { points, attemptData, queKey } = questionTypeMap[queNum];

    this.verifyScoreAndPerformanceForQueNum(queNum, quePerformanceScore, perfValue);

    Object.keys(studentAttempts).forEach(studentName => {
      this.getGridRowByStudent(studentName);
      const attemptType = studentAttempts[studentName];
      // console.log(` grid score -${studentName} for que - ${queNum}`, `point - ${points}, attepmt - ${attemptType}`);
      this.verifyScoreForStudent(queNum, points, attemptType, attemptData, queKey);
    });
  };

  verifyResponsesInGridStudentLevel = (studentName, studentAttempts, questionTypeMap, useKeyBoardKeys = false) => {
    this.routeAPIs();
    this.getGridRowByStudent(studentName);
    // start from Q1 always
    this.getScoreforQueNum("Q1").click();
    this.waitForStudentData();

    Object.keys(studentAttempts)
      .sort()
      .forEach((queNum, index, item) => {
        const attemptType = studentAttempts[queNum];
        const { queKey, attemptData, points } = questionTypeMap[queNum];
        console.log(` grid score -queKey ${queKey} for que - ${queNum}`, `point - ${points}, attepmt - ${attemptType}`);
        this.questionResponsePage.verifyQuestionResponseCard(
          points,
          queKey,
          attemptType,
          attemptData,
          false,
          studentName
        );

        if (index < item.length - 1) {
          if (useKeyBoardKeys) this.navigateByRightKey();
          else this.clickOnNextQuestion();
        }
      });

    Object.keys(studentAttempts)
      .sort()
      .reverse()
      .forEach((queNum, index, item) => {
        const attemptType = studentAttempts[queNum];
        const { queKey, attemptData, points } = questionTypeMap[queNum];
        this.questionResponsePage.verifyQuestionResponseCard(
          points,
          queKey,
          attemptType,
          attemptData,
          false,
          studentName
        );

        if (index < item.length - 1) {
          if (useKeyBoardKeys) this.navigateByLeftKey();
          else this.clickOnPrevQuestion();
        }
      });

    this.clickOnExit();
  };

  verifyResponsesInGridQuestionLevel = (queNum, studentAttempts, questionTypeMap, useKeyBoardKeys = false) => {
    const studentList = Object.keys(studentAttempts).sort();

    this.routeAPIs();
    // start with 1st student always
    this.getGridRowByStudent(studentList[0]);
    this.getScoreforQueNum(queNum).click();
    this.waitForStudentData();

    studentList.forEach((studentName, index, item) => {
      const attemptType = studentAttempts[studentName];
      const { queKey, attemptData, points } = questionTypeMap[queNum];
      // console.log(` grid score -queKey ${queKey} for que - ${queNum}`, `point - ${points}, attepmt - ${attemptType}`);
      this.questionResponsePage.verifyQuestionResponseCard(
        points,
        queKey,
        attemptType,
        attemptData,
        false,
        studentName
      );

      if (index < item.length - 1) {
        if (useKeyBoardKeys) this.navigateByDownKey();
        else this.clickOnNextStudent();
      }
    });

    studentList.reverse().forEach((studentName, index, item) => {
      const attemptType = studentAttempts[studentName];
      const { queKey, attemptData, points } = questionTypeMap[queNum];
      // console.log(` grid score -queKey ${queKey} for que - ${queNum}`, `point - ${points}, attepmt - ${attemptType}`);
      this.questionResponsePage.verifyQuestionResponseCard(
        points,
        queKey,
        attemptType,
        attemptData,
        false,
        studentName
      );

      if (index < item.length - 1) {
        if (useKeyBoardKeys) this.navigateByUpKey();
        else this.clickOnPrevStudent();
      }
    });
  };

  verifyUpdateScore = (studentName, queNum, score) => {
    let previousScore;
    this.routeAPIs();
    this.getGridRowByStudent(studentName);

    this.getScoreforQueNum(queNum)
      .then(ele => {
        previousScore = ele.text();
        cy.wrap(ele).click({ force: true });
        this.waitForStudentData();
        this.questionResponsePage.updateScoreForStudent(studentName, score);
        this.clickOnExit(true);
      })
      .then(() => {
        this.getScoreforQueNum(queNum)
          .should("have.text", score)
          .click({ force: true });
        console.log("previousScore ::", previousScore);
        this.questionResponsePage.updateScoreForStudent(studentName, previousScore);
        this.clickOnExit(true);
      });
  };
}
