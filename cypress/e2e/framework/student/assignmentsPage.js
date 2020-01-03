import StudentTestPage from "./studentTestPage";
import SidebarPage from "../student/sidebarPage";

class AssignmentsPage {
  // page element on AssignmentPage
  constructor() {
    this.sidebar = new SidebarPage();
    //this.studentTest = new StudentTestPage();
  }
  getAssignmentButton() {
    return cy.get('[data-cy="assignmentButton"]');
  }

  getAssignmentByTestId(testId) {
    return cy.get(`[data-cy="test-${testId}"]`);
  }

  getReviewButton() {
    return cy.get('[data-cy="reviewButton"]');
  }

  getStatus() {
    return cy.get('[data-cy="status"]');
  }

  getAttemptCount() {
    return cy.get('[data-cy="attemptsCount"]');
  }

  getScore() {
    return cy.get('[data-cy="score"]');
  }

  getPercent() {
    return cy.get('[data-cy="percent"]');
  }

  getAttempts() {
    return cy.get('[data-cy="attemptClick"]');
  }

  getPercentage() {
    return cy.get('[data-cy="percentage"]');
  }

  getclass(classname) {
    cy.get(".ant-select").click();
    cy.contains(classname)
      .should("be.visible")
      .click();
  }

  verifyAssignmentCount(status) {
    cy.get("body")
      .find('[data-cy="assignmentButton"]')
      .then(ele => {
        const count = ele.length;

        if (status === "ALL") {
          this.getAllAssignments().contains(count);
        }
        if (status === "NOT_STARTED") {
          this.getNotStarted().contains(count);
        }
        if (status === "IN_PROGRESS") {
          this.getInProgress().contains(count);
        }
      });
  }

  getAllAssignments = () => cy.get('[data-cy="ALL"]');

  getNotStarted = () => cy.get('[data-cy="NOT_STARTED"]');

  getInProgress = () => cy.get('[data-cy="IN_PROGRESS"]');

  // common actions on AssignmentPage

  clickOnAssignmentButton() {
    cy.server();
    // cy.route("POST", "**/test-activity").as("startTest");
    cy.route("GET", "**/test/**").as("gettest");
    cy.route("POST", "**/test-activity/**").as("saved");

    this.getAssignmentButton()
      .should("be.visible")
      .click({ force: true });

    // cy.wait("@startTest");
    // cy.wait("@gettest");
    // return cy.wait("@saved").then(() => new StudentTestPage());
    return cy.wait("@gettest").then(() => {
      return new StudentTestPage();
    });
  }

  clickOnAssigmentByTestId = testId => {
    cy.server();
    cy.route("GET", "**/test/**").as("gettest");
    this.getAssignmentByTestId(testId)
      .should("be.visible")
      .find('[data-cy="assignmentButton"]')
      .click({ force: true });
    return cy.wait("@gettest").then(() => new StudentTestPage());
  };

  validateAssignment(name, status, assignmentButtonValue, assessmentType = "A") {
    cy.contains("div", name).should("be.visible");
    cy.get('[data-cy="testType"]').should("have.text", assessmentType);
    this.getStatus().should("contain.text", status);
    this.getAssignmentButton().should("have.text", assignmentButtonValue);
  }

  validateStats(attemptNum, attempt, score, percent) {
    this.getAttemptCount().should("have.text", attempt);
    this.getScore().should("have.text", score);
    this.getPercent().should("have.text", percent);

    this.validateAttemptLinkStats(attemptNum, attemptNum, score, percent);
  }

  validateAttemptLinkStats(totalAttempt, attemptNum, score, percent) {
    this.getAttempts()
      .should("be.visible")
      .click();

    this.getPercentage().should("have.length", totalAttempt);

    this.getPercentage()
      .eq(attemptNum - 1)
      .parent()
      .parent()
      .find('[data-cy="score"]')
      .should("have.text", score);

    this.getPercentage()
      .eq(attemptNum - 1)
      .should("have.text", percent);

    this.getAttempts()
      .should("be.visible")
      .click();

    this.getPercentage().should("have.length", 0);
  }

  verifyTestNameById = (testName, id) => this.getTestNameById(id).should("contain", testName);

  getTestNameById = id => this.getAssignmentByTestId(id).find('[data-cy="testTitle"]');

  verifyAssignedTestID = (oldtestid, newtestid) => {
    this.sidebar.clickOnAssignment();
    this.verifyAbsenceOfTest(newtestid);
    this.verifyPresenceOfTest(oldtestid);
  };

  verifyAbsenceOfTest = id => cy.get("body").should("not.have.descendants", `[data-cy="test-${id}"]`);

  verifyPresenceOfTest = id => cy.get("body").should("have.descendants", `[data-cy="test-${id}"]`);

  reviewSubmittedTestById = id => {
    this.getAssignmentByTestId(id)
      .find('[data-cy="reviewButton"]')
      .click({ force: true });
  };

  // PAUSED

  verufyAssignmentIslocked = () => cy.get('[data-cy="lockAssignment"]').should("exist");
}

export default AssignmentsPage;
