import FileHelper from "../../../../../framework/util/fileHelper";
import TestLibrary from "../../../../../framework/author/tests/testLibraryPage";
import Regrade from "../../../../../framework/author/tests/regrade/regrade";
import { regradeOptions, studentSide, ASSESSMENT_PLAYERS } from "../../../../../framework/constants/assignmentStatus";
import StudentTestPage from "../../../../../framework/student/studentTestPage";
import AssignmentsPage from "../../../../../framework/student/assignmentsPage";
import AuthorAssignmentPage from "../../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../../framework/author/assignments/LiveClassboardPage";

describe(`>${FileHelper.getSpecName(Cypress.spec.name)}> regrade settings- 'assessment players'`, () => {
  const testlibaryPage = new TestLibrary();
  const regrade = new Regrade();
  const studentTestPage = new StudentTestPage();
  const assignmentsPage = new AssignmentsPage();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const lcb = new LiveClassboardPage();

  const classes = ["Class-1", "Class-2"];
  const teacher = "teacher.regrade.player@snapwiz.com";
  const students = {
    class1: {
      1: { email: "s1.c1.regrade.player@snapwiz.com", status: studentSide.SUBMITTED, name: "Stu1Class1" },
      2: { email: "s2.c1.regrade.player@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu2Class1" },
      3: { email: "s3.c1.regrade.player@snapwiz.com", status: studentSide.NOT_STARTED, name: "Stu3Class1" }
    },

    class2: {
      1: { email: "s1.c2.regrade.player@snapwiz.com", status: studentSide.SUBMITTED, name: "Stu1Class2" },
      2: { email: "s2.c2.regrade.player@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu2Class2" },
      3: { email: "s3.c2.regrade.player@snapwiz.com", status: studentSide.NOT_STARTED, name: "Stu3Class2" }
    }
  };
  const attemptsdata1 = [
    { ...students.class1[1], overidden: false },
    { ...students.class1[2], overidden: false },
    { ...students.class1[3], overidden: false }
  ];

  const attemptsdata2 = [
    { ...students.class2[1], overidden: true },
    { ...students.class2[2], overidden: true },
    { ...students.class2[3], overidden: true }
  ];

  let testId1;
  let testId2;
  let testId3;
  let assignmentId1;
  let assignmentId2;
  let versionedTest1;
  let versionedTest2;

  before("> create test 2 tests", () => {
    cy.login("teacher", teacher);
    // testlibaryPage.createTest().then(id => {
    testId1 = "5f34385e1318be0009a7cd3f";
    // });
  });

  context(`> select '${regradeOptions.settings.excludeOveridden}'`, () => {
    /* 
    before{
       assign class1 with edulastic skin(defualt test setting)
       assign class2 with TestNav skin (overidden)

       attempt and keep one student for each status required
       edit test to have SABC skin regrade with exclude overidden
    }

    test{
        class1 both and IN_PROGRESS and NOT STARTED student should get SABC skin
        class2 all studentd should get TestNav skin
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
          assignmentId1 = assignObj[testId2];
        });

        testlibaryPage.assignPage.visitAssignPageById(testId2);
        testlibaryPage.assignPage.selectClass(classes[1]);
        testlibaryPage.assignPage.showOverRideSetting();
        testlibaryPage.assignPage.selectStudentPlayerSkinByOption(ASSESSMENT_PLAYERS.PARCC);
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignmentId2 = assignObj[testId2];
        });

        [...attemptsdata1, ...attemptsdata2]
          .filter(({ status }) => status !== studentSide.NOT_STARTED)
          .forEach(({ email, status }) => {
            cy.login("student", email);
            assignmentsPage.clickOnAssignmentButton();
            if (status === studentSide.SUBMITTED) {
              studentTestPage.clickOnNext(false, true);
              studentTestPage.submitTest();
            } else studentTestPage.clickOnExitTest();
          });
      });
    });

    context("> edit settings and regrade", () => {
      before("> login as teacher", () => {
        cy.login("teacher", teacher);
        testlibaryPage.visitTestById(testId2);
        testlibaryPage.publishedToDraftAssigned();
        testlibaryPage.getVersionedTestID().then(id => {
          versionedTest1 = id;
        });

        testlibaryPage.header.clickOnSettings();
        testlibaryPage.testSettings.selectStudentPlayerSkinByOption(ASSESSMENT_PLAYERS.SBAC);
        testlibaryPage.header.clickRegradePublish();

        /* select to eclude overidden test */
        regrade.checkRadioByValue(regradeOptions.settings.excludeOveridden);
        regrade.applyRegrade();
      });

      context(`> verify regraded player skin at student side`, () => {
        [...attemptsdata1, ...attemptsdata2]
          .filter(({ status }) => status !== studentSide.SUBMITTED)
          .forEach(({ email, overidden, status }) => {
            const [playerSkin, titleAdjust] = overidden
              ? [ASSESSMENT_PLAYERS.PARCC, ""]
              : [ASSESSMENT_PLAYERS.SBAC, "not "];
            it(`> for student ${status} with '${titleAdjust}overidden' assignment,expected -'${playerSkin}'`, () => {
              cy.login("student", email);
              assignmentsPage.clickOnAssigmentByTestId(versionedTest1);
              studentTestPage.verifyAssesmentPlayerSkin(playerSkin);
              studentTestPage.clickOnExitTest();
            });
          });
      });

      [attemptsdata1, attemptsdata2].forEach((studentdata, index) => {
        context(`> redirect '${index === 0 ? "not " : ""}overidden' assignment`, () => {
          const { overidden, email, name } = studentdata[0];
          const playerSkin = overidden ? ASSESSMENT_PLAYERS.PARCC : ASSESSMENT_PLAYERS.SBAC;
          /* redirecting overidden assignment should have TestNav */
          /* redirecting not overidden assignment should have SBAC */
          before("> click on lcb", () => {
            cy.login("teacher", teacher);
            testlibaryPage.sidebar.clickOnAssignment();
            authorAssignmentPage.clickOnLCBbyTestId(versionedTest1, overidden ? assignmentId2 : assignmentId1);
          });

          it("> redirect student", () => {
            lcb.selectCheckBoxByStudentName(name);
            lcb.clickOnRedirect();
            lcb.clickOnRedirectSubmit();
          });

          it(`> verify student, expected-'${playerSkin}'`, () => {
            cy.login("student", email);
            assignmentsPage.clickOnAssigmentByTestId(versionedTest1, { isFirstAttempt: false });
            studentTestPage.verifyAssesmentPlayerSkin(playerSkin);
            studentTestPage.clickOnExitTest();
          });
        });
      });
    });
  });

  context(`> select '${regradeOptions.settings.chooseAll}'`, () => {
    /* 
    before{
       assign class1 with SABC skin(defualt test setting)
       assign class2 with TestNav skin (overidden)

       attempt and keep one student for each status required
       edit test to have edulastic skin regrade with choose all
    }

    test{
       both class1 and class2 IN_PROGRESS and NOT STARTED student should get edulastic skin
    }
    */
    before("> assign without/with overiding", () => {
      cy.deleteAllAssignments("", teacher);
      cy.login("teacher", teacher);
      testlibaryPage.searchAndClickTestCardById(testId1);
      testlibaryPage.clickOnDuplicate();
      testlibaryPage.testSummary.setName("name");
      testlibaryPage.header.clickOnSaveButton(true);
      testlibaryPage.header.clickOnSettings();
      testlibaryPage.testSettings.showAdvancedSettings();
      testlibaryPage.testSettings.selectStudentPlayerSkinByOption(ASSESSMENT_PLAYERS.SBAC);
      testlibaryPage.header.clickOnPublishButton().then(id => {
        testId3 = id;

        testlibaryPage.clickOnAssign();
        testlibaryPage.assignPage.selectClass(classes[0]);
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignmentId1 = assignObj[testId3];
        });

        testlibaryPage.assignPage.visitAssignPageById(testId3);
        testlibaryPage.assignPage.selectClass(classes[1]);
        testlibaryPage.assignPage.showOverRideSetting();
        testlibaryPage.assignPage.selectStudentPlayerSkinByOption(ASSESSMENT_PLAYERS.PARCC);
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignmentId2 = assignObj[testId3];
        });

        [...attemptsdata1, ...attemptsdata2]
          .filter(({ status }) => status !== studentSide.NOT_STARTED)
          .forEach(({ email, status }) => {
            cy.login("student", email);
            assignmentsPage.clickOnAssignmentButton();
            if (status === studentSide.SUBMITTED) {
              studentTestPage.clickOnNext(false, true);
              studentTestPage.submitTest();
            } else studentTestPage.clickOnExitTest();
          });
      });
    });

    context("> edit settings and regrade", () => {
      before("> login as teacher", () => {
        cy.login("teacher", teacher);
        testlibaryPage.visitTestById(testId3);
        testlibaryPage.publishedToDraftAssigned();
        testlibaryPage.getVersionedTestID().then(id => {
          versionedTest2 = id;
        });

        testlibaryPage.header.clickOnSettings();
        testlibaryPage.testSettings.selectStudentPlayerSkinByOption(ASSESSMENT_PLAYERS.EDULASTIC);
        testlibaryPage.header.clickRegradePublish();

        /* select to choose all test */
        regrade.checkRadioByValue(regradeOptions.settings.chooseAll);
        regrade.applyRegrade();
      });

      context(`> verify regraded player skin at student side`, () => {
        [...attemptsdata1, ...attemptsdata2]
          .filter(({ status }) => status !== studentSide.SUBMITTED)
          .forEach(({ email, overidden, status }, index) => {
            const titleAdjust = overidden ? "" : "not ";
            it(`> for student ${status} with '${titleAdjust}overidden' assignment,expected- 'Edulastic'`, () => {
              cy.login("student", email);
              assignmentsPage.clickOnAssigmentByTestId(versionedTest2);
              studentTestPage.verifyAssesmentPlayerSkin(ASSESSMENT_PLAYERS.EDULASTIC);
              studentTestPage.clickOnExitTest();
            });
          });
      });

      [attemptsdata1, attemptsdata2].forEach((studentdata, index) => {
        context(`> redirect '${index === 0 ? "not " : ""}overidden' assignment`, () => {
          const { overidden, email, name } = studentdata[0];
          /* redirecting overidden/not overidden assignment should have edulastic skin */
          before("> click on lcb", () => {
            cy.login("teacher", teacher);
            testlibaryPage.sidebar.clickOnAssignment();
            authorAssignmentPage.clickOnLCBbyTestId(versionedTest2, overidden ? assignmentId2 : assignmentId1);
          });

          it("> redirect student", () => {
            lcb.selectCheckBoxByStudentName(name);
            lcb.clickOnRedirect();
            lcb.clickOnRedirectSubmit();
          });

          it("> verify student, expected-'Edulastic'", () => {
            cy.login("student", email);
            assignmentsPage.clickOnAssigmentByTestId(versionedTest2, { isFirstAttempt: false });
            studentTestPage.verifyAssesmentPlayerSkin(ASSESSMENT_PLAYERS.EDULASTIC);
            studentTestPage.clickOnExitTest();
          });
        });
      });
    });
  });
});
