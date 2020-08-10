import EditToolBar from "../common/editToolBar";
import Header from "../../itemDetail/header";
import { queColor } from "../../../../constants/questionTypes";

class LabelImageStandardPage {
  constructor() {
    this.orientationOption = {
      Horizontal: "horizontal",
      Vertical: "vertical"
    };

    this.styleOptions = {
      Standard: "standard",
      Block: "block",
      "Radio Button Below": "radioBelow"
    };

    this.labelOption = {
      Numerical: "number",
      "Uppercase alphabet": "upper-alpha",
      "Lowercase alphabet": "lower-alpha"
    };

    this.fontSizeOption = {
      Small: "small",
      Normal: "normal",
      Large: "large",
      "Extra Large": "xlarge",
      Huge: "xxlarge"
    };

    this.scoringTypeOption = {
      "Exact match": "exactMatch",
      "Partial match": "partialMatch"
    };

    this.formates = [
      {
        sel: ".ql-bold",
        tag: "strong"
      },
      {
        sel: ".ql-italic",
        tag: "em"
      },
      {
        sel: ".ql-underline",
        tag: "u"
      },
      {
        sel: ".ql-strike",
        tag: "s"
      },
      {
        sel: '[value="sub"]',
        tag: "sub"
      },
      {
        sel: '[value="super"]',
        tag: "sup"
      },
      {
        sel: '[value="1"]',
        tag: "h1"
      },
      {
        sel: '[value="2"]',
        tag: "h2"
      },
      {
        sel: ".ql-blockquote",
        tag: "blockquote"
      },
      {
        sel: ".ql-code-block",
        tag: "pre"
      }
    ];

    this.editToolBar = new EditToolBar();
    this.header = new Header();
    this.roundingType = { "Round down": "roundDown", None: "none" };
  }

  // get current question from Store

  getCurrentStoreQuestion = () => {
    const storeValue = JSON.parse(window.localStorage.getItem("persist:root")).question;
    return JSON.parse(storeValue).entity.data;
  };

  // question content
  getQuestionEditor = () => cy.get('[data-placeholder="[This is the stem.]"');

  addImageOnEditor(base64Data) {
    cy.document().then(doc => {
      // work with document element
      const elem = doc.createElement("img");
      elem.setAttribute("src", `data:image/jpeg;base64,${base64Data}`);
      const qlEditor = doc.getElementsByClassName("ql-editor")[0].getElementsByTagName("p");
      qlEditor[0].appendChild(elem);
    });
    return this;
  }

  checkImageOnEditor() {
    return this.getQuestionEditor()
      .get("img")
      .should("be.visible");
  }

  // upload image

  getDropZoneImageContainer = () => this.getDragDropImagePanel().find('[class^="PreviewImage"]');

  changeImageWidth(width) {
    cy.get('[data-cy="image-width-input"]')
      .click()
      .clear()
      .type(width)
      .should("have.value", width);
    return this;
  }

  changeImageHeight(height) {
    cy.get('[data-cy="image-height-input"]')
      .click()
      .clear()
      .type(height)
      .should("have.value", height);
    return this;
  }

  changeImagePositionTop(top) {
    cy.get('[data-cy="image-top-input"]')
      .click()
      .clear()
      .type(top)
      .should("have.value", top);
    return this;
  }

  changeImagePositionLeft(left) {
    cy.get('[data-cy="image-left-input"]')
      .click()
      .clear()
      .type(left)
      .should("have.value", left);
    return this;
  }

  getImageInPreviewContainer = () => cy.get('[data-cy="imageInpreviewContainer"]');

  getDragDropImagePanel = () => cy.get('[data-cy="drag-drop-image-panel"]');

  getImageWidth = () => this.getDragDropImagePanel().find('[class^="PreviewImage"]');

  getImageHeight = () => this.getDragDropImagePanel().find('[class^="PreviewImage"]');

  // image alternate

  inputImageAlternate(text) {
    cy.get('[data-cy="image-alternate-input"]')
      .click()
      .clear()
      .type(text)
      .should("have.value", text);
    return this;
  }

  checkImageAlternate(text) {
    this.getDragDropImagePanel()
      .find("img")
      .should("have.attr", "alt", text);
    return this;
  }

  // color picker

  updateColorPicker(color) {
    cy.get('[data-cy="image-text-box-color-picker"]')
      .click()
      .then(() => {
        cy.get('input[spellcheck="false"]')
          .type(`{selectall}${color}`)
          .should("have.value", color);
        cy.get("body").click();
      });
    return this;
  }

  getAllInputPanel = () => this.getDragDropImagePanel().find('[data-cy="drag-input"]');

  // max response

  getMaxResponseInput = () => cy.get('[data-cy="drag-drop-image-max-res"]');

  // dashboard border

  getDashboardBorderCheck = () => cy.get('[data-cy="drag-drop-image-dashboard-check"]').closest("label");

