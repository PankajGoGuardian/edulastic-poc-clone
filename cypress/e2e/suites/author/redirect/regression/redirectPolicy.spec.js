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
import AssignmentsPage from "../../../../framework/student/assignmentsPage";

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
  "1": {
    email: "student.1.redirectpolicy@snapwiz.com",
    stuName: "redirectpolicy, student.1"
  },
  "2": {
    email: "student.2.redirectpolicy@snapwiz.com",
    stuName: "redirectpolicy, student.2"
  },
  "3": {
    email: "student.3.redirectpolicy@snapwiz.com",
    stuName: "redirectpolicy, student.3"
  },
  "4": {
    email: "student.4.redirectpolicy@snapwiz.com",
    stuName: "redirectpolicy, student.4"
  },
  "5": {
    email: "student.5.redirectpolicy@snapwiz.com",
    stuName: "redirectpolicy, student.5"
  },
  "6": {
    email: "student.6.redirectpolicy@snapwiz.com",
    stuName: "redirectpolicy, student.6"
  },
  "7": {
    email: "student.7.redirectpolicy@snapwiz.com",
    stuName: "redirectpolicy, student.7"
  }
};

const allWrong = { Q1: "wrong", Q2: "wrong", Q3: "wrong" };
const allRight = { Q1: "right", Q2: "right", Q3: "right" };
const allSkipped = { Q1: "skip", Q2: "skip", Q3: "skip" };

const noattempt = lcb.getNullifiedAttempts(allWrong);

const teacherFeedback = "You need to work hard";
const queList = _.keys(allRight);

