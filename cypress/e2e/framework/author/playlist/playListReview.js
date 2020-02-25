import LiveClassboardPage from "../assignments/LiveClassboardPage";

export default class PlayListReview {
  constructor() {
    this.lcb = new LiveClassboardPage();
  }
  getModuleRowByModule = mod => cy.get(`[data-cy="row-module-${mod}"]`);

  getTestsInModuleByModule = mod => this.getModuleRowByModule(mod).find('[data-cy="moduleAssignment"]');

  getTestByTestByModule = (mod, test) => this.getTestsInModuleByModule(mod).eq(test - 1);

  getDeleteButtonByTestByModule = (mod, test) =>
    this.getTestByTestByModule(mod, test).find('[data-cy="assignmentDeleteOptionsIcon"]');

  getAssignButtonByTestByModule = (mod, test) => this.getTestByTestByModule(mod, test).find('[data-cy="assignButton"]');

  getAssignButtonByModule = mod => this.getModuleRowByModule(mod).find('[data-cy="AssignWholeModule"]');

  getViewTestByTestByModule = (mod, test) => this.getTestByTestByModule(mod, test).find('[data-cy="view-test"]');

  getModuleNameByModule = mod => this.getModuleRowByModule(mod).find('[data-cy="module-name"]');

  getStandardsContainerByTestbyModule = (mod, test) => this.getTestByTestByModule(mod, test).find('[class^="Tags_"]');

  getShowAssignmentByTestByModule = (mod, test) =>
    this.getTestByTestByModule(mod, test).find('[data-cy="show-assignments"]');

  getPresentationIconByTestByModule = (mod, test) =>
    this.getTestByTestByModule(mod, test)
      .next()
      .find('[ data-cy="PresentationIcon"]');

  getPlaylistSub = () => cy.get('[data-cy="playlist-sub"]');

  getPlaylistGrade = () => cy.get('[data-cy="playlist-grade"]');

  getModuleCompleteStatus = () => cy.get('[data-cy="module-complete"]');

  clickShowAssignmentByTestByModule = (mod, test) => this.getShowAssignmentByTestByModule(mod, test).click();

  clickLcbIconByTestByIndex = (mod, test, index) => {
    cy.server();
    cy.route("GET", "**/api/realtime/url").as("lcbLoad");
    this.getPresentationIconByTestByModule(mod, test)
      .children()
      .eq(index)
      .click();
    cy.wait("@lcbLoad");
  };

  clickExpandByModule = mod =>
    this.getModuleRowByModule(mod)
      .find("i")
      .eq(0)
      .then(ele => {
        if (!ele.hasClass("anticon-up")) cy.wrap(ele).click();
      });

  clickCollapseByModule = mod =>
    this.getModuleRowByModule(mod)
      .find("i")
      .eq(0)
      .then(ele => {
        if (ele.hasClass("anticon-up")) cy.wrap(ele).click({ force: true });
      });

  clickOnAssignByTestByModule = (mod, test) =>
    this.getAssignButtonByTestByModule(mod, test).then(button => {
      this.clickAssignmentButtonByButton(button);
    });

  clickOnAssignButtonByModule = mod =>
    this.getAssignButtonByModule(mod).then(button => {
      this.clickAssignmentButtonByButton(button);
    });

  clickAssignmentButtonByButton = button => {
    cy.server();
    cy.route("POST", "**/group/search").as("classLoad");
    cy.wrap(button).click();
    cy.wait("@classLoad");
  };

  clickOnDeleteByTestByModule = (mod, test) => this.getDeleteButtonByTestByModule(mod, test).click();

  clickOnViewTestByTestByModule = (mod, test) => {
    cy.server();
    cy.route("GET", "**/test/*").as("viewTest");
    this.getViewTestByTestByModule(mod, test).click();
    return cy.wait("@viewTest").then(xhr => xhr.response.body.result._id);
  };

  verifyAssignedByTestByModule = (mod, test) =>
    this.getAssignButtonByTestByModule(mod, test).then(button => {
      this.verifyAssigned(button);
    });

  verifyUnAssignedByTestByModule = (mod, test) =>
    this.getAssignButtonByTestByModule(mod, test).then(button => {
      this.verifyUnAssigned(button);
    });

  verifyAssignedByModule = mod =>
    this.getAssignButtonByModule(mod).then(button => {
      this.verifyAssigned(button);
    });

  verifyAssigned = button => cy.wrap(button).should("contain", "ASSIGNED");

  verifyUnAssigned = button => cy.wrap(button).should("not.contain", "ASSIGNED");

  verifyStandardsByTestByModule = (mod, test, std) =>
    this.getStandardsContainerByTestbyModule(mod, test).should("contain", std);

  verifyNoOfTestByModule = (mod, count) => this.getTestsInModuleByModule(mod).should("have.length", count);

  verifyModuleProgress = (completed, total) =>
    cy
      .get('[data-cy="moduleProgress"]')
      .trigger("mouseover", { force: true })
      .should("contain", `${completed}/${total}`);

  verifyPlalistGrade = grade => this.getPlaylistGrade().should("contain.text", grade);

  verifyPlalistSubject = sub => this.getPlaylistSub().should("contain.text", sub);

  verifyModuleCompleteText = () => this.getModuleCompleteStatus().should("have.text", "MODULE COMPLETED");
}
