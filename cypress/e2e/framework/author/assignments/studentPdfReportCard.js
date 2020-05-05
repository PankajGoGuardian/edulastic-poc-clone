/* eslint-disable prefer-const */
import StandardBasedReportPage from "./standardBasedReportPage";
import { attemptTypes, questionTypeKey as queTypes, queColor } from "../../constants/questionTypes";
import { REPORT_HEADERS } from "../../constants/assignmentStatus";
import { getPerformanceBandAndColor, getMasteryStatus } from "../../constants/constantFunctions";

const { _ } = Cypress;

export default class StudentsReportCard {
  constructor() {
    this.standardBasedReportPage = new StandardBasedReportPage();
    this.tablerowalias = "selected-table-row";
  }

  /* GET ELEMENTS START */
  getReportContainerByStudent = studName => cy.get(`[data-cy="${studName}"]`).as("report-container-by-student-name");

  selectedReportContainer = () => cy.get("@report-container-by-student-name");

  getCheckBoxOptionByValue = value => cy.get(`[data-cy="${value}"]`);

  getStudentName = () => this.selectedReportContainer().find('[data-cy="report-student-name"]');

  getTestName = () => this.selectedReportContainer().find('[data-cy="report-test-name"]');

  getSubjects = () => this.selectedReportContainer().find('[data-cy="report-subject"]');

  getClassName = () => this.selectedReportContainer().find('[data-cy="report-class-name"]');

  getTestStartDate = () => this.selectedReportContainer().find('[data-cy="report-test-date"]');

  getOverallFeedBack = () => this.selectedReportContainer().find('[data-cy="report-feedback" ]');

  getOverallPerformance = () => this.selectedReportContainer().find('[data-cy="report-overall-performance"]');

  getOverallPerformanceScore = () => this.selectedReportContainer().find('[data-cy="report-score"]');

  getOverallPerformanceMaxScore = () => this.selectedReportContainer().find('[data-cy="report-max-score"]');

  getPerformanceBand = () => this.selectedReportContainer().find('[data-cy="report-performance-band"]');

  getQuestionTable = () => this.selectedReportContainer().find('[data-cy="report-question-table"]');

  getStandardTable = () => this.selectedReportContainer().find('[data-cy="report-standard-table"]');

  getQuestionTableHeader = () => this.getQuestionTable().find("thead");

  getStandardTableHeader = () => this.getStandardTable().find("thead");

  getQuestionTableBody = () => this.getQuestionTable().find("tbody");

  getStandardTableBody = () => this.getStandardTable().find("tbody");

  getQuestionTableHeaderElements = () => this.getQuestionTableHeader().find("th");

  getStandardTableHeaderElements = () => this.getStandardTableHeader().find("th");

  getQuestionTableRowByIndex = index => this.getQuestionTableBody().find(`[data-row-key="${index - 1}"]`);

  getStandardTableRowByStandard = standard =>
    this.getStandardTableBody()
      .find(`[data-cy="${standard}"]`)
      .closest("tr");

  getEntryByIndexOfSelectedRow = index =>
    cy
      .get(`@${this.tablerowalias}`)
      .find("td")
      .eq(index);

  getReportGenerateButton = () => cy.get('[data-cy="PRINT"]');

  /* GET ELEMENTS END */

  /* ACTIONS START */

  uncheckAllHeaderOptionsCheckBoxes = () => {
    [..._.values(REPORT_HEADERS.QEST_TABLE.optional), ..._.values(REPORT_HEADERS.STAND_TABLE.optional)].forEach(
      value => {
        this.getCheckBoxOptionByValue(value).uncheck({ force: true });
      }
    );
    this.getCheckBoxOptionByValue(REPORT_HEADERS.OVER_ALL_PERF).uncheck({ force: true });
  };

  checkOptionByValue = value => this.getCheckBoxOptionByValue(value).check({ force: true });

  navigateBacktolcb = () => {
    cy.server();
    cy.route("GET", "**/*/group/*/student/*/test-activity").as("load-lcb-page");
    cy.go("back");
    cy.wait("@load-lcb-page");
  };

  clickReportGeanerateButton = () => {
    cy.server();
    cy.route("GET", "**/test-activity/**").as("load-report");
    this.getReportGenerateButton()
      .parent()
      .invoke("removeAttr", "target")
      .click()
      .then(() => cy.wait("@load-report"));
  };

  /* ACTIONS END */

  /* APP HELPERS START */