const redirectTestData = {
  className: "Automation Class - redirectpolicy teacher.1",
  teacher: "teacher.1.redirectpolicy@snapwiz.com",
  student: students[1].email,
  password: "snapwiz",
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
  const { itemKeys } = LCB_3;
  const statsMap = {};
  const questionTypeMap = lcb.getQuestionTypeMap(itemKeys, questionData, {});
  attemptsData.forEach(attempts => {
    const { attempt, email, stuName, status } = attempts;
    statsMap[stuName] = lcb.getScoreAndPerformance(attempt, questionTypeMap);
    statsMap[stuName].attempt = attempt;
    statsMap[stuName].status = status;
    statsMap[stuName].email = email;
  });
  let testId;

  before(" > create new assessment and assign", () => {
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
      const { attempt, email, status } = attempts;
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
    const { stuName, email } = redirectTestData.redirect1;

    const attempt1 = { attempt: allRight, ...lcb.getScoreAndPerformance(allRight, questionTypeMap) };
    const attempt2 = { attempt: allWrong, ...lcb.getScoreAndPerformance(allWrong, questionTypeMap) };
    const attempt3 = { attempt: allRight, ...lcb.getScoreAndPerformance(allRight, questionTypeMap) };

    before("login as teacher", () => {
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
    });

    describe(`> redirect attempt1 for - ${stuName}`, () => {
      it(" > redirect the student and verify card view", () => {
        lcb.selectCheckBoxByStudentName(stuName);
        lcb.clickOnRedirect();
        lcb.verifyStudentsOnRedirectPopUp(email);
        lcb.clickOnRedirectSubmit();
        lcb.verifyStudentCard(stuName, teacherSide.REDIRECTED, attempt1.score, attempt1.perf, attempt1.attempt, email);
        lcb.verifyRedirectIcon(stuName);
      });

      it(` > verify student centric view,,should be shown with attempt1`, () => {
        lcb.clickOnStudentsTab();
        lcb.verifyStudentCentricCard(stuName, attempt1.attempt, questionTypeMap, true);
        // verify scores of current attemp and no improvement
        lcb.questionResponsePage.verifyTotalScoreAndImprovement(attempt1.totalScore, attempt1.maxScore, false);
      });

      it(` > verify question centric view,should be shown with attempt1`, () => {
        lcb.clickonQuestionsTab();
        _.keys(attempt1.attempt).forEach(queNum => {
          lcb.questionResponsePage.selectQuestion(queNum);
          const { queKey, attemptData, points } = questionTypeMap[queNum];
          lcb.questionResponsePage.verifyQuestionResponseCard(
            points,
            queKey,
            attempt1.attempt[queNum],
            attemptData,
            false,
            stuName
          );
        });
      });
    });

    describe(`> verify redirected attempt2 - ${stuName}`, () => {
      it(" > attempt by redirected students and verify feedback is shown", () => {
        cy.login("student", email, password);
        studentTestPage.assignmentPage.clickOnAssignmentButton();
        Object.keys(attempt2.attempt).forEach(queNum => {
          const [queType] = questionTypeMap[queNum].queKey.split(".");
          const { attemptData } = questionTypeMap[queNum];
          studentTestPage.verifyFeedback(teacherFeedback);
          studentTestPage.attemptQuestion(queType, attempt2.attempt[queNum], attemptData);
          studentTestPage.clickOnNext();
        });
        studentTestPage.submitTest();
      });

      it(` > verify student card view after attempt2`, () => {
        studentTestPage.clickOnExitTest(); // temp fix: issue-  if above test fails while attempting, navigation by direct url is blocked here
        cy.login("teacher", teacher, password);
        teacherSidebar.clickOnAssignment();
        authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
        lcb.verifyStudentCard(stuName, studentSide.GRADED, attempt2.score, attempt2.perf, attempt2.attempt, email);
      });

      // TODO : add tests for student card - attempts view on hover

      it(` > verify student centric view after attempt2`, () => {
        lcb.clickOnStudentsTab();

        // verify current attempt2
        lcb.verifyStudentCentricCard(stuName, attempt2.attempt, questionTypeMap, true);
        // verify scores and improvement of current attempt2
        lcb.questionResponsePage.verifyTotalScoreAndImprovement(
          attempt2.totalScore,
          attempt2.maxScore,
          attempt2.totalScore - attempt1.totalScore
        );

        // verify previous attempt1
        lcb.questionResponsePage.selectAttempt(1);
        lcb.verifyStudentCentricCard(stuName, attempt1.attempt, questionTypeMap, true);
        // verify scores and improvement of previous attempt1
        lcb.questionResponsePage.verifyTotalScoreAndImprovement(attempt1.totalScore, attempt1.maxScore, false);
      });

      it(` > verify question centric view after attempt2`, () => {
        lcb.clickonQuestionsTab();
        _.keys(attempt2.attempt).forEach(queNum => {
          lcb.questionResponsePage.selectQuestion(queNum);
          const { queKey, attemptData, points } = questionTypeMap[queNum];
          lcb.questionResponsePage.verifyQuestionResponseCard(
            points,
            queKey,
            attempt2.attempt[queNum],
            attemptData,
            false,
            stuName
          );
        });
      });
    });

    describe(`> redirect the attempt2 for - ${stuName} -and verify after attempt3`, () => {
      before(` > redirect the student`, () => {
        cy.login("teacher", teacher, password);
        teacherSidebar.clickOnAssignment();
        authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
        cy.contains(className);
        lcb.selectCheckBoxByStudentName(stuName);
        lcb.clickOnRedirect();
        lcb.clickOnRedirectSubmit();
      });

      it(`> verify student card view,should be shown with attempt2`, () => {
        lcb.verifyStudentCard(stuName, teacherSide.REDIRECTED, attempt2.score, attempt2.perf, attempt2.attempt, email);
        lcb.verifyRedirectIcon(stuName);
      });

      it(`> verify student centric view, should be shown with attempt2`, () => {
        lcb.clickOnStudentsTab();
        lcb.verifyStudentCentricCard(stuName, attempt2.attempt, questionTypeMap, true);
        // verify scores of current attemp and improvement of attempt2 compare to attempt1
        lcb.questionResponsePage.verifyTotalScoreAndImprovement(
          attempt2.totalScore,
          attempt2.maxScore,
          attempt2.totalScore - attempt1.totalScore
        );
      });

      it(`> verify question centric view,student should be shown with attempt2`, () => {
        lcb.clickonQuestionsTab();
        _.keys(attempt2.attempt).forEach(queNum => {
          lcb.questionResponsePage.selectQuestion(queNum);
          const { queKey, attemptData, points } = questionTypeMap[queNum];
          lcb.questionResponsePage.verifyQuestionResponseCard(
            points,
            queKey,
            attempt2.attempt,
            attemptData,
            false,
            stuName
          );
        });
      });

      it(`> attempt redirected test with attempt3`, () => {
        cy.login("student", email, password);
        studentTestPage.assignmentPage.clickOnAssignmentButton();
        Object.keys(attempt3.attempt).forEach(queNum => {
          const [queType] = questionTypeMap[queNum].queKey.split(".");
          const { attemptData } = questionTypeMap[queNum];
          studentTestPage.attemptQuestion(queType, attempt3.attempt[queNum], attemptData);
          studentTestPage.clickOnNext();
        });
        studentTestPage.submitTest();
      });

      it(` > verify student card after attempt3`, () => {
        studentTestPage.clickOnExitTest(); // temp fix: issue-  if above test fails while attempting, navigation by direct url is blocked here
        cy.login("teacher", teacher, password);
        teacherSidebar.clickOnAssignment();
        authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
        lcb.verifyStudentCard(stuName, studentSide.GRADED, attempt3.score, attempt3.perf, attempt3.attempt, email);
      });

      // TODO : add tests for student card - attempts view on hover

      it(` > verify student centric view after attempt3`, () => {
        // student centric should have  attempt 3
        lcb.clickOnStudentsTab();
        lcb.verifyStudentCentricCard(stuName, attempt3.attempt, questionTypeMap, true);
        // verify scores and improvement of attempt 3
        const { totalScore, maxScore } = lcb.getScoreAndPerformance(attempt3.attempt, questionTypeMap);
        lcb.questionResponsePage.verifyTotalScoreAndImprovement(
          attempt3.totalScore,
          attempt3.maxScore,
          attempt3.totalScore - attempt2.totalScore
        );

        // verify previous attempt 2
        lcb.questionResponsePage.selectAttempt(2);
        lcb.verifyStudentCentricCard(stuName, attempt2.attempt, questionTypeMap, true);
        // verify scores and improvement of attempt 2
        lcb.questionResponsePage.verifyTotalScoreAndImprovement(
          attempt2.totalScore,
          attempt2.maxScore,
          attempt2.totalScore - attempt1.totalScore
        );

        // verify previous attempt 1
        lcb.questionResponsePage.selectAttempt(1);
        lcb.verifyStudentCentricCard(stuName, attempt1.attempt, questionTypeMap, true);
        // verify scores and improvement of previous attempt 1
        lcb.questionResponsePage.verifyTotalScoreAndImprovement(totalScore, maxScore, false);
      });

      it(` > verify quetion centric view after attempt3`, () => {
        // quetion centric should have  attempt 3
        lcb.clickonQuestionsTab();
        _.keys(attempt3.attempt).forEach(queNum => {
          lcb.questionResponsePage.selectQuestion(queNum);
          const { queKey, attemptData, points } = questionTypeMap[queNum];
          lcb.questionResponsePage.verifyQuestionResponseCard(
            points,
            queKey,
            attempt3.attempt[queNum],
            attemptData,
            false,
            stuName
          );
        });
      });
    });
  });

  describe(`redirect with setting - ${redirectType.SCORE_AND_FEEDBACK}`, () => {
    const { stuName, email, attempt } = redirectTestData.redirect2;
    const attempt1 = { ...statsMap[stuName] };
    const attempt2 = { ...lcb.getScoreAndPerformance(attempt, questionTypeMap), attempt };

    before("login as teacher", () => {
      studentTestPage.clickOnExitTest(); // temp fix: issue-  if above test fails while attempting, navigation by direct url is blocked here
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
      lcb.verifyStudentCard(stuName, teacherSide.REDIRECTED, attempt1.score, attempt1.perf, attempt1.attempt, email);
      lcb.verifyRedirectIcon(stuName);
    });

    it(` > verify student centric view-${stuName},should be shown with attempt1`, () => {
      lcb.clickOnStudentsTab();
      lcb.verifyStudentCentricCard(stuName, attempt1.attempt, questionTypeMap, true);
      // verify scores of current attemp and no improvement
      lcb.questionResponsePage.verifyTotalScoreAndImprovement(attempt1.totalScore, attempt1.maxScore, false);
    });

    it(` > verify question centric view,should be shown with attempt1`, () => {
      lcb.clickonQuestionsTab();
      _.keys(attempt1.attempt).forEach(queNum => {
        lcb.questionResponsePage.selectQuestion(queNum);
        const { queKey, attemptData, points } = questionTypeMap[queNum];
        lcb.questionResponsePage.verifyQuestionResponseCard(
          points,
          queKey,
          attempt1.attempt[queNum],
          attemptData,
          false,
          stuName
        );
      });
    });

    it(" > attempt by redirected students and verify feedback,score is shown", () => {
      cy.login("student", email, password);
      studentTestPage.assignmentPage.clickOnAssignmentButton();
      Object.keys(attempt2.attempt).forEach(queNum => {
        const [queType] = questionTypeMap[queNum].queKey.split(".");
        const { attemptData, points } = questionTypeMap[queNum];

        const score = lcb.questionResponsePage.getScoreByAttempt(
          attemptData,
          points,
          queType,
          attempt1.attempt[queNum]
        );
        // verify score
        studentTestPage.verifyScore(score, points);
        // verify feedback
        studentTestPage.verifyFeedback(teacherFeedback);

        studentTestPage.attemptQuestion(queType, attempt2.attempt[queNum], attemptData);
        studentTestPage.clickOnNext();
      });
      studentTestPage.submitTest();
    });

    it(` > verify card view after attempt2`, () => {
      cy.login("teacher", teacher, password);
      studentTestPage.clickOnExitTest();
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.verifyStudentCard(stuName, studentSide.GRADED, attempt2.score, attempt2.perf, attempt2.attempt, email);
    });

    it(` > verify student centric view after attempt2`, () => {
      lcb.clickOnStudentsTab();
      // verify attempt2
      lcb.verifyStudentCentricCard(stuName, attempt2.attempt, questionTypeMap, true);
      // verify scores and improvement of attempt2
      lcb.questionResponsePage.verifyTotalScoreAndImprovement(
        attempt2.totalScore,
        attempt2.maxScore,
        attempt2.totalScore - attempt1.totalScore
      );

      // verify attempt1
      lcb.questionResponsePage.selectAttempt(1);
      lcb.verifyStudentCentricCard(stuName, attempt1.attempt, questionTypeMap, true);
      // verify scores and improvement of attempt1
      lcb.questionResponsePage.verifyTotalScoreAndImprovement(attempt1.totalScore, attempt1.maxScore, false);
    });

    it(` > verify question centric view after attempt2`, () => {
      lcb.clickonQuestionsTab();
      _.keys(attempt2.attempt).forEach(queNum => {
        lcb.questionResponsePage.selectQuestion(queNum);
        const { queKey, attemptData, points } = questionTypeMap[queNum];
        lcb.questionResponsePage.verifyQuestionResponseCard(
          points,
          queKey,
          attempt2.attempt[queNum],
          attemptData,
          false,
          stuName
        );
      });
    });
  });

  describe(`redirect with setting - ${redirectType.STUDENT_RESPONSE_AND_FEEDBACK}`, () => {
    const { stuName, email, attempt } = redirectTestData.redirect3;
    const attempt1 = { ...statsMap[stuName] };
    const attempt2 = { ...lcb.getScoreAndPerformance(attempt, questionTypeMap), attempt };

    before("login as teacher", () => {
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
    });

    it(" > redirect the student and verify card view", () => {
      lcb.selectCheckBoxByStudentName(stuName);
      lcb.clickOnRedirect();
      lcb.verifyStudentsOnRedirectPopUp(email);

      // select redirect policy
      lcb.redirectPopup.selectRedirectPolicy(redirectType.STUDENT_RESPONSE_AND_FEEDBACK);
      lcb.clickOnRedirectSubmit();

      lcb.verifyStudentCard(stuName, teacherSide.REDIRECTED, attempt1.score, attempt1.perf, attempt1.attempt, email);
      lcb.verifyRedirectIcon(stuName);
    });

    it(` > verify student centric view-${stuName},should be shown with attempt1`, () => {
      lcb.clickOnStudentsTab();
      lcb.verifyStudentCentricCard(stuName, attempt1.attempt, questionTypeMap, true);
      // verify scores of current attemp and no improvement
      lcb.questionResponsePage.verifyTotalScoreAndImprovement(attempt1.totalScore, attempt1.maxScore, false);
    });

    it(` > verify question centric view,should be shown with attempt1`, () => {
      lcb.clickonQuestionsTab();
      _.keys(attempt1.attempt).forEach(queNum => {
        lcb.questionResponsePage.selectQuestion(queNum);
        const { queKey, attemptData, points } = questionTypeMap[queNum];
        lcb.questionResponsePage.verifyQuestionResponseCard(
          points,
          queKey,
          attempt1.attempt[queNum],
          attemptData,
          false,
          stuName
        );
      });
    });

    it(" > attempt by redirected students and verify feedback,response,score is shown", () => {
      cy.login("student", email, password);
      studentTestPage.assignmentPage.clickOnAssignmentButton();
      Object.keys(attempt).forEach(queNum => {
        const [queType] = questionTypeMap[queNum].queKey.split(".");
        const { attemptData, points } = questionTypeMap[queNum];
        // verify evaluation message
        studentTestPage.verifyResponseEvaluation(attempt1.attempt[queNum]).click({ force: true });
        // verify that previous response was retained and score
        studentTestPage.report.verifyQuestionResponseCard(
          points,
          queType,
          attempt1.attempt[queNum],
          attemptData,
          false
        );
        // verify feedback
        studentTestPage.verifyFeedback(teacherFeedback);
        studentTestPage.attemptQuestion(queType, attempt2.attempt[queNum], attemptData);
        studentTestPage.clickOnNext();
      });
      studentTestPage.submitTest();
    });

    it(` > verify card view after attempt2`, () => {
      cy.login("teacher", teacher, password);
      studentTestPage.clickOnExitTest();
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.verifyStudentCard(stuName, studentSide.GRADED, attempt2.score, attempt2.perf, attempt2.attempt, email);
    });

    it(` > verify student centric view after attempt2`, () => {
      lcb.clickOnStudentsTab();

      // verify current attempt
      lcb.verifyStudentCentricCard(stuName, attempt2.attempt, questionTypeMap, true);
      // verify scores and improvement of attempt2
      lcb.questionResponsePage.verifyTotalScoreAndImprovement(
        attempt2.totalScore,
        attempt2.maxScore,
        attempt2.totalScore - attempt1.totalScore
      );

      // verify previous attempt
      lcb.questionResponsePage.selectAttempt(1);
      lcb.verifyStudentCentricCard(stuName, attempt1.attempt, questionTypeMap, true);
      // verify scores and improvement of attempt1
      lcb.questionResponsePage.verifyTotalScoreAndImprovement(attempt1.totalScore, attempt1.maxScore, false);
    });

    it(` > verify question centric view after attempt2`, () => {
      lcb.clickonQuestionsTab();
      _.keys(attempt2.attempt).forEach(queNum => {
        lcb.questionResponsePage.selectQuestion(queNum);
        const { queKey, attemptData, points } = questionTypeMap[queNum];
        lcb.questionResponsePage.verifyQuestionResponseCard(
          points,
          queKey,
          attempt2.attempt[queNum],
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
    const attempt1 = { ...statsMap[stuName] };
    const attempt2 = { ...lcb.getScoreAndPerformance(attempt, questionTypeMap), attempt };

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
      lcb.verifyStudentCard(stuName, teacherSide.REDIRECTED, attempt1.score, attempt1.perf, attempt1.attempt, email);
      lcb.verifyRedirectIcon(stuName);
    });

    it(` > verify student centric view-${stuName},should be shown with attempt1`, () => {
      lcb.clickOnStudentsTab();
      lcb.verifyStudentCentricCard(stuName, attempt1.attempt, questionTypeMap, true);
      // verify scores of current attemp and no improvement
      lcb.questionResponsePage.verifyTotalScoreAndImprovement(attempt1.totalScore, attempt1.maxScore, false);
    });

    it(` > verify question centric view,should be shown with attempt1`, () => {
      lcb.clickonQuestionsTab();
      _.keys(attempt1.attempt).forEach(queNum => {
        lcb.questionResponsePage.selectQuestion(queNum);
        const { queKey, attemptData, points } = questionTypeMap[queNum];
        lcb.questionResponsePage.verifyQuestionResponseCard(
          points,
          queKey,
          attempt1.attempt[queNum],
          attemptData,
          false,
          stuName
        );
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
        studentTestPage.attemptQuestion(queType, attempt2.attempt[queNum], attemptData);
        studentTestPage.clickOnNext();
      });
      studentTestPage.submitTest();
    });

    it(` > verify card view after attempt2`, () => {
      cy.login("teacher", teacher, password);
      studentTestPage.clickOnExitTest();
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.verifyStudentCard(stuName, studentSide.GRADED, attempt2.score, attempt2.perf, attempt2.attempt, email);
    });

    it(` > verify student centric view after attempt2`, () => {
      studentTestPage.clickOnExitTest(); // temp fix: issue-  if above test fails while attempting, navigation by direct url is blocked here
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.clickOnStudentsTab();

      // verify current attempt
      lcb.verifyStudentCentricCard(stuName, attempt2.attempt, questionTypeMap, true);
      // verify scores and improvement of current attempt
      lcb.questionResponsePage.verifyTotalScoreAndImprovement(
        attempt2.totalScore,
        attempt2.maxScore,
        attempt2.totalScore - attempt1.totalScore
      );

      // verify previous attempt
      lcb.questionResponsePage.selectAttempt(1);
      lcb.verifyStudentCentricCard(stuName, attempt1.attempt, questionTypeMap, true);
      // verify scores and improvement of previous attempt
      lcb.questionResponsePage.verifyTotalScoreAndImprovement(attempt1.totalScore, attempt1.maxScore, false);
    });

    it(` > verify question centric view after attempt2`, () => {
      lcb.clickonQuestionsTab();
      _.keys(attempt2.attempt).forEach(queNum => {
        lcb.questionResponsePage.selectQuestion(queNum);
        const { queKey, attemptData, points } = questionTypeMap[queNum];
        lcb.questionResponsePage.verifyQuestionResponseCard(
          points,
          queKey,
          attempt2.attempt[queNum],
          attemptData,
          false,
          stuName
        );
      });
    });
  });

  describe(`redirect absent student`, () => {
    const { stuName, email } = redirectTestData.redirect5;
    const attempt1 = { ...lcb.getScoreAndPerformance(noattempt, questionTypeMap), attempt: noattempt };

    before("login as teacher mark student absent", () => {
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.selectCheckBoxByStudentName(stuName);
      lcb.clickOnMarkAsAbsent();
    });

    it(" > redirect the student and verify card view", () => {
      lcb.uncheckSelectAllCheckboxOfStudent();
      lcb.clickOnRedirect();
      lcb.redirectPopup.clickOnAbsentStudents();
      // select redirect policy
      lcb.clickOnRedirectSubmit();
      lcb.verifyStudentCard(stuName, teacherSide.REDIRECTED, attempt1.score, attempt1.perf, attempt1.attempt, email);
      lcb.verifyRedirectIcon(stuName);
    });

    it(` > verify student centric view,should be shown`, () => {
      lcb.clickOnStudentsTab();
      lcb.verifyStudentCentricCard(stuName, attempt1.attempt, questionTypeMap, true);
      // verify scores of current attemp and no improvement
      lcb.questionResponsePage.verifyTotalScoreAndImprovement(attempt1.totalScore, attempt1.maxScore, false);
    });

    it(` > verify question centric view,should be shown`, () => {
      lcb.clickonQuestionsTab();
      _.keys(attempt1.attempt).forEach(queNum => {
        lcb.questionResponsePage.selectQuestion(queNum);
        const { queKey, attemptData, points } = questionTypeMap[queNum];
        lcb.questionResponsePage.verifyQuestionResponseCard(
          points,
          queKey,
          attempt1.attempt[queNum],
          attemptData,
          false,
          stuName
        );
      });
    });
  });

  describe(`redirect entire class - status checks only`, () => {
    const { score, perf } = lcb.getScoreAndPerformance(allSkipped, questionTypeMap);

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
      lcb.header.verifyAssignmentStatus(teacherSide.IN_GRADING);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.verifyStatus(teacherSide.IN_GRADING);
    });

    it(" > redirect class and verify student cards", () => {
      teacherSidebar.clickOnDashboard();
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.uncheckSelectAllCheckboxOfStudent();
      lcb.clickOnRedirect();
      lcb.redirectPopup.clickOnEntireClass();
      // select redirect policy
      lcb.clickOnRedirectSubmit();
      attemptsData.forEach(user => {
        lcb.verifyStudentCard(user.stuName, teacherSide.REDIRECTED, score, perf, allSkipped, user.email);
        lcb.verifyRedirectIcon(user.stuName);
      });
      lcb.header.verifyAssignmentStatus(teacherSide.IN_PROGRESS);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.verifyStatus(teacherSide.IN_PROGRESS);
    });

    it(" > assign new assignment, mark all submit, mark as Done - Redirect Entrie class", () => {
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
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.header.clickOnExpressGraderTab();
      lcb.header.clickOnLCBTab();
      cy.contains(className);
      lcb.header.clickOnMarkAsDone();
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.verifyStatus(teacherSide.DONE);
      authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
      lcb.header.verifyAssignmentStatus(teacherSide.DONE);
      lcb.checkSelectAllCheckboxOfStudent();
      lcb.clickOnRedirect();
      lcb.redirectPopup.clickOnEntireClass();
      // select redirect policy
      lcb.clickOnRedirectSubmit();
      attemptsData.forEach(user => {
        lcb.verifyStudentCard(user.stuName, teacherSide.REDIRECTED, score, perf, allSkipped, user.email);
        lcb.verifyRedirectIcon(user.stuName);
      });
      lcb.header.verifyAssignmentStatus(teacherSide.IN_PROGRESS);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.verifyStatus(teacherSide.IN_PROGRESS);
    });
  });

  // TODO : add close date related redirect scenarios
  // TODO : add scenarios with non gradable question - question create module need to implemented for this
});
