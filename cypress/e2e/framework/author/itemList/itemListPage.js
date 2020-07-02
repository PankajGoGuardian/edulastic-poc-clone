import MCQStandardPage from "./questionType/mcq/mcqStandardPage";
import ClozeWithTextPage from "./questionType/fillInBlank/clozeWithTextPage";
import EditItemPage from "./itemDetail/editPage";
import { questionTypeKey as queTypes, questionType } from "../../constants/questionTypes";
import MCQMultiplePage from "./questionType/mcq/mcqMultiplePage";
import MCQTrueFalsePage from "./questionType/mcq/mcqTrueFalsePage";
import MCQBlockLayoutPage from "./questionType/mcq/mcqBlockLayoutPage";
import ChoiceMatrixStandardPage from "./questionType/mcq/choiceMatrixPage";
import MetadataPage from "./itemDetail/metadataPage";
import ClozeDropDownPage from "./questionType/fillInBlank/clozeWithDropDownPage";
import SearchFilters from "../searchFiltersPage";
import TeacherSideBar from "../SideBarPage";
import PreviewItemPopup from "./itemPreview";
import EssayRichTextPage from "./questionType/writtenAndSpoken/essayRichTextPage";
import CypressHelper from "../../util/cypressHelpers";
import MathFractionPage from "./questionType/math/mathFractionPage";

class ItemListPage {
  constructor() {
    this.sidebar = new TeacherSideBar();
    this.searchFilters = new SearchFilters();
    this.itemPreview = new PreviewItemPopup();
  }

  // *** ELEMENTS START ***

  getCreateTest = () => cy.get('[data-cy="New Test"]');

  getItemContainerInlistById = id => cy.get(`[data-cy="${id}"]`);

  getstandardsById = id =>
    this.getItemContainerInlistById(id)
      .find(`[class="Tags"]`)
      .first();

  getTagsById = id =>
    this.getItemContainerInlistById(id)
      .find(`[class="Tags"]`)
      .last();

  getHiddenStandards = id =>
    this.getItemContainerInlistById(id)
      .find(".ant-dropdown-trigger")
      .trigger("mouseover")
      .then(() => cy.wait(1000));

  getAllItemsInListContainer = () => cy.get(".fr-view");

  getQuestionTypeById = id => this.getItemContainerInlistById(id).find('[data-cy="ques-type"]');

  getAuthorById = id => this.getItemContainerInlistById(id).find('[data-cy="detail_index-1"]');

  getItemIdById = id => this.getItemContainerInlistById(id).find('[data-cy="detail_index-2"]');

  getItemDOKIById = id => this.getItemContainerInlistById(id).find('[data-cy="detail_index-0"]');

  getAddButtonById = id =>
    this.getViewItemById(id)
      .parent()
      .next();

  getViewItemById = id =>
    this.getItemById(id)
      .find("button")
      .contains("VIEW");

  getItemById = id => cy.get(`[data-cy=${id}]`);

  getTotalNoOfItemsInUI = () => cy.get('[class^="styled__PaginationInfo"]');

  getEditButtonOnPreview = () => this.itemPreview.getEditOnPreview();

  getCloneButtonOnPreview = () => this.itemPreview.getCopyOnPreview();

  getItemIdByURL = () => cy.url().then(url => url.split("/").reverse()[1]);

  getCreateNewItem = () => cy.get('[data-cy="createNew"]').should("be.visible");

  // *** ELEMENTS END ***
  // *** ACTIONS START ***

