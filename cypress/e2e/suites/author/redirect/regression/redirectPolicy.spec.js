import FileHelper from "../../../../framework/util/fileHelper";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import {
  studentSide,
  redirectType,
  questionDeliveryType,
  teacherSide
} from "../../../../framework/constants/assignmentStatus";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TeacherSideBar from "../../../../framework/author/SideBarPage";

const { _ } = Cypress;
const { LCB_3 } = require("../../../../../fixtures/testAuthoring");
const questionData = require("../../../../../fixtures/questionAuthoring");

const test = new StudentTestPage();
const lcb = new LiveClassboardPage();
const authorAssignmentPage = new AuthorAssignmentPage();
const testLibrary = new TestLibrary();
const teacherSidebar = new TeacherSideBar();
const studentTestPage = new StudentTestPage();
const students = {
  1: {
    email: "student1.regression.automation@snapwiz.com",
    stuName: "1, student1"
  },
  2: {
    email: "student2.regression.automation@snapwiz.com",
    stuName: "regression, student2"
  },
  3: {
    email: "student3.regression.automation@snapwiz.com",
    stuName: "regression, student3"
  },
  4: {
    email: "student4.regression.automation@snapwiz.com",
    stuName: "regression, student4"
  },
  5: {
    email: "student5.regression.automation@snapwiz.com",
    stuName: "regression, student5"
  },
  6: {
    email: "student6.regression.automation@snapwiz.com",
    stuName: "regression, student6"
  },
  7: {
    email: "student7.regression.automation@snapwiz.com",
    stuName: "regression, student7"
  }
};

const allWrong = { Q1: "wrong", Q2: "wrong", Q3: "wrong" };
const allRight = { Q1: "right", Q2: "right", Q3: "right" };
const noattempt = lcb.getNullifiedAttempts(allWrong);

const teacherFeedback = "You need to work hard";
const queList = _.keys(allRight);

const redirectTestData = {
  className: "Regression Automation Class",
  teacher: "teacher1.regression.automation@snapwiz.com",
  student: students[1].email,
  password: "automation",
  assignmentName: "New Assessment LCB",
  attemptsData: [
    {
      attempt: { ...allRight },
      status: studentSide.GRADED,
      ...students[1]
    },
    {
      attempt: { ...allWrong },
      status: studentSide.GRADED,
      ...students[2]
    },
    {
      attempt: { ...allWrong },
      status: studentSide.GRADED,
      ...students[3]
    },
    {
      attempt: { ...allWrong },
      status: studentSide.GRADED,
      ...students[4]
    },
    {
      attempt: { Q1: "right", Q2: "skip", Q3: "wrong" },
      status: studentSide.GRADED,
      ...students[5]
    },
    {
      attempt: { Q1: "wrong", Q2: "skip", Q3: "skip" },
      status: studentSide.IN_PROGRESS,
      ...students[6]
    },
    {
      attempt: { Q1: "noattempt", Q2: "noattempt", Q3: "noattempt" },
      status: studentSide.NOT_STARTED,
      ...students[7]
    }
  ],
  redirect1: {
    attempt: { ...allWrong },
    status: studentSide.GRADED,
    ...students[1]
  },
  redirect2: {
    attempt: { ...allRight },
    status: studentSide.GRADED,
    ...students[2]
  },
  redirect3: {
    attempt: { ...allRight },
    status: studentSide.GRADED,
    ...students[3]
  },
  redirect4: {
    attempt: { ...allRight },
    status: studentSide.GRADED,
    ...students[5]
  },
  redirect5: {
    attempt: { ...allRight },
    status: studentSide.GRADED,
    ...students[7]
  }
};

