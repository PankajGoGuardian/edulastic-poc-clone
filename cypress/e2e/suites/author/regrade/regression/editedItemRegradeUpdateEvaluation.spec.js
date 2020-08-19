/* eslint-disable import/no-duplicates */
import Regrade from "../../../../framework/author/tests/regrade/regrade";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import FileHelper from "../../../../framework/util/fileHelper";
import { regradeOptions, studentSide, releaseGradeTypes } from "../../../../framework/constants/assignmentStatus";
import { attemptTypes } from "../../../../framework/constants/questionTypes";
import MCQMultiplePage from "../../../../framework/author/itemList/questionType/mcq/mcqMultiplePage";
import BarGraph from "../../../../framework/author/assignments/barGraphs";
import PreviewItemPopup from "../../../../framework/author/itemList/itemPreview";
import ExpressGraderPage from "../../../../framework/author/assignments/expressGraderPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import ReportsPage from "../../../../framework/student/reportsPage";
import CypressHelper from "../../../../framework/util/cypressHelpers";

const { MCQ_MULTI } = require("./../../../../../fixtures/questionAuthoring");
const { _ } = Cypress;

describe(`${FileHelper.getSpecName(Cypress.spec.name)}> test editing with applying regrade 'edited item'`, () => {
  const testLibraryPage = new TestLibrary();
  const mcqMultiplePage = new MCQMultiplePage();
  const regrade = new Regrade();
  const barGraphs = new BarGraph();
  const itemPreview = new PreviewItemPopup();
  const expressGrader = new ExpressGraderPage();
  const lcb = new LiveClassboardPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const assignmentsPage = new AssignmentsPage();
  const studentTestPage = new StudentTestPage();
  const reportsPage = new ReportsPage();

  const Teacher = {
    username: "teacher.regrade.edited.updateeval@snapwiz.com",
    password: "snapwiz"
  };
  const students = {
    Student1: {
      name: "Student1",
      email: "student1.updateeval@snapwiz.com",
      pass: "snapwiz"
    },
    Student2: {
      name: "Student2",
      email: "student2.updateeval@snapwiz.com",
      pass: "snapwiz"
    },
    Student3: {
      name: "Student3",
      email: "student3.updateeval@snapwiz.com",
      pass: "snapwiz"
    }
  };

  const data = {
    points: 2,
    manualpoints: 1,
    student: {
      Submitted: {
        "skip-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
        "restore-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 0.5 },
        "manual-grading": { right: "", wrong: "", skip: "", partialCorrect: "" }
      },
      "In Progress": {
        "skip-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 0.5 },
        "restore-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 0.5 },
        "manual-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 0.5 }
      },
      "Not Started": {
        "skip-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 0.5 },
        "restore-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 0.5 },
        "manual-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 0.5 }
      }
    },
    teacher: {
      Submitted: {
        "skip-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
        "restore-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 0.5 },
        "manual-grading": { right: 0, wrong: 0, skip: 0, partialCorrect: 0 }
      },
      "In Progress": {
        "skip-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 0.5 },
        "restore-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 0.5 },
        "manual-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 0.5 }
      },
      "Not Started": {
        "skip-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 0.5 },
        "restore-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 0.5 },
        "manual-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 0.5 }
      }
    }
  };

  const attemptType = [attemptTypes.RIGHT, attemptTypes.WRONG];
  const assignmentStatus = [studentSide.SUBMITTED, studentSide.IN_PROGRESS];
  const regrade_Options = _.values(regradeOptions.edited);
  const assignedtestids = [];
  const versionedtestids = [];
  const testname = "REGRADE_EDITED_ITEM";
  const attemptsData = [];
  const queCentric = {};

  let attemptData = MCQ_MULTI["5"].attemptData;
  let itemId;
  let testid;

  before("create tests", () => {
    cy.getAllTestsAndDelete(Teacher.username);
    cy.getAllItemsAndDelete(Teacher.username);
    cy.deleteAllAssignments("", Teacher.username);
    cy.login("teacher", Teacher.username, Teacher.password);

    testLibraryPage.createTest(testname, false).then(id => {
      [itemId] = testLibraryPage.items;
      testid = id;
      testLibraryPage.header.clickOnSettings();
      testLibraryPage.testSettings.setRealeasePolicy(releaseGradeTypes.WITH_RESPONSE);
      testLibraryPage.header.clickOnPublishButton();
    });
  });

  describe(`> regrade 'edited item' by 'updating evaluation at item level'`, () => {
    before("> duplicate and  assign", () => {
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
            assignedtestids[ind].push(id);
            testLibraryPage.clickOnAssign();
            testLibraryPage.assignPage.selectClass("Class");
            testLibraryPage.assignPage.clickOnAssign();
          });
        });
      });
    });
    before("> attempt the test", () => {
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
    });

    regrade_Options.forEach((option, optionsIndex) => {
      context(`> edit item and apply '${option}'`, () => {
        before("> login as teacher", () => {
          cy.login("teacher", Teacher.username, Teacher.password);
        });

        before("> edit test and apply regrade", () => {
          assignedtestids[optionsIndex].forEach(id => {
            testLibraryPage.visitTestById(id);
            testLibraryPage.publishedToDraftAssigned();
            testLibraryPage.getVersionedTestID().then(versionedtest => {
              versionedtestids[optionsIndex].push(versionedtest);
            });

            testLibraryPage.review.clickOnExpandRow();
            testLibraryPage.review.previewQuestById(itemId);
            testLibraryPage.review.previewItemPopUp.clickEditOnPreview();
            mcqMultiplePage.clickOnAdvancedOptions();
            mcqMultiplePage.getPanalty().type(`{selectall}1`, { force: true });
            mcqMultiplePage.header.saveAndgetId(true).then(itemversion => {
              cy.saveItemDetailToDelete(itemversion);
            });

            testLibraryPage.header.clickRegradePublish();
            regrade.checkRadioByValue(option);
            regrade.applyRegrade();
          });
        });

        context("> verify student side", () => {
          assignmentStatus.forEach((status, statusIndex) => {
            context(`> for Student${statusIndex + 1},'${status}'`, () => {
              before(">login", () => {
                optionsIndex = _.values(regradeOptions.edited).indexOf(option);
                cy.login(
                  "student",
                  students[`Student${statusIndex + 1}`].email,
                  students[`Student${statusIndex + 1}`].pass
                );
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
        });

        context("> verify teacher side", () => {
          before("> login and go to assignments", () => {
            cy.login("teacher", Teacher.username, Teacher.password);
          });
          assignmentStatus.forEach((sta, ind) => {
            attemptsData.push({
              stuName: students[`Student${ind + 1}`].name,
              attempt: {},
              status: studentSide.SUBMITTED
            });
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
                        attemptsData[assignmentStatus.indexOf(studentSide.SUBMITTED)].attempt.Q1 =
                          attemptTypes.MANUAL_GRADE;
                      else
                        attemptsData[assignmentStatus.indexOf(studentSide.SUBMITTED)].attempt.Q1 =
                          attemptTypes.PARTIAL_CORRECT;
                    }
                    optionsIndex = _.values(regradeOptions.edited).indexOf(option);
                    testLibraryPage.sidebar.clickOnAssignment();
                    authorAssignmentPage.clickOnLCBbyTestId(versionedtestids[optionsIndex][attemptIndex]);
                  });

                  it(`> verif lcb card view-`, () => {
                    cy.wait(3000);
                    lcb.verifyScoreByStudentIndex(
                      statusIndex,
                      data.teacher[status][`${option}`][`${attempt}`],
                      data.points
                    );

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
                    cy.wait(3000);
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
                    cy.wait(3000);
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
                        cy.wait(3000);
                        lcb.getQuestionCentricData(attemptsData, queCentric);
                        barGraphs.verifyQueBarBasedOnQueAttemptData(queCentric.Q1);
                      });

                      it("> verify student centric view", () => {
                        lcb.clickOnStudentsTab();
                        cy.wait(3000);
                        lcb.questionResponsePage.selectStudent(students[`Student${statusIndex + 1}`].name);
                        lcb.questionResponsePage.getTotalScore().should("have.text", data.manualpoints.toString());

                        barGraphs.verifyQueBarAndToolTipBasedOnAttemptData(attemptsData[statusIndex], ["Q1"]);
                      });

                      it(`> verify lcb card view-`, () => {
                        lcb.clickOnCardViewTab();
                        cy.wait(3000);
                        lcb.verifyScoreByStudentIndex(statusIndex, data.manualpoints, data.points);
                        lcb.verifyQuestionCards(statusIndex, [attemptTypes.PARTIAL_CORRECT]);
                        barGraphs.verifyQueBarAndToolTipBasedOnAttemptData(attemptsData, ["Q1"]);
                      });
                    });
                  }
                });
              });
            });
          });
        });
      });
    });
  });
});
