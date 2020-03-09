/* eslint-disable lines-between-class-members */
import TestLibrary from "../testLibraryPage";

export default class Regrade {
  constructor() {
    this.testLibrary = new TestLibrary();
  }

  // *** ELEMENTS START ***
  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  regradeSelection = (regrade, EditFromAssgntsPage = false) => {
    cy.server();
    cy.route("PUT", "**/api/test/*").as("published");
    cy.route("GET", "**/assignments").as("assignments");
    cy.contains("There are some ongoing assignments linked to the").as("regradeSelect");
    if (!regrade) {
      cy.get("@regradeSelect")
        .next()
        .find("button")
        .eq(0)
        .click({ force: true });
      if (EditFromAssgntsPage) cy.wait("@published").then(xhr => this.testLibrary.saveTestId(xhr));
      else cy.wait("@published");
      cy.wait("@published");
    } else {
      cy.get("@regradeSelect")
        .next()
        .find("button")
        .eq(1)
        .click({ force: true });
      if (EditFromAssgntsPage) cy.wait("@published").then(xhr => this.testLibrary.saveTestId(xhr));
      cy.wait("@assignments");
    }
  };

  applyRegrade = () => {
    cy.server();
    cy.route("POST", "**/assignments/regrade").as("regrade");
    cy.get("[data-cy='applyRegrade']").click({ force: true });
    cy.wait("@regrade").then(xhr => expect(xhr.status).to.eq(200));
    cy.contains("Success!");
  };

  // *** ACTIONS END ***

  // *** APPHELPERS START ***
  // *** APPHELPERS END ***
}
