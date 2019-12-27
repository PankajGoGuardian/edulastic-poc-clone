import AuthorAssignmentPage from "../../../../framework/author/assignments/AuthorAssignmentPage";
import LiveClassboardPage from "../../../../framework/author/assignments/LiveClassboardPage";
import TeacherSideBar from "../../../../framework/author/SideBarPage";
import TestLibrary from "../../../../framework/author/tests/testLibraryPage";
import { teacherSide, testTypes } from "../../../../framework/constants/assignmentStatus";
import AssignmentsPage from "../../../../framework/student/assignmentsPage";
import FileHelper from "../../../../framework/util/fileHelper";
import { before } from "mocha";

const teacherSidebar = new TeacherSideBar();
const studentAssignment = new AssignmentsPage();
const authorAssignmentPage = new AuthorAssignmentPage();
const lcb = new LiveClassboardPage();
const testLibrary = new TestLibrary();
const { _ } = Cypress;

const classes = {
  1: { className: "My Test Class 1" },
  2: { className: "My Test Class 2" }
};

const testName = "Default Test Automation";
const teacher = "teacher2.regression.automation@snapwiz.com";
const password = "snapwiz";
const filters = {
  gradeFilter: {
    Kindergarten: { ...classes[1] },
    "Grade 1": { ...classes[2] }
  },
  subjectFilter: {
    Mathematics: { ...classes[1] },
    ELA: { ...classes[2] }
  },
  testTypeFilter: {
    "Class Assessments": { ...classes[1] },
    Practice: { ...classes[2] }
  },
  classFilter: {
    "My Test Class 1": "My Test Class 1",
    "My Test Class 2": "My Test Class 2"
  }
};
const folders = { 1: "Folder1", 2: "Folder2", 3: "Folder3" };

let testId;

