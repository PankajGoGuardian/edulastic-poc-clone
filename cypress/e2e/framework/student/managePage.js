import SidebarPage from "../student/sidebarPage";
export default class ManagePage {
  constructor() {
    this.sideBar = new SidebarPage();
  }

  validateclassName = classname => {
    cy.contains(classname).should("be.visible");
  };

  clickonJoinClass = () => {
    cy.get('[data-cy="joinclass"]').click({ force: true });
  };

  selectClassType = classType => {
    // cy.get(".ant-select").click({ force: true });

    cy.contains(classType)
      .should("be.visible")
      .click({ force: true });
  };

  clickonEnterClassCode = () => {
    cy.get('[data-cy="classcodeinput"]').click({ force: true });
  };

  clickonJoinButton = status => {
    cy.server();
    cy.route("POST", "**/enrollment/**").as("enrollment");

    cy.get('[data-cy="joinbutton"]').click({ force: true });

    if (status === "INVALID") {
      cy.wait("@enrollment").then(xhr => {
        expect(xhr.status).to.eq(400);
      });
    }
    if (status === "VALID") {
      cy.wait("@enrollment").then(xhr => {
        expect(xhr.status).to.eq(200);
        console.log("saveEnrollmentDetails", xhr.responseBody);
        cy.saveEnrollmentDetails(xhr.responseBody);
      });
    }
  };

  clickonCancelButton = () => {
    cy.get('[data-cy="cancelbutton"]').click({ force: true });
  };

  verifyShowActiveClass = activeCount => {
    cy.contains(`ACTIVE (${activeCount})`).should("be.visible");
  };

  verifyShowArchiveClass = archiveCount => {
    cy.contains(`ARCHIVE (${archiveCount})`).should("be.visible");
  };

  typeClassCode = classCode => {
    cy.get('[data-cy="classcodeinput"]').type(classCode);
  };

  validateEnterClassCodeMsg = () => {
    cy.get('[data-cy="errormessage"]').should("be.visible");
  };

  validateAPImsg = APImsg => {
    cy.contains(APImsg).should("be.visible");
  };
}
