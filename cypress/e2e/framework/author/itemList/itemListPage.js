import promisify from "cypress-promise";
import { getAccessToken } from "../../../../../packages/api/src/utils/Storage";

class ItemListPage {
  clickOnCreate = async () => {
    const fileWritePath = "cypress/fixtures";
    const fixtureFile = "toDelete/testData.json";

    cy.server();
    cy.route("POST", "**/testitem**").as("saveItem");
    cy.route("GET", "**/testitem/**").as("reload");

    cy.contains("Create")
      .should("be.visible")
      .click();

    cy.wait("@saveItem");

    const xhr = await promisify(cy.wait("@reload"));
    expect(xhr.status).to.eq(200);
    const itemId = xhr.response.body.result._id;
    cy.log("New Item Created : ", itemId);
    console.log("Item created with _id : ", itemId);

    cy.readFile(`${fileWritePath}/${fixtureFile}`).then(json => {
      if (!json.testItems) json.testItems = [];
      const item = { _id: itemId, authToken: getAccessToken() };
      json.testItems.push(item);
      cy.writeFile(`${fileWritePath}/${fixtureFile}`, json);
    });
    return itemId;
  };
}

export default ItemListPage;
