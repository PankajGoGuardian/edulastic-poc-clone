export default function initGlobalRoutes() {
  cy.server();
  cy.route("GET", "**curriculum").as("curriculum");
  cy.route("GET", "**dashboard**").as("dashboard");
  cy.route("POST", "**courses").as("courses");
  cy.route("GET", "**/test-activity/**").as("testactivity");
  cy.route("GET", "**assignments**").as("assignments");
  cy.route("GET", "**/user-folder").as("user-folder");
  cy.route("GET", "**test**").as("testdetail");
  cy.route("GET", "**/question/**").as("question");
  cy.route("POST", "**users").as("users");
  cy.route("POST", "**//search//items").as("searchItem");
  cy.route("POST", "**//school//search").as("schoolSearch");
}