describe(`${FileHelper.getSpecName(Cypress.spec.name)} >> Smart Filters`, () => {
  before(" > create new assessment and assign", () => {
    cy.login("teacher", teacher, password);
    // creating test
    cy.deleteAllAssignments(undefined, teacher, password);
    testLibrary.createTest().then(id => {
      testId = id;
      //  assign as class assessment
      testLibrary.header.clickOnAssign();
      testLibrary.assignPage.selectClass(classes[1].className);
      testLibrary.assignPage.clickOnAssign();
      teacherSidebar.clickOnAssignment();
      // assign as practice
      cy.visit(`/author/assignments/${testId}`);
      cy.wait("@assignment");
      cy.wait(2000);
      testLibrary.assignPage.selectClass(classes[2].className);
      testLibrary.assignPage.selectTestType(testTypes.PRACTICE_ASSESSMENT);
      testLibrary.assignPage.clickOnAssign();
      teacherSidebar.clickOnAssignment();
    });
  });

  context(`assignment filters`, () => {
    before(() => {
      cy.login("teacher", teacher, password);
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.smartFilter.clickOnFilter();
    });

    beforeEach("reset all filters", () => {
      authorAssignmentPage.smartFilter.routeAPI();
      authorAssignmentPage.smartFilter.resetAll();
    });

    context(`assignment filters -By Grade`, () => {
      const filterData = filters.gradeFilter;
      _.keys(filterData).forEach(filterOption => {
        it(`- with ${filterOption}`, () => {
          authorAssignmentPage.smartFilter.setGrades(filterOption);
          authorAssignmentPage
            .getClass()
            .should("contain.text", filterData[filterOption].className)
            .and("have.length", 1);
        });
      });
    });

    context(`assignment filters -By Subject`, () => {
      const filterData = filters.subjectFilter;
      _.keys(filterData).forEach(filterOption => {
        it(`- with ${filterOption}`, () => {
          authorAssignmentPage.smartFilter.setGrades(filterOption);
          authorAssignmentPage
            .getClass()
            .should("contain.text", filterData[filterOption].className)
            .and("have.length", 1);
        });
      });
    });

    context(`assignment filters -By Testtype`, () => {
      const filterData = filters.testTypeFilter;
      _.keys(filterData).forEach(filterOption => {
        it(`- with ${filterOption}`, () => {
          authorAssignmentPage.smartFilter.setGrades(filterOption);
          authorAssignmentPage
            .getClass()
            .should("contain.text", filterData[filterOption].className)
            .and("have.length", 1);
        });
      });
    });

    context(`assignment filters -By Class`, () => {
      const filterData = filters.classFilter;
      _.keys(filterData).forEach(filterOption => {
        it(`- with ${filterOption}`, () => {
          authorAssignmentPage.smartFilter.setGrades(filterOption);
          authorAssignmentPage
            .getClass()
            .should("contain.text", filterData[filterOption])
            .and("have.length", 1);
        });
      });
    });

    context(`assignment filters -By Year`, () => {
      const year = "2019-20";
      const allYear = "All years";
      it(`- with ${year}`, () => {
        authorAssignmentPage.smartFilter.setYear(year);
        authorAssignmentPage
          .getClass()
          .should("contain.text", classes[1].className)
          .and("contain.text", classes[2].className)
          .and("have.length", 2);
      });

      it(`- with ${allYear}`, () => {
        authorAssignmentPage.smartFilter.setYear(allYear);
        authorAssignmentPage
          .getClass()
          .should("contain.text", classes[1].className)
          .and("contain.text", classes[2].className)
          .and("have.length", 2);
      });
    });
  });

  context(`assignment folders`, () => {
    before("reset all filters", () => {
      teacherSidebar.clickOnDashboard();
      teacherSidebar.clickOnAssignment();
      authorAssignmentPage.smartFilter.clickOnFilter();
      cy.contains("ALL ASSIGNMENTS").then(() => {
        // delete residue folders
        if (Cypress.$(`[data-cy="${folders[1]}"]`).length > 0)
          authorAssignmentPage.smartFilter.deleteFolder(`${folders[1]}`);
        if (Cypress.$(`[data-cy="${folders[1]}-rename"]`).length > 0)
          authorAssignmentPage.smartFilter.deleteFolder(`${folders[1]}-rename`);
        if (Cypress.$(`[data-cy="${folders[3]}"]`).length > 0)
          authorAssignmentPage.smartFilter.deleteFolder(`${folders[3]}`);
      });
    });

    it(`create new folder`, () => {
      authorAssignmentPage.smartFilter.createNewFolder(folders[1]);
    });

    it(`rename empty folder`, () => {
      authorAssignmentPage.smartFilter.renameFolder(folders[1], `${folders[1]}-rename`);
    });

    it(`delete empty folder`, () => {
      authorAssignmentPage.smartFilter.deleteFolder(`${folders[1]}-rename`);
    });

    it(`rename to existing folder`, () => {
      authorAssignmentPage.smartFilter.createNewFolder(folders[3]);
      authorAssignmentPage.smartFilter.renameFolder(folders[2], folders[3], false);
      authorAssignmentPage.smartFilter.deleteFolder(folders[3]);
    });

    it(`move assignment to folder`, () => {
      authorAssignmentPage.selectCheckBoxByTestName(testName);
      authorAssignmentPage.smartFilter.moveToFolder(folders[2]);
      authorAssignmentPage.selectCheckBoxByTestName(testName);

      // select all folder
      authorAssignmentPage.smartFilter.clickOnAllAssignment();
      authorAssignmentPage
        .getClass()
        .should("contain.text", classes[1].className)
        .and("contain.text", classes[2].className)
        .and("have.length", 2);

      // select folder 1
      authorAssignmentPage.smartFilter.clickOnFolderByName(folders[1]);
      authorAssignmentPage.getClass().should("have.length", 1);

      // select folder 2
      authorAssignmentPage.smartFilter.clickOnFolderByName(folders[2]);
      authorAssignmentPage
        .getClass()
        .should("contain.text", classes[1].className)
        .and("contain.text", classes[2].className)
        .and("have.length", 2);
    });

    it(`delete used folder`, () => {
      authorAssignmentPage.smartFilter.deleteFolder(`${folders[2]}`, false);
    });
  });
});
