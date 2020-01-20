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

import SearchFilters from "../searchFiltersPage";
import TeacherSideBar from "../SideBarPage";
import PreviewItemPopup from "./itemPreview";

class ItemListPage {
  constructor() {
    this.sidebar = new TeacherSideBar();
    this.searchFilters = new SearchFilters();
    this.itemPreview = new PreviewItemPopup();
  }

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

  getViewItemById = (id, text) => {
    return cy.get(`[data_cy=${id}]`);
    /* cy.wait(2000);
    return cy
      .get("body")
      .find('[data-cy="styled-wrapped-component"]')
      .contains(text)
      .parent()
      .parent()
      .parent()
      .parent()
      .next()
      .find("span", " View")
      .eq(0); */
  };

  verifyPresenceOfItemById = id => {
    this.getViewItemById(id).should("exist");
  };

  verifyAbsenceOfitemById = id => {
    this.getViewItemById(id).should("not.exist");
  };

  getEditButtonOnPreview = () => this.itemPreview.getEditOnPreview();

  getCloneButtonOnPreview = () => this.itemPreview.getCopyOnPreview();

  clickOnViewItemById = (id, text) => {
    cy.wait(1000);
    this.getViewItemById(id, text).click();
  };

  clickOnItemText = () => {
    cy.wait(1000);
    cy.get(".fr-view")
      .find("a")
      .click();
  };

  verifyShowCheckAnsOnPreview = (questype, attempt, attemptType, showans) =>
    this.testReviewTab.verifyQuestionResponseCard(questype, attempt, attemptType, showans);

  closePreiview = () => cy.get(".ant-modal-close-icon").click({ force: true });

  createItem = (itemKey, queIndex = 0, publish = true) => {
    const editItem = new EditItemPage();
    const metadataPage = new MetadataPage();
    return cy.fixture("questionAuthoring").then(itemData => {
      const [queType, queKey] = itemKey.split(".");
      const questionJson = itemData[queType][queKey];
      let question;
      if (questionJson) {
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
          case queTypes.CLOZE_TEXT:
            question = new ClozeWithTextPage();
            break;
          case queTypes.CLOZE_DROP_DOWN:
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

        if (questionJson.standards) {
          // editItem.getEditButton().click();
          editItem.header.metadata();
          metadataPage.mapStandards(questionJson.standards);
          metadataPage.header.edit();
        }

        if (questionJson.meta) {
          // editItem.getEditButton().click();
          editItem.header.metadata();
          metadataPage.setCollection(questionJson.meta.collections);
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
