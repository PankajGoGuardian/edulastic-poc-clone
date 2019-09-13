import TestLibrary from "../../framework/author/tests/testLibraryPage";
import AssignmentsPage from "../../framework/student/assignmentsPage";
import StudentTestPage from "../../framework/student/studentTestPage";
import LiveClassboardPage from "../../framework/author/assignments/LiveClassboardPage";
import AuthorAssignmentPage from "../../framework/author/assignments/AuthorAssignmentPage";
import TeacherSideBar from "../../framework/author/SideBarPage";
import FileHelper from "../../framework/util/fileHelper";
import { testTypes, releaseGradeTypes } from "../../framework/constants/assignmentStatus";
import ReportsPage from "../../framework/student/reportsPage";
import ItemListPage from "../../framework/author/itemList/itemListPage";

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Assignment Flows`, () => {
  const testLibrary = new TestLibrary();
  const testdata = {
    className: "Smoke Automation Class",
    teacher: "teacher1.smoke.automation@snapwiz.com",
    student: "student1.smoke.automation@snapwiz.com",
    password: "automation",
    assignmentName: "Smoke Test Assignment",
    attemptsData: [
      {
        email: "student1.smoke.automation@snapwiz.com",
        stuName: "student1 smoke",
        attempt: { Q1: "right", Q2: "right", Q3: "right" },
        status: "Submitted"
      },
      {
        email: "student2.smoke.automation@snapwiz.com",
        stuName: "student2 smoke",
        attempt: { Q1: "right", Q2: "wrong", Q3: "right" },
        status: "Submitted"
      },
      {
        email: "student3.smoke.automation@snapwiz.com",
        stuName: "student3 smoke",
        attempt: { Q1: "wrong", Q2: "wrong", Q3: "right" },
        status: "Submitted"
      },
      {
        email: "student4.smoke.automation@snapwiz.com",
        stuName: "student4 smoke",
        attempt: { Q1: "right", Q2: "partialCorrect", Q3: "wrong" },
        status: "Submitted"
      }
    ]
  };

  let questionData;
  let testData;
  const questionTypeMap = {};
  const statsMap = {};
  const { attemptsData, student, teacher, password, className } = testdata;
  const assessmentType = ["CLASS_ASSESSMENT", "PRACTICE_ASSESSMENT"];
  const report = new ReportsPage();
  const studentAssignment = new AssignmentsPage();
  const test = new StudentTestPage();
  const lcb = new LiveClassboardPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const teacherSideBar = new TeacherSideBar();
  const itemListPage = new ItemListPage();

  before("> create questionTypeMap", () => {
    cy.fixture("questionAuthoring").then(queData => {
      questionData = queData;
    });

    cy.fixture("testAuthoring").then(({ SMOKE_3 }) => {
      testData = SMOKE_3;
      const { itemKeys } = testData;
      itemKeys.forEach((queKey, index) => {
        const [queType, questionKey] = queKey.split(".");
        const { attemptData, standards } = questionData[queType][questionKey];
        const { points } = questionData[queType][questionKey].setAns;
        const queMap = { queKey, points, attemptData, standards };
        questionTypeMap[`Q${index + 1}`] = queMap;
      });
    });
  });

  before("> calculate student scores", () => {
    attemptsData.forEach(attempts => {
      const { attempt, stuName, status } = attempts;
      statsMap[stuName] = lcb.getScoreAndPerformance(attempt, questionTypeMap);
      statsMap[stuName].attempt = attempt;
      statsMap[stuName].status = status;
    });
  });

  assessmentType.forEach((aType, aIndex) => {
    context(`> assigned as - ${aType}`, () => {
      before("delete old assignment and assigned new", () => {
        cy.deleteAllAssignments(student, teacher, password);
        cy.login("teacher", teacher, password);
        if (aIndex === 0) {
          cy.fixture("testAuthoring").then(testData => {
            const test = testData.SMOKE_3;
            const { itemKeys, grade } = test;
            // create new test
            testLibrary.sidebar.clickOnTestLibrary();
            testLibrary.clickOnAuthorTest();

            // test description
            testLibrary.testSummary.setName(test.name);
            test.grade.forEach(grd => {
              testLibrary.testSummary.selectGrade(grd);
            });
            test.subject.forEach(subject => {
              testLibrary.testSummary.selectSubject(subject);
            });

            // create new items
            testLibrary.header.clickOnAddItems();
            testLibrary.searchFilters.routeSearch();

            cy.route("POST", "**api/test").as("createTest");
            test.itemKeys.forEach(async (itemKey, index) => {
              itemListPage.createItem(itemKey, index, false);
              if (index === 0) cy.wait("@createTest").then(xhr => testLibrary.saveTestId(xhr));
              testLibrary.searchFilters.waitForSearchResponse();
            });

            testLibrary.searchFilters.clearAll();
            testLibrary.testAddItem.authoredByMe().then(() => {
              testLibrary.searchFilters.setGrades(grade);
              itemKeys.forEach(itemKey => {
                testLibrary.testAddItem.verifyAddedItemByQuestionContent(itemKey);
              });
            });

            testLibrary.header.clickOnReview();
            cy.wait(2000);
            testLibrary.header.clickOnSaveButton(true);
            testLibrary.header.clickOnPublishButton();
            testLibrary.clickOnAssign();
            testLibrary.assignPage.selectClass(className);
            testLibrary.assignPage.selectTestType(testTypes[aType]);
            testLibrary.assignPage.clickOnAssign();
          });
        } else {
          teacherSideBar.clickOnTestLibrary();
          testLibrary.searchFilters.clearAll();
          testLibrary.searchFilters.getAuthoredByMe();
          cy.contains(testData.name).click({ force: true });
          testLibrary.clickOnAssign();
          testLibrary.assignPage.selectClass(className);
          testLibrary.assignPage.selectTestType(testTypes[aType]);
          testLibrary.assignPage.clickOnAssign();
        }
      });

      context("> verify student dashboard", () => {
        it("> verify assignment entry on student dashboard", () => {
          const { email } = attemptsData[0];
          cy.login("student", email, password);
          studentAssignment.validateAssignment(
            testData.name,
            "NOT STARTED",
            "START ASSIGNMENT",
            aType === "CLASS_ASSESSMENT" ? "A" : "P"
          );
        });

        it("> verify assignment filters", () => {
          studentAssignment.clickOnAllAssignments();
          studentAssignment.getAssignmentButton().should("be.visible");

          studentAssignment.clickOnNotStarted();
          studentAssignment.getAssignmentButton().should("be.visible");

          studentAssignment.clickOnInProgress();
          studentAssignment.getAssignmentButton().should("not.be.visible");

          /*  // inprogress
          studentAssignment.clickOnAllAssignments();
          studentAssignment.getAssignmentButton().click({ force: true });
          test.clickOnExitTest();
          test.clickOnProceed();
  
          studentAssignment.validateAssignment(testData.name, "IN PROGRESS", "RESUME", "A");
  
          studentAssignment.clickOnAllAssignments();
          studentAssignment.getAssignmentButton().should("be.visible");
  
          studentAssignment.clickOnNotStarted();
          studentAssignment.getAssignmentButton().should("not.be.visible");
  
          studentAssignment.clickOnInProgress();
          studentAssignment.getAssignmentButton().should("be.visible"); */
        });
      });

      context("> scoring policy - 'Do not release scores or responses'", () => {
        const { email, status, attempt, stuName } = attemptsData[0];

        it(`> attempt by ${stuName}`, () => {
          test.attemptAssignment(email, status, attempt, questionTypeMap, password);
        });

        it("> verify stats on report page", () => {
          report.validateAssignment(testData.name, "GRADED");
          report.validateStats("1", "1/1");
        });
      });

      context("> scoring policy - 'Release scores only'", () => {
        const { email, status, attempt, stuName } = attemptsData[1];

        it(`> teacher update release grade policy - ${releaseGradeTypes.SCORE_ONLY}`, () => {
          cy.login("teacher", teacher, password);
          teacherSideBar.clickOnAssignment();
          authorAssignmentPage.setReleaseGradeOption(releaseGradeTypes.SCORE_ONLY);
        });

        it(`> attempt by ${stuName}`, () => {
          test.attemptAssignment(email, status, attempt, questionTypeMap, password);
        });

        it("> verify stats on report page", () => {
          const { perfValue } = statsMap[stuName];
          report.validateAssignment(testData.name, "GRADED");
          report.validateStats("1", "1/1", undefined, perfValue);
        });
      });

      context("> scoring policy - 'Release scores and student responses'", () => {
        const { email, status, attempt, stuName } = attemptsData[2];

        it(`> teacher update release grade policy - ${releaseGradeTypes.WITH_RESPONSE}`, () => {
          cy.login("teacher", teacher, password);
          teacherSideBar.clickOnAssignment();
          authorAssignmentPage.setReleaseGradeOption(releaseGradeTypes.WITH_RESPONSE);
        });

        it(`> attempt by ${stuName}`, () => {
          test.attemptAssignment(email, status, attempt, questionTypeMap, password);
        });

        it("> verify stats on report page", () => {
          const { perfValue } = statsMap[stuName];
          report.validateAssignment(testData.name, "GRADED", "REVIEW");
          report.validateStats("1", "1/1", undefined, perfValue);
        });

        it("> review assignment", () => {
          report.clickOnReviewButtonButton();
          report.verifyQuetionCard(stuName, attempt, questionTypeMap, releaseGradeTypes.WITH_RESPONSE);
        });
      });

      context("> scoring policy - 'Release scores,student responses and correct answers'", () => {
        const { email, status, attempt, stuName } = attemptsData[3];

        it(`> teacher update release grade policy - ${releaseGradeTypes.WITH_ANSWERS}`, () => {
          // cy.login("student", email, password);
          cy.login("teacher", teacher, password);
          teacherSideBar.clickOnAssignment();
          authorAssignmentPage.setReleaseGradeOption(releaseGradeTypes.WITH_ANSWERS);
        });

        it(`> attempt by ${stuName}`, () => {
          test.attemptAssignment(email, status, attempt, questionTypeMap, password);
        });

        it("> verify stats on report page", () => {
          const { score, perfValue } = statsMap[stuName];
          report.validateAssignment(testData.name, "GRADED", "REVIEW");
          report.validateStats("1", "1/1", score, perfValue);
        });

        it("> review assignment", () => {
          report.clickOnReviewButtonButton();
          report.verifyQuetionCard(stuName, attempt, questionTypeMap, releaseGradeTypes.WITH_ANSWERS);
        });
      });
    });
  });
});
