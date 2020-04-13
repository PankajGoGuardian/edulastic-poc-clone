import TestAddItemTab from "../tests/testDetail/testAddItemTab";
import SmartFilters from "./smartFilters";

class AuthorAssignmentPage {
  constructor() {
    this.smartFilter = new SmartFilters();
  }

  // *** ELEMENTS START ***

  getAllStudentCard = () => cy.get('[data-cy="studentName"]');

  getStatus = () => cy.get('[data-cy="status"]');

  getSubmitted = () => cy.get('[data-cy="submitted"]');

  getGraded = () => cy.get('[data-cy="graded"]');

  getClass = () => cy.get('[data-cy="class"]');

  getTestRowByTestId = id => cy.get(`[data-test=${id}]`);

  getAssignmentRowsTestById = id =>
    cy
      .get(`[data-cy=${id}]`)
      .find(".ant-table-row-level-0")
      .as("assignmentRow");

  getSubmittedByAssignmentRow = () => cy.get("@assignmentRow").find('[data-cy="submitted"]');

  getClassByAssignmentRow = () => cy.get("@assignmentRow").find('[data-cy="class"]');

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  selectCheckBoxByTestName = testName => {
    cy.get('[data-cy="assignmentName"]')
      .contains(testName)
      .closest("tr")
      .find('input[type="checkbox"]')
      .check({ force: true });
  };

  deSelectCheckBoxByTestName = testName => {
    cy.get('[data-cy="assignmentName"]')
      .contains(testName)
      .closest("tr")
      .find(".ant-checkbox-input")
      .uncheck();
  };

  clickOnEllipsis(index) {
    return cy
      .get(".ant-pagination-item-ellipsis")
      .eq(`${index}`)
      .click();
  }

  clickOnPageIndex(index) {
    return cy.get(`.ant-pagination-item-${index}`).click();
  }

  clickOnButtonToShowAllClassByIndex(index) {
    return cy
      .get("[data-cy=ButtonToShowAllClasses]")
      .eq(index)
      .click({ force: true });
  }

  clcikOnPresenatationIconByIndex = (index, assignmentNum = 0) => {
    cy.server();
    cy.route("GET", "**/assignments/**").as("assignment");
    cy.get("[data-cy=PresentationIcon]")
      .eq(assignmentNum)
      .children()
      .eq(index)
      .click();
    cy.wait("@assignment");
    cy.get('[data-cy="studentName"]').should("have.length.greaterThan", 0);
  };

  clickOnActions = () => cy.contains("span", "ACTIONS").click({ force: true });

  clickOnDuplicateAndWait = () => {
    cy.server();

    cy.route("POST", /\btest\b.*\bduplicate\b/g).as("duplicate");

    this.clickOnActions();

    cy.get('[data-cy="duplicate"]').click({ force: true });

    return cy.wait("@duplicate").then(xhr => {
      expect(xhr.status).to.eq(200);
      return cy.saveTestDetailToDelete(xhr.response.body.result._id).then(() => xhr.response.body.result._id);
    });
  };

  clickOnPreviewTestAndVerifyId = TestID => {
    cy.server();
    cy.route("GET", "**/api/test/**").as("viewAsStudent");

    this.clickOnActions();
    cy.get('[data-cy="preview"]').click({ force: true });
    cy.wait("@viewAsStudent").then(xhr => expect(xhr.response.body.result._id).to.equal(TestID));
  };

  clickOnViewDetailsAndverifyId = item => {
    cy.server();
    cy.route("GET", "**/api/test/**").as("testLoad");

    this.clickOnActions();
    cy.get('[data-cy="view-details"]').click();
    cy.wait("@testLoad");

    cy.url()
      .then(url => url.split("/").reverse()[0])
      .should("be.eq", item);
  };

  clickOnEditTest = (isUsed = false) => {
    cy.server();
    cy.route("PUT", "**/test/**").as("new-version");
    cy.route("GET", "**/default-test-settings/*").as("testdrafted");

    this.clickOnActions();
    cy.get('[data-cy="edit-Assignment"]')
      .click({ force: true })
      .then(() => {
        // pop up that comes up when we try to edit a assigned test
        cy.contains("This test is already assigned to students.")
          .parent()
          .contains("span", "PROCEED")
          .click({ force: true });
        cy.wait("@testdrafted").then(xhr => {
          assert(xhr.status === 200);
        });
        if (isUsed)
          cy.wait("@new-version").then(xhr => {
            assert(xhr.status === 200, "Test versioned");
            cy.saveTestDetailToDelete(xhr.response.body.result._id);
          });
      });
    cy.wait(2000);
  };

  clickOnUnassign = () => {
    cy.server();
    cy.route("DELETE", "**/delete-assignments").as("deleteAssignments");
    this.clickOnActions();

    cy.get('[data-cy="delete-Assignment"]').click({ force: true });
    cy.get(".ant-modal-content")
      .find("input")
      .type("UNASSIGN", { force: true });
    cy.get(".ant-modal-content")
      .find('[ data-cy="submitConfirm"]')
      .click({ force: true });
    cy.wait("@deleteAssignments");
  };

  clickOnReleaseGrade = () => cy.get('[data-cy="release-grades"]').click({ force: true });

  clickOnApply = () => cy.get('[data-cy="apply"]').click({ force: true });

  clickOnAssign = () => {
    cy.server();
    cy.route("POST", "**/api/group/search").as("classes");
    this.clickOnActions();
    cy.get('[data-cy="assign"]').click();
    cy.wait("@classes");
  };

  setReleaseGradeOption = releaseGradeType => {
    cy.server();
    cy.route("PUT", "**/assignments/**").as("assignmentUpdate");
    this.clickOnActions();
    this.clickOnReleaseGrade();
    cy.get(`[data-cy='${releaseGradeType}']`).click({ force: true });
    this.clickOnApply({ force: true });
    cy.wait("@assignmentUpdate").then(xhr => {
      expect(xhr.status).to.eq(200);
      // waiting for sqs to process
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(5000);
    });
  };

  clickOnLCBbyTestId = testId => {
    cy.server();
    cy.route("GET", "**/assignments/**").as("assignment");
    this.getAssignmentRowsTestById(testId)
      .find('[data-cy="lcb"]')
      .click();
    cy.wait("@assignment");
    cy.get('[data-cy="studentName"]').should("have.length.greaterThan", 0);
  };

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifyStatus = status => this.getStatus().should("have.text", status);

  verifySubmitted = submitted => this.getSubmitted().should("have.text", submitted);

  verifyGraded = graded => this.getGraded().should("have.text", graded);

  verifyEditTestURLUnAttempted = oldTestId =>
    // URL during edit from Assignments page is having following pattern
    cy.wait(5000).then(() =>
      cy.url().then(newUrl => {
        // expect(newUrl).to.include(`/${oldTestId}/editAssigned`);
        expect(newUrl).to.include(`tests/tab/review/id/${oldTestId}`);
      })
    );

  verifyAssignmentRowByTestId = (testId, className, submitted = 0, total) => {
    this.getAssignmentRowsTestById(testId);
    if (className) this.getClassByAssignmentRow().should("have.text", className);
    if (total) this.getSubmittedByAssignmentRow().should("have.text", `${submitted} of ${total}`);
  };

  // *** APPHELPERS END ***
}

export default AuthorAssignmentPage;
