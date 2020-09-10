import CypressHelper from "../../util/cypressHelpers";

export default class SmartFilters {
  // *** ELEMENTS START ***

  getGrades = () => cy.get('[data-cy="grades"]');

  getTestType = () => cy.get('[data-cy="filter-testType"]');

  getFilter = () => cy.get('[data-cy="smart-filter"]');

  getAllAssignment = () => cy.contains("span", "All Assignments");

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  expandFilter = () => {
    cy.server();
    cy.route("GET", "**/user-folder?folderType=ASSIGNMENT").as("getFolders");
    this.getFilter().then($ele => {
      if ($ele.attr("data-test") !== "expanded") {
        cy.wrap($ele)
          .click()
          .should("have.attr", "data-test", "expanded");
        // cy.wait("@getFolders");
      }
    });
  };

  collapseFilter = () =>
    this.getFilter().then($ele => {
      if ($ele.attr("data-test") === "expanded")
        cy.wrap($ele)
          .click()
          .should("have.attr", "data-test", "collapsed");
    });

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
    // CypressHelper.selectDropDownByAttribute("filter-testType", testType);
    this.getTestType().click();
    cy.get(".ant-select-dropdown-menu-item").then($ele => {
      cy.wrap(
        $ele.filter(function() {
          return Cypress.$(this).text() === testType;
        })
      )
        .click({ force: true })
        .then(() => {
          cy.wait("@assignment");
        });
    });
    // this.waitForAssignments();
    cy.focused().blur();
  };

  setClass = classs => {
    CypressHelper.selectDropDownByAttribute("filter-class", classs);
    this.waitForAssignments();
  };

  setStatus = status => {
    CypressHelper.selectDropDownByAttribute("filter-status", status);
    this.waitForAssignments();
  };

  resetAll = () => {
    this.getGrades()
      .find("input")
      .type("{backspace}".repeat(3));
    this.setSubject("All subjects");
    this.setYear("All years");
    this.setTesttype("All");
    this.setClass("All classes");
    this.setStatus("Select Status");
  };

  // folders

  clickOnAllAssignment = () => this.getAllAssignment().click();

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
    cy.contains("span", "Update").click({ force: true });

    if (isValid) {
      cy.wait("@updateFolder").then(xhr => expect(xhr.status).to.eq(200));
      this.verifyFolderVisible(newName);
      this.verifyFolderNotVisible(currentName);
    } else {
      cy.contains("The folder name is already used").should("be.visible");
      cy.contains("span", "Cancel").click({ force: true });
    }
  };

  // Fix test in accordance with EV-15966
  deleteFolder = folderName => {
    cy.server();
    cy.route("DELETE", "**/user-folder/**").as("deleteFolder");

    cy.get(`[data-cy="${folderName}"]`)
      .find('[data-cy="moreButton"]')
      .first()
      .click({ force: true });

    cy.get('[data-cy="delete"]')
      .first()
      .click({ force: true });

    cy.contains(
      `${folderName} will get deleted but all tests will remain untouched. The tests can still be accessed from All Assignments.`
    ).should("be.visible");

    cy.get('[data-cy="submit"]')
      .first()
      .click({ force: true });
    cy.wait("@deleteFolder").then(xhr => expect(xhr.status).to.eq(200));
    this.verifyFolderNotVisible(folderName);
  };

  createNewFolder = (folderName, isValid = true) => {
    cy.server();
    cy.route("POST", "**/user-folder").as("createFolder");
    cy.get('[data-cy="addFolderButton"]').click();
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

  clickOnFolderAction = () => cy.get('[data-cy="assignmentActions"]').click();

  clickOnAddToFolderAction = () => {
    this.clickOnFolderAction();
    cy.get('[data-cy="addToFolder"]').click();
  };

  clickOnRemoveFromFolderAction = () => {
    this.clickOnFolderAction();
    cy.get('[data-cy="removeFromFolder"]').click();
  };

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifyFolderVisible = folderName => cy.get(`[data-cy="${folderName}"]`).should("be.visible");

  verifyFolderNotVisible = folderName => cy.get(`[data-cy="${folderName}"]`).should("not.be.visible");

  moveToFolder = (folderName, testName, isValid = true) => {
    cy.server();
    cy.route("PUT", "**/user-folder/**").as("updateFolder");
    this.clickOnAddToFolderAction();

    cy.get(".ant-modal-body")
      .find(`[title="${folderName}"]`)
      .click({ force: true });

    cy.get(".ant-modal")
      .contains("span", "Add")
      .click({ force: true });
    if (isValid) {
      cy.wait("@updateFolder").then(xhr => expect(xhr.status).to.eq(200));
      cy.contains(`${testName} successfully moved to "${folderName}"`).should("be.visible");
    } else {
      cy.contains(`${testName} already exist in ${folderName} folder`).should("be.visible");
      cy.get('[data-cy="cancel"]').click();
    }
  };

  // *** APPHELPERS END ***
}
