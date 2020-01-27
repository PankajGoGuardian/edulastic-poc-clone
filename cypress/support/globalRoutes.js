export default function initGlobalRoutes() {
  cy.server();
  cy.route("GET", "**curriculum").as("curriculum");
  cy.route("GET", "**dashboard**").as("dashboard");
  cy.route("POST", "**courses").as("courses");
  cy.route("GET", "**/test-activity/**").as("testactivity");
  cy.route("GET", "**assignments**").as("assignments");
  cy.route("GET", "**/user-folder").as("user-folder");
  cy.route("GET", "**test**").as("testdetail");
  cy.route("GET", "**/item/**").as("item");
  cy.route("POST", "**users").as("users");
  cy.route("POST", "**//search//items").as("searchItem");
  cy.route("POST", "**//school//search").as("schoolSearch");
  cy.route("POST", "**//search//tests").as("searchTest");
  cy.route("POST", "**/playlists/search").as("searchPL");
  cy.route("**/skill-report/**").as("skillReport");
  cy.route("**/enrollment/student").as("enrollment");
  cy.route("GET", "**//playlists//**").as("playlists");
  cy.route("POST", "**/test-activity/**").as("saved");

  cy.route("**single-assessment**").as("singleAssessment");
  cy.route("**assessment-summary**").as("assessmentSummary");
  cy.route("**peer-performance**").as("peerPerformance");
  cy.route("**question-analysis**").as("questionAnalysis");
  cy.route("**response-frequency**").as("responseFrequency");
  cy.route("**performance-by-standards**").as("performanceByStandards");
  cy.route("**performance-by-students**").as("performanceByStudents");

  cy.route("**multiple-assessment**").as("multipleAssessment");
  cy.route("**performance-over-time**").as("performanceOverTime");
  cy.route("**peer-progress-analysis**").as("peerProgressAnalysis");
  cy.route("**student-progress**").as("studentProgress");

  cy.route("POST", "**browse-standards").as("browseStandards");
  cy.route("**standard-mastery**").as("standardMastery");
  cy.route("**standards-summary**").as("standardsPerformanceSummary");
  cy.route("**standards-gradebook**").as("standardsGradebook");
}
