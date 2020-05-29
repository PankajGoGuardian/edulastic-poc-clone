import CypressHelper from "../util/cypressHelpers";
import { DOK } from "../constants/questionAuthoring";

export default class SearchFilters {
  // *** ELEMENTS START ***

  getSearch = () => cy.get(".ant-input-search");

  getSearchTextBox = () => cy.get('[placeholder="Search by skills and keywords"]').last();

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

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  routeSearch = () => {
    cy.server();
    cy.route("POST", "**/search/**").as("search");
  };

  waitForSearchResponse = () => cy.wait("@search").then(xhr => expect(xhr.status).to.eq(200));

  getAuthoredByMe = () => {
    this.routeSearch();
    cy.xpath("//li[text()='Authored by me']").click();
    cy.wait(1000);
    this.waitForSearchResponse();
  };

  clearAll = () => {
    this.routeSearch();
    cy.get('[data-cy="clearAll"]').click({ force: true });
    return cy.wait("@search");
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
      .type("{selectall}")
      .type(key, { force: true });
    cy.wait(1000);
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
  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  getTotalNoOfItemsInBank = () => this.getTotalPagesInPagination().then(count => count * 10);

  setFilters = ({ standards, queType, dok, difficulty, collection, status, tags }) => {
    this.routeSearch();
    cy.route("POST", "**/search/browse-standards").as("brwose-standards-1");
    if (standards) {
      if (standards.grade)
        standards.grade.forEach(sta => {
          CypressHelper.selectDropDownByAttribute("selectGrades", sta);
          this.waitForSearchResponse();
        });
      if (standards.subject) {
        CypressHelper.selectDropDownByAttribute("selectSubject", standards.subject);
        this.waitForSearchResponse();
      }
      if (standards.standardSet) {
        CypressHelper.selectDropDownByAttribute("selectSdtSet", standards.standardSet);
        this.waitForSearchResponse();
        cy.wait("@brwose-standards-1");
      }
      if (standards.standard)
        standards.standard.forEach(sta => {
          CypressHelper.selectDropDownByAttribute("selectStd", sta);
          this.waitForSearchResponse();
        });
    }
    if (queType) {
      CypressHelper.selectDropDownByAttribute("selectqType", queType);
      this.waitForSearchResponse();
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
      CypressHelper.selectDropDownByAttribute("selectDOK", dok);
      this.waitForSearchResponse();
    }

    if (difficulty) {
      CypressHelper.selectDropDownByAttribute("selectDifficulty", difficulty);
      this.waitForSearchResponse();
    }

    if (collection) {
      CypressHelper.selectDropDownByAttribute("Collections", collection);
      this.waitForSearchResponse();
    }

    if (status) {
      CypressHelper.selectDropDownByAttribute("selectStatus", status);
      this.waitForSearchResponse();
    }

    if (tags)
      tags.forEach(tag => {
        CypressHelper.selectDropDownByAttribute("selectTags", tag);
        this.waitForSearchResponse();
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

  // *** APPHELPERS END ***
}