  // edit ARIA labels

  getAriaLabelCheck = () =>
    cy
      .get('[data-cy="drag-drop-image-aria-check"]')
      .closest("label")
      .should("be.visible");

  // dropArea border

  getShowDropAreaCheck = () => cy.get('[data-cy="drag-drop-image-border-check"]').closest("label");

  // choices
  getChoiceByIndex = index => this.getAllChoices().eq(index);

  deleteChoiceByIndex = index => {
    const selector = `[data-cy=deleteprefix${index}]`;
    cy.get(selector).click();
    return this;
  };

  getAllChoices = () => cy.get('[data-cy="possibleResponses"]').find('[data-cy="quillSortableItem"]');

  deleteAllChoices = () => {
    this.getAllChoices()
      .each(($el, index, $list) => {
        const cusIndex = $list.length - (index + 1);
        this.deleteChoiceByIndex(cusIndex);
      })
      .should("have.length", 0);
  };

  getAnswerBoxInPreviewByIndex = index => cy.get('[data-cy="drag-item"]').eq(index);

  getEditChoiceByindex = index => this.getChoiceByIndex(index).find("p");

  clickOnKeepAspectRation = () => cy.get('[data-cy="keep-aspect-ratio"]').click({ force: true });

  updateChoiceByIndex = (index, ch) => {
    this.getChoiceByIndex(index).type(`{selectall}${ch}`);
    cy.get("body").click();
  };

  addNewChoice() {
    cy.get('[data-cy="add-new-ch"]')
      .first()
      .should("be.visible")
      .click();
    return this;
  }

  getAddedAnsByindex = index =>
    cy
      .get('[data-cy="responses-box"]')
      .find('[data-cy="drag-item"]')
      .eq(index);

  checkAddedAnswers = (index, text) => this.getAddedAnsByindex(index).should("contain.text", text);

  getPointsEditor = () => cy.get('[data-cy="points"]');

  updatePoints = points => this.getPointsEditor().type(`{selectall}${points}`);

  getCorrectAnsOptions = () =>
    cy
      .contains("div", "Set Correct Answer(s)")
      .next()
      .children()
      .contains("label");

  addAlternate() {
    cy.get('[data-cy="alternate"]').click();
    return this;
  }

  switchOnAlternateAnswer = () => {
    cy.get('[data-cy="tabs"]')
      .find("span")
      .contains("Alternate")
      .click();
    return this;
  };

  // advance options
  clickOnAdvancedOptions = () =>
    cy.get('[class^="AdvancedOptionsLink"]').then(ele => {
      if (ele.siblings().length === 3) cy.wrap(ele).click();
    });

  checkAndDeleteAlternates = () =>
    cy
      .get('[data-cy="tabs"]')
      .contains("Alternate")
      .should("be.visible")
      .next()
      .children()
      .first()
      .click()
      .should("not.exist");

  getResponsesBox = () =>
    cy
      .get('[data-cy="responses-box"]')
      .scrollIntoView()
      .find(".draggable_box")
      .children()
      .should("be.visible");

  getResponsesBoxTransparent = () =>
    cy
      .get('[data-cy="responses-box"]')
      .find(".draggable_box_transparent")
      .children();

  getResponsesBoard = () => cy.get('[data-cy="responses-box"]').find('[data-cy="drag-item"]');

  getResponsesBoardContainer = Index => cy.get(`#drop-container-${Index}`);

  getDropDownContainerInPreview = Index => cy.get(`[data-cy="checkAnswer"]`).eq(Index);

  getPointers = () => cy.get('[data-cy="pointers"]');

  getAddAnnotationButton = () => cy.get('[data-cy="addAnnotation"]');

  getAnnotationTextArea = () => cy.get('[data-cy="annotations-container"]').find('[contenteditable="true"]');

  VerifyAnnotation = value =>
    cy
      .get('[data-cy="annotation"]')
      .find('[data-cy="styled-wrapped-component"]')
      .should("contain.text", value);

  VerifyAnswerBoxColorByIndex = (index, attempt) => {
    if (attempt == "correct") {
      this.getResponsesBoardContainer(index)
        .find(`div`)
        .first()
        .should("have.css", "background-color", queColor.LIGHT_GREEN);
    } else if (attempt == "wrong") {
      this.getResponsesBoardContainer(index)
        .find(`div`)
        .first()
        .should("have.css", "background-color", queColor.LIGHT_RED);
    }
  };

  verifyDropDownColorByIndexInPreview = (index, attempt) => {
    this.getDropDownContainerInPreview(index).should("have.css", "background-color"
      , attempt === "correct" ? queColor.LIGHT_GREEN : queColor.LIGHT_RED);
  };

  selectPointerStyle = value => {
    this.getPointers()
      .click({ force: true })
      .then(() => {
        cy.wait(500);
        cy.get('[class^="ant-select-dropdown"]')
          .should("contain.text", value)
          .click({ force: true });
      });
  };

