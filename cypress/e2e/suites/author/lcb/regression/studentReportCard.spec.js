/* eslint-disable prefer-const */
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import { reportVerificationFunction } from "../../../../framework/author/assignments/pdfReportRunner";
import { REPORT_HEADERS, studentSide } from "../../../../framework/constants/assignmentStatus";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import StudentsReportCard from "../../../../framework/author/assignments/studentPdfReportCard";
import { questionTypeKey } from "../../../../framework/constants/questionTypes";
import FileHelper from "../../../../framework/util/fileHelper";

const testName = "STUDENT_REPORT_CARD";
const tests = require("../../../../../fixtures/testAuthoring");
const question = require("../../../../../fixtures/questionAuthoring");

let manualGradeItems = {};
let { itemKeys, name, subject } = tests[testName];
let allStandards = [];

itemKeys.forEach((item, ind) => {
  const [que, index] = item.split(".");
  const standardObj = question[que][index].standards[0];

  allStandards = Cypress._.union(allStandards, standardObj.standard);
  subject = Cypress._.union(subject, [standardObj.subject]);

  if (que === questionTypeKey.ESSAY_RICH) {
    manualGradeItems[`Q${ind + 1}`] = que;
  }
});

describe(`${FileHelper.getSpecName(Cypress.spec.name)}> student report card`, () => {
  const testLibraryPage = new TestLibrary();
  const studentTestPage = new StudentTestPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const studentReportsCardPage = new StudentsReportCard();
  const lcb = new LiveClassboardPage();

  const teacher = {
    name: "Teacher",
    username: "teacher.for.reportcard@snapwiz.com",
    password: "snapwiz"
  };
  const students = [
    {
      name: "student1",
      email: "student1.for.reportcard@snapwiz.com",
      pass: "snapwiz"
    },
    {
      name: "student2",
      email: "student2.for.reportcard@snapwiz.com",
      pass: "snapwiz"
    },
    {
      name: "student3",
      email: "student3.for.reportcard@snapwiz.com",
      pass: "snapwiz"
    }
  ];

  const attemptData = [
    {
      stuName: students[0].name,
      attempt: {
        Q1: "right",
        Q2: "right",
        Q3: "right",
        Q4: "right",
        Q5: "right",
        Q6: "right",
        Q7: "right",
        Q8: "right",
        Q9: "right",
        Q10: "right",
        Q11: "right"
      },
      status: "Submitted"
    },
    {
      stuName: students[1].name,
      attempt: {
        Q1: "wrong",
        Q2: "partialCorrect",
        Q3: "right",
        Q4: "right",
        Q5: "right",
        Q6: "right",
        Q7: "right",
        Q8: "skip",
        Q9: "partialCorrect",
        Q10: "partialCorrect",
        Q11: "wrong"
      },
      status: studentSide.SUBMITTED
    },
    {
      stuName: students[2].name,
      attempt: {
        Q1: "wrong",
        Q2: "partialCorrect",
        Q3: "wrong",
        Q4: "wrong",
        Q5: "partialCorrect",
        Q6: "skip",
        Q7: "wrong",
        Q8: "right",
        Q9: "wrong",
        Q10: "wrong",
        Q11: "right"
      },
      status: studentSide.SUBMITTED
    }
  ];

  const testDetails = {
    items: itemKeys,
    standards: allStandards,
    studentName: [students[0].name, students[1].name],
    testName: name,
    subjects: subject,
    className: "Class"
  };
  const questionTypeMap = {};
  const reportOptions = {
    overAllPerformanceBand: false,
    question: [],
    standard: []
  };

  lcb.getQuestionTypeMap(testDetails.items, question, questionTypeMap);

  before("> create test and assign", () => {
    cy.deleteAllAssignments("", teacher.username);
    cy.login("teacher", teacher.username, teacher.password);
    testLibraryPage.assignPage.visitAssignPageById("5ef34a8862d86e000823329e");
    testLibraryPage.assignPage.selectClass("Class");
    testLibraryPage.assignPage.clickOnAssign();
    //   // testLibraryPage.createTest(testName).then(id => {
    //   //   testDetails.testid = id;
    //   //   testLibraryPage.clickOnAssign();
    //   //   testLibraryPage.assignPage.selectClass("Class");
    //   //   testLibraryPage.assignPage.clickOnAssign();
    //   // });
  });

  before("> login as srudent ans attempt test", () => {
    students.forEach((st, index) => {
      const { attempt } = attemptData[index];
      studentTestPage.attemptAssignment(
        students[index].email,
        studentSide.SUBMITTED,
        attempt,
        questionTypeMap,
        students[index].pass
      );
    });
  });

  before("> manual grading", () => {
    cy.login("teacher", teacher.username, teacher.password);
    testLibraryPage.sidebar.clickOnAssignment();
    authorAssignmentPage.clcikOnPresenatationIconByIndex(0);

    Cypress._.keys(manualGradeItems).forEach(questNo => {
      lcb.clickonQuestionsTab();
      lcb.questionResponsePage.selectQuestion(questNo);
      students.forEach((student, studentindex) => {
        const score = lcb.questionResponsePage.getScoreByAttempt(
          questionTypeMap[questNo].attemptData,
          questionTypeMap[questNo].points,
          manualGradeItems[questNo],
          attemptData[studentindex].attempt[questNo]
        );

        lcb.questionResponsePage.getQuestionContainerByStudent(student.name).as("studentQuesCard");
        lcb.questionResponsePage.updateScoreAndFeedbackForStudent(student.name, score);
      });
    });
  });

  context("> with all check box checked(defualt)", () => {
    before("> set header options", () => {
      reportOptions.overAllPerformanceBand = true;
      reportOptions.question = Cypress._.values(REPORT_HEADERS.QEST_TABLE.optional);
      reportOptions.standard = Cypress._.values(REPORT_HEADERS.STAND_TABLE.optional);
    });
    before("> login as teacher and generate report", () => {
      testLibraryPage.sidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.header.clickStudentReportInDropDown();
      studentReportsCardPage.clickReportGeanerateButton();
    });

    reportVerificationFunction({ attemptData, testDetails, reportOptions, questionTypeMap });
  });

  context("> with performance band unchecked", () => {
    before("> set header options", () => {
      reportOptions.overAllPerformanceBand = false;
      reportOptions.question = Cypress._.values(REPORT_HEADERS.QEST_TABLE.optional);
      reportOptions.standard = Cypress._.values(REPORT_HEADERS.STAND_TABLE.optional);
    });
    before("> login as teacher and generate report", () => {
      studentReportsCardPage.navigateBacktolcb();
      lcb.header.clickStudentReportInDropDown();
      studentReportsCardPage.uncheckAllHeaderOptionsCheckBoxes();
      [...reportOptions.question, ...reportOptions.standard].forEach(value => {
        studentReportsCardPage.checkOptionByValue(value);
      });
      if (reportOptions.overAllPerformanceBand) studentReportsCardPage.checkOptionByValue(REPORT_HEADERS.OVER_ALL_PERF);
      studentReportsCardPage.clickReportGeanerateButton();
    });

    reportVerificationFunction({ attemptData: attemptData.slice(0, 1), testDetails, reportOptions, questionTypeMap });
  });

  context("> with question performance unchecked", () => {
    before("> set header options", () => {
      reportOptions.overAllPerformanceBand = true;
      reportOptions.question = [
        REPORT_HEADERS.QEST_TABLE.optional.studentResponse,
        REPORT_HEADERS.QEST_TABLE.optional.correctAnswer
      ];
      reportOptions.standard = Cypress._.values(REPORT_HEADERS.STAND_TABLE.optional);
    });
    before("> login as teacher and generate report", () => {
      studentReportsCardPage.navigateBacktolcb();
      lcb.header.clickStudentReportInDropDown();
      studentReportsCardPage.uncheckAllHeaderOptionsCheckBoxes();
      [...reportOptions.question, ...reportOptions.standard].forEach(value => {
        studentReportsCardPage.checkOptionByValue(value);
      });
      if (reportOptions.overAllPerformanceBand) studentReportsCardPage.checkOptionByValue(REPORT_HEADERS.OVER_ALL_PERF);
      studentReportsCardPage.clickReportGeanerateButton();
    });

    reportVerificationFunction({ attemptData: attemptData.slice(0, 1), testDetails, reportOptions, questionTypeMap });
  });

  context("> with correct ans unchecked", () => {
    before("> set header options", () => {
      reportOptions.overAllPerformanceBand = true;
      reportOptions.question = [
        REPORT_HEADERS.QEST_TABLE.optional.score,
        REPORT_HEADERS.QEST_TABLE.optional.studentResponse
      ];
      reportOptions.standard = Cypress._.values(REPORT_HEADERS.STAND_TABLE.optional);
    });
    before("> login as teacher and generate report", () => {
      studentReportsCardPage.navigateBacktolcb();
      lcb.header.clickStudentReportInDropDown();
      studentReportsCardPage.uncheckAllHeaderOptionsCheckBoxes();
      [...reportOptions.question, ...reportOptions.standard].forEach(value => {
        studentReportsCardPage.checkOptionByValue(value);
      });
      if (reportOptions.overAllPerformanceBand) studentReportsCardPage.checkOptionByValue(REPORT_HEADERS.OVER_ALL_PERF);
      studentReportsCardPage.clickReportGeanerateButton();
    });

    reportVerificationFunction({ attemptData: attemptData.slice(0, 1), testDetails, reportOptions, questionTypeMap });
  });

  context("> with student response unchecked", () => {
    before("> set header options", () => {
      reportOptions.overAllPerformanceBand = true;
      reportOptions.question = [
        REPORT_HEADERS.QEST_TABLE.optional.score,
        REPORT_HEADERS.QEST_TABLE.optional.correctAnswer
      ];
      reportOptions.standard = Cypress._.values(REPORT_HEADERS.STAND_TABLE.optional);
    });
    before("> login as teacher and generate report", () => {
      studentReportsCardPage.navigateBacktolcb();
      lcb.header.clickStudentReportInDropDown();
      studentReportsCardPage.uncheckAllHeaderOptionsCheckBoxes();
      [...reportOptions.question, ...reportOptions.standard].forEach(value => {
        studentReportsCardPage.checkOptionByValue(value);
      });
      if (reportOptions.overAllPerformanceBand) studentReportsCardPage.checkOptionByValue(REPORT_HEADERS.OVER_ALL_PERF);
      studentReportsCardPage.clickReportGeanerateButton();
    });

    reportVerificationFunction({ attemptData: attemptData.slice(0, 1), testDetails, reportOptions, questionTypeMap });
  });

  context("> with mastery status unchecked", () => {
    before("> set header options", () => {
      reportOptions.overAllPerformanceBand = true;
      reportOptions.standard = [REPORT_HEADERS.STAND_TABLE.optional.standardPerf];
      reportOptions.question = Cypress._.values(REPORT_HEADERS.QEST_TABLE.optional);
    });
    before("> login as teacher and generate report", () => {
      studentReportsCardPage.navigateBacktolcb();
      lcb.header.clickStudentReportInDropDown();
      studentReportsCardPage.uncheckAllHeaderOptionsCheckBoxes();
      [...reportOptions.question, ...reportOptions.standard].forEach(value => {
        studentReportsCardPage.checkOptionByValue(value);
      });
      if (reportOptions.overAllPerformanceBand) studentReportsCardPage.checkOptionByValue(REPORT_HEADERS.OVER_ALL_PERF);
      studentReportsCardPage.clickReportGeanerateButton();
    });

    reportVerificationFunction({ attemptData: attemptData.slice(0, 1), testDetails, reportOptions, questionTypeMap });
  });

  context("> with standard performance unchecked", () => {
    before("> set header options", () => {
      reportOptions.overAllPerformanceBand = true;
      reportOptions.standard = [REPORT_HEADERS.STAND_TABLE.optional.masteryStatus];
      reportOptions.question = Cypress._.values(REPORT_HEADERS.QEST_TABLE.optional);
    });
    before("> login as teacher and generate report", () => {
      studentReportsCardPage.navigateBacktolcb();
      lcb.header.clickStudentReportInDropDown();
      studentReportsCardPage.uncheckAllHeaderOptionsCheckBoxes();
      [...reportOptions.question, ...reportOptions.standard].forEach(value => {
        studentReportsCardPage.checkOptionByValue(value);
      });
      if (reportOptions.overAllPerformanceBand) studentReportsCardPage.checkOptionByValue(REPORT_HEADERS.OVER_ALL_PERF);
      studentReportsCardPage.clickReportGeanerateButton();
    });

    reportVerificationFunction({ attemptData: attemptData.slice(0, 1), testDetails, reportOptions, questionTypeMap });
  });

  context("> with custom checks-1", () => {
    before("> set header options", () => {
      reportOptions.overAllPerformanceBand = false;
      reportOptions.standard = [REPORT_HEADERS.STAND_TABLE.optional.masteryStatus];
      reportOptions.question = [REPORT_HEADERS.QEST_TABLE.optional.score];
    });
    before("> login as teacher and generate report", () => {
      studentReportsCardPage.navigateBacktolcb();
      lcb.header.clickStudentReportInDropDown();
      studentReportsCardPage.uncheckAllHeaderOptionsCheckBoxes();
      [...reportOptions.question, ...reportOptions.standard].forEach(value => {
        studentReportsCardPage.checkOptionByValue(value);
      });
      if (reportOptions.overAllPerformanceBand) studentReportsCardPage.checkOptionByValue(REPORT_HEADERS.OVER_ALL_PERF);
      studentReportsCardPage.clickReportGeanerateButton();
    });

    reportVerificationFunction({ attemptData: attemptData.slice(0, 1), testDetails, reportOptions, questionTypeMap });
  });

  context("> with custom checks-2", () => {
    before("> set header options", () => {
      reportOptions.overAllPerformanceBand = true;
      reportOptions.standard = [REPORT_HEADERS.STAND_TABLE.optional.standardPerf];
      reportOptions.question = [
        REPORT_HEADERS.QEST_TABLE.optional.score,
        REPORT_HEADERS.QEST_TABLE.optional.studentResponse
      ];
    });
    before("> login as teacher and generate report", () => {
      studentReportsCardPage.navigateBacktolcb();
      lcb.header.clickStudentReportInDropDown();
      studentReportsCardPage.uncheckAllHeaderOptionsCheckBoxes();
      [...reportOptions.question, ...reportOptions.standard].forEach(value => {
        studentReportsCardPage.checkOptionByValue(value);
      });
      if (reportOptions.overAllPerformanceBand) studentReportsCardPage.checkOptionByValue(REPORT_HEADERS.OVER_ALL_PERF);
      studentReportsCardPage.clickReportGeanerateButton();
    });

    reportVerificationFunction({ attemptData: attemptData.slice(0, 1), testDetails, reportOptions, questionTypeMap });
  });

  context(">redirect", () => {
    before(">", () => {
      attemptData[1].attempt = attemptData[0].attempt;
    });
    before(">redirect the student2", () => {
      studentReportsCardPage.navigateBacktolcb();
      lcb.clickOnCardViewTab();
      lcb.selectCheckBoxByStudentName(students[1].name);
      lcb.clickOnRedirect();
      lcb.clickOnRedirectSubmit();
    });
    before("> login as student2 and attempt test", () => {
      const { attempt } = attemptData[1];
      studentTestPage.attemptAssignment(
        students[1].email,
        studentSide.SUBMITTED,
        attempt,
        questionTypeMap,
        students[1].pass
      );
    });
    before("> manual grading", () => {
      cy.login("teacher", teacher.username, teacher.password);
      testLibraryPage.sidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);

      Cypress._.keys(manualGradeItems).forEach((questNo, ind) => {
        const score = lcb.questionResponsePage.getScoreByAttempt(
          questionTypeMap[questNo].attemptData,
          questionTypeMap[questNo].points,
          manualGradeItems[questNo],
          attemptData[1].attempt[questNo]
        );

        lcb.clickonQuestionsTab();
        lcb.questionResponsePage.selectQuestion(questNo);

        lcb.questionResponsePage.getQuestionContainerByStudent(students[1].name).as("studentQuesCard");
        lcb.questionResponsePage.updateScoreAndFeedbackForStudent(students[1].name, score);
      });
    });

    before("> login as teacher and generate report", () => {
      testLibraryPage.sidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.header.clickStudentReportInDropDown();
      reportOptions.overAllPerformanceBand = true;
      reportOptions.question = Cypress._.values(REPORT_HEADERS.QEST_TABLE.optional);
      reportOptions.standard = Cypress._.values(REPORT_HEADERS.STAND_TABLE.optional);
      studentReportsCardPage.clickReportGeanerateButton();
    });

    reportVerificationFunction({ attemptData: attemptData.slice(1, 2), testDetails, reportOptions, questionTypeMap });
  });
});
