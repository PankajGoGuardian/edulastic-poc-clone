export default function initGlobalRoutes() {
  cy.server();
  cy.route("GET", "**curriculum").as("curriculum");
  cy.route("GET", "**dashboard**").as("dashboard");
  cy.route("POST", "**courses").as("courses");
  cy.route("GET", "**/test-activity/**").as("testactivity");
}
