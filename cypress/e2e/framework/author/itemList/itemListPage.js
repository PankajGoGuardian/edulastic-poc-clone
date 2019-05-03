import promisify from "cypress-promise";

class ItemListPage {
  clickOnCreate = () => {
    cy.server();
    cy.route("POST", "**/testitem**").as("saveItem");
    cy.route("GET", "**/testitem/**").as("reload");

    cy.contains("Create")
      .should("be.visible")
      .click();
    cy.wait("@saveItem").then(xhr => assert(xhr.status === 200, "Creating item failed"));
    // const xhr = await promisify(cy.wait("@reload"));
    cy.wait("@reload").then(xhr => {
      assert(xhr.status === 200, "GET item failed,writing item details failed");
      const itemId = xhr.response.body.result._id;
      console.log("Item created with _id : ", itemId);
      cy.saveItemDetailToDelete(itemId);
    });
    // return itemId;
  };
}

export default ItemListPage;
