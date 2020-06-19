import AuthorAssignmentPage from "../../assignments/AuthorAssignmentPage";
import ExpressGraderPage from "../../assignments/expressGraderPage";
import LiveClassboardPage from "../../assignments/LiveClassboardPage";
import TestLibrary from "../testLibraryPage";
import AssignmentsPage from "../../../student/assignmentsPage";
import StudentTestPage from "../../../student/studentTestPage";
import ReportsPage from "../../../student/reportsPage";
import CypressHelper from "../../../util/cypressHelpers";
import { regradeOptions, studentSide } from "../../../constants/assignmentStatus";
import { attemptTypes } from "../../../constants/questionTypes";
import BarGraph from "../../assignments/barGraphs";
import PreviewItemPopup from "../../itemList/itemPreview";

const testLibraryPage = new TestLibrary();
const assignmentsPage = new AssignmentsPage();
const studentTestPage = new StudentTestPage();
const lcb = new LiveClassboardPage();
const authorAssignmentPage = new AuthorAssignmentPage();
const expressGrader = new ExpressGraderPage();
const reportsPage = new ReportsPage();
const barGraphs = new BarGraph();
const itemPreview = new PreviewItemPopup();

const { _ } = Cypress;
let optionsIndex;

export function duplicateAndAssignTests({ regrade_Options, testid, assignedtestids, versionedtestids, attemptType }) {
  regrade_Options.forEach(() => {
    assignedtestids.push([]);
    versionedtestids.push([]);
  });

  regrade_Options.forEach((regOption, ind) => {
    attemptType.forEach(attType => {
      testLibraryPage.searchAndClickTestCardById(testid);
      testLibraryPage.clickOnDuplicate();
      testLibraryPage.testSummary.setName(`${regOption}-${attType}`);
      testLibraryPage.header.clickOnPublishButton().then(id => {
        cy.saveTestDetailToDelete(id);
        assignedtestids[ind].push(id);
        testLibraryPage.clickOnAssign();
        testLibraryPage.assignPage.selectClass("Class");
        testLibraryPage.assignPage.clickOnAssign();
      });
    });
  });
}

export function studentAttemptBasedOnStatus({ assignedtestids, attemptType, assignmentStatus, students, attemptData }) {
  assignmentStatus.forEach((status, ind) => {
    if (status !== studentSide.NOT_STARTED) {
      cy.login("student", students[`Student${ind + 1}`].email, students[`Student${ind + 1}`].pass);
      assignedtestids.forEach(testset => {
        testset.forEach((id, ind) => {
          assignmentsPage.sidebar.clickOnAssignment();
          assignmentsPage.clickOnAssigmentByTestId(id);

          if (status === studentSide.SUBMITTED) {
            studentTestPage.attemptQuestion("MCQ_MULTI", attemptType[ind], attemptData);
            studentTestPage.clickOnNext(false, attemptType[ind] === attemptTypes.SKIP);
            studentTestPage.submitTest();
          } else studentTestPage.clickOnExitTest();
        });
      });
    }
  });
}

export function verifyStudentSide({
  data,
  assignmentStatus,
  attemptType,
  students,
  versionedtestids,
  option,
  attemptData
}) {
  assignmentStatus.forEach((status, statusIndex) => {
    context(`> for Student${statusIndex + 1},'${status}'`, () => {
      before(">login", () => {
        optionsIndex = _.values(regradeOptions.edited).indexOf(option);
        cy.login("student", students[`Student${statusIndex + 1}`].email, students[`Student${statusIndex + 1}`].pass);
      });
      attemptType.forEach((attempt, attempIndex) => {
        const title = status === studentSide.SUBMITTED ? "" : "attempt and ";
        it(`> ${title}verify edited question-'${attempt}'`, () => {
          if (status !== studentSide.SUBMITTED) {
            assignmentsPage.sidebar.clickOnAssignment();
            assignmentsPage.clickOnAssigmentByTestId(versionedtestids[optionsIndex][attempIndex]);
            studentTestPage.attemptQuestion("MCQ_MULTI", attempt, attemptData);
            studentTestPage.clickOnNext(false, attempt === attemptTypes.SKIP);
            studentTestPage.submitTest();
          } else assignmentsPage.sidebar.clickOnGrades();

          reportsPage.verifyPercentageOnTestCardByTestId(
            versionedtestids[optionsIndex][attempIndex],
            _.round((data.student[status][`${option}`][`${attempt}`] / data.points) * 100, 2)
          );

          reportsPage.clickOnReviewButtonButtonByTestId(versionedtestids[optionsIndex][attempIndex]);
          reportsPage.verifyAchievedScoreOfQueByIndex(0, data.student[status][`${option}`][`${attempt}`]);
          reportsPage.verifyMaxScoreOfQueByIndex(0, data.points);
        });
      });
    });
  });
}

