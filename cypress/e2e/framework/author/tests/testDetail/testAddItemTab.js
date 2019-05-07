export default class TestAddItemTab {
  clickOnCreateNewItem = () => {
    cy.server();
    cy.route("POST", "**/testitem**").as("saveItem");
    cy.route("GET", "**/testitem/**").as("reload");

    cy.get('[data-cy="createNewItem"]')
      .should("be.visible")
      .click();

    cy.wait("@saveItem").then(xhr => assert(xhr.status === 200, "Creating item failed"));
    cy.wait("@reload").then(xhr => {
      assert(xhr.status === 200, "GET item failed,writing item details failed");
      const itemId = xhr.response.body.result._id;
      console.log("Item created with _id : ", itemId);
      cy.saveItemDetailToDelete(itemId);
    });
  };

  authoredByMe = () => {
    cy.xpath("//li[text()='Authored by me']").click();
  };
}
