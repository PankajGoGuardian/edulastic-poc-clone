import { attemptTypes, questionTypeKey as queTypes, queColor } from "../../constants/questionTypes";
import LiveClassboardPage from "./LiveClassboardPage";
import StudentTestPage from "../../student/studentTestPage";
export default class ExpressGraderPage extends LiveClassboardPage {
  constructor() {
    super();
    this.rowAlias = "studentRow";
    this.attemptQuestion = (attemptQueType, attemptType, attemptData) =>
      new StudentTestPage().attemptQuestion(attemptQueType, attemptType, attemptData);
  }
  // *** ELEMENTS START ***

  getGridRowByStudent = student =>
    cy
      .contains("div", student)
      .closest("tr")
      .as(this.rowAlias);

  getScoreInputBox = () => cy.get('[data-cy="scoreInput"]');

  getExitButton = () => cy.get('[data-cy="exitbutton"]');

  getResponseScoreToggleSwitch = () => cy.get('[data-cy="response-toggle"]');

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

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
    cy.get("body")
      .contains("span", "PREV STUDENT")
      .click();
    this.waitForStudentData();
  };

  clickOnNextStudent = () => {
    cy.get("body")
      .contains("span", "NEXT STUDENT")
      .click();
    this.waitForStudentData();
  };

  clickOnPrevQuestion = () => {
    cy.get("body")
      .contains("span", "PREV QUESTION")
      .click();
    this.waitForStudentData();
  };

  clickOnNextQuestion = () => {
    cy.get("body")
      .contains("span", "NEXT QUESTION")
      .click();
    this.waitForStudentData();
  };

  getEditResponseToggle = () => cy.get('[data-cy="editResponse"]');

  clickOnExit = (updated = false) => {
    cy.get("#react-app").then(() => {
      if (Cypress.$('[data-cy="exitbutton"]').length === 1) {
        /* 
        if (updated) {
          cy.server();
          cy.route("GET", "**test-activity").as("test-activity");
          cy.get('[data-cy="exitbutton"]').click({ force: true });
          cy.wait("@test-activity");
        } else 
         */
        this.getExitButton().click({ force: true });
      }
    });
  };

  setToggleToResponse = () =>
    this.getResponseScoreToggleSwitch().then($ele => {
      if ($ele.attr("aria-checked") === "true")
        cy.wrap($ele)
          .click()
          .should("not.have.class", "ant-switch-checked");
    });

  setToggleToScore = () =>
    this.getResponseScoreToggleSwitch().then($ele => {
      if ($ele.attr("aria-checked") === "false")
        cy.wrap($ele)
          .click()
          .should("have.class", "ant-switch-checked");
    });

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifyToggleSetToResponse = () => {
    this.getResponseScoreToggleSwitch().should("not.have.class", "ant-switch-checked");
  };

  verifyScoreAndPerformance = (score, perf) => {
    cy.get(`@${this.rowAlias}`)
      .find("td")
      .eq(1)
      .find("span")
      .should("have.text", `${Cypress._.round(perf)}%`)
      .parent()
      .should(
        "contain",
        `(${score
          .split("/")
          .map(s => s.trim())
          .join("/")})`
      );
  };

  indexToOption = ind => String.fromCharCode(ind + 65);

  getScoreforQueNum = queNum => this.getCellforQueNum(queNum).find("span");

  getCellforQueNum = queNum => {
    const queIndex = Number(queNum.slice(1)) - 1;
    return cy
      .get(`@${this.rowAlias}`)
      .find(".sub-thead-th")
      .eq(queIndex)
      .find("div");
  };

  getQuestionTableResponseData = ({ attempt, questionTypeMap }) => {
    const questinoWiseData = {};
    const TEI_Attempt = "TEI";
    const CR_Questions = "Constructed Response";
    const skippedResponse = "-";

    Object.keys(attempt).forEach(queNo => {
      const attemptType = attempt[queNo];
      let { queKey, attemptData, choices } = questionTypeMap[queNo];
      let studentResponseByAttempt;
      let studentResponse;

      switch (queKey.split(".")[0]) {
        case queTypes.MULTIPLE_CHOICE_BLOCK:
        case queTypes.MULTIPLE_CHOICE_STANDARD:
        case queTypes.TRUE_FALSE:
        case queTypes.MULTIPLE_CHOICE_MULTIPLE:
          studentResponseByAttempt = Array.isArray(attemptData[attemptType])
            ? attemptData[attemptType]
            : [attemptData[attemptType]];
          studentResponse =
            attemptType === attemptTypes.SKIP
              ? skippedResponse
              : studentResponseByAttempt.map(ele => choices.indexOf(ele)).map(ind => this.indexToOption(ind));
          break;

        case queTypes.CLOZE_DROP_DOWN:
          studentResponseByAttempt = attemptData[attemptType];
          studentResponse = attemptType === attemptTypes.SKIP ? skippedResponse : studentResponseByAttempt;
          break;

        case queTypes.CHOICE_MATRIX_STANDARD:
        case queTypes.CHOICE_MATRIX_LABEL:
        case queTypes.CHOICE_MATRIX_INLINE:
          studentResponse = attemptType === attemptTypes.SKIP ? skippedResponse : TEI_Attempt;
          break;

        case queTypes.ESSAY_RICH:
          studentResponse = attemptType === attemptTypes.SKIP ? skippedResponse : CR_Questions;
          break;

        default:
          assert.fail(1, 2, "Qusetion type does not match while calculating question table data");
          break;
      }
      questinoWiseData[`${queNo}`] = {
        studentResponse
      };
    });
    return questinoWiseData;
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
      .should(
        "contain",
        score
          .split("/")
          .map(s => s.trim())
          .join("/")
      );
  };

  verifyScoreForStudent = (queNum, points, attemptType, attemptData, queKey) => {
    // const score = attemptType === attemptTypes.RIGHT ? points.toString() : "0";
    const score = this.questionResponsePage.getScoreByAttempt(attemptData, points, queKey.split(".")[0], attemptType);
    this.getScoreforQueNum(queNum).should("have.text", score.toString());
  };

  verifyCellColorForQuestion = (queNum, attemptType) => {
    const color =
      attemptType === attemptTypes.RIGHT
        ? queColor.GREEN_4
        : attemptType === attemptTypes.WRONG
        ? queColor.RED_2
        : attemptType === attemptTypes.PARTIAL_CORRECT
        ? queColor.ORANGE_2
        : queColor.GREY_1;
    this.getCellforQueNum(queNum).should("have.css", "background-color", color);
  };

  verifyResponseEntryByIndexOfSelectedRow = (data, questionNumber) => {
    if (Array.isArray(data)) this.getCellforQueNum(questionNumber).should("have.text", data.join(`,`));
    else this.getCellforQueNum(questionNumber).should("have.text", data);
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

  verifyScoreGridColor(studentName, studentAttempts) {
    this.getGridRowByStudent(studentName);

    Object.keys(studentAttempts).forEach(queNum => {
      const attemptType = studentAttempts[queNum];
      this.verifyCellColorForQuestion(queNum, attemptType);
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

  verifyScoreToggleButtonEnabled = value => {
    if (value) {
      this.getScoreToggleButton().should("have.class", "ant-switch-checked");
    } else {
      this.getScoreToggleButton().should("not.have.class", "ant-switch-checked");
    }
  };

  verifyResponseGrid = (attempt, questionTypeMap, studentName) => {
    this.getGridRowByStudent(studentName);
    const questionTableData = this.getQuestionTableResponseData({ attempt, questionTypeMap });
    Object.keys(questionTypeMap).forEach(questionNumber => {
      const { studentResponse } = questionTableData[questionNumber];
      this.verifyResponseEntryByIndexOfSelectedRow(studentResponse, questionNumber);
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

  verifyUpdateScore = (studentName, queNum, score, attemptType) => {
    let previousScore;
    this.routeAPIs();
    this.getGridRowByStudent(studentName);

    this.getScoreforQueNum(queNum)
      .then(ele => {
        previousScore = ele.text();
        cy.wrap(ele).click({ force: true });
        this.waitForStudentData();
        this.questionResponsePage.updateScoreAndFeedbackForStudent(studentName, score);
        this.clickOnExit(true);
        this.verifyCellColorForQuestion(queNum, attemptTypes.PARTIAL_CORRECT);
      })
      .then(() => {
        this.getScoreforQueNum(queNum)
          .should("have.text", score)
          .click({ force: true });
        console.log("previousScore ::", previousScore);
        this.questionResponsePage.updateScoreAndFeedbackForStudent(studentName, previousScore);
        this.clickOnExit(true);
        this.verifyCellColorForQuestion(queNum, attemptType);
      });
  };

  updateResponse = (questionType, attemptType, attemptData) => {
    // TODO: implement logic to reset previous attempt, currently should use question with no attempt
    cy.server();
    cy.route("PUT", "**/response-entry-and-score").as("responseEntry");
    this.attemptQuestion(questionType, attemptType, attemptData);
    cy.contains("span", "NEXT QUESTION").click();
    cy.wait("@responseEntry").then(xhr =>
      expect(xhr.status, `verify api requests for updating response for the question type - ${questionType}`).to.eq(200)
    );
  };

  verifyClassAndAssignmntId = (classId, assignmnetId) =>
    cy.url().should("include", `author/expressgrader/${assignmnetId}/${classId}`);

  // *** APPHELPERS END ***
}
