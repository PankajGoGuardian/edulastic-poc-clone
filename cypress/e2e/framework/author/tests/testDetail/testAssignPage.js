import CypressHelper from "../../../util/cypressHelpers";
import TeacherSideBar from "../../SideBarPage";

export default class TestAssignPage {
  constructor() {
    this.sidebar = new TeacherSideBar();
  }

  // *** ELEMENTS START ***

  getStartDate = () => cy.get('[data-cy="startDate"]');

  getCloseDate = () => cy.get('[data-cy="closeDate"]');

  getMaxAttempt = () => cy.get('[inputfeatures="maxAttemptAllowed"]').find("input");

  getShuffleQue = () => cy.get('[inputfeatures="assessmentSuperPowersShuffleQuestions"]').find("button");

  getShuffleChoices = () => cy.get('[inputfeatures="assessmentSuperPowersShuffleAnswerChoice"]').find("button");

  getAnswerOnPaper = () => cy.get('[inputfeatures="assessmentSuperPowersAnswerOnPaper"]').find("button");

  getCalenderOk = () => cy.get(".ant-calendar-ok-btn");

  getTimeSettingSwitch = () => cy.get('[data-cy="assignment-time-switch"]');

  getTimeSettingTextBox = () => cy.get('[data-cy="assignment-time"]');

  getAssignmentTimeSettingInfo = () => cy.get('[inputfeatures="assessmentSuperPowersTimedTest"]').find("svg");

  getAllowExit = () => cy.get('[data-cy="exit-allowed"]');

  getNavigateTolcbButtonInSuccessPage = () => cy.get('[data-cy="assignButton"]').contains("Go to Live Classboard");

  getNavigateToTestLibraryPage = () => cy.get('[data-cy="assignButton"]').contains("Return to TEST LIBRARY");

  getSafeExamBrowserSwitch = () =>
    cy.get('[inputfeatures="assessmentSuperPowersRequireSafeExamBrowser"]').find("button");

  getQuitPassord = () => cy.get('[placeholder="Quit Password"]');

  getEvalTypesDropDown = () =>
    cy
      .get('[inputfeatures="assessmentSuperPowersCheckAnswerTries"]')
      .next()
      .find(".ant-select-arrow-icon");

  getStudentPlayerskin = () => cy.get('[data-cy="playerSkinType"]');

  getPerformanceBandDropDown = () => cy.get('[data-cy="performance-band"]').find(".ant-select-selection");

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  selectClassDropdown = () => cy.get('[data-cy = "selectClass"]').click();

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

  selectClass = className => {
    this.selectClassDropdown();
    this.clickOnDropDownOptionByText(className);
    cy.focused().blur();
  };

  verifyNoClassesInDropDown = className => {
    this.selectClassDropdown().type(className);
    cy.get(".ant-empty-description").should("contain", "No Data");
  };

  selectTestType = type => {
    cy.get('[data-cy="testType"]').click({ force: true });
    this.clickOnDropDownOptionByText(type);
  };

  selectStudent = students => {
    // cy.get('[data-cy="selectStudent"]').click();
    cy.contains("label", "STUDENTS")
      .next()
      .should("not.have.class", "ant-select-disabled")
      .click();
    cy.wait(1000);
    if (Cypress._.isArray(students)) {
      students.forEach(student => {
        // this.clickOnDropDownOptionByText(student);
        cy.get(`[title="${student}"]`).click({ force: true });
      });
    } else {
      // this.clickOnDropDownOptionByText(students);
      cy.get(`[title="${students}"]`).click({ force: true });
    }
    cy.focused().blur();
  };

  clickOnEntireClass = () => cy.get('[data-cy="radioEntireClass"]').click();

  clickOnSpecificStudent = () => cy.get('[data-cy="radioSpecificStudent"]').click();

  // MAXIMUM ATTEMPTS ALLOWED

  setMaxAttempt = attempt => this.getMaxAttempt().type(`{selectall}${attempt}`);

  clickOnTypesOfReleaseScores = () => cy.get('[data-cy="selectRelaseScore"]').click();

  setReleasePolicy = text => {
    this.clickOnTypesOfReleaseScores();
    this.clickOnDropDownOptionByText(text);
  };

  selectAnswerOnPaper = () =>
    this.getAnswerOnPaper().then($swich => {
      if (!$swich.hasClass("ant-switch-checked")) {
        cy.wrap($swich).click();
      }
    });

  deselectAnsweOnPaper = () =>
    this.getAnswerOnPaper().then($swich => {
      if ($swich.hasClass("ant-switch-checked")) {
        cy.wrap($swich).click();
      }
    });

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

  clickDynamicPassword = () => {
    this.clickOnPassTypeDropDown();
    cy.get(".ant-select-dropdown-menu-item")
      .contains("Dynamic Password")
      .click();
  };

  enterStaticPassword = pass => {
    cy.get('[placeholder="Enter Password"]').type(pass);
  };

  setCheckAnsTries = tries => cy.get('[placeholder="Number of tries"]').type(`{selectall}${tries}`);

  clickOnEvalByType = type => {
    this.getEvalTypesDropDown().click({ force: true });
    cy.get(`[ data-cy=${type}]`).click({ force: true });
  };

  proceedWithDuplicate = () => cy.get('[data-cy="duplicate"]').click();

