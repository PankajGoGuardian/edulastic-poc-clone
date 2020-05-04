/* eslint-disable no-loop-func */
import StudentsReportCard from "./studentPdfReportCard";
import LiveClassboardPage from "./LiveClassboardPage";
import { REPORT_HEADERS } from "../../constants/assignmentStatus";

const studentReportsCardPage = new StudentsReportCard();
const lcb = new LiveClassboardPage();
const { _ } = Cypress;

let standardHeaderOptions = [];
let questionHeaderOptions = [];

const statsMap = [];
const standardTableData = {};
const questionTableData = {};

let updatedheaders;

export function reportVerificationFunction({ attemptData, testDetails, reportOptions, questionTypeMap }) {
  before("> calculation of table data and resequencing headers", () => {
    attemptData.forEach(studentAttemptData => {
      const { attempt, stuName } = studentAttemptData;
      const stuAttempt = [studentAttemptData];

      statsMap[stuName] = lcb.getScoreAndPerformance(attempt, questionTypeMap);
      standardTableData[stuName] = studentReportsCardPage.getStandardTableData({ stuAttempt, questionTypeMap });
      questionTableData[stuName] = studentReportsCardPage.getQuestionTableData({ attempt, questionTypeMap });
    });

    questionHeaderOptions = [];
    standardHeaderOptions = [];
    updatedheaders = [];

    REPORT_HEADERS.QEST_TABLE.allowedSequence.forEach(allowed => {
      if ([..._.values(REPORT_HEADERS.QEST_TABLE.madatory), ...reportOptions.question].indexOf(allowed) !== -1)
        questionHeaderOptions.push(allowed);
    });
    if (reportOptions.question.indexOf(REPORT_HEADERS.QEST_TABLE.optional.score) === -1)
      questionHeaderOptions = questionHeaderOptions.filter(val => val !== REPORT_HEADERS.QEST_TABLE.madatory.maxScore);

    REPORT_HEADERS.STAND_TABLE.allowedSequence.forEach(allowed => {
      if ([..._.values(REPORT_HEADERS.STAND_TABLE.madatory), ...reportOptions.standard].indexOf(allowed) !== -1)
        standardHeaderOptions.push(allowed);
    });
    if (reportOptions.standard.indexOf(REPORT_HEADERS.STAND_TABLE.optional.standardPerf) === -1)
      standardHeaderOptions = standardHeaderOptions.filter(val => val !== REPORT_HEADERS.STAND_TABLE.madatory.score);
  });

  attemptData.forEach(attempt => {
    context(`> verify reports for '${attempt.stuName}'`, () => {
      beforeEach("> select student", () => {
        studentReportsCardPage.getReportContainerByStudent(attempt.stuName);
      });

      it("> verify test details and student name", () => {
        studentReportsCardPage.verifyStudentName(attempt.stuName);
        studentReportsCardPage.verifyTestDate();
        studentReportsCardPage.verifyTestName(testDetails.testName);
        studentReportsCardPage.verifySubject(testDetails.subjects);
        studentReportsCardPage.verifyClassName(testDetails.className);
      });

      it("> verify performance and performance band", () => {
        studentReportsCardPage.verifyOverallPerfomanceScore(
          statsMap[attempt.stuName].totalScore,
          statsMap[attempt.stuName].maxScore,
          statsMap[attempt.stuName].perf
        );
        if (reportOptions.overAllPerformanceBand)
          studentReportsCardPage.verifyPerformanceBand(statsMap[attempt.stuName].perf);
        else studentReportsCardPage.getPerformanceBand().should("not.exist");
      });

      context("> verify question table question wise", () => {
        before("> verify table headers", () => {
          studentReportsCardPage.getReportContainerByStudent(attempt.stuName);
          updatedheaders = questionHeaderOptions.slice();
          studentReportsCardPage.verifyQuestionTableHeaders({ questionHeaderOptions }).then(() => {
            updatedheaders.shift();
          });
        });

        testDetails.items.forEach((item, row) => {
          it(`> for question no: ${row + 1}, question type is ${item.split(".")[0]}`, () => {
            const rowdata = questionTableData[attempt.stuName][`Q${row + 1}`];
            studentReportsCardPage.getQuestionTableRowByIndex(row + 1).as(`${studentReportsCardPage.tablerowalias}`);
            studentReportsCardPage.verifyAttemptTypeInQuestionTable(rowdata.attemptType);
            updatedheaders.forEach((header, ind) => {
              studentReportsCardPage.verifyEntryByIndexOfSelectedRow(ind + 1, rowdata[header]);
            });
          });
        });
      });

      context("> verify standard table standard wise", () => {
        before("> verify table headers", () => {
          studentReportsCardPage.getReportContainerByStudent(attempt.stuName);
          updatedheaders = standardHeaderOptions.slice();
          studentReportsCardPage.verifyStandardTableHeaders({ standardHeaderOptions: updatedheaders }).then(() => {
            updatedheaders.shift();
          });
        });

        testDetails.standards.forEach((standard, row) => {
          it(`> for standard no: ${row + 1}, standard is ${standard}`, () => {
            const rowdata = standardTableData[attempt.stuName][standard];
            studentReportsCardPage
              .getStandardTableRowByStandard(standard)
              .as(`${studentReportsCardPage.tablerowalias}`);
            studentReportsCardPage.verifyStandardDomainOfselectedRow(standard);
            updatedheaders.forEach((header, ind) => {
              studentReportsCardPage.verifyEntryByIndexOfSelectedRow(ind + 1, rowdata[header]);
            });
          });
        });
      });
    });
  });
}