const submittedStudents = redirectTestData.attemptsData
  .filter(({ status }) => status === studentSide.GRADED)
  .map(item => ({ stuName: item.stuName, email: item.email }));

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Redirect`, () => {
  const { attemptsData, student, teacher, className, password } = redirectTestData;
  const statsMap = {};
  const { itemKeys } = LCB_3;
  let questionTypeMap = {};
  let testId;

  before(" > create new assessment and assign", () => {
    questionTypeMap = lcb.getQuestionTypeMap(itemKeys, questionData, questionTypeMap);
    cy.deleteAllAssignments(student, teacher, password);
    cy.login("teacher", teacher, password);

    testLibrary.createTest("LCB_3").then(id => {
      testId = id;
      testLibrary.clickOnAssign();
      testLibrary.assignPage.selectClass(className);
      testLibrary.assignPage.clickOnAssign();
    });
  });

  before(" > attempt by all students", () => {
    attemptsData.forEach(attempts => {
      const { attempt, email, stuName, status } = attempts;
      statsMap[stuName] = lcb.getScoreAndPerformance(attempt, questionTypeMap);
      statsMap[stuName].attempt = attempt;
      statsMap[stuName].status = status;
      test.attemptAssignment(email, status, attempt, questionTypeMap, password);
    });
  });

  before("login as teacher and add feedback for all student", () => {
    cy.login("teacher", teacher, password);
    teacherSidebar.clickOnAssignment();
    authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
    cy.contains(className);
    lcb.clickonQuestionsTab();
    queList.forEach(queNum => {
      lcb.questionResponsePage.selectQuestion(queNum);
      submittedStudents.forEach(({ stuName: stu }) =>
        lcb.questionResponsePage.updateScoreAndFeedbackForStudent(stu, undefined, teacherFeedback)
      );
    });
  });

  describe(`redirect with default setting - ${redirectType.FEEDBACK_ONLY}-${questionDeliveryType.All}`, () => {
    const { stuName, email, attempt } = redirectTestData.redirect1;

    before("login as teacher", () => {
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      cy.contains(className);
    });

    it(" > redirect the student and verify card view", () => {
      lcb.selectCheckBoxByStudentName(stuName);
      lcb.clickOnRedirect();
      lcb.verifyStudentsOnRedirectPopUp(email);
      lcb.clickOnRedirectSubmit();
      const { score, perf } = lcb.getScoreAndPerformance(noattempt, questionTypeMap);
      lcb.verifyStudentCard(stuName, teacherSide.REDIRECTED, score, perf, noattempt);
      lcb.verifyRedirectIcon(stuName);
    });

    it(` > verify student centric view for - ${stuName}-should be disabled`, () => {
      lcb.clickOnStudentsTab();
      lcb.verifyStudentCentricCard(stuName, undefined, undefined, false);
    });

    it(` > verify question centric view, should not have student card`, () => {
      lcb.clickonQuestionsTab();
      queList.forEach(queNum => {
        lcb.questionResponsePage.selectQuestion(queNum);
        lcb.questionResponsePage.verifyNoQuestionResponseCard(stuName);
      });
    });

    it(" > attempt by redirected students and verify feedback is shown", () => {
      cy.login("student", email, password);
      studentTestPage.assignmentPage.clickOnAssignmentButton();
      Object.keys(attempt).forEach(queNum => {
        const [queType] = questionTypeMap[queNum].queKey.split(".");
        const { attemptData } = questionTypeMap[queNum];
        studentTestPage.verifyFeedback(teacherFeedback);
        studentTestPage.attemptQuestion(queType, attempt[queNum], attemptData);
        studentTestPage.clickOnNext();
      });
      studentTestPage.submitTest();
    });

    it(` > verify student centric view after attempt`, () => {
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      cy.contains(className);
      lcb.clickOnStudentsTab();
      // verify current attempt
      lcb.verifyStudentCentricCard(stuName, attempt, questionTypeMap, true);
      // verify scores and improvement of current attempt
      const { totalScore, maxScore } = lcb.getScoreAndPerformance(attempt, questionTypeMap);
      lcb.questionResponsePage.verifyTotalScoreAndImprovement(totalScore, maxScore, "-7");
      // verify previous attempt
      lcb.questionResponsePage.selectAttempt(1);
      lcb.verifyStudentCentricCard(stuName, allRight, questionTypeMap, true);
      // verify scores and improvement of previous attempt
      lcb.questionResponsePage.verifyTotalScoreAndImprovement(
        statsMap[stuName].totalScore,
        statsMap[stuName].maxScore,
        false
      );
    });

    it(` > verify question centric view after attempt`, () => {
      lcb.clickonQuestionsTab();
      _.keys(attempt).forEach(queNum => {
        lcb.questionResponsePage.selectQuestion(queNum);
        const { queKey, attemptData, points } = questionTypeMap[queNum];
        lcb.questionResponsePage.verifyQuestionResponseCard(
          points,
          queKey,
          attempt[queNum],
          attemptData,
          false,
          stuName
        );
      });
    });

    it(` > double redirect and verify student,question centric view after 3 attempt`, () => {
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      cy.contains(className);
      lcb.selectCheckBoxByStudentName(stuName);
      lcb.clickOnRedirect();
      lcb.clickOnRedirectSubmit();
      cy.login("student", email, password);
      studentTestPage.assignmentPage.clickOnAssignmentButton();
      Object.keys(allRight).forEach(queNum => {
        const [queType] = questionTypeMap[queNum].queKey.split(".");
        const { attemptData } = questionTypeMap[queNum];
        studentTestPage.attemptQuestion(queType, allRight[queNum], attemptData);
        studentTestPage.clickOnNext();
      });
      studentTestPage.submitTest();

      // student centric
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      cy.contains(className);
      lcb.clickOnStudentsTab();

      // verify current attempt 3
      lcb.verifyStudentCentricCard(stuName, allRight, questionTypeMap, true);
      // verify scores and improvement of current attempt 3
      const { totalScore, maxScore } = lcb.getScoreAndPerformance(allRight, questionTypeMap);
      lcb.questionResponsePage.verifyTotalScoreAndImprovement(totalScore, maxScore, "+7");

      // verify previous attempt 2
      lcb.questionResponsePage.selectAttempt(2);
      lcb.verifyStudentCentricCard(stuName, allWrong, questionTypeMap, true);
      // verify scores and improvement of previous attempt 2
      const attempt2 = lcb.getScoreAndPerformance(allWrong, questionTypeMap);
      lcb.questionResponsePage.verifyTotalScoreAndImprovement(attempt2.totalScore, attempt2.maxScore, "-7");

      // verify previous attempt 1
      lcb.questionResponsePage.selectAttempt(1);
      lcb.verifyStudentCentricCard(stuName, allRight, questionTypeMap, true);
      // verify scores and improvement of previous attempt 1
      lcb.questionResponsePage.verifyTotalScoreAndImprovement(totalScore, maxScore, false);

      // quetion centric should have  attempt 3
      lcb.clickonQuestionsTab();
      _.keys(allRight).forEach(queNum => {
        lcb.questionResponsePage.selectQuestion(queNum);
        const { queKey, attemptData, points } = questionTypeMap[queNum];
        lcb.questionResponsePage.verifyQuestionResponseCard(
          points,
          queKey,
          allRight[queNum],
          attemptData,
          false,
          stuName
        );
      });
    });
  });

  describe(`redirect with setting - ${redirectType.SCORE_AND_FEEDBACK}`, () => {
    const { stuName, email, attempt } = redirectTestData.redirect2;

    before("login as teacher", () => {
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      cy.contains(className);
    });

    it(" > redirect the student and verify card view", () => {
      lcb.selectCheckBoxByStudentName(stuName);
      lcb.clickOnRedirect();
      lcb.verifyStudentsOnRedirectPopUp(email);

      // select redirect policy
      lcb.redirectPopup.selectRedirectPolicy(redirectType.SCORE_AND_FEEDBACK);
      lcb.clickOnRedirectSubmit();
      const { score, perf } = lcb.getScoreAndPerformance(noattempt, questionTypeMap);
      lcb.verifyStudentCard(stuName, teacherSide.REDIRECTED, score, perf, noattempt);
      lcb.verifyRedirectIcon(stuName);
    });

    it(` > verify student centric view for - ${stuName}-should be disabled`, () => {
      lcb.clickOnStudentsTab();
      lcb.verifyStudentCentricCard(stuName, undefined, undefined, false);
    });

    it(` > verify question centric view, should not have student card`, () => {
      lcb.clickonQuestionsTab();
      queList.forEach(queNum => {
        lcb.questionResponsePage.selectQuestion(queNum);
        lcb.questionResponsePage.verifyNoQuestionResponseCard(stuName);
      });
    });

    it(" > attempt by redirected students and verify feedback,score is shown", () => {
      cy.login("student", email, password);
      studentTestPage.assignmentPage.clickOnAssignmentButton();
      Object.keys(attempt).forEach(queNum => {
        const [queType] = questionTypeMap[queNum].queKey.split(".");
        const { attemptData, points } = questionTypeMap[queNum];

        const score = lcb.questionResponsePage.getScoreByAttempt(attemptData, points, queType, allWrong[queNum]);
        // verify score
        studentTestPage.verifyScore(score, points);
        // verify feedback
        studentTestPage.verifyFeedback(teacherFeedback);

        studentTestPage.attemptQuestion(queType, attempt[queNum], attemptData);
        studentTestPage.clickOnNext();
      });
      studentTestPage.submitTest();
    });

    it(` > verify student centric view after attempt`, () => {
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      cy.contains(className);
      lcb.clickOnStudentsTab();
      // verify current attempt
      lcb.verifyStudentCentricCard(stuName, attempt, questionTypeMap, true);
      // verify scores and improvement of current attempt
      const { totalScore, maxScore } = lcb.getScoreAndPerformance(attempt, questionTypeMap);
      lcb.questionResponsePage.verifyTotalScoreAndImprovement(totalScore, maxScore, "+7");

      // verify previous attempt
      lcb.questionResponsePage.selectAttempt(1);
      lcb.verifyStudentCentricCard(stuName, allWrong, questionTypeMap, true);
      // verify scores and improvement of previous attempt
      lcb.questionResponsePage.verifyTotalScoreAndImprovement(
        statsMap[stuName].totalScore,
        statsMap[stuName].maxScore,
        false
      );
    });

    it(` > verify question centric view after attempt`, () => {
      lcb.clickonQuestionsTab();
      _.keys(attempt).forEach(queNum => {
        lcb.questionResponsePage.selectQuestion(queNum);
        const { queKey, attemptData, points } = questionTypeMap[queNum];
        lcb.questionResponsePage.verifyQuestionResponseCard(
          points,
          queKey,
          attempt[queNum],
          attemptData,
          false,
          stuName
        );
      });
    });
  });

  describe(`redirect with setting - ${redirectType.STUDENT_RESPONSE_AND_FEEDBACK}`, () => {
    const { stuName, email, attempt } = redirectTestData.redirect3;

    before("login as teacher", () => {
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      cy.contains(className);
    });

    it(" > redirect the student and verify card view", () => {
      lcb.selectCheckBoxByStudentName(stuName);
      lcb.clickOnRedirect();
      lcb.verifyStudentsOnRedirectPopUp(email);

      // select redirect policy
      lcb.redirectPopup.selectRedirectPolicy(redirectType.STUDENT_RESPONSE_AND_FEEDBACK);
      lcb.clickOnRedirectSubmit();

      const { score, perf } = lcb.getScoreAndPerformance(noattempt, questionTypeMap);
      lcb.verifyStudentCard(stuName, teacherSide.REDIRECTED, score, perf, noattempt);
      lcb.verifyRedirectIcon(stuName);
    });

    it(` > verify student centric view for - ${stuName}-should be disabled`, () => {
      lcb.clickOnStudentsTab();
      lcb.verifyStudentCentricCard(stuName, undefined, undefined, false);
    });

    it(` > verify question centric view, should not have student card`, () => {
      lcb.clickonQuestionsTab();
      queList.forEach(queNum => {
        lcb.questionResponsePage.selectQuestion(queNum);
        lcb.questionResponsePage.verifyNoQuestionResponseCard(stuName);
      });
    });

    it(" > attempt by redirected students and verify feedback,response,score is shown", () => {
      cy.login("student", email, password);
      studentTestPage.assignmentPage.clickOnAssignmentButton();
      Object.keys(attempt).forEach(queNum => {
        const [queType] = questionTypeMap[queNum].queKey.split(".");
        const { attemptData, points } = questionTypeMap[queNum];
        // verify evaluation message
        studentTestPage.verifyResponseEvaluation(allWrong[queNum]).click({ force: true });
        // verify that previous response was retained and score
        studentTestPage.report.verifyQuestionResponseCard(points, queType, allWrong[queNum], attemptData, false);
        // verify feedback
        studentTestPage.verifyFeedback(teacherFeedback);
        studentTestPage.attemptQuestion(queType, attempt[queNum], attemptData);
        studentTestPage.clickOnNext();
      });
      studentTestPage.submitTest();
    });

    it(` > verify student centric view after attempt`, () => {
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      cy.contains(className);
      lcb.clickOnStudentsTab();

      // verify current attempt
      lcb.verifyStudentCentricCard(stuName, attempt, questionTypeMap, true);
      // verify scores and improvement of current attempt
      const { totalScore, maxScore } = lcb.getScoreAndPerformance(attempt, questionTypeMap);
      lcb.questionResponsePage.verifyTotalScoreAndImprovement(totalScore, maxScore, "+7");

      // verify previous attempt
      lcb.questionResponsePage.selectAttempt(1);
      lcb.verifyStudentCentricCard(stuName, allWrong, questionTypeMap, true);
      // verify scores and improvement of previous attempt
      lcb.questionResponsePage.verifyTotalScoreAndImprovement(
        statsMap[stuName].totalScore,
        statsMap[stuName].maxScore,
        false
      );
    });

    it(` > verify question centric view after attempt`, () => {
      lcb.clickonQuestionsTab();
      _.keys(attempt).forEach(queNum => {
        lcb.questionResponsePage.selectQuestion(queNum);
        const { queKey, attemptData, points } = questionTypeMap[queNum];
        lcb.questionResponsePage.verifyQuestionResponseCard(
          points,
          queKey,
          attempt[queNum],
          attemptData,
          false,
          stuName
        );
      });
    });
  });

  describe(`redirect with setting - ${redirectType.FEEDBACK_ONLY}-${questionDeliveryType.SKIPPED_AND_WRONG}`, () => {
    const { stuName, email, attempt } = redirectTestData.redirect4;
    const currentAttempt = { Q2: "right", Q3: "right" };

    before("login as teacher", () => {
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      cy.contains(className);
    });

    it(" > redirect the student and verify card view", () => {
      lcb.selectCheckBoxByStudentName(stuName);
      lcb.clickOnRedirect();
      lcb.verifyStudentsOnRedirectPopUp(email);

      // select redirect policy
      lcb.redirectPopup.selectQuestionDelivey(questionDeliveryType.SKIPPED_AND_WRONG);
      lcb.redirectPopup.selectRedirectPolicy(redirectType.FEEDBACK_ONLY);
      lcb.clickOnRedirectSubmit();

      const { score, perf } = lcb.getScoreAndPerformance(noattempt, questionTypeMap);
      lcb.verifyStudentCard(stuName, teacherSide.REDIRECTED, score, perf, noattempt);
      lcb.verifyRedirectIcon(stuName);
    });

    it(` > verify student centric view for - ${stuName}-should be disabled`, () => {
      lcb.clickOnStudentsTab();
      lcb.verifyStudentCentricCard(stuName, undefined, undefined, false);
    });

    it(` > verify question centric view, should not have student card`, () => {
      lcb.clickonQuestionsTab();
      queList.forEach(queNum => {
        lcb.questionResponsePage.selectQuestion(queNum);
        lcb.questionResponsePage.verifyNoQuestionResponseCard(stuName);
      });
    });

    it(" > attempt by redirected students and verify skipped and wrong question", () => {
      cy.login("student", email, password);
      studentTestPage.assignmentPage.clickOnAssignmentButton();

      Object.keys(currentAttempt).forEach(queNum => {
        const [queType] = questionTypeMap[queNum].queKey.split(".");
        const { attemptData } = questionTypeMap[queNum];
        cy.contains(queNum).should("be.visible");
        cy.contains(questionTypeMap[queNum].queKey).should("be.visible");
        // verify feedback
        studentTestPage.verifyFeedback(teacherFeedback);
        studentTestPage.attemptQuestion(queType, attempt[queNum], attemptData);
        studentTestPage.clickOnNext();
      });
      studentTestPage.submitTest();
    });

    it(` > verify student centric view after attempt`, () => {
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      cy.contains(className);
      lcb.clickOnStudentsTab();

      // verify current attempt
      lcb.verifyStudentCentricCard(stuName, attempt, questionTypeMap, true);
      // verify scores and improvement of current attempt
      const { totalScore, maxScore } = lcb.getScoreAndPerformance(allRight, questionTypeMap);
      lcb.questionResponsePage.verifyTotalScoreAndImprovement(totalScore, maxScore, "+5");

      // verify previous attempt
      lcb.questionResponsePage.selectAttempt(1);
      lcb.verifyStudentCentricCard(stuName, statsMap[stuName].attempt, questionTypeMap, true);
      // verify scores and improvement of previous attempt
      lcb.questionResponsePage.verifyTotalScoreAndImprovement(
        statsMap[stuName].totalScore,
        statsMap[stuName].maxScore,
        false
      );
    });

    it(` > verify question centric view after attempt`, () => {
      lcb.clickonQuestionsTab();
      _.keys(allRight).forEach(queNum => {
        lcb.questionResponsePage.selectQuestion(queNum);
        const { queKey, attemptData, points } = questionTypeMap[queNum];
        lcb.questionResponsePage.verifyQuestionResponseCard(
          points,
          queKey,
          allRight[queNum],
          attemptData,
          false,
          stuName
        );
      });
    });
  });

  describe(`redirect absent student`, () => {
    const { stuName, email } = redirectTestData.redirect5;

    before("login as teacher mark student absent", () => {
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      cy.contains(className);
      lcb.selectCheckBoxByStudentName(stuName);
      lcb.clickOnMarkAsAbsent();
    });

    it(" > redirect the student and verify card view", () => {
      lcb.uncheckSelectAllCheckboxOfStudent();
      lcb.clickOnRedirect();
      lcb.redirectPopup.clickOnAbsentStudents();
      // select redirect policy
      lcb.clickOnRedirectSubmit();
      const { score, perf } = lcb.getScoreAndPerformance(noattempt, questionTypeMap);
      lcb.verifyStudentCard(stuName, teacherSide.REDIRECTED, score, perf, noattempt);
      lcb.verifyRedirectIcon(stuName);
    });

    it(` > verify student centric view for - ${stuName}-should be disabled`, () => {
      lcb.clickOnStudentsTab();
      lcb.verifyStudentCentricCard(stuName, undefined, undefined, false);
    });

    it(` > verify question centric view, should not have student card`, () => {
      lcb.clickonQuestionsTab();
      queList.forEach(queNum => {
        lcb.questionResponsePage.selectQuestion(queNum);
        lcb.questionResponsePage.verifyNoQuestionResponseCard(stuName);
      });
    });
  });

  describe(`redirect entire class`, () => {
    it(" > assign new assignment, mark all submit", () => {
      cy.deleteAllAssignments(student, teacher, password);
      cy.login("teacher", teacher, password);
      cy.visit(`/author/assignments/${testId}`);
      cy.wait("@assignment");
      testLibrary.assignPage.selectClass(className);
      testLibrary.assignPage.clickOnAssign();
      cy.contains("Success!");
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      cy.contains(className);
      lcb.checkSelectAllCheckboxOfStudent();
      lcb.clickOnMarkAsSubmit();
    });

    it(" > redirect class and verify student cards", () => {
      lcb.uncheckSelectAllCheckboxOfStudent();
      lcb.clickOnRedirect();
      lcb.redirectPopup.clickOnEntireClass();
      // select redirect policy
      lcb.clickOnRedirectSubmit();
      const { score, perf } = lcb.getScoreAndPerformance(noattempt, questionTypeMap);
      attemptsData.forEach(user => {
        lcb.verifyStudentCard(user.stuName, teacherSide.REDIRECTED, score, perf, noattempt);
        lcb.verifyRedirectIcon(user.stuName);
      });
    });
  });

  // TODO : add close date related redirect scenarios
  // TODO : add scenarios with non gradable question - question create module need to implemented for this
});
