/* eslint-disable cypress/no-unnecessary-waiting */
import FileHelper from "../framework/util/fileHelper";
import TeacherSideBar from "../framework/author/SideBarPage";

const SCREEN_SIZES = Cypress.config("SCREEN_SIZES");

const singleAssessmentReport = [
  {
    key: "assessmentSummary",
    title: "Assessment Summary"
  },
  {
    key: "peerPerformance",
    title: "Sub-group Performance"
  },
  {
    key: "questionAnalysis",
    title: "Question Analysis"
  },
  {
    key: "responseFrequency",
    title: "Response Frequency"
  },
  {
    key: "performanceByStandards",
    title: "Performance by Standards"
  },
  {
    key: "performanceByStudents",
    title: "Performance by Students"
  }
];
const multipleAssessmentReport = [
  {
    key: "performanceOverTime",
    title: "Performance Over Time"
  },
  {
    key: "peerProgressAnalysis",
    title: "Peer Progress Analysis"
  },
  {
    key: "studentProgress",
    title: "Student Progress"
  }
];
const standardPerfReport = [
  {
    key: "standardsPerformanceSummary",
    title: "Standards Performance Summary"
  },
  {
    key: "standardsGradebook",
    title: "Standards Gradebook"
  }
];

const sideBar = new TeacherSideBar();

describe(`${FileHelper.getSpecName(Cypress.spec.name)}-`, () => {
  before("set token", () => {
    cy.fixture("usersVisualRegression").then(allusers => {
      const { username, password } = allusers.teacherReports;
      cy.login("teacher", username, password); // setting auth token for teacher user
    });
  });

  beforeEach(() => {
    sideBar.clickOnReport();
  });

  context(`single assessment report`, () => {
    SCREEN_SIZES.forEach(size => {
      singleAssessmentReport.forEach(report => {
        it(`'${report.title}' when resolution is '${size}'`, () => {
          cy.setResolution(size);
          cy.get(`[data-cy="${report.key}"]`).click({ force: true });
          cy.wait("@singleAssessment");
          cy.wait(`@${report.key}`);
          cy.isPageScrollPresent().then(({ hasScroll }) => {
            if (hasScroll) cy.window().scrollTo("top");
          });
          cy.wait(1000);
          cy.matchImageSnapshotWithSize();
          cy.isPageScrollPresent().then(({ hasScroll }) => {
            if (hasScroll) cy.scrollPageAndMatchImageSnapshots(100);
          });
        });
      });
    });
  });

  context(`multiple assessment report`, () => {
    SCREEN_SIZES.forEach(size => {
      multipleAssessmentReport.forEach(report => {
        it(`'${report.title}' when resolution is '${size}'`, () => {
          cy.setResolution(size);
          cy.get(`[data-cy="${report.key}"]`).click({ force: true });
          cy.wait("@multipleAssessment");
          cy.wait(`@${report.key}`);
          cy.isPageScrollPresent().then(({ hasScroll }) => {
            if (hasScroll) cy.window().scrollTo("top");
          });
          cy.wait(1000);
          cy.matchImageSnapshotWithSize();
          cy.isPageScrollPresent().then(({ hasScroll }) => {
            if (hasScroll) cy.scrollPageAndMatchImageSnapshots(100);
          });
        });
      });
    });
  });

  context(`standard assessment report`, () => {
    SCREEN_SIZES.forEach(size => {
      standardPerfReport.forEach(report => {
        it(`'${report.title}' when resolution is '${size}'`, () => {
          cy.setResolution(size);
          cy.get(`[data-cy="${report.key}"]`).click({ force: true });
          cy.wait("@browseStandards");
          cy.wait("@standardMastery");
          cy.wait(`@${report.key}`);
          cy.isPageScrollPresent().then(({ hasScroll }) => {
            if (hasScroll) cy.window().scrollTo("top");
          });
          cy.wait(1000);
          cy.matchImageSnapshotWithSize();
          cy.isPageScrollPresent().then(({ hasScroll }) => {
            if (hasScroll) cy.scrollPageAndMatchImageSnapshots(100);
          });
        });
      });
    });
  });
});
