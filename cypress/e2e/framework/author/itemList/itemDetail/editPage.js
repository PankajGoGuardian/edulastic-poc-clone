/* eslint-disable class-methods-use-this */
import Header from "./header";
import ItemListPage from "../itemListPage";
import TeacherSideBar from "../../SideBarPage";
import TestAddItemTab from "../../tests/testDetail/testAddItemTab";

class EditItemPage {
  constructor() {
    this.sideBar = new TeacherSideBar();
    this.header = new Header();
    // this.header.save = () => {
    //   cy.server();
    //   cy.route("PUT", "**/testitem/**").as("saveItem");
    //   cy.get('[data-cy="saveButton"]')
    //     .should("be.visible")
    //     .click();
    //   cy.wait("@saveItem");
    // };
    this.itemList = new ItemListPage();
    this.testAddItem = new TestAddItemTab();
  }

  // *** ELEMENTS START ***

  getSource() {
    cy.get('[data-cy="source"]').click();
  }

  getEditButton() {
    return cy.get('button[title="Edit"]');
  }

  getDelButton() {
    return cy.get('button[title="Delete"]');
  }

  getItemWithId(itemId) {
    expect(itemId).to.not.eq(undefined);
    cy.server();
    cy.route("GET", "**/testitem/**").as("getItem");
    cy.visit(`/author/items/${itemId}/item-detail`);
    cy.wait("@getItem");
  }

  getItemTotalScore = () => {
    cy.wait(500);
    return cy
      .get('[data-cy="question-container"]')
      .first()
      .parent()
      .next()
      .find(".ant-input");
  };

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  clickAdvancedOptionsButton() {
    cy.get('[data-cy="toggleAdvancedOptionsButton"]')
      .should("be.visible")
      .click();

    return this;
  }

  showAdvancedOptions() {
    // const $button = Cypress.$('[data-cy="toggleAdvancedOptionsButton"]');

    // if (!$button.next().length) {
    //   cy.get('[data-cy="toggleAdvancedOptionsButton"]')
    //     .should("be.visible")
    //     .click({ force: true });
    cy.get("body")
      .contains(" ADVANCED OPTIONS")
      .then(ele => {
        if (ele.parent().siblings().length === 3) {
          cy.wrap(ele).click();
        }
      });

    return this;
  }

  hideAdvancedOptions() {
    const $button = Cypress.$('[data-cy="toggleAdvancedOptionsButton"]');

    if ($button.next().length) {
      cy.get('[data-cy="toggleAdvancedOptionsButton"]')
        .should("be.visible")
        .click({ force: true });
    }

    return this;
  }

  clickOnSource() {
    cy.get('[data-cy="source"]')
      .should("be.visible")
      .click();

    return this;
  }

  clickOnCancel() {
    cy.get("button")
      .find("Cancel")
      .should("be.visible")
      .click();

    return this;
  }

  clickOnLayout() {
    cy.get('[data-cy="layout"]')
      .should("be.visible")
      .click();
    return this;
  }

  addNew() {
    cy.contains("Add New")
      .should("be.visible")
      .click();

    return this;
  }

  selectQue = qType =>
    cy
      .get("body")
      .contains("select a question type")
      .parent()
      .parent()
      .parent()
      .parent()
      .parent()
      .contains(qType)
      .should("be.visible")
      .click();

  chooseQuestion(qGroup, qType) {
    cy.get("body")
      .contains(qGroup)
      .should("be.visible")
      .click();

    this.selectQue(qType);

    /* TODO: There is some issue in initializing frola editor after landing to 
    author/edit page of a question, as a work around after selecting qtype always 
    navigating to preview tab then coming back to edit to author a question in cypress
     */
    cy.wait(1000);
    this.header.preview();
    this.header.edit();
    // TODO : to be removed above once app issue is fixed
  }

  cancelSource() {
    cy.contains("Cancel")
      .should("be.visible")
      .click();
  }

  createNewItem = (onlyItem = true) => {
    if (onlyItem) {
      this.sideBar.clickOnItemBank();
      this.itemList.clickOnCreate();
    } else this.testAddItem.clickOnCreateNewItem();
  };

  deleteAllQuestion() {
    cy.get("#react-app").then(() => {
      if (Cypress.$('button[title="Delete"]').length >= 1) {
        this.getDelButton().each(() => {
          this.getDelButton()
            .eq(0)
            .click();
        });
        // this.header.save();
      }
    });
  }

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  updateItemLevelScore = score => {
    cy.wait(300);
    return this.getItemTotalScore()
      .clear({ force: true })
      .type(score, { force: true });
  };

  verifyItemIdsToBeNotEqual = (newid, oldid) => {
    expect(newid).not.eq(oldid);
    cy.saveItemDetailToDelete(newid);
  };

  verifyItemIdsToBeEqual = (newid, oldid) => expect(newid).eq(oldid);

  // *** APPHELPERS END ***
}

export default EditItemPage;
