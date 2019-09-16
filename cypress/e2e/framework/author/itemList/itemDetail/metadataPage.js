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
      .click()
      .then(() => {
        if (selector === "gradeSelect") {
          cy.get(selectby).then($ele => {
            if (Cypress.$($ele).find(".ant-select-selection__choice__content").length > 0) {
              cy.wrap($ele)
                .find(".ant-select-selection__choice__content")
                .its("length")
                .then(len => {
                  cy.xpath(`//div[@data-cy='${selector}']//input`).type("{backspace}".repeat(len));
                });
            }
          });
        }
      });
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

  getSearchStandardSelect = () => cy.get('[data-cy="searchStandardSelect"]');

  setStandard = standard => {
    this.getSearchStandardSelect().click();
    cy.wait("@searchStandard");
    // TODO : remove backspace once application bug gets fixed
    cy.focused()
      .as("searchInput")
      .type(`${"{backspace}".repeat(3)}`);

    cy.get("@searchInput").then($ele => {
      standard.forEach(std => {
        // TODO : optimise below when standard search needed
        /* std.split("").forEach(ch => {
          cy.get("@searchInput").type(ch);
          cy.wait("@searchStandard");
        }); 
        cy.wait(3000); // UI renders list slow even after api responsed
       */
        this.getDropDownMenu()
          .contains(std)
          .click({ force: true });
      });
    });
  };

  mapStandards = standardMaps => {
    cy.server();
    cy.route("POST", "**/search/browseStandards").as("searchStandard");
    standardMaps.forEach(standards => {
      console.log("standards", standards);
      const { subject, standard, standardSet, grade } = standards;
      // this.clickOnNewAllignmentButton();
      this.clickOnStandardSearchOption();
      this.selectSubject(subject);
      this.selectStandardSet(standardSet);
      this.selectGrade(grade);
      this.clickOnStandardSearchOption();
      this.setStandard(standard);
      cy.focused().blur();
    });
  };
}

export default MetadataPage;
