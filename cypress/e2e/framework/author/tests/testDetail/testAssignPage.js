import CypressHelper from "../../../util/cypressHelpers";
import TeacherSideBar from "../../SideBarPage";

export default class TestAssignPage {
  constructor() {
    this.sidebar = new TeacherSideBar();
  }

  clickOnDropDownOptionByText = option => {
    cy.wait(500);
    cy.get(".ant-select-dropdown-menu-item").then($ele => {
      cy.wrap(
        $ele
          // eslint-disable-next-line func-names
          .filter(function() {
            return Cypress.$(this).text() === option;
          })
      ).click({ force: true });
    });
  };

  visitAssignPageById = id => {
    cy.server();
    cy.route("POST", "**/api/group/search").as("classes");
    cy.visit(`/author/assignments/${id}`);
    cy.wait("@classes");
  };

  selectClass = className => {
    cy.get('[data-cy="selectClass"]').click();
    this.clickOnDropDownOptionByText(className);
    cy.focused().blur();
  };

  selectTestType = type => {
    cy.get('[data-cy="testType"]').click({ force: true });
    this.clickOnDropDownOptionByText(type);
  };

  selectStudent = students => {
    cy.get('[data-cy="selectStudent"]').click();
    cy.wait(1000);
    if (Cypress._.isArray(students)) {
      students.forEach(student => {
        this.clickOnDropDownOptionByText(student);
      });
    } else {
      this.clickOnDropDownOptionByText(students);
    }
    cy.focused().blur();
  };

  clickOnEntireClass = () => cy.get('[data-cy="radioEntireClass"]').click();

  clickOnSpecificStudent = () => cy.get('[data-cy="radioSpecificStudent"]').click();

  getCalenderOk = () => cy.get(".ant-calendar-ok-btn");

  // start , end => new Date() instance
  setStartAndCloseDate = (start, end) => {
    this.getStartDate().click({ force: true });
    CypressHelper.setDateInCalender(start);
    // cy.get('[data-cy="closeDate"]').click({ force: true });
    CypressHelper.setDateInCalender(end);
  };

  getStartDate = () => cy.get('[data-cy="startDate"]');

  getCloseDate = () => cy.get('[data-cy="closeDate"]');

  // start - new Date() instance
  setStartDate = start => {
    this.getStartDate().click({ force: true });
    CypressHelper.setDateInCalender(start);
  };

  setEndDate = end => {
    this.getCloseDate().click({ force: true });
    CypressHelper.setDateInCalender(end);
  };

  clickOnAssign = (duplicate = {}) => {
    cy.wait(1000);
    cy.server();
    cy.route("POST", "**/assignments").as("assigned");
    cy.contains("ASSIGN").click();
    if (Object.entries(duplicate).length > 0) {
      cy.wait("@assigned");
      if (duplicate.duplicate === true) this.proceedWithDuplicate();
      else this.proceedWithNoDuplicate();
    }
    if (!duplicate.willNotAssign) {
      cy.wait("@assigned").then(xhr => {
        assert(
          xhr.status === 200,
          `assigning the assignment - ${xhr.status === 200 ? "success" : JSON.stringify(xhr.responseBody)}`
        );
      });
      if (!(duplicate === {} && typeof duplicate.duplicate !== "undefined")) return cy.contains("Success!");
      else return cy.wait(1);
    } else return cy.wait(1);
  };

  // OVER RIDE TEST SETTING

  showOverRideSetting = () => {
    if (Cypress.$('[inputfeatures="assessmentSuperPowersMarkAsDone"]').length === 0) {
      cy.contains("OVERRIDE TEST SETTINGS").click({ force: true });
    }
  };

  // MARK AS DONE
  setMarkAsDoneToManual = () =>
    cy
      .get('[inputfeatures="assessmentSuperPowersMarkAsDone"]')
      .find('[value="manually"]')
      .check();

  setMarkAsDoneToAutomatic = () =>
    cy
      .get('[inputfeatures="assessmentSuperPowersMarkAsDone"]')
      .find('[value="automatically"]')
      .check();

  // MAXIMUM ATTEMPTS ALLOWED
  getMaxAttempt = () => cy.get('[inputfeatures="maxAttemptAllowed"]').find("input");

  setMaxAttempt = attempt => this.getMaxAttempt().type(`{selectall}${attempt}`);

  clickOnTypesOfReleaseScores = () => cy.get('[data-cy="selectRelaseScore"]').click();

  setReleaseScoreAndResponse = () => {
    this.clickOnTypesOfReleaseScores();
    cy.get(".ant-select-dropdown-menu-item")
      .contains("Release scores and student responses")
      .click();
  };

  getShuffleQue = () => cy.get('[inputfeatures="assessmentSuperPowersShuffleQuestions"]').find("button");

  getShuffleChoices = () => cy.get('[inputfeatures="assessmentSuperPowersShuffleAnswerChoice"]').find("button");

  deselectShuffleQuestions = () =>
    this.getShuffleQue().then($swich => {
      if ($swich.hasClass("ant-switch-checked")) {
        cy.wrap($swich).click();
      }
    });

  selectShuffleQuestions = () =>
    this.getShuffleQue().then($swich => {
      if (!$swich.hasClass("ant-switch-checked")) {
        cy.wrap($swich).click();
      }
    });

  deselectShuffleChoices = () =>
    this.getShuffleChoices().then($swich => {
      if ($swich.hasClass("ant-switch-checked")) {
        cy.wrap($swich).click();
      }
    });

  selectShuffleChoices = () =>
    this.getShuffleChoices().then($swich => {
      if (!$swich.hasClass("ant-switch-checked")) {
        cy.wrap($swich).click();
      }
    });

  clickOnCalculatorByType = type => {
    cy.get(`[ data-cy=${type}]`).click();
  };

  clickOnPassTypeDropDown = () =>
    cy
      .get('[inputfeatures="assessmentSuperPowersRequirePassword"]')
      .find(".ant-select-arrow")
      .click();

  clickOnStaticPassword = () => {
    this.clickOnPassTypeDropDown();
    cy.get(".ant-select-dropdown-menu-item")
      .contains("Static Password")
      .click();
  };

  enterStaticPassword = pass => {
    cy.get('[placeholder="Enter Password"]').type(pass);
  };

  setCheckAnsTries = tries => cy.get('[placeholder="Number of tries"]').type(`{selectall}${tries}`);

  clickOnEvalByType = type => {
    cy.get(`[ data-cy=${type}]`).click({ force: true });
  };

  proceedWithDuplicate = () => cy.get('[data-cy="duplicate"]').click();

  proceedWithNoDuplicate = () => cy.get('[data-cy="noDuplicate"]').click();
}
