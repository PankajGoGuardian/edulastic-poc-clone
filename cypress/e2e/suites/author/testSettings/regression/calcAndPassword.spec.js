import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import TestReviewTab from "../../../../framework/author/tests/testDetail/testReviewTab";
import TestAssignPage from "../../../../framework/author/tests/testDetail/testAssignPage";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import StudentTestPage from "../../../../framework/student/studentTestPage";
import TestSettings from "../../../../framework/author/tests/testDetail/testSettingsPage";
import { CALCULATOR } from "../../../../framework/constants/questionTypes";
import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import FileHelper from "../../../../framework/util/fileHelper";

describe(`${FileHelper.getSpecName(Cypress.spec.name)}>> Test Setting-Calulator And Password`, () => {
  const testLibraryPage = new TestLibrary();
  const assignmentsPage = new AssignmentsPage();
  const studentTestPage = new StudentTestPage();
  const testReviewTab = new TestReviewTab();
  const testAssignPage = new TestAssignPage();
  const testSettings = new TestSettings();
  const authorAssignmentPage = new AuthorAssignmentPage();
  const lcb = new LiveClassboardPage();

  const Teacher = {
    email: "teacher.calc.password@snapwiz.com",
    pass: "snapwiz"
  };
  const Student1 = {
    email: "student.calc.password@snapwiz.com",
    pass: "snapwiz"
  };
  const staticPassword = "123546";

  let OriginalTestId;
  let dynamicPassword;

  before("login and create new items and test", () => {
    cy.deleteAllAssignments(Student1.email, Teacher.email);
    cy.login("teacher", Teacher.email, Teacher.pass);
    testLibraryPage.createTest("default").then(id => {
      OriginalTestId = id;
    });
  });
  context("Calulators", () => {
    context(`No Calulator`, () => {
      it("Assign the test", () => {
        testLibraryPage.clickOnAssign();
        testAssignPage.selectClass("Class");
        testAssignPage.selectTestType("Class Assessment");
        // testAssignPage.clickOnEntireClass();
        testAssignPage.clickOnAssign();
      });
      it("Verifying At Student Side- No Calculator", () => {
        cy.login("student", Student1.email, Student1.pass);

        assignmentsPage.clickOnAssigmentByTestId(OriginalTestId);
        studentTestPage.assertCalcType("NONE");
        studentTestPage.clickOnExitTest();
      });
    });

    Object.keys(CALCULATOR)
      .slice(0, 1)
      .forEach(CALC => {
        context(`${CALC}`, () => {
          it(`Edit Setings-${CALC}`, () => {
            cy.deleteAllAssignments(Student1.email, Teacher.email);
            cy.login("teacher", Teacher.email, Teacher.pass);
            testLibraryPage.sidebar.clickOnTestLibrary();
            testLibraryPage.searchFilters.clearAll();
            testLibraryPage.searchFilters.getAuthoredByMe();
            testLibraryPage.clickOnTestCardById(OriginalTestId);
            testLibraryPage.clickOnDetailsOfCard();
            testLibraryPage.publishedToDraftAssigned();
            testLibraryPage.getVersionedTestID().then(id => {
              OriginalTestId = id;
            });
            testReviewTab.testheader.clickOnSettings();
            testSettings.clickOnCalculatorByType(CALCULATOR[CALC]);
            testSettings.header.clickOnSaveButton(true);
            testSettings.header.clickOnPublishButton();
          });
          it("Assign the test", () => {
            testLibraryPage.clickOnAssign();
            testAssignPage.selectClass("Class");
            testAssignPage.selectTestType("Class Assessment");
            //  testAssignPage.clickOnEntireClass();
            testAssignPage.clickOnAssign();
          });
          it(`Verifying At Student Side-${CALC}`, () => {
            cy.login("student", Student1.email, Student1.pass);
            assignmentsPage.clickOnAssigmentByTestId(OriginalTestId);
            studentTestPage.clickOnCalcuator();
            studentTestPage.assertCalcType(CALCULATOR[CALC]);
            studentTestPage.clickOnExitTest();
          });
        });
      });
  });
  context("Passwords", () => {
    context("Static Password", () => {
      it("Select Static and Give Password", () => {
        cy.deleteAllAssignments(Student1.email, Teacher.email);
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.searchFilters.clearAll();
        testLibraryPage.searchFilters.getAuthoredByMe();
        testLibraryPage.clickOnTestCardById(OriginalTestId);
        testLibraryPage.clickOnDetailsOfCard();
        testLibraryPage.publishedToDraftAssigned();
        testLibraryPage.getVersionedTestID().then(id => {
          OriginalTestId = id;
        });
        testReviewTab.testheader.clickOnSettings();
        testSettings.clickOnPassword();
        testSettings.clickOnStaticPassword();
        testSettings.enterStaticPassword(staticPassword);
        testSettings.header.clickOnSaveButton(true);
        testSettings.header.clickOnPublishButton();
      });
      it("Assign the test", () => {
        testLibraryPage.clickOnAssign();
        testAssignPage.selectClass("Class");
        testAssignPage.selectTestType("Class Assessment");
        //  testAssignPage.clickOnEntireClass();
        testAssignPage.clickOnAssign();
      });
      it("Verifying At Student Side- Static Password", () => {
        cy.login("student", Student1.email, Student1.pass);
        assignmentsPage.clickOnAssigmentByTestId(OriginalTestId, { pass: staticPassword });
        studentTestPage.getNext();
        studentTestPage.clickOnExitTest();
      });
    });
    context("Dynamic Password", () => {
      it("select Dynamic", () => {
        cy.deleteAllAssignments(Student1.email, Teacher.email);
        cy.login("teacher", Teacher.email, Teacher.pass);
        testLibraryPage.sidebar.clickOnTestLibrary();
        testLibraryPage.searchFilters.clearAll();
        testLibraryPage.searchFilters.getAuthoredByMe();
        testLibraryPage.clickOnTestCardById(OriginalTestId);
        testLibraryPage.clickOnDetailsOfCard();
        testLibraryPage.publishedToDraftAssigned();
        testLibraryPage.getVersionedTestID().then(id => {
          OriginalTestId = id;
        });
        testReviewTab.testheader.clickOnSettings();
        testSettings.clickOnPassword();
        testSettings.clickOnDynamicPassword();
        testSettings.header.clickOnSaveButton(true);
        testSettings.header.clickOnPublishButton();
      });
      it("Assign the test", () => {
        testLibraryPage.clickOnAssign();
        testAssignPage.selectClass("Class");
        testAssignPage.selectTestType("Class Assessment");
        //  testAssignPage.clickOnEntireClass();
        testAssignPage.clickOnAssign();
      });
      it("Get Password", () => {
        testLibraryPage.sidebar.clickOnAssignment();
        authorAssignmentPage.clcikOnPresenatationIconByIndex(0);
        lcb.header.clickOnOpen();
        // lcb.header.clickOnViewPassword();
        lcb.copyPassword().then(pass => {
          dynamicPassword = pass;
        });
      });
      it("Verifying At Student Side- Dynamic Password", () => {
        cy.login("student", Student1.email, Student1.pass);
        assignmentsPage.clickOnAssigmentByTestId(OriginalTestId, { pass: dynamicPassword });
        studentTestPage.getNext();
        studentTestPage.clickOnExitTest();
      });
    });
  });
});
