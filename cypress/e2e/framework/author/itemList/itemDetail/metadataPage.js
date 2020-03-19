import Header from "./header";
import CypressHelper from "../../../util/cypressHelpers";

class MetadataPage {
  constructor() {
    this.header = new Header();
  }

  // *** ELEMENTS START ***

  getDropDownMenu = () => cy.get(".ant-select-dropdown-menu-item");

  getSearchStandardSelect = () => cy.get('[data-cy="searchStandardSelect"]');

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

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
      .click({ force: true });
    cy.focused().blur();
  };

  selectSubject = subject => {
    this.selectDropDownoption("subjectSelect", subject);
  };

  selectGrade = grade => {
    this.selectDropDownoption("gradeSelect", grade);
  };

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
          .should("have.length.greaterThan", 1)
          .contains(std)
          .click({ force: true });
      });
    });
  };

  mapStandards = standardMaps => {
    cy.server();
    cy.route("POST", "**/search/browse-standards").as("searchStandard");
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

  setCollection = collection => {
    CypressHelper.selectDropDownByAttribute("collectionsSelect", collection);
    cy.focused().blur(); // de-focus dropdown select
  };

  setTag = tag => {
    CypressHelper.selectDropDownByAttribute("tagsSelect", tag);
    cy.focused().blur(); // de-focus dropdown select
  };

  setDOK = dok => {
    CypressHelper.selectDropDownByAttribute("dokSelect", dok);
    cy.focused().blur();
  };

  setDifficulty = difficulty => {
    CypressHelper.selectDropDownByAttribute("difficultySelect", difficulty);
    cy.focused().blur();
  };

  // *** ACTIONS END ***

  // *** APPHELPERS START ***
  // *** APPHELPERS END ***
}

export default MetadataPage;