  clickOnCreate = () => {
    // cy.server();
    // cy.route("POST", "**/testitem").as("saveItem");
    //  cy.route("GET", "**/testitem/**").as("reload");

    this.getCreateNewItem().click();

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

  closePreiview = () => cy.get(".ant-modal-close-icon").click({ force: true });

  clickOnViewItemById = (id, text) => {
    cy.wait(1000);
    this.getViewItemById(id, text).click({ force: true });
  };

  clickOnItemText = () => {
    cy.wait(1000);
    cy.get(".fr-view")
      .find("a")
      .click();
  };

  addItemById = id => this.getAddButtonById(id).click({ force: true });

  // *** ACTIONS END ***
  // *** APPHELPERS START ***

  createItem = (itemKey, queIndex = 0, publish = true) => {
    const editItem = new EditItemPage();
    const metadataPage = new MetadataPage();
    if (publish) this.sidebar.clickOnDashboard();
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
          case queTypes.ESSAY_RICH:
            question = new EssayRichTextPage();
            break;
          case queTypes.MATH_NUMERIC:
            question = new MathFractionPage();
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
          if (questionJson.meta.collections) metadataPage.setCollection(questionJson.meta.collections);
          if (questionJson.meta.dok) metadataPage.setDOK(questionJson.meta.dok);
          if (questionJson.meta.tags)
            questionJson.meta.tags.forEach(tag => {
              metadataPage.setTag(tag);
            });
          if (questionJson.meta.difficulty) metadataPage.setDifficulty(questionJson.meta.difficulty);
          metadataPage.header.edit();
        }

        editItem.header.save(!publish);
        if (publish) return editItem.header.clickOnPublishItem();
      }
    });
  };

  verifyPresenceOfItemById = id => {
    this.getViewItemById(id).should("exist");
  };

  verifyAbsenceOfitemById = id => {
    this.getViewItemById(id).should("not.exist");
  };

  verifyShowCheckAnsOnPreview = (questype, attempt, attemptType, showans) =>
    this.testReviewTab.verifyQuestionResponseCard(questype, attempt, attemptType, showans);

  verifyNoOfQuestionsInUI = count => this.getTotalNoOfItemsInUI().should("have.text", `${count} Items Found`);

  verifyNoOfItemsInContainer = count => this.getAllItemsInListContainer().should("have.length", count);

  verifyContentById = (id, content) =>
    this.getItemContainerInlistById(id)
      .find("span")
      .contains(content);

  verifyTotalPagesAndTotalQuestions = () =>
    this.searchFilters.getTotalNoOfItemsInBank().then(count =>
      this.getTotalNoOfItemsInUI()
        .invoke("text")
        .then(txt => {
          expect(parseInt(txt, 10)).to.be.greaterThan(count - 25);
          expect(parseInt(txt, 10)).to.be.lessThan(count + 25);
        })
    );

  verifyQuestionTypeById = (id, type) => {
    const qType = this.mapQueTypeKeyToUITextInItemCard(type);
    this.getQuestionTypeById(id).should("have.text", qType);
  };

  verifyItemIdById = id => this.getItemIdById(id).should("contain", CypressHelper.getShortId(id));

  verifyAuthorById = (id, author) => this.getAuthorById(id).should("have.text", author);

  verifydokByItemId = (id, dok) => this.getItemDOKIById(id).should("contain", dok);

  mapQueTypeKeyToUITextInItemCard = key => {
    let qType;
    switch (key) {
      case queTypes.MULTIPLE_CHOICE_MULTIPLE:
        qType = "Multiple choice - multiple response";
        break;
      case queTypes.ESSAY_RICH:
        qType = "Essay with rich text";
        break;
      case queTypes.CLOZE_DROP_DOWN:
        qType = "Cloze with Drop Down";
        break;
      case queTypes.CLOZE_DRAG_DROP:
        qType = "Cloze with Drag & Drop";
        break;
      default:
        assert.fail(1, 2, "failed to match que type key in question card");
        break;
    }
    return qType;
  };

  mapQueTypeKeyToUITextInDropDown = key => {
    let qType;
    switch (key) {
      case queTypes.MULTIPLE_CHOICE_MULTIPLE:
        qType = "Multiple Choice";
        break;
      case queTypes.ESSAY_RICH:
        qType = "Essay Rich Text";
        break;
      case queTypes.CLOZE_DROP_DOWN:
        qType = "Cloze Drop Down";
        break;
      case queTypes.CLOZE_DRAG_DROP:
        qType = "Cloze Drag Drop";
        break;
      default:
        assert.fail(1, 2, "failed to match que type key in question drop down");
        break;
    }
    return qType;
  };

  getItemIdByIndex = index =>
    this.getAllItemsInListContainer()
      .eq(index)
      .invoke("attr", "data-cy");

  showAllStandardsOnItemCardById = id =>
    this.getItemContainerInlistById(id).then($ele => {
      if ($ele.find(".ant-dropdown-trigger").length === 1) this.getHiddenStandards(id);
    });

  verifyQuestionTypeAllItemsInCurrentPage = qType => {
    const queType = this.mapQueTypeKeyToUITextInItemCard(qType);
    this.getAllItemsInListContainer().each($ele => {
      cy.wrap($ele)
        .find('[data-cy="ques-type"]')
        .should("have.text", queType);
    });
  };

  verifyStandardOfAllItemsInCurrentPage = standard => {
    this.getAllItemsInListContainer().each($ele => {
      if ($ele.find(".ant-dropdown-trigger").length === 1) {
        cy.wrap($ele)
          .find(".ant-dropdown-trigger")
          .trigger("mouseover");
        cy.wait(1000);
      }
      cy.wrap($ele)
        .find("span")
        .contains(standard);
    });
  };

  verifyDokOfAllItemsInCurrentPage = dok => {
    this.getAllItemsInListContainer().each($ele => {
      cy.wrap($ele)
        .find('[data-cy="detail_index-0"]')
        .contains(dok);
    });
  };
  // *** APPHELPERS END ***
}

export default ItemListPage;