export function verifyTeacherSide({
  data,
  assignmentStatus,
  attemptType,
  students,
  versionedtestids,
  option,
  attemptData
}) {
  const attemptsData = [];
  const queCentric = {};
  assignmentStatus.forEach((sta, ind) => {
    attemptsData.push({ stuName: students[`Student${ind + 1}`].name, attempt: {}, status: studentSide.SUBMITTED });
  });
  assignmentStatus.forEach((status, statusIndex) => {
    context(`> for Student${statusIndex + 1},'${status}'`, () => {
      attemptType.forEach((attempt, attemptIndex) => {
        const title = status === studentSide.SUBMITTED ? "before" : "after";
        context(`> verify edited question-'attempted as ${attempt}' ${title} regrade`, () => {
          before("> set attempt data", () => {
            assignmentStatus.forEach((sta, ind) => {
              attemptsData[ind].attempt.Q1 = attempt;
            });
            if (
              assignmentStatus.indexOf(studentSide.SUBMITTED) !== -1 &&
              option === regradeOptions.edited.MANUAL_POINTS
            ) {
              if (status === studentSide.SUBMITTED)
                attemptsData[assignmentStatus.indexOf(studentSide.SUBMITTED)].attempt.Q1 = attemptTypes.MANUAL_GRADE;
              else
                attemptsData[assignmentStatus.indexOf(studentSide.SUBMITTED)].attempt.Q1 = attemptTypes.PARTIAL_CORRECT;
            }
          });
          before(">click assignments", () => {
            optionsIndex = _.values(regradeOptions.edited).indexOf(option);
            testLibraryPage.sidebar.clickOnAssignment();
            authorAssignmentPage.clickOnLCBbyTestId(versionedtestids[optionsIndex][attemptIndex]);
          });

          it(`> verif lcb card view-`, () => {
            lcb
              .getStudentScoreByIndex(statusIndex)
              .should("contain.text", `${data.teacher[status][`${option}`][`${attempt}`]} / ${data.points}`);

            lcb
              .getQuestionsByIndex(0)
              .find("div")
              .should("have.length", 1);

            barGraphs.verifyQueBarAndToolTipBasedOnAttemptData(attemptsData, ["Q1"]);

            lcb.verifyQuestionCards(statusIndex, [
              option === regradeOptions.edited.MANUAL_POINTS && status === studentSide.SUBMITTED
                ? attemptTypes.MANUAL_GRADE
                : attempt
            ]);
          });

          it("> verify student centric view", () => {
            lcb.clickOnStudentsTab();
            lcb.questionResponsePage.selectStudent(students[`Student${statusIndex + 1}`].name);

            lcb.questionResponsePage
              .getTotalScore()
              .should("have.text", `${data.teacher[status][`${option}`][`${attempt}`]}`);

            lcb.questionResponsePage.getMaxScore().should("have.text", `${data.points}`);

            itemPreview.verifyQuestionResponseCard("MCQ_MULTI", attemptData, attempt);
            barGraphs.verifyQueBarAndToolTipBasedOnAttemptData(attemptsData[statusIndex], ["Q1"]);
          });

          it("> verify Question centric view", () => {
            lcb.clickonQuestionsTab();
            lcb.questionResponsePage.getDropDown().click({ force: true });

            CypressHelper.getDropDownList().then(questions => {
              expect(questions).to.have.lengthOf(1);
            });

            lcb.questionResponsePage
              .getQuestionContainerByStudent(students[`Student${statusIndex + 1}`].name)
              .as("updatecard");

            itemPreview.verifyQuestionResponseCard("MCQ_MULTI", attemptData, attempt, false, statusIndex);
            lcb.getQuestionCentricData(attemptsData, queCentric);
            barGraphs.verifyQueBarBasedOnQueAttemptData(queCentric.Q1);

            lcb.questionResponsePage
              .getScoreInput(cy.get("@updatecard"))
              .should("have.value", `${data.student[status][`${option}`][`${attempt}`]}`);
          });

          it("> verify express grader view", () => {
            lcb.header.clickOnExpressGraderTab();

            expressGrader.getGridRowByStudent(students[`Student${statusIndex + 1}`].name);
            expressGrader.verifyScoreAndPerformance(
              `${data.teacher[status][`${option}`][`${attempt}`]}/${data.points}`,
              _.round((data.teacher[status][`${option}`][`${attempt}`] / data.points) * 100, 2)
            );
            expressGrader.verifyNumberOfQuestions(1);
          });

          if (option === regradeOptions.edited.MANUAL_POINTS && status === studentSide.SUBMITTED) {
            context("> update and verify points in question centric view", () => {
              it("> upadate score and verify in question centric view", () => {
                lcb.header.clickOnLCBTab();
                lcb.clickonQuestionsTab();

                lcb.questionResponsePage.updateScoreAndFeedbackForStudent(
                  students[`Student${statusIndex + 1}`].name,
                  data.manualpoints
                );
                attemptsData[statusIndex].attempt.Q1 = attemptTypes.PARTIAL_CORRECT;

                lcb.getQuestionCentricData(attemptsData, queCentric);
                barGraphs.verifyQueBarBasedOnQueAttemptData(queCentric.Q1);
              });

              it("> verify student centric view", () => {
                lcb.clickOnStudentsTab();
                lcb.questionResponsePage.selectStudent(students[`Student${statusIndex + 1}`].name);
                lcb.questionResponsePage.getTotalScore().should("have.text", data.manualpoints.toString());

                barGraphs.verifyQueBarAndToolTipBasedOnAttemptData(attemptsData[statusIndex], ["Q1"]);
              });

              it(`> verify lcb card view-`, () => {
                lcb.clickOnCardViewTab();
                lcb.getStudentScoreByIndex(statusIndex).should("contain.text", `${data.manualpoints} / ${data.points}`);
                lcb.verifyQuestionCards(statusIndex, [attemptTypes.PARTIAL_CORRECT]);
                barGraphs.verifyQueBarAndToolTipBasedOnAttemptData(attemptsData, ["Q1"]);
              });
            });
          }
        });
      });
    });
  });
}