  verifyTestName = testname => this.getTestName().should("have.text", testname);

  verifyStudentName = studentName => this.getStudentName().should("contain.text", studentName);

  verifySubject = subjects => this.getSubjects().should("have.text", subjects.join(", "));

  verifyClassName = className => this.getClassName().should("have.text", className);

  verifyTestDate = () =>
    this.getTestStartDate().should("contain.text", Cypress.moment(new Date()).format("MMM DD, YYYY"));

  verifyOverallPerfomanceScore = (score, maxScore, perf) => {
    this.getOverallPerformanceScore().should("have.text", ` ${_.round(parseFloat(score), 2)}`);
    this.getOverallPerformanceMaxScore().should("have.text", maxScore.toString());
    this.getOverallPerformance().should("have.text", `${_.round(perf.split("%")[0])}%`);
  };

  verifyPerformanceBand = perf => {
    const performance = parseInt(perf, 10);
    const { bgColor, performanceBand } = getPerformanceBandAndColor(performance);
    this.getPerformanceBand().should("have.text", performanceBand);
    this.getPerformanceBand().should("have.css", "color", bgColor);
  };

  verifyAttemptTypeInQuestionTable = attemptType => {
    const { evaluationClass, evaluationColor } = this.getEvaluationClassAndColor(attemptType);
    this.getEntryByIndexOfSelectedRow(0)
      .find("i")
      .should("have.class", evaluationClass)
      .should("have.css", "color", evaluationColor);
  };

  verifyStandardDomainOfselectedRow = standard => {
    this.getEntryByIndexOfSelectedRow(0)
      .invoke("text")
      .then(txt => {
        expect(standard.includes(txt), `expected standard domain is ${standard} and got ${txt}`).to.be.true;
      });
  };

  verifyEntryByIndexOfSelectedRow = (index, data, delimeter = ", ") => {
    if (Array.isArray(data)) this.getEntryByIndexOfSelectedRow(index).should("contain.text", data.join(`${delimeter}`));
    else this.getEntryByIndexOfSelectedRow(index).should("contain.text", data);
  };

  verifyQuestionTableHeaders = ({ questionHeaderOptions }) => {
    this.getQuestionTableHeaderElements().should("have.length", questionHeaderOptions.length);
    questionHeaderOptions.forEach((header, index) => {
      let text;
      switch (header) {
        case REPORT_HEADERS.QEST_TABLE.optional.score:
          text = "SCORE";
          break;
        case REPORT_HEADERS.QEST_TABLE.madatory.questionNo:
          text = "QUESTION";
          break;
        case REPORT_HEADERS.QEST_TABLE.madatory.maxScore:
          text = "MAX SCORE";
          break;
        case REPORT_HEADERS.QEST_TABLE.optional.studentResponse:
          text = "YOUR ANSWER";
          break;
        case REPORT_HEADERS.QEST_TABLE.optional.correctAnswer:
          text = "CORRECT ANSWER";
          break;
        default:
          assert.fail("question table headers did not match while verifying headers");
          break;
      }
      this.getQuestionTableHeaderElements()
        .eq(index)
        .should("contain", text);
    });
    return cy.wait(1);
  };

  verifyStandardTableHeaders = ({ standardHeaderOptions }) => {
    this.getStandardTableHeaderElements().should("have.length", standardHeaderOptions.length);
    standardHeaderOptions.forEach((header, index) => {
      let text;
      switch (header) {
        case REPORT_HEADERS.STAND_TABLE.madatory.standardDomain:
          text = "DOMAIN";
          break;
        case REPORT_HEADERS.STAND_TABLE.madatory.questions:
          text = "QUESTION";
          break;
        case REPORT_HEADERS.STAND_TABLE.madatory.score:
          text = "SCORE";
          break;
        case REPORT_HEADERS.STAND_TABLE.madatory.standard:
          text = "STANDARDS";
          break;
        case REPORT_HEADERS.STAND_TABLE.optional.masteryStatus:
          text = "MASTERY SUMMARY";
          break;
        case REPORT_HEADERS.STAND_TABLE.optional.standardPerf:
          text = "PERFORMANCE %";
          break;
        default:
          assert.fail("standard table headers did not match while verifying headers");
          break;
      }

      this.getStandardTableHeaderElements()
        .eq(index)
        .should("contain", text);
    });
    return cy.wait(1);
  };

  indexToOption = ind => String.fromCharCode(ind + 65);

