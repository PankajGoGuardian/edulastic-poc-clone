import MCQStandardPage from "./questionType/mcq/mcqStandardPage";
import EditItemPage from "./itemDetail/editPage";
import { questionTypeKey as queTypes } from "../../constants/questionTypes";

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

  createItem = itemKey => {
    const editItem = new EditItemPage();
    cy.fixture("questionAuthoring").then(itemData => {
      const [queType, queKey] = itemKey.split(".");
      let question;
      if (itemData[queType][queKey]) {
        switch (queType) {
          case queTypes.MULTIPLE_CHOICE_STANDARD:
            question = new MCQStandardPage();
            question.createQuestion();
            break;

          default:
            break;
        }
        editItem.header.clickOnPublishItem();
      }
    });
  };
}

export default ItemListPage;
