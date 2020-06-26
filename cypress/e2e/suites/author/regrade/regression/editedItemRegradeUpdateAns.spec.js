/* eslint-disable import/no-duplicates */
import Regrade from "../../../../framework/author/tests/regrade/regrade";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import FileHelper from "../../../../framework/util/fileHelper";
import { regradeOptions, studentSide, releaseGradeTypes } from "../../../../framework/constants/assignmentStatus";
import { attemptTypes } from "../../../../framework/constants/questionTypes";
import MCQMultiplePage from "../../../../framework/author/itemList/questionType/mcq/mcqMultiplePage";
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
  const mcqMultiplePage = new MCQMultiplePage();
  const regrade = new Regrade();

  const Teacher = {
    username: "teacher.regrade.edited.updateans@snapwiz.com",
    password: "snapwiz"
  };
  const students = {
    Student1: {
      name: "Student1",
      email: "student1.updateans.regrade@snapwiz.com",
      pass: "snapwiz"
    },
    Student2: {
      name: "Student2",
      email: "student2.updateans.regrade@snapwiz.com",
      pass: "snapwiz"
    },
    Student3: {
      name: "Student3",
      email: "student3.updateans.regrade@snapwiz.com",
      pass: "snapwiz"
    }
  };

  const data = {
    points: 2,
    manualpoints: 1,
    student: {
      Submitted: {
        "skip-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
        "restore-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
        "manual-grading": { right: "", wrong: "", skip: "", partialCorrect: "" }
      },
      "In Progress": {
        "skip-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
        "restore-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
        "manual-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 }
      },
      "Not Started": {
        "skip-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
        "restore-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
        "manual-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 }
      }
    },
    teacher: {
      Submitted: {
        "skip-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
        "restore-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
        "manual-grading": { right: 0, wrong: 0, skip: 0, partialCorrect: 0 }
      },
      "In Progress": {
        "skip-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
        "restore-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
        "manual-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 }
      },
      "Not Started": {
        "skip-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
        "restore-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 },
        "manual-grading": { right: 2, wrong: 0, skip: 0, partialCorrect: 1 }
      }
    }
  };

  const attemptType = [attemptTypes.RIGHT, attemptTypes.WRONG];
  const assignmentStatus = [studentSide.SUBMITTED, studentSide.IN_PROGRESS];
  const regrade_Options = _.values(regradeOptions.edited);
  const assignedtestids = [];
  const versionedtestids = [];
  const testname = "REGRADE_EDITED_ITEM";
  const oldCorrectAns = MCQ_MULTI["5"].setAns.correct;
  const newCorrectAns = MCQ_MULTI["6"].setAns.correct;
  const attemptData = MCQ_MULTI["5"].attemptData;
  const updatedAttempData = MCQ_MULTI["6"].attemptData;
  let itemId;
  let testid;

  describe(`> regrade 'edited item' by 'updating correct ans at item level'`, () => {
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

            testLibraryPage.review.clickOnExpandRow();
            testLibraryPage.review.previewQuestById(itemId);
            testLibraryPage.review.previewItemPopUp.clickEditOnPreview();
            mcqMultiplePage.setCorrectAns(oldCorrectAns);
            mcqMultiplePage.setCorrectAns(newCorrectAns);
            mcqMultiplePage.header.saveAndgetId(true).then(itemversion => {
              cy.saveItemDetailToDelete(itemversion);
            });

            testLibraryPage.header.clickRegradePublish();
            regrade.checkRadioByValue(option);
            regrade.applyRegrade();
          });
        });

        context("> verify student side", () => {
          verifyStudentSide({
            data,
            assignmentStatus,
            attemptType,
            students,
            versionedtestids,
            option,
            attemptData: updatedAttempData
          });
        });

        context("> verify teacher side", () => {
          before("> login and go to assignments", () => {
            cy.login("teacher", Teacher.username, Teacher.password);
          });
          verifyTeacherSide({
            data,
            assignmentStatus,
            attemptType,
            students,
            versionedtestids,
            option,
            attemptData: updatedAttempData,
            updatedCorrectAns: true
          });
        });
      });
    });
  });
});
