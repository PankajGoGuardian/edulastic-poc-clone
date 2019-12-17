export default class Regrade {
  regradeSelection = regrade => {
    cy.server();
    cy.route("PUT", "**/api/test/**").as("published");
    cy.route("GET", "**/assignments").as("assignments");
    cy.contains("There are some ongoing assignments linked to the").as("regradeSelect");
    if (!regrade) {
      cy.get("@regradeSelect")
        .next()
        .find("button")
        .eq(0)
        .click({ force: true });
      cy.wait("@published");
      cy.wait("@published");
    } else {
      cy.get("@regradeSelect")
        .next()
        .find("button")
        .eq(1)
        .click({ force: true });
      cy.wait("@assignments");
    }
  };

  applyRegrade = () => {
    cy.server();
    cy.route("GET", "**/content-sharing/**").as("applyRegrade");
    cy.route("GET", "**/api/test**").as("regraded");
    cy.get("[data-cy='applyRegrade']").click({ force: true });
    cy.wait("@applyRegrade");
    cy.wait("@testdrafted");
  };
}
