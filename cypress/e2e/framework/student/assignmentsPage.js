/* eslint-disable class-methods-use-this */
import StudentTestPage from "./studentTestPage";
import SidebarPage from "./sidebarPage";

class AssignmentsPage {
  // page element on AssignmentPage
  constructor() {
    this.sidebar = new SidebarPage();
    // this.studentTest = new StudentTestPage();
  }

  // *** ELEMENTS START ***

  getAssignmentButton() {
    return cy.get('[data-cy="assignmentButton"]', { timeout: 30000 }); // increasing timeout as work around, unblocks few cases when loading assignment page in CI was > 10 sec
  }

  getAssignmentByTestId(testId) {
    return cy.get(`[data-cy="test-${testId}"]`, { timeout: 30000 });
  }

  getReviewButton() {
    return cy.get('[data-cy="reviewButton"]');
  }

  getStatus() {
    return cy.get('[data-cy="status"]', { timeout: 30000 });
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

  getAllAssignments = () => cy.get('[data-cy="ALL"]');

  getNotStarted = () => cy.get('[data-cy="NOT_STARTED"]');

  getInProgress = () => cy.get('[data-cy="IN_PROGRESS"]');

  getTestNameById = id => this.getAssignmentByTestId(id).find('[data-cy="testTitle"]');

  getReviewButtonById = id => this.getAssignmentByTestId(id).find('[data-cy="reviewButton"]');

  getStatusByPosition = pos => this.getStatus().eq(pos);

  getTimeAvailableForAssignmentById = testid =>
    this.getAssignmentByTestId(testid)
      .find(".anticon-clock-circle")
      .eq(1)
      .next();

  getOkOnPopUp = () =>
    cy
      .get(".ant-modal-confirm-btns")
      .find("button")
      .last();

  getAssignmentButtonByTestId = testId =>
    this.getAssignmentByTestId(testId)
      .should("be.visible")
      .find('[data-cy="assignmentButton"]');

  verifyTimeAndClickOkOnPopUp = (time, exitAllowed) => {
    cy.wait(500);
    if (exitAllowed) {
      this.getTimeOnPopUP()
        .parent()
        .should(
          "contain.text",
          ` This is a timed assignment which should be finished within the time limit set for this assignment. The time limit for this assignment is  ${time} minutes. Do you want to continue?`
        );
    } else {
      this.getTimeOnPopUP()
        .parent()
        .should(
          "contain.text",
          ` This is a timed assignment which should be finished within the time limit set for this assignment. The time limit for this assignment is  ${time} minutes and you can’t quit in between. Do you want to continue?`
        );
    }
    return this.getOkOnPopUp().click();
  };

  getTimeOnPopUP = () => cy.get('[data-cy="test-time"]');

  getLaunchRetakeButton = () => cy.get('[data-cy="launch-retake"]');

  getTestTypeByTestId = id => this.getAssignmentByTestId(id).find('[data-cy="testType"]');

  getSEBiconByTestId = id => this.getAssignmentByTestId(id).find('[title="This test requires Safe Exam Browser"]');

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  // common actions on AssignmentPage
  clickOnAssignmentButton() {
    cy.server();
    // cy.route("POST", "**/test-activity").as("startTest");
    cy.route("GET", "**/test/**").as("gettest");
    cy.route("POST", "**/test-activity/**").as("saved");

    this.getAssignmentButton()
      .should("be.visible")
      .click({ force: true })
      .then(() => {
        if (Cypress.$('[data-cy="attemptsCount"]').length === 1) this.getLaunchRetakeButton().click({ force: true });
      });

    // cy.wait("@startTest");
    // cy.wait("@gettest");
    // return cy.wait("@saved").then(() => new StudentTestPage());

    return cy.wait("@gettest").then(() => {
      cy.get('[data-cy="next"]', { timeout: 30000 }).then(() => new StudentTestPage());
    });
  }

  clickOnAssigmentByTestId = (testId, options = {}) => {
    const { pass = false, time = false, isExitAllowed = true, isFirstAttempt = true } = options;
    /* {
      pass: "password in string"
      timedAssignment: "Time in minutes/string"
      exitAllowed : "boolean"
      isFirstAttempt : "boolean"
    } */
    cy.server();
    cy.route("GET", "**/test/**").as("gettest");

    this.getAssignmentButtonByTestId(testId).click({ force: true });

    if (!isFirstAttempt) this.getLaunchRetakeButton().click({ force: true });

    if (time) {
      if (isExitAllowed) this.verifyTimeAndClickOkOnPopUp(time, true);
      else this.verifyTimeAndClickOkOnPopUp(time, false);
    }

    if (pass) {
      this.enterPassword(pass);
      this.clickOnStartAfterPassword();
    }

    return cy.wait("@gettest").then(xhr => {
      cy.get('[data-cy="next"]', { timeout: 30000 }); // waiting for page rendering
      // TODO: trim the return value to result, so that method can be reused
      return cy.wait(1).then(() => xhr.response.body.result.itemGroups);
    });
  };

  clickOnReviewButton = () => {
    this.getReviewButton().click({ force: true });
  };

  enterPassword = pass => cy.get('[placeholder="Enter assignment password"]').type(pass);

  clickOnStartAfterPassword = () => cy.get('[data-cy="start"]').click();

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

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

  verifyAssignedTestID = (oldtestid, newtestid) => {
    this.sidebar.clickOnAssignment();
    this.verifyAbsenceOfTest(newtestid);
    this.verifyPresenceOfTest(oldtestid);
  };

  verifyAbsenceOfTest = id => cy.get("body").should("not.have.descendants", `[data-cy="test-${id}"]`);

  verifyPresenceOfTest = id => cy.get("body", { timeout: 30000 }).should("have.descendants", `[data-cy="test-${id}"]`);

  reviewSubmittedTestById = id => {
    this.getReviewButtonById(id).click({ force: true });
  };

  verifyAssignmentIslocked = () => cy.get('[data-cy="lockAssignment"]').should("exist");

  verifyTimeAvalableForTestById = (testid, time) =>
    this.getTimeAvailableForAssignmentById(testid).should("contain.text", `${time} minutes`);

  verifyAssignTypeByTestId = (id, aType) => this.getTestTypeByTestId(id).should("have.text", aType);

  verifyStatusOfAssignment = status => {
    const statuses = [];
    this.getStatus().each(ele => {
      statuses.push(ele.text().trim());
    });
    cy.wait(1).then(() => status.forEach(sta => expect(sta).to.be.oneOf(statuses)));
  };

  // *** APPHELPERS END ***
}

export default AssignmentsPage;
