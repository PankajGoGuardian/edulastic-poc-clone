/* eslint-disable import/no-duplicates */
import Regrade from "../../../../framework/author/tests/regrade/regrade";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import FileHelper from "../../../../framework/util/fileHelper";
import { regradeOptions, studentSide, releaseGradeTypes } from "../../../../framework/constants/assignmentStatus";
import { attemptTypes } from "../../../../framework/constants/questionTypes";
import {
  duplicateAndAssignTests,
  verifyTeacherSide
} from "../../../../framework/author/tests/regrade/editedItemRegradeCommonFunctions";
import {
  studentAttemptBasedOnStatus,
  verifyStudentSide
} from "../../../../framework/author/tests/regrade/editedItemRegradeCommonFunctions";

const { MCQ_MULTI } = require("./../../../../../fixtures/questionAuthoring");
const { _ } = Cypress;

describe(`${FileHelper.getSpecName(Cypress.spec.name)}> test editing with applying regrade 'edited item'`, () => {
  const testLibraryPage = new TestLibrary();
  const regrade = new Regrade();

  const Teacher = {
    username: "teacher.regrade.review.updatepoints@snapwiz.com",
    password: "snapwiz"
  };
  const students = {
    Student1: {
      name: "Student1",
      email: "student1.review.regrade@snapwiz.com",
      pass: "snapwiz"
    },
    Student2: {
      name: "Student2",
      email: "student2.review.regrade@snapwiz.com",
      pass: "snapwiz"
    },
    Student3: {
      name: "Student3",
      email: "student3.review.regrade@snapwiz.com",
      pass: "snapwiz"
    }
  };

  const data = {
    points: 4,
    manualpoints: 1,
    student: {
      Submitted: {
        "skip-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
        "restore-grading": { right: 4, wrong: 0, skip: 0, partialCorrect: 2 },
        "manual-grading": { right: "", wrong: "", skip: "", partialCorrect: "" }
      },
      "In Progress": {
        "skip-grading": { right: 4, wrong: 0, skip: 0, partialCorrect: 2 },
        "restore-grading": { right: 4, wrong: 0, skip: 0, partialCorrect: 2 },
        "manual-grading": { right: 4, wrong: 0, skip: 0, partialCorrect: 2 }
      },
      "Not Started": {
        "skip-grading": { right: 4, wrong: 0, skip: 0, partialCorrect: 2 },
        "restore-grading": { right: 4, wrong: 0, skip: 0, partialCorrect: 2 },
        "manual-grading": { right: 4, wrong: 0, skip: 0, partialCorrect: 2 }
      }
    },
    teacher: {
      Submitted: {
        "skip-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
        "restore-grading": { right: 4, wrong: 0, skip: 0, partialCorrect: 2 },
        "manual-grading": { right: 0, wrong: 0, skip: 0, partialCorrect: 0 }
      },
      "In Progress": {
        "skip-grading": { right: 4, wrong: 0, skip: 0, partialCorrect: 2 },
        "restore-grading": { right: 4, wrong: 0, skip: 0, partialCorrect: 2 },
        "manual-grading": { right: 4, wrong: 0, skip: 0, partialCorrect: 2 }
      },
      "Not Started": {
        "skip-grading": { right: 4, wrong: 0, skip: 0, partialCorrect: 2 },
        "restore-grading": { right: 4, wrong: 0, skip: 0, partialCorrect: 2 },
        "manual-grading": { right: 4, wrong: 0, skip: 0, partialCorrect: 2 }
      }
    }
  };

  const attemptType = [attemptTypes.RIGHT];
  const assignmentStatus = [studentSide.SUBMITTED, studentSide.IN_PROGRESS];
  const regrade_Options = _.values(regradeOptions.edited);
  const assignedtestids = [];
  const versionedtestids = [];
  const testname = "REGRADE_EDITED_ITEM";
  const attemptData = MCQ_MULTI["5"].attemptData;

  let itemId;
  let testid;

  describe(`> regrade 'edited item' by 'updating points at test level'`, () => {
    before("create tests", () => {
      cy.deleteAllAssignments("", Teacher.username);
      cy.login("teacher", Teacher.username, Teacher.password);

      testLibraryPage.createTest(testname, false).then(id => {
        [itemId] = testLibraryPage.items;
        testid = id;
        testLibraryPage.header.clickOnSettings();
        testLibraryPage.testSettings.setRealeasePolicy(releaseGradeTypes.WITH_RESPONSE);
        testLibraryPage.header.clickOnPublishButton();

        duplicateAndAssignTests({ regrade_Options, testid, assignedtestids, versionedtestids, attemptType });
      });
    });

    before("> attempt by students based on status", () => {
      studentAttemptBasedOnStatus({ assignedtestids, testid, attemptType, assignmentStatus, students, attemptData });
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

            testLibraryPage.review.updatePointsByID(itemId, data.points);
            testLibraryPage.header.clickRegradePublish();
            regrade.checkRadioByValue(option);
            regrade.applyRegrade();
          });
        });

        context("> verify student side", () => {
          verifyStudentSide({ data, assignmentStatus, attemptType, students, versionedtestids, option, attemptData });
        });

        context("> verify teacher side", () => {
          before("> login and go to assignments", () => {
            cy.login("teacher", Teacher.username, Teacher.password);
          });
          verifyTeacherSide({ data, assignmentStatus, attemptType, students, versionedtestids, option, attemptData });
        });
      });
    });
  });
});
