/* eslint-disable class-methods-use-this */
import EditItemPage from "./editPage";
import PreviewItemPage from "./previewPage";
import MetadataPage from "./metadataPage";

class Header {
  // *** ELEMENTS START ***

  getEdit = () => cy.get('[data-cy="editButton"]');

  getPreview = () => cy.get('[data-cy="previewButton"]');

  getMetadata = () => cy.get('[data-cy="metadataButton"]');

  getPublishButton = () => cy.get('[data-cy="publishItem"]');

  getSaveButton = () => cy.get('[data-cy="saveButton"]').should("be.visible");

  // *** ELEMENTS END ***

  // *** ACTIONS START ***

  edit() {
    this.getEdit().click({ force: true });
    return new EditItemPage();
  }

  preview() {
    this.getPreview().click({ force: true });
    return new PreviewItemPage();
  }

  metadata() {
    this.getMetadata()
      .should("be.visible")
      .click();
    return new MetadataPage();
  }

  save(onlyPointChange = false) {
    cy.url().then(url => {
      cy.server();
      cy.route("POST", "**/testitem").as("createItem");
      cy.route("PUT", "**/testitem/**").as("saveItem");
      cy.route("GET", "**/testitem/**").as("reload");
      const isNew = url.includes("questions/create");
      this.getSaveButton().click();

      if (isNew) {
        cy.wait("@createItem").then(xhr => {
          assert(xhr.status === 200, "Creating item failed");
          const itemId = xhr.response.body.result._id;
          console.log("Item created with _id : ", itemId);
          cy.saveItemDetailToDelete(itemId);
        });
      } else {
        cy.wait("@saveItem").then(xhr => expect(xhr.status).to.eq(200));
      }
      if (!onlyPointChange) cy.wait("@reload");
      // return new EditItemPage();
    });
  }

  clickOnPublishItem = () => {
    cy.route("PUT", "**/publish?status=published").as("publish");
    cy.route("POST", "**/search/items").as("itemSearch");
    this.getPublishButton().click();
    cy.wait("@saveItem").then(xhr => expect(xhr.status).to.eq(200));
    return cy.wait("@publish").then(xhr => {
      expect(xhr.status).to.eq(200);
      const id = xhr.url.split("/").reverse()[1];
      // page now redirects back to itembank
      return cy.wait("@itemSearch").then(() => id);
    });
  };

  clickOnEditItem = () => cy.get('[data-cy="editItem"]').click();

  // *** ACTIONS END ***

  // *** APPHELPERS START ***

  saveAndgetId = (isOld = false) => {
    // isOld=false === isNew=true
    cy.server();
    if (!isOld) cy.route("POST", "**/testitem").as("saveItem");
    else cy.route("PUT", "**/api/testitem/*").as("saveItem");
    this.getSaveButton().click();
    return cy.wait("@saveItem").then(xhr => xhr.response.body.result._id);
  };

  // *** APPHELPERS END ***
}

export default Header;
