import TestHeader from "./header";

export default class TestSettings {
  constructor() {
    this.header = new TestHeader();
  }

  // *** ELEMENTS START ***

  getCheckAnswer = () => cy.get("#check-answer-tries-per-question").find("input");

  // Maximum Attempts Allowed
  getMaxAttempt = () => cy.get("#maximum-attempts-allowed").find("input");

  // Shuffle Questions
  getShuffleQuestionButton = () => cy.get('[data-cy="shuffleQuestions"]');

  // Shuffle Choice
  getShuffleChoiceButton = () => cy.get('[data-cy="shuffleChoices"]');

  // Check Answer Tries Per Question
  getCheckAnswer = () => cy.get("#check-answer-tries-per-question").find("input");

  getTimeSettingSwitch = () => cy.get('[data-cy="assignment-time-switch"]');

  getAnsOnPaperSwitch = () => cy.get('[data-cy="answer-on-paper"]');

  getTimeSettingTextBox = () => cy.get('[data-cy="assignment-time"]');

  getAssignmentTimeSettingInfo = () => cy.get('[id="timed-test"]').find("svg");

  getAllowExit = () => cy.get('[data-cy="exit-allowed"]');

  getSafeExamBrowserSwitch = () => cy.get("#require-safe-exame-browser").find("button");

  getQuitPassord = () => cy.get('[placeholder="Quit Password"]');

  getMarkAsDoneAutomatically = () => cy.get("#mark-as-done").find('[value="automatically"]');

  getMarkAsDoneManually = () => cy.get("#mark-as-done").find('[value="manually"]');

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickOnCalculatorByType = type => {
    cy.get(`[ data-cy=${type}]`).click();
  };

  clickOnShuffleChoices = () => cy.get('[ data-cy="shuffleChoices"]').click();

  clickOnShuffleQuestions = () => cy.get('[data-cy="shuffleQuestions"]').click();

  clickOnPassword = () =>
    cy
      .contains("Require Password")
      .parentsUntil('[id="test-type"]')
      .find(".ant-select-arrow-icon")
      .click();

  clickOnStaticPassword = () =>
    cy
      .get(".ant-select-dropdown-menu-item")
      .contains("Static Password")
      .click();

  enterStaticPassword = pass => cy.get('[placeholder="Enter Password"]').type(pass);

  clickOnDynamicPassword = () =>
    cy
      .get(".ant-select-dropdown-menu-item")
      .contains("Dynamic Password")
      .click();

  clickOnEvalByType = type => {
    cy.get(`[ data-cy=${type}]`).click({ force: true });
  };

  selectDontReleaseScoreResponse = () => cy.get('[value="DONT_RELEASE"]').click();

  setRealeasePolicy = policy => cy.get(`[VALUE=${policy}]`).click();

  setMaxAttempt = attempts =>
    cy
      .get('[id="maximum-attempts-allowed"]')
      .find("input")
      .type(attempts);

  setCheckAnswer = checkAns => this.getCheckAnswer().type(`{selectall}${checkAns}`);

  setMaxAttempt = maxAttempt => this.getMaxAttempt().type(`{selectall}${maxAttempt}`);

  setCheckAnswer = checkAns => this.getCheckAnswer().type(`{selectall}${checkAns}`);

  makeAssignmentTimed = () =>
    this.getTimeSettingSwitch().then($ele => {
      if (!$ele.hasClass("ant-switch-checked"))
        cy.wrap($ele)
          .click()
          .should("have.class", "ant-switch-checked");
    });

  setAssignmentTime = time => {
    // time in mns
    this.makeAssignmentTimed();
    this.getTimeSettingTextBox().type(`{selectall}${time}`);
  };

  removeAssignmentTime = () =>
    this.getTimeSettingSwitch().then($ele => {
      if ($ele.hasClass("ant-switch-checked"))
        cy.wrap($ele)
          .click()
          .should("not.have.class", "ant-switch-checked");
    });

  enableAllowPuase = () =>
    this.getTimeSettingSwitch().then($ele => {
      expect($ele, "Time switch should be enabled first").to.have.class("ant-switch-checked");
      this.getAllowExit().check();
    });

  disableAllowPause = () =>
    this.getTimeSettingSwitch().then($ele => {
      expect($ele, "Time switch should be enabled first").to.not.have.class("ant-switch-checked");
      this.getAllowExit().uncheck();
    });

  // answer on paper
  enableAnswerOnPaper = () =>
    this.getAnsOnPaperSwitch().then($ele => {
      if (!$ele.hasClass("ant-switch-checked"))
        cy.wrap($ele)
          .click()
          .should("have.class", "ant-switch-checked");
    });

  disableAnswerOnPaper = () =>
    this.getAnsOnPaperSwitch().then($ele => {
      if ($ele.hasClass("ant-switch-checked"))
        cy.wrap($ele)
          .click()
          .should("not.have.class", "ant-switch-checked");
    });

  setSafeExamBrowser = pass =>
    this.getSafeExamBrowserSwitch().then($ele => {
      if (!$ele.hasClass("ant-switch-checked")) {
        cy.wrap($ele).click({ force: true });
      }
      this.getQuitPassord().type(pass);
    });

  unSetSafeExamBrowser = () =>
    this.getSafeExamBrowserSwitch().then($ele => {
      if ($ele.hasClass("ant-switch-checked")) cy.wrap($ele).click({ force: true });
    });

  setShuffleQuestions = () =>
    this.getShuffleQuestionButton().then($ele => {
      if (!$ele.hasClass("ant-switch-checked")) {
        cy.wrap($ele).click({ force: true });
      }
    });

  unSetShuffleQuestions = () =>
    this.getShuffleQuestionButton().then($ele => {
      if ($ele.hasClass("ant-switch-checked")) cy.wrap($ele).click({ force: true });
    });

  setShuffleChoices = () =>
    this.getShuffleChoiceButton().then($ele => {
      if (!$ele.hasClass("ant-switch-checked")) {
        cy.wrap($ele).click({ force: true });
      }
    });

  unSetShuffleChoices = () =>
    this.getShuffleChoiceButton().then($ele => {
      if ($ele.hasClass("ant-switch-checked")) cy.wrap($ele).click({ force: true });
    });

  setMarkAsDoneAutomatically = () => this.getMarkAsDoneAutomatically().click();

  setMarkAsDoneManually = () => this.getMarkAsDoneManually().click();

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifyTimeAssignedForTest = questionCount => this.getTimeSettingTextBox().should("have.value", `${questionCount}`);

  verifyInfoAboutTestTime = () => {
    this.getAssignmentTimeSettingInfo()
      .scrollIntoView()
      .trigger("mouseover");
    cy.wait(500);
    cy.get(".ant-tooltip-inner").contains(
      "The time can be modified in one minute increments.  When the time limit is reached, students will be locked out of the assessment.  If the student begins an assessment and exits with time remaining, upon returning, the timer will start up again where the student left off.  This ensures that the student does not go over the allotted time."
    );
  };
  // *** APPHELPERS END ***
}
