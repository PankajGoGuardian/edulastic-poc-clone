import MCQStandardPage from "./questionType/mcq/mcqStandardPage";
import EditItemPage from "./itemDetail/editPage";
import { questionTypeKey as queTypes } from "../../constants/questionTypes";
import MCQMultiplePage from "./questionType/mcq/mcqMultiplePage";
import MCQTrueFalsePage from "./questionType/mcq/mcqTrueFalsePage";
import MCQBlockLayoutPage from "./questionType/mcq/mcqBlockLayoutPage";
import ChoiceMatrixStandardPage from "./questionType/mcq/choiceMatrixPage";
import MetadataPage from "./itemDetail/metadataPage";

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
    const metadataPage = new MetadataPage();
    cy.fixture("questionAuthoring").then(itemData => {
      const [queType, queKey] = itemKey.split(".");
      let question;
      if (itemData[queType][queKey]) {
        switch (queType) {
          case queTypes.MULTIPLE_CHOICE_STANDARD:
            question = new MCQStandardPage();
            break;

          case queTypes.MULTIPLE_CHOICE_MULTIPLE:
            question = new MCQMultiplePage();
            break;

          case queTypes.TRUE_FALSE:
            question = new MCQTrueFalsePage();
            break;

          case queTypes.MULTIPLE_CHOICE_BLOCK:
            question = new MCQBlockLayoutPage();
            break;

          case queTypes.CHOICE_MATRIX_STANDARD:
          case queTypes.CHOICE_MATRIX_LABEL:
          case queTypes.CHOICE_MATRIX_INLINE:
            question = new ChoiceMatrixStandardPage();
            break;

          default:
            break;
        }
        if (
          [queTypes.CHOICE_MATRIX_STANDARD, queTypes.CHOICE_MATRIX_LABEL, queTypes.CHOICE_MATRIX_INLINE].indexOf(
            queType
          ) > -1
        ) {
          question.createQuestion(queType);
        } else question.createQuestion();

        if (itemData[queType][queKey].standards) {
          editItem.getEditButton().click();
          editItem.header.metadata();
          metadataPage.mapStandards(itemData[queType][queKey].standards);
          editItem.header.save();
        }

        editItem.header.clickOnPublishItem();
      }
    });
  };
}

export default ItemListPage;
