import Header from "./header";

export default class TestSummayTab {
  constructor() {
    this.header = new Header();
  }

  getTestDescription = () => cy.xpath("//textarea[@placeholder='Enter a description']");

  getTestName = () => cy.get('[data-cy="testname"]');

  getTestGradeSelect = () => cy.get('[data-cy="gradeSelect"]');

  getTestSubjectSelect = () => cy.get('[data-cy="subjectSelect"]');

  getTestTagsSelect = () => cy.get('[data-cy="tagsSelect"]');

  selectGrade = grade => {
    this.getTestGradeSelect().click({ force: true });
    cy.get(".ant-select-dropdown-menu-item")
      .contains(grade)
      .click({ force: true });
    this.getTestGradeSelect()
      .find("input")
      .type("{esc}", { force: true });
  };

  verifyName = name => this.getTestName().should("have.value", name);

  verifyGrade = grade => {
    this.getTestGradeSelect()
      .find("li.ant-select-selection__choice")
      .should("contain", grade);
  };

  setName = testname => {
    this.getTestName()
      .clear()
      .type(testname);
  };

  selectSubject = subject => {
    this.getTestSubjectSelect().click({ force: true });
    cy.get(".ant-select-dropdown-menu-item")
      .contains(subject)
      .click({ force: true });
    cy.focused().blur();
  };

  verifySubject = subject => {
    this.getTestSubjectSelect()
      .find("li.ant-select-selection__choice")
      .should("contain", subject);
  };
  addTags = tags => {
    // tags should be an array
    this.getTestTagsSelect()
      .click({ force: true })
      .find("input")
      .as("TagTextBox");
    tags.forEach(element => {
      cy.get("@TagTextBox")
        .type(element, { force: true })
        .type("{enter}", { force: true });
    });
  };
}
