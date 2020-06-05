import Header from "./header";
import CypressHelper from "../../../util/cypressHelpers";

class MetadataPage {
  constructor() {
    this.header = new Header();
  }

  // *** ELEMENTS START ***

  getDropDownMenu = () => cy.get(".ant-select-dropdown-menu-item");

  getSearchStandardSelect = () => cy.get('[data-cy="searchStandardSelect"]');

  getStandardSearchOption = () =>
    cy
      .get('[data-cy="searchStandardSelectItem"]')
      .parent()
      .prev();

  getBrowseStandards = () => cy.get("button").contains("span", "Browse");

  getAllCurrentStandardDomains = () => cy.get(".ant-spin-container").find(".tlo-item-title");

  getApplyInBrowseStandards = () => cy.get('[data-cy="apply-Stand-Set"]');

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

  clickOnStandardSearchOption = () => this.getStandardSearchOption().click();

  clickApplyInBrowseStandard = () => this.getApplyInBrowseStandards().click();

  selectStandardSet = standardSet => {
    this.selectDropDownoption("standardSetSelect", standardSet);
  };

  selectDropDownoption = (selector, option) => {
    this.routeStandardSearch();
    const selectby = `[data-cy="${selector}"]`;
    cy.get(selectby)
      .click({ force: true })
      .then(() => {
        if (selector === "gradeSelect" || selector === "grade-Select") {
          cy.get(selectby).then($ele => {
            if (Cypress.$($ele).find(".anticon-close").length > 0)
              cy.wrap($ele)
                .find(".anticon-close")
                .each(element => {
                  element.click();
                  if (selector === "grade-Select") this.waitForStandarSearch();
                });

            cy.wait(300).then(() =>
              expect(Cypress.$($ele).find(".ant-select-selection__choice__content").length).to.eq(0)
            );
          });
        }
      });
    if (Array.isArray(option))
      option.forEach(opt => {
        this.getDropDownMenu()
          .contains(opt)
          .click({ force: true });
        if (selector === "grade-Select") this.waitForStandarSearch();
      });
    else
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
    this.waitForStandarSearch();
    // TODO : remove backspace once application bug gets fixed
    this.clearStandards();

    cy.focused().then($ele => {
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
    this.routeStandardSearch();
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

  clickBrowseStandards = () => this.getBrowseStandards().click({ force: true });

  selectGradeInBrowseStandards = grade => {
    this.routeStandardSearch();
    this.selectDropDownoption("grade-Select", grade);
  };

  selectSubjectInBrowseStandards = subject => {
    this.selectDropDownoption("subject-Select", subject);
  };

  selectStandardSetInBrowseStandards = standardSet => {
    this.routeStandardSearch();
    this.selectDropDownoption("standardSet-Select", standardSet);
    this.waitForStandarSearch();
  };

  selectStandardInBrowseStandards = standards =>
    standards.forEach(standard =>
      cy
        .get(`[data-cy="${standard}"]`)
        .check({ force: true })
        .should("be.checked")
    );

  selectStandardDomainInBrowseStandards = domain => {
    this.getAllCurrentStandardDomains().then($ele =>
      cy
        .wrap($ele.filter((i, el) => Cypress.$(el).text() === domain))
        .click({ force: true })
        .parent()
        .should("have.class", "active")
    );
  };

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  routeStandardSearch = () => {
    cy.server();
    cy.route("POST", "**/search/browse-standards").as("searchStandard");
  };

  waitForStandarSearch = () => cy.wait("@searchStandard");

  clearStandards = () => {
    this.getSearchStandardSelect().then($ele => {
      if ($ele.find(".anticon-close").length > 0)
        cy.wrap($ele)
          .find(".anticon-close")
          .click({ multiple: true });
    });
    this.getSearchStandardSelect()
      .find(".anticon-close")
      .should("have.length", 0);
  };

  verifySelectedSubject = subject => CypressHelper.verifySelectedOptionInDropDownByAttr("subjectSelect", subject);

  verifySelectedStandardSet = set => CypressHelper.verifySelectedOptionInDropDownByAttr("standardSetSelect", set);

  verifySelectedGrade = grade => CypressHelper.verifySelectedOptionInDropDownByAttr("gradeSelect", grade, true);

  verifySelectedStandards = standard =>
    CypressHelper.verifySelectedOptionInDropDownByAttr("searchStandardSelect", standard, true);

  verifySelectedDok = dok => CypressHelper.verifySelectedOptionInDropDownByAttr("dokSelect", dok);

  verifySelectedDifficulty = difficulty =>
    CypressHelper.verifySelectedOptionInDropDownByAttr("difficultySelect", difficulty);

  verifySelectedTag = tag => CypressHelper.verifySelectedOptionInDropDownByAttr("tagsSelect", tag, true);

  verifySelectedGradeInBrowseStandards = grade =>
    CypressHelper.verifySelectedOptionInDropDownByAttr("grade-Select", grade, true);

  verifySelectedSubjectInBrowseStandards = subject =>
    CypressHelper.verifySelectedOptionInDropDownByAttr("subject-Select", subject);

  verifySelectedStandardSetInBrowseStandards = set =>
    CypressHelper.verifySelectedOptionInDropDownByAttr("standardSet-Select", set);

  verifySubjectAndGradeInStandardSearchOption = (subject, grade) => {
    const gra = [];
    grade.forEach(gr => {
      if (gr === "Kindergarten") gra.push("K");
      else gra.push(gr.split(" ")[1]);
    });

    this.getStandardSearchOption().should("contain", `${subject} - Grade - ${gra.join(",")}`);
  };

  // *** APPHELPERS END ***
}

export default MetadataPage;