  getQuestionTableData = ({ attempt, questionTypeMap }) => {
    const questinoWiseData = {};
    let TEI_AttemptTypes;
    TEI_AttemptTypes = { right: "Correct", wrong: "Incorrect", partialCorrect: "Partial Correct" };
    const TEI_CorrectAns = "TEI";
    const CR_Questions = "Constructed Response";
    const skippedResponse = "-";

    Object.keys(attempt).forEach((queNo, quesIndex) => {
      const attemptType = attempt[queNo];
      let { queKey, points, attemptData, correct, choices } = questionTypeMap[queNo];
      const score = this.standardBasedReportPage.questionResponsePage.getScoreByAttempt(
        attemptData,
        points,
        queKey.split(".")[0],
        attemptType
      );

      const percentage = _.round(score / points, 2) * 100;
      const queIndex = [quesIndex];
      const maxScore = [points];

      let studentResponseByAttempt;
      let studentResponse;
      let correctResponse;
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
          correct = Array.isArray(correct) ? correct : [correct];
          correctResponse = correct.map(ele => choices.indexOf(ele)).map(ind => this.indexToOption(ind));
          break;

        case queTypes.CLOZE_DROP_DOWN:
          studentResponseByAttempt = attemptData[attemptType];
          correctResponse = _.values(correct);
          studentResponse = attemptType === attemptTypes.SKIP ? skippedResponse : studentResponseByAttempt;
          break;

        case queTypes.CHOICE_MATRIX_STANDARD:
        case queTypes.CHOICE_MATRIX_LABEL:
        case queTypes.CHOICE_MATRIX_INLINE:
          studentResponse = attemptType === attemptTypes.SKIP ? skippedResponse : TEI_AttemptTypes[attemptType];
          correctResponse = TEI_CorrectAns;
          break;

        case queTypes.ESSAY_RICH:
          studentResponse = attemptType === attemptTypes.SKIP ? skippedResponse : CR_Questions;
          correctResponse = CR_Questions;
          break;
        default:
          assert.fail(1, 2, "Qusetion type does not match while calculating question table data");
          break;
      }

      questinoWiseData[`${queNo}`] = {
        queKey,
        queIndex,
        attemptType,
        studentResponse,
        correctResponse,
        score,
        maxScore,
        percentage
      };
    });
    return questinoWiseData;
  };

  getStandardTableData = ({ stuAttempt, questionTypeMap }) => {
    const standardTableDataByStudent = {};
    const standardBasedReport = this.standardBasedReportPage.getStandardPerformance(stuAttempt, questionTypeMap);
    _.keys(standardBasedReport).forEach(stand => {
      standardTableDataByStudent[`${stand}`] = standardBasedReport[stand].students[`${stuAttempt[0].stuName}`];
    });

    _.keys(standardTableDataByStudent).forEach(standard => {
      standardTableDataByStudent[`${standard}`].standard = standard;

      standardTableDataByStudent[`${standard}`].questions = [];
      _.keys(questionTypeMap).forEach(que => {
        if (questionTypeMap[que].standards[0].standard.indexOf(standard) !== -1)
          standardTableDataByStudent[`${standard}`].questions.push(que);
      });

      standardTableDataByStudent[`${standard}`].score = `${standardTableDataByStudent[standard].obtain}/${
        standardTableDataByStudent[standard].max
      }`;

      const perf =
        (standardTableDataByStudent[`${standard}`].obtain / standardTableDataByStudent[`${standard}`].max) * 100;

      standardTableDataByStudent[`${standard}`].standardPerf =
        perf % 1 !== 0 ? `${perf.toFixed(2)}%` : `${parseInt(perf, 10)}%`;

      standardTableDataByStudent[`${standard}`].masteryStatus = getMasteryStatus(perf);
    });
    return standardTableDataByStudent;
  };

  getEvaluationClassAndColor = attempttype => {
    const evaluationClass =
      attempttype === attemptTypes.RIGHT || attempttype === attemptTypes.PARTIAL_CORRECT
        ? "anticon-check"
        : "anticon-close";
    const evaluationColor =
      attempttype === attemptTypes.RIGHT
        ? queColor.PLAIN_GREEN
        : attempttype === attemptTypes.PARTIAL_CORRECT
        ? queColor.ORANGE
        : queColor.PLAIN_RED;
    return { evaluationClass, evaluationColor };
  };
  /* APP HELPERS END */
}
