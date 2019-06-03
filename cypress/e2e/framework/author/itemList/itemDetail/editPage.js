/* eslint-disable class-methods-use-this */
import Header from "./header";
import ItemListPage from "../itemListPage";
import TeacherSideBar from "../../SideBarPage";

class EditItemPage {
  constructor() {
    this.sideBar = new TeacherSideBar();
    this.header = new Header();
    this.header.save = () => {
      cy.server();
      cy.route("PUT", "**/testitem/**").as("saveItem");
      cy.get('[data-cy="saveButton"]')
        .should("be.visible")
        .click();
      cy.wait("@saveItem");
    };
    this.itemList = new ItemListPage();
  }

  clickAdvancedOptionsButton() {
    cy.get('[data-cy="toggleAdvancedOptionsButton"]')
      .should("be.visible")
      .click();

    return this;
  }

  showAdvancedOptions() {
    const $button = Cypress.$('[data-cy="toggleAdvancedOptionsButton"]');

    if (!$button.next().length) {
      cy.get('[data-cy="toggleAdvancedOptionsButton"]')
        .should("be.visible")
        .click({ force: true });
    }

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

  chooseQuestion(qGroup, qType) {
    cy.get("body")
      .contains(qGroup)
      .should("be.visible")
      .click();
    cy.get("body")
      .contains("select a question type")
      .parent()
      .parent()
      .parent()
      .parent()
      .parent()
      .contains(qType)
      .should("be.visible")
      .click();
  }

  getSource() {
    cy.get('[data-cy="source"]')
      .should("be.visible")
      .click();
  }

  cancelSource() {
    cy.contains("Cancel")
      .should("be.visible")
      .click();
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

  createNewItem = () => {
    this.sideBar.clickOnItemLibrary();
    this.itemList.clickOnCreate();
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

  getItemTotalScore = () => {
    cy.wait(500);
    return cy
      .get('[data-cy="question-container"]')
      .first()
      .parent()
      .next()
      .find(".ant-input");
  };

  updateItemLevelScore = score =>
    this.getItemTotalScore()
      .clear()
      .type(score, { force: true });
}

export default EditItemPage;
