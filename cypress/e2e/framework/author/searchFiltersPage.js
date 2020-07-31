import CypressHelper from "../util/cypressHelpers";
import { DOK } from "../constants/questionAuthoring";
import Helpers from "../util/Helpers";
import { sortOptions } from "../constants/questionTypes";

export default class SearchFilters {
  // *** ELEMENTS START ***
  constructor() {
    this.itemBankFilterAttrs = {
      staus: "selectStatus",
      grades: "selectGrades",
      subject: "selectSubject",
      standardSet: "selectSdtSet",
      standard: "selectStd",
      queType: "selectqType",
      dok: "selectDOK",
      difficulty: "selectDifficulty",
      collection: "Collections",
      tags: "selectTags"
    };
    this.testLibaryFilterAttrs = {
      grades: "Grades",
      subject: "Subject",
      standardSet: "Standard set",
      standard: "Standards",
      collection: "Collections",
      tags: "Tags"
    };
  }

  getSearch = () => cy.get(".ant-input-search");

  getSearchBar = () => cy.contains("Search by skills and keywords").next();

  getSearchTextBox = () => this.getSearchBar().find("input");

  getPaginationContainer = () => cy.get(".ant-pagination");

  getPaginationButtonByPageIndex = index => this.getPaginationContainer().find(`[title="${index}"]`);

  getJumpToLastPageButton = () => this.getPaginationButtonByPageIndex("Next 5 Pages").next();

  getTotalPagesInPagination = () =>
    this.getJumpToLastPageButton()
      .invoke("text")
      .then(txt => parseInt(txt, 10));

  getFilterButton = () =>
    cy
      .get('[data-cy="filter"]')
      .last()
      .find("svg");

  getFilterButtonByAttr = attr => cy.get(`[data-cy="${attr}"]`);

  getSortButton = () => cy.get('[data-cy="sort-button"]');

  getSortDropdown = () => cy.get('[data-cy="sort-dropdown"]');

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  routeSearch = () => {
    cy.server();
    cy.route("POST", "**/search/**").as("search");
  };

  waitForSearchResponse = () => cy.wait("@search").then(xhr => expect(xhr.status).to.eq(200));

  getAuthoredByMe = (setSortOptions = true, option) => {
    this.routeSearch();
    cy.xpath("//li[text()='Authored by me']").click();
    this.waitForSearchResponse();
    if (setSortOptions) {
      this.setSortButtonInDescOrder();
      this.setSortOption(option);
    }
  };

  clearAll = (setSortOptions = true, option) => {
    const dummyCharToType = Helpers.getRamdomString(2).toUpperCase();
    this.routeSearch();
    this.typeInSearchBox(dummyCharToType);
    cy.get('[data-cy="clearAll"]').click({ force: true });
    cy.wait("@search").then(() => this.getSearchBar().should("not.contain", dummyCharToType));
    if (setSortOptions) {
      this.setSortButtonInDescOrder();
      this.setSortOption(option);
    }
  };

  setGrades = grades => {
    grades.forEach(grade => {
      CypressHelper.selectDropDownByAttribute("selectGrades", grade);
      cy.wait("@search");
    });
  };

  setCollection = collection => {
    this.routeSearch();
    CypressHelper.selectDropDownByAttribute("Collections", collection);
    cy.wait("@search");
  };

  scrollFiltersToTop = () =>
    cy
      .get(".scrollbar-container")
      .eq(1)
      .then($elem => {
        $elem.scrollTop(0);
      });

  sharedWithMe = () => {
    cy.get('[data-icon="share-alt"]').click({ force: true });
    cy.wait("@search");
    cy.wait(1000);
  };

  getAuthoredByMe = () => {
    this.routeSearch();
    cy.xpath("//li[text()='Authored by me']").click();
    this.waitForSearchResponse();
    cy.wait(1000);
  };

  getEntireLibrary = () => {
    this.routeSearch();
    cy.get('[data-icon="book"]').click({ force: true });
    this.waitForSearchResponse();
    cy.wait(1000);
  };

  typeInSearchBox = key => {
    this.routeSearch();
    this.getSearchTextBox()
      .type("{selectall}", { force: true })
      .type(`${key}{enter}`, { force: true });
    this.waitForSearchResponse();
  };

  clickOnSearchIcon = () => {
    this.getSearch()
      .find("i")
      .click({ force: true });
    this.waitForSearchResponse();
  };

  clickJumpToLastPage = () => {
    this.getJumpToLastPageButton().click({ force: true });
    this.waitForSearchResponse();
  };

  clickButtonInPaginationByPageNo = pageNo => {
    this.getPaginationButtonByPageIndex(pageNo).click({ force: true });
    this.waitForSearchResponse();
  };

  clearMultipleSelectionDropDown = attr => {
    cy.get(`[data-cy="${attr}"]`).then($ele => {
      if (Cypress.$($ele).find(".anticon-close").length > 0)
        cy.wrap($ele)
          .find(".anticon-close")
          .each(element => {
            element.click();
            this.waitForSearchResponse();
          });

      cy.wrap(Cypress.$($ele))
        .find(".ant-select-selection__choice__content")
        .should("have.length", 0);
    });
  };

  setSortButtonInDescOrder = () =>
    this.getSortButton()
      .find("svg")
      .then($ele => {
        if ($ele.attr("dir") === "asc")
          cy.wrap($ele)
            .click({ force: true })
            .then(() => this.waitForSearchResponse());
      });

