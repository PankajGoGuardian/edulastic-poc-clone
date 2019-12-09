import MCQStandardPage from "./questionType/mcq/mcqStandardPage";
import ClozeWithTextPage from "./questionType/fillInBlank/clozeWithTextPage";
import EditItemPage from "./itemDetail/editPage";
import { questionTypeKey as queTypes } from "../../constants/questionTypes";
import MCQMultiplePage from "./questionType/mcq/mcqMultiplePage";
import MCQTrueFalsePage from "./questionType/mcq/mcqTrueFalsePage";
import MCQBlockLayoutPage from "./questionType/mcq/mcqBlockLayoutPage";
import ChoiceMatrixStandardPage from "./questionType/mcq/choiceMatrixPage";
import MetadataPage from "./itemDetail/metadataPage";
import ClozeDropDownPage from "./questionType/fillInBlank/clozeWithDropDownPage";

class ItemListPage {
  clickOnCreate = () => {
    // cy.server();
    // cy.route("POST", "**/testitem").as("saveItem");
    //  cy.route("GET", "**/testitem/**").as("reload");

    cy.contains("New Item")
      .should("be.visible")
      .click();

    /*  cy.wait("@saveItem").then(xhr => {
      assert(xhr.status === 200, "Creating item failed");
      const itemId = xhr.response.body.result._id;
      console.log("Item created with _id : ", itemId);
      cy.saveItemDetailToDelete(itemId);
    });
    // const xhr = await promisify(cy.wait("@reload"));
    cy.wait(
      "@reload"
    );  */
    /* .then(xhr => {
      assert(xhr.status === 200, "GET item failed,writing item details failed");
      const itemId = xhr.response.body.result._id;
      console.log("Item created with _id : ", itemId);
      cy.saveItemDetailToDelete(itemId);
    }); */
    // return itemId;
  };

  createItem = (itemKey, queIndex = 0, publish = true) => {
    const editItem = new EditItemPage();
    const metadataPage = new MetadataPage();
    return cy.fixture("questionAuthoring").then(itemData => {
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
          case queTypes.FILL_TEXT_CLOZE:
            question = new ClozeWithTextPage();
            break;
          case queTypes.DROP_TEXT_CLOZE:
            question = new ClozeDropDownPage();
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
          question.createQuestion(queType, queKey, queIndex, publish);
        } else question.createQuestion(queKey, queIndex, publish);

        if (itemData[queType][queKey].standards) {
          // editItem.getEditButton().click();
          editItem.header.metadata();
          metadataPage.mapStandards(itemData[queType][queKey].standards);
          metadataPage.header.edit();
        }

        editItem.header.save(!publish);
        if (publish) return editItem.header.clickOnPublishItem();
      }
    });
  };

  getItemIdByURL = () => cy.url().then(url => url.split("/").reverse()[1]);
}

export default ItemListPage;
