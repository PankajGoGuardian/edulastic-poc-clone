import Header from "./header";

class MetadataPage {
  constructor() {
    this.header = new Header();
  }

  clickCheckAnswer() {
    cy.contains("Check Answer")
      .should("be.visible")
      .click();
    return this;
  }

  clickShowAnswer() {
    cy.constains("Show Answers")
      .should("be.visible")
      .click();
    return this;
  }

  clickClear() {
    cy.constains("Clear")
      .should("be.visible")
      .click();
    return this;
  }

  clickOnNewAllignmentButton = () => cy.get('[data-cy="newAligment"]').click({ force: true });

  clickOnStandardSearchOption = () =>
    cy
      .get('[data-cy="searchStandardSelectItem"]')
      .parent()
      .prev()
      .click();

  selectStandardSet = standardSet => {
    this.selectDropDownoption("standardSetSelect", standardSet);
  };

  getDropDownMenu = () => cy.get(".ant-select-dropdown-menu-item");

  selectDropDownoption = (selector, option) => {
    const selectby = `[data-cy="${selector}"]`;
    cy.get(selectby)
      .then(() => {
        if (selector === "gradeSelect") {
          cy.focused().clear();
        }
      })
      .click();
    this.getDropDownMenu()
      .contains(option)
      .click();
    cy.focused().blur();
  };

  selectSubject = subject => {
    this.selectDropDownoption("subjectSelect", subject);
  };

  selectGrade = grade => {
    this.selectDropDownoption("gradeSelect", grade);
  };

  setStandard = standard => {
    // cy.get('[data-cy="searchStandardSelect"]').click();
    cy.focused()
      .type(standard.substr(0, standard.length - 1))
      // .then(() => standard.split("").forEach(() => cy.wait("@searchStandard")))
      .then(ele => {
        cy.wait(500);
        cy.wrap(ele).type(standard.substr(standard.length - 1));
        cy.wait("@searchStandard");
        cy.wait(3000); // UI renders list slow even after api responsed
        this.getDropDownMenu()
          .contains(standard)
          .click({ force: true });
        // cy.focused().blur();
      });
  };

  mapStandards = standardMaps => {
    cy.server();
    cy.route("POST", "**/search/**").as("searchStandard");
    standardMaps.forEach(standards => {
      console.log("standards", standards);
      const { subject, standard, standardSet, grade } = standards;
      // this.clickOnNewAllignmentButton();
      this.clickOnStandardSearchOption();
      this.selectSubject(subject);
      this.selectStandardSet(standardSet);
      // this.selectGrade(grade);
      this.clickOnStandardSearchOption();
      cy.get('[data-cy="searchStandardSelect"]').click();
      standard.forEach(std => this.setStandard(std));
      cy.focused().blur();
    });
  };
}

export default MetadataPage;