  verifyShowDashborder = value => {
    this.getAllInputPanel().each($el => {
      cy.wrap($el).should("have.css", "border", value);
    });
  };

  dragAndDropResponseToBoard(toIndex) {
    this.getResponsesBox()
      .first()
      .customDragDrop(`#drop-container-${toIndex}`);
    return this;
  }

  verifyDropContainerIsVisible = (index, isAvailable = true) => {
    if (!isAvailable) {
      this.getResponsesBoardContainer(index).should("not.be.visible");
    } else {
      this.getResponsesBoardContainer(index).should("be.visible");
    }
  };

  verifyDropContainerBorderVisible = (index, isAvailable = true) => {
    if (!isAvailable) {
      // No border
      this.getResponsesBoardContainer(index).should("have.css", "border", "0px none rgb(68, 68, 68)");
    } else {
      this.getResponsesBoardContainer(index).should("have.css", "border", "1px solid rgb(185, 185, 185)");
    }
  };

  verifyFillColor = value => {
    this.getAllInputPanel().each($el => {
      cy.wrap($el).should("have.attr", "background", value);
    });
  };

  verifyItemsInBoard(value, Index, isPresent = true) {
    if (isPresent) {
      this.getResponsesBoardContainer(Index).should("contain.text", value);
    } else {
      this.getResponsesBoardContainer(Index).should("not.contain.text", value);
    }
  }

  selectRoundingType(option) {
    const selectOp = `[data-cy="${this.roundingType[option]}"]`;
    cy.get('[data-cy="rounding"]').click();
    cy.get(selectOp)
      .should("be.visible")
      .click();
    cy.get('[data-cy="rounding"]')
      .find(".ant-select-selection-selected-value")
      .should("contain", option);
    return this;
  }

  dragAndDropBoardToBoard(fromIndex, toIndex) {
    cy.get(`#drop-container-${fromIndex}`).customDragDrop(`#drop-container-${toIndex}`);
    return this;
  }

  getMultipleResponse = () => cy.get('[data-cy="multi-check"]');

  getDragHandle = () => cy.get('[data-cy="drag-check"]');

  getShuffleResponse = () => cy.get('[data-cy="shuffle-check"]');

  getShuffleDropDown = () => cy.get('[data-cy="shuffle-options"]');

  getTransparentResponse = () => cy.get('[data-cy="transparent-check"]');

  // Label Image Drop Down

  addNewChoiceOnResponse(resIndex) {
    const selector = `[data-cy=add-new-ch-res-${resIndex}]`;
    cy.get(selector).click();
    return this;
  }

  getChoiceByIndexRes = (resIndex, choiceIndex) => {
    const selector = `[data-cy="choice-response-container_${resIndex}"]`;
    return cy
      .get(selector)
      .find(`[data-cy="choice_prefix_${choiceIndex}"]`)
      .find("input");
  };

  getAllChoicesRes = resIndex =>
    cy.get(`[data-cy="choice-response-container_${resIndex}"]>div`).then($element => {
      if ($element.find(".sortable-item-container").length > 0)
        return cy.wrap($element.find(".sortable-item-container"));
      return [];
    });

  deleteChoiceIndexRes = (resIndex, choiceIndex) => {
    const selector = `[data-cy="choice-response-container_${resIndex}"]`;
    return cy
      .get(selector)
      .find(`[data-cy=choice_prefix_${choiceIndex}]`)
      .find("svg")
      .click();
  };

  checkAddedAnswersRes(resIndex, value) {
    const selector = `[data-cy="dropdown-res-${resIndex}"]`;
    cy.get(selector)
      .should("be.visible")
      .click();

    cy.contains("li", value);
    return this;
  }

  getDropDownByRes = resIndex => {
    const selector = `[data-cy="dropdown-res-${resIndex}"]`;
    return cy.get(selector);
  };

  getDropDownMenuItem = (resIndex, itemIndex) => {
    const selector = `[data-cy=dropdown-res-item-${resIndex}-${itemIndex}]`;
    return cy.get(selector);
  };

  checkShuffled = (resIndex, content) => {
    const selector = `[data-cy=dropdown-res-item-${resIndex}-0]`;
    return cy
      .get(selector)
      .parent()
      .children()
      .contains("li", content);
  };

  setAnswerOnBoard(resIndex, itemIndex) {
    this.getDropDownByRes(resIndex).click();

    this.getDropDownMenuItem(resIndex, itemIndex).click();
  }

  // Text Page

  getAnswersFieldOnTextPage = () => {
    const selector = `[data-cy="image-text-answer-board"]`;
    return cy.get(selector).find("input");
  };

  getShuffleTextImage = () => cy.get('[data-cy="multi"]').should("be.visible");
}

export default LabelImageStandardPage;