  setSortButtonInAsceOrder = () =>
    this.getSortButton()
      .find("svg")
      .then($ele => {
        if ($ele.attr("dir") === "des")
          cy.wrap($ele)
            .click({ force: true })
            .then(() => this.waitForSearchResponse());
      });

  setSortOption = (option = sortOptions.Recency) =>
    this.getSortDropdown().then($ele => {
      if ($ele.text().trim() !== option) {
        this.selectOptionInSortDropDown(option);
        this.waitForSearchResponse();
      }
    });
  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  getTotalNoOfItemsInBank = () => this.getTotalPagesInPagination().then(count => count * 25);

  setFilters = ({ standards, queType, dok, difficulty, collection, status, tags }, isItemBank = true) => {
    const dataCyAttributes = isItemBank ? this.itemBankFilterAttrs : this.testLibaryFilterAttrs;
    this.routeSearch();
    cy.route("POST", "**/search/browse-standards").as("brwose-standards-1");
    if (standards) {
      if (standards.grade)
        standards.grade.forEach(grade => {
          CypressHelper.selectDropDownByAttribute(dataCyAttributes.grades, grade);
          this.waitForSearchResponse();
          CypressHelper.verifySelectedOptionInDropDownByAttr(dataCyAttributes.grades, grade, true);
        });
      if (standards.subject) {
        this.clearMultipleSelectionDropDown(dataCyAttributes.subject);
        CypressHelper.selectDropDownByAttribute(dataCyAttributes.subject, standards.subject);
        this.waitForSearchResponse();
        CypressHelper.verifySelectedOptionInDropDownByAttr(dataCyAttributes.subject, standards.subject, true);
      }
      if (standards.standardSet) {
        CypressHelper.selectDropDownByAttribute(dataCyAttributes.standardSet, standards.standardSet);
        this.waitForSearchResponse();
        cy.wait("@brwose-standards-1");
        CypressHelper.verifySelectedOptionInDropDownByAttr(dataCyAttributes.standardSet, standards.standardSet);
      }
      if (standards.standard)
        standards.standard.forEach(sta => {
          CypressHelper.selectDropDownByAttribute(dataCyAttributes.standard, sta);
          this.waitForSearchResponse();
          CypressHelper.verifySelectedOptionInDropDownByAttr(dataCyAttributes.standard, sta, true);
        });
    }
    if (queType) {
      CypressHelper.selectDropDownByAttribute(dataCyAttributes.queType, queType);
      this.waitForSearchResponse();
      CypressHelper.verifySelectedOptionInDropDownByAttr(dataCyAttributes.queType, queType);
    }

    if (dok) {
      switch (dok) {
        case DOK.Recall:
          dok = `1 ${dok}`;
          break;

        case DOK.SkillConcept:
          dok = `2 ${dok}`;
          break;

        case DOK.StrategicThinking:
          dok = `3 ${dok}`;
          break;

        case DOK.ExtendedThinking:
          dok = `4 ${dok}`;
          break;

        default:
          break;
      }
      CypressHelper.selectDropDownByAttribute(dataCyAttributes.dok, dok);
      this.waitForSearchResponse();
      CypressHelper.verifySelectedOptionInDropDownByAttr(dataCyAttributes.dok, dok);
    }

    if (difficulty) {
      CypressHelper.selectDropDownByAttribute(dataCyAttributes.difficulty, difficulty);
      this.waitForSearchResponse();
      CypressHelper.verifySelectedOptionInDropDownByAttr(dataCyAttributes.difficulty, difficulty);
    }

    if (collection) {
      CypressHelper.selectDropDownByAttribute(dataCyAttributes.collection, collection);
      this.waitForSearchResponse();
      CypressHelper.verifySelectedOptionInDropDownByAttr(dataCyAttributes.collection, collection, true);
    }

    if (status) {
      CypressHelper.selectDropDownByAttribute(dataCyAttributes.staus, status);
      this.waitForSearchResponse();
      CypressHelper.verifySelectedOptionInDropDownByAttr(dataCyAttributes.staus, status);
    }

    if (tags)
      tags.forEach(tag => {
        CypressHelper.selectDropDownByAttribute(dataCyAttributes.tags, tag);
        this.waitForSearchResponse();
        CypressHelper.verifySelectedOptionInDropDownByAttr(dataCyAttributes.tags, tag, true);
      });
  };

  expandFilters = () =>
    this.getFilterButton().then($elem => {
      if ($elem.attr("color") === "#1AB394") cy.wrap($elem).click({ force: true });
    });

  collapseFilters = () =>
    this.getFilterButton().then($elem => {
      if ($elem.attr("color") === "#fff") cy.wrap($elem).click({ force: true });
    });

  verfifyActivePageIs = pageNo =>
    this.getPaginationButtonByPageIndex(pageNo).should("have.class", "ant-pagination-item-active");

  selectOptionInSortDropDown = option => {
    this.getSortDropdown().click({ force: true });
    cy.wait(300);
    cy.get(".ant-dropdown-menu-item").then($ele => {
      cy.wrap($ele.filter((i, ele) => Cypress.$(ele).text() === option)).click({ force: true });
    });
  };
  // *** APPHELPERS END ***
}