  proceedWithNoDuplicate = () => cy.get('[data-cy="noDuplicate"]').click();

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

  // start , end => new Date() instance
  setStartAndCloseDate = (start, end) => {
    this.getStartDate().click({ force: true });
    CypressHelper.setDateInCalender(start);
    // cy.get('[data-cy="closeDate"]').click({ force: true });
    CypressHelper.setDateInCalender(end);
  };

  // start - new Date() instance
  setStartDate = start => {
    this.getStartDate().click({ force: true });
    CypressHelper.setDateInCalender(start);
  };

  // Open Policy
  selectOpenPolicy = openPolicy => {
    cy.get('[data-cy="selectOpenPolicy"]').click();
    this.clickOnDropDownOptionByText(openPolicy);
  };

  setEndDate = end => {
    this.getCloseDate().click({ force: true });
    CypressHelper.setDateInCalender(end);
  };

  clickOnAssign = (duplicate = {}) => {
    const assignmentIdObj = {};
    cy.wait(1000);
    cy.server();
    cy.route("POST", "**/assignments").as("assigned");
    cy.contains("ASSIGN").click();
    if (Object.entries(duplicate).length > 0) {
      cy.wait("@assigned").then(xhr => {
        assert(
          xhr.status === 409,
          `assigning the assignment - ${xhr.status === 409 ? "Warning" : JSON.stringify(xhr.responseBody)}`
        );
        if (duplicate.duplicate === true) this.proceedWithDuplicate();
        else this.proceedWithNoDuplicate();
      });
    }
    if (!duplicate.willNotAssign) {
      cy.wait("@assigned").then(xhr => {
        assert(
          xhr.status === 200,
          `assigning the assignment - ${xhr.status === 200 ? "success" : JSON.stringify(xhr.responseBody)}`
        );
        // TODO: will be fixed as per requirement(class id can be included)
        xhr.response.body.result.forEach(obj => {
          assignmentIdObj[obj.testId] = obj._id;
        });
      });
      if (!(duplicate === {} && typeof duplicate.duplicate !== "undefined")) {
        return cy.contains("Success!").then(() => assignmentIdObj);
      }
      return cy.wait(1).then(() => assignmentIdObj);
    }
    return this;
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
    if (time) this.getTimeSettingTextBox().type(`{selectall}${time}`);
  };

  removeAssignmentTime = () =>
    this.getTimeSettingSwitch().then($ele => {
      if ($ele.hasClass("ant-switch-checked"))
        cy.wrap($ele)
          .click()
          .should("not.have.class", "ant-switch-checked");
    });

  disableAllowExit = () =>
    this.getTimeSettingSwitch().then($ele => {
      expect($ele, "Time switch should be enabled first").to.have.class("ant-switch-checked");
      this.getAllowExit()
        .parent()
        .then($el => {
          if ($el.hasClass("ant-checkbox-checked"))
            this.getAllowExit()
              .uncheck({ force: true })
              .should("not.be.checked");
        });
    });

  enableAllowExit = () =>
    this.getTimeSettingSwitch().then($ele => {
      expect($ele, "Time switch should be enabled first").to.have.class("ant-switch-checked");
      this.getAllowExit()
        .parent()
        .then($el => {
          if (!$el.hasClass("ant-checkbox-checked"))
            this.getAllowExit()
              .check({ force: true })
              .should("be.checked");
        });
    });

  makeAssignmentTimed = () =>
    this.getTimeSettingSwitch().then($ele => {
      if (!$ele.hasClass("ant-switch-checked"))
        cy.wrap($ele)
          .click()
          .should("have.class", "ant-switch-checked");
    });

  navigateTolcbAndVerify = assignmentId => {
    this.getNavigateTolcbButtonInSuccessPage().click({ force: true });
    cy.url().should("contain", `/author/classboard/${assignmentId}`);
    return cy.get('[data-cy="studentName"]');
  };

  naviagateToTestlibraryAndVerify = () => {
    this.getNavigateToTestLibraryPage().click({ force: true });
    cy.url().should("contain", `author/tests?`);
    cy.get(`[data-cy="createNew"]`).should("exist");
  };

  showAdvancedSettings = () =>
    cy.get('[data-cy="advanced-option"]').then($ele => {
      if (Cypress.$($ele).text() === "SHOW ADVANCED OPTIONS") cy.wrap($ele).click({ force: true });
    });

  selectStudentPlayerSkinByOption = option => {
    this.showAdvancedSettings();
    this.getStudentPlayerskin().click({ force: true });
    this.selectOptionInDropDown(option);
  };

  selectPerformanceBand = band => {
    this.getPerformanceBandDropDown().click({ force: true });
    this.selectOptionInDropDown(band);
  };

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  visitAssignPageById = id => {
    cy.server();
    cy.route("POST", "**/api/group/search").as("classes");
    cy.visit(`/author/assignments/${id}`);
    cy.wait("@classes");
    cy.contains("OVERRIDE TEST SETTINGS");
  };

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

  selectOptionInDropDown = option =>
    cy
      .get(".ant-select-dropdown-menu-item")
      .contains(option)
      .click({ force: true });

  verifySelectedPerformanceBand = band => this.getPerformanceBandDropDown().should("contain.text", band);

  // *** APPHELPERS END ***
}
