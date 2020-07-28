import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import ExpressGraderPage from "../../../../framework/author/assignments/expressGraderPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import Regrade from "../../../../framework/author/tests/regrade/regrade";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import ReportsPage from "../../../../framework/student/reportsPage";
import FileHelper from "../../../../framework/util/fileHelper";
import CypressHelper from "../../../../framework/util/cypressHelpers";
import { regradeOptions, studentSide, releaseGradeTypes } from "../../../../framework/constants/assignmentStatus";
import ItemListPage from "../../../../framework/author/itemList/itemListPage";
import { attemptTypes } from "../../../../framework/constants/questionTypes";

const { MCQ_MULTI } = require("./../../../../../fixtures/questionAuthoring");

describe(`${FileHelper.getSpecName(Cypress.spec.name)} test editing with applying regrade 'added item'`, () => {
  const testLibraryPage = new TestLibrary();
  const assignmentsPage = new AssignmentsPage();
  const studentTestPage = new StudentTestPage();
  const itemListPage = new ItemListPage();
  const regrade = new Regrade();
  const lcb = new LiveClassboardPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const expressGrader = new ExpressGraderPage();
  const reportsPage = new ReportsPage();

  const attemptData = MCQ_MULTI["5"].attemptData;
  const Teacher = {
    username: "teacher.for.regrade.addeditem@snapwiz.com",
    password: "snapwiz"
  };
  const students = {
    Student1: {
      name: "Student1",
      email: "student1.for.regrade.added@snapwiz.com",
      pass: "snapwiz"
    },
    Student2: {
      name: "Student2",
      email: "student2.for.regrade.added@snapwiz.com",
      pass: "snapwiz"
    },
    Student3: {
      name: "Student3",
      email: "student3.for.regrade.added@snapwiz.com",
      pass: "snapwiz"
    }
  };

  const data = {
    student: {
      Submitted: {
        "no-points": { right: 0, wrong: 0, skip: 0, partialCorrect: 0 },
        "full-points": { right: 2, wrong: 2, skip: 2, partialCorrect: 2 },
        "manual-points": { right: "", wrong: "", skip: "", partialCorrect: "" }
      },
      "In Progress": {
        "no-points": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
        "full-points": { right: 2, wrong: 1, skip: 0, partialCorrect: 1 },
        "manual-points": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 }
      },
      "Not Started": {
        "no-points": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
        "full-points": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
        "manual-points": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 }
      }
    },
    teacher: {
      Submitted: {
        "no-points": {
          right: { acieved: 0, total: 4 },
          wrong: { acieved: 0, total: 4 },
          skip: { acieved: 0, total: 4 },
          partialCorrect: { acieved: 0, total: 4 }
        },
        "full-points": {
          right: { acieved: 2, total: 4 },
          wrong: { acieved: 2, total: 4 },
          skip: { acieved: 2, total: 4 },
          partialCorrect: { acieved: 2, total: 4 }
        },
        "manual-points": {
          right: { acieved: 0, total: 4 },
          wrong: { acieved: 0, total: 4 },
          skip: { acieved: 0, total: 4 },
          partialCorrect: { acieved: 0, total: 4 }
        }
      },
      "In Progress": {
        "no-points": {
          right: { acieved: 2, total: 4 },
          wrong: { acieved: 0, total: 4 },
          skip: { acieved: 0, total: 4 },
          partialCorrect: { acieved: 1, total: 4 }
        },
        "full-points": {
          right: { acieved: 2, total: 4 },
          wrong: { acieved: 0, total: 4 },
          skip: { acieved: 0, total: 4 },
          partialCorrect: { acieved: 1, total: 4 }
        },
        "manual-points": {
          right: { acieved: 2, total: 4 },
          wrong: { acieved: 0, total: 4 },
          skip: { acieved: 0, total: 4 },
          partialCorrect: { acieved: 1, total: 4 }
        }
      },
      "Not Started": {
        "no-points": {
          right: { acieved: 2, total: 4 },
          wrong: { acieved: 0, total: 4 },
          skip: { acieved: 0, total: 4 },
          partialCorrect: { acieved: 1, total: 4 }
        },
        "full-points": {
          right: { acieved: 2, total: 4 },
          wrong: { acieved: 0, total: 4 },
          skip: { acieved: 0, total: 4 },
          partialCorrect: { acieved: 1, total: 4 }
        },
        "manual-points": {
          right: { acieved: 2, total: 4 },
          wrong: { acieved: 0, total: 4 },
          skip: { acieved: 0, total: 4 },
          partialCorrect: { acieved: 1, total: 4 }
        }
      }
    }
  };
  const { _ } = Cypress;
  const manualPoints = "2";

  const attemptType = [attemptTypes.SKIP, attemptTypes.PARTIAL_CORRECT];
  const assignmentStatus = [studentSide.SUBMITTED, studentSide.IN_PROGRESS];
  const addedItemRegradeOptions = _.values(regradeOptions.added);
  const assignedtestids = [];
  const versionedtestids = [];

  let itemId;
  let testid;
  let title;

  before(">set variables", () => {
    addedItemRegradeOptions.forEach(() => {
      assignedtestids.push([]);
      versionedtestids.push([]);
    });
  });

  before(">create test", () => {
    cy.getAllTestsAndDelete(Teacher.username);
    cy.getAllItemsAndDelete(Teacher.username);
    cy.login("teacher", Teacher.username, Teacher.password);
    testLibraryPage.createTest("LCB_2", false).then(id => {
      testid = id;
      testLibraryPage.header.clickOnSettings();
      testLibraryPage.testSettings.setRealeasePolicy(releaseGradeTypes.WITH_RESPONSE);
      testLibraryPage.header.clickOnPublishButton();
    });
  });

  describe(`> regrade type-'added item'`, () => {
    before("> create tests", () => {
      cy.deleteAllAssignments("", Teacher.username);
      cy.login("teacher", Teacher.username, Teacher.password);
      addedItemRegradeOptions.forEach((regOption, ind) => {
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

    before("> attempt all test and submit", () => {
      assignmentStatus.forEach((status, ind) => {
        if (status !== studentSide.NOT_STARTED) {
          cy.login("student", students[`Student${ind + 1}`].email, students[`Student${ind + 1}`].pass);
          assignedtestids.forEach(testset => {
            testset.forEach((id, ind) => {
              assignmentsPage.sidebar.clickOnAssignment();
              assignmentsPage.clickOnAssigmentByTestId(id);
              if (status === studentSide.SUBMITTED) {
                studentTestPage.clickOnNext(false, true);
                studentTestPage.submitTest();
              } else studentTestPage.clickOnExitTest();
            });
          });
        }
      });
    });

    addedItemRegradeOptions.forEach((option, optionsIndex) => {
      context(`> add item and apply '${option}'`, () => {
        before("> create new item", () => {
          cy.login("teacher", Teacher.username, Teacher.password);
          itemListPage.createItem("MCQ_MULTI.5").then(id => {
            itemId = id;
          });
        });

        before("> edit test and apply regrade", () => {
          assignedtestids[optionsIndex].forEach(id => {
            testLibraryPage.visitTestById(id);
            testLibraryPage.publishedToDraftAssigned(false);
            testLibraryPage.getVersionedTestID().then(versionedtest => {
              versionedtestids[optionsIndex].push(versionedtest);
            });

            testLibraryPage.header.clickOnAddItems();
            testLibraryPage.testAddItem.searchFilters.clearAll();
            testLibraryPage.testAddItem.addItemById(itemId);

            testLibraryPage.header.clickRegradePublish();
            regrade.checkRadioByValue(option);
            regrade.applyRegrade();
          });
        });

        context("> verify student side", () => {
          assignmentStatus.forEach((status, statusIndex) => {
            context(`> for Student${statusIndex + 1},'${status}'`, () => {
              before(">login", () => {
                cy.login(
                  "student",
                  students[`Student${statusIndex + 1}`].email,
                  students[`Student${statusIndex + 1}`].pass
                );
              });
              attemptType.forEach((attempt, attempIndex) => {
                if (!(status === studentSide.SUBMITTED && attempIndex > 0)) {
                  title = status !== studentSide.SUBMITTED ? `and attempt as '${attempt}'` : "";
                  it(`> verifiying added question ${title}`, () => {
                    if (status !== studentSide.SUBMITTED) {
                      assignmentsPage.sidebar.clickOnAssignment();
                      assignmentsPage.clickOnAssigmentByTestId(versionedtestids[optionsIndex][attempIndex]);
                      studentTestPage.getQuestionByIndex(1, true);

                      studentTestPage.attemptQuestion("MCQ_MULTI", attempt, attemptData);
                      studentTestPage.clickOnNext(false, attempt === attemptTypes.SKIP);
                      studentTestPage.submitTest();
                    } else assignmentsPage.sidebar.clickOnGrades();

                    reportsPage.verifyPercentageOnTestCardByTestId(
                      versionedtestids[optionsIndex][attempIndex],
                      _.round(
                        (data.teacher[status][`${option}`][`${attempt}`].acieved /
                          data.teacher[status][`${option}`][`${attempt}`].total) *
                          100,
                        2
                      )
                    );

                    reportsPage.clickOnReviewButtonButtonByTestId(versionedtestids[optionsIndex][attempIndex]);
                    reportsPage.verifyAchievedScoreOfQueByIndex(1, data.student[status][`${option}`][`${attempt}`]);
                    reportsPage.verifyMaxScoreOfQueByIndex(1, 2);
                  });
                }
              });
            });
          });
        });

        context("> verify teacher side", () => {
          before("> login and go to assignments", () => {
            cy.login("teacher", Teacher.username, Teacher.password);
          });

          assignmentStatus.forEach((status, statusIndex) => {
            context(`> for Student${statusIndex + 1},'${status}'`, () => {
              attemptType.forEach((attempt, attemptIndex) => {
                title = status !== studentSide.SUBMITTED ? `, attempted as '${attempt}'` : "";
                if (!(status === studentSide.SUBMITTED && attemptIndex > 0)) {
                  context(`> verify added question${title}`, () => {
                    before(">click assignments", () => {
                      testLibraryPage.sidebar.clickOnAssignment();
                      authorAssignmentPage.clickOnLCBbyTestId(versionedtestids[optionsIndex][attemptIndex]);
                    });

                    it(`> verif lcb card view-`, () => {
                      lcb
                        .getStudentScoreByIndex(statusIndex)
                        .should(
                          "contain.text",
                          `${data.teacher[status][`${option}`][`${attempt}`].acieved} / ${
                            data.teacher[status][`${option}`][`${attempt}`].total
                          }`
                        );

                      lcb
                        .getQuestionsByIndex(0)
                        .find("div")
                        .should("have.length", 2);
                    });

                    it("> verify student centric view", () => {
                      lcb.clickOnStudentsTab();
                      lcb.questionResponsePage.selectStudent(students[`Student${statusIndex + 1}`].name);

                      lcb.questionResponsePage
                        .getTotalScore()
                        .should("have.text", `${data.teacher[status][`${option}`][`${attempt}`].acieved}`);

                      lcb.questionResponsePage
                        .getMaxScore()
                        .should("have.text", `${data.teacher[status][`${option}`][`${attempt}`].total}`);
                    });

                    it("> verify Question centric view", () => {
                      lcb.clickonQuestionsTab();
                      lcb.questionResponsePage.getDropDown().click({ force: true });

                      CypressHelper.getDropDownList().then(questions => {
                        expect(questions).to.have.lengthOf(2);
                      });
                      lcb.questionResponsePage.selectQuestion("Q2");

                      lcb.questionResponsePage
                        .getQuestionContainerByStudent(students[`Student${statusIndex + 1}`].name)
                        .as("updatecard");

                      lcb.questionResponsePage
                        .getScoreInput(cy.get("@updatecard"))
                        .should("have.value", `${data.student[status][`${option}`][`${attempt}`]}`);
                    });

                    it("> verify express grader view", () => {
                      lcb.header.clickOnExpressGraderTab();

                      expressGrader.getGridRowByStudent(students[`Student${statusIndex + 1}`].name);
                      expressGrader.verifyScoreAndPerformance(
                        `${data.teacher[status][`${option}`][`${attempt}`].acieved}/${
                          data.teacher[status][`${option}`][`${attempt}`].total
                        }`,
                        _.round(
                          (data.teacher[status][`${option}`][`${attempt}`].acieved /
                            data.teacher[status][`${option}`][`${attempt}`].total) *
                            100,
                          2
                        )
                      );

                      expressGrader.verifyNumberOfQuestions(2);
                    });

                    if (option === regradeOptions.added.MANUAL_POINTS && status === studentSide.SUBMITTED) {
                      context("> update and verify points in question centric view", () => {
                        it("> upadate score and verify in question centric view", () => {
                          lcb.header.clickOnLCBTab();
                          lcb.clickonQuestionsTab();

                          lcb.questionResponsePage.selectQuestion("Q2");
                          lcb.questionResponsePage.updateScoreAndFeedbackForStudent(
                            students[`Student${statusIndex + 1}`].name,
                            manualPoints
                          );
                        });

                        it("> verify student centric view", () => {
                          lcb.clickOnStudentsTab();
                          lcb.questionResponsePage.selectStudent(students[`Student${statusIndex + 1}`].name);
                          lcb.questionResponsePage.getTotalScore().should("have.text", manualPoints.toString());
                        });

                        it(`> verif lcb card view-`, () => {
                          lcb.clickOnCardViewTab();
                          lcb
                            .getStudentScoreByIndex(statusIndex)
                            .should(
                              "contain.text",
                              `${manualPoints} / ${data.teacher[status][`${option}`][`${attempt}`].total}`
                            );
                        });
                      });
                    }
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
