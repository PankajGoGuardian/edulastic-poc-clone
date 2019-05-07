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
    this.getTestGradeSelect().click();
    cy.get(".ant-select-dropdown-menu-item")
      .contains(grade)
      .click();
    cy.focused().blur();
  };

  setName = testname => {
    this.getTestName()
      .clear()
      .type(testname);
  };

  selectSubject = subject => {
    this.getTestSubjectSelect().click();
    cy.get(".ant-select-dropdown-menu-item")
      .contains(subject)
      .click();
    cy.focused().blur();
  };
}
