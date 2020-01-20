/* eslint-disable lines-between-class-members */
import TestHeader from "./header";
import SearchFilters from "../../searchFiltersPage";
import ItemListPage from "../../itemList/itemListPage";

export default class TestAddItemTab {
  constructor() {
    this.header = new TestHeader();
    this.searchFilters = new SearchFilters();
    this.itemListPage = new ItemListPage();
  }

  clickOnCreateNewItem = () => {
    // cy.server();
    // cy.route("POST", "**/testitem**").as("saveItem");
    // cy.route("GET", "**/testitem/**").as("reload");

    cy.get('[data-cy="createNewItem"]')
      .should("be.visible")
      .click();

    // cy.wait("@saveItem").then(xhr => assert(xhr.status === 200, "Creating item failed"));
    // cy.wait("@reload").then(xhr => {
    //   assert(xhr.status === 200, "GET item failed,writing item details failed");
    //   const itemId = xhr.response.body.result._id;
    //   console.log("Item created with _id : ", itemId);
    //   cy.saveItemDetailToDelete(itemId);
    // });
  };

  authoredByMe = () => {
    cy.xpath("//li[text()='Authored by me']").click();
    return cy.wait("@search");
  };

  getAddButtons = () => cy.contains("ADD");

  addItemById = itemId =>
    cy
      .get(`[data-cy="${itemId}"]`)
      .contains("ADD")
      .click({ force: true });

  addItemByQuestionContent = question =>
    cy
      .get('[data-cy="styled-wrapped-component"]')
      .contains(question)
      .closest(".fr-view")
      .contains("ADD")
      .click({ force: true });

  verifyAddedItemByQuestionContent = question =>
    cy
      .get('[data-cy="styled-wrapped-component"]')
      .contains(question)
      .closest("div")
      .next()
      .contains("REMOVE")
      .should("be.exist");

  removeItemById = itemId =>
    cy
      .get(`[data-cy="${itemId}"]`)
      .contains("REMOVE")
      .click({ force: true });

  clickOnGroupItem = () => cy.get('[data-cy="groupItem"]').click();
}
