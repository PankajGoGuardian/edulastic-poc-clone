import CypressHelper from "../../util/cypressHelpers";

export default class SmartFilters {
  // *** ELEMENTS START ***

  getGrades = () => cy.get('[data-cy="grades"]');

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnFilter = () => cy.get('[data-cy="smart-filter"]').click();

  routeAPI = () => {
    cy.server();
    cy.route("GET", /assignments/g).as("assignment");
  };

  waitForAssignments = () => cy.wait("@assignment");

  setGrades = grade => {
    this.getGrades().click();
    cy.get(".ant-select-dropdown-menu-item").then($ele => {
      cy.wrap(
        $ele
          // eslint-disable-next-line func-names
          .filter(function() {
            return Cypress.$(this).text() === grade;
          })
      ).click({ force: true });
    });
    this.waitForAssignments();
    cy.focused().blur();
  };

  setSubject = subject => {
    CypressHelper.selectDropDownByAttribute("subjects", subject);
    this.waitForAssignments();
  };

  setYear = year => {
    CypressHelper.selectDropDownByAttribute("schoolYear", year);
    this.waitForAssignments();
  };

  setTesttype = testType => {
    CypressHelper.selectDropDownByAttribute("filter-testType", testType);
    this.waitForAssignments();
  };

  setClass = classs => {
    CypressHelper.selectDropDownByAttribute("filter-class", classs);
    this.waitForAssignments();
  };

  resetAll = () => {
    this.getGrades()
      .find("input")
      .type("{backspace}".repeat(3));
    this.setSubject("All Subjects");
    this.setYear("All years");
    this.setTesttype("All");
    this.setClass("All classes");
  };

  // folders

  clickOnAllAssignment = () => cy.contains("span", "ALL ASSIGNMENTS").click();

  clickOnFolderByName = folderName =>
    cy
      .get(`[title="${folderName}"]`)
      .first()
      .click({ force: true });

  renameFolder = (currentName, newName, isValid = true) => {
    cy.server();
    cy.route("PUT", "**/user-folder/**").as("updateFolder");
    cy.get(`[data-cy="${currentName}"]`)
      .find('[data-cy="moreButton"]')
      .click();
    cy.get('[data-cy="rename"]')
      .last()
      .click({ force: true });
    cy.get('[placeholder="Name this folder"]').type(newName);
    cy.contains("span", "Update").click();
    if (isValid) {
      cy.wait("@updateFolder").then(xhr => expect(xhr.status).to.eq(200));
      this.verifyFolderVisible(newName);
      this.verifyFolderNotVisible(currentName);
    } else {
      cy.contains("The folder name is already used").should("be.visible");
      cy.contains("span", "Cancel").click();
    }
  };

  deleteFolder = (folderName, isValid = true) => {
    cy.server();
    cy.route("DELETE", "**/user-folder/**").as("deleteFolder");

    cy.get(`[data-cy="${folderName}"]`)
      .find('[data-cy="moreButton"]')
      .first()
      .click({ force: true });

    cy.get('[data-cy="delete"]')
      .first()
      .click({ force: true });

    if (isValid) {
      cy.get('[data-cy="submit"]').click();
      cy.wait("@deleteFolder").then(xhr => expect(xhr.status).to.eq(200));
      this.verifyFolderNotVisible(folderName);
    } else {
      cy.contains("Only empty folders can be deleted").should("be.visible");
      // cy.contains("span", "Cancel").click();
    }
  };

  createNewFolder = (folderName, isValid = true) => {
    cy.server();
    cy.route("POST", "**/user-folder").as("createFolder");
    cy.contains("span", "NEW FOLDER").click();
    cy.get('[placeholder="Name this folder"]').type(folderName);
    cy.contains("span", "Create").click({ force: true });

    if (isValid) {
      cy.wait("@createFolder").then(xhr => expect(xhr.status).to.eq(200));
      this.verifyFolderVisible(folderName);
    } else {
      cy.contains("The folder name is already used").should("be.visible");
      cy.contains("span", "Cancel").click({ force: true });
    }
  };

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifyFolderVisible = folderName => cy.get(`[data-cy="${folderName}"]`).should("be.visible");

  verifyFolderNotVisible = folderName => cy.get(`[data-cy="${folderName}"]`).should("not.be.visible");

  moveToFolder = (folderName, isValid = true) => {
    cy.server();
    cy.route("PUT", "**/user-folder/**").as("updateFolder");
    cy.contains("span", "Move").click();

    cy.get(".ant-modal-body")
      .find(`[title="${folderName}"]`)
      .click({ force: true });

    cy.get(".ant-modal")
      .contains("span", "Move")
      .click({ force: true });

    if (isValid) {
      cy.wait("@updateFolder").then(xhr => expect(xhr.status).to.eq(200));
      cy.contains(`successfully moved to ${folderName} folder`).should("be.visible");
    } else cy.contains(`Test already exist in ${folderName} folder`).should("be.visible");
  };

  // *** APPHELPERS END ***
}
