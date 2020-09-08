import FileHelper from "../../../../../framework/util/fileHelper";
import TestLibrary from "../../../../../framework/author/tests/testLibraryPage";
import Regrade from "../../../../../framework/author/tests/regrade/regrade";
import { regradeOptions, studentSide, teacherSide } from "../../../../../framework/constants/assignmentStatus";
import AuthorAssignmentPage from "../../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../../framework/author/assignments/LiveClassboardPage";

describe(`>${FileHelper.getSpecName(Cypress.spec.name)}> regrade settings- 'mark as done'`, () => {
  const testlibaryPage = new TestLibrary();
  const regrade = new Regrade();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const lcb = new LiveClassboardPage();

  const classes = ["Class-1", "Class-2"];
  const teacher = "teacher.regrade.markasdone@snapwiz.com";
  const students = {
    class1: {
      1: { email: "s1.c1.regrade.markasdone@snapwiz.com", status: studentSide.SUBMITTED, name: "Stu1Class1" },
      2: { email: "s2.c1.regrade.markasdone@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu2Class1" }
    },

    class2: {
      1: { email: "s1.c2.regrade.markasdone@snapwiz.com", status: studentSide.SUBMITTED, name: "Stu1Class2" },
      2: { email: "s2.c2.regrade.markasdone@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu2Class2" }
    }
  };
  const attemptsdata1 = [{ ...students.class1[1], overidden: false }, { ...students.class1[2], overidden: false }];
  const attemptsdata2 = [{ ...students.class2[1], overidden: true }, { ...students.class2[2], overidden: true }];
  let testId1;
  let testId2;
  let testId3;
  let assignmentid1;
  let assignmentid2;
  let versionedTest1;
  let versionedTest2;

  before("> create test 2 tests", () => {
    cy.login("teacher", teacher);
    // testlibaryPage.createTest().then(id => {
    testId1 = "5f325be9dca8d0000863c7f8";
    // });
  });

  context(`> select '${regradeOptions.settings.excludeOveridden}'`, () => {
    /* 
    before{
       assign class1 with mark as done automatically(defualt test setting)
       assign class2 with mark as done manually (overidden)

      mark one student from each as submitted to get versioned test
       edit test to have mark as done manaully and regrade with exclude overidden
    }

    test{
       after clisong test both assignments should be in GRADING
        mark as done option should not be disabled
    }
    */
    before("> assign without/with overiding", () => {
      cy.deleteAllAssignments("", teacher);
      testlibaryPage.searchAndClickTestCardById(testId1);
      testlibaryPage.clickOnDuplicate();
      testlibaryPage.header.clickOnPublishButton().then(id => {
        testId2 = id;

        testlibaryPage.clickOnAssign();
        testlibaryPage.assignPage.selectClass(classes[0]);
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignmentid1 = assignObj[testId2];

          testlibaryPage.assignPage.visitAssignPageById(testId2);
          testlibaryPage.assignPage.selectClass(classes[1]);
          testlibaryPage.assignPage.showOverRideSetting();
          testlibaryPage.assignPage.setMarkAsDoneToManual();
          testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
            assignmentid2 = assignObj[testId2];

            [...attemptsdata1, ...attemptsdata2]
              .filter(({ status }) => status === studentSide.SUBMITTED)
              .forEach(({ name, overidden }) => {
                testlibaryPage.sidebar.clickOnDashboard();
                testlibaryPage.sidebar.clickOnAssignment();
                authorAssignmentPage.clickOnLCBbyTestId(testId2, overidden ? assignmentid2 : assignmentid1);
                lcb.selectCheckBoxByStudentName(name);
                lcb.clickOnMarkAsSubmit();
              });
          });
        });
      });
    });

    context("> edit settings and regrade", () => {
      before("> login as teacher", () => {
        testlibaryPage.visitTestById(testId2);
        testlibaryPage.publishedToDraftAssigned();
        testlibaryPage.getVersionedTestID().then(id => {
          versionedTest1 = id;
        });

        testlibaryPage.header.clickOnSettings();
        testlibaryPage.testSettings.setMarkAsDoneManually();
        testlibaryPage.header.clickRegradePublish();

        /* select to eclude overidden test */
        regrade.checkRadioByValue(regradeOptions.settings.excludeOveridden);
        regrade.applyRegrade();
      });

      [attemptsdata1, attemptsdata2].forEach((studentsdata, index) => {
        it(`> verify 'mark as done' in lcb for '${index === 1 ? "" : "not "}overidden' assignment`, () => {
          testlibaryPage.sidebar.clickOnAssignment();
          authorAssignmentPage.clickOnLCBbyTestId(versionedTest1, index === 0 ? assignmentid1 : assignmentid2);
          lcb.header.clickOnClose();

          testlibaryPage.sidebar.clickOnTestLibrary();
          testlibaryPage.sidebar.clickOnAssignment();
          authorAssignmentPage.clickOnLCBbyTestId(versionedTest1, index === 0 ? assignmentid1 : assignmentid2);

          lcb.header.verifyAssignmentStatus(teacherSide.IN_GRADING);
          lcb.header.getDropDown().click({ force: true });
          lcb.header.getMarkAsDone().should("not.have.class", "ant-dropdown-menu-item-disabled");
        });
      });
    });
  });

  context(`> select '${regradeOptions.settings.chooseAll}'`, () => {
    /* 
    before{
       assign class1 with mark as done manually(defualt test setting)
       assign class2 with mark as done automatically (overidden)

      mark one student from each as submitted to get versioned test
       edit test to have mark as done automatically and regrade with choose all
    }

    test{
       after clisong test both assignments should be DONE
       mark as done option should be disabled
    }

    */
    before("> assign without/with overiding", () => {
      cy.deleteAllAssignments("", teacher);
      testlibaryPage.searchAndClickTestCardById(testId1);
      testlibaryPage.clickOnDuplicate();
      testlibaryPage.testSummary.setName("name");
      testlibaryPage.header.clickOnSaveButton(true);
      testlibaryPage.header.clickOnSettings();
      testlibaryPage.testSettings.setMarkAsDoneManually();
      testlibaryPage.header.clickOnPublishButton().then(id => {
        testId3 = id;
        testlibaryPage.clickOnAssign();
        testlibaryPage.assignPage.selectClass(classes[0]);
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignmentid1 = assignObj[testId3];

          testlibaryPage.assignPage.visitAssignPageById(testId3);
          testlibaryPage.assignPage.selectClass(classes[1]);
          testlibaryPage.assignPage.showOverRideSetting();
          testlibaryPage.assignPage.setMarkAsDoneToAutomatic();
          testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
            assignmentid2 = assignObj[testId3];

            [...attemptsdata1, ...attemptsdata2]
              .filter(({ status }) => status === studentSide.SUBMITTED)
              .forEach(({ name, overidden }) => {
                testlibaryPage.sidebar.clickOnDashboard();
                testlibaryPage.sidebar.clickOnAssignment();
                authorAssignmentPage.clickOnLCBbyTestId(testId3, overidden ? assignmentid2 : assignmentid1);
                lcb.selectCheckBoxByStudentName(name);
                lcb.clickOnMarkAsSubmit();
              });
          });
        });
      });
    });

    context("> edit settings and regrade", () => {
      before("> login as teacher", () => {
        testlibaryPage.visitTestById(testId3);
        testlibaryPage.publishedToDraftAssigned();
        testlibaryPage.getVersionedTestID().then(id => {
          versionedTest2 = id;
        });

        testlibaryPage.header.clickOnSettings();
        testlibaryPage.testSettings.setMarkAsDoneAutomatically();
        testlibaryPage.header.clickRegradePublish();

        /* select to choose all tests */
        regrade.checkRadioByValue(regradeOptions.settings.chooseAll);
        regrade.applyRegrade();
      });

      [attemptsdata1, attemptsdata2].forEach((studentsdata, index) => {
        it(`> verify 'mark as done' in lcb for '${index === 1 ? "" : "not "}overidden' assignment`, () => {
          testlibaryPage.sidebar.clickOnAssignment();
          authorAssignmentPage.clickOnLCBbyTestId(versionedTest2, index === 0 ? assignmentid1 : assignmentid2);
          lcb.header.clickOnClose();

          testlibaryPage.sidebar.clickOnTestLibrary();
          testlibaryPage.sidebar.clickOnAssignment();
          authorAssignmentPage.clickOnLCBbyTestId(versionedTest2, index === 0 ? assignmentid1 : assignmentid2);

          lcb.header.verifyAssignmentStatus(teacherSide.DONE);
          lcb.header.getDropDown().click({ force: true });
          lcb.header.getMarkAsDone().should("have.class", "ant-dropdown-menu-item-disabled");
        });
      });
    });
  });
});
