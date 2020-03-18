import Header from "./header";
import CypressHelper from "../../../util/cypressHelpers";

export default class TestSummayTab {
  constructor() {
    this.header = new Header();
  }

  // *** ELEMENTS START ***

  getTestDescription = () => cy.xpath("//textarea[@placeholder='Enter a description']");

  getTestName = () => cy.get('[data-cy="testname"]');

  getTestGradeSelect = () => cy.get('[data-cy="gradeSelect"]');

  getTestSubjectSelect = () => cy.get('[data-cy="subjectSelect"]');

  getTestCollectionSelect = () => cy.get('[data-cy="collectionsSelect"]');

  getTestTagsSelect = () => cy.get('[data-cy="tagsSelect"]');

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  selectGrade = (grade, clear = false) => {
    if (clear) {
      this.getTestGradeSelect().then($ele => {
        if ($ele.find(".anticon-close").length !== 0) cy.wrap($ele.find(".anticon-close")).click({ multiple: true });
      });
    }
    this.getTestGradeSelect().click({ force: true });
    cy.get(".ant-select-dropdown-menu-item")
      .contains(grade)
      .click({ force: true });
    this.getTestGradeSelect()
      .find("input")
      .type("{esc}", { force: true });
  };

  setName = testname => {
    this.getTestName()
      .clear()
      .type(testname);
  };

  selectSubject = (subject, clear = false) => {
    if (clear) {
      this.getTestSubjectSelect().then($ele => {
        if ($ele.find(".anticon-close").length !== 0) cy.wrap($ele.find(".anticon-close")).click({ multiple: true });
      });
    }
    this.getTestSubjectSelect().click({ force: true });
    cy.get(".ant-select-dropdown-menu-item")
      .contains(subject)
      .click({ force: true });
    cy.focused().blur();
  };

  selectCollection = collection => {
    this.getTestCollectionSelect().click({ force: true });
    cy.get(".ant-select-dropdown-menu-item")
      .contains(collection)
      .click({ force: true });
    cy.focused().blur();
  };

  addTags = tags => {
    cy.server();
    cy.route("POST", "**/tag").as("add-tags");
    this.getTestTagsSelect()
      .click({ force: true })
      .find("input")
      .type(tags, { force: true });
    cy.wait(300); // allow list to expand
    cy.get(".ant-select-dropdown-menu-item").then($ele => {
      cy.wrap(
        $ele
          // eslint-disable-next-line func-names
          .filter(function() {
            return Cypress.$(this).text() === `${tags} (Create new Tag)`;
          })
      ).click({ force: true });
    });
    cy.wait("@add-tags").then(xhr => {
      expect(xhr.status).to.eq(200);
    });
  };

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  verifyName = name => this.getTestName().should("have.value", name);

  verifyGrade = grade => {
    this.getTestGradeSelect()
      .find("li.ant-select-selection__choice")
      .should("contain", grade);
  };

  verifySubject = subject => {
    this.getTestSubjectSelect()
      .find("li.ant-select-selection__choice")
      .should("contain", subject);
  };
  // *** APPHELPERS END ***
}
