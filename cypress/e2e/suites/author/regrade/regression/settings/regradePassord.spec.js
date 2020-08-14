import FileHelper from "../../../../../framework/util/fileHelper";
import TestLibrary from "../../../../../framework/author/tests/testLibraryPage";
import Regrade from "../../../../../framework/author/tests/regrade/regrade";
import { regradeOptions, studentSide } from "../../../../../framework/constants/assignmentStatus";
import AuthorAssignmentPage from "../../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../../framework/author/assignments/LiveClassboardPage";
import AssignmentsPage from "../../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../../framework/student/studentTestPage";

describe(`>${FileHelper.getSpecName(Cypress.spec.name)}> regrade settings- 'password'`, () => {
  const testlibaryPage = new TestLibrary();
  const regrade = new Regrade();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const lcb = new LiveClassboardPage();
  const assignmentsPage = new AssignmentsPage();
  const studentTestPage = new StudentTestPage();
  const classes = ["Class-1", "Class-2"];
  const teacher = "teacher.regrade.password@snapwiz.com";
  const students = {
    class1: {
      1: { email: "s1.c1.regrade.password@snapwiz.com", status: studentSide.SUBMITTED, name: "Stu1Class1" },
      2: { email: "s2.c1.regrade.password@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu2Class1" },
      3: { email: "s3.c1.regrade.password@snapwiz.com", status: studentSide.NOT_STARTED, name: "Stu3Class1" }
    },

    class2: {
      1: { email: "s1.c2.regrade.password@snapwiz.com", status: studentSide.SUBMITTED, name: "Stu1Class2" },
      2: { email: "s2.c2.regrade.password@snapwiz.com", status: studentSide.IN_PROGRESS, name: "Stu2Class2" },
      3: { email: "s3.c2.regrade.password@snapwiz.com", status: studentSide.NOT_STARTED, name: "Stu3Class2" }
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
  const staticPassword_1 = "123qwerty";
  const staticPassword_2 = "456qwerty";

  let dynamicPassword;
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
    testId1 = "5f3283dd47422c00081b9241";
    // });
  });

  context(`> select '${regradeOptions.settings.excludeOveridden}'`, () => {
    /* 
    before{
       assign class1 with no password(defualt test setting)
       assign class2 with static password_1 (overidden)

     attempt and keep students in required status
     edit test to have dynamic password and regrade with exclude overidden
     copy dynamic password from lcb 
    }

    test{
      class1: not started student should enter dynamic password  while in progress student should not be asked for password
      class2: not started student should enter static password_1  while in progress student should not be asked for password
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
        });

        testlibaryPage.assignPage.visitAssignPageById(testId2);
        testlibaryPage.assignPage.selectClass(classes[1]);
        testlibaryPage.assignPage.showOverRideSetting();
        testlibaryPage.assignPage.clickOnStaticPassword();
        testlibaryPage.assignPage.enterStaticPassword(staticPassword_1);
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignmentid2 = assignObj[testId2];
        });

        [...attemptsdata1, ...attemptsdata2]
          .filter(({ status }) => status !== studentSide.NOT_STARTED)
          .forEach(({ email, overidden, status }) => {
            const option = overidden ? { pass: staticPassword_1 } : {};
            cy.login("student", email);
            assignmentsPage.clickOnAssigmentByTestId(testId2, option);
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

          testlibaryPage.header.clickOnSettings();
          testlibaryPage.testSettings.clickOnPassword();
          testlibaryPage.testSettings.clickOnDynamicPassword();
          testlibaryPage.header.clickRegradePublish();

          /* select to eclude overidden test */
          regrade.checkRadioByValue(regradeOptions.settings.excludeOveridden);
          regrade.applyRegrade();

          /* get dynamic password */
          testlibaryPage.sidebar.clickOnAssignment();
          authorAssignmentPage.clickOnLCBbyTestId(versionedTest1, assignmentid1);
          lcb.header.clickOnViewPassword();
          lcb.copyPassword().then(pass => {
            dynamicPassword = pass;
          });
        });
      });

      [...attemptsdata1, ...attemptsdata2]
        .filter(({ status }) => status !== studentSide.SUBMITTED)
        .forEach(({ email, status, overidden }, index) => {
          it(`> verify for ${status} student '${index === 1 ? "" : "not "}overidden' assignment`, () => {
            cy.login("student", email);
            const option =
              status === studentSide.IN_PROGRESS
                ? {}
                : overidden
                ? { pass: staticPassword_1 }
                : { pass: dynamicPassword };
            assignmentsPage.clickOnAssigmentByTestId(versionedTest1, option);
            studentTestPage.clickOnExitTest();
          });
        });
    });
  });

  context(`> select '${regradeOptions.settings.chooseAll}'`, () => {
    /* 
    before{
       assign class1 with static password_2 password(defualt test setting)
       assign class2 with dynamic password (overidden)
       copy dynamic password from lcb 
     
     attempt and keep students in required status
     edit test to have static password_1 and regrade with choose all
    }

    test{
      class1: not started student should enter static password_1  while in progress student should not be asked for password
      class2: not started student should enter static password_1  while in progress student should not be asked for password
    }
    */
    before("> assign without/with overiding", () => {
      cy.deleteAllAssignments("", teacher);
      cy.login("teacher", teacher);
      testlibaryPage.searchAndClickTestCardById(testId1);
      testlibaryPage.clickOnDuplicate();
      testlibaryPage.testSummary.setName("test assesment");
      testlibaryPage.header.clickOnSaveButton(true);
      testlibaryPage.header.clickOnSettings();
      testlibaryPage.testSettings.clickOnPassword();
      testlibaryPage.testSettings.clickOnStaticPassword();
      testlibaryPage.testSettings.enterStaticPassword(staticPassword_2);
      testlibaryPage.header.clickOnPublishButton().then(id => {
        testId3 = id;

        testlibaryPage.clickOnAssign();
        testlibaryPage.assignPage.selectClass(classes[0]);
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignmentid1 = assignObj[testId3];
        });

        testlibaryPage.assignPage.visitAssignPageById(testId3);
        testlibaryPage.assignPage.selectClass(classes[1]);
        testlibaryPage.assignPage.showOverRideSetting();
        testlibaryPage.assignPage.clickDynamicPassword();
        testlibaryPage.assignPage.clickOnAssign().then(assignObj => {
          assignmentid2 = assignObj[testId3];
          testlibaryPage.sidebar.clickOnAssignment();
          authorAssignmentPage.clickOnLCBbyTestId(testId3, assignmentid2);

          lcb.header.clickOnOpen();
          lcb.copyPassword().then(pass => {
            dynamicPassword = pass;

            [...attemptsdata1, ...attemptsdata2]
              .filter(({ status }) => status !== studentSide.NOT_STARTED)
              .forEach(({ email, overidden, status }) => {
                const option = overidden ? { pass: dynamicPassword } : { pass: staticPassword_2 };
                cy.login("student", email);
                assignmentsPage.clickOnAssigmentByTestId(testId3, option);
                if (status === studentSide.SUBMITTED) {
                  studentTestPage.clickOnNext(false, true);
                  studentTestPage.submitTest();
                } else studentTestPage.clickOnExitTest();
              });
          });
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
        testlibaryPage.testSettings.clickOnPassword();
        testlibaryPage.testSettings.clickOnStaticPassword();
        testlibaryPage.testSettings.enterStaticPassword(staticPassword_1);
        testlibaryPage.header.clickRegradePublish();

        /* select to choose all tests */
        regrade.checkRadioByValue(regradeOptions.settings.chooseAll);
        regrade.applyRegrade();
      });

      [...attemptsdata1, ...attemptsdata2]
        .filter(({ status }) => status !== studentSide.SUBMITTED)
        .forEach(({ email, status, overidden }) => {
          it(`> verify for ${status} student '${overidden ? "" : "not "}overidden' assignment`, () => {
            cy.login("student", email);
            const option = status === studentSide.IN_PROGRESS ? {} : { pass: staticPassword_1 };
            assignmentsPage.clickOnAssigmentByTestId(versionedTest2, option);
            studentTestPage.clickOnExitTest();
          });
        });
    });
  });
});
