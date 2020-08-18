import FileHelper from "../../../../../framework/util/fileHelper";
import TestLibrary from "../../../../../framework/author/tests/testLibraryPage";
import Regrade from "../../../../../framework/author/tests/regrade/regrade";
import { regradeOptions, studentSide } from "../../../../../framework/constants/assignmentStatus";
import AuthorAssignmentPage from "../../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../../framework/author/assignments/LiveClassboardPage";
import { attemptTypes } from "../../../../../framework/constants/questionTypes";
import StudentsReportCard from "../../../../../framework/author/assignments/studentPdfReportCard";

describe(`>${FileHelper.getSpecName(Cypress.spec.name)}> regrade settings- 'performance band'`, () => {
  const testlibaryPage = new TestLibrary();
  const regrade = new Regrade();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const lcb = new LiveClassboardPage();
  const pdfReportCard = new StudentsReportCard();

  const { _ } = Cypress;
  const classes = ["Class-1", "Class-2"];
  const teacher = "teacher.regrade.perfband@snapwiz.com";
  const students = {
    class1: {
      1: { email: "s1.c1.regrade.perfband@snapwiz.com", status: studentSide.SUBMITTED, name: "Stu1Class1" },
      2: { email: "s2.c1.regrade.perfband@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu2Class1" },
      3: { email: "s3.c1.regrade.perfband@snapwiz.com", status: studentSide.NOT_STARTED, name: "Stu3Class1" }
    },

    class2: {
      1: { email: "s1.c2.regrade.perfband@snapwiz.com", status: studentSide.SUBMITTED, name: "Stu1Class2" },
      2: { email: "s2.c2.regrade.perfband@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu2Class2" },
      3: { email: "s3.c2.regrade.perfband@snapwiz.com", status: studentSide.NOT_STARTED, name: "Stu3Class2" }
    }
  };
  const attemptsdata1 = [
    { attempt: attemptTypes.RIGHT, ...students.class1[1], overidden: false },
    { attempt: attemptTypes.PARTIAL_CORRECT, ...students.class1[2], overidden: false },
    { attempt: attemptTypes.WRONG, ...students.class1[3], overidden: false }
  ];

  const attemptsdata2 = [
    { attempt: attemptTypes.RIGHT, ...students.class2[1], overidden: true },
    { attempt: attemptTypes.PARTIAL_CORRECT, ...students.class2[2], overidden: true },
    { attempt: attemptTypes.WRONG, ...students.class2[3], overidden: true }
  ];
  const performanceBand = {
    Automation_1: {
      right: "Proficient auto-1",
      wrong: "Basic auto-1",
      partialCorrect: "Proficient auto-1"
    },
    Automation_2: {
      right: "Proficient auto-2",
      wrong: "Basic auto-2",
      partialCorrect: "Basic auto-2"
    },
    Automation_3: {
      right: "Proficient auto-3",
      wrong: "Basic auto-3",
      partialCorrect: "Proficient auto-3"
    }
  };
  const scores = {
    right: 1,
    wrong: 0,
    partialCorrect: 0.65
  };

  const testLevelBand = _.keys(performanceBand)[0];
  const overiddenBand = _.keys(performanceBand)[1];
  const regradedBand = _.keys(performanceBand)[2];

  let testId1;
  let testId2;
  let testId3;

  let assignmentid1;
  let assignmentid2;
  let versionedTest1;
  let versionedTest2;

  before("> create test 2 tests", () => {
    cy.login("teacher", teacher);
    testlibaryPage.createTest().then(id => {
      testId1 = id;
    });
  });

  context(`> select '${regradeOptions.settings.excludeOveridden}'`, () => {
    /* 
    before{
       assign class1 with automation_1 performance band(test setting)
       assign class2 with automation_2 performance band(overidden)

       mark as submit one student in each class
       edit test to have automation_3 performance band regrade with exclude overidden
    }

    test{
       class1 should have automation_3 performance band
        class2 should have automation_2 performance band
    }
    */
    before("> assign without/with overiding", () => {
      cy.deleteAllAssignments("", teacher);
      testlibaryPage.searchAndClickTestCardById(testId1);
      testlibaryPage.clickOnDuplicate();
      testlibaryPage.testSummary.setName("name");
      testlibaryPage.header.clickOnSaveButton(true);
      testlibaryPage.header.clickOnSettings();
      testlibaryPage.testSettings.selectPerformanceBand(testLevelBand);
      testlibaryPage.header.clickOnPublishButton().then(id => {
        testId2 = id;

        testlibaryPage.clickOnAssign();
        testlibaryPage.assignPage.selectClass(classes[0]);
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignmentid1 = assignObj[testId2];

          testlibaryPage.assignPage.visitAssignPageById(testId2);
          testlibaryPage.assignPage.selectClass(classes[1]);
          testlibaryPage.assignPage.showOverRideSetting();
          testlibaryPage.assignPage.selectPerformanceBand(overiddenBand);
          testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
            assignmentid2 = assignObj[testId2];

            [...attemptsdata1, ...attemptsdata2]
              .filter(({ status }) => status === studentSide.SUBMITTED)
              .forEach(({ name, overidden }) => {
                testlibaryPage.sidebar.clickOnAssignment();
                authorAssignmentPage.clickOnLCBbyTestId(testId2, overidden ? assignmentid2 : assignmentid1);
                lcb.selectCheckBoxByStudentName(name);
                lcb.clickOnMarkAsSubmit();
                cy.wait("@assignment");

                lcb.clickonQuestionsTab();
                lcb.questionResponsePage.updateScoreAndFeedbackForStudent(name, scores.right);
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

          testlibaryPage.header.clickOnSettings();
          testlibaryPage.testSettings.selectPerformanceBand(regradedBand);
          testlibaryPage.header.clickRegradePublish();

          /* select to eclude overidden test */
          regrade.checkRadioByValue(regradeOptions.settings.excludeOveridden);
          regrade.applyRegrade();

          [...attemptsdata1, ...attemptsdata2]
            .filter(({ status }) => status !== studentSide.SUBMITTED)
            .forEach(({ name, overidden, attempt }) => {
              testlibaryPage.sidebar.clickOnAssignment();
              authorAssignmentPage.clickOnLCBbyTestId(versionedTest1, overidden ? assignmentid2 : assignmentid1);
              lcb.selectCheckBoxByStudentName(name);
              lcb.clickOnMarkAsSubmit();
              cy.wait("@assignment");

              lcb.clickonQuestionsTab();
              lcb.questionResponsePage.updateScoreAndFeedbackForStudent(name, scores[attempt]);
            });
        });
      });

      [attemptsdata1, attemptsdata2].forEach(studentdata => {
        context(`> verify lcb/reports '${studentdata[0].overidden === 0 ? "not " : ""}overidden' assignment`, () => {
          before("> click on lcb", () => {
            const assignmentid = studentdata[0].overidden ? assignmentid2 : assignmentid1;
            testlibaryPage.sidebar.clickOnAssignment();
            authorAssignmentPage.clickOnLCBbyTestId(versionedTest1, assignmentid);
          });

          it("> verify regraded performance band in lcb settings", () => {
            const band = studentdata[0].overidden ? overiddenBand : regradedBand;
            lcb.header.clickLCBSettings();
            lcb.settings.showTestLevelSettings();
            lcb.settings.verifySelectedPerformanceBand(band);
          });

          context("> verify regraded bands in pdf-reports", () => {
            before("> click reports in drop down", () => {
              lcb.header.clickOnLCBTab();
              lcb.header.clickStudentReportInDropDown();
              pdfReportCard.clickReportGeanerateButton();
            });
            studentdata.forEach(({ status, name, attempt }) => {
              const band = studentdata[0].overidden ? overiddenBand : regradedBand;
              const bands = performanceBand[band];
              it(`> for student ${status},expected- '${bands[attempt]}'`, () => {
                pdfReportCard.getReportContainerByStudent(name);
                pdfReportCard.getPerformanceBand().should("have.text", bands[attempt]);
              });
            });
          });
        });
      });
    });
  });

  context(`> select '${regradeOptions.settings.chooseAll}'`, () => {
    /* 
    before{
       assign class1 with automation_1 performance band(test setting)
       assign class2 with automation_2 performance band(overidden)

       mark as submit one student in each class
       edit test to have automation_3 performance band regrade with choose all
    }

    test{
       class1 should have automation_3 performance band
        class2 should have automation_3 performance band
    }
    */
    before("> assign without/with overiding", () => {
      cy.deleteAllAssignments("", teacher);
      testlibaryPage.searchAndClickTestCardById(testId1);
      testlibaryPage.clickOnDuplicate();
      testlibaryPage.testSummary.setName("name");
      testlibaryPage.header.clickOnSaveButton(true);
      testlibaryPage.header.clickOnSettings();
      testlibaryPage.testSettings.selectPerformanceBand(testLevelBand);
      testlibaryPage.header.clickOnPublishButton().then(id => {
        testId3 = id;

        testlibaryPage.clickOnAssign();
        testlibaryPage.assignPage.selectClass(classes[0]);
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignmentid1 = assignObj[testId3];

          testlibaryPage.assignPage.visitAssignPageById(testId3);
          testlibaryPage.assignPage.selectClass(classes[1]);
          testlibaryPage.assignPage.showOverRideSetting();
          testlibaryPage.assignPage.selectPerformanceBand(overiddenBand);
          testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
            assignmentid2 = assignObj[testId3];

            [...attemptsdata1, ...attemptsdata2]
              .filter(({ status }) => status === studentSide.SUBMITTED)
              .forEach(({ name, overidden }) => {
                testlibaryPage.sidebar.clickOnAssignment();
                authorAssignmentPage.clickOnLCBbyTestId(testId3, overidden ? assignmentid2 : assignmentid1);
                lcb.selectCheckBoxByStudentName(name);
                lcb.clickOnMarkAsSubmit();
                cy.wait("@assignment");

                lcb.clickonQuestionsTab();
                lcb.questionResponsePage.updateScoreAndFeedbackForStudent(name, scores.right);
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

          testlibaryPage.header.clickOnSettings();
          testlibaryPage.testSettings.selectPerformanceBand(regradedBand);
          testlibaryPage.header.clickRegradePublish();

          /* select to eclude overidden test */
          regrade.checkRadioByValue(regradeOptions.settings.chooseAll);
          regrade.applyRegrade();

          [...attemptsdata1, ...attemptsdata2]
            .filter(({ status }) => status !== studentSide.SUBMITTED)
            .forEach(({ name, overidden, attempt }) => {
              testlibaryPage.sidebar.clickOnAssignment();
              authorAssignmentPage.clickOnLCBbyTestId(versionedTest2, overidden ? assignmentid2 : assignmentid1);
              lcb.selectCheckBoxByStudentName(name);
              lcb.clickOnMarkAsSubmit();
              cy.wait("@assignment");

              lcb.clickonQuestionsTab();
              lcb.questionResponsePage.updateScoreAndFeedbackForStudent(name, scores[attempt]);
            });
        });
      });

      [attemptsdata1, attemptsdata2].forEach(studentdata => {
        context(`> verify lcb/reports '${studentdata[0].overidden === 0 ? "not " : ""}overidden' assignment`, () => {
          before("> click on lcb", () => {
            // cy.login("teacher", teacher);
            const assignmentid = studentdata[0].overidden ? assignmentid2 : assignmentid1;
            testlibaryPage.sidebar.clickOnAssignment();
            authorAssignmentPage.clickOnLCBbyTestId(versionedTest2, assignmentid);
          });

          it("> verify regraded performance band in lcb settings", () => {
            lcb.header.clickLCBSettings();
            lcb.settings.showTestLevelSettings();
            lcb.settings.verifySelectedPerformanceBand(regradedBand);
          });

          context("> verify regraded bands in pdf-reports", () => {
            before("> click reports in drop down", () => {
              lcb.header.clickOnLCBTab();
              lcb.header.clickStudentReportInDropDown();
              pdfReportCard.clickReportGeanerateButton();
            });
            studentdata.forEach(({ status, name, attempt }) => {
              const bands = performanceBand[regradedBand];
              it(`> for student ${status}, expected- ${bands[attempt]}`, () => {
                pdfReportCard.getReportContainerByStudent(name);
                pdfReportCard.getPerformanceBand().should("have.text", bands[attempt]);
              });
            });
          });
        });
      });
    });
  });
});
