import Header from "./header";

export default class TestSummayTab {
  constructor() {
    this.header = new Header();
  }

  getTestDescription = () => cy.xpath("//textarea[@placeholder='Enter a description']");

  getTestName = () => cy.get('[data-cy="testname"]');

  getTestGradeSelect = () => cy.get('[data-cy="gradeSelect"]');

  getTestSubjectSelect = () => cy.get('[data-cy="subjectSelect"]');

  getTestCollectionSelect = () => cy.get('[data-cy="collectionsSelect"]');

  getTestTagsSelect = () => cy.get('[data-cy="tagsSelect"]');

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
